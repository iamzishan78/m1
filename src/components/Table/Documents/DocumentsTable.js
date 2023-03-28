import React, { useState, useEffect, useRef, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
// QUERIES
import { useApolloClient, useLazyQuery, useMutation } from "@apollo/client";
import isEmpty from "lodash/isEmpty";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";
import GridView from "components/Shared/GridView";
import { HeaderComponent } from "components/Table/helpers";
import MetaField from "components/Table/helpers/MetaField";
import { handleSelectedGridChange, setColumnsData } from "components/Table/helpers";

import CustomerViewCol from "components/Table/helpers/CustomerView";
// Header Schemas
import TableHeader from "components/Table/constants/documents-header-schema.js";
import { GET_META_DATA } from "graphQL/useQueryGetMetaData";
import { GET_ES_DOCUMENTS } from "graphQL/useQueryESDocuments";
import { UPDATE_DOCUMENT } from "graphQL/useMutationUpdateDocument";
import { UPDATE_GRID_VIEW } from "graphQL/useMutationUpdateGridView";
import { GET_GRID_VIEWS } from "graphQL/useQueryGetGridViews";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { AppContext } from "AppContext";
import { sortColumns, formattingGridView, getAppliedFilters, getFilterList } from "utils/helper";

import { updateUserGridViewSettingAction } from "store/actions/sessionActions";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
  },
  documentTable: {
    "& .MuiTableCell-paddingCheckbox": { position: "sticky" },
    "& .MuiTableRow-hover": {
      "& .MuiTableCell-root": {
        backgroundColor: "white",
      },
      "&:hover": {
        "& .MuiTableCell-root": {
          backgroundColor: "#dfdfdf",
        },
      },
    },
    "& ::-webkit-scrollbar": {
      height: "0.7em !important",
    },
    "& .MuiTableRow-footer": {
      visibility: "hidden",
      display: "none",
    },
  },
}));

