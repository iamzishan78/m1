import React, { useEffect, useContext } from 'react';

import MRTTable from 'components/MRTTable';

import { tableController } from 'stateManagement/tableController';

import { AppContext } from 'AppContext';

const externalFilters = {
	internalCompany: 'All',
	wellClassification: 'All',
	payStatus: 'All',
	reportingGroup: 'All',
};

export default function ExhibitATabPanel() {
	const [stateApp] = useContext(AppContext);

	useEffect(() => {
		const newESFilters = [];

		// Add available values to filters
		['internalCompany', 'wellClassification', 'payStatus', 'reportingGroup'].forEach(field => {
			if (externalFilters[field] !== 'All') {
				newESFilters.push({
					field: `${field}.keyword`,
					value: externalFilters[field],
				});
			}
		});
	}, []);

	useEffect(() => {
		tableController('MyWellsTable')?.setGlobalFilter(
			stateApp.landAnalyticsSearchQuery === '*' ? '' : stateApp.landAnalyticsSearchQuery
		);
	}, [stateApp.landAnalyticsSearchQuery]);

	return (
		<>
			{/* Display well master table using MRT Grid */}
			<MRTTable
				name="MyWellsTable"
				overrideMeta={{
					isDeleteDisabled: true, // Disable delete functionality
				}}
			/>
		</>
	);
}
