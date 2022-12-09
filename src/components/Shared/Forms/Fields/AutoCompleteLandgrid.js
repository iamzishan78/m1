import React, { useState, useEffect, useMemo } from "react";
import { useLazyQuery } from "@apollo/client";

import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { US_STATES } from "utils/data";
import { uniqBy } from "lodash";
import { GET_AUTOCOMPLETE_LIST } from "graphQL/useQueryGetAutoCompleteList";
import { Grid, Typography } from "@material-ui/core";
import loadashFilter from "lodash/filter";

const newOptionsParams = {
  renderOption: (option) => {
    if (option._id === 'newEntity') return <Typography style={{ color: 'midnightblue' }}>Add '{option.key}'</Typography>

    return (
      <Grid container spacing={0}>
        <Grid container item xs={12} alignItems="center">
          <Grid item xs>
            <span style={{ fontWeight: 400 }}>{option.key}</span>

            {/* <Typography variant="body2" color="textSecondary">
                      {option}
                  </Typography> */}
          </Grid>
        </Grid>
      </Grid>
    )
  },
  filterOptions: (options, params) => {
    const inputValue = params.inputValue
    const filtered = createFilterOptions()(options, { ...params, inputValue })
    const isExist = loadashFilter(filtered, (filter) => {
      return filter?.key?.toLowerCase() === inputValue?.toLowerCase()
    })
    // Suggest the creation of a new value
    if (inputValue !== '' && (!isExist || isExist.length === 0)) {
      filtered.unshift({
        key: inputValue,
        _id: 'newEntity'
      })
    }
    return filtered
  }
}

export const AutoCompleteLandgrid = React.memo(function AutoCompleteLandgrid({ onChange, filterKey, type, extendSearchQuery, esIndex = 'platformData:landgrid', filters, label, value, variant, compoundValue, newOptions, newOptionFilters }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState(value);
  // const { filterKey, type } = column
  const [getFilters, { data: filtersData, loading }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: "no-cache" });

  const [getautoCompleteList, { data: dataAutoCompleteList = [] }] = useLazyQuery(GET_AUTOCOMPLETE_LIST);

  const condition = useMemo(() => Object.entries(newOptionFilters || {}).reduce((acc, [key, val]) => ({ ...acc, [`tract.${key}`]: val }), {}), [newOptionFilters])
  useEffect(() => {
    if (!newOptions) return

    getautoCompleteList({ variables: { type: "AgreementShapeOwner", data: { key: label.toLowerCase(), inTract: true, condition } } });
  }, [label, condition]);

  const autoCompleteList = React.useMemo(
    () => dataAutoCompleteList?.autoCompleteList || [],
    [dataAutoCompleteList?.autoCompleteList]
  );

  useEffect(() => {
    setSearch(value)
  }, [value]);

  useEffect(() => {
    getFiltersAction("")
  }, [filters, compoundValue]);

  useEffect(() => {
    if (!filtersData) return

    const keys = Object.keys(filtersData)
    if (!keys || !filtersData[keys[0]] || !filtersData[keys[0]]?.hits) return

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

    if (!autoCompleteList) return setOptions(hits)

    const uniqueVals = [...new Set([...hits.map((hit) => hit.key?.toLowerCase()), ...autoCompleteList.map((val) => val?.toLowerCase())])]

    const hitsObj = hits.reduce((acc, val) => ({ ...acc, ...(val?.key ? { [val.key.toLowerCase()]: val } : {}) }), {})
    const autoCompleteListObj = autoCompleteList.reduce((acc, val) => ({ ...acc, ...(val ? { [val.toLowerCase()]: { key: val } } : {}) }), {})

    const combinedHits = uniqueVals.map((val) => hitsObj[val] || autoCompleteListObj[val]).filter(val => val)

    setOptions(combinedHits)
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
        search: { query: rawSearch, fields: [filterKey.replace('.keyword', '')] },
        extendSearchQuery,
        size: label === 'County' ? 1000 : 70,
        filterAggs: {
          // query: rawSearch,
          field: typeof filterKey === 'string' ? filterKey : undefined,
          fields: typeof filterKey !== 'string' ? filterKey : undefined,
          size: label === 'County' ? 1000 : 70,
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
      // value={{ key: value, _id: value }}
      inputValue={search?.toString()}
      getOptionSelected={(option, value) => option.key === value.key}
      getOptionLabel={(option) => option?.key?.toString().replace(/^\,|\,$/gm, "")}
      onChange={(e, value, reason) => {
        if (reason === 'clear' || !value?.key) {
          setSearch('')
          onChange(e, {})
        } else {
          setSearch(value.key)
          onChange(e, value)
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
      {...(newOptions ? newOptionsParams : {})}
    />
  );
})
