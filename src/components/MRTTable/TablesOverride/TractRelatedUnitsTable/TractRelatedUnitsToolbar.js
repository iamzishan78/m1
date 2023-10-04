import React, { memo } from "react";
import { Button } from "@material-ui/core";

function TractRelatedUnitsToolBar({ table, tableKey }) {
  return (
    <>
      <Button variant="contained" color="primary">
        + ADD RELATED UNIT
      </Button>
    </>
  );
}

export default memo(TractRelatedUnitsToolBar);
