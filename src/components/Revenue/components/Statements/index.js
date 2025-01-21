import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { useLazyQuery } from '@apollo/client';

import MRTTable from 'components/MRTTable';
import LastCheckDateFilter from 'components/Revenue/components/Common/LastCheckDateFilter';
import AnalyticsCards from 'components/Revenue/components/Statements/AnalyticsCards';
import { copy } from 'components/Shared/functions';

import { GET_DB_DATA_TOTAL } from 'graphQL/useQueryDbQuery';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController } from 'hookstate/tableController';

const useStyles = makeStyles(() => ({
	root: {
		margin: '75px 0 10px',
	},
}));

export default function RevenueStatements() {
	const classes = useStyles();

	const { stateValues } = globalStateController.useState(['globalSearch']);
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

	const getDBCounts = (key, value, type) => {
		const gridFilters = revenueStatmentTableState?.filters ? revenueStatmentTableState?.filters : [];
		return new Promise((resolve, reject) => {
			getDbDataTotal({
				variables: {
					index: 'checks_flat',
					filters: [...gridFilters, { field: key, value: value, type }],
					search: {
						query: stateValues.globalSearch,
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

	const onGettingPotentialIssues = count => setPotentialIssuesCount(count);

	useEffect(() => {
		return () => {
			globalStateController.updateState({ globalSearch: '' });
		};
	}, []);

	useEffect(() => {
		tableController('RevenueStatementsTable').setFilters(esFilters);
	}, [esFilters]);

	useEffect(() => {
		getCounts();
	}, [revenueStatmentTableState?.filters, stateValues.globalSearch]);

	useEffect(() => {
		tableController('RevenueStatementsTable').setGlobalFilter(stateValues.globalSearch);
	}, [stateValues.globalSearch]);

	const setESFilters = newFilter => {
		ESFilters(newFilter);
	};

	const setAnalyticFilters = (filter, status) => {
		let filters = copy(esFilters);
		filters = filters.filter(f => f.field !== filter.field);
		if (status) {
			filters.push(filter);
		} else {
			tableController('RevenueStatementsTable').clearFilter(filter.field);
		}
		setESFilters(filters);
		setFilterToggle(!filterToggle);
	};

	const getCounts = async () => {
		const approvedCounts = await getDBCounts('approvalStatus.keyword', 'Approved');
		const unApprovedCounts = await getDBCounts('approvalStatus.keyword', 'Unapproved');
		const potentialIssuesCounts = await getDBCounts('isAmountValidated', false, 'term');

		setApprovedCount(approvedCounts);
		setUnapprovedCount(unApprovedCounts);
		onGettingPotentialIssues(potentialIssuesCounts);
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
						revenueSearchQuery={stateValues.globalSearch}
						setAnalyticFilters={setAnalyticFilters}
					/>
				</div>

				<div>
					<MRTTable name="RevenueStatementsTable" />
				</div>
			</div>
		</div>
	);
}
