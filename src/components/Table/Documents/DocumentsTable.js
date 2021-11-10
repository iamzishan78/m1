import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import AddIcon from "@material-ui/icons/Add";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "react-select";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import { Controller, useForm } from "react-hook-form";
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
// QUERIES
import { useLazyQuery, useMutation } from "@apollo/client";

import {
  deepEqualObjects,
  setStateIfDeepEqual,
} from "components/Shared/functions";
import GridView from "components/Shared/GridView";
import { HeaderComponent } from "components/Table/helpers";
import {
  handleSelectedGridChange,
  setColumnsData,
} from "components/Table/helpers";

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
    type: "Default",
  };
  const selectedFilters = useRef([]);

  // function states\
  const [filters, setFilters] = useState([]);
  const [columns, Columns] = useState(JSON.parse(JSON.stringify(TableHeader)));
  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };
  const [showSaveAsNew, setShowSaveAsNew] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFieldModal, setShowFieldModal] = useState(false);
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
  }, [
    getESDocuments,
    props.parent,
    props.documentSearchQuery,
    selectedGridView,
  ]);

  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      props.setRows(tableData?.hits);
      setColumnsData(
        TableHeader,
        filters,
        JSON.parse(JSON.stringify(columns)),
        setColumns,
        setFilters,
        GET_ES_DOCUMENTS_FILTER
      );
      props.setLoading(false);
    } else if (tableData?.length === 0) {
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

  useEffect(() => {
    const updatedColumns = handleSelectedGridChange(
      TableHeader,
      selectedGridView,
      columns
    );
    setColumnsData(
      TableHeader,
      filters,
      JSON.parse(JSON.stringify(updatedColumns)),
      setColumns,
      setFilters,
      GET_ES_DOCUMENTS_FILTER
    );
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
    setShowFieldModal,
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
            handleClose={() => setShowViewModal(false)}
            setSelectedGridView={setSelectedGridView}
            selectedGridView={selectedGridView}
            setShowViewModal={setShowViewModal}
            setShowSaveAsNew={setShowSaveAsNew}
            showSaveAsNew={showSaveAsNew}
            selectedFilters={selectedFilters.current}
          />
        )}
        {!showFieldModal && <MetaField setShowFieldModal={setShowFieldModal} />}
        <Table
          style={{ backgroundColor: "#fff" }}
          header={header}
          headerComponent={HeaderComponent}
          viewColumn={CustomerViewCol}
          headerProps={headerProps}
          viewColumnProps={viewColumnProps}
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
        />
      </Container>
    </>
  );
}

