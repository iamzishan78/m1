import React, { useState, Fragment } from "react";
import { IconButton, Menu, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { makeStyles } from "@material-ui/core/styles";

import {
  getBasicInfoContent,
  getBasicInfoExpContent,
} from "components/ContactDetailedInfo/helper";

const useStyles = makeStyles((theme) => ({
    menuItem:{
        padding: "7px 20px",
        fontSize: "15px",
        cursor: "pointer",
    },
    mergeIcon: {
        position: "absolute",
        right: "19px"
    },
    pencilIcon: {
        fontSize: "22px",
      },
  }));
  

function CopyPurchaseInfo({ contactId, content }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const fields = { ...getBasicInfoContent(), ...getBasicInfoExpContent() };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Tooltip title={"Copy Purchased data"} placement="top">
        <IconButton
          size="small"
          className={classes.mergeIcon}
          onClick={(e) => {
            e.preventDefault();
            handleClick(e);
          }}
        >
          <MoreVertIcon
            id="mergeTypeIcon"
            className={classes.pencilIcon}
            aria-controls={contactId}
            aria-haspopup="true"
          />
        </IconButton>
      </Tooltip>
      <Menu
        id={contactId}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <TextField
          type="text"
          className={classes.menuItem}
          placeholder="Search contact field"
          value={search}
          onChange={(e) => {
            e.stopPropagation();
            setSearch(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <SearchIcon htmlColor="#757575" />
                </InputAdornment>
              </>
            ),
          }}
        />
        {Object.entries(fields).map(([key, row]) => {
          return key.toLowerCase().includes(search.toLowerCase()) ? (
            <div
              className={classes.menuItem}
              onClick={(e) => {
                  console.log('Data', content, key, row)
                // setSelectedField()
                handleClose();
              }}
            >
              {key}
            </div>
          ) : (
              <></>
          );
        })}
      </Menu>
    </Fragment>
  );
}

export default CopyPurchaseInfo;
