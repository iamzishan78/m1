import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery } from '@apollo/client';

import ActivityAnalytics from './ActivityAnalytics';
import ActivitiesDashboardFilter from './ActivitiesDashboardFilter';
import { GET_ES_MIN_VALUE } from 'graphQL/useQueryESMinValue';
import MRTTable from 'components/MRTTable';
import { tableController } from 'hookstate/tableController';
import { useHookstate } from '@hookstate/core';
import { slidoutState } from 'hookstate/initialStates';
import ActivitiesSlideout from './ActivitiesSlideout';
import { GET_CONTACTS_FOR_ACTIVITY } from 'graphQL/useQueryGetContactsForActivity';
import { AppContext } from 'AppContext';
import { getDateFilters } from 'utils/helper';

const useStyles = makeStyles(theme => ({
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
		if (range.length > 0) filters = [...filters, ...range];
		range = getDateFilters({
			endDateTime: {
				from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
				to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
			},
		});
		if (range.length > 0) filters = [...filters, ...range];
		if (appliedFilters.campaignName) {
			filters.push({
				field: 'contact.campaignName.keyword',
				value: appliedFilters.campaignName,
			});
		}
		if (appliedFilters.qualifier) {
			filters.push({
				field: 'ownerName.keyword',
				value: appliedFilters.qualifier,
			});
		}
		if (!filters.length && appliedFilters.length) filters = appliedFilters;
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
	const activitiesTableState = tableController(tableKey).useState(['filters', 'data', 'globalFilter']).stateValues;
	const [, setStateApp] = useContext(AppContext);

	const [getESMinValue] = useLazyQuery(GET_ES_MIN_VALUE, {
		fetchPolicy: 'no-cache',
		onCompleted: data => {
			if (data?.getESMinValue) {
				setFilterToggle(!filterToggle);
				setMinDate(data?.getESMinValue);
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
	}, [getContactsForActivityResult]);

	useEffect(() => {
		getESMinValue({
			variables: {
				esIndex,
				field: 'dateTime',
				value_as_string: true,
			},
		});
	}, [getESMinValue]);

	useEffect(() => {
		tableController(tableKey).setFilters(getActivityFilters(appliedFilters));
	}, [appliedFilters]);

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
					...activitiesTableState?.filters,
				]}
				appliedFilters={appliedFilters}
				minDate={minDate}
				setAppliedFilters={setAppliedFilters}
			/>
			<ActivityAnalytics
				tableFilters={[
					{ field: 'category.keyword', value: 'CRM' },
					{ field: 'type.keyword', value: 'Expiration', type: 'advanced', searchType: 'notEquals' },
					...activitiesTableState?.filters,
				]}
				appliedFilters={appliedFilters}
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
