import React, { memo } from 'react';
import { tableGlobalController } from 'hookstate/tableController';
import Dialog from '@material-ui/core/Dialog';
import InviteUserDialog from 'components/Shared/M1nTable/components/SubComponents/InviteUserDialog';

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
