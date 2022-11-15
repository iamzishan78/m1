import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { US_STATES } from "utils/data";
import { uniqBy } from "lodash";

export const AutoCompleteLandgrid = React.memo(function AutoCompleteLandgrid({ onChange, filterKey, type, extendSearchQuery, esIndex = 'platformData:landgrid', filters, label, value, variant, compoundValue }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState(value);
  // const { filterKey, type } = column
  const [getFilters, { data: filtersData, loading }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: "no-cache" });

  useEffect(() => {
    setSearch(value)
  }, [value]);

  useEffect(() => {
    getFiltersAction("")
  }, [filters, compoundValue]);

  useEffect(() => {
    if (filtersData) {
      const keys = Object.keys(filtersData)
      if (keys && filtersData[keys[0]] && filtersData[keys[0]]?.hits) {
        let hits = filtersData[keys[0]].hits
        if (label === 'State') {
          hits = hits.map((hit) => ({ ...hit, key: US_STATES[hit.key] || null })).filter((hit) => hit.key)
        }
        // hits = hits.map((hit) => ({ ...hit, key: hit.key, label: hit.key.toUpperCase() }))

        if (label === 'Township')
          hits = uniqBy(hits.map((hit) => ({ ...hit, key: hit.key.split(" ")[0] })), 'key')
        if (label === 'Range') {
          if (compoundValue)
            hits = hits.filter((hit) => hit.key.includes(compoundValue))
          hits = uniqBy(hits.map((hit) => ({ ...hit, key: hit.key.split(" ")[1] })), 'key')
        }

        setOptions(hits)
      }
    }
  }, [filtersData, compoundValue]);


  const handleChange = (search) => {
    setSearch(search);
    if (label !== 'State')
      getFiltersAction(search);
  }

  const getFiltersAction = (search) => {
    const rawSearch = search
    if (search)
      search = type === 'number' ? search : `${search}*`
    getFilters({
      variables: {
        esIndex,
        index: esIndex,
        filters,
        filterKeys: typeof filterKey !== 'string' ? filterKey : undefined,
        filterKey: typeof filterKey === 'string' ? filterKey : undefined,
        search: { query: rawSearch, fields: ["*"] },
        extendSearchQuery,
        size: label === 'County' ?  1000 : 70,
        filterAggs: {
          // query: rawSearch,
          field: typeof filterKey === 'string' ? filterKey : undefined,
          fields: typeof filterKey !== 'string' ? filterKey : undefined,
          size: label === 'County' ?  1000 : 70,
        }
      },
    });
  };

  return (
    <Autocomplete
      id={`filter-autocomplete-${label}`}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={{ key: value, _id: value }}
      inputValue={search?.toString()}
      getOptionSelected={(option, value) => option.key === value.key}
      getOptionLabel={(option) => option?.key?.toString().replace(/^\,|\,$/gm, "")}
      onChange={(e, value, reason) => {
        if (reason === 'clear' || !value?.key) {
          setSearch('')
          onChange({})
        } else {
          setSearch(value.key)
          onChange(value)
        }
      }}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          margin="dense"
          variant={variant}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
})
