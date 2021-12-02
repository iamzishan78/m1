import React, { useState, useEffect, useRef, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
// QUERIES
import { useLazyQuery, useMutation } from "@apollo/client";
import isEmpty from "lodash/isEmpty";

import {
  deepEqualObjects,
  setStateIfDeepEqual,
} from "components/Shared/functions";
import GridView from "components/Shared/GridView";
import { HeaderComponent } from "components/Table/helpers";
import MetaField from "components/Table/helpers/MetaField";
import {
  handleSelectedGridChange,
  setColumnsData,
} from "components/Table/helpers";

import CustomerViewCol from "components/Table/helpers/CustomerView";
// Header Schemas
import TableHeader from "components/Table/constants/documents-header-schema.js";
import { GET_META_DATA } from "graphQL/useQueryGetMetaData";
import { GET_ES_DOCUMENTS } from "graphQL/useQueryESDocuments";
import { GET_ES_DOCUMENTS_FILTER } from "graphQL/useQueryESDocumentsFilter";
import { UPDATE_DOCUMENT } from "graphQL/useMutationUpdateDocument";
import { UPDATE_GRID_VIEW } from "graphQL/useMutationUpdateGridView";
import { GET_GRID_VIEWS } from "graphQL/useQueryGetGridViews";
import { AppContext } from "AppContext";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
  },
  documentTable: {
    "& ::-webkit-scrollbar": {
      height: "0.7em !important",
    },
  },
}));

