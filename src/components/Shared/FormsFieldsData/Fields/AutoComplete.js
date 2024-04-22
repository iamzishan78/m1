
import React from "react";
import { Grid, TextField } from "@material-ui/core";
import { useController } from "react-hook-form";
import Autocomplete from '@material-ui/lab/Autocomplete';

function AutoCompleteComponent({ control, item }) {
  const {
    name,
    label,
    options,
  } = item;

  const { field } = useController({
    name,
    control,
    rules: { required: true },
  });

  return (
    <Grid item xs={12}>
      <h3>{label}</h3>
      <Autocomplete
        options={options}
        getOptionLabel={option => option.label}
        getOptionSelected={(option, value) => option.value === value}
        value={field.value}
        onChange={field.onChange}
        renderInput={params => (
          <TextField {...params} size="small" multiline />
        )}
      />
    </Grid>
  );
}

export default AutoCompleteComponent