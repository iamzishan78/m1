import React, { useState, useEffect } from "react";
// context

import { Container, Button } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATEWELLINTEREST } from "graphQL/useMutationUpdateWellInterest";

import { addTrailingZeros, deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";

// Header Schemas 
import TableHeader from 'components/Table/constants/ownersperunit-header-schema'

// Utilities
import { usetableStyles } from "../Styles";
import AddUnitOwnerDialogContent from "components/Shared/M1nTable/components/SubComponents/AddUnitOwnerDialogContent";
import { GET_ES_SHAPE_OWNERS } from "graphQL/useQueryESShapeOwners";
import { AutoCompleteFilter } from "../AutoCompleteFilter";
import { GET_ES_SHAPE_OWNERS_FILTER } from "graphQL/useQueryESShapeOwnersFilter";



function UnitOwnersTable(props) {
  const classes = usetableStyles();
  const [addToTable, setAddToTable] = useState(false)

  // function states 
  const [columns, Columns] = useState([]);
  const [selectedRow, selectRow] = useState([]);

  const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };

  // queries 

  const [getESShapeOwners, { data: ShapeWellsData }] = useLazyQuery(GET_ES_SHAPE_OWNERS, {
    fetchPolicy: "no-cache", onCompleted: () => {
      props.setLoading(false);
    }
  });

  const [updateOwners] = useMutation(UPDATEWELLINTEREST, {
    refetchQueries: ["getESShapeOwners", "getESShapeOwnersFilter"], awaitRefetchQueries: true
  });
  const tableData = ShapeWellsData?.getESShapeOwners

  const addAble = {
    type: "wellInterest", customLayer: props.customLayer,
    customLayerId: props.customLayer._id,
  }

  const startPaginationAt = 25

  ////////////Contact Wells begin///////////////////////////////////////////////
  useEffect(() => {
    getESShapeOwners({
      variables: {
        pagination: {
          first: startPaginationAt,
          keep_alive: "1micros"
        },
        search: `shape._id:${props.customLayer._id}`
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
        Object.keys(hit).forEach((key) => {
          if (['working_interest', 'royalty_interest', 'orri', 'nri', 'nra'].includes(key))
            hit[key] = addTrailingZeros(hit[key])
        })
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
                  <AutoCompleteFilter filterList={filterList} column={column} index={index} onChange={onChange} query={GET_ES_SHAPE_OWNERS_FILTER} />
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
    const tableActions = props.initializeTableActions(tableState, meta, tableData, columns, getESShapeOwners)
    switch (action) {
      case "search":
      case "sort":
      case "filterChange":
      case "resetFilters":
      case "changeRowsPerPage":
        tableActions.extendSearchQuery(`shape._id:${props.customLayer._id}`);
        tableActions.genericESAction();
        break;
      case "changePage":
        tableActions.extendSearchQuery(`shape._id:${props.customLayer._id}`);
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

      return <div style={{ display: "inline", "float": "left", marginRight: "15px", marginTop: "5px" }}>
        <Button
          color="secondary"
          className={classes.multiSelectionTopBarButtons}
          onClick={() => { setAddToTable(true); selectRow(null) }}
        >
          + ADD OWNER TO {props.shapeType?.toUpperCase()}
        </Button>
      </div>
    },
    onRowClick: (rowData, { dataIndex, rowIndex }) => {
      setAddToTable(true)
      selectRow({ ...props.rows[dataIndex] })
    }
  }


  const deleteFunc = (ids) => {
    for (let i = 0; i < ids.length; i++) {
      // updateWellInterest({
      //   variables: {
      //     wellInterest: {
      //       id: ids[i],
      //       isDeleted: true
      //     },
      //   },
      //   refetchQueries: [
      //     "getESShapeOwners",
      //     "getESShapeOwnersFilter"
      //   ],
      //   awaitRefetchQueries: true,
      // });
    }
  }


  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >

      {addToTable && <AddUnitOwnerDialogContent
        open={addToTable}
        width="450px"
        shapeId={props.customLayer._id}
        uAcres={props.customLayer?.shapeJson?.properties?.uAcres}
        shapeType={props.shapeType}
        selectedRow={selectedRow}
        onClose={() =>
          setAddToTable(false)
        }
      />}


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

export default React.memo(TableHOC(UnitOwnersTable), deepEqualObjects);