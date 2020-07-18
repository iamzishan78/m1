import React, {
  useContext,
  useEffect,
  useRef
} from "react";
import {AppContext} from '../../../AppContext'
import {Button} from '@material-ui/core'

import { CSVReader } from 'react-papaparse'
import { makeStyles,withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    margin: '0px auto',
    fontSize: '14px'
  }
});

function createData(first_name, last_name, address, city, state, zip, email, phone) {
  return { first_name, last_name, address, city, state, zip, email, phone };
}

const rows = [
  createData('John', 'Doe', 'H.no: 776', 'Florida', 'VA', '1121', 'unknown@ukmansul.com', '9982--1928'),
  createData('John', 'Doe', 'H.no: 776', 'Florida', 'VA', '1121', 'unknown@ukmansul.com', '9982--1928'),
  createData('John', 'Doe', 'H.no: 776', 'Florida', 'VA', '1121', 'unknown@ukmansul.com', '9982--1928'),
  createData('John', 'Doe', 'H.no: 776', 'Florida', 'VA', '1121', 'unknown@ukmansul.com', '9982--1928'),
];



const main_div={
  textAlign: 'center',
  padding: '1.5vh',
}
const upload_box={
  margin: '0 auto',
  width: '50%',
  borderRadius: '0px !important',
}
const upload_box_div = {
  height: '30vh'
}
const big_text={
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#504D4D',
}
const small_grey_text={
  fontSize: '10px',
  fontWeight: 'bold',
  color: 'grey',
}
const big_grey_text={
  fontSize: '20px',
  color: 'grey',
}
const padding_div_top={
  paddingTop: '4vh'
}
const normal_padidng={
  padding: '1vh'
}
const text_grey ={
  fontSize: '12px',
  fontWeight: 'bold',
  color: 'grey',
}
const sample_table_area={
  background: '#E9E8E8',
  margin: '0px auto',
  width: '70%',
}
const table_body={
  background: 'white'
}
const style_papaer = {
  background: 'none',
  width: '90%',
  margin: '0px auto',
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontWeight: 'bold',
    border:'1px solid grey',
    fontSize: '12px',
    padding: '2px 5px'
  },
  body: {
    border:'1px solid grey',
    fontSize: '12px',
    padding: '2px 5px'
  },
}))(TableCell);

export default function CSVFileReader(props){
  let [stateApp, setStateApp] = useContext(AppContext);
  const classes = useStyles();
  let unmounted =  useRef(false);

  useEffect(()=>{
    return ()=>{
      unmounted.current = true
    }
  },[])

  let handleOnDrop = (data) => {
    if(!unmounted.current){
      mapped_headers_from_CSV(data)
      setStateApp((state) => ({ ...state, csvContactsList: data, activeStepNumber: stateApp.activeStepNumber + 1 }))
    }
  }

  const mapped_headers_from_CSV = (data)=>{
    if (data.length>0){
        var uniqueKeys = Object.keys(data[0].data);
        // uniqueKeys = uniqueKeys.sort();
        for(let index in uniqueKeys){
          uniqueKeys[index] ={
              mapped_key: uniqueKeys[index],
              required: false,
              actual_key: "",
              label: ""
          }
        }
        setStateApp(state => ({...state, mappedHeadersFromCSV: uniqueKeys}))
    }
  }
 
  let handleOnError = (err, file, inputElem, reason) => {
    if(!unmounted.current){
      console.log(err)
    }
  }
 
  let handleOnRemoveFile = (data) => {
    if(!unmounted.current){
      console.log(data)
    }
  }
 
  return (
    <div style={main_div}>
      <div style={{...big_text, ...padding_div_top}}>Select a File to Import</div>
      <div style={{...text_grey, ...padding_div_top}}>Don't forget to upload CSV with first row containing the column headers</div>
      <div style={{...padding_div_top, ...upload_box_div}}>
        <CSVReader
          onDrop={handleOnDrop}
          onError={handleOnError}
          addRemoveButton
          removeButtonColor='#659cef'
          config={{
            header:true
          }}
          onRemoveFile={handleOnRemoveFile}
          style={upload_box}
        >
          <span>Drop File To Upload.</span>
          <span>or</span>
          <Button variant="contained" color="primary">
            Choose File
          </Button>
        </CSVReader>
      </div>
      <div style={{...text_grey, ...normal_padidng}}>Your data is private. We don't share relationships with anyone</div>
      <div style={sample_table_area}>
        <div style={{...big_text, ...padding_div_top}}>Preferred File Setup</div>
        <div style={{...big_grey_text, ...normal_padidng}}>A CSV with these columns will yield good results</div>
        <a href='#' style={normal_padidng} onClick={()=>{return false}}>Download over CSV template and add your information</a>
        <div style={{...padding_div_top}}>
        <TableContainer component={Paper} style={style_papaer}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead >
              <TableRow>
                <StyledTableCell>First Name</StyledTableCell>
                <StyledTableCell align="right">Last Name</StyledTableCell>
                <StyledTableCell align="right">Street Address</StyledTableCell>
                <StyledTableCell align="right">City</StyledTableCell>
                <StyledTableCell align="right">State</StyledTableCell>
                <StyledTableCell align="right">Zip</StyledTableCell>
                <StyledTableCell align="right">Email</StyledTableCell>
                <StyledTableCell align="right">Phone Number</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody style={table_body}>
              {rows.map((row,i) => (
                <TableRow key={i+ row.first_name}>
                  <StyledTableCell component="th" scope="row">
                    {row.first_name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.last_name}</StyledTableCell>
                  <StyledTableCell align="right">{row.address}</StyledTableCell>
                  <StyledTableCell align="right">{row.city}</StyledTableCell>
                  <StyledTableCell align="right">{row.state}</StyledTableCell>
                  <StyledTableCell align="right">{row.zip}</StyledTableCell>
                  <StyledTableCell align="right">{row.email}</StyledTableCell>
                  <StyledTableCell align="right">{row.phone}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        </div>
        <div style={{...small_grey_text, ...normal_padidng}}>Sample data of CSV file</div>
      </div>
    </div>
  )
}