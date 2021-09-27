import React, { useState, useEffect, useContext } from "react";
import { Grid, InputAdornment, TextField, IconButton, Tooltip } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import List from "@material-ui/icons/List";
import TableChartIcon from "@material-ui/icons/TableChart";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ButtonGroup from "@material-ui/core/ButtonGroup";
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

const DealSearch = () => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [allDeals, setAllDeals] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const { pipeToShowTab } = useSelector(({ Flow }) => Flow);

  useEffect(() => {
    if (pipeToShowTab) setAllDeals(pipeToShowTab);
    else setAllDeals([]);
  }, [pipeToShowTab]);

  const handleSelectDeal = (deal) => {
    setSearchInputValue(deal.name);
    setStateApp((stateApp) => ({
      ...stateApp,
      dealDialog: true,
      activeDeal: deal,
    }));
  };

  const setDealDisplayType = (dealDisplayType) => {
    setStateApp((stateApp) => ({
      ...stateApp,
      dealDisplayType,
    }));
  };

  return (
    <>
      <Autocomplete
        className={classes.search}
        style={{ margin: 0 }}
        options={allDeals}
        onChange={(e, deal) => {
          deal && handleSelectDeal(deal);
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
                </Grid>
              </Grid>
            </Grid>
          );
        }}
        renderInput={(params) => {
          const _params = { ...params, inputProps: { ...params.inputProps, value: searchInputValue } };
          return (
            <TextField
              {..._params}
              style={{ margin: 0 }}
              className={classes.activitySearchField}
              margin="dense"
              variant="outlined"
              placeholder="Search for deals"
              onChange={(e) => setSearchInputValue(e.target.value)}
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
                  <ButtonGroup variant="text">
                    {searchInputValue && searchInputValue !== "" && (
                      <Tooltip title="Clear" placement="top">
                        <IconButton size="small" onClick={() => setSearchInputValue("")}>
                          <ClearIcon htmlColor="#fff" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="List View">
                      <IconButton
                        size="small"
                        htmlColor="#fff"
                        className={`${classes.toggleBtn} ${stateApp.dealDisplayType === "table" && classes.activeBtn}`}
                        //temporarily commenting out until list view exists
                        onClick={() => setDealDisplayType("table")}
                      >
                        <List />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Board View">
                      <IconButton
                        size="small"
                        htmlColor="#fff"
                        className={`${classes.toggleBtn} ${stateApp.dealDisplayType === "board" && classes.activeBtn}`}
                        onClick={() => setDealDisplayType("board")}
                      >
                        <TableChartIcon />
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                ),
              }}
            />
          );
        }}
      />
    </>
  );
};

export default DealSearch;
