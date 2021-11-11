
import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";


function AutoCompleteFieldComponent(props) {
    const { inputRef, onChange, name, options, label, value, defaultValue, variant, ref, ...other } = props;

    return (
        <Autocomplete
            options={options}
            onChange={(e, wellType) => {
                onChange(wellType)
            }}
            inputRef={ref}
            value={value}
            defaultValue={defaultValue}
            renderInput={(params) => (
                <TextField
                    margin="dense"
                    // inputRef={ref}
                    {...params}
                    variant={variant || 'outlined'}
                    label={label}
                    InputLabelProps={{ shrink: true }}
                />
            )}
        />
    );
}

export default AutoCompleteFieldComponent