
import React from "react";
import { Grid } from "@material-ui/core";
import { useController } from "react-hook-form";
import Autocomplete from '@material-ui/lab/Autocomplete';

function AutoCompleteComponent({ control, name, item }) {
  const { field } = useController({
    name,
    control,
    rules: { required: true },
  });

  const {
    label,
    options,
    className
  } = item;

  return (
    <Grid item xs={12}>
      <h3>{label}</h3>
      <Autocomplete
        options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]}
        getOptionLabel={option => option.label}
        getOptionSelected={(option, value) => option.value === value}
        value={newOwner?.nonExecRightsOnly ? { label: newOwner?.nonExecRightsOnly, value: newOwner?.nonExecRightsOnly } : null}
        onChange={(e, newInputValue) => {
          setNewOwner({
            ...newOwner,
            nonExecRightsOnly: newInputValue?.value,
          })
        }}
        renderInput={params => (
          <TextField {...params} size="small" className={classes.maxWidth} multiline />
        )}
      />
    </Grid>
  );
}

export default AutoCompleteComponent