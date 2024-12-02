import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useLazyQuery } from '@apollo/client';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Grid, Divider, Tab, Tabs, TextField, Box } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import sortBy from 'lodash/sortBy';

import { GET_ES_MIN_VALUE } from 'graphQL/useQueryESMinValue';
import { GET_PORTFOLIO_GROSS_REVENUE_SUMMARY } from 'graphQL/useQueryGetPortfolioGrossRevenueSummary';
import CustomDates from 'components/Revenue/components/Common/CustomDates';
import DetailTabsSection from 'components/Analytics/components/Revenue/DetailTabsSection';
import ReportGroupHeader from 'components/Shared/ReportGroupHeader';
import CheckDetailsSection from './CheckDetailsSection';
import AnalyticsCards from './Analytics';
import LastCheckDateFilter from 'components/Revenue/components/Common/LastCheckDateFilter';

import SalesVolumeComparisonSection from './SalesVolumeComparisonSection';
import MRTTable from 'components/MRTTable';
import { GET_CHECK_DETAILS_DATA } from 'graphQL/useQueryCheckDetailsData';
import { tableController } from 'hookstate/tableController';
import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';
import PurchasersDropdown from './PurchasersDropdown';
import AcquisitionIdDropdown from './AcquisitionIdDropdown';

const useStyles = makeStyles(theme => ({
	mainTabContainer: {
		display: 'flex',
		margin: '75px 0 10px',
	},
	actionBar: {
		backgroundColor: '#f7f7f7',
		width: '100%',
		minHeight: '65px',
	},
	actionsGrid: {
		'& .MuiButtonBase-root': {
			width: '149px',
			height: '35px',
			fontWeight: 'bold',
		},
	},
	divider: {
		height: '10px',
		backgroundColor: '#f3f3f3',
	},

	sectionCard: {
		'& div': {
			'&>.MuiPaper-root': {
				'&>:nth-child(3)': { minHeight: 'calc(100vh - 265px) !important', maxHeight: '35vh' },
			},
		},
	},

	revenueTableInfContainer: {
		paddingTop: theme.spacing(1),
		// paddingLeft: "38px",
		// paddingRight: "38px",
		marginLeft: '-8px',
	},
	viewSwitcher: {
		height: '40px',
		backgroundColor: 'white',
	},

	formControl: {
		width: '400px',
	},
}));

const StyledTabs = withStyles({
	root: {
		borderBottom: '0px solid #e8e8e8',
		textTransform: 'capitalize',
		padding: '0px 26px',
	},
	indicator: {
		backgroundColor: '#12abe0',
		height: '4px',
	},
})(Tabs);

const StyledTab = withStyles(theme => ({
	root: {
		textTransform: 'uppercase',
		minWidth: 72,
		fontWeight: theme.typography.fontWeightBold,
		marginRight: theme.spacing(4),
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:hover': {
			color: 'black',
			opacity: 1,
		},
		'&$selected': {
			color: 'black',
		},
		'&:focus': {
			color: 'black',
		},
	},
	selected: {},
}))(props => <Tab disableRipple {...props} />);

const tabs = ['Income Statement', 'Check Details', 'Revenue by Month', 'Comparisons', 'Property Interests'];

