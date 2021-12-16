import React, { useState } from "react";
import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import TableHeader from "components/Table/constants/revenue-properties-header-schema";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { useLazyQuery } from "@apollo/client";

// QUERIES

import { deepEqualObjects } from "components/Shared/functions";

// Utilities
import { usetableStyles } from "../Styles";

function RevenuePropertiesTable(props) {
  const classes = usetableStyles();
  // query
  const [getESPaginatedList, { data: elasticData, loading }] = useLazyQuery(
    GET_ES_PAGINATED_LIST,
    {
      fetchPolicy: "no-cache",
      onCompleted: () => {
        console.log("compeleted");
      },
    }
  );
  // rearranging the data according to the requirements.
  const tableData = elasticData?.getESPaginatedList?.hits?.map((eachRow) => {
    return {
      name: eachRow.name,
      number: eachRow.number,
      payorName: eachRow?.operator?.name,
      state: eachRow.state,
      country: eachRow?.county,
      source: eachRow?.source,
      wellApiNumber: eachRow?.well?.apiNumber,
      wellName: eachRow?.well?.wellName,
      status: eachRow?.well?.status,
      checkNumber: eachRow?.lastCheck?.checkNumber,
      lastChecked: new Date(eachRow?.lastCheck?.checkDate).toLocaleDateString(),
    };
  });

  // function states
  const [columns] = useState(JSON.parse(JSON.stringify(TableHeader)));
  const [selectedRows, setSelectedRows] = useState([]);
  const [potentialIssuesList] = useState([]);
  const esIndex = "properties_flat";
  const startPaginationAt = 10;
  const extendSearchQuery = ``;

  // const count = tableData?.total || 0
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    searchable: true,
    rowsSelected: selectedRows.map((sR) => sR.dataIndex),
    filter: true,
    count: 10,
    serverSide: true,
  };
  // added dummy rows for just display

  // fetaching data
  React.useEffect(() => {
    getESPaginatedList({
      variables: {
        esIndex,
        pagination: {
          first: startPaginationAt,
          keep_alive: "1micros",
        },
        search: ``,
        sort: [],
        filter: "",
      },
    });
  }, [getESPaginatedList, props.parent]);

  const onTableChange = (action, tableState, rows, meta) => {
    tableState.esIndex = esIndex;
    tableState.sort = [];
    const tableActions = props.initializeTableActions(
      tableState,
      meta,
      tableData,
      columns,
      getESPaginatedList
    );
    switch (action) {
      case "search":
      case "sort":
      case "filterChange":
      case "resetFilters":
      case "changeRowsPerPage":
        tableActions.extendSearchQuery(extendSearchQuery);
        tableActions.genericESAction();
        break;
      case "rowSelectionChange":
        setSelectedRows(tableState.selectedRows.data);
        break;
      case "changePage":
        tableActions.extendSearchQuery(extendSearchQuery);
        tableActions.changeESPage();
        break;
      default:
    }
  };
  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={columns}
        rows={tableData}
        total={false}
        potentialIssues={potentialIssuesList}
        addAble={{ type: "RevenueProperties" }}
        loading={loading}
        targetLabel={props.targetLabel}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        startPaginationAt={null}
        onTableChange={onTableChange}
        options={options}
        parent={props.parent}
        setColumnsBase={[]}
      />
    </Container>
  );
}

export default React.memo(TableHOC(RevenuePropertiesTable), deepEqualObjects);
