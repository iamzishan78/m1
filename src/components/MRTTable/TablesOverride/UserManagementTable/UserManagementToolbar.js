import React from 'react';

import UserManagementTableDialogs from 'components/MRTTable/TablesOverride/UserManagementTable/RightDialogs';
import ToolbarButton from 'components/Shared/ui/ToolbarButton';

import { tableGlobalController } from 'stateManagement/tableController';

const UserManagementToolbar = ({ table, tableKey }) => {
	const isSomeRowsSelected = table.getIsSomeRowsSelected();
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	return (
		<>
			{!isSomethingSelected && (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<ToolbarButton
						label="+ ADD USER"
						onClick={() => {
							tableGlobalController.updateState({
								dialog: {
									type: 'inviteUser',
								},
							});

							table.resetRowSelection();
						}}
					/>
					<UserManagementTableDialogs />
				</div>
			)}
		</>
	);
};

export default UserManagementToolbar;
