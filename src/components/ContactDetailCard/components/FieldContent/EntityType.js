import React, { useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import TextField from "@material-ui/core/TextField";
import loadashFilter from "lodash/filter";
import { Typography, Grid } from "@material-ui/core";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { useLazyQuery } from "@apollo/client";
import { entityTypeOptions } from "components/ContactDetailedInfo/helper";

const filter = createFilterOptions();

export default function EntityType({ setDocumentType, value, ...other }) {
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

  const classes = useStyles();

  const [options, setOptions] = useState([])
  const [search, setSearch] = useState(value)

  const [getEntityTypeFilters, { data: filtersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });

  useEffect(() => {
    setSearch(value)
  }, [value])

  useEffect(() => {
    getEntityTypeFilters({
      variables: {
        esIndex: 'contacts_flat',
        filterKey: 'ownerType.keyword',
        size: 50,
      },
    });
  }, [])

  useEffect(() => {
    if (filtersData?.getESFilterList?.hits) {
      let filterData = filtersData.getESFilterList.hits.filter(hit => hit.key).map(hit => hit.key)
      for (let i = 0; i < entityTypeOptions.length; i++) {
        filterData = filterData.filter(d => d !== entityTypeOptions[i].value && d !== entityTypeOptions[i].label)
      }
      for (let i = 0; i < entityTypeOptions.length; i++) {
        filterData.push(entityTypeOptions[i].label)
      }
      setOptions(filterData)
    }
  }, [filtersData])

  const onInputChange = (event, value) => {
    setSearch(value);
  };

  const getOptions = useMemo(() => options.map((type) => ({ _id: type, name: type })), [options])

  return (
    <Autocomplete
      id="entityType"
      defaultValue={search}
      value={search}
      disableListWrap
      classes={classes}
      oepn={true}
      options={getOptions}
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
        if (option._id === "newEntity") return <Typography style={{ color: "midnightblue" }}>Add '{option.name}'</Typography>;
        return (
          <Grid container spacing={0}>
            <Grid container item xs={12} alignItems="center">
              <Grid item xs>
                <span style={{ fontWeight: 400 }}>{typeof option === 'object' ? option.name : option}</span>

              </Grid>
            </Grid>
          </Grid>
        );
      }}
      onInputChange={onInputChange}
      filterOptions={(options, params) => {
        let inputValue = JSON.parse(JSON.stringify(search));
        if (inputValue.name) {
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
        if (typeof newValue === "string") {
          setDocumentType({ _id: newValue, name: newValue })
        } else if (newValue && newValue._id) {
          if (newValue._id !== "newEntity") setDocumentType(newValue);
          else setDocumentType({ _id: "newEntity", name: newValue.name });
        } else {
          setSearch("");
          setDocumentType({ _id: "", name: "" });
        }
      }}
      renderInput={(params) => (
        <TextField
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