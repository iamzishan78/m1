import React, { useEffect, useState } from "react";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import loadashFilter from "lodash/filter";
import { useLazyQuery } from "@apollo/client";
import { SHAPE_AUTOCOMPLETE_LIST } from "graphQL/useQueryShapeAutoCompleteList";


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

const AutoCompleteTypeComponent = ({ onChange, value, shapeType, typeKey, onBlur, ...other }) => {

    const [types, setTypes] = useState([])

    const [typeListQuery, { data: dataTypes }] = useLazyQuery(SHAPE_AUTOCOMPLETE_LIST);

    useEffect(() => {
        typeListQuery({ variables: { shapeType, key: typeKey } })
    }, [])

    useEffect(() => {
        if (dataTypes && dataTypes[Object.keys(dataTypes)[0]])
            setTypes(dataTypes[Object.keys(dataTypes)[0]])

    }, [dataTypes])

    const classes = useStyles();

    return (
        <Autocomplete
            defaultValue={{ _id: value, name: value }}
            value={{ _id: value, name: value }}
            disableListWrap
            classes={classes}
            onBlur={onBlur}
            options={types?.map((type) => {
                return { _id: type, name: type };
            }) || []}
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
            renderOption={(option) => {
                if (option._id === "newEntity") return <Typography style={{ color: "midnightblue" }}>Add '{option.name}'</Typography>;

                return (
                    <Grid container spacing={0}>
                        <Grid container item xs={12} alignItems="center">
                            <Grid item xs>
                                <span style={{ fontWeight: 400 }}>{option.name}</span>

                                {/* <Typography variant="body2" color="textSecondary">
                                    {option}
                                </Typography> */}
                            </Grid>
                        </Grid>
                    </Grid>
                );
            }}
            filterOptions={(options, params) => {
                const inputValue = params.inputValue
                const filtered = createFilterOptions()(options, { ...params, inputValue });
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
                onChange(event, newValue);
            }}
            renderInput={(params) => (
                <TextField
                    margin="dense"
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                    }}
                    fullWidth
                    autoFocus
                    size="small"
                />
            )}
        // {...other}
        />
    );
};

export default AutoCompleteTypeComponent