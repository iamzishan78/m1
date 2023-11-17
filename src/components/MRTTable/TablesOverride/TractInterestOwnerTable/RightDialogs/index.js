import React, { memo } from 'react';
import { tableGlobalController } from 'hookstate/tableController';
import AddParcelOwnerDialogContent from '../Dialog/AddParcelOwnerDialogContent';
import ExportOwnersAndContacts from 'components/Shared/ExportOwnerAndContacts';
import RecalculateSlideout from 'components/Table/Shape/RecalculateSlideout';

function TractInterestTableDialogs() {
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, ...rest } = stateValues.dialog || {};

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			dialog: {},
		});
	};

	const updateRows = rows => {
		tableGlobalController.updateState({
			dialog: {
				type,
				selectedRows: rows,
			},
		});
	};

	return (
		<>
			{type === 'addTractInterest' && (
				<AddParcelOwnerDialogContent
					onClose={handleCloseDialog}
					customLayerId={rest?.customLayer?._id}
					customLayer={rest?.customLayer}
					selectedRow={rest?.selectedRow}
				/>
			)}

			{type === 'exportOwnersAndContact' && (
				<ExportOwnersAndContacts
					onClose={handleCloseDialog}
					search={rest?.search}
					filters={rest?.filters}
					total={rest?.total}
					isSelectAll={rest?.isAllRowsSelected}
					rows={rest?.selectedRows}
					esIndex={rest?.esIndex}
					type="Tract"
					open
				/>
			)}

			{type === 'recalculate' && (
				<RecalculateSlideout onClose={handleCloseDialog} rows={rest?.selectedRows} setRows={updateRows} />
			)}
		</>
	);
}

export default memo(TractInterestTableDialogs);
