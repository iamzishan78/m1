import React, {useContext, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { NavigationContext } from '../NavigationContext';


const basinList = [
  "PERMIAN",
  "Permian",
  "FORT WORTH",
  "WESTERN GULF",
];



export default function BasinFilterJ() {
    const [stateNav, setStateNav] = useContext(NavigationContext)
    const [basinName, setBasinName] = React.useState(
      stateNav.basinName ? stateNav.basinName : []
    );
    
    
    
    
    const handleBasinChange = value => {
      let filter;
      if(value && value.length) {
       filter = ['match', ['get', 'basin'], value, true, false]
       setStateNav(stateNav => ({ ...stateNav, basinName:value}))
       setBasinName(value)
      }
      else {
       filter = null
       setStateNav(stateNav => ({ ...stateNav, basinName: null}))
      }
       setStateNav(stateNav => ({ ...stateNav, filterBasin: filter}))
     };
    



   
  return (
    <Autocomplete 
    defaultValue={stateNav.basinName}    
    onChange={(event, newValue) => {
         handleBasinChange(newValue);
       }}
    multiple
    options={basinList}
    renderInput={params => (
      <TextField
        {...params}
        variant="outlined"
        label="Basin"
        placeholder=""
        fullWidth
      />
    )} 
    disableListWrap
    id="virtualize-basins"   
    />
  )




}