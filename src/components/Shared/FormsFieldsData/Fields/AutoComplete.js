
import React from "react";
import { Grid, TextField, Autocomplete } from '@mui/material';
import { Controller } from "react-hook-form";
import { sideDialogController } from "hookstate/sideDialogController";

function AutoCompleteComponent({ control, item }) {
  const {
    name,
    label,
    options,
  } = item;

  return (
    <Grid item xs={12}>
      <h3>{label}</h3>

      <Controller
        control={control}
        name={name}
        render={props => (
          <Autocomplete
            options={options}
            getOptionLabel={option => option.label}
            getOptionSelected={(option, value) => option.value === value}
            value={props.value}
            onChange={e => {
              sideDialogController.updateState({ [item.name]: e.target.value })
              props.onChange(e)

            }}
            renderInput={params => (
              <TextField {...params} size="small" multiline variant="standard" />
            )}
          />
        )}
      />
    </Grid>
  );
}

export default AutoCompleteComponent