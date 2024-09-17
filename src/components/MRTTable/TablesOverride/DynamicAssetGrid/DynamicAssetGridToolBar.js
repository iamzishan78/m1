import React, { memo } from 'react';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import Button from '@material-ui/core/Button';
import DynamicAssetTableDialogs from "components/MRTTable/TablesOverride/DynamicAssetGrid/RightDialogs/index"

const keysToRemove = ["over-ride-checkbox", "_id", "lastUpdateBy.name.keyword", "createBy.name.keyword", "createAt", "lastUpdateAt"];

function DynamicAssetGridToolBar({ table, tableKey }) {
  const Controller = tableController(tableKey);
  const tableState = Controller.useState(['rowSelection', 'fetchDynamicSchema', 'TableSchema']);
  const tableStateValues = tableState.stateValues;
  const isSomeRowsSelected = table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
  const isAllRowsSelected = table.getIsAllRowsSelected();
  const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
  const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

  const handleClick = () => {
    tableGlobalController.updateState({
      dialog: {
        type: 'addAndUpdateInRunTimeModel',
        columns: tableStateValues.TableSchema.filter(column => !keysToRemove.includes(column.name)),
        tableName: tableStateValues.fetchDynamicSchema.tableName
      },
    });
  }
  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClick}>
        {`+ ADD ${tableStateValues.fetchDynamicSchema.tableName}`}
      </Button>
      <DynamicAssetTableDialogs />
    </>
  );
}

export default memo(DynamicAssetGridToolBar);
