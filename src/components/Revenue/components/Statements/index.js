import { useLazyQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect, useContext } from 'react';

import MRTTable from 'components/MRTTable';
import LastCheckDateFilter from 'components/Revenue/components/Common/LastCheckDateFilter';
import AnalyticsCards from 'components/Revenue/components/Statements/AnalyticsCards';
import { copy } from 'components/Shared/functions';

import { GET_DB_DATA_TOTAL } from 'graphQL/useQueryDbQuery';

import { tableController } from 'hookstate/tableController';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	root: {
		margin: '75px 0 10px',
	},
	revenueContainer: {
		'& .MuiTableRow-root': {
			backgroundColor: 'red',
			color: 'red',
			zIndex: 0,
		},
	},
}));

export default function RevenueStatements() {
	const classes = useStyles();
	const [stateApp, setStateApp] = useContext(AppContext);
	const revenueStatmentTableState = tableController('RevenueStatementsTable').useState([
		'filters',
		'data',
		'globalFilter',
	]).stateValues;

	const [approvedCount, setApprovedCount] = useState(0);
	const [unapprovedCount, setUnapprovedCount] = useState(0);
	const [potentialIssuesCount, setPotentialIssuesCount] = useState(0);
	const [esFilters, ESFilters] = useState([]);
	const [filterToggle, setFilterToggle] = React.useState(false);

	const [getDbDataTotal] = useLazyQuery(GET_DB_DATA_TOTAL, {
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		return () => {
			setStateApp((state, props) => {
				return { ...state, revenueSearchQuery: '' };
			});
		};
	}, []);

	useEffect(() => {
		tableController('RevenueStatementsTable').setFilters(esFilters);
	}, [esFilters]);

	useEffect(() => {
		getCounts();
	}, [revenueStatmentTableState?.filters, stateApp.revenueSearchQuery]);

	useEffect(() => {
		tableController('RevenueStatementsTable').setGlobalFilter(
			stateApp.revenueSearchQuery === '*' ? '' : stateApp.revenueSearchQuery
		);
	}, [stateApp.revenueSearchQuery]);

	const setESFilters = newFilter => {
		ESFilters(newFilter);
	};

	const setAnalyticFilters = (filter, status) => {
		let filters = copy(esFilters);
		filters = filters.filter(f => f.field !== filter.field);
		if (status) {
			filters.push(filter);
		}
		setESFilters(filters);
		setFilterToggle(!filterToggle);
	};

	const onGettingPotentialIssues = count => setPotentialIssuesCount(count);

	const getCounts = async () => {
		const approvedCounts = await getDBCounts('approvalStatus.keyword', 'Approved');
		const unApprovedCounts = await getDBCounts('approvalStatus.keyword', 'Unapproved');
		const potentialIssuesCounts = await getDBCounts('isAmountValidated', false, 'term');

		setApprovedCount(approvedCounts);
		setUnapprovedCount(unApprovedCounts);
		onGettingPotentialIssues(potentialIssuesCounts);
	};

	const getDBCounts = (key, value, type) => {
		const gridFilters = revenueStatmentTableState?.filters ? revenueStatmentTableState?.filters : [];
		return new Promise((resolve, reject) => {
			getDbDataTotal({
				variables: {
					index: 'checks_flat',
					filters: [...gridFilters, { field: key, value: value, type }],
					search: {
						query: stateApp.revenueSearchQuery,
						fields: ['checkNumber', '_all'],
					},
				},
				onCompleted: res => {
					resolve(res?.getDbDataTotal?.data);
				},
				onError: error => {
					console.log(error);
					reject(0);
				},
			});
		});
	};

	return (
		<div className={classes.root}>
			<LastCheckDateFilter
				field={'checkDate'}
				esIndex={'checks_flat'}
				setESFilters={setESFilters}
				setFilterToggle={setFilterToggle}
				filterToggle={filterToggle}
			/>

			<div>
				<div style={{ padding: 40 }}>
					<AnalyticsCards
						checks={revenueStatmentTableState?.data?.total}
						approvedCount={approvedCount}
						unapprovedCount={unapprovedCount}
						potentialIssuesCount={potentialIssuesCount}
						revenueSearchQuery={stateApp.revenueSearchQuery}
						setAnalyticFilters={setAnalyticFilters}
					/>
				</div>

				<div classes={classes.revenueContainer} style={{}}>
					<MRTTable name="RevenueStatementsTable" />
				</div>
			</div>
		</div>
	);
}
