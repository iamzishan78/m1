import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';

import { AppContext } from 'AppContext';

import CampaignAnalytics from 'components/Contacts/components/CampaignAnalytics';
import CustomCampaignFilters from 'components/Contacts/components/CampaignFilter';
import { GET_ES_MIN_VALUE } from 'graphQL/useQueryESMinValue';
import MRTTable from 'components/MRTTable';
import { tableController } from 'hookstate/tableController';
import { copy, dateFilterToDate } from 'utils/helper';
import { formatDate } from 'components/Shared/functions';

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

	const [getESMinValue] = useLazyQuery(GET_ES_MIN_VALUE, {
		fetchPolicy: 'no-cache',
		onCompleted: data => {
			if (data?.getESMinValue) {
				const date = new Date(data?.getESMinValue);
				if (date?.toString() !== 'Invalid Date') setLastCampaignMinDate(data?.getESMinValue);
			}
		},
	});

	useEffect(() => {
		getESMinValue({
			variables: {
				esIndex,
				field: 'createdAt',
				value_as_string: true,
			},
		});
	}, [getESMinValue]);

	useEffect(() => {
		setAppliedFilters(appliedFilters => ({
			...appliedFilters,
			fromDate,
			toDate,
		}));
	}, [fromDate, toDate, setAppliedFilters]);

	const setESFilters = useCallback(newFilter => {
		if (newFilter.length === 0) {
			let externalFilters = tableController(TableKey).getExternalFilter();
			tableController(TableKey).clearFilter(externalFilters[0]?.field);
		} else {
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
