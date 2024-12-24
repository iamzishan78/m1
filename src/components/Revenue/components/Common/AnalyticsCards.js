import { useLazyQuery } from '@apollo/client';
import { Grid, Card, CardContent, Typography, CircularProgress, IconButton } from '@material-ui/core';
import { Warning as WarningIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

import FilterIcon from 'components/Common/SvgIcons/Filter';

import { GET_DB_AGGS } from 'graphQL/useQueryDbQuery';

const useStyles = makeStyles(() => ({
	root: {
		padding: '0px 20px',
		width: '100%',
		margin: 0,
		backgroundColor: '#fff',
	},
	card: {
		borderRadius: '8px',

		'&.active': {
			border: '1px solid #000',
		},

		'& .filterButton': {
			display: 'none',
			transition: '0.2s ease-in-out',
		},

		'&:hover .filterButton, & .filterButton.active': {
			display: 'inline-block',
		},
	},
	cardHeaderTypography: {
		display: 'flex',
		alignItems: 'center',
		gap: '10px',
		fontWeight: 'bolder',
		marginBottom: '25px',
	},
	cardNumberTypography: {
		fontWeight: 900,
		fontSize: 'xx-large',
	},
	filterIcon: {
		color: 'grey',
		cursor: 'pointer',
		height: '100%',
		width: '100%',
	},
	cardContent: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: '160px',
		textAlign: 'left',
	},
	issuesBadges: {
		display: 'flex',
		alignItems: 'center',
		color: 'red',
		height: '20px',
	},

	filterButton: {
		padding: 5,
		'& .MuiIconButton-label': {
			height: 24,
			width: 24,
		},
		'& svg': {
			flex: 1,
		},
		'& .filter-alt': {
			display: 'none',
		},
		'&.active .filter-alt': {
			display: 'block',
		},
		'&.active .filter-outlined': {
			display: 'none',
		},
		'&:hover .filter-alt': {
			display: 'inline-block',
		},
		'&:hover .filter-outlined': {
			display: 'none',
		},
	},
}));

