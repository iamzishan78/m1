import React from 'react';
import { useSelector } from 'react-redux';

import { debounce } from 'lodash';

import { addTrailingZeros } from 'components/Shared/functions';
import SelectFilter from 'components/Shared/ui/SelectFilter';
import ToggleSwitch from 'components/Shared/ui/ToggleSwitch';
import ToolbarButton from 'components/Shared/ui/ToolbarButton';

import { calculateStandardNraForUnit } from 'utils/calculatedNraHelper';
import { LOD_YEAR, LOD_YEAR_OPTIONS } from 'utils/consts';

import { tableController, tableGlobalController } from 'stateManagement/tableController';

const PotentialOwnersToolbar = ({ table, tableKey }) => {
	const Controller = tableController(tableKey);
	const { tableStateValues } = Controller.useState(['customProps'], 'tableStateValues');
	const isSomeRowsSelected = table.getIsSomeRowsSelected();
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);

	const workspaceSettings = useSelector(({ app }) => app.workspaceSettings);

	const updateCustomProps = debounce(Controller.updateCustomProps, 500);

	const formatInterestForImport = selectedRows => {
		const { customLayer } = tableStateValues.customProps;

		if (!customLayer) {
			return selectedRows;
		}

		const uAcres = customLayer.shapeJson?.properties?.uAcres || 0;

		return selectedRows.map(row => {
			const ownershipPercentage = addTrailingZeros(row.ownershipPercentage.toFixed(8));
			return {
				...row,
				shape: {
					_id: customLayer._id,
					shapeType: 'Unit',
					working_interest: row.interestType === 'WORKING INTEREST' ? ownershipPercentage : '',
					royalty_interest: row.interestType === 'ROYALTY INTEREST' ? ownershipPercentage : '',
					orri: row.interestType === 'OVERRIDING ROYALTY' ? ownershipPercentage : '',
					nra: calculateStandardNraForUnit({
						uAcres,
						ownershipPercentage,
						workspaceSettings,
					}),
					uUnitPricing: customLayer.shapeJson?.properties?.uUnitPricing || 0,
					uMaxUnitPricing: customLayer.shapeJson?.properties?.uMaxUnitPricing || 0,
					globalOwnerId: row.globalOwnerId,
					isSuggested: true,
				},
			};
		});
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<SelectFilter
				options={LOD_YEAR_OPTIONS}
				initialValue={LOD_YEAR}
				onValueChange={year => {
					updateCustomProps({ year });
					table.resetRowSelection();
				}}
			/>

			<ToggleSwitch
				label="Filter by unit wells"
				onChange={filterByWells => {
					updateCustomProps({ filterByWells });
					table.resetRowSelection();
				}}
				customLabelStyle={{ marginRight: '0px' }}
			/>

			{isSomethingSelected && (
				<ToolbarButton
					label="+ ADD TO Unit"
					disabled={!isSomethingSelected}
					onClick={() => {
						tableGlobalController.updateState({
							dialog: {
								type: 'multipleOwnerToContact',
								rows: formatInterestForImport(selectedRows),
								jobType: 'SHAPEOWNER',
								jobName: 'Convert potential owner to unit owner',
							},
						});

						table.resetRowSelection();
					}}
				/>
			)}
		</div>
	);
};

export default PotentialOwnersToolbar;
