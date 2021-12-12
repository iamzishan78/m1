import React, { useState, useEffect, useContext } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Grid } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { colorPallete } from "components/Table/helpers";
import EditIcon from "@material-ui/icons/Edit";
import { AppContext } from "AppContext";

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
    "& .MuiAutocomplete-option" : {
      padding: '0px !important'
    }
  },
  myClass: {
    padding: "6px 16px"
  }
}));

const CustomFieldSelect = ({
  index,
  value,
  onCustomKeyChange,
  dropdownOptions,
  column,
  fullWidth,
}) => {
  const classes = useStyles();
  const [options, setOptions] = useState([]);
  const [stateApp, setStateApp] = useContext(AppContext);
  const defaultValue = {
    label: "----",
    value: "----",
  };
  const [showOptions, setShowOptions] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    const options = JSON.parse(JSON.stringify(dropdownOptions));
    options.unshift(defaultValue);
    setOptions(options);
    options.push({ label: "edit", value: "editOption" });
  }, [dropdownOptions]);

  const onChange = (e, act) => {
    if(act.value !== "editOption"){
      onCustomKeyChange(act.value);
    }
    
  };

  useEffect(() => {
    if (value) {
      let data = JSON.parse(JSON.stringify(value));
      if (typeof value !== "string" && value?.label) {
        data = JSON.parse(JSON.stringify(value.label));
      }
      const opt = dropdownOptions.find((opt) => opt.value === data);
      if (opt) {
        const pallete = colorPallete.find(
          (pallete) => pallete.id === opt.palleteId
        );
        document.getElementById(
          `colorText_${index}_${column.name}`
        ).innerHTML = `<span class='colorText' style="background-color: ${pallete?.color}; color: ${pallete?.textColor}">${data}</span>`;
      } else {
        document.getElementById(
          `colorText_${index}_${column.name}`
        ).innerHTML = `<span class='colorText'>----</span>`;
      }
    } else {
      document.getElementById(
        `colorText_${index}_${column.name}`
      ).innerHTML = `<span class='colorText'>----</span>`;
    }
  }, [index, value, dropdownOptions]);

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
        defaultValue={defaultValue.value}
        value={value}
        disableListWrap
        options={options
          .filter((op) => op.value)
          .map((op) => ({
            ...op,
            label: op.value,
            value: op.value,
          }))}
        getOptionLabel={(option) => (option?.label ? option.label : "")}
        getOptionSelected={(option) => {
          return option.value === value || option.value === value?.value;
        }}
        filterOptions={(options, params) => {
          return options;
        }}
        renderOption={(option) => {
          const pallete = colorPallete.find(
            (pallete) => pallete.id === option.palleteId
          );
          return option.value === "editOption" ? (
            <Grid style={{ borderTop: '1px solid #959595', padding: "10px 12px" }} container spacing={0} onClick={() => {
              setShowOptions(false);
              setStateApp((stateApp) => ({
                ...stateApp,
                selectedMeta: column,
                showFieldModal: true,
              }));
            }}>
              <Grid container item xs={2} alignItems="center">
                <EditIcon style={{ alignSelf: "center", fontSize: 18 }} />
              </Grid>
              <Grid
                container
                item
                xs={10}
                alignItems="center"
                style={{ fontSize: 14 }}
              >
                Edit options
              </Grid>
            </Grid>
          ) : (
            <Grid className={classes.myClass} container spacing={0}>
              <Grid container item xs={2} alignItems="center">
                {((typeof value === "string" && option.value === value) ||
                  option.value === value?.label ||
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
