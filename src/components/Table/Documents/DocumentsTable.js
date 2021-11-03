import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import { AutoCompleteFilter } from "../AutoCompleteFilter";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
// QUERIES
import { useLazyQuery, useMutation } from "@apollo/client";

import {
  deepEqualObjects,
  setStateIfDeepEqual,
} from "components/Shared/functions";
import GridView from "components/Shared/GridView";
import { HeaderComponent } from "components/Table/helpers";
import { handleSelectedGridChange, setColumnsData } from 'components/Table/helpers'

// Header Schemas
import TableHeader from "components/Table/constants/documents-header-schema.js";
import { GET_ES_DOCUMENTS } from "graphQL/useQueryESDocuments";
import { GET_ES_DOCUMENTS_FILTER } from "graphQL/useQueryESDocumentsFilter";
import { UPDATE_DOCUMENT } from "graphQL/useMutationUpdateDocument";
import { UPDATE_GRID_VIEW } from "graphQL/useMutationUpdateGridView";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
  },
}));

function DocumentsTable(props) {
  const classes = useStyles();
  const defaultView = {
    name: "All Documents",
    type: 'Default'
  }
  const selectedFilters = useRef([]);

  // function states\
  const [filters, setFilters] = useState([]);
  const [columns, Columns] = useState(JSON.parse(JSON.stringify(TableHeader)));
  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };
  const [showSaveAsNew, setShowSaveAsNew] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedGridView, setSelectedGridView] = useState(defaultView);

  // queries
  const [getESDocuments, { data: DocumentsData, loading }] = useLazyQuery(
    GET_ES_DOCUMENTS,
    { fetchPolicy: "no-cache" }
  );
  const [updateGridView, { data: updatedGridView }] =
    useMutation(UPDATE_GRID_VIEW);
  const [updateDocument] = useMutation(UPDATE_DOCUMENT);

  const tableData = DocumentsData?.getESFiles;

  const addAble = { parent: false, type: "document" };
  const targetLabel = "documents";
  const uploadIcon = true;
  const header = "Documents";
  const dense = true;
  const total = false;
  const orderByTracks = false;
  const startPaginationAt = 25;

  useEffect(() => {
    getESDocuments({
      variables: {
        pagination: {
          first: startPaginationAt,
          keep_alive: "1micros",
        },
        search: props.documentSearchQuery ? props.documentSearchQuery : "",
        filters: selectedGridView?.filters ? selectedGridView?.filters : [],
      },
    });
  }, [getESDocuments, props.parent, props.documentSearchQuery, selectedGridView]);

  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      props.setRows(tableData?.hits);
      setColumnsData(TableHeader, filters, JSON.parse(JSON.stringify(columns)), setColumns, setFilters, GET_ES_DOCUMENTS_FILTER);
      props.setLoading(false);
    } else if (tableData?.length === 0) {
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

  useEffect(() => {
    const updatedColumns = handleSelectedGridChange(TableHeader, selectedGridView, columns)
    setColumnsData(TableHeader, filters, JSON.parse(JSON.stringify(updatedColumns)), setColumns, setFilters, GET_ES_DOCUMENTS_FILTER);
  }, [selectedGridView]);

  const count = tableData?.total || 0;
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    count: count,
    serverSide: true,
    search: false,
    filter: true,
    searchText: props.documentSearchQuery,
  };

  const viewColumnsChange = (tableColumns) => {
    for (let i = 0; i < tableColumns.length; i++) {
      if (tableColumns[i].display === "true") {
        columns[i].options.display = true;
        if (columns[i].esKey && !columns[i].noFilter) {
          columns[i].options.filter = true;
        }
      } else {
        columns[i].options.display = false;
      }
    }
    setColumnsData(TableHeader, filters, JSON.parse(JSON.stringify(columns)), setColumns, setFilters, GET_ES_DOCUMENTS_FILTER);
  };

  ////////////-----Add your code section here-----///////////////////////
  const onTableChange = (action, tableState, rows, meta) => {
    const tableActions = props.initializeTableActions(
      tableState,
      meta,
      tableData,
      columns,
      getESDocuments,
      selectedGridView
    );
    selectedFilters.current = tableActions?.pageESVariables?.variables?.filters;
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
      case "viewColumnsChange":
        viewColumnsChange(tableState.columns);
        break;
      default:
    }
  };

  const deleteFunc = (documentIdsToDelete) => {
    if (documentIdsToDelete) {
      for (let i = 0; i < documentIdsToDelete.length; i++) {
        updateDocument({
          variables: {
            document: {
              fileId: documentIdsToDelete[i],
              isDeleted: true,
            },
          },
          refetchQueries: ["getESDocuments"],
          awaitRefetchQueries: true,
        });
      }
    }
  };

  const handleDefaultView = (view, user) => {
    if (view.name === "My Documents") {
      view.filters[0].value = user._id;
    }
    if (
      view.name === "Recently Modified" ||
      view.name === "Recently Added"
    ) {
      view.filters[0].value.range[view.filters[0].field].gte =
        moment().subtract(30, "days").toISOString();
        view.filters[0].value.range[view.filters[0].field].lte =
        moment().toISOString();
    }
    return view;
  }

  const headerProps = {
    columns,
    Icon: DescriptionOutlinedIcon,
    label: "Documents",
    showViewModal,
    setShowSaveAsNew,
    setShowViewModal,
    selectedGridView,
    updateGridView,
    selectedFilters: selectedFilters.current,
  };

  return (
    <>
      <Container
        maxWidth={false}
        className={classes.container}
        id={props.id ? props.id : props.parent}
      >
        {showViewModal && (
          <GridView
            columns={columns}
            module="Documents"
            handleDefaultView={handleDefaultView}
            defaultView={defaultView}
            handleClose={() => setShowViewModal(false)}
            setSelectedGridView={setSelectedGridView}
            selectedGridView={selectedGridView}
            setShowViewModal={setShowViewModal}
            setShowSaveAsNew={setShowSaveAsNew}
            showSaveAsNew={showSaveAsNew}
            selectedFilters={selectedFilters.current}
          />
        )}
        <Table
          style={{ backgroundColor: "#fff" }}
          header={header}
          headerComponent={HeaderComponent}
          headerProps={headerProps}
          columns={columns}
          rows={props.searchedRows}
          total={total}
          loading={loading}
          addAble={addAble}
          targetLabel={targetLabel}
          uploadIcon={uploadIcon}
          dense={dense}
          orderByTracks={orderByTracks}
          startPaginationAt={startPaginationAt}
          // onClickAdd={onClickAdd}
          contactId={props.contactId}
          options={options}
          parent={props.parent}
          setColumnsBase={[]}
          deleteFunc={deleteFunc}
          onTableChange={onTableChange}
        />
      </Container>
    </>
  );
}

export default React.memo(TableHOC(DocumentsTable), deepEqualObjects);
