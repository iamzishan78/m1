import React, { useContext, useMemo } from 'react';

import MRTTable from 'components/MRTTable';
import TabPanels from 'components/Shared/TabPanels';

import { tableGlobalController } from 'hookstate/tableController';
import { AppContext } from 'AppContext';
import PropTypes from 'prop-types';

const ValidationGrids = ({ propertyId }) => {
	const [stateApp] = useContext(AppContext);

	const {
		stateValues: { tabKey: selectedTab },
	} = tableGlobalController.useState(['tabKey']);

	const SalesVolumeOverrideMeta = useMemo(
		() => ({
			defaultFilters: [{ field: 'property._id', value: propertyId }],
			tabLabels: ['Well Production', 'Sales vs Production Volumes'],
		}),
		[propertyId]
	);

	// Ensure `WellProductionOverrideMeta` updates when `stateApp.associatedWellIds` changes
	const WellProductionOverrideMeta = useMemo(() => {
		return {
			defaultFilters: [{ field: 'well._id', value: stateApp.associatedWellIds }],
			tabLabels: ['Well Production', 'Sales vs Production Volumes'],
		};
	}, [stateApp.associatedWellIds]);

	return (
		<div>
			<TabPanels
				value={selectedTab}
				panels={[
					<MRTTable key={'WellProductionTable'} name="WellProductionTable" overrideMeta={WellProductionOverrideMeta} />,
					<MRTTable
						key={'SalesVolumeComparisonTable'}
						name="SalesVolumeComparisonTable"
						overrideMeta={SalesVolumeOverrideMeta}
					/>,
				]}
			/>
		</div>
	);
};

ValidationGrids.propTypes = {
	propertyId: PropTypes.string.isRequired,
};

export default ValidationGrids;
