import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

// context

import { Container, Button } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATEWELLINTEREST } from "graphQL/useMutationUpdateWellInterest";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";

// Header Schemas 
import TableHeader from 'components/Table/constants/unitperwell-header-schema.js'

// Utilities
import { usetableStyles } from "../Styles";
import AddUnitInterestDialog from "components/Shared/M1nTable/components/SubComponents/AddUnitWellInterestDialog";
import { GET_ES_SHAPE_WELLS } from "graphQL/useQueryESShapeWells";
import { AutoCompleteFilter } from "../AutoCompleteFilter";
import { GET_ES_SHAPE_WELLS_FILTER } from "graphQL/useQueryESShapeWellsFilter";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important"
  },
}));

function UnitWellInterestTable(props) {
  const classes = usetableStyles();
  const [addToTable, setAddToTable] = useState(false)


  // function states 
  const [columns, Columns] = useState([]);
  const [selectedRow, selectRow] = useState([]);

  const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };
  const [selectedYear, setSelectedYear] = useState(2020)  // production selected year state 

  // queries 

  const [getESShapeWells, { data: ShapeWellsData }] = useLazyQuery(GET_ES_SHAPE_WELLS, {
    fetchPolicy: "no-cache", onCompleted: () => {
      props.setLoading(false);
    }
  });

  const [updateWellInterest] = useMutation(UPDATEWELLINTEREST, { refetchQueries: ["getContactWells", "getPaginatedContactWellInterests", "getContactWellInterestsFilterOptions"], awaitRefetchQueries: true });
  const tableData = ShapeWellsData?.getESShapeWells

  const addAble = {
    type: "wellInterest", customLayer: props.customLayer,
    customLayerId: props.customLayer._id,
  }
  const total = false
  const orderByTracks = false
  const startPaginationAt = 25

  ////////////Contact Wells begin///////////////////////////////////////////////
  useEffect(() => {
    getESShapeWells({
      variables: {
        pagination: {
          first: startPaginationAt,
          keep_alive: "1micros"
        },
        search: props.documentSearchQuery ? props.documentSearchQuery : ""
      }
    });
  }, [props.parent]);

  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      const objectsIdsArray = tableData?.hits?.map((hit) => hit._id);
      props.initializeGenericData(objectsIdsArray, ['comments', 'tags']);
    }
  }, [tableData]);

  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      let hits = tableData?.hits
      hits = hits.map((hit) => {
        hit = props.setGenricData(hit, hit._id, ['comments', 'tracks', 'tags']);
        return hit;
      });
      props.setRows(hits);
      TableHeader.forEach((column) => {
        if (column?.options?.filter) {
          column.options = {
            ...column.options,
            filter: true,
            filterType: 'custom',
            filterOptions: {
              display: (filterList, onChange, index, column) => {
                column.filterKey = TableHeader.find(el => el.name === column.name)?.esKey;
                return (
                  <AutoCompleteFilter filterList={filterList} column={column} index={index} onChange={onChange} query={GET_ES_SHAPE_WELLS_FILTER} />
                );
              }
            }
          }
        }
      })

      setColumns(TableHeader);
      props.setLoading(false);
    }
    else if (tableData?.length === 0) {
      props.setRows([]);
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);


  ////////////Contact Wells end///////////////////////////////////////////////

  const onTableChange = (action, tableState, rows, meta) => {
    const tableActions = props.initializeTableActions(tableState, meta, tableData, columns, getESShapeWells)
    switch (action) {
      case "search":
      case "sort":
      case "filterChange":
      case "resetFilters":
      case "changeRowsPerPage":
        tableActions.genericESAction();
        break;
      case "changePage":
        tableActions.changeESPage();
        break;
      default:
    }
  }

  const count = tableData?.total || 0
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    count: count,
    serverSide: true,
    searchable: true,
    filter: true,
    customToolbar: () => {

      return <div style={{ display: "inline", cssFloat: "left", marginRight: "15px", marginTop: "5px" }}>
        <Button
          color="secondary"
          className={classes.multiSelectionTopBarButtons}
          onClick={() => { setAddToTable(true); selectRow(null) }}
        >
          + ADD Well To {props.shapeType?.toUpperCase()}
        </Button>
      </div>
    },
    onRowClick: (rowData, { dataIndex, rowIndex }) => {
      setAddToTable(true)
      selectRow({ ...props.rows[dataIndex] })
    }
  }
  ////////////-----Add your code section here-----///////////////////////
  const getWellOwnersByYear = (selectedYear) => {
    setSelectedYear(selectedYear)
  }

  const deleteFunc = (ids) => {
    for (let i = 0; i < ids.length; i++) {
      updateWellInterest({
        variables: {
          wellInterest: {
            id: ids[i],
            isDeleted: true
          },
        },
        refetchQueries: [
          "getESShapeWells",
          "getESShapeWellsFilter"
        ],
        awaitRefetchQueries: true,
      });
    }
  }


  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >

      <AddUnitInterestDialog
        open={addToTable}
        width="450px"
        shapeId={props.customLayer._id}
        shapeType={props.shapeType}
        wellInterest={selectedRow}
        onClose={() =>
          setAddToTable(false)
        }
      />

      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={columns}
        rows={props.rows}
        total={total}
        loading={props.loading}
        addAble={addAble}
        targetLabel={props.targetLabel}
        deleteFunc={deleteFunc}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={orderByTracks}
        startPaginationAt={null}
        contactId={props.contactId}
        onTableChange={onTableChange}
        options={options}
        parent={props.parent}
        setColumnsBase={[]}
        getWellOwnersByYear={getWellOwnersByYear}
      />
    </Container>
  );
}

export default React.memo(TableHOC(UnitWellInterestTable), deepEqualObjects);


