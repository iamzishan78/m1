import React, { useContext, useMemo } from 'react';

import PropTypes from 'prop-types';

import MRTTable from 'components/MRTTable';
import TabPanels from 'components/Shared/TabPanels';

import { tableGlobalController } from 'hookstate/tableController';

import { AppContext } from 'AppContext';

const ValidationGrids = ({ propertyId }) => {
	const [stateApp] = useContext(AppContext);

	const {
		stateValues: { tabKey: selectedTab },
	} = tableGlobalController.useState(['tabKey']);

	const defaultTabLabels = ['Sales vs Production Volumes'];

	const overrideMeta = useMemo(() => {
		const tabLabels = stateApp.associatedWellIds ? ['Well Production', ...defaultTabLabels] : defaultTabLabels;

		const salesVolumeMeta = {
			defaultFilters: [{ field: 'property._id', value: propertyId }],
			tabLabels,
		};

		const wellProductionMeta = stateApp.associatedWellIds
			? {
					defaultFilters: [{ field: 'well._id', value: stateApp.associatedWellIds }],
					tabLabels,
				}
			: null;

		return { salesVolumeMeta, wellProductionMeta };
	}, [propertyId, stateApp.associatedWellIds]);

	// Create panels dynamically based on the presence of associatedWellIds
	const panels = useMemo(() => {
		const panelsArray = [
			<MRTTable
				key="SalesVolumeComparisonTable"
				name="SalesVolumeComparisonTable"
				overrideMeta={overrideMeta.salesVolumeMeta}
			/>,
		];

		if (overrideMeta.wellProductionMeta) {
			panelsArray.unshift(
				<MRTTable key="WellProductionTable" name="WellProductionTable" overrideMeta={overrideMeta.wellProductionMeta} />
			);
		}

		return panelsArray;
	}, [overrideMeta]);

	return <TabPanels key={overrideMeta.salesVolumeMeta.tabLabels[0]} value={selectedTab} panels={panels} />;
};

ValidationGrids.propTypes = {
	propertyId: PropTypes.string.isRequired,
};

export default ValidationGrids;
