import React, { useState } from 'react';

import TabButtons from 'components/Shared/TabPanels/TabButtons';
import AssociatedWellsProductionTable from 'components/Table/Revenue/AssociatedWellsProductionTable';
import SalesProductionVolume from 'components/Table/Revenue/SalesProductionVolume';

const ValidationGrids = ({ associatedWellIds, propertyId }) => {
	const [selectedTab, setSelectedTab] = useState(1);

	const Header = () => (
		<TabButtons
			labels={['Well Production', 'Sales vs Production Volumes']}
			value={selectedTab}
			setValue={n => {
				setSelectedTab(n);
			}}
		/>
	);

	return (
		<div className={`flex column justifyStart alignStart w-100`}>
			{selectedTab === 0 && (
				<AssociatedWellsProductionTable
					targetLabel="propertyInterest"
					parent="PropertyAssociatedWell"
					header={<Header />}
					associatedWellIds={associatedWellIds}
				/>
			)}
			{selectedTab === 1 && (
				<SalesProductionVolume
					targetLabel="propertyInterest"
					parent="PropertyAssociatedWell"
					header={<Header />}
					propertyId={propertyId}
				/>
			)}
		</div>
	);
};

export default ValidationGrids;
