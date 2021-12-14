import React, { useState } from "react";
import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import TableHeader from "components/Table/constants/revenue-properties-header-schema";

// QUERIES

import { deepEqualObjects } from "components/Shared/functions";

// Utilities
import { usetableStyles } from "../Styles";

function RevenuePropertiesTable(props) {
  const classes = usetableStyles();

  // function states
  const [columns] = useState(JSON.parse(JSON.stringify(TableHeader)));
  const [selectedRows] = useState([]);
  const [potentialIssuesList] = useState([]);

  // const count = tableData?.total || 0
  const options = {
    // rowsPerPageOptions: [10, 25, 50, 100],
    searchable: true,
    rowsSelected: selectedRows.map((sR) => sR.dataIndex),
    filter: true,
    count: 10,
    serverSide: true,
  };
  // added dummy rows for just display
  const testRows = [
    {
      _id: "61aeb76ee1d4eb43b897354a",
      propertyName: "LSE 100-100001-L3 JULIA MEINERS",
      propertyCode: "100-100001",
      payorName: "Eric Calpton",
      state: "OH",
      country: "US",
      source: "Uniliver",
      wellApiNumber: "#123556",
      wellName: "Oliver Foundations",
      status: "Approved",
      type: "A1",
      amount: "120.32",
      checkNumber: "A13d45tyg",
      lastCheckDate: "12/12/2020",
    },
    {
      _id: "61aeb76ee1d4eb4ab897354a",
      propertyName: "LSE 100-100001-L3 JULIA MEINERS",
      propertyCode: "100-1as00001",
      payorName: "John Elton",
      state: "OH",
      country: "US",
      source: "Uniliver",
      wellApiNumber: "#123556",
      wellName: "Oliver Foundations",
      status: "Pending",
      type: "A1",
      amount: "120.32",
      checkNumber: "A13d45tyg",
      lastCheckDate: "12/12/2020",
    },
    {
      _id: "61aeb76ee1d4eb4ab897354a",
      propertyName: "LSE 100-100001-L3 JULIA MEINERS",
      propertyCode: "100-1as00001",
      payorName: "Saad Bin Khalid",
      state: "OH",
      country: "US",
      source: "Uniliver",
      wellApiNumber: "#123556",
      wellName: "Oliver Foundations",
      type: "A1",
      amount: "120.32",
      checkNumber: "A13d45tyg",
      lastCheckDate: "12/12/2020",
    },
    {
      _id: "90aeb76ee1d4eb4ab897354a",
      propertyName: "LSE 100-100001-L3 JULIA MEINERS",
      propertyCode: "100-10a0001",
      payorName: "Saad Bin Khalid",
      state: "OH",
      country: "US",
      source: "Uniliver",
      wellApiNumber: "#123556",
      wellName: "Oliver Foundations",
      status: "Declined",
      type: "A1",
      amount: "120.32",
      checkNumber: "A13d45tyg",
      lastCheckDate: "12/12/2020",
    },
  ];

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={columns}
        rows={testRows}
        total={false}
        potentialIssues={potentialIssuesList}
        addAble={{ type: "RevenueProperties" }}
        loading={false}
        targetLabel="Revenue Properties"
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        startPaginationAt={null}
        // onTableChange={onTableChange}
        options={options}
        parent={props.parent}
        setColumnsBase={[]}
      />
    </Container>
  );
}

export default React.memo(TableHOC(RevenuePropertiesTable), deepEqualObjects);
