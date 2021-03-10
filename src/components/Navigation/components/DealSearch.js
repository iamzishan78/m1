import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  Grid,
  InputAdornment,
  TextField,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import List from "@material-ui/icons/List";
import GridOn from "@material-ui/icons/GridOn";
import TableChartIcon from "@material-ui/icons/TableChart";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ButtonGroup from "@material-ui/core/ButtonGroup";

// import { TRANSACTIONDATA } from "../../../graphQL/useQueryTransactionData";
// import { GETPIPELINES } from "../../../graphQL/useQueryPipelines";
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
  const { pipeToShow, pipeToShowTab } = useSelector(({ Flow }) => Flow);

  useEffect(() => {
    if (pipeToShowTab) setAllDeals(pipeToShowTab);
    else setAllDeals([]);
  }, [pipeToShowTab]);

  const handleSelectDeal = (deal) => {
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
        style={{
          margin: 0,
        }}
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

                  <Typography variant="body2" color="textSecondary">
                    {option.notes}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          );
        }}
        renderInput={(params) => (
          <TextField
            style={{
              margin: 0,
            }}
            className={classes.activitySearchField}
            margin="dense"
            {...params}
            variant="outlined"
            placeholder="Search for deals"
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
                  <Tooltip title="List View">
                    <IconButton
                      size="small"
                      htmlColor="#fff"
                      className={`${classes.toggleBtn} ${
                        stateApp.dealDisplayType === "table" &&
                        classes.activeBtn
                      }`}
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
                      className={`${classes.toggleBtn} ${
                        stateApp.dealDisplayType === "board" &&
                        classes.activeBtn
                      }`}
                      onClick={() => setDealDisplayType("board")}
                    >
                      <TableChartIcon />
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
              ),
            }}
          />
        )}
      />
    </>
  );
};

export default DealSearch;
