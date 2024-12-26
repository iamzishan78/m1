import React, { useContext, useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { useLazyQuery } from '@apollo/client';
import { useHookstate } from '@hookstate/core';

import MRTTable from 'components/MRTTable';

import { GET_DB_MIN_VALUE } from 'graphQL/useQueryDbQuery';
import { GET_CONTACTS_FOR_ACTIVITY } from 'graphQL/useQueryGetContactsForActivity';

import { slidoutState } from 'hookstate/initialStates';
import { tableController } from 'hookstate/tableController';

import { getDateFilters } from 'utils/helper';

import { AppContext } from 'AppContext';

import ActivitiesDashboardFilter from './ActivitiesDashboardFilter';
import ActivitiesSlideout from './ActivitiesSlideout';
import ActivityAnalytics from './ActivityAnalytics';

const useStyles = makeStyles(() => ({
	root: {
		marginTop: '90px',
	},
}));

export const getActivityFilters = appliedFilters => {
	let filters = [];
	if (appliedFilters) {
		let range = [];
		range = getDateFilters({
			dateTime: {
				from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
				to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
			},
		});
		if (range.length > 0) {
			filters = [...filters, ...range];
		}
		range = getDateFilters({
			endDateTime: {
				from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
				to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
			},
		});
		if (range.length > 0) {
			filters = [...filters, ...range];
		}
		if (appliedFilters.campaigns) {
			filters.push({
				field: 'contact.campaigns',
				value: appliedFilters.campaigns,
			});
		}
		if (appliedFilters.qualifier) {
			filters.push({
				field: 'ownerName.keyword',
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
	const selectedActivityId = useHookstate(slidoutState.selectedActivityId);

	const tableKey = 'ActivitiesTable';
	const esIndex = 'activities_flat';
	const searchFields = ['name', '_all'];
	const [filterToggle, setFilterToggle] = useState(false);
	const [appliedFilters, setAppliedFilters] = useState({
		toDate: null,
		fromDate: null,
	});
	const [minDate, setMinDate] = useState('');
	const { activitiesTableState } = tableController(tableKey).useState(
		['filters', 'data', 'globalFilter', 'searchFields'],
		'activitiesTableState'
	);
	const [stateApp, setStateApp] = useContext(AppContext);

	const [getDbMinValue] = useLazyQuery(GET_DB_MIN_VALUE, {
		fetchPolicy: 'no-cache',
		onCompleted: data => {
			if (data?.getDbMinValue?.data) {
				setFilterToggle(!filterToggle);
				setMinDate(data?.getDbMinValue.data);
			}
		},
	});

	const [getContactsForActivity, { data: getContactsForActivityResult }] = useLazyQuery(GET_CONTACTS_FOR_ACTIVITY, {
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		const contacts = getContactsForActivityResult?.getContactsForActivity?.contacts;
		setStateApp(stateApp => ({
			...stateApp,
			activityContacts: { contacts },
		}));
	}, [getContactsForActivityResult, setStateApp]);

	useEffect(() => {
		getDbMinValue({
			variables: {
				index: esIndex,
				field: 'dateTime',
			},
		});
	}, [getDbMinValue]);

	useEffect(() => {
		tableController(tableKey).setFilters(getActivityFilters(appliedFilters));
	}, [appliedFilters]);

	useEffect(() => {
		getContactsForActivity({
			variables: { activityId: selectedActivityId.get() },
		});
	}, [getContactsForActivity, selectedActivityId]);

	useEffect(() => {
		return () => {
			slidoutState.selectedActivityId.set('');
			slidoutState.selectedActivity.set(null);
			slidoutState.show.set(false);
		};
	}, []);

	useEffect(() => {
		tableController(tableKey).setGlobalFilter(stateApp.landAnalyticsSearchQuery);
	}, [stateApp.landAnalyticsSearchQuery]); // Update table filter state based on navbar search

	return (
		<div className={classes.root}>
			<ActivitiesDashboardFilter
				esIndex={esIndex}
				searchFields={searchFields}
				setFilterToggle={setFilterToggle}
				filterToggle={filterToggle}
				tableFilters={[
					{ field: 'category.keyword', value: 'CRM' },
					{ field: 'type.keyword', value: 'Expiration', type: 'advanced', searchType: 'notEquals' },
					...activitiesTableState.filters,
				]}
				appliedFilters={appliedFilters}
				minDate={minDate}
				setAppliedFilters={setAppliedFilters}
				label={'Activity Owner'} // to pass the dynamic label in filter
			/>
			<ActivityAnalytics
				tableFilters={[
					{ field: 'category.keyword', value: 'CRM' },
					{ field: 'type.keyword', value: 'Expiration', type: 'advanced', searchType: 'notEquals' },
					...activitiesTableState.filters,
				]}
				appliedFilters={appliedFilters}
				setTableFilters={tableController(tableKey)?.setFilters}
				tableData={activitiesTableState?.data}
				module={'Activities'}
				searchFields={activitiesTableState.searchFields}
			/>
			<MRTTable
				name={tableKey}
				overrideMeta={{
					defaultFilters: [
						{ field: 'category.keyword', value: 'CRM' },
						{ field: 'type.keyword', value: 'Expiration', type: 'advanced', searchType: 'notEquals' },
					],
					maxTableHeight: '42vh',
				}}
			/>
			<ActivitiesSlideout
				activityId={selectedActivityId.get()}
				setSelectedActivityId={slidoutState.selectedActivityId.set}
				getContactsForActivity={getContactsForActivity}
			/>
		</div>
	);
};

export default ActivitiesDashboard;
