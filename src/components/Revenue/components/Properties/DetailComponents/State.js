import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
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

export default function FilterStateName({ onStateChange }) {
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
        variant="inlined"
        className={classes.autoC}
        options={statesNames}
        getOptionLabel={(option) => option}
        autoSelect
        disableListWrap
        includeInputInList
        onChange={(event, newValue) => {
          handleStateNameChange(event, newValue);
        }}
        onKeyDown={(event) => onEnterKey(event)}
        renderInput={(params) => (
          <form autoComplete="off">
            <TextField {...params} fullWidth label="State" />
          </form>
        )}
        renderOption={(option) => <Typography>{option}</Typography>}
      />
    </FormControl>
  );
}
