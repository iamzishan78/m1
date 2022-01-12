import React, { useState, useEffect } from "react";

// QUERIES 
import { useLazyQuery } from "@apollo/client";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

export function AutoCompleteField({ value, onChange, index, column, query, extendSearchQuery, esIndex, filters }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    // const [value, setValue] = useState({ key: value });
    const [search, setSearch] = useState(value);
    const { label, filterKey, type } = column
    const [getFilters, { data: filtersData, loading }] = useLazyQuery(query, { fetchPolicy: "no-cache" });

    // useEffect(() => {
    //     setSearch(filterList[index][0])
    //     if (!filterList[index][0]) {
    //         setValue(null)
    //     }
    // }, [filterList[index][0]]);

    useEffect(() => {
        getFiltersAction("");
    }, []);

    useEffect(() => {
        if (filtersData) {
            const keys = Object.keys(filtersData)
            if (keys && filtersData[keys[0]] && filtersData[keys[0]]?.hits)
                setOptions(filtersData[keys[0]].hits)
        }

    }, [filtersData]);


    const handleChange = (search) => {
        setSearch(search);
        // getFiltersAction(search);
    }

    const getFiltersAction = (search) => {
        if (search)
            search = type === 'number' ? search : `${search}*`
        getFilters({
            variables: {
                esIndex,
                filters,
                filterKeys: typeof filterKey !== 'string' ? filterKey : undefined,
                filterKey: typeof filterKey === 'string' ? filterKey : undefined,
                search,
                extendSearchQuery,
                size: 50,
            },
        });
    };
    return (
        <Autocomplete
            id={`filter-autocomplete-${label}`}
            open={open}
            onOpen={() => { setOpen(true) }}
            onClose={() => { setOpen(false) }}
            value={value}
            inputValue={search}
            getOptionSelected={(option, value) => option?.key === value.key}
            getOptionLabel={(option) => option?.key?.toString().replace(/^\,|\,$/gm, "")}
            onChange={(e, value, reason) => {
                if (reason === 'clear' || !value?.key) setSearch('')
                else {
                    setSearch(value.key)
                    onChange(value.key)
                }
            }}
            fullWidth
            autoHighlight
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    onChange={(e) => { handleChange(e.target.value) }}
                    onKeyDown={(e) => {
                        if (e.code === 'Tab') {
                            // e.preventDefault();
                            // e.stopPropagation();
                            if (options[0] && options[0].key) {
                                onChange(options[0].key)
                            }
                        }
                    }}
                    fullWidth
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
}
