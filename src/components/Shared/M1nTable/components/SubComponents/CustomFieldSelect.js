import React, { useState, useEffect, useContext } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Grid, InputAdornment, Paper } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/lab/es/internal/svg-icons/ArrowDropDown";
import { colorPallete } from "components/Table/helpers";
import EditIcon from "@material-ui/icons/Edit";
import isEmpty from 'lodash/isEmpty';
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
    "& .MuiInputBase-input": { color: "red", caretColor: "black" },
  },
  textDiv: {
    fontSize: "14px",
  },
  paper: {
    // width: "fit-content",
    "min-width": "125px",
    // "max-width": fullWidth ? "400px" : "none",
    "& .MuiAutocomplete-option": {
      padding: '0px !important'
    }
  },
  myClass: {
    padding: "6px 6px"
  }
}));

const CustomFieldSelect = ({
  index,
  value,
  onCustomKeyChange,
  dropdownOptions,
  column,
  fullWidth,
  variant
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

  const onChange = (e, act, reason) => {
    if (reason === 'clear') {
      e.stopPropagation();
    }
    if (act?.value !== "editOption") {

      onCustomKeyChange(act?.value !== defaultValue.value ? act?.value : null);
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
        padding: "0px",
        height: "50px",
        width: "100%",
        borderBottom: fullWidth ? "1px solid" : "none",
        borderRadius: 5,
        border: variant === 'outlined' ? "1px solid rgba(0, 0, 0, 0.23)" : "none",
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseLeave={(e) => {
        setShowOptions(false);
        setShowIcon(false);
      }}
      onMouseEnter={() => setShowIcon(true)}
    >
      <Autocomplete
        popupIcon={<ArrowDropDownIcon visibility={(fullWidth || showIcon) ? "visible" : "hidden"} />}
        className={classes.search}
        style={{
          height: "100%",
          margin: 0,
        }}
        classes={{ paper: classes.paper }}
        PaperComponent={(props) => {
          return (
            <Paper
            className={props.className}
              style={{ 
                width: fullWidth ? "none" : "fit-content",
                "max-width": fullWidth ? "none" : "400px" 
              }}
            >{props.children}</Paper>
          )
        }}
        open={showOptions}
        defaultValue={defaultValue.value}
        value={value}
        disableListWrap
        options={options
          .filter((op) => typeof op.value === "string")
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
            <Grid style={{
              "flex-wrap": "nowrap",
              marginTop: "5px",
              borderTop: '1px solid #959595',
              padding: "8px 6px 2px 6px"
            }}
              container spacing={0}
              onClick={() => {
                setShowOptions(false);
                setStateApp((stateApp) => ({
                  ...stateApp,
                  selectedMeta: isEmpty(column) ? null : column,
                  showFieldModal: true,
                }));
              }}>
              <Grid style={{ "flex-grow": 1, width: "fit-content", "max-width": "max-content" }} container item xs={2} alignItems="center">
                <EditIcon style={{ alignSelf: "center", fontSize: 18, marginRight: 5 }} />
              </Grid>
              <Grid
                style={{ "flex-grow": 1, width: "fit-content" }}
                container
                item
                xs={10}
                alignItems="center"
                style={{
                  fontSize: 14,
                  "white-space": "nowrap",
                }}
              >
                Edit options
              </Grid>
            </Grid>
          ) : (
            <Grid style={{ "flex-grow": 1, width: "fit-content", "flex-wrap": "nowrap" }} className={classes.myClass} container spacing={0}>
              <Grid style={{ "flex-grow": 1, width: "fit-content", "max-width": "max-content" }} container item xs={2} alignItems="center">
                <CheckIcon style={{
                  fontSize: 13,
                  marginRight: 5,
                  visibility:
                    ((typeof value === "string" && option.value === value) ||
                      option.value === value?.label ||
                      (!value && option.value === defaultValue.label))
                      ? "visible"
                      : "hidden"
                }} />
              </Grid>
              <Grid style={{ "flex-grow": 1, width: "fit-content", /*"max-width": "max-content"*/ }} container item xs={10} alignItems="center">
                <Grid style={{ "flex-grow": 1, width: "fit-content" }} item xs>
                  <span
                    style={{
                      width: "100%",
                      // display: "inline-block",
                      fontWeight: 400,
                      backgroundColor: pallete?.color,
                      color: pallete?.textColor,
                      padding: "3px 10px",
                      borderRadius: 26,
                      fontSize: 14,
                      overflow: "hidden",
                      "white-space": "nowrap",
                      "text-overflow": "ellipsis",
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
            <div
              style={{
                height: "100%",
                display: "flex",
                "align-items": "center",
              }}
              ref={params.InputProps.ref}
              className={`${classes.textDiv}`}
              onClick={() => setShowOptions(!showOptions)}
            >
              <Grid container spacing={0}
                {...params.inputProps}
              >
                <Grid container item xs={10}>
                  <span style={{ "white-space": "nowrap" }} id={`colorText_${index}_${column.name}`}></span>
                </Grid>
              </Grid>
              <InputAdornment
                style={{ "margin-left": -4, "margin-right": 8 }}
                position="end"
                visibility={showIcon ? "visible" : "hidden"}
              >
                {params.InputProps.endAdornment.props.children[1]}
              </InputAdornment>
            </div>
          </>
        )}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomFieldSelect;
