import React, { useMemo, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import MRTTable from 'components/MRTTable';

import { tableController, tableGlobalController } from 'hookstate/tableController';

import { AppContext } from 'AppContext';

function DynamicAssetGrid() {
	const [stateApp] = useContext(AppContext); // Accessing global state from AppContext
	const { activeModule } = useSelector(({ common }) => common);

	// Override meta for dynamic grid
	const overrideMeta = useMemo(
		() => ({
			esIndex: activeModule.title.replace(/\s+/g, '').toLowerCase() + '_flats',
			assetName: activeModule.title,
			fetchDynamicSchema: {
				variables: {
					tableName: activeModule.title,
				},
				tableName: activeModule.title,
			},
		}),
		[activeModule]
	);

	// Re-Initialize table controller
	useEffect(() => {
		tableGlobalController.reInitialized();
	}, [activeModule]);

	// Apply global filter from the land search query in the stateApp context
	useEffect(() => {
		tableController('DynamicAssetTable').setGlobalFilter(stateApp.landSearchQuery);
	}, [stateApp.landSearchQuery]);

	return (
		<div
			style={{
				marginTop: '65px',
			}}
		>
			{/* Dynamic asset grid */}
			<MRTTable name="DynamicAssetTable" overrideMeta={overrideMeta} />
		</div>
	);
}
export default DynamicAssetGrid;
