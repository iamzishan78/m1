import React from "react";
import { TableContextProvider } from "./TableContext";
import Table from "./Table";

export default function TableProvider(props) {
  return (
    <TableContextProvider>
      <Table
        loading={props.loading}
        header={props.header}
        columns={props.columns}
        rows={props.rows}
        addAble={props.addAble}
        targetLabel={props.targetLabel}
      />
    </TableContextProvider>
  );
}
