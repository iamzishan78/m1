import React, { memo } from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import MetaFieldList from 'components/MRTTable/Common/MetaData/MetaFieldList'
import { tableController } from "hookstate/tableController";
import MetaField from "components/Table/helpers/MetaField";
import { globalStateController } from "hookstate/globalStateController";

function AgreementToolBar({ table, tableKey }) {
  const Controller = tableController(tableKey);
  const tableState = Controller.useState(['metaFieldList', 'fetchMetaData', 'TableSchema']);
  const tableStateValues = tableState.stateValues;

  const { globalStateValues } = globalStateController.useState(['showFieldModal'], 'globalStateValues');

  return (
    <>
      {!!(tableStateValues?.metaFieldList) && <MetaFieldList tableKey={tableKey} />}
      {!!globalStateValues.showFieldModal && (
        <MetaField
          tableKey={tableKey}
          columns={tableStateValues?.TableSchema}
          category={tableStateValues?.fetchMetaData?.category}
        />
      )}
    </>
  );
}

export default memo(AgreementToolBar);
