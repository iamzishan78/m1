import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';

import { AppContext } from 'AppContext';

import CampaignAnalytics from 'components/Contacts/components/CampaignAnalytics';
import CustomCampaignFilters from 'components/Contacts/components/CampaignFilter';
import MRTTable from 'components/MRTTable';
import { tableController } from 'hookstate/tableController';
import { copy, dateFilterToDate } from 'utils/helper';
import { formatDate } from 'components/Shared/functions';
import { GET_DB_MIN_VALUE } from 'graphQL/useQueryDbQuery';

const CampaignManagement = () => {
	const esIndex = 'campaigns_flat';
	const TableKey = 'CampaignTable';
	const searchFields = ['name', '_all'];
	const [lastCampaignMinDate, setLastCampaignMinDate] = useState('');
	const [appliedFilters, setAppliedFilters] = useState({
		fromDate: null,
		toDate: null,
	});
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [stateApp] = useContext(AppContext);

	const { stateValues } = tableController(TableKey).useState(['filters']);

	const [getDbMinValue] = useLazyQuery(GET_DB_MIN_VALUE, {
		fetchPolicy: 'no-cache',
		onCompleted: data => {
			if (data?.getDbMinValue?.data) {
				const date = new Date(data?.getDbMinValue.data);
				if (date?.toString() !== 'Invalid Date') setLastCampaignMinDate(data?.getDbMinValue.data);
			}
		},
	});

	useEffect(() => {
		getDbMinValue({
			variables: {
				index: esIndex,
				field: 'createdAt',
			},
		});
	}, [getDbMinValue]);

	useEffect(() => {
		setAppliedFilters(appliedFilters => ({
			...appliedFilters,
			fromDate,
			toDate,
		}));
	}, [fromDate, toDate, setAppliedFilters]);

	const setESFilters = useCallback(newFilter => {
		let externalFilters = tableController(TableKey).getExternalFilter();

		externalFilters.forEach(externalFilter => {
			if (newFilter.find(f => f.field === externalFilter.field)) return;

			tableController(TableKey).clearFilter(externalFilter.field);
		});

		if (newFilter.length !== 0) {
			newFilter.forEach(filter => {
				const { field, value, type, columnType, searchType } = filter;
				let filterToAdd;

				filterToAdd = { field, value, type, columnType, searchType };

				tableController(TableKey).setFilter(filterToAdd);
			});
		}
	}, []);

	useEffect(() => {
		let filters = copy(tableController(TableKey)?.getExternalFilter()) ?? [];
		filters = filters.filter(filter => filter.field !== 'createAt');

		if (fromDate && toDate) {
			filters.unshift({
				field: 'createAt',
				value: [formatDate(fromDate), formatDate(dateFilterToDate(toDate))],
				type: 'advanced',
				searchType: 'betweenInclusive',
				columnType: 'date',
			});
		}

		setESFilters(filters);
	}, [fromDate, toDate, setESFilters]);

	useEffect(() => {
		tableController(TableKey).setGlobalFilter(stateApp.contactSearchQuery);
	}, [stateApp.contactSearchQuery]);

	return (
		<div style={{ marginTop: '90px' }}>
			<CustomCampaignFilters
				setFromDate={setFromDate}
				setToDate={setToDate}
				esIndex={esIndex}
				searchFields={searchFields}
				tableFilters={stateValues.filters}
				appliedFilters={tableController(TableKey)?.getExternalFilter()}
				appliedDateFilters={appliedFilters}
				setAppliedFilters={setESFilters}
				minDate={lastCampaignMinDate}
				contactSearchQuery={stateApp.contactSearchQuery}
			/>
			<div style={{ padding: '0px 30px' }}>
				<CampaignAnalytics
					appliedFilters={tableController(TableKey)?.getExternalFilter()}
					contactSearchQuery={stateApp.contactSearchQuery}
				/>
				<MRTTable name={TableKey} />
			</div>
		</div>
	);
};

export default CampaignManagement;
