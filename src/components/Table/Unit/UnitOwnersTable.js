import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

// context
import { AppContext } from "AppContext";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES
import { useLazyQuery, useMutation, useApolloClient } from "@apollo/client";
import { SHAPE_OWNERS } from "graphQL/useQueryPaginatedShapeOwners";
import { SHAPEOWNERSCOUNT } from "graphQL/useQueryShapeOwnersCount";
import { IFARECONTACTS } from "graphQL/useQueryIfOwnersAreContacts";
import { ADDOWNERTOAPARCEL } from "graphQL/useMutationAddOwnerToAParcel";
import { UNIT_OWNERS_QUERY } from "../../../graphQL/useQueryUnitOwners";
import { CONVERT_MULTITPLE_OWNER_TO_CONTACT } from "graphQL/useMutationConvertMultitpleOwnerToContact";

import {
  deepEqualObjects,
  setStateIfDeepEqual,
} from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/ownersperunit-header-schema";
import { handleTagColumn } from "../helpers";

// Utilities
import isEmpty from "lodash/isEmpty";
import { getPolygonString } from "components/Shared/functions";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
  },
}));

function UnitOwnersTable(props) {
  const classes = useStyles();

  // contexts
  const [stateApp, setStateApp] = useContext(AppContext);

  const client = useApolloClient();

  // function states
  const [columns, Columns] = useState([]);
  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };
  const [selectedYear, setSelectedYear] = useState(2020); // production selected year state
  const [count, setCount] = useState()  // local state for async count query
  const [suggestedOwnersCount, setSuggestedOwnersCount] = useState()  // local state for async count query

  // queries
  const [getPaginatedShapeOwners, { data: dataShapeOwners, variables: variablesShapeOwners }] = useLazyQuery(
    SHAPE_OWNERS,
    {
      fetchPolicy: "cache-and-network", skip: true,
      onCompleted: (dataShapeOwners) => {
        setCount((state, props) => {
          let newState = state || dataShapeOwners?.paginatedShapeOwners?.edges?.length;
          let newStateIncrement = !variablesShapeOwners?.pagination?.before &&
            dataShapeOwners?.paginatedShapeOwners?.pageInfo?.hasNextPage
            ? 1
            : 0;

          return newState + newStateIncrement
        })
      },
    }
  );
  const [getUnitOwners, { data: dataUnitOwners }] = useLazyQuery(UNIT_OWNERS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [addOwnerToAParcel, { data: mutationData }] =
    useMutation(ADDOWNERTOAPARCEL);
  const [convertMultitpleOwnerToContact] = useMutation(
    CONVERT_MULTITPLE_OWNER_TO_CONTACT
  );

  const tableData = dataUnitOwners?.unitOwners;

  const addAble = {
    type: "ownerToUnit",
    customLayer: props.customLayer,
    customLayerId: props.customLayer._id,
  };
  const total = false;
  const orderByTracks = false;

  useEffect(() => {

    getUnitOwners({
      variables: {
        customLayerId: props.customLayer._id,
      },
    });
  }, [props.parent]);

  useEffect(() => {
    if (tableData?.edges?.length > 0) {
      const objectsIdsArray = tableData.map((owner) => owner.globalOwnerId);
      props.initializeGenericData(objectsIdsArray, ['comments', 'tags', 'ifAreContacts']);
    }
  }, [tableData]);

  useEffect(() => {
    if (tableData?.length > 0) {
      let owners = tableData
      owners = owners.map((o) => {
        let owner = { ...o };
        owner.isContact = false;
        owner.ownershipType = owner.OwnerType
        owner = props.setGenricData(owner, owner.globalOwnerId, ['comments', 'tracks', 'tags', 'ifAreContacts']);

        return owner;
      });
      props.setRows(owners);

      const cleanAvailableTags = []; // get from backend
      const columns = handleTagColumn(TableHeader, cleanAvailableTags);
      setColumns(columns);
      props.setLoading(false);
    } else if (tableData?.length === 0) {
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
          first: tableState.rowsPerPage,
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
        props.setLoading(true);
        tableState.page = 0;
        meta.setPageInd(tableState.page);
        meta.setRowsPerPage(tableState.rowsPerPage);
        getPaginatedShapeOwners(pageVariables);
        break;
      case "changePage":
        props.setLoading(true);
        if (tableState.page > meta.pageInd) {
          setCount((state, props) => {
            return (tableState.page + 1) * tableState.rowsPerPage
          })
        }
        getPaginatedShapeOwners({
          ...pageVariables,
          variables: {
            ...pageVariables.variables,
            pagination: {
              ...pageVariables.variables.pagination,
              before:
                props.rows && tableState.page < meta.pageInd
                  ? props.rows[0]?.cursor
                  : null,
              after:
                props.rows && tableState.page > meta.pageInd
                  ? props.rows[props.rows.length - 1]?.cursor
                  : null,
            },
          },
        });
        break;
      case "sort":
        props.setLoading(true);
        tableState.page = 0;
        meta.setPageInd(tableState.page);
        getPaginatedShapeOwners(pageVariables);
        break;
      case "search":
        break;
      case "onSearchClose":
        break;
      case "propsUpdate":
        break;
      case "filterChange":
        break;
      case "resetFilters":
        break;
      default:
    }
  };

  const options = {
    rowsPerPageOptions:
      count > 25 ? [10, 25, 50, 100] : count > 10 ? [10, 25] : [],
    count: suggestedOwnersCount || count || 0,
    serverSide: true,
    filter: false,
  };
  ////////////-----Add your code section here-----///////////////////////
  const getWellOwnersByYear = (selectedYear) => {
    setSelectedYear(selectedYear);
  };

  const suggestedOwnerToParcel = async (m1nSelectedRowsIndexes, setSelectedRow) => {
    const { rows } = props;
    const selectedRows = [];
    const globalOwnerIds = [];
    for (let i = 0; i < m1nSelectedRowsIndexes.length; i++) {
      if (
        !rows[m1nSelectedRowsIndexes[i]].isContact &&
        !globalOwnerIds.includes(rows[m1nSelectedRowsIndexes[i]].globalOwnerId)
      ) {
        globalOwnerIds.push(rows[m1nSelectedRowsIndexes[i]].globalOwnerId);
      } else {
        selectedRows.push(rows[m1nSelectedRowsIndexes[i]]);
      }
    }
    if (globalOwnerIds.length > 0) {
      convertMultitpleOwnerToContact({
        variables: {
          ownerIds: globalOwnerIds,
          existingContactId: null,
          contactOwner: null,
          action: "single",
          userId: stateApp.user.mongoId,
        },
        refetchQueries: ["checkIfOwnersAreContacts"],
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
              addParcel(checkIfOwnersAreContactsData.ifAreContacts);
            }
          }
        },
        (err) => {
          console.log(err)
        }
      );
    }
    if (selectedRows.length > 0) {
      addParcel(selectedRows);
    }
    setSelectedRow([])
    props.setSelectedTab(0)
  };

  const addParcel = (selectedRows) => {
    for (let i = 0; i < selectedRows.length; i++) {
      const ownerToAdd = {
        customLayer: props.customLayer._id,
        depthFrom: "",
        depthTo: "",
        entity: "",
        interest: null,
        nma: null,
        nra: null,
        ownerEntity: selectedRows[i].isContact,
        type: "",
        isSuggested: true
      };
      addOwnerToAParcel({
        variables: {
          parcelOwner: {
            ...ownerToAdd,
            createBy: stateApp.user.mongoId,
            lastUpdateBy: stateApp.user.mongoId,
          },
        },
        refetchQueries: [
          "getCustomLayer",
          "getUnitOwners",
          // "getContactParcelInterests",
        ],
        awaitRefetchQueries: true,
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
        total={total}
        loading={props.loading}
        addAble={addAble}
        targetLabel={props.targetLabel}
        deleteFunc={null}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={orderByTracks}
        startPaginationAt={null}
        onTableChange={onTableChange}
        suggestedOwnerToParcel={suggestedOwnerToParcel}
        options={options}
        parent={props.parent}
        setColumnsBase={[]}
        getWellOwnersByYear={getWellOwnersByYear}
      />
    </Container>
  );
}

export default React.memo(TableHOC(UnitOwnersTable), deepEqualObjects);
