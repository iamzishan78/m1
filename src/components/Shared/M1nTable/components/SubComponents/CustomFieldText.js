import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({}));

const CustomFieldText = ({ value, onCustomKeyChange }) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState(value)
  return (
    <div style={{ width: "150px" }} onClick={(e) => e.stopPropagation()}>
      <TextField
        key={"fieldContentInput"}
        id={"fieldContentInput"}
        className={classes.textField}
        variant="outlined"
        size="small"
        autoComplete="nope"
        fullWidth
        label={null}
        value={inputValue}
        helperText={"Return to save"}
        onChange={(e) => {
          e.persist();
          setInputValue(e.target.value);
        }}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === "Enter") {
            event.preventDefault();
            debugger
            onCustomKeyChange(inputValue)
          }
          if (event.key === "Escape") {
              debugger
          }
        }}
        onBlur={() => {
            debugger
        }}
      />
    </div>
  );
};

export default CustomFieldText;
