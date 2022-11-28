import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { statesNames, statesAbbNames } from "components/Navigation/components/Utils/USAStates&Abb";

const useStyles = makeStyles((theme) => ({
  formControl: {
    color: "black",
    width: "100%",
  },
}));

export default function FilterStateName({ value, onStateChange, label, variant, shrink = false }) {
  const classes = useStyles();

  const handleStateNameChange = (event, newValue) => {
    onStateChange({
      name: newValue,
      acronym: statesAbbNames[statesNames.indexOf(newValue)],
    });
  };

  const onEnterKey = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  return (
    <FormControl className={classes.formControl}>
      <Autocomplete
        id="field-state"
        className={classes.autoC}
        options={statesNames}
        size={shrink ? 'small' : 'medium'}
        value={value ? statesNames[statesAbbNames.indexOf(value)] : ''}
        getOptionLabel={(option) => option}
        disableListWrap
        includeInputInList
        onChange={(event, newValue) => {
          handleStateNameChange(event, newValue);
        }}
        onKeyDown={(event) => onEnterKey(event)}
        renderInput={(params) => <TextField {...params} label={label} variant={variant ? variant : 'outlined'} fullWidth />}
      />
    </FormControl>
  );
}
