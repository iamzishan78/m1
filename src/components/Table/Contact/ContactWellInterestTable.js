import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

// context
import { AppContext } from "AppContext";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery } from "@apollo/client";
import { PAGINATED_CONTACT_WELLINTERESTS_QUERY } from "graphQL/useQueryPaginatedContactWellInterests";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";
import AddWellInterestDialog from "components/ContactDetailCard/components/ContactsWellInterestsParcelInterests/components/AddWellInterestDialog";

// Header Schemas 
import ContactWellHeadCells from 'components/Shared/constants/contactperwell-header-schema.js'

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
  const [getPaginatedContactWellInterests, { data: dataContactWells }] = useLazyQuery(PAGINATED_CONTACT_WELLINTERESTS_QUERY);

  const addAble = { type: "wellInterest" }
  const total = false
  const orderByTracks = true

  ////////////Contact Wells begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "assocTaxRollInterests") {
      getPaginatedContactWellInterests({
        variables: {
          contactId: props.contactId,
          filters: [{ field: 'contact', value: props.contactId }]
        },
      });
    }
  }, [props.parent]);

  useEffect(() => {
     const getData = async() => {
    if (props.parent && props.parent === "assocTaxRollInterests" && dataContactWells?.paginatedContactWellInterests?.edges?.length > 0) {
      let wells = dataContactWells.paginatedContactWellInterests.edges.map((el) => el.node)
      const objectsIdsArray = wells.map(
        (well) => well.wellId
      );
      const genericData = await props.getGenericData(objectsIdsArray, ['comments','tags'])

      wells = wells.map((w) => {
        let well = { ...w };

        well.detailCard = well.wellId;
        well.isTracked = false;
        well.commentsCounter = 0;
        well.tags = [[], 0];

        well = props.setGenricData(well, well.wellId, genericData, ['comments', 'tracks', 'tags'])

        return well;
      });
      props.setRows(wells);

      const cleanAvailableTags = []; // get from backend
      setColumns([
        ...(cleanAvailableTags.length > 0
          ? ContactWellHeadCells.map((column) => {
            if (column.name === "tags") {
              return {
                ...column,
                options: {
                  ...column.options,
                  filterOptions: {
                    ...column.options.filterOptions,
                    names: cleanAvailableTags,
                  },
                },
              };
            }
            return column;
          })
          : ContactWellHeadCells.map((column) => {
            if (column.name === "tags") {
              return {
                ...column,
                options: {
                  ...column.options,
                  filter: false,
                },
              };
            }
            return column;
          })),
      ]);
      props.setLoading(false);
    }
  }
  getData()
  }, [dataContactWells]);

  ////////////Contact Wells end///////////////////////////////////////////////


  const onTableChange = (action, tableState, rows, meta) => {

    const pageVariables = {
      variables: {
        pagination: {
          first: tableState.rowsPerPage,
          after: null,
        },
        sort: tableState.activeColumn
          ? {
            field: tableState.columns[tableState.activeColumn]?.name,
            order:
              tableState.columns[tableState.activeColumn]
                ?.sortDirection === "asc"
                ? 1
                : -1,
          }
          : [],

        filters: {
          field: "contact",
          value: props.contactId,
        },
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
                  ? props.rows[0]?._id
                  : null,
              after:
                props.rows && tableState.page > meta.pageInd
                  ? props.rows[props.rows.length - 1]?._id
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
        deleteFunc={null}
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


