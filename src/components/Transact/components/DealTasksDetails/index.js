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
  cardContent: {
    padding: 0,
    overflowY: "overlay",
    maxHeight: "79vh",
  },
}));

function DealTasksDetails({ users, activeDeal, dealSettings, user, ...rest }) {
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
    let totalSubtasks = 0,
      completedSubtasks = 0;
    dealSettings.forEach((setting) => {
      completedSubtasks += setting.tasks.filter((t) => t.isCompleted).length;
      totalSubtasks += setting.tasks.length;
    });
    if (totalSubtasks === 0) return 0;
    let overallProgress = (completedSubtasks / totalSubtasks) * 100;
    overallProgress = Number.isInteger(overallProgress) ? overallProgress : overallProgress.toFixed(2);
    return overallProgress;
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
              extendedTaskIndex={extendedTaskIndex}
              user={user}
              users={users}
              activeDeal={activeDeal}
              {...rest}
            />
          </div>
        ))}
      </CardContent>
    </div>
  );
}

export default DealTasksDetails;
