import React from "react";
import { TableContextProvider } from "./TableContext";

import Table from "./Table";

export default function TableProvider(props) {
  return (
    <TableContextProvider>
      <Table
        parent={props.parent}
        header={props.header}
        columns={props.columns}
        rows={props.rows}
        addAble={props.addAble}
        targetLabel={props.targetLabel}
        ownersColumn={props.ownersColumn}
      />
    </TableContextProvider>
  );
}
