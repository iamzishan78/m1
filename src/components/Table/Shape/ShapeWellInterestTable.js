import React, { useState, useEffect } from "react";
// context

import { Container, Button } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES
import { useLazyQuery, useMutation } from "@apollo/client";
// import { UPDATEWELLINTEREST } from "graphQL/useMutationUpdateWellInterest";
import { UPDATE_SHAPE_WELL_INTEREST } from "graphQL/useMutationUpdateShapeWellInterest";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/unitperwell-header-schema.js";

// Utilities
import { usetableStyles } from "../Styles";
import AddUnitInterestDialog from "components/Shared/M1nTable/components/SubComponents/AddUnitWellInterestDialog";
import { AutoCompleteFilter } from "../AutoCompleteFilter";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";

function ShapeWellInterestTable(props) {
  const classes = usetableStyles();
  const [addToTable, setAddToTable] = useState(false);

  // function states
  const [columns, Columns] = useState([]);
  const [selectedRow, selectRow] = useState([]);

  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };

  // queries

  const [getESPaginatedList, { data: elasticData }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
    fetchPolicy: "no-cache",
    onCompleted: () => {
      props.setLoading(false);
    },
  });

  const [updateShapeWellInterests] = useMutation(UPDATE_SHAPE_WELL_INTEREST, {
    refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"], awaitRefetchQueries: true
  });
  const tableData = elasticData?.getESPaginatedList;

  const addAble = {
    type: "wellInterest",
    customLayer: props.customLayer,
    customLayerId: props.customLayer._id,
  };

  const startPaginationAt = 25;
  const extendSearchQuery = `shape._id:${props.customLayer._id}`;
  const esIndex = "shapewellinterests_flat";

  ////////////Contact Wells begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.customLayer?._id)
      getESPaginatedList({
        variables: {
          esIndex,
          pagination: {
            first: startPaginationAt,
            keep_alive: "1micros",
          },
          search: `shape._id:${props.customLayer._id}`,
        },
      });
  }, [props.customLayer]);

  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      const objectsIdsArray = tableData?.hits?.map((hit) => hit._id);
      props.initializeGenericData(objectsIdsArray, ["comments", "tags"]);
    }
  }, [tableData]);

  useEffect(() => {
    if (props.shapeType === 'Agreement') {
      const indexOfTrack = TableHeader.findIndex((column) => column.name === "isTracked");
      TableHeader[indexOfTrack].options.display = false
      TableHeader[indexOfTrack].options.viewColumns = false
    }
  }, [props.shapeType]);

  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      let hits = tableData?.hits;
      hits = hits.map((hit) => {
        hit.Well = `${hit.apiNumber} - ${hit.wellName}`
        hit = props.setGenricData(hit, hit._id, ["comments", "tracks", "tags"]);
        return hit;
      });
      props.setRows(hits);
      TableHeader.forEach((column) => {
        if (column?.options?.filter) {
          column.options = {
            ...column.options,
            filter: true,
            filterType: "custom",
            filterOptions: {
              display: (filterList, onChange, index, column) => {
                column.filterKey = TableHeader.find((el) => el.name === column.name)?.esKey;
                return (
                  <AutoCompleteFilter
                    filterList={filterList}
                    column={column}
                    index={index}
                    onChange={onChange}
                    extendSearchQuery={extendSearchQuery}
                    query={GET_ES_FILTER_LIST}
                    esIndex={esIndex}
                  />
                );
              },
            },
          };
        }
      });

      setColumns(TableHeader);
      props.setLoading(false);
    } else if (tableData?.hits?.length === 0) {
      props.setRows([]);
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

  ////////////Contact Wells end///////////////////////////////////////////////

  const onTableChange = (action, tableState, rows, meta) => {
    tableState.esIndex = esIndex;
    const tableActions = props.initializeTableActions(tableState, meta, tableData, columns, getESPaginatedList);
    switch (action) {
      case "search":
      case "sort":
      case "filterChange":
      case "resetFilters":
      case "changeRowsPerPage":
        tableActions.extendSearchQuery(extendSearchQuery);
        tableActions.genericESAction();
        break;
      case "changePage":
        tableActions.extendSearchQuery(extendSearchQuery);
        tableActions.changeESPage();
        break;
      default:
    }
  };

  const count = tableData?.total || 0;
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    count: count,
    serverSide: true,
    searchable: true,
    filter: true,
    customToolbar: () => {
      return (
        <div style={{ display: "inline", float: "left", marginRight: "15px", marginTop: "5px" }}>
          <Button
            color="secondary"
            className={classes.multiSelectionTopBarButtons}
            onClick={() => {
              setAddToTable(true);
              selectRow(null);
            }}
          >
            + ADD Well To {props.shapeType?.toUpperCase()}
          </Button>
        </div>
      );
    },
    onRowClick: (rowData, { dataIndex, rowIndex }) => {
      setAddToTable(true);
      selectRow({ ...props.rows[dataIndex] });
    },
  };

  const deleteFunc = (ids) => {
    props.setLoading(true)
    updateShapeWellInterests({
      variables: {
        wellInterests: ids?.map((id) => ({
          id,
          isDeleted: true,
        })),
      },
      refetchQueries: [
        "getESPaginatedList", "getESSimpleSearch", "getESFilterList"
      ],
      awaitRefetchQueries: true,
    });
  };

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      {addToTable && (
        <AddUnitInterestDialog
          open={addToTable}
          width="450px"
          shapeId={props.customLayer._id}
          shapeType={props.shapeType}
          wellInterest={selectedRow}
          onClose={() => setAddToTable(false)}
        />
      )}

      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={columns}
        rows={props.rows}
        total={false}
        loading={props.loading}
        addAble={addAble}
        targetLabel={props.targetLabel}
        deleteFunc={deleteFunc}
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

export default React.memo(TableHOC(ShapeWellInterestTable), deepEqualObjects);
