import React, { useState } from "react";
import { Breadcrumbs, Typography, IconButton } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Menu, MenuItem } from "@material-ui/core";

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

export const HeaderComponent = ({
  Icon,
  label,
  selectedGridView,
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
                      columns: columns
                        .filter((col) => col.options.display)
                        .map((col) => col.name),
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
