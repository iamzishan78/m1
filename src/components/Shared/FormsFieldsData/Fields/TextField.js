
import React from "react";
import { Grid, TextField } from "@material-ui/core";
import { useController } from "react-hook-form";
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

  const { field } = useController({
    name,
    control,
    rules: { required: true },
  });

  return (
    <Grid item xs={12}>
      <h3>{label}</h3>
      <TextField
        type={type}
        name={field.name} // send down the input name
        size={size}
        value={field.value} // input value
        inputRef={field.ref} // send input ref, so we can focus on input when error appear
        fullWidth={fullWidth}
        defaultValue={defaultValue}
        multiline={multiline}

        // events
        onChange={e => {
          sideDialogController.updateState({ [item.name]: e.target.value })
          field.onChange()
        }} // send value to hook form

        onBlur={field.onBlur} // notify when input is touched/blur

        // other input props (dormants, icons etc)
        InputProps={{
          ...InputProps
        }}
        className={true ? classes.baseValueChanged : classes.maxWidth}
      />
    </Grid>
  );
}

export default TextFieldComponent