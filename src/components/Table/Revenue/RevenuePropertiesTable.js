import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Warning as WarningIcon } from "@material-ui/icons";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import TableHeader from "components/Table/constants/revenue-properties-header-schema";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { UPDATE_PROPERTY } from "graphQL/useMutationUpdateProperty";
import { useLazyQuery, useMutation } from "@apollo/client";
import { handleSelectedGridChange } from 'components/Table/helpers'
import { setRevenueKey } from "actions";

// QUERIES
import { deepEqualObjects } from "components/Shared/functions";
// Utilities
import { usetableStyles } from "../Styles";
// actions
import { setRevenuePropertyData } from "actions";

function RevenuePropertiesTable(props) {
  const classes = usetableStyles();
  const { esIndex, setESFilters } = props;
  // redux
  const dispatch = useDispatch();
  const { revenueProperties } = useSelector((state) => state.Revenue);

  // query for Properties Table
  const [getESPaginatedList, { data: elasticData, loading }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
    fetchPolicy: "no-cache",
  });
  const [updateProperty] = useMutation(UPDATE_PROPERTY);
  // rearranging the data according to the requirements.
  // const tableData = elasticData?.getESPaginatedList?.hits?.map((eachRow) => {
  //   return {
  //     _id: eachRow._id,
  //     name: eachRow.name,
  //     number: eachRow.number,
  //     payorName: eachRow?.operator?.name,
  //     state: eachRow.state,
  //     country: eachRow?.county,
  //     source: eachRow?.source,
  //     wellApiNumber: eachRow?.well?.apiNumber,
  //     wellName: eachRow?.well?.wellName,
  //     status: eachRow?.status,
  //     checkNumber: eachRow?.lastCheck?.checkNumber,
  //     lastChecked: ne2w Date(eachRow?.lastCheck?.checkDate).toLocaleDateString(),
  //     tags: eachRow.tags?.length > 0 ? [[eachRow.tags.map((tag) => tag.tag)], eachRow.tags.length] : [[], 0],
  //   };
  // });


  const tableData = elasticData?.getESPaginatedList;
  const count = tableData?.total || 0;
  // function states
  const [columns] = useState(JSON.parse(JSON.stringify(TableHeader)));
  const [selectedRows, setSelectedRows] = useState([]);
  const [potentialIssuesList] = useState([]);

  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    searchable: true,
    rowsSelected: selectedRows.map((sR) => sR.dataIndex),
    filter: true,
    count: count,
    serverSide: true,
  };

  const esFilters = props.fromDate || props.toDate ? [
    {
      field: "lastCheck.checkDate",
      value: {
        range: {
          "lastCheck.checkDate": {
            gte: `${props.fromDate}T00:00:00.000Z`,
            lte: `${props.toDate}T00:00:00.000Z`,
          },
        },
      },
    },
  ] : props.esFilters ? props.esFilters : []

  useEffect(() => {
    handleSelectedGridChange(TableHeader, { filters: esFilters }, columns, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.esFilters])

  useEffect(() => {
    const statusIndex = columns.findIndex((c) => c.name === "status");
    if (statusIndex !== -1) {
      columns[statusIndex].options.customRender = (value, tableMeta) => (
        <>
          {!tableMeta.rowData[8] ? (
            <div
              className={classes.warningCol}
              onClick={() => {
                dispatch(setRevenueKey("wellApiDropdownIndex", tableMeta.rowIndex));
              }}
            >
              <WarningIcon />
              <div>Unmapped</div>
            </div>
          ) : (
            <div className={classes.flexAlign}>
              {value?.toLowerCase() === "approved" ? (
                <div className={classes.activeBadge} />
              ) : value?.toLowerCase() === "pending" ? (
                <div className={classes.pendingBadge} />
              ) : value?.toLowerCase() === "declined" ? (
                <div className={classes.declinedBadge} />
              ) : (
                <div className={classes.statusBtnDiv}>
                  <div className={classes.approveBtn} onClick={() => handleStatusChange(tableMeta.rowData[0], "approved")}>
                    Approve
                  </div>
                  <div className={classes.declineBtn} onClick={() => handleStatusChange(tableMeta.rowData[0], "declined")}>
                    Decline
                  </div>
                </div>
              )}
              <div>{value}</div>
            </div>
          )}
        </>
      );
    }
  }, [columns]);

  // fetaching data
  useEffect(() => {
    getESPaginatedList({
      variables: {
        esIndex: esIndex,
        pagination: {
          first: props.startPaginationAt,
          keep_alive: "1micros",
        },
        search: props.revenueSearchQuery,
        filter: "",
        sort: [],
        filters: esFilters,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getESPaginatedList, props.parent, props.revenueSearchQuery, props.filterToggle]);

  const handleStatusChange = (_id, status) => {
    let property = {
      _id,
    };
    if (status === "declined") {
      property = { ...property, status: "", well: {} };
    }
    updateProperty({
      variables: {
        property,
      },
      refetchQueries: ["getESPaginatedList"],
      awaitRefetchQueries: true,
    });
  };

  useEffect(() => {
    dispatch(setRevenuePropertyData({ loading: loading, data: elasticData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getESPaginatedList, elasticData]);


  useEffect(() => {
    if (tableData) {
      props.onPropertiesCount(count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData, props.dependencyUpdate]);

  const onTableChange = (action, tableState, rows, meta) => {
    tableState.esIndex = esIndex;
    // tableState.sort = [];


    const tableActions = props.initializeTableActions(tableState, meta, revenueProperties, columns, getESPaginatedList);
    switch (action) {
      case "filterChange":
      case "resetFilters":
        setESFilters(tableActions.pageESVariables.variables.filters);
        tableActions.genericESAction();
        break
      case "search":
      case "sort":
      case "changeRowsPerPage":
        tableActions.genericESAction();
        break;
      case "rowSelectionChange":
        setSelectedRows(tableState.selectedRows.data);
        break;
      case "changePage":
        tableActions.changeESPage();
        break;
      default:
    }
  };

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={columns}
        rows={revenueProperties?.data}
        total={false}
        potentialIssues={potentialIssuesList}
        addAble={{ type: "RevenueProperties" }}
        loading={loading}
        targetLabel={props.targetLabel}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        startPaginationAt={props.startPaginationAt}
        onTableChange={onTableChange}
        options={options}
        parent={props.parent}
        setColumnsBase={[]}
      />
    </Container>
  );
}

export default React.memo(TableHOC(RevenuePropertiesTable), deepEqualObjects);
