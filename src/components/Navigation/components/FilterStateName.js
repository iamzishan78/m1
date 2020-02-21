import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
import stateNamesAb from "./Utils/USAStates";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: "15px",
    minWidth: 249,
    maxWidth: 250,
    color: "black"
  },
}));

export default function FilterStateName() {

  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const [stateName, setStateName] = useState(
    stateNav.stateName ? stateNav.stateName : []
  );
  const [displayName, setDisplayName] = useState(
    stateNav.displayStateName ? stateNav.displayStateName : []
  );
  
  useEffect(()=> {
    if(stateName !== null && stateName.length > 0 ){
      setStateNav(stateNav => ({ ...stateNav, stateName: stateName, displayStateName: displayName}));
    } 
  },[displayName, setStateNav, stateName]) 
  
  const handleStateNameChange = (event, e) => {
    console.log(event, e)
    event.preventDefault();
    if(event.keyCode === 13){
      event.preventDefault();
      setStateName(e[0])
      setDisplayName(e[1])
      setStateNav(stateNav => ({ ...stateNav, stateName: e[0], displayStateName: e[0]}));
    }
    setStateName(e[0])
    setDisplayName(e[1])
    setStateNav(stateNav => ({ ...stateNav, stateName: e[0], displayStateName: e[0]}));
  }

 
  return (
      <FormControl variant="outlined" className={classes.formControl}>
        <Autocomplete
              className={classes.maxWidth}
              options={stateNamesAb}
              getOptionLabel={option => option}
              autoSelect
              disableClearable
              disableListWrap
              includeInputInList
              value={displayName}
              onChange={(event, newValue) => {
                handleStateNameChange( event,newValue);
              }}
              renderInput={params =>(
                  <form autoComplete="off">
                  <TextField {...params} fullWidth label="State" variant="outlined"/>
                  </form>
                )
              }
              renderOption={option => <Typography>{option[1]}</Typography>}
            />
      </FormControl>
  );
}
