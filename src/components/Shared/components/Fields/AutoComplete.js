import React from 'react';
import loadashFilter from 'lodash/filter';
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { Typography, Grid, TextField } from '@material-ui/core';

export default function AutoCompleteComponent(props) {
    const { classes, onChange, defaultValue, value, options, ...rest } = props;
    const filter = createFilterOptions();

    return (
        <Autocomplete
            defaultValue={defaultValue}
            value={value}
            disableListWrap
            classes={classes}
            options={options}
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
                if (option.id === "newEntity") return <Typography style={{ color: "midnightblue" }}>Add '{option.value}'</Typography>;

                return (
                    <Grid container spacing={0}>
                        <Grid container item xs={12} alignItems="center">
                            <Grid item xs>
                                <span style={{ fontWeight: 400 }}>{option.name}</span>

                                <Typography variant="body2" color="textSecondary">
                                    {option}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                );
            }}
            // onInputChange={onInputChange}
            filterOptions={(options, params) => {
                let inputValue = params.inputValue;
                const filtered = filter(options, { ...params, inputValue });

                const isExist = loadashFilter(filtered, (filter) => {
                    return filter.includes(inputValue);
                });
                // Suggest the creation of a new value
                if (inputValue !== "" && (!isExist || isExist.length === 0) && rest.canAdd === undefined) {
                    filtered.unshift({
                        id: 'newEntity',
                        value: inputValue
                    });
                }
                return filtered;
            }}
            onChange={(event, newValue) => {
                if (onChange) onChange(newValue)
            }}
            renderInput={(params) => (
                <TextField
                    margin="dense"
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                    }}
                    size="small"
                    label={rest.label}
                />
            )}
            label="Hello"
            {...rest}
        />
    )
}