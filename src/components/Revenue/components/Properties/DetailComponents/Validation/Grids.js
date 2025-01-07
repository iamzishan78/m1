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

	const defaultTabLabels = ['Sales vs Production Volumes'];

	const overrideMeta = useMemo(() => {
		const tabLabels = stateApp.associatedWellIds ? ['Well Production', ...defaultTabLabels] : defaultTabLabels;

		const salesVolumeMeta = {
			defaultFilters: [{ field: 'property._id', value: propertyId }],
			tabLabels,
		};

		const wellProductionMeta = {
			defaultFilters: [{ field: 'well._id', value: stateApp.associatedWellIds }],
			tabLabels,
		};

		return { salesVolumeMeta, wellProductionMeta };
	}, [propertyId, stateApp.associatedWellIds]);

	return (
		<div>
			<TabPanels
				key={overrideMeta.salesVolumeMeta.tabLabels[0]}
				value={selectedTab}
				panels={[
					<MRTTable
						key="WellProductionTable"
						name="WellProductionTable"
						overrideMeta={overrideMeta.wellProductionMeta}
					/>,
					<MRTTable
						key="SalesVolumeComparisonTable"
						name="SalesVolumeComparisonTable"
						overrideMeta={overrideMeta.salesVolumeMeta}
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