export default function RevenueAnalytics(props) {
	const classes = useStyles();
	const [TableKey, setTableKey] = useState('ComparisonTable'); // make the table key dynamic inorder to used for both table
	const [filterToggle, setFilterToggle] = React.useState(false);
	const propertiesReportGroup = useSelector(({ Revenue }) => Revenue.propertiesReportGroup);
	const [tab, setTab] = useState(0);
	const [fromDate, setFromDate] = React.useState(null);
	const [toDate, setToDate] = React.useState(null);
	const [monthsInterval, setMonths] = useState([]);
	const [checkDetailsData, setCheckDetailsData] = useState([]);
	const [lastCheckMinDate, setLastCheckMinDate] = useState('');
	const [propertyNumbers, setPropertyNumbers] = useState([]);
	const [checkNumbers, setCheckNumbers] = useState([]);
	const [comparisonReport, setComparisonReport] = useState('Check Detail Comparison');
	const [filters, setFilters] = useState([...(propertiesReportGroup || [])]);

	const comparisonTableState = tableController('ComparisonTable').useState(['filters', 'data']).stateValues; // get StateValues for ComparisonTable
	const salesVolumeComparisonTableState = tableController('SalesVolumeComparisonTable').useState([
		'filters',
		'data',
	]).stateValues; // get StateValues for SalesVolumeComparisonTable
	const [esFilters, setEsFilters] = useState(tableController('ComparisonTable').getExternalFilter());

	const loadMore = { type: 'infiniteScroll', height: 'calc(100vh - 166px)' };
	const [getESMinValue] = useLazyQuery(GET_ES_MIN_VALUE, {
		fetchPolicy: 'no-cache',
		onCompleted: data => {
			if (data?.getESMinValue) {
				setLastCheckMinDate(data?.getESMinValue);
			}
		},
	});

	const [getPortfolioSummary, { data: portfolioSummary, loading }] = useLazyQuery(GET_PORTFOLIO_GROSS_REVENUE_SUMMARY, {
		fetchPolicy: 'no-cache',
	});

	const [getCheckDetailData, { data: checkDetailData }] = useLazyQuery(GET_CHECK_DETAILS_DATA, {
		fetchPolicy: 'no-cache',
	});

	const [getCheckNumbers] = useLazyQuery(GET_ES_SIMPLE_FILTER, {
		fetchPolicy: 'no-cache',
	});

	const [getPropertyNumbers] = useLazyQuery(GET_ES_SIMPLE_FILTER, {
		fetchPolicy: 'no-cache',
	});

	const getPropertyOptions = async () => {
		const propertyNumbersPromise = new Promise((resolve, reject) => {
			getPropertyNumbers({
				variables: {
					index: 'checkdetailsinterestscomparison_flat',
					filters: [
						...(getTableStateValues()?.filters || []),
						{ field: 'property.IsDeleted', value: false, type: 'term' },
					],
					filterKey: 'property.number.keyword',
					filterAggs: { query: '', field: 'property.number.keyword', size: getTableStateValues()?.data?.total || 0 },
				},
				onCompleted: res => resolve(res?.getESSimpleFilter?.hits),
				onError: error => reject(error),
			});
		});

		const checkNumbersPromise = new Promise((resolve, reject) => {
			getCheckNumbers({
				variables: {
					index: 'checkdetailsinterestscomparison_flat',
					filters: [...(getTableStateValues()?.filters || []), { field: 'IsDeleted', value: false, type: 'term' }],
					filterKey: 'check.checkNumber.keyword',
					filterAggs: { query: '', field: 'check.checkNumber.keyword', size: getTableStateValues()?.data?.total || 0 },
				},
				onCompleted: res => resolve(res?.getESSimpleFilter?.hits),
				onError: error => reject(error),
			});
		});

		const [propertiesOptions, checkOptions] = await Promise.all([propertyNumbersPromise, checkNumbersPromise]);
		return { propertiesOptions, checkOptions };
	};

	useEffect(() => {
		if (
			(!comparisonTableState?.data?.total && comparisonReport === 'Check Detail Comparison') ||
			(!salesVolumeComparisonTableState?.data?.total && comparisonReport === 'Sales Volume vs Reported Production')
		)
			return;
		(async () => {
			const { propertiesOptions, checkOptions } = await getPropertyOptions();
			setPropertyNumbers(propertiesOptions?.map(hit => hit.key) || []);
			setCheckNumbers(checkOptions?.map(hit => hit.key) || []);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		comparisonTableState?.filters,
		comparisonTableState?.data?.total,
		salesVolumeComparisonTableState?.filters,
		salesVolumeComparisonTableState?.data?.total,
	]);

	// Function to get the appropriate table state values based on the comparison report type
	const getTableStateValues = () => {
		// Check if the comparison report is 'Check Detail Comparison'
		if (comparisonReport === 'Check Detail Comparison') {
			// Return the comparison table state for 'Check Detail Comparison'
			return comparisonTableState;
		} else {
			// Otherwise, return the sales volume comparison table state
			return salesVolumeComparisonTableState;
		}
	};

	useEffect(() => {
		getCheckDetailData({
			variables: {
				index: 'checkdetailsinterestscomparison_flat',
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (checkDetailData?.getCheckDetailsData?.checkDetails?.length > 0) {
			let data = [];
			for (let i = 0; i < checkDetailData?.getCheckDetailsData?.checkDetails?.length; i++) {
				const check = checkDetailData?.getCheckDetailsData?.checkDetails[i]._source;
				data.push({
					wells: check.wells,
					date: check.date,
					state: check?.property?.state,
					statementVolume: check.grossPropertyVolume || 0,
					product: check.product,
					ReportDate: check.date,
					oil: check.product === 'OIL' ? check.grossPropertyVolume : 0,
					gas: check.product === 'GAS' ? check.grossPropertyVolume : 0,
					water: check.product === 'WATER' ? check.grossPropertyVolume : 0,
				});
			}
			data = sortBy(data, ['ReportDate']);
			setCheckDetailsData(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkDetailData]);

	useEffect(() => {
		getESMinValue({
			variables: {
				esIndex: 'checks_flat',
				field: 'checkDate',
				value_as_string: true,
			},
		});
	}, [getESMinValue]);

	useEffect(() => {
		setFromDate(moment().startOf('year').format('yyyy-MM-DD'));
		setToDate(moment().subtract(1, 'months').endOf('month').format('yyyy-MM-DD'));
	}, []);

	useEffect(() => {
		setFilters([...(propertiesReportGroup || []), ...(filters || [])]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [propertiesReportGroup]);

	useEffect(() => {
		if (!fromDate) return;

		getPortfolioSummary({
			variables: {
				filters,
				filterDate: { toDate: new Date(toDate || Date.now()), fromDate: new Date(fromDate) },
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters, toDate, fromDate]);

	const onChangeDates = (fromDate, toDate) => {
		const months = [];
		if (fromDate && toDate) {
			const fromYear = Number(fromDate.split('-')[0]),
				toYear = Number(toDate.split('-')[0]),
				fromMonth = Number(fromDate.split('-')[1]),
				toMonth = Number(toDate.split('-')[1]);
			for (let year = fromYear; year <= toYear; year++) {
				const startMonth = year === fromYear ? fromMonth : 1;
				const endMonth = year === toYear ? toMonth : 12;
				for (let month = startMonth; month <= endMonth; month++) {
					months.push(`${month}/${year}`);
				}
			}
		}
		setMonths(months);
	};
	useEffect(() => {
		const newFilters = tableController(TableKey).getExternalFilter();
		if (comparisonReport === 'Check Detail Comparison') {
			setTableKey('ComparisonTable');
		} else {
			setTableKey('SalesVolumeComparisonTable');
		}
		setEsFilters(newFilters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [comparisonReport]);

	const setESFilters = useCallback(
		newFilter => {
			if (newFilter.length === 0) {
				tableController(TableKey).clearFilters(); // clear filter from the table state
				// tableController(TableKey).setFilters([{ field: 'isMisMatchedInterest', value: true, type: 'term' }]);
			} else {
				let filterToAdd = [];
				newFilter.forEach(filter => {
					const { field, value, type, filterType } = filter;
					if (filterType === 'date') {
						filterToAdd.push({ field, value, type: 'advanced', searchType: 'betweenInclusive', columnType: 'date' });
					} else if (field === 'isMisMatchedInterest') {
						filterToAdd.push({ field, value, type });
					} else {
						filterToAdd.push({ field, value });
					}
				});
				tableController(TableKey).setFilters(filterToAdd);
			}
		},
		[TableKey]
	);

	return (
		<>
			<div className={classes.mainTabContainer}>
				<StyledTabs
					value={tab}
					onChange={(event, tab) => {
						setTab(tab);
					}}
					aria-label="ant example"
				>
					{tabs.map(tab => (
						<StyledTab key={tab} label={tab} />
					))}
				</StyledTabs>
				{tabs[tab] === 'Comparisons' && (
					<Grid item xs md={2} style={{ marginTop: '2px', minWidth: '395px' }}>
						<Autocomplete
							size="small"
							onChange={(event, newValue) => setComparisonReport(newValue)}
							options={['Check Detail Comparison', 'Sales Volume vs Reported Production']}
							renderInput={params => (
								<form autoComplete="off">
									<TextField
										{...params}
										variant="outlined"
										placeholder=""
										style={{ backgroundColor: 'white' }}
										fullWidth={true}
									/>
								</form>
							)}
							defaultValue={'Check Detail Comparison'}
							disableListWrap
							id="custom-date-dropdown"
						/>
					</Grid>
				)}
			</div>

			{tabs[tab] === 'Income Statement' && (
				<>
					<div className={classes.actionBar}>
						<Grid container direction="row" display="flex" spacing={4} style={{ padding: '0px 36px' }}>
							<Grid item xs={8} md={6} style={{ marginTop: '4px' }}>
								<Grid container display="flex" alignItems="center" spacing={3} justifyContent="space-between">
									<CustomDates
										onChangeDates={onChangeDates}
										fromDate={fromDate}
										setFromDate={setFromDate}
										toDate={toDate}
										setToDate={setToDate}
										isProperties={true}
										lastCheckMinDate={lastCheckMinDate}
										datesInputWidth={4}
										setAllDateToNull={false}
									/>
								</Grid>
							</Grid>
							<Grid item xs={4} md={2}>
								<Grid container display="flex" className={classes.actionsGrid}>
									<ReportGroupHeader
										type="Properties"
										esFilters={filters}
										setESFilters={setFilters}
										setFilterToggle={() => {}}
										isBackground={false}
										noUpdate={true}
										strechedWidth
										isShrink
										noPadding
									/>
								</Grid>
							</Grid>
							<Grid item xs={4} md={2}>
								<PurchasersDropdown esFilters={filters} setESFilters={setFilters} />
							</Grid>
							<Grid item xs={4} md={2}>
								<AcquisitionIdDropdown esFilters={filters} setESFilters={setFilters} />
							</Grid>
						</Grid>
					</div>
					{/* <AnalyticsCards cards={cards} /> */}
					<Divider className={classes.divider} />
					<DetailTabsSection
						monthsInterval={monthsInterval}
						portfolioSummary={portfolioSummary?.getPortfolioSummary || {}}
						{...props}
						loading={loading}
					/>
				</>
			)}

			{tabs[tab] === 'Check Details' && (
				<div className={`${classes.sectionCard}`}>
					<CheckDetailsSection header="Check Details" loadMore={loadMore} />
				</div>
			)}

			{tabs[tab] === 'Comparisons' && (
				<>
					<LastCheckDateFilter
						field="check.checkDate"
						esIndex={'checkdetailsinterestscomparison_flat'}
						esFilters={esFilters}
						setESFilters={setESFilters}
						setFilterToggle={setFilterToggle}
						filterToggle={filterToggle}
						propertyNumbers={propertyNumbers}
						checkNumbers={checkNumbers}
						extraFitlers={['propertyGroup', 'checkNumber', 'propertyNumber']}
						stateESKey="property."
						isComparisonReport={true}
					/>
					{comparisonReport === 'Sales Volume vs Reported Production' ? (
						<SalesVolumeComparisonSection
							checkDetailsData={checkDetailsData}
							esFilters={esFilters}
							loadMore={loadMore}
						/>
					) : (
						<>
							<AnalyticsCards
								esFilters={tableController('ComparisonTable')?.getExternalFilter()}
								setESFilters={setESFilters}
								esIndex={'ComparisonTable'}
							/>
							<div className={classes.revenueTableInfContainer}>
								<Box sx={{ padding: '1em', marginLeft: '1em' }}>
									<MRTTable name={'ComparisonTable'} />
								</Box>
							</div>
						</>
					)}
				</>
			)}

			{tabs[tab] === 'Property Interests' && (
				<Box sx={{ padding: '1em', marginLeft: '1em' }}>
					<MRTTable name="PropertyIntrestTable" />
				</Box>
			)}
		</>
	);
}
