import React, { memo } from 'react';

import Dialog from '@material-ui/core/Dialog';

import InviteUserDialog from 'components/MRTTable/Common/Components/InviteUserDialog';

import { tableGlobalController } from 'controllers/tableController';

function UserManagementTableDialogs() {
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, ...rest } = stateValues.dialog || {};

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			dialog: {},
		});
	};

	return (
		<>
			{type === 'inviteUser' && (
				<Dialog open onClose={handleCloseDialog} maxWidth="xs">
					<InviteUserDialog
						onClose={handleCloseDialog}
						rows={rest?.activeUser}
						onSuccess={() => {}}
						setRows={() => {}}
					/>
				</Dialog>
			)}
		</>
	);
}

export default memo(UserManagementTableDialogs);
