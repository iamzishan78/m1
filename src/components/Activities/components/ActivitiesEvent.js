import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CallIcon from "@material-ui/icons/Call";
import MeetingIcon from "@material-ui/icons/Group";
import TaskIcon from "@material-ui/icons/WatchLater";
import DeadlineIcon from "@material-ui/icons/Flag";
import EmailIcon from "@material-ui/icons/Email";
import DefaultIcon from "@material-ui/icons/Event";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 4,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: "100%",
  },
  type: {
    margin: 0,
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  time: {
    fontSize: 10,
  },
  icon: {
    fontSize: 12,
    marginRight: 8,
  },
}));

const ActivitiesEvent = ({ event }) => {
  const classes = useStyles();

  const startTime = `${event.start.getHours()}:${
    event.start.getMinutes() < 10
      ? `0${event.start.getMinutes()}`
      : event.start.getMinutes()
  }`;
  const endTime = `${event.end.getHours()}:${
    event.end.getMinutes() < 10
      ? `0${event.end.getMinutes()}`
      : event.end.getMinutes()
  }`;

  let icon = <DefaultIcon />;

  switch (event.type) {
    case "call":
      icon = <CallIcon />;
      break;
    case "meeting":
      icon = <MeetingIcon />;
      break;
    case "task":
      icon = <TaskIcon />;
      break;
    case "deadline":
      icon = <DeadlineIcon />;
      break;
    case "email":
      icon = <EmailIcon />;
      break;
  }

  return (
    <div className={classes.root}>
      <div className={classes.icon}>{icon}</div>
      <div>
        <h6 className={classes.type}>{event.type}</h6>
        <span className={classes.time}>{startTime + " - " + endTime}</span>
      </div>
    </div>
  );
};

export default ActivitiesEvent;
