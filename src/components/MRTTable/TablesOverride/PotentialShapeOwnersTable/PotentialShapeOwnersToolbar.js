import React from 'react';
import ToolbarButton from 'components/Shared/ui/ToolbarButton';
import { tableController, tableGlobalController } from 'hookstate/tableController';

const PotentialShapeOwnersToolbar = ({ table, tableKey }) => {
	const Controller = tableController(tableKey);
	const { tableStateValues } = Controller.useState(['customProps'], 'tableStateValues');
	const isSomeRowsSelected = table.getIsSomeRowsSelected();
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);

	const formatInterestForImport = () => {
		const { customLayer } = tableStateValues.customProps;

		return selectedRows.map(row => ({
			...row,
			parcel: {
				_id: customLayer._id,
				isSuggested: true,
			},
		}));
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			{isSomethingSelected && (
				<ToolbarButton
					label="+ ADD TO TRACT"
					disabled={!isSomethingSelected}
					onClick={() => {
						tableGlobalController.updateState({
							dialog: {
								type: 'multipleOwnerToContact',
								rows: formatInterestForImport(selectedRows),
								jobType: 'PARCELINTERESTS',
								jobName: 'Converting potential owner to parcel owner',
							},
						});

						table.resetRowSelection();
					}}
				/>
			)}
		</div>
	);
};

export default PotentialShapeOwnersToolbar;
