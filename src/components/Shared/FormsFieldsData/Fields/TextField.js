
import React from "react";
import { Grid, TextField } from '@mui/material';

import { Controller } from "react-hook-form";
import { sideDialogController } from "hookstate/sideDialogController"

const classes = {
  maxWidth: {
    width: '100%',
  },
  baseValueChanged: {
    width: '100%',
    '& .MuiInputBase-input': {
      color: 'dodgerblue',
      fontWeight: 'bold',
    },
  },
};

function TextFieldComponent({ control, item }) {

  const {
    // field props
    name,
    size,
    type,
    label,
    InputProps,
    fullWidth = true,
    defaultValue = null,
    multiline = false,
    variant = "standard"
  } = item || {};

  return (
    <Grid item xs={12}>
      <h3>{label}</h3>

      <Controller
        control={control}
        name={name}
        render={props => (
          <TextField
            type={type}
            size={size}
            value={props.value}
            inputRef={props.ref}
            onWheel={e => e.target.blur()}
            onChange={e => {

              sideDialogController.updateState({ [item.name]: e.target.value })
              props.onChange(e.target.value)

            }}
            sx={true ? classes.baseValueChanged : classes.maxWidth}
            InputProps={{
              ...InputProps
            }}
            fullWidth={fullWidth}
            defaultValue={defaultValue}
            multiline={multiline}
            variant={variant}
          />
        )}
      />

    </Grid>
  );
}

export default TextFieldComponent