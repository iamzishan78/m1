import React, { useState, useEffect, useContext } from "react";
import { colorPallete } from "components/Table/helpers";
import CloseIcon from "@material-ui/icons/Close";
import ArrowDropDownIcon from "@material-ui/lab/es/internal/svg-icons/ArrowDropDown";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";

import Select from 'react-select';
import { components } from "react-select";
import { defaultTheme } from 'react-select';
import { copy } from "components/Shared/functions";
import { AppContext } from "AppContext";
import { Grid } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";

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

const ReactSelectField = ({
  index,
  isSingleSelect,
  onCustomKeyChange,
  dropdownOptions,
  column,
  value,
  fullWidth,
  variant
}) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const [options, setOptions] = useState([]);
  const [, setStateApp] = useContext(AppContext);

  const defaultValue = {
    label: "----",
    value: "----",
  };


  const Option = (props) => {
    const palleteId = props?.options.find(opt => opt.value === props.value)?.palleteId
    const pallete = colorPallete.find(
      (pallete) => pallete.id === palleteId
    );
    return (
      <components.Option {...props}>
        {props.value === "editOption" ? (
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
              setIsOpen(false);
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
        ) : (
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
                  value?.includes(props.value) ||
                  (!value && props.value === defaultValue.label)
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
                  {props.value}
                </span>
              </Grid>
            </Grid>
          </Grid>
        )}

      </components.Option>

    );
  };


  const { colors } = defaultTheme;
  useEffect(() => {
    onFilterChange("");
  }, [dropdownOptions]);

  const onFilterChange = (search) => {
    const options = JSON.parse(JSON.stringify(dropdownOptions.filter(op => op.value?.toLowerCase()?.includes(search.toLowerCase()))));
    options.unshift(defaultValue);
    options.push({ label: "edit", value: "editOption" });
    setOptions(options);
  }

  const Menu = props => {
    const shadow = 'hsla(218, 50%, 10%, 0.1)';
    return (
      <div
        css={{
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
          marginTop: 8,
          position: 'absolute',
          zIndex: 2,
        }}
        {...props}
      />
    );
  };
  const Blanket = props => (
    <div
      css={{
        bottom: 0,
        left: 0,
        top: 0,
        right: 0,
        position: 'fixed',
        zIndex: 1,
      }}
      {...props}
    />
  );
  const Dropdown = ({ children, isOpen, target, onClose }) => (
    <div css={{ position: 'relative' }}>
      {target}
      {isOpen ? <Menu>{children}</Menu> : null}
      {isOpen ? <Blanket onClick={onClose} /> : null}
    </div>
  );
  const Svg = p => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      focusable="false"
      role="presentation"
      {...p}
    />
  );
  const DropdownIndicator = () => (
    <div css={{ color: colors.neutral20, height: 24, width: 32 }}>
      <Svg>
        <path
          d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </Svg>
    </div>
  );
  const ChevronDown = () => (
    <Svg style={{ marginRight: -6 }}>
      <path
        d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>)

  const toggleOpen = () => {

    setIsOpen(!isOpen)
  };
  const onSelectChange = act => {
    // toggleOpen();
    if (act?.value !== "editOption" && act?.value !== "search") {
      if (isSingleSelect) {
        onCustomKeyChange(act?.value !== defaultValue.value ? act?.value : null);
        setIsOpen(false)
      }
      else {
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
    }

  };

  const selectStyles = {
    control: provided => ({ ...provided, minWidth: 240, margin: 8 }),
    menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
    menuPortal: base => ({ ...base, zIndex: 9999, backgroundColor: "white" })
  };
  return (
    <>
      <div
        style={{
          padding: "0px",
          minHeight: "50px",
          width: "100%",
          border: variant === 'outlined' ? "1px solid rgba(0, 0, 0, 0.23)" : "none",
          borderBottom: fullWidth ? "1px solid rgba(0, 0, 0, 0.23)" : "none",
          borderRadius: "6px"
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseLeave={(e) => {
          setIsOpen(false);
        }}
      >


        <Dropdown
          isOpen={isOpen}
          onClose={() => toggleOpen()}
          target={
            <div
              onClick={() => toggleOpen()}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span class="colorText">
                <MultSelectValues
                  value={value}
                  dropdownOptions={dropdownOptions}
                  onCustomKeyChange={onCustomKeyChange}
                  isSingleSelect={isSingleSelect}
                />
              </span>
              {
                isOpen ? (<ArrowDropUpIcon style={{ cursor: "pointer" }} />) : (<ArrowDropDownIcon style={{ cursor: "pointer" }} />)
              }
            </div>

          }
        >
          <Select
            autoFocus
            backspaceRemovesValue={false}
            controlShouldRenderValue={false}
            hideSelectedOptions={false}
            isClearable={false}
            menuIsOpen
            onChange={(e) => onSelectChange(e)}
            options={options
              .filter((op) => typeof op.value === "string")
              .map((op) => ({
                ...op,
                value: op.value,
                label: op.value,
              }))}
            components={{ DropdownIndicator, IndicatorSeparator: null, Option }}
            placeholder="Search for value"
            styles={selectStyles}
            tabSelectsValue={false}
            value={value}

            menuPortalTarget={document.body}
          />

        </Dropdown>
      </div>
    </>
  );
};

export default ReactSelectField;

const MultSelectValues = ({ value, dropdownOptions, onCustomKeyChange, isSingleSelect }) => {
  const palleteForSingleSelect = isSingleSelect ? colorPallete.find(
    (pallete) => pallete.id === dropdownOptions.find(opt => opt.value === value)?.palleteId
  ) : ''
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
              {isSingleSelect || (
                <CloseIcon
                  style={{ fontSize: 13, marginLeft: 10 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newValue = copy(value)
                    newValue.splice(index, 1);

                    onCustomKeyChange(newValue);
                  }}
                />
              )}

            </span>
          );
        })
      ) : (
        <>
          {value && typeof value === 'string' ? (
            <span
              class="colorText"
              style={{
                whiteSpace: "nowrap",
                backgroundColor: palleteForSingleSelect?.color,
                color: palleteForSingleSelect?.textColor,
                display: "flex",
                margin: '0px 2px'
              }}
            >
              <span>{value}</span>


            </span>
          ) : (<span class="colorText">----</span>)}
        </>
      )}
    </span>
  );
};
