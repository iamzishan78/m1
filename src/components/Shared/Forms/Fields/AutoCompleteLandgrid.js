import React, { useState, useEffect, useMemo } from "react";
import { useLazyQuery } from "@apollo/client";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";

export const AutoCompleteLandgrid = React.memo(function AutoCompleteLandgrid({ onChange, filterKey, type, extendSearchQuery, esIndex = 'platformData:landgrid', filters, label, value, variant }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState(value);
  // const { filterKey, type } = column
  const [getFilters, { data: filtersData, loading }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: "no-cache" });
  const getFiltersType = GET_ES_SIMPLE_FILTER?.definitions?.[0]?.name?.value
  console.log(getFiltersType)

  useEffect(() => {
    getFiltersAction("")
  }, [filters]);

  useEffect(() => {
    if (filtersData) {
      const keys = Object.keys(filtersData)
      if (keys && filtersData[keys[0]] && filtersData[keys[0]]?.hits) {
        let hits = filtersData[keys[0]].hits
        if (label === 'Township')
          hits = hits.map((hit) => ({ ...hit, key: hit.key.split(" ")[0] }))
        if (label === 'Range')
          hits = hits.map((hit) => ({ ...hit, key: hit.key.split(" ")[1] }))
        setOptions(hits)
      }
    }
  }, [filtersData]);


  const handleChange = (search) => {
    setSearch(search);
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
        search: { query: "", fields: ["*"] },
        extendSearchQuery,
        size: 50,
        filterAggs: {
          query: rawSearch,
          field: typeof filterKey === 'string' ? filterKey : undefined,
          fields: typeof filterKey !== 'string' ? filterKey : undefined,
          size: 50
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
