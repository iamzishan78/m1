import React, { useState, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';

import MRTTable from 'components/MRTTable';

import { GET_DB_FILTERS } from 'graphQL/useQueryDbQuery';

import { tableController } from 'hookstate/tableController';

import AnalyticsCharts from './AnalyticsCharts';

export default function SalesVolumeComparisonSection({ checkDetailsData, esFilters }) {
	const [propertiesIds, setPropertiesIds] = useState([]);
	const tableState = tableController('SalesVolumeComparisonTable').useState(['filters', 'data']);
	const tableStateValues = tableState.stateValues;

	const [getDbFilters] = useLazyQuery(GET_DB_FILTERS, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		(async () => {
			const formattedFilters = esFilters.map(filter => {
				return filter.field === 'check.checkDate' ? { ...filter, field: 'date' } : filter;
			});
			await new Promise((resolve, reject) => {
				getDbFilters({
					variables: {
						index: 'checkdetailsinterestscomparison_flat',
						filters: [...formattedFilters, { field: 'property.IsDeleted', value: false, type: 'term' }],
						filterKey: 'property._id.keyword',
						filterAggs: { query: '', field: 'property._id.keyword', size: tableStateValues?.data?.total || 0 },
					},
					onCompleted: res => {
						if (res) {
							const propertiesIds = res?.getDbFilters?.hits?.map(obj => obj.key);
							setPropertiesIds(propertiesIds);
						}
					},
					onError: error => reject(error),
				});
			});
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableState?.data?.total, tableState?.filters]);

	return (
		<>
			<AnalyticsCharts esFilters={esFilters} propertiesIds={propertiesIds} checkDetailsData={checkDetailsData} />

			<MRTTable name="SalesVolumeComparisonTable" />
		</>
	);
}
