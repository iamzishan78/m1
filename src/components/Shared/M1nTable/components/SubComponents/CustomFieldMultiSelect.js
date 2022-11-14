import React, { useState, useEffect, useContext } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Grid, InputAdornment, Paper, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/lab/es/internal/svg-icons/ArrowDropDown";
import { colorPallete } from "components/Table/helpers";
import EditIcon from "@material-ui/icons/Edit";
import { AppContext } from "AppContext";
import { copy } from "components/Shared/functions";

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
      padding: "0px !important",
    },
    "& .MuiAutocomplete-listbox": {
      padding: "8px 10px",
    },
  },
  myClass: {
    padding: "6px 6px",
    "& .MuiIconButton-root": {
      padding: "0px !important",
    },
  },
}));

const CustomFieldMultiSelect = ({
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
  const [search, setSearch] = useState("");
  const [, setStateApp] = useContext(AppContext);
  const defaultValue = {
    label: "--",
    value: "--",
  };
  const [showOptions, setShowOptions] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    onFilterChange("");
  }, [dropdownOptions]);

  const onFilterChange = (search) => {
    const options = JSON.parse(JSON.stringify(dropdownOptions.filter(op => op.value?.toLowerCase()?.includes(search.toLowerCase()))));
    options.unshift(defaultValue);
    options.unshift({ label: 'search', value: 'search' });
    options.push({ label: "edit", value: "editOption" });
    setOptions(options);
    setSearch(search);
  }

  const onChange = (e, act, reason) => {
    if (reason === "clear") {
      e.stopPropagation();
    }
    if (act?.value !== "editOption" && act?.value !== "search") {
      let newValue = value ? copy(value) : [];
      const selectedValue =
        act?.value !== defaultValue.value ? act?.value : null;
      if (!Array.isArray(newValue) || newValue?.length === 0) {
        newValue = [selectedValue];
      } else if (newValue.includes(selectedValue)) {
        const index = newValue.findIndex((v) => v === selectedValue);
        newValue.splice(index, 1);
      } else {
        newValue.push(selectedValue);
      }
      onCustomKeyChange(newValue);
    }
  };

  // useEffect(() => {
  //   if (value) {
  //     let data = JSON.parse(JSON.stringify(value));
  //     if (data.length > 0) {
  //       let str = "";
  //       for (let i = 0; i < data.length; i++) {
  //         const opt = dropdownOptions.find((opt) => opt.value === data[i]);
  //         if (opt) {
  //           const pallete = colorPallete.find(
  //             (pallete) => pallete.id === opt.palleteId
  //           );
  //           str = `${str}<span class='colorText' style="white-space: nowrap; background-color: ${pallete?.color}; color: ${pallete?.textColor}">${data[i]}</span>`;
  //         }
  //       }
  //       document.getElementById(`colorText_${index}_${column.name}`).innerHTML =
  //         str;
  //     } else {
  //       document.getElementById(
  //         `colorText_${index}_${column.name}`
  //       ).innerHTML = `<span class='colorText'>----</span>`;
  //     }
  //   } else {
  //     document.getElementById(
  //       `colorText_${index}_${column.name}`
  //     ).innerHTML = `<span class='colorText'>----</span>`;
  //   }
  // }, [index, value, dropdownOptions]);

  return (
    <div
      style={{
        padding: "0px",
        height: "50px",
        width: "100%",
        border: variant === 'outlined' ? "1px solid rgba(0, 0, 0, 0.23)" : "none",
        borderBottom: fullWidth ? "1px solid rgba(0, 0, 0, 0.23)" : "none",
        borderRadius: "6px"
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseLeave={(e) => {
        setShowOptions(false);
        setShowIcon(false);
      }}
      onMouseEnter={() => setShowIcon(true)}
    >
      <Autocomplete
        popupIcon={
          <ArrowDropDownIcon
            visibility={fullWidth || showIcon ? "visible" : "hidden"}
          />
        }
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
                "max-width": fullWidth ? "none" : "400px",
              }}
            >
              {props.children}
            </Paper>
          );
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
          if (option.value === "editOption") {
            return (
              <Grid
                style={{
                  "flex-wrap": "nowrap",
                  marginTop: "5px",
                  borderTop: "1px solid #959595",
                  padding: "8px 6px 2px 6px",
                }}
                container
                spacing={0}
                onClick={() => {
                  setShowOptions(false);
                  setStateApp((stateApp) => ({
                    ...stateApp,
                    selectedMeta: column,
                    showFieldModal: true,
                  }));
                }}
              >
                <Grid
                  style={{
                    "flex-grow": 1,
                    width: "fit-content",
                    "max-width": "max-content",
                  }}
                  container
                  item
                  xs={2}
                  alignItems="center"
                >
                  <EditIcon
                    style={{ alignSelf: "center", fontSize: 18, marginRight: 5 }}
                  />
                </Grid>
                <Grid
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

            )
          } else if (option.value === "search") {
            return (
              <div style={{ display: "flex", padding: "10px", width: "100%" }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search"
                  fullWidth
                  autoFocus
                  value={search}
                  defaultValue={search}
                  onChange={(e) => onFilterChange(e.target.value)}
                />
              </div>
            )
          } else {
            return (
              <Grid
                style={{
                  "flex-grow": 1,
                  width: "fit-content",
                  "flex-wrap": "nowrap",
                }}
                className={classes.myClass}
                container
                spacing={0}
              >
                <Grid
                  style={{
                    "flex-grow": 1,
                    width: "fit-content",
                    "max-width": "max-content",
                  }}
                  container
                  item
                  xs={2}
                  alignItems="center"
                >
                  <Checkbox
                    checked={
                      value?.includes(option.value) ||
                      (!value && option.value === defaultValue.label)
                    }
                    color="default"
                    style={{ marginRight: 5 }}
                    inputProps={{
                      "aria-label": "checkbox with default color",
                    }}
                  />
                </Grid>
                <Grid
                  style={{
                    "flex-grow": 1,
                    width: "fit-content" /*"max-width": "max-content"*/,
                  }}
                  container
                  item
                  xs={10}
                  alignItems="center"
                >
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
            )
          }
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
              <Grid container spacing={0} {...params.inputProps}>
                {/* <Grid container item xs={10}>
                  <span
                    id={`colorText_${index}_${column.name}`}
                    style={{
                      display: "flex",
                      width: "max-content",
                      flexWrap: "wrap",
                    }}
                  ></span>
                </Grid> */}
                {/* <Grid container item xs={10}> */}
                <MultSelectValues
                  value={value}
                  dropdownOptions={dropdownOptions}
                  onCustomKeyChange={onCustomKeyChange}
                />
                {/* </Grid> */}
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

export default CustomFieldMultiSelect;

const MultSelectValues = ({ value, dropdownOptions, onCustomKeyChange }) => {
  return (
    <span
      style={{
        display: "flex",
        width: "max-content",
        flexWrap: "wrap",
        maxWidth: "380px"
      }}
    >
      {value && value.length > 0 && Array.isArray(value) ? (
        value.map((v, index) => {
          const opt = dropdownOptions.find((opt) => opt.value === v);
          const pallete = colorPallete.find(
            (pallete) => pallete.id === opt?.palleteId
          );
          return (
            <span
              className="colorText"
              style={{
                whiteSpace: "nowrap",
                backgroundColor: pallete?.color,
                color: pallete?.textColor,
                display: "flex",
                margin: '0px 2px'
              }}
            >
              <span>{v}</span>
              <CloseIcon
                style={{ fontSize: 13, marginLeft: 10 }}
                onClick={(e) => {
                  e.stopPropagation();
                  const newValue = copy(value)
                  newValue.splice(index, 1);

                  onCustomKeyChange(newValue);
                }}
              />
            </span>
          );
        })
      ) : (
        <span class="colorText">--</span>
      )}
    </span>
  );
};
