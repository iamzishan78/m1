import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import { Grid, InputAdornment, TextField, IconButton } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import List from "@material-ui/icons/List";
import GridOn from "@material-ui/icons/GridOn";
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
    "&:hover": {
      backgroundColor: "#1CB6DAdd",
    },
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
  // const [searchQuery, setSearchQuery] = useState("");
  // const [getTransactionData, { data: tData, tLoading }] = useLazyQuery(
  //   TRANSACTIONDATA
  // );

  // const [
  //   getPipelines,
  //   { loading: loadingPipelines, data: pipelinesData },
  // ] = useLazyQuery(GETPIPELINES);

  // useEffect(() => {
  //   getPipelines();
  // }, []);

  // useEffect(() => {
  //   console.log("PIPELINES DATA: ", pipelinesData);
  // }, [pipelinesData]);

  const { pipeToShow } = useSelector(({ Flow }) => Flow);

  useEffect(() => {
    if (pipeToShow) {
      let deals = [];
      pipeToShow.lanes &&
        pipeToShow.lanes.forEach((lane) => {
          lane.cards &&
            lane.cards.forEach((card) => {
              deals.push(card);
            });
        });

      setAllDeals(deals);
    }
  }, [pipeToShow]);

  // console.log("PIPE TO SHOW: ", pipeToShow);

  // useEffect(() => {
  //   if (stateApp.user && stateApp.user.mongoId) {
  //     getTransactionData({
  //       variables: {
  //         userId: stateApp.user.mongoId,
  //       },
  //     });
  //   }
  // }, [stateApp.user]);

  // useEffect(() => {
  //   if (tData) {
  //     console.log("TDATA: ", tData);
  //     let deals = [];
  //     tData &&
  //       tData.transactionData.forEach((pipeline) => {
  //         pipeline &&
  //           pipeline.allData &&
  //           pipeline.allData.lanes &&
  //           pipeline.allData.lanes.forEach((lane) => {
  //             lane &&
  //               lane.cards &&
  //               lane.cards.forEach((card) => {
  //                 deals.push(card);
  //               });
  //           });
  //       });
  //     setAllDeals(deals);
  //   }
  // }, [tData]);

  // useEffect(() => {
  //   if (allDeals) console.log("ALL DEALS: ", allDeals);
  // }, [allDeals]);

  const handleSelectDeal = (cardId, laneId, metadata) => {
    if (!cardId || !laneId || !metadata) return;

    setStateApp((stateApp) => ({
      ...stateApp,
      dealDialog: true,
      activeDeal: {
        cardId,
        laneId,
        ...metadata,
      },
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
          console.log("Selected: ", deal);
          deal &&
            deal.id &&
            deal.laneId &&
            handleSelectDeal(deal.id, deal.laneId, deal.metadata);
        }}
        disableClearable={false}
        forcePopupIcon
        popupIcon={<ArrowDropDownIcon htmlColor="#fff" />}
        closeIcon={<ClearIcon htmlColor="#fff" />}
        getOptionLabel={(option) => option.title}
        renderOption={(option) => {
          return (
            <Grid container spacing={0}>
              <Grid container item xs={12} alignItems="center">
                <Grid item xs>
                  <span style={{ fontWeight: 400 }}>{option.title}</span>

                  <Typography variant="body2" color="textSecondary">
                    {option.description}
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
                  <IconButton
                    size="small"
                    htmlColor="#fff"
                    className={`${classes.toggleBtn} ${
                      stateApp.dealDisplayType === "table" && classes.activeBtn
                    }`}
                    onClick={() => setDealDisplayType("table")}
                  >
                    <List />
                  </IconButton>
                  <IconButton
                    size="small"
                    htmlColor="#fff"
                    className={`${classes.toggleBtn} ${
                      stateApp.dealDisplayType === "board" && classes.activeBtn
                    }`}
                    onClick={() => setDealDisplayType("board")}
                  >
                    <GridOn />
                  </IconButton>
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
