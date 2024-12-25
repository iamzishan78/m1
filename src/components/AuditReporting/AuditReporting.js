import { useLazyQuery } from '@apollo/client';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState, useContext } from 'react';

import ActivitiesDashboardFilter from 'components/Activities/components/ActivitiesDashboardFilter';
import ActivityAnalytics from 'components/Activities/components/ActivityAnalytics';
import MRTTable from 'components/MRTTable';

import { GET_DB_MIN_VALUE } from 'graphQL/useQueryDbQuery';

import { tableController } from 'hookstate/tableController';

import { getRangeFilters, getDateFilters } from 'utils/helper';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: '90px',
	},
}));

const getFilters = appliedFilters => {
	let filters = [];
	if (appliedFilters) {
		let range = [];
		if (appliedFilters.filter !== 'audit') {
			range = getRangeFilters(
				{
					dateTime: {
						from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
						to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
					},
				},
				'simple'
			);
			if (range.length > 0) {
				filters = [...filters, ...range];
			}
			range = getRangeFilters(
				{
					endDateTime: {
						from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
						to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
					},
				},
				'simple'
			);
		} else {
			range = getDateFilters(
				{
					lastUpdateAt: {
						from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
						to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
					},
				},
				'simple'
			);
			if (range.length > 0) {
				filters = [...filters, ...range];
			}
			range = getDateFilters(
				{
					lastUpdateAt: {
						from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
						to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
					},
				},
				'simple'
			);
		}

		if (range.length > 0) {
			filters = [...filters, ...range];
		}
		if (appliedFilters.qualifier) {
			filters.push({
				field: appliedFilters.filter === 'audit' ? 'lastUpdateBy.name.keyword' : 'ownerName.keyword',
				value: appliedFilters.qualifier,
			});
		}
		if (!filters.length && appliedFilters.length) {
			filters = appliedFilters;
		}
	}
	return filters;
};

const ActivitiesDashboard = () => {
	const classes = useStyles();
	const esIndex = 'contacts_flat';
	const searchFields = ['name', '_all'];
	const tableKey = 'AuditReportingTable';
	const [stateApp] = useContext(AppContext);
	const auditReportingTableState = tableController(tableKey).useState(['filters', 'data', 'globalFilter']).stateValues;
	const [filterToggle, setFilterToggle] = useState(false);
	const [appliedFilters, setAppliedFilters] = useState({
		toDate: null,
		fromDate: null,
		filter: 'audit',
	});
	const [minDate, setMinDate] = useState('');

	const [getDbMinValue] = useLazyQuery(GET_DB_MIN_VALUE, {
		fetchPolicy: 'no-cache',
		onCompleted: data => {
			if (data?.getDbMinValue?.data) {
				setFilterToggle(!filterToggle);
				setMinDate(data?.getDbMinValue.data);
			}
		},
	});

	useEffect(() => {
		getDbMinValue({
			variables: {
				index: esIndex,
				field: 'lastUpdateAt',
			},
		});
	}, [getDbMinValue]);

	useEffect(() => {
		tableController(tableKey).setGlobalFilter(stateApp.landAnalyticsSearchQuery); // set value in searchquery for audit reporting
	}, [stateApp.landAnalyticsSearchQuery]);

	useEffect(() => {
		tableController(tableKey).setFilters(getFilters(appliedFilters));
	}, [appliedFilters]);

	return (
		<div className={classes.root}>
			{
				<ActivitiesDashboardFilter
					esIndex={esIndex}
					searchFields={searchFields}
					setFilterToggle={setFilterToggle}
					filterToggle={filterToggle}
					tableFilters={[...auditReportingTableState.filters]}
					appliedFilters={appliedFilters}
					minDate={minDate}
					setAppliedFilters={setAppliedFilters}
					label={'User'} // to pass the dynamic label in filter
				/>
			}
			{
				<ActivityAnalytics
					esIndex={esIndex}
					filterToggle={filterToggle}
					tableFilters={[...auditReportingTableState.filters]}
					appliedFilters={appliedFilters}
					setAppliedFilters={setAppliedFilters}
				/>
			}
			<Box sx={{ padding: '1em', marginLeft: '1em' }}>
				<MRTTable name={tableKey} />
			</Box>
		</div>
	);
};

export default ActivitiesDashboard;