function DocumentsTable(props) {
  const classes = useStyles();
  const selectedFilters = useRef([]);
  const [stateApp, setStateApp] = useContext(AppContext);

  // function states
  const [filters, setFilters] = useState([]);
  const [columns, Columns] = useState(JSON.parse(JSON.stringify(TableHeader)));
  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };
  const [showSaveAsNew, setShowSaveAsNew] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedGridView, setSelectedGridView] = useState({});

  // queries
  const [getESDocuments, { data: DocumentsData, loading }] = useLazyQuery(
    GET_ES_DOCUMENTS,
    { fetchPolicy: "no-cache" }
  );
  const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);
  const [getGridViews, { data: gridViews }] = useLazyQuery(GET_GRID_VIEWS);
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
    getGridViews({
      variables: {
        module: "Documents",
        userId: stateApp.user.mongoId,
      },
    });
  }, [getGridViews]);

  useEffect(() => {
    if (gridViews?.getGridViews?.gridViews) {
      const data = JSON.parse(JSON.stringify(gridViews.getGridViews.gridViews));
      setSelectedGridView(
        data.find((d) => d.type === "Default" && d.name === "All Documents")
      );
    }
  }, [gridViews]);

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
  }, [
    getESDocuments,
    props.parent,
    props.documentSearchQuery,
    selectedGridView,
  ]);

  useEffect(() => {
    getMetaData({
      variables: {
        user: stateApp.user?.mongoId,
        category: "Docs",
      },
    });
  }, [getMetaData]);

  useEffect(() => {
    return () => {
      setStateApp((stateApp) => ({
        ...stateApp,
        documentSearchQuery: "",
      }));
    };
  }, []);

  useEffect(() => {
    if (metaDataRes?.getMetaData?.gridViews) {
      let filterColumns = columns.filter(
        (col) =>
          !metaDataRes.getMetaData.gridViews.find(
            (meta) => meta.name === col.name
          )
      );
      const lastColumn = filterColumns.filter((col) => col.name === " ");
      filterColumns = filterColumns.filter((col) => col.name !== " ");
      let columnsData = JSON.parse(JSON.stringify([
        ...filterColumns,
        ...metaDataRes.getMetaData.gridViews,
        ...lastColumn,
      ]));
      for (let i = 0; i < metaDataRes.getMetaData.gridViews.length; i++) {
        TableHeader.push(metaDataRes.getMetaData.gridViews[i]);
      }

      if(!isEmpty(selectedGridView)){
        columnsData = handleSelectedGridChange(
          TableHeader,
          selectedGridView,
          columnsData
        );
      }
      
      columnsData = sortColumns(columnsData, selectedGridView);
      
      setColumnsData(
        TableHeader,
        filters,
        JSON.parse(JSON.stringify(columnsData)),
        setColumns,
        setFilters,
        GET_ES_DOCUMENTS_FILTER
      );
    }
  }, [metaDataRes]);

  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      props.setRows(tableData?.hits);
      let updatedColumns = columns
      if(!isEmpty(selectedGridView)){
        updatedColumns = handleSelectedGridChange(
          TableHeader,
          selectedGridView,
          updatedColumns
        );
        updatedColumns = sortColumns(updatedColumns, selectedGridView);
      }
      
      setColumnsData(
        TableHeader,
        filters,
        JSON.parse(JSON.stringify(updatedColumns)),
        setColumns,
        setFilters,
        GET_ES_DOCUMENTS_FILTER
      );
      props.setLoading(false);
    } else if (tableData?.length === 0) {
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

  const sortColumns = (columns, gridView) => {
    if (gridView?.columns) {
      let updatedColumns = [];
      for (let i = 0; i < gridView.columns.length; i++) {
        const col = columns.find((c) => c.name === gridView.columns[i].name);
        columns = columns.filter((c) => c.name !== gridView.columns[i].name);
        if (col) {
          updatedColumns.push(col);
        }
      }
      updatedColumns = [...updatedColumns, ...columns];
      columns = updatedColumns;
    }
    return columns;
  };

  useEffect(() => {
    if(!isEmpty(selectedGridView)) {
      let updatedColumns = handleSelectedGridChange(
        TableHeader,
        selectedGridView,
        columns
      );
      updatedColumns = sortColumns(updatedColumns, selectedGridView);
      setColumnsData(
        TableHeader,
        filters,
        JSON.parse(JSON.stringify(updatedColumns)),
        setColumns,
        setFilters,
        GET_ES_DOCUMENTS_FILTER
      );
    }
  }, [selectedGridView]);

  const count = tableData?.total || 0;
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    count: count,
    serverSide: true,
    search: false,
    filter: true,
    searchText: props.documentSearchQuery,
    customSearchRender: () => null,
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
    setColumnsData(
      TableHeader,
      filters,
      JSON.parse(JSON.stringify(columns)),
      setColumns,
      setFilters,
      GET_ES_DOCUMENTS_FILTER
    );
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
    if (view.name === "Recently Modified" || view.name === "Recently Added") {
      view.filters[0].value.range[view.filters[0].field].gte = moment()
        .subtract(30, "days")
        .toISOString();
      view.filters[0].value.range[view.filters[0].field].lte =
        moment().toISOString();
    }
    return view;
  };

  const updateColumnSorting = (value) => {
    const sortedColumns = value.map((col) => ({ name: col.name, display: col.display === "true"}));
    
    updateGridView({
      variables: {
        gridView: {
          _id: selectedGridView._id,
          columns: sortedColumns,
        },
      },
    });
    
    const columnsData = sortColumns(columns, { ...selectedGridView, columns: sortedColumns });
    setColumnsData(
      TableHeader,
      filters,
      JSON.parse(JSON.stringify(columnsData)),
      setColumns,
      setFilters,
      GET_ES_DOCUMENTS_FILTER
    );

  };

  const headerProps = {
    columns,
    showViewModal,
    selectedGridView,
    updateGridView,
    setShowSaveAsNew,
    setShowViewModal,
    label: "Documents",
    Icon: DescriptionOutlinedIcon,
    selectedFilters: selectedFilters.current,
  };

  const viewColumnProps = {
    selectedGridView,
    updateColumnSorting,
  };

  const onCustomKeyChange = (value, index, key) => {
    const rows = JSON.parse(JSON.stringify(props.rows));
    rows[index].custom_data = {
      ...props.rows[index].custom_data,
      [`${key}`]: value,
    };
    props.setRows(rows);
    updateDocument({
      variables: {
        document: {
          fileId: props.rows[index]._id,
          custom_data: { [`${key}`]: value },
        },
      },
      refetchQueries: ["getESDocuments"],
      awaitRefetchQueries: true,
    });
  };

  return (
    <div className={classes.documentTable}>
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
            handleClose={() => setShowViewModal(false)}
            setSelectedGridView={setSelectedGridView}
            selectedGridView={selectedGridView}
            setShowViewModal={setShowViewModal}
            setShowSaveAsNew={setShowSaveAsNew}
            showSaveAsNew={showSaveAsNew}
            selectedFilters={selectedFilters.current}
          />
        )}
        {stateApp.showFieldModal && (
          <MetaField columns={columns} category="Docs" />
        )}
        <Table
          style={{ backgroundColor: "#fff" }}
          header={header}
          headerComponent={HeaderComponent}
          viewColumn={CustomerViewCol}
          viewColumnProps={viewColumnProps}
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
          contactId={props.contactId}
          options={options}
          parent={props.parent}
          setColumnsBase={[]}
          deleteFunc={deleteFunc}
          onTableChange={onTableChange}
          onCustomKeyChange={onCustomKeyChange}
        />
      </Container>
    </div>
  );
}

export default React.memo(TableHOC(DocumentsTable), deepEqualObjects);
