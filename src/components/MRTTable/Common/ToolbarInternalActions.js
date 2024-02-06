import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import {
  MRT_ShowHideColumnsButton as MRTShowHideColumnsButton,
  MRT_ToggleFiltersButton as MRTToggleFiltersButton,
  MRT_ToggleGlobalFilterButton as MRTToggleGlobalFilterButton,
} from 'material-react-table';

const ToolbarInternalActions = ({ table, toolbarInternalActions }) => {
  if (!table || !toolbarInternalActions) return null;

  return (
    <div style={toolbarInternalActions.style}>
      <MRTToggleGlobalFilterButton table={table} />
      <MRTToggleFiltersButton table={table} />
      <MRTShowHideColumnsButton table={table} />

      {toolbarInternalActions.children}

      {toolbarInternalActions.onClose && (
        <Tooltip arrow title={'Close'} style={{ padding: '8px' }}>
          <IconButton
            aria-label={'Close'}
            onClick={toolbarInternalActions.onClose}
            title={undefined}
          >
            <Close />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default ToolbarInternalActions;
