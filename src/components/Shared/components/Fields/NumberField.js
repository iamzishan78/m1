import React, { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";

const NumberField = (props) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(props?.value);
    // props?.offClickHandler(props?.field?.key, props?.value);
  }, [props?.value]);

  return (
    <TextField
      id={props.id || `field-${props?.index}`}
      variant="outlined"
      margin="dense"
      type="text"
      fullWidth
      InputProps={props.InputProps ? props.InputProps : {}}
      InputLabelProps={{
        shrink: true,
      }}
      onBlur={() => {
        props?.offClickHandler(props?.field?.key, value);
      }}
      onChange={(e) => {
        const val = (e.target.value || "").trim();
        if (val) {
          if (!isNaN(Number(val))) {
            setValue(val);
            if (props?.onChange) {
              props.onChange(e, val);
            }
          }
        } else {
          setValue("");
          if (props?.onChange) {
            props.onChange(e, val);
          }
        }
      }}
      disabled={props?.field?.disabled}
      value={value}
      {...props.props}
    />
  );
};

export default NumberField;