export default function AnalyticsCards({
	esIndex,
	esFilters,
	totalCount,
	cardsDefault,
	landSearchQuery,
	unmappedPropertyCount = 0,
	setESFilters,
	setFilterToggle,
	filterToggle,
}) {
	const classes = useStyles();
	const [isFiltered, setFiltered] = useState([]);
	const [cards, setCards] = useState(cardsDefault);

	const aggsKey = useRef(null);

	useEffect(() => {
		const filterInfo = {
			unmapped: {
				field: 'wells._id',
				value: null,
			},
			inpay: {
				field: 'status.keyword',
				value: 'InPay',
			},
			notinpay: {
				field: 'status.keyword',
				value: 'NotInPay',
			},
		};

		const filters = [];

		isFiltered.forEach(filterKey => {
			const filter = filterInfo[filterKey];
			if (filter && !filters.some(f => f.field === filter.field && f.value === filter.value)) {
				filters.push(filter);
			}
		});

		setESFilters(filters);
		setFilterToggle(!filterToggle);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFiltered]);

	const setCardPoint = (count, index) => {
		const newCards = JSON.parse(JSON.stringify(cards));
		newCards[index].points = count;
		setCards(newCards);
	};

	const addDays = (str, days) => {
		var myDate = new Date(str);
		myDate.setDate(myDate.getDate() + parseInt(days));
		return myDate.toISOString();
	};

	const [getAggsActiveCount, { loading: activeCountLoading }] = useLazyQuery(GET_DB_AGGS, {
		context: { batch: true },
		fetchPolicy: 'no-cache',
		onCompleted: aggsData => {
			const aggs = get(aggsData, 'getDbAggs.aggregations.aggs');

			const currentAgg = aggs.find(agg => agg._id === aggsKey.current);

			let count = currentAgg?.count || 0;

			cards[1].points = count;
			cards[2].points = totalCount - count;
			setCards(cards);
		},
	});

	const [getAggsApprovedCount, { loading: approvedCountLoading }] = useLazyQuery(GET_DB_AGGS, {
		context: { batch: true },
		fetchPolicy: 'no-cache',
		onCompleted: aggsData => {
			const approvedCount = get(aggsData, 'getDbAggs.aggregations.approvedCount') || [];

			const inPayCounts = approvedCount.find(a => a.status === 'InPay')?.count || 0;
			const notInPayCounts = approvedCount.find(a => a.status === 'NotInPay')?.count || 0;
			const apprrovedCount = approvedCount.find(a => a.status?.toLowerCase?.() === 'approved')?.count || 0;
			// const otherCounts = approvedCount.find(a => !a.status)?.count || 0;

			setCardPoint(totalCount - apprrovedCount, 3);

			if (esIndex === 'properties_flat') {
				cards[1].points = inPayCounts;
				cards[2].points = notInPayCounts;
				cards[3].points = unmappedPropertyCount;
				setCards(cards);
			}
		},
	});

	const propertiesAnalytics = () => {
		aggsKey.current = `${addDays(new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(), 1)}`;

		getAggsActiveCount({
			variables: {
				index: esIndex,
				search: { query: landSearchQuery ? `${landSearchQuery}*` : '' },
				filters: esFilters.filter(appliedFilter => !appliedFilter.field === 'wells._id'),
				aggs: {
					aggs: {
						range: {
							field: 'lastCheck.checkDate',
							ranges: [{ from: aggsKey.current }],
						},
					},
				},
			},
		});
		getAggsApprovedCount({
			variables: {
				index: esIndex,
				search: { query: landSearchQuery ? `${landSearchQuery}*` : '' },
				filters: esFilters,
				aggs: {
					approvedCount: {
						terms: { field: 'status.keyword' },
					},
				},
			},
		});
	};

	useEffect(() => {
		setCardPoint(totalCount, 0);
		if (totalCount > 0) {
			propertiesAnalytics();
		} else {
			setCards(cardsDefault);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalCount]);

	const handleFilterClick = key => {
		if (key === 'inpay' || key === 'notinpay') {
			let filteredArray = [...isFiltered];

			// Check if the clicked key already exists in the array
			const keyIndex = filteredArray.indexOf(key);

			if (keyIndex !== -1) {
				// If the clicked key already exists, remove it from the array
				filteredArray.splice(keyIndex, 1);
			} else {
				// Remove "inpay" or "notinpay" from the array if they exist
				filteredArray = filteredArray.filter(item => item !== 'inpay' && item !== 'notinpay');
				// Add the clicked key to the array
				filteredArray.push(key);
			}

			setFiltered(filteredArray);
		} else if (key === 'unmapped') {
			if (isFiltered.includes('unmapped')) {
				// Remove "unmapped" from the array if it already exists
				const filteredArray = isFiltered.filter(item => item !== 'unmapped');
				setFiltered(filteredArray);
			} else {
				// Add "unmapped" to the array
				setFiltered([...isFiltered, 'unmapped']);
			}
		} else {
			// Clear the array
			setFiltered([]);
		}
	};

	return (
		<Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
			{cards &&
				cards.map((card, index) => (
					<Grid item md={3}>
						<Card variant="outlined" className={[classes.card, isFiltered.includes(card.key) ? 'active' : '']}>
							<CardContent className={classes.cardContent}>
								<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
									{card.heading}
									{card.filterable && (
										<IconButton
											className={[classes.filterButton, 'filterButton', isFiltered.includes(card.key) ? 'active' : '']}
											key={card.key}
											onClick={() => handleFilterClick(card.key)}
										>
											<FilterIcon className={'filter-alt'} />
											<FilterIcon variant="outlined" className="filter-outlined" />
										</IconButton>
									)}
								</Typography>
								{card.type === 'error' && (
									<div className={classes.issuesBadges}>
										<div>
											<WarningIcon />
										</div>{' '}
										<div>3</div>
										&nbsp;
										<div>
											<WarningIcon />
										</div>
										<div>4</div>
										&nbsp;
										<div>
											<WarningIcon />
										</div>{' '}
										<div>1</div>
									</div>
								)}
								{activeCountLoading || approvedCountLoading ? (
									<CircularProgress size={40} color="secondary" />
								) : (
									<Typography
										variant="h6"
										component="div"
										className={classes.cardNumberTypography}
										style={{ color: card.type === 'warning' ? '#b9b908' : '' }}
									>
										{card.points}
									</Typography>
								)}
							</CardContent>
						</Card>
					</Grid>
				))}
		</Grid>
	);
}
