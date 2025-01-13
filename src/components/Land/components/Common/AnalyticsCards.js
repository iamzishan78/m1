import React, { useEffect, useMemo, useState } from 'react';

import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import { Warning as WarningIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import { useLazyQuery } from '@apollo/client';
import { get } from 'lodash';

import { GET_DB_AGGS } from 'graphQL/useQueryDbQuery';

export const useStyles = makeStyles(() => ({
	root: {},
	card: { borderRadius: '8px' },
	cardHeaderTypography: {
		fontWeight: 'bolder',
		marginBottom: '25px',
	},
	cardNumberTypography: {
		fontWeight: 900,
		fontSize: 'xx-large',
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
}));

export default function AnalyticsCards({
	parent,
	esIndex,
	esFilters,
	totalCount,
	cardsDefault,
	searchFields,
	searchQuery,
	advanceSearch,
}) {
	const classes = useStyles();
	const [cards, setCards] = useState(cardsDefault);

	const setCardPoint = (count, index) => {
		const newCards = JSON.parse(JSON.stringify(cards));
		newCards[index].heading = cardsDefault[index].heading;
		newCards[index].points = count;
		setCards(newCards);
	};

	// Function to format card points in K(thousand)
	const formCardPointValue = value => {
		if (!value) {
			return 0;
		}
		return (
			(Math.round((value + Number.EPSILON) * 100) / 100000).toLocaleString(undefined, { maximumFractionDigits: 1 }) +
			'K'
		);
	};

	const [getAggsGrossAcresSum] = useLazyQuery(GET_DB_AGGS, {
		context: { batch: true },
		fetchPolicy: 'no-cache',
		onCompleted: aggsData => {
			const grossAcresSum = formCardPointValue(get(aggsData, 'getDbAggs.aggregations.grossAcresSum[0].grossAcresSum'));
			setCardPoint(grossAcresSum, 1);
		},
	});

	const [getAggsNetAcresSum] = useLazyQuery(GET_DB_AGGS, {
		context: { batch: true },
		fetchPolicy: 'no-cache',
		onCompleted: aggsData => {
			const netAcresSum = formCardPointValue(get(aggsData, 'getDbAggs.aggregations.netAcresSum[0].netAcresSum', 0));
			setCardPoint(netAcresSum, 2);
		},
	});

	const [getAggsNetRoyaltyAcresSum] = useLazyQuery(GET_DB_AGGS, {
		context: { batch: true },
		fetchPolicy: 'no-cache',
		onCompleted: aggsData => {
			const netRoyaltyAcresSum = formCardPointValue(
				get(aggsData, 'getDbAggs.aggregations.netRoyaltyAcresSum[0].netRoyaltyAcresSum')
			);
			setCardPoint(netRoyaltyAcresSum, 3);
		},
	});

	const analyticsPayload = useMemo(() => {
		let aggsFilters = esFilters || [];
		let grossAcersObject, netAcersField, nraField;

		// Case when the Elasticsearch index is 'shapeowners_flat'
		if (esIndex === 'shapeowners_flat') {
			// Create a simple sum aggregation for 'grossAcres' in 'shapeowners_flat'
			grossAcersObject = {
				sum: {
					field: 'grossAcres',
				},
			};

			// Set the field names for 'net_acres' and 'nra' specific to 'shapeowners_flat'
			netAcersField = {
				sum: {
					field: 'net_acres',
				},
			};
			nraField = 'nra';
		} else if (esIndex === 'shapes_flat') {
			// Create a simple sum aggregation for 'sdGrossAcres' in 'shapes_flat'
			grossAcersObject = {
				sum: {
					field: 'shapeJson.properties.sdGrossAcres',
				},
			};

			// Create a simple sum aggregation for 'shapeJson.properties.ShapeArea' in 'shapes_flat'
			netAcersField = {
				isCustomAggregation: {
					$sum: {
						$cond: [
							{
								$and: [
									{ $ne: ['$shapeJson.properties.shapeArea', null] },
									{ $ne: ['$shapeJson.properties.shapeArea', ''] },
								],
							},
							{
								$toDouble: {
									$replaceAll: {
										input: {
											$toString: '$shapeJson.properties.shapeArea',
										},
										find: ',',
										replacement: '',
									},
								},
							},
							0,
						],
					},
				},
			};

			// Set the field names for 'nra' specific to 'shapes_flat'
			nraField = 'shapeJson.properties.netRoyalityAcres.calculatedNra';
		}

		return { aggsFilters, grossAcersObject, netAcersField, nraField };
	}, [esIndex, esFilters]);

	const tractsAnalytics = () => {
		getAggsGrossAcresSum({
			variables: {
				index: esIndex || 'shapeowners_flat',
				search: {
					query: searchQuery,
					fields: searchFields,
					advanceSearch,
				},
				// fields: searchFields,
				filters: analyticsPayload.aggsFilters,
				aggs: {
					grossAcresSum: analyticsPayload.grossAcersObject,
				},
			},
		});
		getAggsNetAcresSum({
			variables: {
				index: esIndex || 'shapeowners_flat',
				search: {
					query: searchQuery,
					fields: searchFields,
					advanceSearch,
				},
				// fields: searchFields,
				filters: analyticsPayload.aggsFilters,
				aggs: {
					netAcresSum: analyticsPayload.netAcersField,
				},
			},
		});
		getAggsNetRoyaltyAcresSum({
			variables: {
				index: esIndex || 'shapeowners_flat',
				search: {
					query: searchQuery,
					fields: searchFields,
					advanceSearch,
				},
				// fields: searchFields,
				filters: analyticsPayload.aggsFilters,
				aggs: {
					netRoyaltyAcresSum: {
						sum: {
							field: analyticsPayload.nraField,
						},
					},
				},
			},
		});
	};

	const getAggsCounts = () => {
		if (totalCount > 0) {
			if (parent === 'Tracts') {
				// Get tract analytics data
				tractsAnalytics();
			}
		}
	};

	useEffect(() => {
		setCardPoint(totalCount, 0);
		getAggsCounts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalCount, esFilters, searchQuery, searchFields, advanceSearch]);

	return (
		<Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
			{cards.map((card, index) => (
				<Grid item md={3} key={index}>
					<Card variant="outlined" className={classes.card}>
						<CardContent className={classes.cardContent}>
							<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
								{card.heading}
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
							<Typography
								variant="h6"
								component="div"
								className={classes.cardNumberTypography}
								style={{ color: card.type === 'warning' ? '#b9b908' : '' }}
							>
								{card.points}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>
	);
}
