import React from 'react';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import {AppContext} from '../../../AppContext'

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '50vh',
    overflow: 'scroll',
    overflowX: 'hidden',
  },
});
const main_div = {
  textAlign: 'center',
  padding: '1.5vh'
}
const style_papaer = {
  background: 'none',
  maxWidth: '700px',
  margin: '0px auto',
  boxShadow: 'none'
}
const table_cell_input ={
  padding: '3px'
}
const big_text={
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#504D4D',
}
const padding_div_top={
  paddingTop: '4vh'
}
const text_grey ={
  fontSize: '12px',
  fontWeight: 'bold',
  color: 'grey',
}

const headers_input = {
    width: '100%',
    borderRadius: '5px',
    border: '2px solid #F2F1F1',
    height: '4vh',
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontWeight: 'bold',
    border: '0px',
    background: 'white'
  },
  body: {
    border: '0px',
  },
}))(TableCell);

export default function M1neralHeaders(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = React.useContext(AppContext);

  let columns  = [{label:"Import"},{label:"Your Headers"},{label:"M1neral Headers"}]
  let data = stateApp.m1neralHeaders
  let CSV_headers =  stateApp.mappedHeadersFromCSV

  // let options_from_list = options()
  const UpdateState = () =>{
    for(let index in CSV_headers){
      for(let index2 in data){
        if (CSV_headers[index].actual_key === data[index2].actual_key){
          data[index2].mapped_key = CSV_headers[index].mapped_key
          data[index2].required = CSV_headers[index].required
        }
      }
    }
    setStateApp(state=>({...state,m1neralHeaders: data, mappedHeadersFromCSV: CSV_headers}))
  }
  const handleChange_select = (event, index)=>{
    CSV_headers[index].actual_key = data[event.target.value].actual_key
    CSV_headers[index].label = data[event.target.value].label
    CSV_headers[index].required = true
    changeDataToSendState()
    UpdateState()
  }
  const handleChange_checkBox = (event, index)=>{
    CSV_headers[index].required = event.target.checked
    changeDataToSendState()
    UpdateState()
  }

  const createLeadSource = ()=>{
    var newDate= new Date().toISOString()
    newDate= newDate.split('T')[0]
    newDate = newDate.split('-').reverse().join('.')
    let leadSource = 'Manual Upload on ' + newDate
    return leadSource
  }

  const changeDataToSendState = () =>{
    let headers = stateApp.mappedHeadersFromCSV
    let arr_data = stateApp.csvContactsList;
    let filtered_data_to_send = arr_data.map(obj => {
        let return_obj = {};
        for (let header of headers) {
            if (header.required && obj.data[header.mapped_key]!== undefined && header.mapped_key !== 'initial') {
                return_obj[header.actual_key] = obj.data[header.mapped_key];
            }
        }
        if(return_obj === {}){
            return null
        }
        return_obj['name'] = '';
        if(return_obj['first_name']){
            return_obj['name'] = return_obj['first_name']
        }
        if(return_obj['first_name'] && return_obj['last_name'] ){
            return_obj['name'] = return_obj['first_name'] + ' ' + return_obj['last_name'] 
        }else{
            if(return_obj['first_name']){
                return_obj['name'] = return_obj['first_name']
            }
            if(return_obj['last_name']){
                return_obj['name'] = return_obj['last_name']
            }
        }
        return_obj['leadSource'] = createLeadSource();
        return return_obj;
    })
    filtered_data_to_send = filtered_data_to_send.filter(obj=>{
        if(Object.keys(obj).length !== 0){
            return true	
        }
        return false
    })
    setStateApp(state=>({...state,csvContactsListToSend: filtered_data_to_send}))
  }
 
  return (
    <div style={main_div}>
      <div style={{...big_text, ...padding_div_top}}>Match your headers to M1neral headers</div>
      <div style={{...text_grey, ...padding_div_top}}>Select the M1neral header that best represents the headers from your file</div>
      <div style={padding_div_top}>
        <Paper className={classes.root} style={style_papaer}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledTableCell key={column.label}>
                      {column.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {CSV_headers.map((row, index) => {
                  return (
                    <TableRow key={index}>
                        <StyledTableCell key={columns[0].label}>
                          <Checkbox
                            checked={row.required}
                            color="default"
                            onChange={(event)=> handleChange_checkBox(event,index)}
                            inputProps={{ 'aria-label': 'checkbox with default color' }}
                          />
                        </StyledTableCell>
                        <StyledTableCell key={columns[1].label}>
                        {row.mapped_key}
                        </StyledTableCell>
                        <StyledTableCell key={columns[2].label} style={table_cell_input}>
                        <div>
                            <select style={headers_input} id={'select'+ index} defaultValue={row.actual_key === ''?'initial': row.actual_key}
                            onChange={ (event)=> handleChange_select(event,index)} 
                            >
                                <option disabled hidden value='initial' > Select Header </option>
                                {data.map((option,i)=>{
                                    return(
                                    <option value={i} key={i}>{option.label}</option>
                                    )
                                })}
                            </select>
                        </div>
                        </StyledTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
}
