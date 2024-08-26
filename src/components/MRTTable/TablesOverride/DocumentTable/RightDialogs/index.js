import React, { memo } from 'react';
import { tableGlobalController } from 'hookstate/tableController';
import CreateAndViewComponent from './AddandEdit';

function DocumentTableDialogs() {
  const { stateValues } = tableGlobalController.useState(['documentDialog']);
  const { type, ...rest } = stateValues.documentDialog || {};

  const handleCloseDialog = () => {
    tableGlobalController.updateState({
      documentDialog: {},
    });
  };

  return (
    <>
      {type === 'createAndAddDocument' && <CreateAndViewComponent tableKey={rest?.tableKey} selectedDocument={rest?.selectedRow} />}
    </>
  );
}

export default memo(DocumentTableDialogs);
