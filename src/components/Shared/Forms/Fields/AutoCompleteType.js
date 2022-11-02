import React, { useEffect, useState } from "react";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import loadashFilter from "lodash/filter";
import { useLazyQuery } from "@apollo/client";
import { SHAPE_AUTOCOMPLETE_LIST } from "graphQL/useQueryShapeAutoCompleteList";

const useStyles = makeStyles({
  inputRoot: {
    // backgroundColor: "#ffffff",
  },
  listbox: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

const AutoCompleteTypeComponent = ({ onChange, value, shapeType, path, meta, label, typeKey, onBlur, createable, ...other }) => {
  const [types, setTypes] = useState([]);

  const [typeListQuery, { data: dataTypes }] = useLazyQuery(SHAPE_AUTOCOMPLETE_LIST);

  useEffect(() => {
    typeListQuery({ variables: { shapeType, key: typeKey, meta } });
  }, []);

  useEffect(() => {
    if (dataTypes && dataTypes[Object.keys(dataTypes)[0]]) {
      setTypes(types => {
        let options = dataTypes[Object.keys(dataTypes)[0]]
        if (other?.manualOptions) {
          options = options.concat(other?.manualOptions)
          options = Array.from(new Set(options));
        }

        return options
      })
    }
  }, [dataTypes]);

  const classes = useStyles();
  return (
    <Autocomplete
      defaultValue={{ _id: value, name: value }}
      value={{ _id: value, name: value }}
      disableListWrap
      classes={classes}
      onBlur={onBlur}
      options={
        types?.map((type) => {
          return { _id: type, name: type };
        }) || []
      }
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.name;
        }

        if (option?.name) return option.name;
        else return "";
      }}
      getOptionSelected={(option, value) => {
        return option?._id === value?._id;
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
      filterOptions={(options, params) => {
        const inputValue = params.inputValue;
        const filtered = createFilterOptions()(options, { ...params, inputValue });
        const isExist = loadashFilter(filtered, (filter) => {
          return filter._id === inputValue;
        });
        // Suggest the creation of a new value
        if (inputValue !== "" && (!isExist || isExist.length === 0) && createable) {
          filtered.unshift({
            name: inputValue,
            _id: "newEntity",
          });
        }
        return filtered;
      }}
      onChange={(event, newValue) => {
        onChange(event, newValue);
      }}
      renderInput={(params) => (
        <TextField
          variant={other.variant ?? "standard"}
          margin="dense"
          label={label}
          {...params}
          InputProps={{
            ...params.InputProps,
          }}
          fullWidth
          autoFocus={other.autoFocus}
          size="small"
        />
      )}
      id={other.id}
    //   {...other}
    />
  );
};

AutoCompleteTypeComponent.defaultProps = {
  autoFocus: true,
  createable: true
};

export default AutoCompleteTypeComponent;
