import React, { useEffect, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useLazyQuery } from "@apollo/client";
import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
import { capitalize } from "lodash";


const useStyles = makeStyles({
    inputRoot: {
        // backgroundColor: "#ffffff",
    },
    listbox: {
        boxSizing: "border-box",
        "& ul": {
            padding: 0,
            margin: 0,
        },
    },
});

const AutoCompleteESShapeLayer = ({ label, value, filters, setSelectedShapeLayer }) => {

    const [search, setSearch] = useState('')

    const [getESSimpleSearch, { data: elasticData }] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
        fetchPolicy: "no-cache", onCompleted: () => {
            // setLoading(false);
        }
    });

    useEffect(() => {
        getESSimpleSearch({
            variables: {
                index: 'shapes_flat',
                pagination: {
                    first: 50,
                    after: null
                },
                search: {
                    query: search ? `*${search}*` : '',
                    fields: ['*'],
                },
                filters
            }
        });
    }, [getESSimpleSearch, search])

    const onInputChange = (e) => {
        if (e?.target?.value) {
            setSearch(e.target.value)
        }
    }

    const onChange = (value) => {
        setSelectedShapeLayer(value ? value : { clear: true });

    }
    const classes = useStyles();

    const layerList = elasticData?.getESSimpleSearch?.hits || []

    return (
        <Autocomplete
            // defaultValue={{ _id: value, name: value }}
            value={value}
            disableListWrap
            classes={classes}
            options={layerList || []}
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
                return option?._id === value?._id;
            }}
            filterOptions={(options) => {
                return options
            }}
            renderOption={(option) => {

                return (
                    <Grid container spacing={0}>
                        <Grid container item xs={12} alignItems="center">
                            <Grid item xs>
                                <span style={{ fontWeight: 400 }}>{option.shapeLabel}</span>

                                <Typography variant="body2" color="textSecondary">
                                    {capitalize(option.layer)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                );
            }}
            onInputChange={onInputChange}
            onChange={(event, newValue) => {
                onChange(newValue);
            }}
            renderInput={(params) => (
                <TextField
                    margin="dense"
                    variant="outlined"
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )

                    }}
                    label={label}
                    fullWidth
                    autoFocus
                    size="small"
                />
            )}
        // {...other}
        />
    );
};

export default AutoCompleteESShapeLayer