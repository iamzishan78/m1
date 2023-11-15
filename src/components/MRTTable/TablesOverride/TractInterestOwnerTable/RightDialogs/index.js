import React, { memo } from 'react';
import { tableGlobalController } from 'hookstate/tableController';
import AddParcelOwnerDialogContent from '../Dialog/AddParcelOwnerDialogContent';
import ExportOwnersAndContacts from 'components/Shared/ExportOwnerAndContacts';
import RecalculateSlideout from 'components/Table/Shape/RecalculateSlideout';

function TractInterestTableDialogs() {
	const { stateValues } = tableGlobalController.useState(['tractInterestDialog']);
	const { type, ...rest } = stateValues.tractInterestDialog || {};

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			tractInterestDialog: {},
		});
	};

	const updateRows = rows => {
		tableGlobalController.updateState({
			tractInterestDialog: {
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
