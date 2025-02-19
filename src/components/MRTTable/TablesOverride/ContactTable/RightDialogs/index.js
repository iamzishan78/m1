import React, { memo } from 'react';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import MergeContactDrawer from 'components/MRTTable/Common/Components/MergeContactDrawer';
import SendMailersDialogContent from 'components/MRTTable/Common/Components/SendMailersDialogContent';
import AddContactDialogContent from 'components/MRTTable/TablesOverride/ContactTable/RightDialogs/addContact';

import { globalStateController } from 'controllers/globalStateController';
import { tableGlobalController } from 'controllers/tableController';

import MetaField from 'utils/MetaField';

function ContactTableDialogs({ tableKey }) {
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { globalStateValues } = globalStateController.useState(['showFieldModal'], 'globalStateValues');

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

			{/* Added Meta data field Component in Contact Grid */}
			{globalStateValues.showFieldModal && <MetaField columns={[]} category="Contacts" tableKey={tableKey} />}
		</>
	);
}

export default memo(ContactTableDialogs);
