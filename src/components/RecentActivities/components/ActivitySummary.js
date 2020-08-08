import React from "react";
import Typography from "@material-ui/core/Typography";
import EmailIcon from "@material-ui/icons/Email";
import EventNoteIcon from "@material-ui/icons/EventNote";
import PhoneIcon from "@material-ui/icons/Phone";
import ChatIcon from "@material-ui/icons/Chat";
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

  const getIcon = (type) => {
    let color = "Icon";
    let Icon = <EmailIcon />;
    switch (type) {
      case "emails":
        color = `blue${color}`;
        Icon = <EmailIcon />;
        break;
      case "campaigns":
        color = `red${color}`;
        Icon = <EventNoteIcon />;
        break;
      case "calls":
        color = `green${color}`;
        Icon = <PhoneIcon />;
        break;
      case "sms":
        color = `purple${color}`;
        Icon = <ChatIcon />;
        break;
      default:
        color = `blue${color}`;
        Icon = <EmailIcon />;
    }

    return <Avatar className={classes[color]}>{Icon}</Avatar>;
  };

  return (
    <div className={classes.gridItem}>
      {getIcon(activity.type)}
      <div className={classes.activityDetails}>
        <span className={classes.quantity}>{activity.quantity}</span>
        <span className={classes.type}>{activity.type}</span>
      </div>
    </div>
  );
}

export default function ActivitySummary() {
  const classes = useStyles();

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
        <SummarySection activity={{ type: "emails", quantity: 20 }} />
        <SummarySection activity={{ type: "campaigns", quantity: 30 }} />
        <SummarySection activity={{ type: "calls", quantity: 40 }} />
        <SummarySection activity={{ type: "sms", quantity: 50 }} />
      </div>
    </div>
  );
}
