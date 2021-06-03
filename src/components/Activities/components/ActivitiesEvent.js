import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CallIcon from "@material-ui/icons/Call";
import MeetingIcon from "@material-ui/icons/Group";
import TaskIcon from "@material-ui/icons/WatchLater";
import DeadlineIcon from "@material-ui/icons/Flag";
import EmailIcon from "@material-ui/icons/Email";
import DefaultIcon from "@material-ui/icons/Event";
import ContactMailIcon from '@material-ui/icons/ContactMail';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "8px 12px",
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
    whiteSpace: "nowrap",
    overflow: "visible",
    "&::-webkit-scrollbar": {
      width: "0.75em",
      height: "0.75em",
    },
    // "&:hover::-webkit-scrollbar": {
    //     width: "1.0em",
    // },
    // "&::-webkit-scrollbar-track": {
    //     "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    // },
    textOverflow: "ellipsis",
    height: 18,
    maxWidth: "100%",
  },
  time: {
    fontSize: 10,
  },
  icon: {
    fontSize: 12,
    marginRight: "8px !important",
  },
  isClosed: {
    backgroundColor: "#d9d9d9",
    color: "#555",
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
    case "mailer":
      icon = <ContactMailIcon />;
      break;
  }

  return (
    <div className={clsx(classes.root, event.isClosed && classes.isClosed)}>
      <div className={classes.icon}>{icon}</div>
      <div>
        <h6 className={classes.type}>{event.name}</h6>
        <span className={classes.time}>{startTime + " - " + endTime}</span>
      </div>
    </div>
  );
};

export default ActivitiesEvent;
