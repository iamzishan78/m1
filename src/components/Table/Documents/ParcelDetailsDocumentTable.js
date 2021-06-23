import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import { Container } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { Document, Page } from "react-pdf";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PARCELS_FILES } from "graphQL/useQueryGetParcelFiles";
import { UPDATEWELLINTEREST } from "graphQL/useMutationUpdateWellInterest";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";
import ParcelFile from "components/Document/components/ParcelFile";

// Header Schemas 
import TableHeader from 'components/Table/constants/parcel-documents-header-schema.js'
import { handleTagColumn } from "../helpers";

import { AppContext } from "AppContext";


const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important"
  },
}));

function ParcelDetailsDocumentTable(props) {
  const classes = useStyles();

  const [stateApp, setStateApp] = useContext(AppContext);

  // function states 
  const [columns, Columns] = useState([]);
  const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };
  const [searchedRows, setSearchedRows] = useState([])
  const [showDocumentSlider, setShowDocumentSlider] = useState(false)
  const [selectedYear, setSelectedYear] = useState(2020)  // production selected year state 
  const [numPages, setNumPages] = useState(null);

  // queries 
  const [getAllFiles, { data: dataParcelFiles, loading }] = useLazyQuery(GET_PARCELS_FILES);

  const [updateWellInterest] = useMutation(UPDATEWELLINTEREST, { refetchQueries: [ "getContactWells", "getContactParcelInterests" ], awaitRefetchQueries: true });
  const tableData = dataParcelFiles?.getParcelFiles

  const addAble = { type: "parcelDocument" }
  const total = false
  const orderByTracks = false

  useEffect(()=>{
    setSearchedRows(props.rows)
  },[props.rows])

  useEffect(() => {
		getAllFiles({
			variables: {
				relatedObjectId: props.customLayer._id,
				relatedObjectType: "Parcel",
			},
		});
	}, [getAllFiles, props.customLayer._id]);


  useEffect(() => {
    if (dataParcelFiles?.getParcelFiles?.length > 0) {
      let wells = dataParcelFiles.getParcelFiles
      wells = wells.map((w) => {
        return { ...w, _id:w.fileId }; 
      })
      props.setRows(wells);
      const cleanAvailableTags = [];
      const columns = handleTagColumn(TableHeader, cleanAvailableTags);
      setColumns(columns);
      props.setLoading(false);
    }
    else if (dataParcelFiles?.getParcelFiles?.length === 0) {
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
  }

  const deleteFunc = (ids)=> {
    for(let i=0; i< ids.length;  i++){
      updateWellInterest({
        variables: {
          wellInterest: {
            id: ids[i],
            isDeleted: true
          },
        },
        refetchQueries: [
          "getContactWells",
          "getContactParcelInterests"
        ],
        awaitRefetchQueries: true,
      });
    }
  }

  const searchData = (tableState) => {
    let rows = []
    if(tableState.searchText){
      for(let i=0; i< props.rows.length; i++){
        for( const key of Object.keys(props.rows[i])){
          const col = columns.find(column => column.name === key)
          if(col && (!col.options || col.options.searchable !== false)) {
            if(typeof props.rows[i][key] === 'string'){
              console.log(props.rows[i][key], key)
              const value = props.rows[i][key].toLowerCase()
              if(value.includes(tableState.searchText.toLowerCase())){
                rows.push(props.rows[i])
                break
              }
            }
          }
        }
      }
    }else{
      rows = props.rows
    }
    rows = JSON.parse(JSON.stringify(rows));
    for(let j=0; j<tableState.filterList.length; j++){
      if(tableState.filterList[j].length> 0){
        for(let i=0; i<rows.length;i++){
          const isFiltered = rows[i].isFiltered !== false 
          const rowdata = rows[i][columns[j].name]
          const filter = tableState.filterList[j][0]
          if(isFiltered&& rowdata !== filter){
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
        <ParcelFile getAllFiles={getAllFiles} parcelId={props.customLayer._id} documents={props.rows} setShowDocumentSlider={setShowDocumentSlider} />
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
            justify="space-between" // Add it here :)
            container
            spacing={24}
          >
            <Grid item>
              <Typography className={classes.fileTitle} type="title" color="inherit">
                {stateApp.pdfView?.fileName}
              </Typography>
            </Grid>

            <Grid item>
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

        <Document
          file={stateApp.pdfView?.viewToken}
          options={{ workerSrc: "/pdf.worker.js" }}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>

        {/* {stateApp.viewDoc && ExtenstionGetter(stateApp?.viewDoc.name) === 'pdf' ? (
          <div className={classes.leftColumn}> <DocViewer DocStyle={{ backgroundColor: 'white !important', width: '70vw' }} divCondition={true}></DocViewer></div>
        ): null} */}

      </Dialog>

    </Container>
  );
}

export default React.memo(TableHOC(ParcelDetailsDocumentTable), deepEqualObjects);


