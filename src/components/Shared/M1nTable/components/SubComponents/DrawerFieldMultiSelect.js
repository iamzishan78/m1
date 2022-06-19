import React, { useState, useEffect, useContext } from "react";
import { colorPallete } from "components/Table/helpers";
import CloseIcon from "@material-ui/icons/Close";
import ArrowDropDownIcon from "@material-ui/lab/es/internal/svg-icons/ArrowDropDown";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import ReactDOM from "react-dom";
import { Component } from 'react';

import Button from "@material-ui/core/Button";

import Select from 'react-select';
import { defaultTheme } from 'react-select';
import { copy } from "components/Shared/functions";


const DrawerFieldMultiSelect = ({
  index,
  onCustomKeyChange,
  dropdownOptions,
  column,
  value,
  fullWidth,
  variant
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sValue, setsValue] = useState(undefined);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");

  const defaultValue = {
    label: "----",
    value: "----",
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
    setSearch(search);
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
  const onSelectChange = value => {
    toggleOpen();
    setsValue(value)

  };

  const selectStyles = {
    control: provided => ({ ...provided, minWidth: 240, margin: 8 }),
    menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
    menuPortal: base => ({ ...base, zIndex: 9999, backgroundColor: "white" })
  };
  return (
    <>
      <Dropdown
        isOpen={isOpen}
        onClose={() => toggleOpen()}
        target={
          <div
            onClick={() => toggleOpen()}
            style={{
              width: "393px",
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
              />
            </span>
            {
              isOpen ? (<ArrowDropUpIcon style={{ cursor: "pointer" }} />) : (<ArrowDropDownIcon style={{ cursor: "pointer" }} />)
            }


            {/* <Item>Item 3</Item> */}
          </div>
          // <Button
          //  
          // >
          //   <span class="colorText">----</span>
          //   <ArrowDropDownIcon />
          // </Button>
        }
      >
        <Select
          autoFocus
          backspaceRemovesValue={false}
          components={{ DropdownIndicator, IndicatorSeparator: null }}
          controlShouldRenderValue={false}
          hideSelectedOptions={false}
          isClearable={false}
          menuIsOpen
          onChange={onSelectChange}
          options={options
            .filter((op) => typeof op.value === "string")
            .map((op) => ({
              ...op,
              label: op.value,
              value: op.value,
            }))}
          placeholder="Search..."
          styles={selectStyles}
          tabSelectsValue={false}
          value={sValue}

          menuPortalTarget={document.body}
        />
      </Dropdown>
    </>
  );
};

export default DrawerFieldMultiSelect;

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
