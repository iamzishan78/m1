import React, { useContext, useEffect } from 'react';
import TabPanels from 'components/Shared/TabPanels';
import { AppContext } from 'AppContext';
import MRTTable from 'components/MRTTable';
import { tableController, tableGlobalController } from 'hookstate/tableController';

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
