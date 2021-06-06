import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

// context
import { AppContext } from "AppContext";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";

// QUERIES 
import { useLazyQuery } from "@apollo/client";
import { TAGSAMPLES } from "graphQL/useQueryTagSamples";
import { COMMENTSCOUNTER } from "graphQL/useQueryCommentsCounter";
import { PAGINATED_CONTACT_WELLINTERESTS_QUERY } from "graphQL/useQueryPaginatedContactWellInterests";
import { TRACKSBYOBJECTTYPE } from "graphQL/useQueryTracksByObjectType";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";
import AddWellInterestDialog from "components/ContactDetailCard/components/ContactsWellInterestsParcelInterests/components/AddWellInterestDialog";

// Header Schemas 
import ContactWellHeadCells from 'components/Shared/constants/contactperwell-header-schema.js'

// Utilities
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
  const [rows, Rows] = useState([]);
  const setRows = (newState) => { setStateIfDeepEqual(Rows, newState); };
  const [columns, Columns] = useState([]);
  const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };
  const [loading, Loading] = useState(true);
  const setLoading = (newState) => { setStateIfDeepEqual(Loading, newState); };
  const [dataTracks, DataTracks] = useState(null);
  const setDataTracks = (newState) => { setStateIfDeepEqual(DataTracks, newState); };
  const [selectedYear, setSelectedYear] = useState(2020)  // production selected year state 

  // queries 
  const [tracksByObjectType, { data: constDataTracks }] = useLazyQuery(TRACKSBYOBJECTTYPE, { fetchPolicy: "cache-and-network", });
  const [getCommentsCounter, { data: dataCommentsCounter }] = useLazyQuery(COMMENTSCOUNTER, { fetchPolicy: "cache-and-network", });
  const [getTagSamples, { data: dataTagSamples }] = useLazyQuery(TAGSAMPLES, { fetchPolicy: "cache-and-network", });
  const [getPaginatedContactWellInterests, { data: dataContactWells }] = useLazyQuery(PAGINATED_CONTACT_WELLINTERESTS_QUERY, { fetchPolicy: "cache-and-network", skip: true });


  const targetLabel = 'well'
  const addAble = { type: "wellInterest" }
  const total = false
  const showTracks = true
  const orderByTracks = false

  ////////////General begin///////////////////////////////////////////////

  useEffect(() => {
    if (targetLabel && stateApp.user && stateApp.user.mongoId && showTracks && targetLabel !== "contact") {
      tracksByObjectType({
        variables: {
          objectType:
            targetLabel === "Parcel Interest"
              ? "Parcel Ownership"
              : targetLabel,
        },
      });
    }
  }, [stateApp.user, targetLabel, showTracks]);

  useEffect(() => {
    if (props.parent && constDataTracks && constDataTracks.tracksByObjectType) {
      const tracksIdArray = constDataTracks.tracksByObjectType.map(
        (track) => track.trackOn
      );

      setDataTracks(tracksIdArray);
      // setRows(tracksIdArray);
      // setLoading(false);
    }
  }, [constDataTracks]);

  ////////////General end///////////////////////////////////////////////

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

    if (props.parent && props.parent === "assocTaxRollInterests" && dataContactWells?.paginatedContactWellInterests?.edges?.length > 0) {
      let wells = dataContactWells.paginatedContactWellInterests.edges.map((el) => el.node)
      const objectsIdsArray = wells.map(
        (well) => well.wellId
      );
      getCommentsCounter({
        variables: {
          objectsIdsArray: objectsIdsArray,
          userId: stateApp.user.mongoId,
        },
      });
      getTagSamples({
        variables: {
          objectsIdsArray: objectsIdsArray,
          userId: stateApp.user.mongoId,
        },
      });

      wells = wells.map((w) => {
        let well = { ...w };

        well.detailCard = well.wellId;
        well.isTracked = false;
        well.commentsCounter = 0;
        well.tags = [[], 0];
        return well;
      });

      setRows(wells);

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
        //flyToColumn,
      ]);
      setLoading(false);
    }
  }, [dataContactWells]);

  useEffect(() => {
    if (
      props.parent && props.parent === "assocTaxRollInterests" &&
      constDataTracks && constDataTracks.tracksByObjectType &&
      dataContactWells?.paginatedContactWellInterests?.edges?.length > 0 &&
      dataCommentsCounter && dataCommentsCounter.commentsCounter &&
      dataTagSamples && dataTagSamples.tagSamples
    ) {
      let wells = dataContactWells.paginatedContactWellInterests.edges.map((el) => ({ ...el.node, cursor: el.cursor }))
      wells = wells.map((w) => {
        let well = { ...w };

        well.detailCard = well.wellId;
        well.isTracked = false;
        well.commentsCounter = 0;
        well.tags = [[], 0];

        for (let i = 0; i < constDataTracks.tracksByObjectType.length; i++) {
          if (well.wellId === constDataTracks.tracksByObjectType[i].trackOn) {
            well.isTracked = true;
            break;
          }
        }
        for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
          if (well.wellId === dataCommentsCounter.commentsCounter[i]._id) {
            well.commentsCounter =
              dataCommentsCounter.commentsCounter[i].total;
            break;
          }
        }
        for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
          if (well.wellId === dataTagSamples.tagSamples[i]._id) {
            well.tags = [
              dataTagSamples.tagSamples[i].tags,
              dataTagSamples.tagSamples[i].total,
            ];

            break;
          }
        }
        return well;
      });

      setRows(wells);
      setLoading(false);
    }
  }, [dataContactWells, dataTracks, dataCommentsCounter, dataTagSamples]);
  ////////////Contact Wells end///////////////////////////////////////////////


  const onTableChange = (action, tableState, rows, meta) => {

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

        filters: {
          field: "contact",
          value: props.contactId,
        },
      },
    };

    switch (action) {
      case "changeRowsPerPage":
        setLoading(true);
        tableState.page = 0;
        meta.setPageInd(tableState.page);
        meta.setRowsPerPage(tableState.rowsPerPage);
        getPaginatedContactWellInterests(
          pageVariables
        );
        break;
      case "changePage":
        setLoading(true);
        getPaginatedContactWellInterests({
          ...pageVariables,
          variables: {
            ...pageVariables.variables,
            pagination: {
              ...pageVariables.variables.pagination,
              before:
                rows && tableState.page < meta.pageInd
                  ? rows[0]?.cursor
                  : null,
              after:
                rows && tableState.page > meta.pageInd
                  ? rows[rows.length - 1]?.cursor
                  : null,
            },
          },
        });
        break;
      case "sort":
        setLoading(true);
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
        rows={rows}
        total={total}
        loading={loading}
        addAble={addAble}
        targetLabel={targetLabel}
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

export default React.memo(ContactWellInterestTable, deepEqualObjects);
