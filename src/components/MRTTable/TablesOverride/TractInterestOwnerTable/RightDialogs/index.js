import React, { memo } from 'react';
import { tableGlobalController } from 'hookstate/tableController';
import AddParcelOwnerDialogContent from 'components/Shared/M1nTable/components/SubComponents/AddParcelOwnerDialogContent';
import ExportOwnersAndContacts from 'components/Shared/ExportOwnerAndContacts';

function TractInterestTableDialogs() {
	const { stateValues } = tableGlobalController.useState(['tractInterestDialog']);
	const { type, ...rest } = stateValues.tractInterestDialog || {};

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			tractInterestDialog: {},
		});
	};

	return (
		<>
			{type === 'addTractInterest' && (
				<AddParcelOwnerDialogContent
					onClose={handleCloseDialog}
					customLayerId={rest?.customLayer._id}
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
					isSelectAll={rest?.isSelectAll}
					rows={rest?.selectedRows}
					esIndex={rest?.esIndex}
					type="Tract"
					open
				/>
			)}
		</>
	);
}

export default memo(TractInterestTableDialogs);
