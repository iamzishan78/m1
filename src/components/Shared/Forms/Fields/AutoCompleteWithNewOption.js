import React from "react";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import loadashFilter from "lodash/filter";


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

const AutoCompleteWithNewOption = ({ options, onChange, value, shapeType, typeKey, onBlur, disabled = false, ...rest }) => {
    const classes = useStyles();

    return (
        <Autocomplete
            defaultValue={{ _id: value, name: value }}
            value={value ? { _id: value, name: value } : null}
            disabled={disabled}
            disableListWrap
            id={rest?.id || "autocompleteWithNewOptions"}
            classes={classes}
            onBlur={onBlur}
            options={options?.map((type) => {
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
            // onInputChange={onInputChange}
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
                // if (newValue && newValue._id) {
                //     if (newValue._id !== "newEntity") setType(newValue);
                //     else setType({ _id: "newEntity", name: newValue.name });
                // } else setType("");
            }}
            renderInput={(params) => (
                <TextField
                    variant={rest.variant}
                    margin={rest.margin}
                    label={rest.label}
                    {...params}
                    InputLabelProps={{
                        ...params.InputLabelProps,
                        ...rest.InputLabelProps,
                    }}
                    InputProps={{
                        ...params.InputProps,
                        ...rest.InputProps,
                    }}
                    fullWidth
                />
            )}
        // {...other}
        />
    );
};

export default AutoCompleteWithNewOption