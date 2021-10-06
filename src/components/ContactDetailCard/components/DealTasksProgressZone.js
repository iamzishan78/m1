import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TransactContext } from "components/Transact/TransactContext";
import { AppContext } from "AppContext";
import { CardActions, Grid, IconButton, CardContent, Divider, Popover, List, ListItem, ListItemText, Badge } from "@material-ui/core";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import ArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CommentIcon from "@material-ui/icons/ChatBubbleOutline";
import ProgressBar from "components/Shared/ui/ProgressBar";
import CustomAvatar from "components/Shared/ui/CustomAvatar";

const useStyles = makeStyles((theme) => ({
  root: {},
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
    fontWeight: "100",
    minHeight: "40px",
  },
  laneActionsGrid: {
    "& .MuiIconButton-root": {
      width: "35px",
      height: "35px",
    },
  },
  avatarButton: {
    "& .MuiIconButton-label": {
      width: "auto",
      "& span": {
        paddingTop: "6px",
      },
    },
  },
  commentButton: {
    "&:hover": {
      color: "transparent !important",
      backgroundColor: "transparent !important",
    },
  },
}));

export default function LaneProgressZone(props) {
  const classes = useStyles();
  const { dealSettings, users, activeDeal, updateStageDealDescriptor, pipelineId } = props;

  // Transact Context
  const [, setStateTransact] = useContext(TransactContext);
  const [, setStateApp] = useContext(AppContext);
  const [showNext, setShowNext] = useState(-1);

  const handleAssignee = (approver, setting) => {
    const descriptor = {
      descriptorObject: activeDeal._id,
      relatedObject: setting._id,
      approver,
      descriptorType: "Deal",
      relatedObjectType: "Stage",
      isDeleted: false,
      pipeline: pipelineId,
    };
    updateStageDealDescriptor({
      variables: { descriptor },
      refetchQueries: ["dealSettings"],
      awaitRefetchQueries: true,
    });
  };

  return (
    <div className={classes.root} variant="outlined">
      <CardActions style={{ padding: "23px 0px 0px 0px", borderBottom: "1px solid lightgray" }}>
        <Grid item xs={12} style={{ minHeight: "35px" }}>
          <h4 style={{ margin: "0 0 8px 0", float: "left" }}>Overall Progress</h4>
          <h4 className={classes.details} onClick={() => setStateApp((stateApp) => ({ ...stateApp, transactBarView: "Task Progress" }))}>
            Details
          </h4>
        </Grid>
      </CardActions>
      <CardContent style={{ padding: 0 }}>
        <div className={classes.laneProgressSection}>
          {/* Show two recent docs */}

          {dealSettings.map((settings, index) => {
            const approver = users.find((user) => user?.value === settings.stageDealDescriptor.approver);
            return (
              <div onMouseEnter={() => setShowNext(index)} onMouseLeave={() => setShowNext(-1)}>
                <Grid key={index} container direction="row" alignItems="center" justify="space-between" className={classes.flowLane}>
                  <Grid item xs={6} style={{ fontWeight: "100" }}>
                    {settings.stageName}
                  </Grid>
                  <Grid item xs={4} style={{}}>
                    <div style={{ float: "right", minWidth: "135px" }}>
                      <ProgressBar value={settings.progress} isNumeric />
                    </div>
                  </Grid>
                  <Grid item xs={2} className={classes.laneActionsGrid}>
                    <div style={{ float: "right" }}>
                      <PopupState variant="popover" popupId="demo-popup-popover-zone">
                        {(popupState) => (
                          <>
                            <IconButton className={classes.avatarButton} {...bindTrigger(popupState)}>
                              {settings.stageDealDescriptor.approver && users.length ? (
                                <CustomAvatar email={approver?.email} text={approver?.text.toString()} />
                              ) : (
                                <AccountCircle fontSize="default" />
                              )}
                            </IconButton>
                            <Popover
                              {...bindPopover(popupState)}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                              }}
                            >
                              <List style={{ maxHeight: 450 }}>
                                {users.map((user) => (
                                  <ListItem
                                    button
                                    onClick={() => {
                                      handleAssignee(user.value, settings);
                                      popupState.close();
                                    }}
                                  >
                                    <ListItemText primary={user.text} />
                                  </ListItem>
                                ))}
                              </List>
                            </Popover>
                          </>
                        )}
                      </PopupState>
                      {/* <ProgressBar value={settings.progress} isNumeric /> */}
                      <IconButton
                        className={classes.commentButton}
                        onClick={() => {
                          setStateTransact((state) => ({ ...state, selectedTask: settings }));
                          setStateApp((stateApp) => ({ ...stateApp, transactBarView: "Task Progress" }));
                        }}
                      >
                        <Badge
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          color="secondary"
                          opacity="1"
                          badgeContent={settings.stageDealDescriptor.comment ? 1 : 0}
                        >
                          <CommentIcon fontSize="small" />
                        </Badge>
                        {showNext === index && <ArrowRightIcon fontSize="small" />}
                      </IconButton>
                    </div>
                  </Grid>
                </Grid>
                <Divider style={{ backgroundColor: "#eeeeee" }} />
              </div>
            );
          })}
          <div style={{ margin: "10px 0px 10px 0px" }}>
            {/* <Button size="small" style={{ color: "grey" }}>
              + Add New
            </Button> */}
          </div>
        </div>
      </CardContent>
    </div>
  );
}
