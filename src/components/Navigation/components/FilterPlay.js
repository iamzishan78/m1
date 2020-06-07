import React, {useContext} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { NavigationContext } from '../NavigationContext';


const playList = [
  "GRANITE WASH",
  "OZONA CANYON",
  "BARNETT",
  "VICKSBURG",
  "Thirty-one Carbonate-Chert",
];



export default function PlayFilterJ() {
    const [stateNav, setStateNav] = useContext(NavigationContext)
    const [playName, setPlayName] = React.useState(
      stateNav.playName ? stateNav.playName : []
    );
    
    
    
    
    const handleChange = value => {
      let filter;
      if(value && value.length) {
       filter = ['match', ['get', 'play'], value, true, false]
       setStateNav(stateNav => ({ ...stateNav, playName:value}))
       setPlayName(value)
      }
      else {
       filter = null
       setStateNav(stateNav => ({ ...stateNav, playName: null}))
      }
       setStateNav(stateNav => ({ ...stateNav, filterPlay: filter}))
     };
    


   
  return (
    <Autocomplete 
    defaultValue={stateNav.playName}    
    onChange={(event, newValue) => {
         handleChange(newValue);
       }}
    multiple
    options={playList}
    renderInput={params => (
      <TextField
        {...params}
        variant="outlined"
        label="Play"
        placeholder=""
        fullWidth
      />
    )} 
    disableListWrap
    id="virtualize-play"   
    />
  )




}