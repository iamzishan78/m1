import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import CallIcon from "@material-ui/icons/Call";
import MeetingIcon from "@material-ui/icons/Group";
import TaskIcon from "@material-ui/icons/WatchLater";
import DeadlineIcon from "@material-ui/icons/Flag";
import EmailIcon from "@material-ui/icons/Email";
import DefaultIcon from "@material-ui/icons/Event";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  summaryRoot: {
    backgroundColor: "#FCFBF2",
    padding: "20px",
    border: "2px solid #F9F8EC",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
  },
  summaryHeading: {
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: "10px",
    color: "#888887",
    fontWeight: "bold",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    gridGap: "20px",
  },
  gridItem: {
    padding: "5px",
    display: "flex",
  },
  blueIcon: {
    color: "#9ABCE7",
    backgroundColor: "#E4EFFE",
  },
  redIcon: {
    color: "#C189AE",
    backgroundColor: "#F3D5E9",
  },
  greenIcon: {
    color: "#75C2CC",
    backgroundColor: "#D8EEF1",
  },
  purpleIcon: {
    color: "#9C9AE7",
    backgroundColor: "#D7D6FB",
  },
  activityDetails: {
    marginLeft: "10px",
    display: "flex",
    flexDirection: "column",
    color: "#888887",
    alignSelf: "center",
  },
  quantity: {
    fontSize: "15px",
  },
  type: {
    fontSize: "11px",
    textTransform: "uppercase",
  },
}));

function SummarySection({ activity }) {
  const classes = useStyles();

  const typeMapping = {
    email: "email",
    call: "calls",
    deadline: "deadlines",
    task: "tasks",
    meeting: "meetings",
    mailer: "mailers sent",
  };
  const typeName = typeMapping[activity.type];

  const getIcon = (type) => {
    let color = "Icon";
    let Icon = <EmailIcon />;

    switch (type) {
      case "email":
        color = `blue${color}`;
        Icon = <EmailIcon />;
        break;
      case "task":
        color = `red${color}`;
        Icon = <TaskIcon />;
        break;
      case "call":
        color = `green${color}`;
        Icon = <CallIcon />;
        break;
      case "deadline":
        color = `purple${color}`;
        Icon = <DeadlineIcon />;
        break;
      case "meeting":
        color = `blue${color}`;
        Icon = <MeetingIcon />;
        break;
      default:
        color = `red${color}`;
        Icon = <DefaultIcon />;
    }

    return <Avatar className={classes[color]}>{Icon}</Avatar>;
  };

  return (
    <div className={classes.gridItem}>
      {getIcon(activity.type)}
      <div className={classes.activityDetails}>
        <span className={classes.quantity}>{activity.quantity}</span>
        <span className={classes.type}>{typeName}</span>
      </div>
    </div>
  );
}

export default function ActivitySummary({ activityLog }) {
  const classes = useStyles();

  const getQuantityForType = (type) => {
    return activityLog.filter((act) => act.type === type).length;
  };

  const types = ["call", "email", "task", "deadline", "meeting", "mailer"];

  return (
    <div className={classes.summaryRoot}>
      <Typography
        className={classes.summaryHeading}
        variant="button"
        gutterBottom
      >
        Activity Summary
      </Typography>
      <div className={classes.gridContainer}>
        {types.map((type, i) => (
          <SummarySection
            activity={{ type, quantity: getQuantityForType(type) }}
          />
        ))}
      </div>
    </div>
  );
}
