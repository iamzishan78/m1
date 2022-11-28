import React from "react";

import loadashFilter from "lodash/filter";

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";

const filter = createFilterOptions();

const useStyles = makeStyles({
  inputRoot: {
    backgroundColor: "#ffffff",
  },
  listbox: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

const AutoCompleteWithAddNew = ({ onSearch, setValue, value, options, variant, type }) => {
  const classes = useStyles();

  const onInputChange = (event, value) => {
    const _value = event?.target?.value ?? value;
    if (onSearch) onSearch(_value);
  };

  return (
    <Autocomplete
      defaultValue={value}
      value={value}
      disableListWrap
      classes={classes}
      options={options}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        if (option?.name) return option.name;
        else return "";
      }}
      getOptionSelected={(option, value) => {
        return option?.name === value;
      }}
      renderOption={(option) => {
        if (option._id === "newEntity") return <Typography style={{ color: "midnightblue" }}>Add '{option.name}'</Typography>;

        return (
          <Grid container spacing={0}>
            <Grid container item xs={12} alignItems="center">
              <Grid item xs>
                <span style={{ fontWeight: 400 }}>{option.name}</span>
              </Grid>
            </Grid>
          </Grid>
        );
      }}
      onInputChange={onInputChange}
      filterOptions={(options, params) => {
        const { inputValue } = params;
        // let inputValue = value ? JSON.parse(JSON.stringify(value)) : "";
        // if (typeof inputValue.name === "string") {
        //   inputValue = inputValue.name;
        // }
        const filtered = filter(options, { ...params, inputValue });
        const isExist = loadashFilter(filtered, (filter) => {
          return filter._id === inputValue;
        });
        // Suggest the creation of a new value
        if (inputValue !== "" && (!isExist || isExist.length === 0)) {
          filtered.unshift({
            name: inputValue,
            _id: "newEntity",
          });
        }
        return filtered;
      }}
      onChange={(event, newValue) => {
        if (newValue && newValue._id) {
          if (newValue._id !== "newEntity") setValue(newValue);
          else setValue({ _id: "newEntity", name: newValue.name });
        } else setValue("");
      }}
      renderInput={(params) => (
        <TextField
          margin="dense"
          variant={variant ? variant : "standard"}
          {...params}
          InputProps={{
            ...params.InputProps,
          }}
          size="small"
        />
      )}
    />
  );
};

export default AutoCompleteWithAddNew;
