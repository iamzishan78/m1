import React, { useState, useEffect, useContext } from "react";
import moment from "moment";

import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import { Container, Tooltip, Button } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { Document, Page } from "react-pdf";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import GetAppIcon from "@material-ui/icons/GetApp";

// QUERIES
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PARCELS_FILES } from "graphQL/useQueryGetParcelFiles";
import { DELETEDESCRIPTORFILE } from "graphQL/useMutationDeleteDescriptorFile";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";
import RelatedFile from "components/Document/components/RelatedFile";
import DocumentDetailDrawer from "components/Document/components/Drawer";

// Header Schemas
import TableHeader from "components/Table/constants/parcel-documents-header-schema.js";
import { handleTagColumn } from "../helpers";
import { setColumnsData } from "components/Table/helpers";

import { AppContext } from "AppContext";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { usetableStyles } from "../Styles";

function RelatedDetailsDocumentTable(props) {
  const classes = usetableStyles();

  const [stateApp, setStateApp] = useContext(AppContext);

  // function states
  let [zoom, setzoom] = useState(2.0);
  const [filters, setFilters] = useState([]);
  const [columns, Columns] = useState([]);
  const [openDialog, setOpenDialog] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };
  const [searchedRows, setSearchedRows] = useState([]);
  const [showDocumentSlider, setShowDocumentSlider] = useState(false);
  const [numPages, setNumPages] = useState(null);

  // queries
  const [getAllFiles, { data: dataParcelFiles, loading }] = useLazyQuery(GET_PARCELS_FILES);

  const [updateParcelDocument] = useMutation(DELETEDESCRIPTORFILE, { refetchQueries: ["getAllFiles"], awaitRefetchQueries: true });
  const tableData = dataParcelFiles?.getParcelFiles;

  const total = false;

  useEffect(() => {
    setSearchedRows(props.rows);
  }, [props.rows]);

  useEffect(() => {
    getAllFiles({
      variables: {
        relatedObjectId: props.customLayer._id,
        relatedObjectType: props.relatedObjectType,
      },
      refetchQueries: ["getParcelFilesCount"],
    });
  }, [getAllFiles, props.customLayer._id]);

  useEffect(() => {
    if (dataParcelFiles?.getParcelFiles /*?.length > 0*/) {
      let documents = dataParcelFiles.getParcelFiles;
      documents = documents.map((w) => {
        return { ...w, _id: w.descriptorId, documentDate: w.dateTime ? moment(w.dateTime).format("MM/DD/YYYY") : "" };
      });
      props.setRows(documents);
      const cleanAvailableTags = [];
      const columns = handleTagColumn(TableHeader, cleanAvailableTags);
      // setColumns(columns);
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
      props.setLoading(false);
    }
    // else if (dataParcelFiles?.getParcelFiles?.length === 0) {
    //   props.setLoading(false);
    // }
  }, [tableData, props.dependencyUpdate]);

  const count = dataParcelFiles?.paginatedContactWellInterests?.totalCount || 0;
  const options = {
    rowsPerPageOptions: count > 25 ? [10, 25, 50, 100] : count > 10 ? [10, 25] : [],
    count: count,
    serverSide: true,
    rowsSelected: selectedRows.map((sR) => sR.dataIndex),
    customToolbar: () => {
      return (
        <div style={{ display: "inline", float: "left", marginRight: "15px", marginTop: "5px" }}>
          <Button color="secondary" className={classes.multiSelectionTopBarButtons} onClick={onClickAdd}>
            + ADD DOCUMENT
          </Button>
        </div>
      );
    },
    customToolbarSelect: ({ data }) => {
      return (
        <div style={{ height: "48px", display: "flex" }}>
          <div style={{ marginTop: "6px", height: "35px", display: "flex" }}>
            <Tooltip title={"Delete"}>
              <IconButton
                size="medium"
                style={{ margin: "0 5px" }}
                aria-label="delete"
                onClick={(e) => {
                  setOpenDialog("delete");
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      );
    },
  };
  ////////////-----Add your code section here-----///////////////////////

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const deleteFunc = (ids) => {
    for (let i = 0; i < ids.length; i++) {
      updateParcelDocument({
        variables: {
          id: ids[i],
        },
        refetchQueries: ["getParcelFiles"],
        awaitRefetchQueries: true,
      }); /*.then(() =>{
        getAllFiles({
          variables: {
            relatedObjectId: props.customLayer._id,
            relatedObjectType: props.relatedObjectType,
          },
        });
      });*/
    }
  };

  const searchData = (tableState) => {
    let rows = [];
    if (tableState.searchText) {
      for (let i = 0; i < props.rows.length; i++) {
        for (const key of Object.keys(props.rows[i])) {
          const col = columns.find((column) => column.name === key);
          if (col && (!col.options || col.options.searchable !== false)) {
            if (typeof props.rows[i][key] === "string") {
              const value = props.rows[i][key].toLowerCase();
              if (value.includes(tableState.searchText.toLowerCase())) {
                rows.push(props.rows[i]);
                break;
              }
            }
          }
        }
      }
    } else {
      rows = props.rows;
    }
    rows = JSON.parse(JSON.stringify(rows));
    for (let j = 0; j < tableState.filterList.length; j++) {
      if (tableState.filterList[j].length > 0) {
        for (let i = 0; i < rows.length; i++) {
          const isFiltered = rows[i].isFiltered !== false;
          const rowdata = rows[i][columns[j].name];
          const filter = tableState.filterList[j][0];
          if (isFiltered && rowdata !== filter) {
            rows[i].isFiltered = false;
            continue;
          }
        }
      }
    }
    setSearchedRows(rows.filter((row) => row.isFiltered !== false));
  };

  const onTableChange = (action, tableState, rows, meta) => {
    switch (action) {
      case "search":
        searchData(tableState);
        break;
      case "onSearchClose":
        break;
      case "filterChange":
        searchData(tableState);
        break;
      case "rowSelectionChange":
        setSelectedRows(tableState.selectedRows.data);
        break;
      default:
    }
  };

  const downloadFile = (viewFile) => {
    if (viewFile?.viewToken) {
      let a = document.createElement("a");
      a.href = viewFile.viewToken;
      a.download = viewFile.documentName;
      a.click();
    }
  };

  const onClickAdd = () => {
    setShowDocumentSlider(true);
  };

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      {showDocumentSlider && (
        <RelatedFile
          getAllFiles={(variables) => getAllFiles(variables)}
          relatedObjectType={props.relatedObjectType}
          relatedObjectId={props.customLayer._id}
          setShowDocumentSlider={setShowDocumentSlider}
        />
      )}

      <Dialog open={openDialog ? true : false} onClose={() => setOpenDialog(null)} fullWidth={true} maxWidth={"sm"}>
        {openDialog === "delete" && (
          <DeleteConfirmationDialogContent
            header="Delete Document(s)"
            onClose={() => setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={selectedRows.map((sR) => props.rows[sR.dataIndex]._id)}
            setM1nSelectedRowsIndexes={setSelectedRows}
          >
            {`Do you want to permanently delete the document${selectedRows && selectedRows.length > 1 && selectedRows.length > 1 ? "s" : ""
              } from  this ${props.name || props.relatedObjectType}?`}
          </DeleteConfirmationDialogContent>
        )}
      </Dialog>
      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={columns}
        rows={searchedRows}
        total={total}
        loading={loading}
        targetLabel={props.targetLabel}
        deleteFunc={deleteFunc}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        startPaginationAt={null}
        options={options}
        addAble={props.addAble}
        parent={props.parent}
        setColumnsBase={[]}
        onTableChange={onTableChange}
      />
      {stateApp.selectedDocument && (
        <DocumentDetailDrawer isRelatedDocuments />
      )}
      <Dialog
        className={classes.dialogExpCard}
        fullWidth
        maxWidth="xl"
        open={!!stateApp.pdfView && props.isPdfViewer}
        onClose={() => {
          setStateApp((state) => ({
            ...state,
            pdfView: null,
            viewDoc: null,
          }));
        }}
      >
        <Toolbar>
          <Grid justify="space-between" container spacing={24}>
            <Grid item>
              <Typography className={classes.fileTitle} type="title" color="inherit">
                {stateApp.pdfView?.fileName}
              </Typography>
            </Grid>

            <Grid item>
              {stateApp.pdfView && (
                <IconButton onClick={() => downloadFile(stateApp.pdfView)}>
                  <GetAppIcon />
                </IconButton>
              )}
              <IconButton
                className="float-right"
                color="inherit"
                onClick={() => {
                  setStateApp((state) => ({
                    ...state,
                    pdfView: null,
                    viewDoc: null,
                  }));
                }}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>

        <div className={classes.docViewSection}>
          <Document file={stateApp.pdfView?.viewToken} options={{ workerSrc: "/pdf.worker.js" }} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} scale={zoom} pageNumber={index + 1} />
            ))}
          </Document>

          {numPages && (
            <div className={classes.ZoomIcons}>
              {" "}
              <IconButton
                onClick={() => {
                  setzoom(zoom + 0.25);
                }}
              >
                <ZoomInIcon fontSize={"large"} />
              </IconButton>
              <IconButton
                onClick={() => {
                  setzoom(zoom - 0.25);
                }}
              >
                <ZoomOutIcon fontSize={"large"} />
              </IconButton>
            </div>
          )}
        </div>
      </Dialog>
    </Container>
  );
}

RelatedDetailsDocumentTable.defaultProps = {
  addAble: {
    type: "relatedDocument",
  },
  isPdfViewer: true
};

export default React.memo(TableHOC(RelatedDetailsDocumentTable), deepEqualObjects);
