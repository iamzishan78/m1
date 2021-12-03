import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Grid } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { colorPallete } from "components/Table/helpers";

const useStyles = makeStyles((theme) => ({
  noBorder: {
    border: "none",
  },
  search: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiOutlinedInput-root": {
      paddingRight: "0px !important",
    },
    "& .MuiAutocomplete-endAdornment": {
      display: "none",
    },
    "& .MuiInputBase-input": { color: "red", caretColor: "black" },
  },
  textDiv: {
    fontSize: "14px",
    marginTop: "-32px",
  },
  paper: {
    width: "175px",
  },
}));

const CustomFieldSelect = ({
  index,
  value,
  onCustomKeyChange,
  column,
  fullWidth,
}) => {
  const classes = useStyles();
  const defaultValue = {
    label: "----",
    value: "----",
  };
  const [showOptions, setShowOptions] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  const options = JSON.parse(JSON.stringify(column.dropdownOptions));
  options.unshift(defaultValue);

  const onChange = (e, act) => {
    onCustomKeyChange(act);
  };

  useEffect(() => {
    if (value?.label) {
      const pallete = colorPallete.find(
        (pallete) => pallete.id === value.palleteId
      );
      document.getElementById(
        `colorText_${index}_${column.name}`
      ).innerHTML = `<span class='colorText' style="background-color: ${pallete?.color}; color: ${pallete?.textColor}">${value.label}</span>`;
    } else {
      document.getElementById(
        `colorText_${index}_${column.name}`
      ).innerHTML = `<span class='colorText'>----</span>`;
    }
  }, [index, value]);

  return (
    <div
      style={{
        padding: "0px 10px",
        height: "50px",
        width: fullWidth ? "100%" : "max-content",
        borderBottom: fullWidth ? "1px solid" : "none",
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseLeave={(e) => {
        setShowOptions(false);
        setShowIcon(false);
      }}
      onMouseEnter={() => setShowIcon(true)}
    >
      <Autocomplete
        className={classes.search}
        style={{
          margin: 0,
        }}
        classes={{ paper: classes.paper }}
        disableClearable
        open={showOptions}
        defaultValue={defaultValue}
        value={value}
        disableListWrap
        options={options.filter(op => op.value).map((op) => ({
          ...op,
          label: op.value,
          value: op.value,
        }))}
        getOptionLabel={(option) => option.label}
        getOptionSelected={(option, value) => {
          return option?.value === value?.value;
        }}
        filterOptions={(options, params) => {
          return options;
        }}
        renderOption={(option) => {
          const pallete = colorPallete.find(
            (pallete) => pallete.id === option.palleteId
          );
          return (
            <Grid className={classes.myClass} container spacing={0}>
              <Grid container item xs={2} alignItems="center">
                {(option.value === value?.label ||
                  (!value && option.value === defaultValue.label)) && (
                  <CheckIcon style={{ fontSize: 13, marginRight: 5 }} />
                )}
              </Grid>
              <Grid container item xs={10} alignItems="center">
                <Grid item xs>
                  <span
                    style={{
                      fontWeight: 400,
                      backgroundColor: pallete?.color,
                      color: pallete?.textColor,
                      padding: "3px 10px",
                      borderRadius: 26,
                      fontSize: 14,
                    }}
                  >
                    {option.label}
                  </span>
                </Grid>
              </Grid>
            </Grid>
          );
        }}
        renderInput={(params) => (
          <>
            <TextField
              style={{ visibility: "hidden" }}
              margin="dense"
              {...params}
              variant="outlined"
            />
            <div
              className={`${classes.textDiv}`}
              onClick={() => setShowOptions(!showOptions)}
            >
              <Grid container spacing={0}>
                <Grid container item xs={10}>
                  <span id={`colorText_${index}_${column.name}`}></span>
                </Grid>
                <Grid container item xs={2}>
                  <KeyboardArrowDownIcon
                    style={{
                      marginTop: -2,
                      visibility: showIcon || fullWidth ? "visible" : "hidden",
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </>
        )}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomFieldSelect;
