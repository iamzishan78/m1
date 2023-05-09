import React, { useState, useEffect } from "react";

import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, TextField } from "@material-ui/core";
import loadashFilter from "lodash/filter";
import { useLazyQuery } from "@apollo/client";



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

const filter = createFilterOptions();
const AutoCompleteWithAddNew = ({ setValue, value, fieldKey, defaultOptions = [], ...other }) => {
  const classes = useStyles();
  const [search, setSearch] = useState(value);
  const [options, setOptions] = useState([]);
  const onInputChange = (event, value) => {
    setSearch(value);
  };

  const [getContactFieldOptions, { data: contactFieldOptions }] =
    useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });

  useEffect(() => {
    getContactFieldOptions({
      variables: {
        esIndex: "contacts_flat",
        filterKey: fieldKey + ".keyword",
        size: 50,
      },
    });
  }, []);

  useEffect(() => {
    setSearch(value);
  }, [value])

  useEffect(() => {
    if (contactFieldOptions?.getESFilterList?.hits) {
      let filterData = contactFieldOptions.getESFilterList.hits.map(
        (hit) => hit.key
      );
      for (let i = 0; i < defaultOptions.length; i++) {
        filterData = filterData.filter(
          (d) =>
            d !== defaultOptions[i].value &&
            d !== defaultOptions[i].label
        );
      }
      for (let i = 0; i < defaultOptions.length; i++) {
        filterData.push(defaultOptions[i].label);
      }

      filterData = filterData.filter(item => item.trim())
      setOptions(filterData);
    }
  }, [contactFieldOptions]);

  return (
    <Autocomplete
      defaultValue={search}
      value={search}
      disableListWrap
      classes={classes}
      options={
        options?.map((type) => {
          return { _id: type, name: type };
        }) ?? []
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
        return option?._id === search;
      }}
      renderOption={(option) => {
        if (option._id === "newEntity")
          return (
            <Typography style={{ color: "midnightblue" }}>
              Add '{option.name}'
            </Typography>
          );

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
        let inputValue = JSON.parse(JSON.stringify(search));
        if (inputValue?.name) {
          inputValue = inputValue.name;
        }
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
        } else {
          setSearch("");
          setValue({ _id: "", name: "" });
        }
      }}
      renderInput={(params) => (
        <TextField
          variant={other.variant}
          margin="dense"
          {...params}
          InputProps={{
            ...params.InputProps,
          }}
          size="small"
        />
      )}
      {...other}
    />
  );
};

export default AutoCompleteWithAddNew;
