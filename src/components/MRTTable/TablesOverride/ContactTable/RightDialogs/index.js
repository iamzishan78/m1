import React, { memo } from 'react';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import { tableGlobalController } from 'hookstate/tableController';
import AddContactDialogContent from 'components/Shared/M1nTable/components/SubComponents/AddContactDialogContent';
import MergeContactDrawer from 'components/Shared/M1nTable/components/SubComponents/MergeContactDrawer';
import SendMailersDialogContent from 'components/Shared/M1nTable/components/SubComponents/SendMailersDialogContent';

function ContactTableDialogs() {
	const { stateValues } = tableGlobalController.useState(['contactDialog']);
	const { type, ...rest } = stateValues.contactDialog || {};

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			contactDialog: {},
		});
	};

	const updateRows = rows => {
		tableGlobalController.updateState({
			contactDialog: {
				type,
				selectedRows: rows,
			},
		});
	};

	return (
		<>
			{type === 'addContact' && <AddContactDialogContent onClose={handleCloseDialog} parent={false} />}

			{type === 'merge' && (
				<MergeContactDrawer onClose={handleCloseDialog} rows={rest?.selectedRows} setRows={updateRows} />
			)}

			{type === 'sendMailers' && (
				<RightDialog open handleClickDialogClose={handleCloseDialog} width="700px">
					<SendMailersDialogContent
						onClose={handleCloseDialog}
						rows={rest?.selectedRows}
						setRows={updateRows}
						campaign=""
					/>
				</RightDialog>
			)}
		</>
	);
}

export default memo(ContactTableDialogs);
