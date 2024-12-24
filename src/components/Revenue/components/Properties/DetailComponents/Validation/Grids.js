import React, { useMemo } from 'react';

import MRTTable from 'components/MRTTable';
import TabPanels from 'components/Shared/TabPanels';
import TabButtons from 'components/Shared/TabPanels/TabButtons';
import AssociatedWellsProductionTable from 'components/Table/Revenue/AssociatedWellsProductionTable';

import { tableGlobalController } from 'hookstate/tableController';

const ValidationGrids = ({ associatedWellIds, propertyId }) => {
	const setSelectedTab = tableGlobalController.setSelectedTab;
	const {
		stateValues: { tabKey: selectedTab },
	} = tableGlobalController.useState(['tabKey']);

	const Header = () => (
		<TabButtons
			labels={['Well Production', 'Sales vs Production Volumes']}
			value={selectedTab}
			setValue={n => {
				setSelectedTab(n);
			}}
		/>
	);

	const SalesVolumeOverrideMeta = useMemo(
		() => ({
			defaultFilters: [{ field: 'property._id', value: propertyId }],
			tabLabels: ['Well Production', 'Sales vs Production Volumes'],
		}),
		[propertyId]
	);

	return (
		<div>
			<TabPanels
				value={selectedTab}
				panels={[
					<AssociatedWellsProductionTable
						targetLabel="propertyInterest"
						parent="PropertyAssociatedWell"
						header={<Header />}
						associatedWellIds={associatedWellIds}
					/>,
					<MRTTable name="SalesVolumeComparisonTable" overrideMeta={SalesVolumeOverrideMeta} />,
				]}
			/>
		</div>
	);
};

export default ValidationGrids;
