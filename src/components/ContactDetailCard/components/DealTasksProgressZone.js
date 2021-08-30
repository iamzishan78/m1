import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardActions from "@material-ui/core/CardActions";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import ProgressBar from "../../Shared/ui/ProgressBar";

const useStyles = makeStyles((theme) => ({
  root: {
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
    minHeight: "40px",
  },
  laneActionsGrid: {
    "& .MuiIconButton-root": {
      width: "35px",
      height: "35px",
    },
  },
  newFlowLane: {
    color: "darkgray",
    margin: "10px 0px 20px 0px",
    cursor: "pointer",
  },
  avatar: {
    "& .MuiAvatar-root": {
      width: "18px !important",
      height: "18px !important",
      fontSize: "0.60rem !important",
    },
  },
}));

export default function LaneProgressZone(props) {
  const classes = useStyles();
  const { toggleProgressDetail, dealSettings, users } = props;

  return (
    <div className={classes.root} variant="outlined">
      <CardActions style={{ padding: "23px 0px 0px 0px", borderBottom: "1px solid lightgray" }}>
        <Grid item xs={12} style={{ minHeight: "35px" }}>
          <h4 style={{ margin: "0 0 8px 0", float: "left" }}>Overall Progress</h4>
          <h4 className={classes.details} onClick={() => toggleProgressDetail(true)}>
            Details
          </h4>
        </Grid>
      </CardActions>
      <CardContent style={{ padding: 0 }}>
        <div className={classes.laneProgressSection}>
          {/* Show two recent docs */}

          {dealSettings.map((stage, index) => (
            <Fragment>
              <Grid key={index} container direction="row" justify="space-between" alignItems="center" className={classes.flowLane}>
                <Grid item style={{ width: "135px", fontWeight: "normal" }}>
                  {stage.stageName}
                </Grid>
                <Grid item style={{ minWidth: "135px" }}>
                  <ProgressBar value={stage.progress} isNumeric />
                </Grid>
                <Grid item className={classes.laneActionsGrid} style={{ display: "flex" }}>
                  <IconButton className={classes.avatar}>
                    {stage.stageDealDescriptor.approver ? (
                      <Avatar className={classes.dealOwnerAvatar}>
                        {users.find((user) => user?.value === stage.stageDealDescriptor.approver)
                          ? users
                            .find((user) => user?.value === stage.stageDealDescriptor.approver)
                            .text.toString()
                            .toUpperCase()
                            .split(" ").length > 1
                            ? users
                              .find((user) => user?.value === stage.stageDealDescriptor.approver)
                              .text.toString()
                              .toUpperCase()
                              .split(" ")[0][0] +
                            "" +
                            users
                              .find((user) => user?.value === stage.stageDealDescriptor.approver)
                              .text.toString()
                              .toUpperCase()
                              .split(" ")[1][0]
                            : "AO"
                          : "AO"}
                      </Avatar>
                    ) : (
                      <AccountCircle fontSize="small" />
                    )}
                  </IconButton>
                  <IconButton>
                    <ChatBubbleOutlineIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
              <Divider />
            </Fragment>
          ))}
          <div style={{ margin: "10px 0px 10px 0px" }}>
            <Button size="small" style={{ color: "grey" }}>
              + Add New
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
