import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
import { statesAbbNames, statesNames } from "./Utils/USAStates&Abb";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 249,
    color: "black",
  },
  autoC: { "& input": { color: "#17AADD" } },
}));

export default function FilterStateName() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const nullDesc = {
    GrId1: null,
    GrId2: null,
    GrId3: null,
    GrId4: null,
    GrId5: null,
    filterGeography: null,
  };

  const handleStateNameChange = (event, newValue) => {
    if (newValue == null) {
      setStateNav((stateNav) => ({
        ...stateNav,
        stateName: null,
        displayStateName: null,
        countyName: null,
        ...nullDesc,
      }));
    } else {
      const AbbName = statesAbbNames[statesNames.indexOf(newValue)];

      setStateNav((stateNav) => ({
        ...stateNav,
        stateName: AbbName,
        displayStateName: newValue,
        countyName: false,
        ...nullDesc,
      }));
    }
  };

  const onEnterKey = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <Autocomplete
        className={classes.autoC}
        options={statesNames}
        getOptionLabel={(option) => option}
        autoSelect
        disableListWrap
        includeInputInList
        value={stateNav.displayStateName}
        onChange={(event, newValue) => {
          handleStateNameChange(event, newValue);
        }}
        onKeyDown={(event) => onEnterKey(event)}
        renderInput={(params) => (
          <form autoComplete="off">
            <TextField {...params} fullWidth label="State" variant="outlined" />
          </form>
        )}
        renderOption={(option) => <Typography>{option}</Typography>}
      />
    </FormControl>
  );
}
