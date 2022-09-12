import React, { useState, useEffect } from "react";

// QUERIES 
import { useLazyQuery } from "@apollo/client";
import loadashFilter from "lodash/filter";

import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { Popper, Typography } from "@material-ui/core";

const styles = (theme) => ({
    popper: {
        maxWidth: "fit-content"
    }
});

const PopperMy = function (props) {
    return <Popper {...props} style={styles.popper} placement="bottom-start" />;
};

export function AutoCompleteField({ value, onChange, index, column, query, extendSearchQuery, esIndex, filters }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    // const [value, setValue] = useState({ key: value });
    const [search, setSearch] = useState(value);
    const { label, filterKey, type } = column
    const [getFilters, { data: filtersData, loading }] = useLazyQuery(query, { fetchPolicy: "no-cache" });

    const filter = createFilterOptions();

    useEffect(() => {
        getFiltersAction("");
    }, []);

    useEffect(() => {
        if (filtersData) {
            const keys = Object.keys(filtersData)
            if (keys && filtersData[keys[0]] && filtersData[keys[0]]?.hits)
                setOptions(filtersData[keys[0]].hits.map(hit => ({
                    doc_count: hit.doc_count,
                    key: typeof hit.key === "string" ? [hit.key] : hit.key,
                    key_as_string: hit.key_as_string
                })))
        }

    }, [filtersData]);


    const handleChange = (search) => {
        setSearch(search);
        getFiltersAction(search);
    }

    const getFiltersAction = (search) => {
        if (search)
            search = type === 'number' ? search : `${search}*`
        getFilters({
            variables: {
                esIndex,
                filters,
                filterKeys: filterKey,
                // filterKey: typeof filterKey === 'string' ? filterKey : undefined,
                search,
                extendSearchQuery,
                size: 50,
            },
        });
    };
    return (
        <Autocomplete
            id={`filter-autocomplete-${label}`}
            PopperComponent={PopperMy}
            open={open}
            onOpen={() => { setOpen(true) }}
            onClose={() => { setOpen(false) }}
            value={value}
            inputValue={search}
            getOptionSelected={(option, value) => option?.key === value.key}
            getOptionLabel={(option) => typeof option.key === "string" ? option : option?.key?.join(' - ')}
            onChange={(e, value, reason) => {
                if (reason === 'clear' || !value?.key) setSearch('')
                else {
                    const key = typeof value.key === "string" ? value.key : value.key[0];
                    setSearch(key);
                    onChange(key)
                }
            }}
            fullWidth
            autoHighlight
            options={options}
            loading={loading}
            renderOption={(props, value) => {
                if (props?.id === "newEntity") return <Typography style={{ color: "midnightblue" }} >Add '{props.key}'</Typography>;
                const matches = match(props.key, value?.inputValue);
                const parts = parse(props.key, matches);

                return (
                    <li {...props}>
                        <div>
                            {parts.map((part, index) => (
                                <span
                                    key={index}
                                    style={{
                                        fontWeight: part.highlight ? 700 : 400,
                                    }}
                                >
                                    {typeof part.text === "string" ? part.text : part.text?.join(" - ")}
                                </span>
                            ))}
                        </div>
                    </li>
                );
            }}
            filterOptions={(options, params) => {
                let inputValue = params.inputValue;
                const filtered = filter(options, { ...params, inputValue });

                const isExist = loadashFilter(filtered, (f) => {
                    return typeof f.key === "string" ? f.key === inputValue : f.key.includes(inputValue);
                });
                // Suggest the creation of a new value
                if (inputValue !== "" && (!isExist || isExist.length === 0)) {
                    filtered.unshift({
                        id: "newEntity",
                        key: inputValue,
                    });
                }
                return filtered;
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    autoFocus={true}
                    label={label}
                    onChange={(e) => { handleChange(e.target.value) }}
                    onKeyDown={(e) => {
                        if (e.code === 'Tab') {
                            // e.preventDefault();
                            // e.stopPropagation();
                            const ops = options.filter((op) => op.key.startsWith(search))
                            if (ops[0] && ops[0].key) {
                                onChange(ops[0].key)
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
