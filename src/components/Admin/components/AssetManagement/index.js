import React, { useEffect, useMemo } from 'react';

import { isEmpty } from 'lodash';

import MRTTable from 'components/MRTTable';

import { tableGlobalController } from 'stateManagement/tableController';

export default function AssetManagement() {
	const { stateValues } = tableGlobalController.useState(['selectedAsset']);
	const { selectedAsset } = stateValues || {};

	const CustomEntitiesOverrideMeta = useMemo(
		() => ({
			tableHeading: 'Entities',
			onClickedRow: selectedRow => {
				tableGlobalController.updateState({
					selectedAsset: selectedRow,
				});
			},
		}),
		[]
	);

	const CustomAssetOverrideMeta = useMemo(
		() => ({
			defaultFilters: [{ field: 'assetId', value: selectedAsset?._id }],
			tableHeading: `${selectedAsset?.name}`,
		}),
		[selectedAsset]
	);

	// Clean up the selectedAsset on unmount
	useEffect(() => {
		return () => {
			tableGlobalController.updateState({
				selectedAsset: {},
			});
		};
	}, []);

	return (
		<>
			<div
				style={{
					marginTop: '55px',
					padding: '20px',
				}}
			>
				<MRTTable name="CustomAssetEntitiesTable" overrideMeta={CustomEntitiesOverrideMeta} />
			</div>

			{!isEmpty(selectedAsset) && (
				<div
					style={{
						padding: '20px',
					}}
				>
					<MRTTable name="CustomAssetTable" overrideMeta={CustomAssetOverrideMeta} key={selectedAsset?._id} />
				</div>
			)}
		</>
	);
}
