import React from 'react';
import ToolbarButton from 'components/Shared/ui/ToolbarButton';
import { simpleTableGlobalController } from 'hookstate/simpleTableController';
import UserManagementTableDialogs from 'components/MRSimpleTable/TablesOverride/UserManagementTable/RightDialogs';

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
              simpleTableGlobalController.updateState({
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
