import React, {useContext, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { NavigationContext } from '../NavigationContext';



const statusList = ["Active", "P&A", "Permit", "Shutin", "Unknown"];





export default function FilterWellStatusJ() {
    const [stateNav, setStateNav] = useContext(NavigationContext)
    const [statusName, setStatusName] = React.useState(stateNav.statusName ? stateNav.statusName : null);


    const handleStatusChange = value => {
      let filter;
      if(value && value.length) {
        filter = ['match', ['get', 'wellStatus'], value, true, false]
        setStateNav(stateNav => ({ ...stateNav, statusName:value}))
        setStatusName(value)
      }
      else {
        filter = null
        setStateNav(stateNav => ({ ...stateNav, statusName: null}))
      }
      setStateNav(stateNav => ({ ...stateNav, filterWellStatus: filter}))
      };
  




   
  return (
    <Autocomplete 
    defaultValue={stateNav.statusName}
    onChange={(event, newValue) => {
         handleStatusChange(newValue);
       }}
    multiple
    options={statusList}
    renderInput={params => (
      <TextField
        {...params}
        variant="outlined"
        label="Well Status"
        placeholder=""
        fullWidth={true}
      />
    )}  
    disableListWrap
    id="virtualize-well-statuses"
    // style={{ maxWidth: 300, minWidth: 120 }}
    />
  )
}