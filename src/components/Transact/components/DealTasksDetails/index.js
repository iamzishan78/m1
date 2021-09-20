import React, { useState, useEffect, useRef, useContext } from "react";

import { TransactContext } from "components/Transact/TransactContext";
import { makeStyles } from "@material-ui/core/styles";
import {
  // Menu,
  // MenuItem,
  CardActions,
  CardContent,
  Grid,
} from "@material-ui/core";
// import ArrowDown from "@material-ui/icons/ArrowDropDown";
import ProgressBar from "../../../Shared/ui/ProgressBar";
import DealStageDetail from "components/Transact/components/DealTasksDetails/DealStageDetail";

const useStyles = makeStyles((theme) => ({
  root: {},
  newLaneProgress: {
    margin: "10px 0px 10px 0px",
  },
  newFlowLane: {
    cursor: "pointer",
  },
  laneName: {
    fontWeight: "bold",
    margin: "10px 0px 10px 0px",
    fontSize: "large",
  },
  laneDetail: {},
  laneDetailRow: {
    margin: "5px 0px 5px 0px",
    display: "flex",
    alignItems: "center",
    "& .MuiTypography-body2": {
      minWidth: "80px !important",
    },
  },
  inputFieldOwner: {
    marginBottom: "7px",
    width: "200px",
    backgroundColor: "#efefef",
  },
  dealOwnerRoot: {
    border: "1px solid #EBEBEB",
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      paddingLeft: 26,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "&:hover.MuiOutlinedInput-root": {
      backgroundColor: "#EBEBEB",
    },
    "&:hover .MuiAutocomplete-popupIndicator": {
      visibility: "visible",
      padding: "2px",
      marginRight: "-2px",
    },
  },
  dealOwnerRootFocused: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid black",
    },
  },
  dealOwnerLabel: {
    marginLeft: 4,
  },
  subTaskRoot: {
    width: "100%",
    height: "40px",
  },
  subTaskLeftGrid: {
    "& .MuiFormControlLabel-root": {
      marginRight: 0,
    },
  },
  subTaskRightGrid: {
    alignItems: "right",
    "& .MuiIconButton-root": {
      height: "25px",
      width: "25px",
      margin: "5px",
    },
    "& .MuiTextField-root": {
      marginTop: "2px",
      marginBottom: 0,
      width: "132px",
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none !important",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none !important",
    },
    "& .MuiFormHelperText-root": {
      display: "none !important",
    },
  },
  addSubTaskButton: {
    marginBottom: "10px",
  },
  avatarButton: {
    "& .MuiIconButton-label": {
      width: "auto",
      "& span": {
        paddingTop: "6px",
      },
    },
  },
  notes: {
    backgroundColor: "#FFFCDC",
    display: "block",
    width: "100%",
    marginTop: 25,

    "& .MuiOutlinedInput-root": {
      width: "100%",
      "& fieldset": {
        borderColor: "white",
      },
    },
  },
  accordion: {
    minHeight: "35px !important",
    "& .MuiPaper-elevation1": {
      boxShadow: "none !important",
    },
    "& .MuiAccordion-root": {
      position: "inherit !important",
      minHeight: "72px !important",
      borderBottomRightRadius: "0px !important",
      borderBottomLeftRadius: "0px !important",
    },
  },
  accordionColored: {
    // "& .MuiAccordion-root": {
    backgroundColor: "aliceblue",
    // },
  },
  accordionColorReset: {
    backgroundColor: "transparent",
    webkitTransition: "background-color 1000ms linear",
    msTransition: "background-color 1000ms linear",
    transition: "background-color 1000ms linear",
  },
  cardContent: {
    padding: 0,
    overflowY: "overlay",
    maxHeight: "82vh",
  },
}));

function DealTasksDetails({ users, activeDeal, dealSettings, user }) {
  // Transact Context
  const [stateTransact, setStateTransact] = useContext(TransactContext);
  const [extendedTaskIndex] = useState(dealSettings.findIndex((ds) => ds?._id === stateTransact.selectedTask?._id) || 0);
  // const [anchorEl, setAnchorEl] = React.useState(null);

  const selectedTaskRef = useRef(null);

  const classes = useStyles();

  useEffect(() => {
    if (stateTransact.selectedTask && selectedTaskRef.current) {
      setTimeout(() => {
        selectedTaskRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      }, 100);
      setTimeout(() => {
        setStateTransact((state) => ({ ...state, selectedTask: {} }));
      }, 3000);
    }
  }, [setStateTransact, stateTransact.selectedTask]);

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const evaluateOverallProgress = () => {
    let progress = 0;
    dealSettings.forEach((setting) => {
      progress += setting.progress;
    });
    progress = ((progress / (100 * dealSettings.length)) * 100).toFixed(2);
    return progress;
  };

  return (
    <div className={classes.root}>
      <CardActions style={{ paddingBottom: 15, padding: "0px 30px" }}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item xs={8} style={{ marginBottom: "15px" }}>
            <h3 style={{ height: "8px" }}>Overall Progress</h3>
            <ProgressBar value={evaluateOverallProgress()} isNumeric />
          </Grid>
          {/* <Grid item xs={6} style={{ textAlign: "right" }}>
            <div className={classes.popOver}>
              <Button aria-controls="laneProgressMenu" aria-haspopup="true" onClick={handleClick}>
                All
                <ArrowDown />
              </Button>
              <Menu id="laneProgressMenu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleClose}>Option 1</MenuItem>
                <MenuItem onClick={handleClose}>Option 2</MenuItem>
                <MenuItem onClick={handleClose}>Option 3</MenuItem>
              </Menu>
            </div>
          </Grid> */}
          {/* <Grid item xs={12} className={classes.newLaneProgress}>
            <div className={classes.newFlowLane}>+ Add New Lane</div>
          </Grid> */}
        </Grid>
      </CardActions>
      <CardContent className={classes.cardContent}>
        {dealSettings?.map((settings, index) => (
          <div className={classes.accordion} ref={settings._id === stateTransact.selectedTask?._id ? selectedTaskRef : null}>
            <DealStageDetail
              settings={settings}
              index={index}
              stateTransact={stateTransact}
              extendedTaskIndex={extendedTaskIndex}
              user={user}
              users={users}
              activeDeal={activeDeal}
            />
          </div>
        ))}
      </CardContent>
    </div>
  );
}

export default DealTasksDetails;
