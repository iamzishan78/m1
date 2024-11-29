import React, { useEffect, useState, memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Card, CardContent, Typography, IconButton } from '@material-ui/core';
import { useLazyQuery } from '@apollo/client';
import FilterIcon from 'components/Common/SvgIcons/Filter';
import { copy } from 'components/Shared/functions';
import { vf_currency_dollar } from 'components/Shared/valueformatters/vf_currency';
import { tableController } from 'hookstate/tableController';
import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';
import { GET_ES_AGGS_LIST } from 'graphQL/useQueryESAggsList';

const useStyles = makeStyles(() => ({
	root: {
		padding: '0px 20px',
		width: '100%',
		margin: 0,
		backgroundColor: '#fff',
	},
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
		color: '#ff0000',
		height: '20px',
	},
	tooltip: {
		position: 'absolute',
		top: 72,
		color: 'rgb(255, 0, 0)',
		width: 200,
		left: -148,
	},
	tooltipText: {
		fontSize: 14,
		lineHeight: '120%',
		textAlign: 'left',
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

function AnalyticsCards(props) {
	const classes = useStyles();
	const [isFiltered, setFiltered] = useState(null);
	const [propertyNumbers, setPropertyNumbers] = useState(0);
	const [checkNumbers, setCheckNumbers] = useState(0);
	const [misMatchedInterestsCount, setMisMatchedInterestsCount] = useState(0);
	const [sumPotentialGainLoss, setSumPotentialGainLoss] = useState(0);

	const tableState = tableController(props.esIndex).useState([
		'filters',
		'data',
		'globalFilter',
		'searchFields',
		'advanceSearch',
	]);
	const tableStateValues = tableState.stateValues;
	const globalFilter = tableStateValues.globalFilter;
	const searchQuery = globalFilter ? `${globalFilter}` : '';
	const searchFields = tableStateValues.searchFields;

	// const [getESSimpleFilter] = useLazyQuery(GET_ES_SIMPLE_FILTER, {
	//   fetchPolicy: 'no-cache',
	// });

	const [getPropertyNumbers] = useLazyQuery(GET_ES_SIMPLE_FILTER, {
		fetchPolicy: 'no-cache',
	});

	const [getCheckNumbers] = useLazyQuery(GET_ES_SIMPLE_FILTER, {
		fetchPolicy: 'no-cache',
	});

	const [getCardsCount] = useLazyQuery(GET_ES_AGGS_LIST, {
		fetchPolicy: 'no-cache',
	});

	const getRevenueComparisonAnalytics = async () => {
		const propertiesPromise = new Promise((resolve, reject) => {
			getPropertyNumbers({
				variables: {
					index: 'checkdetailsinterestscomparison_flat',
					search: {
						query: searchQuery,
						fields: searchFields,
						advanceSearch: tableStateValues.advanceSearch,
					},
					filters: [...(tableStateValues?.filters || [])],
					filterKey: 'property._id.keyword',
					filterAggs: { query: '', field: 'property._id.keyword', size: tableStateValues?.data?.total || 0 },
					isElasticQuery: false,
				},
				onCompleted: res => resolve(res?.getESSimpleFilter?.hits?.length),
				onError: error => reject(error),
			});
		});

		const checkNumbersPromise = new Promise((resolve, reject) => {
			getCheckNumbers({
				variables: {
					index: 'checkdetailsinterestscomparison_flat',
					search: {
						query: searchQuery,
						fields: searchFields,
						advanceSearch: tableStateValues.advanceSearch,
					},
					filters: [...(tableStateValues?.filters || []), { field: 'IsDeleted', value: false, type: 'term' }],
					filterKey: 'check.checkNumber.keyword',
					filterAggs: { query: '', field: 'check.checkNumber.keyword', size: tableStateValues?.data?.total || 0 },
					isElasticQuery: false,
				},
				onCompleted: res => resolve(res?.getESSimpleFilter?.hits),
				onError: error => reject(error),
			});
		});

		const otherSummaryPromise = new Promise((resolve, reject) => {
			getCardsCount({
				variables: {
					esIndex: 'checkdetailsinterestscomparison_flat',
					filters: [...(tableStateValues?.filters || [])],
					search: {
						query: searchQuery,
						fields: searchFields,
						advanceSearch: tableStateValues.advanceSearch,
					},
					aggs: {
						sumPotentialGainLoss: {
							sum: {
								field: 'potentialGainLoss',
							},
						},
						sumMisMatchedInterest: {
							sum: {
								field: 'isMisMatchedInterest',
							},
						},
					},
					isElasticQuery: false,
				},
				onCompleted: res => resolve(res?.getESAggsList?.aggregations),
				onError: error => reject(error),
			});
		});

		const [propertiesCount, revenueComparisonAnalytics, checkNumbersHits] = await Promise.all([
			propertiesPromise,
			otherSummaryPromise,
			checkNumbersPromise,
		]);
		return { propertiesCount, revenueComparisonAnalytics, checkNumbersHits };
	};

	useEffect(() => {
		if (!tableStateValues?.data?.total) return;
		(async () => {
			const { propertiesCount, revenueComparisonAnalytics, checkNumbersHits } = await getRevenueComparisonAnalytics();
			setPropertyNumbers(propertiesCount || 0);
			setCheckNumbers(checkNumbersHits?.length || 0);
			setMisMatchedInterestsCount(revenueComparisonAnalytics?.sumMisMatchedInterest || 0);
			setSumPotentialGainLoss(revenueComparisonAnalytics?.sumPotentialGainLoss || 0);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableState?.filters, tableState?.data?.total]);

	useEffect(() => {
		let filters = copy(props.esFilters);
		filters = filters.filter((filter, index) => filter.field !== 'isMisMatchedInterest');
		if (isFiltered)
			filters.push({
				field: 'isMisMatchedInterest',
				value: true,
				type: 'term',
			});
		props.setESFilters(filters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFiltered]);

	return (
		<Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
			<Grid item md={3}>
				<Card variant="outlined" className={classes.card}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
							Total Properties
						</Typography>
						<Typography variant="h6" component="div" className={classes.cardNumberTypography}>
							{propertyNumbers}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid item md={3}>
				<Card variant="outlined" className={classes.card}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
							Total Checks
						</Typography>
						<Typography variant="h6" component="div" className={classes.cardNumberTypography}>
							{checkNumbers}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid item md={3}>
				<Card variant="outlined" className={classes.card}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
							Mismatched Interests
							<IconButton
								className={[
									classes.filterButton,
									'filterButton',
									(isFiltered === 'misMatchedInterests' && 'active') || '',
								]}
								onClick={() => {
									setFiltered(isFiltered === 'misMatchedInterests' ? '' : 'misMatchedInterests');
								}}
							>
								<FilterIcon className="filter-alt" />
								<FilterIcon variant="outlined" className="filter-outlined" />
							</IconButton>
						</Typography>
						<Typography variant="h6" component="div" className={classes.cardNumberTypography} style={{ color: 'red' }}>
							{misMatchedInterestsCount}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid item md={3}>
				<Card variant="outlined" className={classes.card}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
							Potential Gain/Loss
						</Typography>
						<Typography variant="h6" component="div" className={classes.cardNumberTypography} style={{ color: 'red' }}>
							{vf_currency_dollar(sumPotentialGainLoss, 2)}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}

export default memo(AnalyticsCards);
