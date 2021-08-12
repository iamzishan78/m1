import React, { useState, useEffect } from "react";

// QUERIES 
import { useLazyQuery } from "@apollo/client";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';



export function AutoCompleteFilter({ filterList, onChange, index, column, query }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState(filterList[index][0]);
    const { label, filterKey } = column
    const [getFilters, { data: filtersData, loading }] = useLazyQuery(query, { fetchPolicy: "no-cache" });

    useEffect(() => {
        getFilters({
            variables: {
                filterKey,
                search: "",
                size: 50
            },
        });
    }, []);

    useEffect(() => {
        if (filtersData) {
            const keys = Object.keys(filtersData)
            if (filtersData[keys[0]] && filtersData[keys[0]]?.hits)
                setOptions(filtersData[keys[0]].hits)
        }

    }, [filtersData]);


    const handleChange = (search) => {
        setSearch(search)
        getFilters({
            variables: {
                filterKey,
                search,
                size: 50,
            },
        });
    }

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
            inputValue={search}
            getOptionSelected={(option, value) => option.key === value.key}
            getOptionLabel={(option) => option.key}
            onChange={(e, value, reason) => {
                if (reason === 'clear' || !value?.key) {
                    filterList[index].pop()
                    setSearch('')
                } else {
                    filterList[index][0] = value.key
                    setSearch(value.key)
                }
                onChange(filterList[index], index, column);
            }}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    onChange={(e) => handleChange(e.target.value)}
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
