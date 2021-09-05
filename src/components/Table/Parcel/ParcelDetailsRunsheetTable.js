import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from 'moment';

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
import { GET_PARCELS_AGREEMENT } from "graphQL/useQueryGetParcelAgreement";
import { DELETE_PARCEL_RUNSHEET } from "graphQL/useMutationDeleteParcelAgreement";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";
import ParcelInstrument from "components/ParcelsDetailCard/ParcelInstrument";

// Header Schemas 
import TableHeader from 'components/Table/constants/parcel-runsheet-header-schema.js'
import { handleTagColumn } from "../helpers";

import { AppContext } from "AppContext";


const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important"
  },
}));

function ParcelDetailsRunsheetTable(props) {
  const classes = useStyles();

  const [stateApp, setStateApp] = useContext(AppContext);

  // function states 
  const [columns, Columns] = useState([]);
  const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };
  const [searchedRows, setSearchedRows] = useState([])
  const [showSlider, setShowSlider] = useState(false)
  const [selectedYear, setSelectedYear] = useState(2020)  // production selected year state 
  const [numPages, setNumPages] = useState(null);

  // queries 
  const [getParcelAgreement, { data: dataParcelAgreement, loading }] = useLazyQuery(GET_PARCELS_AGREEMENT);

  const [deleteParcelRunsheet] = useMutation(DELETE_PARCEL_RUNSHEET, { refetchQueries: [ "getParcelAgreement" ], awaitRefetchQueries: true });
  const tableData = dataParcelAgreement?.getParcelAgreement

  const addAble = { type: "parcelRunsheet" }
  const total = false
  const orderByTracks = false

  useEffect(()=>{
    setSearchedRows(props.rows)
  },[props.rows])

  useEffect(() => {
		getParcelAgreement({
			variables: {
				parcelId: props.customLayer._id,
			},
		});
	}, [getParcelAgreement, props.customLayer._id]);


  useEffect(() => {
    if (dataParcelAgreement?.getParcelAgreement?.length > 0) {
      let wells = dataParcelAgreement.getParcelAgreement
      const objectsIdsArray = wells.map((well) => well._id);
      props.initializeGenericData(objectsIdsArray, ['comments', 'tags'])
    }

  }, [tableData, props.dependencyUpdate])

  useEffect(() => {
    if (dataParcelAgreement?.getParcelAgreement?.length > 0) {
      let wells = dataParcelAgreement.getParcelAgreement
      wells = wells.map((w) => {
        let well = { ...w };
        well.effectiveDate = well.effectiveDate ? moment(well.effectiveDate).format('MM/DD/YYYY') : ''
        well.executionDate = well.executionDate ? moment(well.executionDate).format('MM/DD/YYYY') : ''
        well.fileDate = well.fileDate ? moment(well.fileDate).format('MM/DD/YYYY') : ''

        well = props.setGenricData(well, well._id, ['comments', 'tracks', 'tags'])
        return { ...well, _id: w._id }; 
      })
      props.setRows(wells);
      const cleanAvailableTags = [];
      const columns = handleTagColumn(TableHeader, cleanAvailableTags);
      setColumns(columns);
      props.setLoading(false);
    }
    else if (dataParcelAgreement?.getParcelAgreement?.length === 0) {
      props.setRows([]);
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

  const count = dataParcelAgreement?.paginatedContactWellInterests?.totalCount || 0
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
      const record = props.rows.find(row => row._id === ids[i])
      if(record){
        deleteParcelRunsheet({
          variables: {
              id: record.descriptorObject,
              parcelId: props.customLayer._id,
              fileId: record.fileId
          },
          refetchQueries: [
            "getParcelAgreement",
          ],
          awaitRefetchQueries: true,
        })
      }
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
    setShowSlider(true)
  }

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      {showSlider && (
        <ParcelInstrument parcelId={props.customLayer._id} setShowSlider={setShowSlider} />
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
      </Dialog>
    </Container>
  );
}

export default React.memo(TableHOC(ParcelDetailsRunsheetTable), deepEqualObjects);


