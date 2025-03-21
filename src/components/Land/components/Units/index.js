import React, { useContext, useEffect } from 'react';

import MRTTable from 'components/MRTTable';
import TabPanels from 'components/Shared/TabPanels';

import { tableController, tableGlobalController } from 'stateManagement/tableController';

import { AppContext } from 'AppContext';

function Units() {
	const [stateApp] = useContext(AppContext);

	const {
		stateValues: { tabKey: selectedTab },
	} = tableGlobalController.useState(['tabKey']);

	useEffect(() => {
		const tableKey = ['UnitTable', 'UnitInterestTable'];

		tableController(tableKey[selectedTab]).setGlobalFilter(stateApp.landSearchQuery);
	}, [selectedTab, stateApp.landSearchQuery]);

	return (
		<div
			style={{
				marginTop: '65px',
				// marginLeft: '-10px'
			}}
		>
			<TabPanels
				value={selectedTab}
				panels={[
					<div style={{ padding: '0rem 1.5rem 0rem 1.5rem' }}>
						<MRTTable
							name="UnitTable"
							overrideMeta={{
								tabLabels: ['Units', 'Unit Interests'],
							}}
						/>
					</div>,
					<div style={{ padding: '0rem 1.5rem 0rem 1.5rem' }}>
						<MRTTable
							name="UnitInterestTable"
							overrideMeta={{
								tabLabels: ['Units', 'Unit Interests'],
							}}
						/>
					</div>,
				]}
			/>
		</div>
	);
}

export default Units;
