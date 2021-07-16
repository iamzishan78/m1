import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

// context
import { AppContext } from "AppContext";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATEWELLINTEREST } from "graphQL/useMutationUpdateWellInterest";
import { PAGINATED_CONTACT_WELLINTERESTS_QUERY } from "graphQL/useQueryPaginatedContactWellInterests";
import { CONTACTWELLINTERESTSFILTEROPTIONS } from "../../../graphQL/useQueryContactWellInterestsFilterOptions";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";
import AddWellInterestDialog from "components/ContactDetailCard/components/ContactsWellInterestsParcelInterests/components/AddWellInterestDialog";

// Header Schemas 
import TableHeader from 'components/Shared/constants/contactperwell-header-schema.js'
import { handleTagColumn, handleCustomFilterColumns } from "../helpers";

// Utilities
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important"
  },
}));

function ContactWellInterestTable(props) {
  const classes = useStyles();

  // contexts
  const [stateApp, setStateApp] = useContext(AppContext);


  // function states 
  const [columns, Columns] = useState([]);
  const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };
  const [selectedYear, setSelectedYear] = useState(2020)  // production selected year state 

  // queries 
  const [getPaginatedContactWellInterests, { data: dataContactWells }] = useLazyQuery(PAGINATED_CONTACT_WELLINTERESTS_QUERY, {
    fetchPolicy: "cache-and-network", skip: true,
    // with a cache fetch policy, if network request returns same result we can end up in an infinite loading sitch.
    // have only seen when searching / researching same string - so same result
    onCompleted: () => {
      props.setLoading(false);
    }
  });
  const [getContactWellInterestsFilterOptions, { data: dataContactWellsFilterOptions },] = useLazyQuery(CONTACTWELLINTERESTSFILTEROPTIONS, { fetchPolicy: "cache-and-network", });
  const [updateWellInterest] = useMutation(UPDATEWELLINTEREST, { refetchQueries: [ "getContactWells", "getPaginatedContactWellInterests", "getContactWellInterestsFilterOptions" ], awaitRefetchQueries: true });
  const tableData = dataContactWells?.paginatedContactWellInterests
  const filterData = dataContactWellsFilterOptions?.contactWellInterestsFilterOptions

  const addAble = {}
  const total = false
  const orderByTracks = false

  ////////////Contact Wells begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "assocTaxRollInterests") {
      getPaginatedContactWellInterests({
        variables: {
          contactId: props.contactId,
          filters: [{ field: 'contact._id', value: props.contactId }]
        },
      });
      getContactWellInterestsFilterOptions({
        variables: {
          contactId: props.contactId,
          filters: [{ field: 'contact._id', value: props.contactId }]
        },
      });
    }
  }, [props.parent]);

  useEffect(() => {
    if (tableData?.edges?.length > 0) {
      let wells = tableData.edges.map((el) => el.node)
      const objectsIdsArray = wells.map((well) => well.wellId);
      props.initializeGenericData(objectsIdsArray, ['comments', 'tags'])
    }

  }, [tableData])

  useEffect(() => {
    if (dataContactWells?.paginatedContactWellInterests?.edges?.length > 0) {
      let wells = dataContactWells.paginatedContactWellInterests.edges.map((el) => ({ ...el.node, cursor: el.cursor }))

      wells = wells.map((w) => {
        let well = { ...w };

        well.detailCard = well.wellId;
        well.isTracked = false;
        well.commentsCounter = 0;
        well.tags = [[], 0];

        well = props.setGenricData(well, well.wellId, ['comments', 'tracks', 'tags'])

        return well;
      });
      props.setRows(wells);
      const cleanAvailableTags = filterData?.tags?.map((tag) => tag._id) || []; // get from backend
      // const columns = handleTagColumn(TableHeader, cleanAvailableTags);
      const columns = handleCustomFilterColumns(TableHeader, filterData);
      setColumns(columns);
      props.setLoading(false);
    }
    else if (tableData?.edges?.length === 0) {
      props.setRows([]);
      props.setLoading(false);
    }
  }, [tableData, filterData, props.dependencyUpdate]);

  ////////////Contact Wells end///////////////////////////////////////////////

  const searchRequest = (e) => {
    e.setLoading(true);
    e.tableState.page = 0;
    e.tableState.count = 0;
    e.setPageInd(e.tableState.page);
    e.getPaginatedContactWellInterests(e.pageVariables);
    e.getContactWellInterestsFilterOptions(e.pageVariables);
  };

  const delayedSearchRequest = React.useMemo(
    () =>
      debounce((request, callback) => {
        searchRequest(request);
      }, 500),
    []
  );

  const onTableChange = (action, tableState, rows, meta) => {

    let filters = [
      {
        field: "contact._id",
        value: props.contactId,
      },
      ...tableState.filterList.reduce((acc, val, ind) => { 
        if (val.length > 0) {
          acc.push({
            field: tableState.columns[ind].dbName || tableState.columns[ind].name,
            value: val,
          });
        }
  
        return acc;
       }, [])
    ];

    const pageVariables = {
      variables: {
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
        filters: filters,
        search: tableState.searchText,
      },
    };

    switch (action) {
      case "changeRowsPerPage":
        props.setLoading(true);
        tableState.page = 0;
        meta.setPageInd(tableState.page);
        meta.setRowsPerPage(tableState.rowsPerPage);
        getPaginatedContactWellInterests(
          pageVariables
        );
        break;
      case "changePage":
        props.setLoading(true);
        getPaginatedContactWellInterests({
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
        getPaginatedContactWellInterests(
          pageVariables
        );
        break;
      case "search":
        delayedSearchRequest({
          tableState: tableState,
          setLoading: props.setLoading,
          setPageInd: meta.setPageInd,
          getPaginatedContactWellInterests: getPaginatedContactWellInterests,
          getContactWellInterestsFilterOptions: getContactWellInterestsFilterOptions,
          pageVariables,
        });
        break;
      case "onSearchClose":
        break;
      case "propsUpdate":
        break;
      case "filterChange":
        props.setLoading(true);
        tableState.page = 0;
        meta.setPageInd(tableState.page);
        getPaginatedContactWellInterests(pageVariables);
        getContactWellInterestsFilterOptions(pageVariables);
        break;
      case "resetFilters":
        props.setLoading(true);
        tableState.page = 0;
        meta.setPageInd(tableState.page);
        getPaginatedContactWellInterests(pageVariables);
        getContactWellInterestsFilterOptions(pageVariables);
        break;
      default:
    }
  }

  const count = dataContactWells?.paginatedContactWellInterests?.totalCount || 0
  const options = {
    rowsPerPageOptions: count > 25 ? [10, 25, 50, 100] : count > 10 ? [10, 25] : [],
    count: count,
    serverSide: true
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
          "getContactWells",
          "getPaginatedContactWellInterests",
          "getContactWellInterestsFilterOptions"
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

      {props.parent && props.parent === "assocTaxRollInterests" && (
        <AddWellInterestDialog
          open={stateApp.wellInterestDialog ? true : false}
          width="450px"
          onClose={() =>
            setStateApp((stateApp) => ({
              ...stateApp,
              wellInterestDialog: false,
            }))
          }
          contactId={props.contactId}
        />
      )}

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

export default React.memo(TableHOC(ContactWellInterestTable), deepEqualObjects);


