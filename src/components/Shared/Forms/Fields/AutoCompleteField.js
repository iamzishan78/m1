
import React from "react";
import Autocomplete,{createFilterOptions} from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const filter = createFilterOptions();
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
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option !=='') {
                return option;
              }
              // Regular option
              return option;
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              // Suggest the creation of a new value
              if (params.inputValue !== '') {
                filtered.push(`${params.inputValue}`);
              }

              return filtered;
            }}
            renderOption={(option) => {
              return (
                  <Typography style={{ color: "midnightblue" }}>
                    Add '{option}'
                  </Typography>
              );
            }}
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
