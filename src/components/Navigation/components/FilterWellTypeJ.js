import React, {useContext} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { NavigationContext } from '../NavigationContext';

const wellTypesList = [
  "GAS",
  "INJECTION",
  "OIL",
  "OIL AND GAS",
  "P&A",
  "UNKNOWN",
  "WATER",
];





export default function FilterWellTypeJ() {
    const [stateNav, setStateNav] = useContext(NavigationContext)
    const [typeName, setTypeName] = React.useState(stateNav.typeName ? stateNav.typeName : null);


    const handleTypeChange = value => {
      let filter;
      if(value && value.length) {
        filter = ['match', ['get', 'wellType'], value, true, false]
        setStateNav(stateNav => ({ ...stateNav, typeName:value}))
        setTypeName(value)
      }
      else {
        filter = null
        setStateNav(stateNav => ({ ...stateNav, typeName: null}))
      }
      setStateNav(stateNav => ({ ...stateNav, filterWellType: filter}))
      };
  




   
  return (
    <Autocomplete 
    defaultValue={stateNav.typeName}
    onChange={(event, newValue) => {
         handleTypeChange(newValue);
       }}
    multiple
    options={wellTypesList}
    renderInput={params => (
      <TextField
        {...params}
        variant="outlined"
        label="Well Type"
        placeholder=""
        fullWidth={true}
      />
    )}  
    disableListWrap
    id="virtualize-well-types"
    // style={{ maxWidth: 300, minWidth: 120 }}
    />
  )



}