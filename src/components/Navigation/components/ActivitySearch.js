import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";

import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { GETALLACTIVITIESFORSEARCH } from "../../../graphQL/useQueryGetAllActivities";
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

  activitySearchField: {
    color: "#fff",

    "& .MuiOutlinedInput-input": {
      color: "#ffffff",
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

const ActivitySearch = () => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);

  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectActivity = (id) => {
    setStateApp((stateApp) => ({
      ...stateApp,
      activityDialog: id ? true : false,
      selectedActivityId: id || null,
    }));
  };

  const [
    getAllActivitiesForSearch,
    {
      data: activitiesData,
      loading: activitiesLoading,
      error: activitiesError,
    },
  ] = useLazyQuery(GETALLACTIVITIESFORSEARCH);

  useEffect(() => {
    getAllActivitiesForSearch();
  }, []);

  useEffect(() => {
    if (activitiesData) {
      setActivities(activitiesData?.activities);
    }
  }, [activitiesData]);

  return (
    <>
      <Autocomplete
        className={classes.search}
        style={{
          margin: 0,
        }}
        options={activities}
        onChange={(e, act) => {
          handleSelectActivity(act?._id);
        }}
        disableClearable={false}
        forcePopupIcon
        popupIcon={<ArrowDropDownIcon htmlColor="#fff" />}
        closeIcon={<ClearIcon htmlColor="#fff" />}
        getOptionLabel={(option) => option.name}
        renderOption={(option) => {
          return (
            <Grid container spacing={0}>
              <Grid container item xs={12} alignItems="center">
                <Grid item xs>
                  <span style={{ fontWeight: 400 }}>{option.name}</span>

                  <Typography variant="body2" color="textSecondary">
                    {option.type}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          );
        }}
        renderInput={(params) => (
          <TextField
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              margin: 0,
            }}
            className={classes.activitySearchField}
            margin="dense"
            {...params}
            variant="outlined"
            placeholder="Search for activities"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment>
                  <IconButton size="small">
                    <SearchIcon htmlColor="#fff" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </>
  );
};

export default ActivitySearch;
