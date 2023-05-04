import React, { useContext, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

// context
import { AppContext } from "AppContext";

import { Container, Button, Switch, Grid, FormControlLabel, FormGroup } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import { makeStyles, withStyles } from "@material-ui/core/styles";

// QUERIES
import { useLazyQuery, useMutation, useApolloClient } from "@apollo/client";
import { SHAPE_WELL_OWNERS } from "graphQL/useQueryPaginatedShapeWellOwners";
import { SHAPE_WELL_OWNERS_COUNT } from "graphQL/useQueryShapeWellOwnersCount";
import { IFARECONTACTS } from "graphQL/useQueryIfOwnersAreContacts";
import { ADD_OWNER_TOA_SHAPE } from "graphQL/useMutationAddOwnerToAShape";
import { CONVERT_MULTITPLE_OWNER_TO_CONTACT } from "graphQL/useMutationConvertMultitpleOwnerToContact";

import {
  deepEqualObjects,
  setStateIfDeepEqual,
} from "components/Shared/functions";

import { addTrailingZeros } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/potential-owners-header-schema";
import { handleTagColumn } from "../helpers";

// Utilities
import isEmpty from "lodash/isEmpty";
import { getPolygonString } from "components/Shared/functions";
import { usetableStyles } from "../Styles";

import { MultipleOwnerToContactDrawerContainer } from 'store/containers';

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#12ABE0",
        borderColor: "#12ABE0",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    // border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);


function SuggestedShapeTaxOwnersTable(props) {
  const classes = usetableStyles();

  const { jobType, jobName } = props;

  // contexts
  const [stateApp, setStateApp] = useContext(AppContext);
  const workspaceSettings = useSelector(({ app }) => app.workspaceSettings);
  const client = useApolloClient();

  // function states
  const [columns, Columns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showConvertDialog, setShowConvertDialog] = useState(false)


  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };
  const [selectedYear, setSelectedYear] = useState("2022"); // production selected year state
  const [count, setCount] = useState()  // local state for async count query
  const [suggestedOwnersCount, setSuggestedOwnersCount] = useState()  // local state for async count query
  const [filterByWells, setFilterByWells] = useState(false); // production selected year state

  const setM1nSelectedRowsIndexesRef = useRef();
  // queries
  const [getPaginatedShapeWellOwners, { data: dataShapeOwners, variables: variablesShapeOwners }] = useLazyQuery(
    SHAPE_WELL_OWNERS,
    {
      // fetchPolicy: "cache-and-network", skip: true,
      onCompleted: (dataShapeOwners) => {
        setCount((state, props) => {
          let newState = state || dataShapeOwners?.paginatedShapeWellOwners?.edges?.length;
          let newStateIncrement = !variablesShapeOwners?.pagination?.before &&
            dataShapeOwners?.paginatedShapeWellOwners?.pageInfo?.hasNextPage
            ? 1
            : 0;

          return newState + newStateIncrement
        })
      },
    }
  );

  useEffect(() => {
    console.log('dataShapeOwners', dataShapeOwners)
  }, [dataShapeOwners])
  useEffect(() => {
    console.log('variablesShapeOwners', variablesShapeOwners)
  }, [variablesShapeOwners])

  const [addOwnerToAShape, { data: shapeOwnerData }] = useMutation(ADD_OWNER_TOA_SHAPE);

  const [convertMultitpleOwnerToContact] = useMutation(
    CONVERT_MULTITPLE_OWNER_TO_CONTACT
  );

  const tableData = dataShapeOwners?.paginatedShapeWellOwners;
  const [getShapeOwnersWellCount, { data: dataShapeOwnersCount }] = useLazyQuery(SHAPE_WELL_OWNERS_COUNT, {
    fetchPolicy: "cache-and-network", skip: true,
    onCompleted: (dataShapeOwnersCount) => {
      setSuggestedOwnersCount(dataShapeOwnersCount?.shapeWellOwnersCount);
    },
  });

  const addAble = {};
  const orderByTracks = false;

  ////////////Contact Wells begin///////////////////////////////////////////////
  useEffect(() => {
    const queryPoly = getPolygonString(props.customLayer?.shape)

    props.setLoading(true)
    console.log('gg')

    getPaginatedShapeWellOwners({
      variables: {
        polygon: queryPoly,
        userId: stateApp.user.mongoId,
        selectedYear: selectedYear.toString(),
        filterByWells: filterByWells ? props.customLayer._id : '',
        sort: {},
        pagination: {
          first: 10000/*tableState.rowsPerPage*/,
          after: null,
        },
      },
    });
    getShapeOwnersWellCount({
      variables: {
        polygon: queryPoly,
        selectedYear: selectedYear.toString(),
        filterByWells: filterByWells ? props.customLayer._id : '',
      },
    });
  }, [props.parent, selectedYear, filterByWells]);

  useEffect(() => {
    if (tableData?.edges?.length > 0) {
      let owners = tableData.edges.map((el) => el.node);
      const objectsIdsArray = owners.map((owner) => owner.id);
      const globalOwnerIds = tableData?.edges?.map((el) => el.node.globalOwnerId);
      props.initializeGenericData(objectsIdsArray, ['comments', 'tags']);
      props.ifAreContacts([...globalOwnerIds]);
    }
  }, [tableData]);

  useEffect(() => {
    if (tableData?.edges?.length > 0) {
      let owners = tableData.edges.map((el) => ({ ...el.node, cursor: el.cursor }));
      owners = owners.map((o) => {
        let owner = { ...o };
        owner.isContact = false;
        owner.ownershipType = owner.OwnerType || owner.ownershipType;
        owner = props.setGenricData(owner, owner.id, ['comments', 'tracks', 'tags']);
        owner = props.setGenricData(owner, owner.globalOwnerId, ['ifAreContacts']);

        return owner;
      });
      props.setRows(owners);

      const cleanAvailableTags = []; // get from backend
      const columns = handleTagColumn(TableHeader, cleanAvailableTags);
      setColumns(columns);
      props.setLoading(false);
    } else if (tableData?.edges?.length === 0) {
      props.setRows([]);
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

  ////////////Toggle share button /////////////////
  const ToggleSharedButton = () => {
    return (
      <FormGroup style={{ display: "block", width: "180px" }}>
        <FormControlLabel
          className={`${classes.switchButtom}`}
          control={
            <React.Fragment>
              {props.publicLeftBottom && <h4 className="h4Before">Tags</h4>}
              <AntSwitch
                checked={filterByWells}
                onChange={() => {
                  filterOwnersByWells(!filterByWells)
                }}
                name="checkedC"

              />


            </React.Fragment>
          }
          label="Filter by unit wells"
          labelPlacement="start"
        />
      </FormGroup>
    );
  };

  ////////////Contact Wells end///////////////////////////////////////////////

  const onTableChange = (action, tableState, rows, meta) => {
    const pageVariables = {
      variables: {
        polygon: getPolygonString(props.customLayer?.shape),
        userId: stateApp.user.mongoId,
        pagination: {
          first: 10000/*tableState.rowsPerPage*/,
          after: null,
        },
        ...(!isEmpty(tableState.sortOrder)) && {
          sort:
          {
            field: tableState.columns.find(el => el.name === tableState.sortOrder?.name)?.dbName ||
              tableState.columns.find(el => el.name === tableState.sortOrder?.name)?.name,
            order:
              tableState.sortOrder?.direction === "asc"
                ? 1
                : -1,
          }
        },

        filters: {},
      },
    };

    if (action === 'filterChange') {
      let isFiltered = false
      for (let i = 0; i < tableState.filterList.length; i++) {
        if (tableState.filterList[i].length !== 0) {
          isFiltered = true
          break;
        }
      }
      props.setIsFiltered(isFiltered)
    }
    setCount(tableState.count = tableState?.displayData.length)
    switch (action) {
      case "changeRowsPerPage":
        // props.setLoading(true);
        // tableState.page = 0;
        meta.setPageInd(tableState.page);
        meta.setRowsPerPage(tableState.rowsPerPage);
        // getPaginatedShapeWellOwners(pageVariables);
        break;
      case "changePage":
        break;
      case "search":
        // props.setLoading(true);
        // if (tableState.page > meta.pageInd) {
        //   setCount((state, props) => {
        //     return (tableState.page + 1) * tableState.rowsPerPage
        //   })
        // }
        // getPaginatedShapeWellOwners({
        //   ...pageVariables,
        //   variables: {
        //     ...pageVariables.variables,
        //     search: tableState.searchText,
        //     pagination: {
        //       ...pageVariables.variables.pagination,
        //       before:
        //         props.rows && tableState.page < meta.pageInd
        //           ? props.rows[0]?.cursor
        //           : null,
        //       after:
        //         props.rows && tableState.page > meta.pageInd
        //           ? props.rows[props.rows.length - 1]?.cursor
        //           : null,
        //     },
        //   },
        // });
        break;
      case "sort":
        // props.setLoading(true);
        // tableState.page = 0;
        // meta.setPageInd(tableState.page);
        // getPaginatedShapeWellOwners(pageVariables);
        break;
      case "onSearchClose":
        break;
      case "propsUpdate":
        break;
      case "filterChange":
        break;
      case "resetFilters":
        break;
      case "rowSelectionChange":
        setSelectedRows(tableState.selectedRows.data)
        break;
      default:
    }
  };

  const options = {
    rowsPerPageOptions:
      count > 25 ? [10, 25, 50, 100] : count > 10 ? [10, 25] : [],
    count: count || 0,
    serverSide: false,
    searchable: true,
    filter: true,
    customToolbar: () => {

      return <div style={{ display: "inline", "float": "left", width: '343px', marginRight: "15px", marginTop: "5px" }}>
        <Grid container >
          <Grid item xs={6}>
            <ToggleSharedButton />

          </Grid>
          <Grid item xs={6}>
            <Button
              color="secondary"
              className={classes.multiSelectionTopBarButtons}
              disabled={true}
            // onClick={addAction}
            >
              + ADD TO {props.shapeType?.toUpperCase()}
            </Button>
          </Grid>

        </Grid>

      </div>
    },
    customToolbarSelect: ({ data }) => {

      return <div style={{ height: "48px", display: "flex" }}>
        <div style={{ marginTop: "6px", height: "35px", display: "flex", marginRight: "20px" }}>
          <Button
            color="secondary"
            className={classes.multiSelectionTopBarButtons}
            disabled={data.length < 1}
            onClick={() => {
              setShowConvertDialog(true);
            }}
          >
            + ADD TO {props.shapeType?.toUpperCase()}
          </Button>
        </div>
      </div>
    }
  };
  ////////////-----Add your code section here-----///////////////////////
  const getWellOwnersByYear = (selectedYear) => {
    setSelectedYear(selectedYear);
  };

  const filterOwnersByWells = (filter) => {
    setFilterByWells(filter);
  };

  const calculateNRA = (uAcres, ownershipPercentage) => {
    let nra = parseFloat(uAcres || 0) * ownershipPercentage;
    if (workspaceSettings.settings?.map?.unitNra?.type === "custom" && workspaceSettings.settings?.map?.unitNra?.value) {
      nra = nra / Number(workspaceSettings.settings?.map?.unitNra?.value);
    }
    nra = addTrailingZeros(nra.toFixed(8));
    return nra;
  };

  const formatInterestForImport = () => {
    const uAcres = props.customLayer?.shapeJson?.properties?.uAcres || 0
    return selectedRows.map((sR => {
      const rec = props.rows?.[sR.dataIndex];
      const ownershipPercentage = addTrailingZeros(rec.ownershipPercentage.toFixed(8))
      rec.shape = {
        _id: props.customLayer._id,
        shapeType: props.shapeType,
        working_interest: rec.interestType === 'WORKING INTEREST' ? ownershipPercentage : "",
        royalty_interest: rec.interestType === 'ROYALTY INTEREST' ? ownershipPercentage : "",
        orri: rec.interestType === 'OVERRIDING ROYALTY' ? ownershipPercentage : "",
        nra: calculateNRA(uAcres, ownershipPercentage),
        globalOwnerId: rec.globalOwnerId,
        isSuggested: true
      }
      return rec;
    }))
  }

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
        rows={props.rows}
        loading={props.loading}
        addAble={addAble}
        targetLabel={props.targetLabel}
        deleteFunc={null}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={orderByTracks}
        startPaginationAt={null}
        onTableChange={onTableChange}
        options={options}
        parent={props.parent}
        setColumnsBase={[]}
        getWellOwnersByYear={getWellOwnersByYear}
        setM1nSelectedRowsIndexesRef={setM1nSelectedRowsIndexesRef}
      />
      {showConvertDialog && (
        <MultipleOwnerToContactDrawerContainer
          jobType={jobType}
          jobName={jobName}
          onClose={() => {
            setShowConvertDialog(false);
          }}
          rows={formatInterestForImport()}
          setM1nSelectedRowsIndexes={(m1nSelectedRowsIndexes) => {
            if (typeof setM1nSelectedRowsIndexesRef.current === "function") {
              setM1nSelectedRowsIndexesRef.current(m1nSelectedRowsIndexes);
            }
          }}
          onSuccess={() => { }}
          setRows={() => { }}
        />
      )}
    </Container>
  );
}

export default React.memo(TableHOC(SuggestedShapeTaxOwnersTable), deepEqualObjects);