const useColumnViewStyles = makeStyles((theme) => ({
  container: {
    padding: "15px 20px",
    width: "300px",
  },
  columnLabel: {
    color: "#929292",
    marginTop: 5,
  },
  addField: {
    color: "#929292",
    marginTop: 15,
    float: "right",
    display: "flex",
    cursor: "pointer",
  },
  addIcon: {
    fontSize: "18px",
    marginTop: -1,
  },
  f13: {
    fontSize: "13px",
  },
  columnContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const CustomerViewCol = (props) => {
  const classes = useColumnViewStyles();
  const { updateColumns, columns, setShowFieldModal } = props;
  return (
    <>
      <div className={classes.container}>
        <div className={classes.columnLabel}>Columns</div>
        <div>
          <div
            className={classes.addField}
            onClick={() => {
              var element = document.querySelector('[aria-label="Close"]');
              element.click();
              setShowFieldModal(true);
            }}
          >
            <AddIcon className={classes.addIcon} />{" "}
            <span className={classes.f13}>Add field</span>
          </div>
        </div>
        <div style={{ marginTop: 40 }}>
          {columns
            .filter((col) => col.viewColumns)
            .map((col) => {
              return (
                <div key={col.name} className={classes.columnContainer}>
                  <span>{col.label}</span>
                  <Checkbox
                    style={{ padding: 3 }}
                    checked={col.display === "true"}
                    onChange={(e) => {
                      const index = columns.findIndex(
                        (co) => co.name === col.name
                      );
                      col.display === "false"
                        ? (columns[index].display = "true")
                        : (columns[index].display = "false");
                      updateColumns(columns);
                    }}
                    color="primary"
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

const useMetaFieldStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
  },
  selectedType: {
    borderBottom: "4px solid #01B0F0",
    color: "#01B0F0",
    display: "inline",
    cursor: "pointer",
  },
  unSelectedType: {
    display: "inline",
    color: "#827F7F",
    cursor: "pointer",
  },
  select: {
    width: "100%",
  },
  addField: {
    color: "#929292",
    marginTop: 15,
    float: "right",
    display: "flex",
    cursor: "pointer",
  },
  addIcon: {
    fontSize: "18px",
    marginTop: 1,
  },
}));

const MetaField = ({ setShowFieldModal }) => {
  const classes = useMetaFieldStyles();
  const [selectedTab, setSelectedTab] = useState("new");
  const [showAddDescription, setShowAddDescription] = useState(false);
  const { control, reset, setValue, register, getValues, watch } = useForm();

  const options = [
    { value: "dropdown", label: "Drop-down" },
    { value: "text", label: "Text" },
  ];

  const viewOptions = [
    {
      label: "Create new",
      value: "new",
    },
    {
      label: "Choose from library",
      value: "existing",
    },
  ];

  const categoryOptions = [
    {
      label: "Docs",
      value: "Docs",
    },
    {
      label: "Contacts",
      value: "Contacts",
    },
    {
      label: "Flow",
      value: "Flow",
    },
    {
      label: "All",
      value: "All",
    },
  ];

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={true}
      onClose={() => setShowFieldModal(false)}
    >
      <div>
        <div className={classes.header}>
          <h3>Add Field</h3>
          <IconButton onClick={() => setShowFieldModal(false)}>
            <CloseIcon />
          </IconButton>
        </div>
        <div>
          <div
            style={{
              margin: "0px 10px",
              paddingBottom: 8,
              borderBottom: "1px solid #EEF1F4",
            }}
          >
            {viewOptions.map((option) => {
              return (
                <span
                  style={{ marginLeft: 13, padding: 5 }}
                  onClick={() => setSelectedTab(option.value)}
                  className={
                    selectedTab === option.value
                      ? classes.selectedType
                      : classes.unSelectedType
                  }
                >
                  {option.label}
                </span>
              );
            })}
          </div>
          <div style={{ padding: 35 }}>
            <Grid container spacing={0}>
              <Grid
                container
                item
                xs={7}
                style={{ paddingRight: 20 }}
                alignItems="center"
              >
                <label style={{ margin: "5px 0px" }}>Field title</label>
                <Controller
                  control={control}
                  name="title"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="text"
                      variant="outlined"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                      }}
                      placeholder="e.g. Priority, Stage, Status"
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />
              </Grid>
              <Grid container item xs={5} alignItems="center">
                <label style={{ margin: "5px 0px" }}>Field type</label>
                <Controller
                  control={control}
                  name="type"
                  defaultValue={options[0].value}
                  render={(props) => (
                    <Select
                      value={options.find((op) => op.value === props.value)}
                      menuPlacement="auto"
                      options={options}
                      className={classes.select}
                    />
                  )}
                />
              </Grid>
              <Grid
                container
                item
                xs={7}
                style={{ paddingRight: 20 }}
              >
                {!showAddDescription ? (
                  <div
                    className={classes.addField}
                    onClick={() => {
                      setShowAddDescription(true);
                    }}
                  >
                    <AddIcon className={classes.addIcon} />{" "}
                    <span className={classes.f13}>Add Description</span>
                  </div>
                ) : (
                  <Controller
                    control={control}
                    name="description"
                    render={(props) => (
                      <TextField
                        style={{ paddingTop: 20}}
                        size="small"
                        type="text"
                        variant="outlined"
                        value={props.value}
                        inputRef={props.ref}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                        }}
                        placeholder="Description"
                        fullWidth
                        defaultValue=""
                        multiline
                        rows={3}
                        rowsMax={4}
                      />
                    )}
                  />
                )}
              </Grid>
              <Grid
                container
                item
                xs={5}
                style={{ paddingTop: 20}}
              >
                <Controller
                  control={control}
                  name="category"
                  defaultValue={categoryOptions[0].value}
                  render={(props) => (
                    <Select
                      value={categoryOptions.find(
                        (op) => op.value === props.value
                      )}
                      menuPlacement="auto"
                      options={categoryOptions}
                      className={classes.select}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </div>
          <div style={{ padding: "0px 35px" }}>
            <SortableComponent />
          </div>
          <div
            style={{
              borderTop: "1px solid #EEF1F4",
            }}
          >
            <div style={{ float: "right" }}>
              <Button
                style={{ margin: "25px 5px 25px 0px" }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                style={{ margin: "25px 25px 25px 5px" }}
                variant="outlined"
              >
                Create Field
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};


const SortableComponent= () => {
  const state = {
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
  };

  const onSortEnd = ({oldIndex, newIndex}) => {
    console.log('old-new', oldIndex, newIndex)
  };

  return <SortableList items={state.items} onSortEnd={onSortEnd} useDragHandle />;
}

const SortableList = SortableContainer(({items}) => {
  return (
    <List style={{  margin: 0, padding: 0 }}  component="div">
      {items.map((value, index) => (
        <SortableItem key={`item-${value}`} index={index} value={value} />
      ))}
    </List>
  );
});

const DragHandle = sortableHandle(() => <DragIndicatorIcon style={{ fontSize: 18 }} />);

const SortableItem = SortableElement(({value}) => (
  <ListItem ContainerComponent="div" style={{ borderBottom: "1px solid #EEF1F4", padding: "5px 0px",  zIndex: 1300 }}>
    <DragHandle/> 
    <div style={{ display: "flex"}}>
      <div style={{ marginTop: 4, marginLeft: 10, marginRight: 10, width: 15, height: 15, backgroundColor: 'black', display: 'inline-block', borderRadius: 10 }}></div>
      <span>{value}</span>
    </div>
  </ListItem>
));

export default React.memo(TableHOC(DocumentsTable), deepEqualObjects);
