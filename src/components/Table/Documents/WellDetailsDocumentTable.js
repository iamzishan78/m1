import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import { Container } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import GetAppIcon from "@material-ui/icons/GetApp";
import { Document, Page } from "react-pdf";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PARCELS_FILES } from "graphQL/useQueryGetParcelFiles";
import { DELETEDESCRIPTORFILE } from "graphQL/useMutationDeleteDescriptorFile";
import { TENANTWELL } from "graphQL/useQueryTenantWell";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";
import WellFile from "components/Document/components/WellFile";

// Header Schemas 
import TableHeader from 'components/Table/constants/parcel-documents-header-schema.js'
import { handleTagColumn } from "../helpers";

import { AppContext } from "AppContext";


const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important"
  },
  ZoomIcons: {
    zIndex: "1",
    display: "flex",
    flexDirection: "column",
    position: "absolute !important",
    top: "85% !important",
    bottom: "0 !important",
    left: "15px",
    width: "3.875rem",
  },
  docViewSection: {
    overflow: "scroll",
    height: "98%",
    width: "100%"
  }
}));

function WellDetailsDocumentTable(props) {
  const classes = useStyles();

  const [stateApp, setStateApp] = useContext(AppContext);

  // function states 
  const [columns, Columns] = useState([]);
  const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };
  const [searchedRows, setSearchedRows] = useState([])
  const [showDocumentSlider, setShowDocumentSlider] = useState(false)
  const [selectedYear, setSelectedYear] = useState(2023)  // production selected year state 
  const [numPages, setNumPages] = useState(null);
  const [zoom, setzoom] = useState(2.0);
  const [isDocumentLoaded, setDocumentLoaded] = useState(false);

  // queries 
  const [getAllFiles, { data: dataParcelFiles, loading }] = useLazyQuery(GET_PARCELS_FILES);
  const [getTenantWellId, { data: tenantData }] = useLazyQuery(TENANTWELL);

  const [updateParcelDocument] = useMutation(DELETEDESCRIPTORFILE, { refetchQueries: ["getAllFiles"], awaitRefetchQueries: true });
  const tableData = dataParcelFiles?.getParcelFiles

  const addAble = { type: "wellDocument" }
  const total = false
  const orderByTracks = false

  useEffect(() => {
    setSearchedRows(props.rows)
  }, [props.rows])

  useEffect(() => {
    if (props.selectedWell.tenantWellId === undefined) getTenantWellId({ variables: { globalWellId: props.selectedWell?.id } })
  }, [getTenantWellId, props.selectedWell?.id, props.selectedWell.tenantWellId])

  useEffect(() => {
    let wellId;

    if (props.selectedWell.tenantWellId) wellId = props.selectedWell.tenantWellId;
    else wellId = tenantData?.tenantWell.tenantWellId;

    getAllFiles({
      variables: {
        relatedObjectId: wellId,
        relatedObjectType: "Well",
      },
    });
  }, [props.selectedWell.tenantWellId, showDocumentSlider]);


  useEffect(() => {
    if (dataParcelFiles?.getParcelFiles/*?.length > 0*/) {
      let wells = dataParcelFiles.getParcelFiles
      wells = wells.map((w) => {
        return { ...w, _id: w.descriptorId, documentDate: w.dateTime ? moment(w.dateTime).format('MM/DD/YYYY') : '' };
      })
      props.setRows(wells);
      const cleanAvailableTags = [];
      const columns = handleTagColumn(TableHeader, cleanAvailableTags);
      setColumns(columns);
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

  const count = dataParcelFiles?.paginatedContactWellInterests?.totalCount || 0
  const options = {
    rowsPerPageOptions: count > 25 ? [10, 25, 50, 100] : count > 10 ? [10, 25] : [],
    count: count,
    serverSide: true
  }
  ////////////-----Add your code section here-----///////////////////////
  const getWellOwnersByYear = (selectedYear) => {
    setSelectedYear(selectedYear)
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setDocumentLoaded(true);
  }

  const deleteFunc = (ids) => {
    for (let i = 0; i < ids.length; i++) {
      updateParcelDocument({
        variables: {
          id: ids[i],
        },
        refetchQueries: ["getParcelFiles"],
        awaitRefetchQueries: true,
      });
    }
  }

  const downloadFile = (viewFile) => {
    if (viewFile?.viewToken) {
      let a = document.createElement("a");
      a.href = viewFile.viewToken;
      a.download = viewFile.documentName;
      a.click();
    }
  };

  const searchData = (tableState) => {
    let rows = []
    if (tableState.searchText) {
      for (let i = 0; i < props.rows.length; i++) {
        for (const key of Object.keys(props.rows[i])) {
          const col = columns.find(column => column.name === key)
          if (col && (!col.options || col.options.searchable !== false)) {
            if (typeof props.rows[i][key] === 'string') {
              const value = props.rows[i][key].toLowerCase()
              if (value.includes(tableState.searchText.toLowerCase())) {
                rows.push(props.rows[i])
                break
              }
            }
          }
        }
      }
    } else {
      rows = props.rows
    }
    rows = JSON.parse(JSON.stringify(rows));
    for (let j = 0; j < tableState.filterList.length; j++) {
      if (tableState.filterList[j].length > 0) {
        for (let i = 0; i < rows.length; i++) {
          const isFiltered = rows[i].isFiltered !== false
          const rowdata = rows[i][columns[j].name]
          const filter = tableState.filterList[j][0]
          if (isFiltered && rowdata !== filter) {
            rows[i].isFiltered = false
            continue
          }
        }
      }
    }
    setSearchedRows(rows.filter(row => row.isFiltered !== false))
  }


  const onTableChange = (action, tableState, rows, meta) => {
    switch (action) {
      case "search":
        searchData(tableState)
        break;
      case "onSearchClose":
        break;
      case "filterChange":
        searchData(tableState)
        break
      default:
    }
  }

  const onClickAdd = () => {
    setShowDocumentSlider(true)
  }

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      {showDocumentSlider && (
        <WellFile
          getAllFiles={(variables) => getAllFiles(variables)}
          globalWellId={props.selectedWell.id}
          tenantWellId={props.selectedWell.tenantWellId}
          setShowDocumentSlider={setShowDocumentSlider}
        />
      )}
      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={columns}
        rows={searchedRows}
        total={total}
        loading={loading}
        addAble={addAble}
        targetLabel={props.targetLabel}
        deleteFunc={deleteFunc}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={orderByTracks}
        startPaginationAt={null}
        onClickAdd={onClickAdd}
        contactId={props.contactId}
        options={options}
        parent={props.parent}
        setColumnsBase={[]}
        onTableChange={onTableChange}
        getWellOwnersByYear={getWellOwnersByYear}
      />
      <Dialog
        className={classes.dialogExpCard}
        fullWidth
        maxWidth="xl"
        open={stateApp.pdfView ? true : false}
        onClose={() => {
          setStateApp((state) => ({
            ...state,
            pdfView: null,
          }));
        }}
      >
        <Toolbar>
          <Grid
            justify="space-between"
            container
            spacing={24}
          >
            <Grid item>
              {isDocumentLoaded && (
                <Typography className={classes.fileTitle} type="title" color="inherit">
                  {stateApp.pdfView?.fileName}
                </Typography>
              )}
            </Grid>

            <Grid item>
              <IconButton onClick={() => downloadFile(stateApp.pdfView)}>
                <GetAppIcon />
              </IconButton>
              <IconButton
                className="float-right"
                color="inherit"
                onClick={() => {
                  setStateApp((state) => ({
                    ...state,
                    pdfView: null,
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
          <Document
            file={stateApp.pdfView?.viewToken}
            options={{ workerSrc: "/pdf.worker.js" }}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={zoom} />
            ))}
          </Document>

          {isDocumentLoaded && (
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

export default React.memo(TableHOC(WellDetailsDocumentTable), deepEqualObjects);


