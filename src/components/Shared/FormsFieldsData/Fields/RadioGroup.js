
import React from "react";
import { Grid, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { Controller } from "react-hook-form";
import { sideDialogController } from "hookstate/sideDialogController";

function RadioComponent({ control, item }) {
  const {
    name,
    label,
    options = [],
  } = item;
  const formState = sideDialogController.useState(['depthBoth'])
  const formStateValues = formState.stateValues

  console.log('formStateValues', formStateValues?.depthBoth)
  return (
    <Grid item xs={12}>
      <h3>{label}</h3>

      <Controller
        control={control}
        name={name}
        render={props => (
          <RadioGroup
            row
            value={props.value}
            onChange={event => {
              props.onChange(event.target.value);
              sideDialogController.updateState({ [item.name]: event.target.value })
            }}
          >
            {options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        )}
      />
    </Grid>
  );
}

export default RadioComponent