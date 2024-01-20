import React, { memo } from 'react';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import { tableGlobalController } from 'hookstate/tableController';
import AddContactDialogContent from 'components/Shared/M1nTable/components/SubComponents/AddContactDialogContent';
import MergeContactDrawer from 'components/Shared/M1nTable/components/SubComponents/MergeContactDrawer';
import SendMailersDialogContent from 'components/Shared/M1nTable/components/SubComponents/SendMailersDialogContent';

function ContactTableDialogs() {
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
						campaign={rest.campaign}
					/>
				</RightDialog>
			)}
		</>
	);
}

export default memo(ContactTableDialogs);
