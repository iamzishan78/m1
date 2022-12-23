import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  InputAdornment,
  TextField,
  IconButton,
  Tooltip,
  Grid,
  Typography,
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import { useSelector } from "react-redux";

import { AppContext } from "AppContext";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import { debounce } from "lodash";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    marginRight: theme.spacing(2),
    width: "35%",
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

const AnalyticsSearch = () => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [search, setSearch] = useState(stateApp.landAnalyticsSearchQuery);

  useEffect(() => {
    return () => {
      setStateApp((stateApp) => ({
        ...stateApp,
        landAnalyticsSearchQuery: "",
      }));
    }
  }, []);

  useEffect(() => {
    setSearch(stateApp.landAnalyticsSearchQuery);
  }, [stateApp.landAnalyticsSearchQuery]);


  const handleChange = React.useMemo(
    () =>
      debounce((value) => {
        setStateApp((stateApp) => ({
          ...stateApp,
          landAnalyticsSearchQuery: value,
        }));
      }, 500),
    []
  );

  return (
    <Grid
      container
      direction="row"
      display="flex"
      justify="space-between"
      alignItems="center"
      style={{
        marginLeft: "433px",
      }}
    >
      <Grid item md={8}>
        <Grid
          container
          direction="row"
          display="flex"
          justify="flex-start"
          alignItems="center"
        >
            <Grid item md={2.5}>
              <Typography
                variant="h5"
                style={{ color: "black", fontWeight: "bold", marginRight: "20px" }}
              >
                Land Analytics
              </Typography>
            </Grid>
          <Grid item md={6}>
            <TextField
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                handleChange(e.target.value);
              }}
              style={{
                margin: 0,
                width: "100%",
              }}
              className={classes.contactSearchField}
              margin="dense"
              variant="outlined"
              placeholder="Search"
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
                        id="crossButton"
                        size="small"
                        htmlColor="#fff"
                        className={`${classes.toggleBtn} ${stateApp.activityDisplayType === "table" &&
                          classes.activeBtn
                          }`}
                        onClick={() => {
                          setSearch("")
                          setStateApp((stateApp) => ({
                            ...stateApp,
                            landAnalyticsSearchQuery: "",
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
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AnalyticsSearch;
