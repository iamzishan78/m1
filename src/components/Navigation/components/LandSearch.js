import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { InputAdornment, TextField, IconButton, Tooltip } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

import { AppContext } from "../../../AppContext";
import { debounce } from "lodash";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    marginRight: theme.spacing(2),
    width: "100%",
    transition: "width 0.5s",
    [theme.breakpoints.up("sm")]: {
      marginLeft: 5,
    },
  },

  toggleBtn: {
    borderRadius: 5,
    color: "grey",
    transition: "200ms all",
    "&:hover": {
      backgroundColor: "#1CB6DA44",
    },
  },

  activeBtn: {
    color: "#1CB6DA",
  },

  contactSearchField: {
    color: "grey",

    "& .MuiInputBase-root": {
      paddingRight: "6px !important",
      paddingLeft: "6px !important",
    },

    "& .MuiOutlinedInput-input": {
      color: "#grey",
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

const LandSearch = () => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [search, setSearch] = useState("");
  const { activeModule } = useSelector(({ common }) => common);

  useEffect(() => {
    return () => {
      setStateApp((stateApp) => ({
        ...stateApp,
        landSearchQuery: "",
        // isLandSearching: true,
      }));
    }
  }, []);

  useEffect(() => {
    setSearch(stateApp.landSearchQuery)
  }, [stateApp.landSearchQuery]);

  const handleChange = React.useMemo(
    () =>
      debounce((value) => {
        setStateApp((stateApp) => ({
          ...stateApp,
          landSearchQuery: value,
        }));
      }, 500),
    []
  );

  return (
    <div className={classes.search}>
      <TextField
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          handleChange(e.target.value);
        }}
        style={{ margin: 0, width: "100%" }}
        className={classes.contactSearchField}
        margin="dense"
        variant="outlined"
        placeholder={`Search for ${activeModule?.title?.toLowerCase()} by name or attribute`}
        InputProps={{
          startAdornment: (
            <InputAdornment>
              <IconButton size="small">
                <SearchIcon htmlColor="grey" />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <>
              <Tooltip title="Clear">
                <IconButton
                  size="small"
                  htmlColor="#fff"
                  className={`${classes.toggleBtn} ${stateApp.activityDisplayType === "table" && classes.activeBtn}`}
                  onClick={() => {
                    setSearch("");
                    setStateApp((stateApp) => ({
                      ...stateApp,
                      landSearchQuery: "",
                    }));
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </>
          ),
        }}
      />
    </div>
  );
};

export default LandSearch;
