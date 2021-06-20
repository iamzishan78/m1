import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardActions from "@material-ui/core/CardActions";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import ProgressBar from "../../Shared/ui/ProgressBar";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "#fff",
  },
  details: {
    textDecoration: "underline",
    margin: "0 0 8px 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  laneProgressSection: {
    minHeight: "50px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
  },
  flowLane: {
    fontWeight: "bold",
  },
  newFlowLane: {
    color: "darkgray",
    margin: "10px 0px 20px 0px",
    cursor: "pointer",
  },
}));

export default function LaneProgressZone(props) {
  const classes = useStyles();
  const { pipeToShow, toggleProgressDetail } = props;

  return (
    <div className={classes.root} variant="outlined">
      <CardActions style={{ padding: "23px 0px 0px 0px", borderBottom: "1px solid lightgray" }}>
        <Grid item xs={12} style={{ minHeight: "35px" }}>
          <h4 style={{ margin: "0 0 8px 0", float: "left" }}>Lane Progress</h4>
          <h4 className={classes.details} onClick={() => toggleProgressDetail(true)}>
            Details
          </h4>
        </Grid>
      </CardActions>
      <CardContent style={{ padding: 0 }}>
        <div className={classes.laneProgressSection}>
          {/* Show two recent docs */}

          {pipeToShow &&
            pipeToShow.lanes.map((lane, index) => (
              <>
                <Grid key={index} container direction="row" justify="space-between" alignItems="center" className={classes.flowLane}>
                  <Grid item style={{ width: "155px" }}>
                    {lane.title}
                  </Grid>
                  <Grid item style={{ minWidth: "100px" }}>
                    <ProgressBar value={50} isNumeric />
                  </Grid>
                  <Grid item style={{ display: "flex" }}>
                    <Grid container direction="row" justify="flex-end" alignItems="center">
                      <Grid item>
                        <IconButton>
                          <AccountCircle fontSize="medium" />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton>
                          <ChatBubbleOutlineIcon fontSize="medium" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider />
              </>
            ))}
          <div className={classes.newFlowLane}>+ Add New</div>
        </div>
      </CardContent>
    </div>
  );
}
