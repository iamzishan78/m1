import React, { useEffect, useState } from 'react';
import { Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';

import CustomDates from 'components/Revenue/components/Common/CustomDates';
import DetailTabsSection from 'components/Revenue/components/Portfolio/DetailTabsSection';
import { useLazyQuery } from '@apollo/client';
import { GET_PORTFOLIO_GROSS_REVENUE_SUMMARY } from 'graphQL/useQueryGetPortfolioGrossRevenueSummary';
import moment from 'moment';
import { GET_DB_MIN_VALUE } from 'graphQL/useQueryDbQuery';

const useStyles = makeStyles(theme => ({
	actionBar: {
		backgroundColor: '#f7f7f7',
		width: '100%',
		minHeight: '65px',
		marginTop: '100px',
	},
	actionsGrid: {
		marginTop: '6px',
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
}));

export default function Portfolio() {
	const classes = useStyles();
	const propertiesReportGroup = useSelector(({ Revenue }) => Revenue.propertiesReportGroup);
	const [fromDate, setFromDate] = React.useState(null);
	const [toDate, setToDate] = React.useState(null);
	const [monthsInterval, setMonths] = useState([]);
	const [lastCheckMinDate, setLastCheckMinDate] = useState('');

	const [getDbMinValue] = useLazyQuery(GET_DB_MIN_VALUE, {
		fetchPolicy: 'no-cache',
		onCompleted: data => {
			if (data?.getDbMinValue?.data) {
				setLastCheckMinDate(data?.getDbMinValue?.data);
				// setFromDate(`${moment(data.getDbMinValue?.data).startOf('month').format("yyyy-MM-DD")}`);
				// setToDate(`${moment().subtract(1, 'months').endOf('month').format('yyyy-MM-DD')}`);
			}
		},
	});

	useEffect(() => {
		getDbMinValue({
			variables: {
				index: 'checks_flat',
				field: 'checkDate',
			},
		});
	}, [getDbMinValue]);

	useEffect(() => {
		setFromDate(moment().startOf('year').format('yyyy-MM-DD'));
		setToDate(moment().subtract(1, 'months').endOf('month').format('yyyy-MM-DD'));
	}, []);
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

	const [getPortfolioSummary, { data: portfolioSummary }] = useLazyQuery(GET_PORTFOLIO_GROSS_REVENUE_SUMMARY, {
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		getPortfolioSummary({
			variables: {
				filters: propertiesReportGroup || [],
				filterDate: { toDate: new Date(toDate), fromDate: new Date(fromDate) },
			},
		});
	}, [propertiesReportGroup, toDate, fromDate, getPortfolioSummary]);

	return (
		<>
			<div className={classes.actionBar} id="portfilioActionBar">
				<Grid container direction="row" display="flex" justify="space-between" style={{ padding: '0px 36px' }}>
					<Grid item xs={8} md={8} style={{ marginTop: '4px' }}>
						<Grid container display="flex" alignItems="center" spacing={3}>
							<CustomDates
								onChangeDates={onChangeDates}
								fromDate={fromDate}
								setFromDate={setFromDate}
								toDate={toDate}
								setToDate={setToDate}
								isProperties={true}
								lastCheckMinDate={lastCheckMinDate}
								datesInputWidth={3}
							/>
						</Grid>
					</Grid>
					<Grid item xs={4} md={4}>
						<Grid
							container
							display="flex"
							justify="flex-end"
							direction="row"
							spacing={2}
							className={classes.actionsGrid}
						>
							{/* <Grid item>
                <Button variant="contained" color="secondary">
                  Save View
                </Button>
              </Grid> */}
							{/* <Grid item>
                <Button variant="contained" color="secondary">Run Report</Button>
              </Grid> */}
						</Grid>
					</Grid>
				</Grid>
			</div>
			{/* <AnalyticsCards cards={cards} /> */}
			<Divider className={classes.divider} />
			<DetailTabsSection
				monthsInterval={monthsInterval}
				portfolioSummary={portfolioSummary?.getPortfolioSummary || {}}
			/>
		</>
	);
}
