import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
// QUERIES 
import { AppContext } from "AppContext";
import { useLazyQuery } from "@apollo/client";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

export const AutoCompleteFilter = React.memo(function AutoCompleteFilter({ filterList, onChange, index, column, query, extendSearchQuery, searchFields, esIndex, filters, custom, setFilters }) {
    const [open, setOpen] = useState(false);
    const [stateApp, setStateApp] = useContext(AppContext);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState({ key: filterList[index][0] });
    const [search, setSearch] = useState(filterList[index][0]);
    const { label, filterKey, type } = column
    const [getFilters, { data: filtersData, loading }] = useLazyQuery(query, { fetchPolicy: "no-cache" });
    const getFiltersType = query?.definitions?.[0]?.name?.value

    useEffect(() => {
        setSearch(filterList[index][0])
        if (!filterList[index][0]) {
            setValue({})
        }
    }, [filterList[index][0]]);

    useEffect(() => {
        if (!custom?.filterOptions) {
            getFiltersAction("");
        } else {
            setOptions(custom?.filterOptions)
        }
    }, [filters]);

    useEffect(() => {
        if (filtersData) {
            const keys = Object.keys(filtersData)
            if (keys && filtersData[keys[0]] && filtersData[keys[0]]?.hits) {
                if (custom?.isDate) {
                    const hits = filtersData[keys[0]].hits.map(hit => ({ ...hit, key: moment(new Date(hit.key)).format("MM/DD/YYYY") }))
                    setOptions(hits)
                    setStateApp((state, props) => {
                        return { ...state, filtersData: { ...state.filtersData, [column.name]: hits } };
                    });
                } else if (custom?.formatedFilterOptions) {
                    const hits = filtersData[keys[0]].hits
                    for (let i = 0; i < custom.formatedFilterOptions.length; i++) {
                        const index = hits.findIndex(h => h.key === custom.formatedFilterOptions[i].value || h.key_as_string === custom.formatedFilterOptions[i].value)
                        if (index > -1) {
                            hits[index].key = custom.formatedFilterOptions[i].label
                        }
                    }
                    setOptions(hits)
                } else {
                    setOptions(filtersData[keys[0]].hits)
                }
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
                search,
                ...(getFiltersType === "getESSimpleFilter") && { search: { query: extendSearchQuery, fields: searchFields } },
                extendSearchQuery,
                size: 50,
                key_as_string: custom?.key_as_string,
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
            id={`filter-autocomplete-${custom?.filterLabel || label}`}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            value={value}
            inputValue={search?.toString()}
            getOptionSelected={(option, value) => option.key === value.key}
            getOptionLabel={(option) => option?.key?.toString().replace(/^\,|\,$/gm, "")}
            onChange={(e, value2, reason) => {
                if (reason === 'clear' || !value2?.key) {
                    filterList[index].pop()
                    setSearch('')
                    setValue({})
                } else {
                    filterList[index][0] = typeof value2.key === 'string' ? value2.key.replace(/^\,|\,$/gm, "") : value2.key
                    setSearch(value2.key)
                    setValue(value2)
                }
                if (setFilters) setFilters(filterList)
                onChange(filterList[index], index, column);
            }}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={custom?.filterLabel || label}
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
