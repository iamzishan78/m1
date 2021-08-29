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
import debounce from "lodash/debounce";

import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import List from "@material-ui/icons/List";
import GridOn from "@material-ui/icons/GridOn";
import EventIcon from "@material-ui/icons/Event";
import ButtonGroup from "@material-ui/core/ButtonGroup";

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
    // "&:hover": {
    //   backgroundColor: "#1CB6DAdd",
    // },
  },

  activitySearchField: {
    color: "#fff",

    "& .MuiInputBase-root": {
      paddingRight: "6px !important",
    },

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
  const [nameAutValue, setNameAutValue] = useState({ name: "", _id: null });
  const [nameAutInputValue, setNameAutInputValue] = useState("");

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

  const setActivityDisplayType = (activityDisplayType) => {
    setStateApp((stateApp) => ({
      ...stateApp,
      activityDisplayType,
    }));
  };

  const onInputChange = React.useMemo(
    () =>
      debounce((event, value, reason) => {
        setNameAutInputValue(value);
      }, 500),
    []
  );


  return (
    <>
    <Autocomplete
      className={classes.search}
      style={{
        margin: 0,
      }}
      defaultValue={nameAutValue}
      value={nameAutValue}
      disableListWrap
      options={activities}
      getOptionLabel={(option) => option.name}
      getOptionSelected={(option, value) => {
        return option === value;
      }}
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
      onInputChange={onInputChange}
      onChange={(e, act) => {
        handleSelectActivity(act?._id);
        setNameAutValue(act);
      }}
      renderInput={(params) => (
        <TextField
          margin="dense"
          {...params}
          style={{
            margin: 0,
          }}
          className={classes.activitySearchField}
          placeholder="Search for activities"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment>
                <IconButton size="small">
                  <SearchIcon htmlColor="#fff" />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <>
                <ButtonGroup variant="text">
                  <Tooltip title="Clear">
                    <IconButton
                      size="small"
                      htmlColor="#fff"
                      className={`${classes.toggleBtn} ${
                        stateApp.activityDisplayType === "table" &&
                        classes.activeBtn
                      }`}
                      onClick={() => {
                        setNameAutValue({ name: "", _id: null });
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="List View">
                    <IconButton
                      size="small"
                      htmlColor="#fff"
                      className={`${classes.toggleBtn} ${
                        stateApp.activityDisplayType === "table" &&
                        classes.activeBtn
                      }`}
                      onClick={() => setActivityDisplayType("table")}
                    >
                      <List />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Calendar">
                    <IconButton
                      size="small"
                      htmlColor="#fff"
                      className={`${classes.toggleBtn} ${
                        stateApp.activityDisplayType === "calendar" &&
                        classes.activeBtn
                      }`}
                      onClick={() => setActivityDisplayType("calendar")}
                    >
                      <EventIcon />
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
              </>
            ),
          }}
          size="small"
        />
      )}
    />
    </>
  );
};

export default ActivitySearch;
