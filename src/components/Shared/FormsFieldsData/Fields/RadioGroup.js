
import React from "react";
import { Grid, Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
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

      {!!(formStateValues?.depthBoth === 'false') &&
        <>
          <Grid item xs={12}>
            <h3>Depth From</h3>
            <Controller
              control={control}
              name={"depthFrom"}
              render={props => (
                <TextField
                  size="small"
                  multiline
                  value={props.value}
                  fullWidth
                  variant="standard"
                  onChange={e => {
                    props.onChange(e.target.value);
                    sideDialogController.updateState({ "depthFrom": e.target.value })
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <h3>Depth To</h3>
            <Controller
              control={control}
              name={"depthTo"}
              render={props => (
                <TextField
                  size="small"
                  multiline
                  value={props.value}
                  fullWidth
                  variant="standard"
                  onChange={e => {
                    props.onChange(e.target.value);
                    sideDialogController.updateState({ "depthTo": e.target.value })
                  }}
                />
              )}
            />
          </Grid>
        </>
      }
    </Grid>
  );
}

export default RadioComponent