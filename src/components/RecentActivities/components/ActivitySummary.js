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
  },
  summaryHeading: {
    textAlign: "center",
    textTransform: "uppercase",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    gridGap: "10px",
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
    backgroundIcon: "#F3D5E9",
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
    marginLeft: "5px",
    display: "flex",
    flexDirection: "column",
  },
}));

function SummarySection({ activity }) {
  const classes = useStyles();

  const getIcon = (type) => {
    let color = "Icon";
    let Icon = <EmailIcon />;
    switch (type) {
      case "email":
        color = `blue${color}`;
        Icon = <EmailIcon />;
        break;
      case "campaign":
        color = `red${color}`;
        Icon = <EventNoteIcon />;
        break;
      case "phone":
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
        <span>{activity.type}</span>
        <span>{activity.quantity}</span>
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
        <SummarySection activity={{ type: "email", quantity: 20 }} />
        <SummarySection activity={{ type: "campaign", quantity: 30 }} />
        <SummarySection activity={{ type: "phone", quantity: 40 }} />
        <SummarySection activity={{ type: "sms", quantity: 50 }} />
      </div>
    </div>
  );
}