function DocumentsTable(props) {
  const classes = useStyles();
  const defaultView = {
    name: "All Documents",
    type: "Default",
  };

  const dispatch = useDispatch();
  const { Documents } = useSelector(({ session }) => session.userGridViewSettings);

  const selectedFilters = useRef([]);
  const selectedSorts = useRef([]);
  const [stateApp, setStateApp] = useContext(AppContext);
  const client = useApolloClient();

  // function states
  const [filters, setFilters] = useState([]);
  const [changePage, isPageChanged] = useState(false);
  const [columns, Columns] = useState(JSON.parse(JSON.stringify(TableHeader)));
  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };
  const [showSaveAsNew, setShowSaveAsNew] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedGridView, setSelectedGridView] = useState(defaultView);
  const [gridViews, setGridViews] = useState(null);
  const [metaDatas, setMetaDatas] = useState(null);

  // queries
  const [getESDocuments, { data: DocumentsData, loading }] = useLazyQuery(GET_ES_DOCUMENTS, { fetchPolicy: "no-cache" });
  const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);
  const [getGridViews, { data: gridViewsData }] = useLazyQuery(GET_GRID_VIEWS);
  const [updateGridView, { data: updatedGridView }] = useMutation(UPDATE_GRID_VIEW);
  const [updateDocument] = useMutation(UPDATE_DOCUMENT);

  const tableData = DocumentsData?.getESFiles;

  const addAble = { parent: false, type: "document" };
  const targetLabel = "documents";
  const uploadIcon = true;
  const header = "Documents";
  const dense = true;
  const total = false;
  const orderByTracks = false;
  const startPaginationAt = 50;

  useEffect(() => {
    if (props.refetch === false) return;

    let queryFilters = selectedGridView?.filters ? selectedGridView?.filters : [];
    queryFilters = queryFilters.length > 0 ? queryFilters : getAppliedFilters(filters, columns, stateApp.filtersData);
    props.setPage(0);
    (async () => {
      const { data } = await client.query({
        query: GET_ES_DOCUMENTS,
        variables: {
          pagination: {
            first: props.rows.length > 0 ? props.rows.length + 1 : startPaginationAt,
            keep_alive: "1micros",
          },
          search: props.documentSearchQuery ? `${props.documentSearchQuery}*` : "*",
          filters: queryFilters,
          sort: getSort(),
        },
      });

      const documents = data?.getESFiles;
      props.setRows(documents?.hits);
    })();
  }, [props.refetch]);

  useEffect(() => {
    props.setPage(0);
    return () => {
      setStateApp((stateApp) => ({
        ...stateApp,
        documentSearchQuery: "",
      }));
    };
  }, []);

  useEffect(() => {
    setSelectedGridView(Documents || defaultView);
  }, [Documents]);

  const getSort = () => {
    let sort;
    if (selectedSorts.current) {
      const field = Object.keys(selectedSorts.current)[0];
      if (selectedSorts.current[field]?.order !== "none") sort = { field, ...selectedSorts.current[field] };
    }
    return sort;
  };
  useEffect(() => {
    const tableClass = document.querySelectorAll("[class*=MUIDataTable-responsiveBase]");
    if (tableClass.length > 0) tableClass[0].scrollTop = 0;

    let queryFilters = selectedGridView?.filters ? selectedGridView?.filters : [];
    queryFilters = queryFilters.length > 0 ? queryFilters : getAppliedFilters(filters, columns, stateApp.filtersData);

    props.setPage(0);
    getESDocuments({
      variables: {
        pagination: {
          first: startPaginationAt,
          keep_alive: "1micros",
        },
        search: props.documentSearchQuery ? `${props.documentSearchQuery}*` : "*",
        filters: queryFilters,
        sort: getSort(),
      },
    });
  }, [getESDocuments, props.parent, props.documentSearchQuery, selectedGridView]);

  useEffect(() => {
    getMetaData({
      variables: {
        user: stateApp.user?.mongoId,
        category: "Docs",
      },
    });
  }, [getMetaData, getGridViews]);

  useEffect(() => {
    if (gridViewsData?.getGridViews?.gridViews) {
      setGridViews(gridViewsData.getGridViews.gridViews);
    }
  }, [gridViewsData]);

  useEffect(() => {
    if (metaDataRes?.getMetaData?.metaData) {
      setMetaDatas(metaDataRes?.getMetaData?.metaData);
    }
  }, [metaDataRes]);

  useEffect(() => {
    if (selectedGridView && metaDatas) {
      const selectedData = JSON.parse(JSON.stringify(selectedGridView));
      setStateApp((state, props) => {
        return {
          ...state,
          selectedView: selectedData,
        };
      });

      let filterColumns = columns.filter((col) => !col._id);

      let columnsData = JSON.parse(
        JSON.stringify([...filterColumns, ...metaDatas])
      );
      for (let i = 0; i < metaDatas.length; i++) {
        TableHeader.push({ ...metaDatas[i], esKey: `${metaDatas[i].esKey}.keyword` });
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
        GET_ES_SIMPLE_FILTER,
        "documents_flat",
        props.documentSearchQuery,
        ["_all"]
      );
      // setSelectedGridView(selectedData);
    }
  }, [selectedGridView, metaDatas]);

  useEffect(() => {
    if (tableData?.hits) {
      if (changePage) {
        const rowIndex = props.rows.length - 5;
        props.setRows(props.rows.concat(tableData?.hits));
        document.getElementById(`waypoint-${rowIndex}`)?.scrollIntoView();
        isPageChanged(false);
      } else props.setRows(tableData?.hits);

      let updatedColumns = columns;
      if (!isEmpty(selectedGridView)) {
        const view = formattingGridView(JSON.parse(JSON.stringify(selectedGridView)));
        updatedColumns = handleSelectedGridChange(TableHeader, view, updatedColumns, true);
        updatedColumns = sortColumns(updatedColumns, view);
      }

      setColumnsData(
        TableHeader,
        filters,
        JSON.parse(JSON.stringify(updatedColumns)),
        setColumns,
        setFilters,
        GET_ES_SIMPLE_FILTER,
        "documents_flat",
        props.documentSearchQuery,
        ["_all"]
      );
      props.setLoading(false);
    }
  }, [selectedGridView, tableData, props.dependencyUpdate]);

  useEffect(() => {
    if (!isEmpty(selectedGridView)) {
      const view = formattingGridView(JSON.parse(JSON.stringify(selectedGridView)));
      let updatedColumns = handleSelectedGridChange(TableHeader, view, columns, true);
      updatedColumns = sortColumns(updatedColumns, view);
      const filterList = getFilterList(updatedColumns);
      setFilters(filterList);
      setColumnsData(
        TableHeader,
        filterList,
        JSON.parse(JSON.stringify(updatedColumns)),
        setColumns,
        setFilters,
        GET_ES_SIMPLE_FILTER,
        "documents_flat",
        props.documentSearchQuery,
        ["_all"]
      );
    }
  }, [selectedGridView]);

  const count = tableData?.total || 0;
  const options = {
    page: props.page,
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
      GET_ES_SIMPLE_FILTER,
      "documents_flat",
      props.documentSearchQuery,
      ["_all"]
    );
  };

  ////////////-----Add your code section here-----///////////////////////
  const onTableChange = (action, tableState, rows, meta) => {
    const tableActions = props.initializeTableActions(tableState, meta, tableData, columns, getESDocuments, selectedGridView);
    selectedFilters.current = tableActions?.pageESVariables?.variables?.filters;
    selectedSorts.current = tableActions?.pageESVariables?.variables?.sort;

    if (action === "filterChange") {
      setFilters(tableState.filterList);
    }
    switch (action) {
      case "filterChange":
        dispatch(
          updateUserGridViewSettingAction.STARTED({
            userGridViewSetting: {
              module: "Documents",
              gridView: selectedGridView._id,
              gridViewPatch: {
                filters: selectedFilters.current,
                columns: tableState.columns.map((col) => ({ name: col.name, display: col.display === "true" })),
              },
              user: stateApp.user?.mongoId,
            },
          })
        );
        break;
      case "resetFilters":
        dispatch(
          updateUserGridViewSettingAction.STARTED({
            userGridViewSetting: {
              module: "Documents",
              gridView: selectedGridView._id,
              gridViewPatch: {
                filters: selectedFilters.current,
                columns: tableState.columns.map((col) => ({ name: col.name, display: col.display === "true" })),
              },
              user: stateApp.user?.mongoId,
            },
          })
        );
        break;
      case "search":
      case "sort":
      case "changeRowsPerPage":
        const tableClass = document.querySelectorAll("[class*=MUIDataTable-responsiveBase]");
        if (tableClass.length > 0) tableClass[0].scrollTop = 0;
        tableActions.genericESAction();
        break;
      case "changePage":
        isPageChanged(true);
        tableActions.changeESPage();
        break;
      case "viewColumnsChange":
        dispatch(
          updateUserGridViewSettingAction.STARTED({
            userGridViewSetting: {
              module: "Documents",
              gridView: selectedGridView._id,
              gridViewPatch: {
                filters: selectedFilters.current,
                columns: tableState.columns.map((col) => ({ name: col.name, display: col.display === "true" })),
              },
              user: stateApp.user?.mongoId,
            },
          })
        );
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
      view.filters[0].type = "range";
      view.filters[0].value.range[view.filters[0].field].gte = moment().subtract(30, "days").toISOString();
      view.filters[0].value.range[view.filters[0].field].lte = moment().toISOString();
    }
    return view;
  };

  const updateColumnSorting = (value) => {
    dispatch(
      updateUserGridViewSettingAction.STARTED({
        userGridViewSetting: {
          module: "Documents",
          gridView: selectedGridView._id,
          gridViewPatch: {
            filters: selectedFilters.current,
            columns: value.map((col) => ({ name: col.name, display: col.display === "true" })),
          },
          user: stateApp.user?.mongoId,
        },
      })
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

  const onInfiniteScroll = () => {
    document.getElementById("pagination-next").click();
  };

  return (
    <div className={classes.documentTable}>
      <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
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
        {stateApp.showFieldModal && <MetaField columns={columns} category="Docs" updateColumnSorting={updateColumnSorting} />}
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
          onInfiniteScroll={onInfiniteScroll}
          deleteFunc={deleteFunc}
          onTableChange={onTableChange}
          onCustomKeyChange={onCustomKeyChange}
        />
      </Container>
    </div>
  );
}

export default React.memo(TableHOC(DocumentsTable), deepEqualObjects);
