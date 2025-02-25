import React, { memo } from 'react';

import ExportOwnersAndContacts from 'components/Shared/ExportOwnerAndContacts';
import RecalculateSlideout from 'components/Common/RecalculateSlideout';

import { tableGlobalController } from 'stateManagement/tableController';

import AddParcelOwnerDialogContent from '../Dialog/AddParcelOwnerDialogContent';

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

			{type === 'recalculate' && (
				<RecalculateSlideout onClose={handleCloseDialog} rows={rest?.selectedRows} setRows={updateRows} />
			)}
		</>
	);
}

export default memo(TractInterestTableDialogs);
