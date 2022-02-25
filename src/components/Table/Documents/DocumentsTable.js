import React, { useState, useEffect, useRef, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import moment from "moment";

import { Container, Grid } from "@material-ui/core";
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
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
// import { GET_ES_DOCUMENTS_FILTER } from "graphQL/useQueryESDocumentsFilter";
import { UPDATE_DOCUMENT } from "graphQL/useMutationUpdateDocument";
import { UPDATE_GRID_VIEW } from "graphQL/useMutationUpdateGridView";
import { GET_GRID_VIEWS } from "graphQL/useQueryGetGridViews";
import { AppContext } from "AppContext";
import { sortColumns, formattingGridView, getAppliedFilters, getFilterList } from "utils/helper";

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
  const defaultView = {
    name: "All Documents",
    type: "Default",
  };

  const { Documents } = useSelector(({ session }) => session.userGridViewSettings);

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
  const [selectedGridView, setSelectedGridView] = useState(defaultView);
  const [refetchList, setRefetchList] = useState(false);
  const [gridViews, setGridViews] = useState(null);
  const [metaDatas, setMetaDatas] = useState(null);

  // queries
  const [getESDocuments, { data: DocumentsData, loading }] = useLazyQuery(
    GET_ES_DOCUMENTS,
    { fetchPolicy: "no-cache" }
  );
  const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);
  const [getGridViews, { data: gridViewsData }] = useLazyQuery(GET_GRID_VIEWS);
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
    return () => {
      setStateApp((stateApp) => ({
        ...stateApp,
        documentSearchQuery: "",
      }));
    };
  }, []);

  useEffect(() => {
    console.log("here", Documents);
    if(Documents)
      setSelectedGridView(Documents);
  }, [Documents]);

  useEffect(() => {
    getESDocuments({
      variables: {
        pagination: {
          first: startPaginationAt,
          keep_alive: "1micros",
        },
        search: props.documentSearchQuery ? props.documentSearchQuery : "",
        filters: getAppliedFilters(filters, columns, stateApp.filtersData),
      },
    });
  }, [getESDocuments, props.parent, props.documentSearchQuery]);

  useEffect(() => {
    getMetaData({
      variables: {
        user: stateApp.user?.mongoId,
        category: "Docs",
      },
    });
    getGridViews({
      variables: {
        module: "Documents",
        userId: stateApp.user.mongoId,
      },
    });
  }, [getMetaData, getGridViews]);

  useEffect(() => {
    if (gridViewsData?.getGridViews?.gridViews) {
      setGridViews(gridViewsData.getGridViews.gridViews);
      //   const data = JSON.parse(JSON.stringify(gridViewsData.getGridViews.gridViews));
      //   const selectedData = data.find((d) =>
      //     d.type === (selectedGridView?.type || "Default") &&
      //     d.name === (selectedGridView?.name || "All Documents")
      //   );
      //   setRefetchList(false);
      //   setSelectedGridView(selectedData);
      //   setStateApp((state, props) => {
      //     return {
      //       ...state,
      //       selectedView: selectedData
      //     };
      //   });
    }
  }, [gridViewsData]);

  useEffect(() => {
    if (metaDataRes?.getMetaData?.gridViews) {
      setMetaDatas(metaDataRes?.getMetaData?.gridViews);
      // let filterColumns = columns.filter(
      //   (col) =>
      //     !metaDataRes.getMetaData.gridViews.find(
      //       (meta) => meta.name === col.name
      //     )
      // );
      // // const lastColumn = filterColumns.filter((col) => col.name === " ");
      // // filterColumns = filterColumns.filter((col) => col.name !== " ");
      // let columnsData = JSON.parse(JSON.stringify([
      //   ...filterColumns,
      //   ...metaDataRes.getMetaData.gridViews,
      //   // ...lastColumn,
      // ]));
      // for (let i = 0; i < metaDataRes.getMetaData.gridViews.length; i++) {
      //   TableHeader.push(metaDataRes.getMetaData.gridViews[i]);
      // }

      // let view = JSON.parse(JSON.stringify(selectedGridView))
      // if(!isEmpty(view)){
      //   view = formattingGridView(JSON.parse(JSON.stringify(view)))
      //   columnsData = handleSelectedGridChange(
      //     TableHeader,
      //     view,
      //     columnsData
      //   );
      // }

      // columnsData = sortColumns(columnsData, view);

      // setColumnsData(
      //   TableHeader,
      //   filters,
      //   JSON.parse(JSON.stringify(columnsData)),
      //   setColumns,
      //   setFilters,
      //   GET_ES_DOCUMENTS_FILTER,
      //   'documents_flat'
      // );
    }
  }, [metaDataRes]);

  useEffect(() => {
    if (gridViews && metaDatas) {
      const data = JSON.parse(JSON.stringify(gridViews));
      const selectedData = data.find(
        (d) =>
          d.type === (selectedGridView?.type || "Default") &&
          d.name === (selectedGridView?.name || "All Documents")
      );
      setRefetchList(false);
      setStateApp((state, props) => {
        return {
          ...state,
          selectedView: selectedData,
        };
      });

      let filterColumns = columns.filter(
        (col) => !metaDatas.find((meta) => meta.name === col.name)
      );

      let columnsData = JSON.parse(
        JSON.stringify([
          ...filterColumns,
          ...metaDatas,
        ])
      );
      for (let i = 0; i < metaDatas.length; i++) {
        TableHeader.push(metaDatas[i]);
      }

      let view = JSON.parse(JSON.stringify(selectedData));
      if (!isEmpty(view)) {
        view = formattingGridView(JSON.parse(JSON.stringify(view)));
        columnsData = handleSelectedGridChange(TableHeader, view, columnsData);
      }

      columnsData = sortColumns(columnsData, view);

      setColumnsData(
        TableHeader,
        filters,
        JSON.parse(JSON.stringify(columnsData)),
        setColumns,
        setFilters,
        GET_ES_FILTER_LIST,
        "documents_flat",
        props.documentSearchQuery
      );
      setSelectedGridView(selectedData);
    }
  }, [gridViews, metaDatas]);

  useEffect(() => {
    if (tableData?.hits) {
      props.setRows(tableData?.hits);
      let updatedColumns = columns;
      if (!isEmpty(selectedGridView)) {
        const view = formattingGridView(
          JSON.parse(JSON.stringify(selectedGridView))
        );
        updatedColumns = handleSelectedGridChange(
          TableHeader,
          view,
          updatedColumns
        );
        updatedColumns = sortColumns(updatedColumns, view);
      }

      setColumnsData(
        TableHeader,
        filters,
        JSON.parse(JSON.stringify(updatedColumns)),
        setColumns,
        setFilters,
        GET_ES_FILTER_LIST,
        "documents_flat",
        props.documentSearchQuery
      );
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

  useEffect(() => {
    if (!isEmpty(selectedGridView)) {
      if (refetchList) {
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
      } else {
        setRefetchList(true);
      }
      const view = formattingGridView(
        JSON.parse(JSON.stringify(selectedGridView))
      );
      let updatedColumns = handleSelectedGridChange(
        TableHeader,
        view,
        columns,
        true
      );
      updatedColumns = sortColumns(updatedColumns, view);
      const filterList = getFilterList(updatedColumns);
      setFilters(filterList);
      setColumnsData(
        TableHeader,
        filterList,
        JSON.parse(JSON.stringify(updatedColumns)),
        setColumns,
        setFilters,
        GET_ES_FILTER_LIST,
        "documents_flat",
        props.documentSearchQuery
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
      GET_ES_FILTER_LIST,
      "documents_flat",
      props.documentSearchQuery
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
    if(action === 'filterChange'){
      setFilters(tableState.filterList)
    }
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
    const sortedColumns = value.map((col) => ({
      name: col.name,
      display: col.display === "true",
    }));

    updateGridView({
      variables: {
        gridView: {
          _id: selectedGridView._id,
          columns: sortedColumns,
        },
      },
      refetchQueries: ["getGridViews"],
      awaitRefetchQueries: true,
    });
    // setStateApp((state, props) => {
    //   return {
    //     ...state,
    //     selectedView: { ...state.selectedView, columns: sortedColumns },
    //   };
    // });
    // const newColumns = JSON.parse(JSON.stringify(columns));
    // if(newMetaData){
    //   newColumns.push(newMetaData)
    //   TableHeader.push(newMetaData)
    // }
    // const columnsData = sortColumns(newColumns, {
    //   ...selectedGridView,
    //   columns: sortedColumns,
    // });

    // setColumnsData(
    //   TableHeader,
    //   filters,
    //   JSON.parse(JSON.stringify(columnsData)),
    //   setColumns,
    //   setFilters,
    //   GET_ES_DOCUMENTS_FILTER,
    //   "documents_flat"
    // );

    // setRefetchList(false);
    // setTimeout(() => {
    //   setSelectedGridView({ ...selectedGridView, columns: sortedColumns });
    // }, 10);
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

  const onCustomKeyChange = (value = null, index, key) => {
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
          <MetaField
            columns={columns}
            category="Docs"
            updateColumnSorting={updateColumnSorting}
          />
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
