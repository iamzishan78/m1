import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
// QUERIES 
import { AppContext } from "AppContext";
import { useLazyQuery } from "@apollo/client";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

export function AutoCompleteFilter({ filterList, onChange, index, column, query, extendSearchQuery, esIndex, filters, custom, setFilters }) {
    const [open, setOpen] = useState(false);
    const [stateApp, setStateApp] = useContext(AppContext);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState({ key: filterList[index][0] });
    const [search, setSearch] = useState(filterList[index][0]);
    const { label, filterKey, type } = column
    const [getFilters, { data: filtersData, loading }] = useLazyQuery(query, { fetchPolicy: "no-cache" });

    useEffect(() => {
        setSearch(filterList[index][0])
        if (!filterList[index][0]) {
            setValue({})
        }
    }, [filterList[index][0]]);

    useEffect(() => {
        if(!custom?.filterOptions){
            getFiltersAction("");
        }else{
            setOptions(custom?.filterOptions)
        }
    }, []);

    useEffect(() => {
        if (filtersData) {
            const keys = Object.keys(filtersData)
            if (keys && filtersData[keys[0]] && filtersData[keys[0]]?.hits){
                if(custom?.isDate){
                    const hits = filtersData[keys[0]].hits.map(hit => ({ ...hit, key:moment(new Date(hit.key)).format("MM/DD/YYYY") }))
                    setOptions(hits)
                    setStateApp((state, props) => {
                        return { ...state, filtersData: { ...state.filtersData, [column.name]: hits } };
                      });
                }else{
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
                key_as_string: custom?.key_as_string
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
            inputValue={search}
            getOptionSelected={(option, value) => option.key === value.key}
            getOptionLabel={(option) => option?.key?.toString().replace(/^\,|\,$/gm, "")}
            onChange={(e, value, reason) => {
                if (reason === 'clear' || !value?.key) {
                    filterList[index].pop()
                    setSearch('')
                    setValue({})
                } else {
                    filterList[index][0] = typeof value.key === 'string' ? value.key.replace(/^\,|\,$/gm, "") : value.key
                    setSearch(value.key)
                    setValue(value)
                }
                if(setFilters) setFilters(filterList)
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
}
