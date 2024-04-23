
import React from "react";
import { Grid, TextField } from "@material-ui/core";
import { useController, Controller } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import { sideDialogController } from "hookstate/sideDialogController"

const useStyles = makeStyles(theme => ({
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
}));

function TextFieldComponent({ control, item }) {
  const classes = useStyles();

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
  } = item || {};

  // const { field } = useController({
  //   name,
  //   control,
  //   rules: { required: true },
  // });

  return (
    <Grid item xs={12}>
      <h3>{label}</h3>

      <Controller
        type={type}
        control={control}
        name={name}
        render={props => (
          <TextField
            size={size}
            value={props.value}
            inputRef={props.ref}
            onWheel={e => e.target.blur()}
            onChange={e => {

              sideDialogController.updateState({ [item.name]: e.target.value })
              props.onChange(e.target.value)

            }}
            className={true ? classes.baseValueChanged : classes.maxWidth}
            InputProps={{
              ...InputProps
            }}
            fullWidth={fullWidth}
            defaultValue={defaultValue}
            multiline={multiline}
          />
        )}
      />

    </Grid>
  );
}

export default TextFieldComponent