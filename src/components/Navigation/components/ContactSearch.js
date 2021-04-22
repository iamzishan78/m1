import React, { useState, useContext } from "react";
import {
  InputAdornment,
  TextField,
  IconButton,
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    marginRight: theme.spacing(2),
    marginLeft: 5,
    width: "34%",
    transition: "width 0.5s",
    [theme.breakpoints.up("sm")]: {
      marginLeft: 5,
    },
  },

  toggleBtn: {
    borderRadius: 5,
    color: "#FFFFFF",
    transition: "200ms all",
    "&:hover": {
      backgroundColor: "#1CB6DA44",
    },
  },

  activeBtn: {
    color: "#1CB6DA",
  },

  contactSearchField: {
    color: "#fff",

    "& .MuiInputBase-root": {
      paddingRight: "6px !important",
      paddingLeft: "6px !important",
    },

    "& .MuiOutlinedInput-input": {
      color: "#ffffff",
      paddingLeft: "7px !important",
      "&::placeholder": {
        color: "##ffffffc9",
        textDecoration: "bold",
      },
      "&:-ms-input-placeholder": {
        color: "##ffffffc9",
      },
      "&::-ms-input-placeholder": {
        color: "##ffffffc9",
      },
    },
  },
}));

const ContactSearch = () => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);

  return (
    <div className={classes.search}>
      <TextField
        onChange={(e) => {
          setTimeout(() =>{
            setStateApp((stateApp) => ({
              ...stateApp,
              contactSearchQuery: e.target.value,
              isContactSearching: true
            }));
          }, 500)
        }}
        style={{
          margin: 0,
          width: '100%'
        }}
        className={classes.contactSearchField}
        margin="dense"
        variant="outlined"
        placeholder="Search for contact"
        InputProps={{
          startAdornment: (
            <InputAdornment>
              <IconButton size="small">
                <SearchIcon htmlColor="#fff" />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </div>
  );
};

export default ContactSearch;
