import React, { useState, useEffect, useRef } from "react";
import { colorPallete } from "components/Table/helpers";
import CloseIcon from "@material-ui/icons/Close";
import ArrowDropDownIcon from "@material-ui/lab/es/internal/svg-icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { makeStyles } from "@material-ui/core/styles";
import { copy } from "components/Shared/functions";
import { Tooltip, Typography } from "@material-ui/core";
import SelectField from "components/MRTTable/Common/MetaData/SelectField";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:hover": {
      borderBottom: ({ showUnderline }) =>
        showUnderline ? "2px solid rgba(0, 0, 0, 0.87) !important" : "inherit",
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
    "& .react-select__option": { backgroundColor: "red" },
  },
}));

const ReactSelectField = ({
  index,
  isSingleSelect,
  onCustomKeyChange,
  dropdownOptions,
  value,
  fullWidth,
  showUnderline,
  showChevron,
  variant,
  tooltipView,
  tableKey,
  column,
  ...rest
}) => {
  if (!isSingleSelect && !Array.isArray(value) && value) {
    value = [value];
  }
  const classes = useStyles({ showUnderline, showChevron });
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const [showIcon, setShowIcon] = useState(showChevron);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const Menu = (props) => {
    const shadow = "hsla(218, 50%, 10%, 0.1)";
    return (
      <div
        css={{
          backgroundColor: "white",
          borderRadius: 4,
          boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
          marginTop: 8,
          position: "absolute",
          zIndex: 2,
        }}
        {...props}
      />
    );
  };
  const Blanket = (props) => (
    <div
      css={{
        bottom: 0,
        left: 0,
        top: 0,
        right: 0,
        position: "fixed",
        zIndex: 1,
      }}
      {...props}
    />
  );
  const Dropdown = ({ children, isOpen, target, onClose }) => (
    <div css={{ position: "relative" }}>
      {target}
      {isOpen ? <Menu>{children}</Menu> : null}
      {isOpen ? <Blanket onClick={onClose} /> : null}
    </div>
  );

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const selectStyles = {
    control: (provided) => ({ ...provided, minWidth: 240, margin: 8 }),
    menu: () => ({ boxShadow: "inset 0 1px 0 rgba(0, 0, 0, 0.1)" }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: "white",
      position: "fixed",
    }),
  };

  return (
    <>
      <div
        id={"reactSelectField"}
        ref={wrapperRef}
        className={classes.root}
        style={{
          padding: "0px",
          minHeight: "50px",
          width: "100%",
          border:
            variant === "outlined" ? "1px solid rgba(0, 0, 0, 0.42)" : "none",
          borderBottom: fullWidth ? "1px solid rgba(0, 0, 0, 0.42)" : "none",
        }}
        onMouseLeave={(e) => {
          // setIsOpen(false);
          setShowIcon(showChevron || false);
        }}
        onMouseEnter={(e) => {
          setShowIcon(true);
        }}
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
              <span className="colorText" id={rest.id || "selectedValues"}>
                <MultSelectValues
                  tooltipView={tooltipView}
                  value={value}
                  dropdownOptions={dropdownOptions}
                  onCustomKeyChange={onCustomKeyChange}
                  isSingleSelect={isSingleSelect}
                />
              </span>
              <>
                {showIcon && (
                  <>
                    {isOpen ? (
                      <ArrowDropUpIcon
                        style={{
                          cursor: "pointer",
                          color: "rgba(0, 0, 0, 0.54)",
                        }}
                      />
                    ) : (
                      <ArrowDropDownIcon
                        style={{
                          cursor: "pointer",
                          color: "rgba(0, 0, 0, 0.54)",
                        }}
                      />
                    )}
                  </>
                )}
              </>
            </div>
          }
        >
          <SelectField
            dropdownOptions={dropdownOptions}
            value={value}
            isSingleSelect={isSingleSelect}
            onCustomKeyChange={onCustomKeyChange}
            column={column}
            tableKey={tableKey}
          />
        </Dropdown>
      </div>
    </>
  );
};

export default ReactSelectField;

const MultSelectValues = ({
  value,
  dropdownOptions,
  onCustomKeyChange,
  isSingleSelect,
  tooltipView,
}) => {
  let tooltipValues = value?.slice(1) || [];

  const getCss = (value) => {
    const opt = dropdownOptions.find((opt) => opt.value === value);
    const pallete = colorPallete.find(
      (pallete) => pallete.id === opt?.palleteId
    );
    return {
      // whiteSpace: 'nowrap',
      // overflow: 'hidden',
      // textOverflow: 'ellipsis',
      maxWidth: "150px",
      backgroundColor: pallete?.color,
      color: pallete?.textColor,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: "0px 2px",
    };
  };

  const Badge = ({ badgeValue, index }) => (
    <span className="colorText" style={getCss(badgeValue)}>
      <div
        style={{
          maxWidth: "100px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <span id="badgeValue">{badgeValue}</span>
      </div>

      {isSingleSelect || (
        <CloseIcon
          style={{ fontSize: 13, marginLeft: 10, cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            const newValue = copy(value);
            newValue.splice(index, 1);
            onCustomKeyChange(newValue);
          }}
        />
      )}
    </span>
  );

  const ToolTipView = () => (
    <>
      <Badge badgeValue={value[0]} index={0} />
      {value?.slice(1).length > 0 && (
        <Tooltip
          title={
            <React.Fragment>
              {tooltipValues.map((v) => (
                <Typography color="inherit">{v}</Typography>
              ))}
            </React.Fragment>
          }
        >
          <span
            className="colorText"
            style={{
              borderRadius: "20px",
              whiteSpace: "nowrap",
              backgroundColor: "#c5c2c2",
              color: "black",
              display: "flex",
              padding: "5px 10px 5px 5px",
            }}
          >
            +{tooltipValues.length}
          </span>
        </Tooltip>
      )}
    </>
  );

  const MultiSelectView = () => (
    <>
      {value.map((v, index) => {
        return <Badge badgeValue={v} index={index} />;
      })}
    </>
  );
  return (
    <span
      style={{
        display: "flex",
        width: "max-content",
        flexWrap: "wrap",
        maxWidth: "380px",
      }}
    >
      {value && value.length > 0 && Array.isArray(value) ? (
        <>{tooltipView ? <ToolTipView /> : <MultiSelectView />}</>
      ) : (
        <>
          {value && typeof value === "string" ? (
            <span className="colorText" style={getCss(value)}>
              <span>{value}</span>
            </span>
          ) : (
            <span className="colorText">--</span>
          )}
        </>
      )}
    </span>
  );
};
