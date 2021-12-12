import React, { useState } from "react";
import { Breadcrumbs, Typography, IconButton } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Menu, MenuItem } from "@material-ui/core";
import { AutoCompleteFilter } from "../AutoCompleteFilter";
import get from "lodash/get";

export const handleTagColumn = (TableHeader, cleanAvailableTags) => {
  return cleanAvailableTags.length > 0
    ? TableHeader.map((column) => {
        if (column.name === "tags") {
          return {
            ...column,
            options: {
              ...column.options,
              filterOptions: {
                ...column.options.filterOptions,
                names: cleanAvailableTags,
              },
            },
          };
        }
        return column;
      })
    : TableHeader.map((column) => {
        if (column.name === "tags") {
          return {
            ...column,
            options: {
              ...column.options,
              filter: false,
            },
          };
        }
        return column;
      });
};

export const handleCustomFilterColumns = (TableHeader, filterObject) => {
  return filterObject && Object.keys(filterObject)?.length > 0
    ? TableHeader.map((column) => {
        if (Object.keys(filterObject).includes(column.name)) {
          return {
            ...column,
            options: {
              ...column.options,
              filterOptions: {
                ...column.options.filterOptions,
                names: filterObject[column.name]?.map((el) => el._id),
              },
            },
          };
        }
        return column;
      })
    : TableHeader;
};

const setColumnDisplayAndFilter = (TableHeader, selectedGridView, column) => {
  if (selectedGridView?.columns) {
    const col = selectedGridView.columns.find(col => col.name === column.name)
    if (col && col.display) {
      column.options.display = true;
      if (column.esKey && !column.noFilter) {
        column.options.filter = true;
      }
    } else if(column.name !== ' ') {
      column.options.display = false;
      column.options.filter = false;
    }
  } else {
    if (
      TableHeader.find((col) => col.name === column.name).options.display !==
      false
    ) {
      column.options.display = true;
      if (column.esKey && !column.noFilter) {
        column.options.filter = true;
      }
    } else {
      column.options.display = false;
      column.options.filter = false;
    }
  }
};

export const setColumnsData = (
  TableHeader,
  filters,
  columns,
  setColumns,
  setFilters,
  query
) => {
  columns.forEach((column, index) => {
    if (column?.options?.filter) {
      column.options = {
        ...column.options,
        filter: true,
        filterType: "custom",
        filterList: filters[index],
        filterOptions: {
          display: (filterList, onChange, index, column) => {
            column.filterKey = TableHeader.find(
              (el) => el.name === column.name
            )?.esKey;
            return (
              <AutoCompleteFilter
                filterList={filterList}
                column={column}
                index={index}
                onChange={onChange}
                query={query}
              />
            );
          },
        },
        onFilterChange: (columnChanged, filterList) => {
          setFilters(filterList);
        },
      };
    }
  });
  setColumns(columns);
};

export const handleSelectedGridChange = (
  TableHeader,
  selectedGridView,
  columns,
  isGridChanged = false
) => {
  if (selectedGridView?.filters) {
    columns.forEach((column, index) => {
      setColumnDisplayAndFilter(TableHeader, selectedGridView, column);
      if(isGridChanged){
        const value = get(
          selectedGridView?.filters?.find((filter) => {
            return JSON.stringify(filter.field) === JSON.stringify(column.esKey);
          }),
          "value",
          ""
        );
        let filterList = [];
        if (value) {
          filterList = [value];
        }
        if (column?.options?.filter) {
          column.options.filterList = filterList;
        }
      }
    });
  } else {
    columns.forEach((column, index) => {
      setColumnDisplayAndFilter(TableHeader, selectedGridView, column);
      if(isGridChanged){
        if (column.options) {
          column.options.filterList = [];
        }
      }
    });
  }
  return columns;
};

export const HeaderComponent = ({
  Icon,
  label,
  selectedGridView = { 
    type: "Default"
  },
  setShowViewModal,
  showViewModal,
  setShowSaveAsNew,
  selectedFilters,
  updateGridView,
  columns,
}) => {
  const [showIcon, setShowIcon] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center", justifyContent: "left" }}
    >
      <IconButton onClick={() => setShowViewModal(!showViewModal)}>
        <Icon />
      </IconButton>

      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Typography
          style={{
            marginLeft: "10px",
            fontSize: "16px",
          }}
          color="inherit"
        >
          {label}
        </Typography>
        <div>
          <div
            style={{
              display: "flex",
              color: "#18AADD",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={(event) => handleClick(event)}
            onMouseOver={() => setShowIcon(true)}
            onMouseLeave={() => setShowIcon(false)}
          >
            <Typography>
              <span>{selectedGridView.name}</span>
            </Typography>
            <span
              style={{
                height: "0px",
                color: "#18AADD",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              {showIcon && <ExpandMoreIcon />}
            </span>
          </div>
          <Menu
            style={{ zIndex: "1305" }}
            id="menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MenuItem
              style={{ width: "250px" }}
              onClick={() => {
                handleClose();
                updateGridView({
                  variables: {
                    gridView: {
                      _id: selectedGridView._id,
                      filters: selectedFilters,
                      columns: columns.map((col) => ({ name: col.name, display: col.options.display })),
                    },
                  },
                });
              }}
              disabled={
                selectedGridView.type === "Default" ||
                selectedGridView.name === "All Contacts"
              }
            >
              Update view
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                setShowViewModal(true);
                setShowSaveAsNew(true);
              }}
            >
              Save as new view
            </MenuItem>
          </Menu>
        </div>
      </Breadcrumbs>
    </div>
  );
};

export const colorPallete = [
  {
    id: 1,
    color: "#C5C2C2",
    textColor: "black",
  },
  {
    id: 2,
    color: "#FA7668",
    textColor: "black",
  },
  {
    id: 3,
    color: "#F3936F",
    textColor: "black",
  },
  {
    id: 4,
    color: "#F4BC67",
    textColor: "black",
  },
  {
    id: 5,
    color: "#FADA6E",
    textColor: "black",
  },
  {
    id: 6,
    color: "#ADC351",
    textColor: "black",
  },
  {
    id: 7,
    color: "#569781",
    textColor: "white",
  },
  {
    id: 8,
    color: "#2B949D",
    textColor: "white",
  },
  {
    id: 9,
    color: "#A2D6D6",
    textColor: "black",
  },
  {
    id: 10,
    color: "#4072D1",
    textColor: "white",
  },
  {
    id: 11,
    color: "#9190E3",
    textColor: "white",
  },
  {
    id: 12,
    color: "#B084C3",
    textColor: "white",
  },
  {
    id: 13,
    color: "#F7BFF1",
    textColor: "black",
  },
  {
    id: 14,
    color: "#EC8AB2",
    textColor: "white",
  },
  {
    id: 15,
    color: "#FCA6A0",
    textColor: "black",
  },
  {
    id: 16,
    color: "#6D6E6F",
    textColor: "white",
  },
];

