import React, { useState, useEffect, useContext } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Grid, InputAdornment, Paper, TextField } from "@material-ui/core";
import { Menu } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/lab/es/internal/svg-icons/ArrowDropDown";
import { colorPallete } from "components/Table/helpers";
import EditIcon from "@material-ui/icons/Edit";
import { AppContext } from "AppContext";
import { copy } from "components/Shared/functions";

import { useTheme, alpha } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import SettingsIcon from '@material-ui/icons/Settings';
import DoneIcon from '@material-ui/icons/Done';
import ButtonBase from '@material-ui/core/ButtonBase';
import InputBase from '@material-ui/core/InputBase';


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

const TestFieldMultiSelect = ({
  index,
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
    label: "----",
    value: "----",
  };
  const [showOptions, setShowOptions] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  // related to menu
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorRef = React.useRef(null);
  const [value, setValue] = useState([labels[1], labels[11]]);
  const [pendingValue, setPendingValue] = useState([]);
  const theme = useTheme();

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


  const handleClick = (event) => {
    //setPendingValue(value);
    if (anchorEl === null)
      setAnchorEl(event.currentTarget);
    else setAnchorEl(null);
  };

  const handleClose = (event, reason) => {
    if (reason === 'toggleInput') {
      return;
    }
    setValue(pendingValue);
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  console.log("open : ", open)
  const id = 'simple-menu'

  return (
    <React.Fragment>
      <div className={classes.root}>
        <ButtonBase
          disableRipple
          className={classes.button}
          aria-describedby={id}
          onClick={handleClick}
        >
          <span>Labels</span>
          <SettingsIcon />
        </ButtonBase>
        {/* {value.map((label) => (
          <div
            key={label.name}
            className={classes.tag}
            style={{
              backgroundColor: label.color,
              color: theme.palette.getContrastText(label.color),
            }}
          >
            {label.name}
          </div>
        ))} */}
      </div>

      <Menu
        id="simple-menu"
        elevation={0}
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "middle",
        }}
        PaperProps={{
          // style: {
          //   left: "10%",
          //   transform: "translateX(105%) translateY(-10%)",
          // },
        }}
        open={Boolean(anchorEl)}
        // onClose={() => setAgreementAnchorEl(null)}
        className={classes.parcelPopover}
      >
        <div className={classes.header}>Apply labels to this pull request</div>

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
            setAnchorEl(null);
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

            open
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

            onChange={(event, newValue) => {
              setPendingValue(newValue);
            }}
            getOptionLabel={(option) => (option?.label ? option.label : "")}
            getOptionSelected={(option) => {
              return option.value === value || option.value === value?.value;
            }}
            filterOptions={(options, params) => {
              return options;
            }}
            disableCloseOnSelect
            disablePortal
            renderTags={() => null}
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
              <InputBase
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                autoFocus
                className={classes.inputBase}
              />
            )}
          />

        </div>
      </Menu>

    </React.Fragment>
  );
};

export default TestFieldMultiSelect;

const labels = [
  {
    name: 'good first issue',
    color: '#7057ff',
    description: 'Good for newcomers',
  },
  {
    name: 'help wanted',
    color: '#008672',
    description: 'Extra attention is needed',
  },
  {
    name: 'priority: critical',
    color: '#b60205',
    description: '',
  },
  {
    name: 'priority: high',
    color: '#d93f0b',
    description: '',
  },
  {
    name: 'priority: low',
    color: '#0e8a16',
    description: '',
  },
  {
    name: 'priority: medium',
    color: '#fbca04',
    description: '',
  },
  {
    name: "status: can't reproduce",
    color: '#fec1c1',
    description: '',
  },
  {
    name: 'status: confirmed',
    color: '#215cea',
    description: '',
  },
  {
    name: 'status: duplicate',
    color: '#cfd3d7',
    description: 'This issue or pull request already exists',
  },
  {
    name: 'status: needs information',
    color: '#fef2c0',
    description: '',
  },
  {
    name: 'status: wont do/fix',
    color: '#eeeeee',
    description: 'This will not be worked on',
  },
  {
    name: 'type: bug',
    color: '#d73a4a',
    description: "Something isn't working",
  },
  {
    name: 'type: discussion',
    color: '#d4c5f9',
    description: '',
  },
  {
    name: 'type: documentation',
    color: '#006b75',
    description: '',
  },
  {
    name: 'type: enhancement',
    color: '#84b6eb',
    description: '',
  },
  {
    name: 'type: epic',
    color: '#3e4b9e',
    description: 'A theme of work that contain sub-tasks',
  },
  {
    name: 'type: feature request',
    color: '#fbca04',
    description: 'New feature or request',
  },
  {
    name: 'type: question',
    color: '#d876e3',
    description: 'Further information is requested',
  },
];

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
              class="colorText"
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
        <span class="colorText">----</span>
      )}
    </span>
  );
};
