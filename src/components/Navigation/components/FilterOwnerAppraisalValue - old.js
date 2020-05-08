import React, {useContext, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { NavigationContext } from '../NavigationContext';



const statusList = ["$0 - $2,500", "$2,500 - $10,000", "etc"];





export default function FilterOwnerAppraisalValue() {
    const [stateNav, setStateNav] = useContext(NavigationContext)
    const [statusName, setStatusName] = React.useState(stateNav.statusName ? stateNav.statusName : null);


    const handleStatusChange = value => {
      let filter;
      if(value && value.length) {
        filter = ['match', ['get', 'bbbb'], value, true, false]
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
    //defaultValue={stateNav.statusName}
    onChange={(event, newValue) => {
         handleStatusChange(newValue);
       }}
    multiple
    options={statusList}
    renderInput={params => (
      <TextField
        {...params}
        variant="outlined"
        label="Individual Owner Appraisal Value Range"
        placeholder=""
        fullWidth={true}
      />
    )}  
    disableListWrap
    />
  )
}