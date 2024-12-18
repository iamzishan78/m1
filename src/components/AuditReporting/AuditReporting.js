import React, { useEffect, useState, useContext  } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery } from '@apollo/client';

import ActivitiesDashboardFilter from 'components/Activities/components/ActivitiesDashboardFilter';
import ActivityAnalytics from 'components/Activities/components/ActivityAnalytics';
import { GET_DB_MIN_VALUE } from 'graphQL/useQueryDbQuery';
import { Box } from '@material-ui/core';
import MRTTable from 'components/MRTTable';
import { AppContext } from 'AppContext';
import { tableController } from 'hookstate/tableController';
import { getFilters } from 'components/Table/Activities/ActivitiesTable';
const useStyles = makeStyles(theme => ({
	root: {
		marginTop: '90px',
	},
}));

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
		tableController(tableKey).setGlobalFilter(stateApp.landAnalyticsSearchQuery) // set value in searchquery for audit reporting
	  }, [stateApp.landAnalyticsSearchQuery])

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
					tableFilters={[
						...auditReportingTableState.filters,
					]}
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
					tableFilters={[
						...auditReportingTableState.filters
					]}
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
