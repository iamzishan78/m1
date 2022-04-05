import React, { useContext, useState, useEffect, useRef } from "react";

// context
import { AppContext } from "AppContext";

import { Container, Button } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

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

function SuggestedShapeTaxOwnersTable(props) {
  const classes = usetableStyles();

  // contexts
  const [stateApp, setStateApp] = useContext(AppContext);

  const client = useApolloClient();

  // function states
  const [columns, Columns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showConvertDialog, setShowConvertDialog] = useState(false)

  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };
  const [selectedYear, setSelectedYear] = useState("2021"); // production selected year state
  const [count, setCount] = useState()  // local state for async count query
  const [suggestedOwnersCount, setSuggestedOwnersCount] = useState()  // local state for async count query

  const setM1nSelectedRowsIndexesRef = useRef();
// queries
  const [getPaginatedShapeWellOwners, { data: dataShapeOwners, variables: variablesShapeOwners }] = useLazyQuery(
    SHAPE_WELL_OWNERS,
    {
      fetchPolicy: "cache-and-network", skip: true,
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

    getPaginatedShapeWellOwners({
      variables: {
        polygon: queryPoly,
        userId: stateApp.user.mongoId,
        selectedYear: selectedYear.toString(),
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
      },
    });
  }, [props.parent, selectedYear]);

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
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

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

    switch (action) {
      case "changeRowsPerPage":
        // props.setLoading(true);
        // tableState.page = 0;
        // meta.setPageInd(tableState.page);
        // meta.setRowsPerPage(tableState.rowsPerPage);
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
    count: suggestedOwnersCount || count || 0,
    serverSide: false,
    searchable: true,
    filter: true,
    customToolbar: () => {

      return <div style={{ display: "inline", "float": "left", marginRight: "15px", marginTop: "5px" }}>
        <Button
          color="secondary"
          className={classes.multiSelectionTopBarButtons}
          disabled={true}
        // onClick={addAction}
        >
          + ADD TO {props.shapeType?.toUpperCase()}
        </Button>
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
              // suggestedOwnerToShape();
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

  const pickSelectedRows = async (rows) => {

  }

  const suggestedOwnerToShape = async () => {

    const { rows } = props;
    const selectedOwners = selectedRows.map((sR => rows[sR.dataIndex]))
    const globalOwnerIds = [];
    const owners = []
    selectedOwners.forEach((selectedOwner) => {
      if (
        !selectedOwner.isContact &&
        !globalOwnerIds.includes(selectedOwner.globalOwnerId)
      ) {
        globalOwnerIds.push(selectedOwner.globalOwnerId);
      } else {
        owners.push(selectedOwner);
      }
    })
    if (globalOwnerIds.length > 0) {
      props.setLoading(true);
      convertMultitpleOwnerToContact({
        variables: {
          ownerIds: globalOwnerIds,
          existingContactId: null,
          status: "Lead",
          contactOwner: null,
          action: "single",
          userId: stateApp.user.mongoId,
        },
        refetchQueries: ["checkIfOwnersAreContacts", "getESPaginatedList", "getESSimpleSearch", "getESFilterList"],
        awaitRefetchQueries: true,
      }).then(
        async (res) => {
          if (res.data && res.data.convertMultitpleOwnerToContact) {
            const { success, message } =
              res.data.convertMultitpleOwnerToContact;
            if (success) {
              const { data: checkIfOwnersAreContactsData } = await client.query(
                {
                  query: IFARECONTACTS,
                  variables: {
                    idsArray: globalOwnerIds,
                  },
                }
              );
              const contacts = checkIfOwnersAreContactsData.ifAreContacts.map((contact) => {
                const selectedRow = selectedOwners.find((row) => row.globalOwnerId === contact.globalOwner)
                return {
                  ...contact,
                  globalOwnerId: selectedRow.globalOwnerId,
                  interestType: selectedRow.interestType,
                  ownershipPercentage: selectedRow.ownershipPercentage
                }
              })
              addShape(contacts)
            }
          }
        },
        (err) => {
          console.log(err)
        }
      );
    }
    if (owners.length > 0) {
      props.setLoading(true);
      addShape(owners);
    }

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
        nra: addTrailingZeros((uAcres * ownershipPercentage).toFixed(8)),
        globalOwnerId: rec.globalOwnerId,
        isSuggested: true
      }
      return rec;
    }))
  }

  const addShape = (selectedRows) => {
    const uAcres = props.customLayer?.shapeJson?.properties?.uAcres || 0
    for (let i = 0; i < selectedRows.length; i++) {
      const ownershipPercentage = addTrailingZeros(selectedRows[i].ownershipPercentage.toFixed(8))
      const nra = uAcres * selectedRows[i].ownershipPercentage

      const ownerToAdd = {
        shapeId: props.customLayer._id,
        entity: "",
        globalOwnerId: selectedRows[i].globalOwnerId,
        working_interest: selectedRows[i].interestType === 'WORKING INTEREST' ? ownershipPercentage : "",
        royalty_interest: selectedRows[i].interestType === 'ROYALTY INTEREST' ? ownershipPercentage : "",
        orri: selectedRows[i].interestType === 'OVERRIDING ROYALTY' ? ownershipPercentage : "",
        nra: addTrailingZeros(nra.toFixed(8)),
        ownerEntity: selectedRows[i].isContact,
        type: "",
        isSuggested: true
      };
      addOwnerToAShape({
        variables: {
          shapeType: props.shapeType,
          shapeOwner: {
            ...ownerToAdd,
            createBy: stateApp.user.mongoId,
            lastUpdateBy: stateApp.user.mongoId,
          },
        },
        refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"],
        awaitRefetchQueries: true,
      }).then(() => {
        props.setLoading(false);
        props.setSelectedTab(0)
      });
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
          onClose={() => {
            setShowConvertDialog(false);
          }}
          rows={formatInterestForImport()}
          setM1nSelectedRowsIndexes={(m1nSelectedRowsIndexes) => {
            console.log("here");
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
