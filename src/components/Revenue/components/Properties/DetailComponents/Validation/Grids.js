import React, { useMemo } from 'react';

import PropTypes from 'prop-types';

import MRTTable from 'components/MRTTable';
import TabPanels from 'components/Shared/TabPanels';

import { tableGlobalController } from 'hookstate/tableController';

const ValidationGrids = ({ propertyId, associatedWellIds }) => {
	const {
		stateValues: { tabKey: selectedTab },
	} = tableGlobalController.useState(['tabKey']);

	const defaultTabLabels = ['Sales vs Production Volumes'];

	const overrideMeta = useMemo(() => {
		const tabLabels = associatedWellIds?.length > 0 ? ['Well Production', ...defaultTabLabels] : defaultTabLabels;

		const salesVolumeMeta = {
			defaultFilters: [{ field: 'property._id', value: propertyId }],
			tabLabels,
		};

		const wellProductionMeta =
			associatedWellIds?.length > 0
				? {
						defaultFilters: [{ field: 'well._id', value: associatedWellIds }],
						tabLabels,
					}
				: null;

		return { salesVolumeMeta, wellProductionMeta };
	}, [propertyId, associatedWellIds]);

	// Create panels dynamically based on the presence of associatedWellIds
	const panels = useMemo(() => {
		const panelsArray = [
			<MRTTable
				key="SalesVolumeComparisonTable"
				name="SalesVolumeComparisonTable"
				overrideMeta={overrideMeta.salesVolumeMeta}
			/>,
		];

		if (associatedWellIds?.length > 0) {
			panelsArray.unshift(
				<MRTTable key="WellProductionTable" name="WellProductionTable" overrideMeta={overrideMeta.wellProductionMeta} />
			);
		}

		return panelsArray;
	}, [overrideMeta, associatedWellIds]);

	return <TabPanels key={overrideMeta.salesVolumeMeta.tabLabels[0]} value={selectedTab} panels={panels} />;
};

ValidationGrids.propTypes = {
	propertyId: PropTypes.string.isRequired,
};

export default ValidationGrids;
