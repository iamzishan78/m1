import React, { useState, useEffect, useContext, useRef } from "react";
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
import { Grid, Tooltip, Typography } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:hover": {
      borderBottom: ({ showUnderline }) => showUnderline ? '2px solid rgba(0, 0, 0, 0.87) !important' : 'inherit'
    },
  },
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
  reactSelect: {
    '& .react-select__option': { backgroundColor: 'red' }
  }
}));

const ReactSelectField = ({
  index,
  isSingleSelect,
  onCustomKeyChange,
  dropdownOptions,
  column,
  value,
  fullWidth,
  showUnderline,
  showChevron,
  variant,
  tooltipView,
  ...rest
}) => {
  if (!isSingleSelect && !Array.isArray(value) && value) {
    value = [value]
  }
  const classes = useStyles({ showUnderline, showChevron });
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const [showIcon, setShowIcon] = useState(showChevron);

  const [options, setOptions] = useState([]);
  const [, setStateApp] = useContext(AppContext);

  const defaultValue = {
    label: "--",
    value: "--",
  };

  const { colors } = defaultTheme;

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    onFilterChange("");
  }, [dropdownOptions]);

  const Option = (props) => {
    const palleteId = props?.options.find(opt => opt.value === props.value)?.palleteId
    const pallete = colorPallete.find(
      (pallete) => pallete.id === palleteId
    );
    return (
      <components.Option {...props}>
        {props.value === "editOption" ? (
          <Grid
            id={props}
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
                <Tooltip title={props.value} placement="top">
                  <Typography style={{
                    width: "100%",
                    fontWeight: 400,
                    backgroundColor: pallete?.color,
                    color: pallete?.textColor,
                    padding: "3px 10px",
                    borderRadius: 26,
                    fontSize: 14,
                    overflow: "hidden",
                    "white-space": "nowrap",
                    "text-overflow": "ellipsis",
                    textOverflow: 'ellipsis',
                    maxWidth: "187px"
                  }}>
                    {props.value
                    }</Typography>

                </Tooltip>

              </Grid>
            </Grid>
          </Grid>
        )}

      </components.Option>

    );
  };

  const onFilterChange = (search) => {
    const options = JSON.parse(JSON.stringify(dropdownOptions.filter(op => op.value?.toLowerCase()?.includes(search.toLowerCase()))));
    options.unshift(defaultValue);
    options.push({ label: "edit", value: "editOption" });
    setOptions(options);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && isOpen) {
      e.stopPropagation();
      setIsOpen(!isOpen)
    }
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
      {isOpen ? <Menu >{children}</Menu> : null}
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
    menuPortal: base => ({ ...base, zIndex: 9999, backgroundColor: "white", position: "fixed" })
  };


  const filterOptions = (candidate, input
  ) => {
    if (candidate.value === "editOption") {
      return true;
    }
    return candidate.value.toLowerCase().includes(input?.toLowerCase())
  };

  return (
    <>
      <div
        id={rest.id || "checkif"}
        ref={wrapperRef}
        className={classes.root}
        style={{
          padding: "0px",
          minHeight: "50px",
          width: "100%",
          border: variant === 'outlined' ? "1px solid rgba(0, 0, 0, 0.42)" : "none",
          borderBottom: fullWidth ? "1px solid rgba(0, 0, 0, 0.42)" : "none",
        }}
        onMouseLeave={(e) => {
          // setIsOpen(false);
          setShowIcon(showChevron || false)
        }}
        onMouseEnter={(e) => { setShowIcon(true) }}
        onClick={(e) => e.stopPropagation()}
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
              <span className="colorText" id="selectedValues">
                <MultSelectValues
                  tooltipView={tooltipView}
                  value={value}
                  dropdownOptions={dropdownOptions}
                  onCustomKeyChange={onCustomKeyChange}
                  isSingleSelect={isSingleSelect}
                />
              </span>
              <>
                {
                  showIcon && <>
                    {
                      isOpen ? (<ArrowDropUpIcon style={{ cursor: "pointer", color: 'rgba(0, 0, 0, 0.54)' }} />) : (<ArrowDropDownIcon style={{ cursor: "pointer", color: 'rgba(0, 0, 0, 0.54)' }} />)
                    }
                  </>
                }
              </>

            </div>

          }
        >
          <Select
            classNamePrefix='react-select'
            className='react-select-container'
            autoFocus
            backspaceRemovesValue={false}
            controlShouldRenderValue={false}
            hideSelectedOptions={false}
            isClearable={false}
            id="searchForValue"
            menuIsOpen
            onKeyDown={handleKeyDown}
            onChange={(e) => onSelectChange(e)}
            options={options
              .filter((op) => typeof op.value === "string")
              .map((op) => ({
                ...op,
                value: op.value,
                label: op.value,
              }))}
            filterOption={filterOptions}
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

const MultSelectValues = ({ value, dropdownOptions, onCustomKeyChange, isSingleSelect, tooltipView }) => {
  let tooltipValues = value?.slice(1) || [];

  const getCss = (value) => {
    const opt = dropdownOptions.find((opt) => opt.value === value);
    const pallete = colorPallete.find(
      (pallete) => pallete.id === opt?.palleteId
    );
    return {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '150px',
      backgroundColor: pallete?.color,
      color: pallete?.textColor,
      // display: "flex",
      margin: '0px 2px',
    }
  }

  const Badge = ({ badgeValue, index }) => <span
    className="colorText"
    style={getCss(badgeValue)}
  >
    <span id="badgeValue">{badgeValue}</span>
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

  const ToolTipView = () => <>
    <Badge badgeValue={value[0]} index={0} />
    {
      value?.slice(1).length > 0 && <Tooltip
        title={
          <React.Fragment>
            {tooltipValues.map((v) => <Typography color="inherit">{v}</Typography>)}
          </React.Fragment>
        }
      >
        <span
          className="colorText"
          style={{
            borderRadius: '20px',
            whiteSpace: "nowrap",
            backgroundColor: '#c5c2c2',
            color: 'black',
            display: "flex",
            padding: '5px 10px 5px 5px'
          }}
        >
          +{tooltipValues.length}
        </span>
      </Tooltip>
    }
  </>

  const MultiSelectView = () => <>
    {
      value.map((v, index) => {
        return (
          <Badge badgeValue={v} index={index} />
        );
      })
    }
  </>
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
        <>
          {tooltipView ? <ToolTipView /> : <MultiSelectView />}
        </>
      ) : (
        <>
          {value && typeof value === 'string' ? (
            <span
              className="colorText"
              style={getCss(value)}
            >
              <span>{value}</span>
            </span>
          ) : (<span className="colorText">--</span>)}
        </>
      )}
    </span>
  );
};
