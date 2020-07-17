import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../../AppContext";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiInput-root": {
      height: "50px",
      paddingRight: "8px",
    },
    "& > div": {
      width: "100%",
    },
  },
  inputAdornment: {
    padding: "0 8px",
    cursor: "context-menu",
    height: "100%",
  },
}));

export default function MapGridCardSearch(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField
        id="mapGridCardSearch-basic"
        type="search"
        InputProps={{
          startAdornment: (
            <InputAdornment className={classes.inputAdornment} position="start">
              <SearchIcon htmlColor="#757575" />
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}
