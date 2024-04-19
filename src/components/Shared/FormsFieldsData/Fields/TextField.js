
import React from "react";
import { Grid, TextField } from "@material-ui/core";
import { useController, useForm } from "react-hook-form";


function TextFieldComponent({ control, name, ...props }) {
  const { field } = useController({
    name,
    control,
    rules: { required: true },
  });

  const {
    // field props
    size,
    type,
    label,
    InputProps,
    fullWidth = true,
    defaultValue = null,
    multiline = false,
    // styles 
    className
  } = props;
  console.log(field);

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
        onChange={field.onChange} // send value to hook form 
        onBlur={field.onBlur} // notify when input is touched/blur

        // other input props (dormants, icons etc)
        InputProps={{ ...InputProps }}

        // styles
        className={className}
      />
    </Grid>
  );
}

export default TextFieldComponent