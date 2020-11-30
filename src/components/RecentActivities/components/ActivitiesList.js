import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import ChatIcon from "@material-ui/icons/Chat";
import EventNoteIcon from "@material-ui/icons/EventNote";
import StarIcon from "@material-ui/icons/Star";
import PeopleIcon from "@material-ui/icons/People";
import { DELETEACTIVITY } from "../../../graphQL/useMutationActivity";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
  },
  timelineDot: {
    margin: 0,
    boxShadow: "0px 2px 2px #ddd",
    borderColor: "#ddd",
  },
  timelineContent: {
    paddingTop: 0,
  },
  timelineItemRight: {
    // "&:hover": {
    //   backgroundColor: "#F0F6F8",
    // },
    "&:before": {
      content: "none",
    },
  },
  timelineItemRightToday: {
    "&:before": {
      content: "none",
    },
  },
  itemHeading: {
    cursor: "pointer",
    "&:hover": {
      color: "#000",
    },
  },
  timelineText: {
    "& .MuiTypography-body1": {
      fontSize: "0.85rem",
      color: "rgb(170,170,170)",
      fontWeight: "bold",
    },
    "& .MuiTypography-body2": { fontSize: "0.7rem", color: "rgb(190,190,190)" },
    "&  p": {
      margin: "0",
    },
  },
  blue: {
    color: theme.palette.secondary.main,
  },
  imageIcon: {
    height: "100%",
    padding: "3px",
    display: "block",
    color: "blue",
  },
  iconRoot: {
    textAlign: "center",
  },
  deleteLine: {
    textDecoration: "underline",
    margin: "0",
    fontWeight: "normal",
    "&:hover": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
  },
  timelineRoot: {
    padding: 0,
  },
  itemIcon: {
    padding: "2px",
  },
}));

export default function ActivitiesList({
  activityLog,
  user_id,
  viewAll,
  ...props
}) {
  const classes = useStyles();

  const [deleteActivityMutation, { loading: deleteLoading }] = useMutation(
    DELETEACTIVITY,
    {
      refetchQueries: ["getContact","getAllActivities"],
      awaitRefetchQueries: true,
    }
  );

  const getIcon = (activityType) => {
    switch (activityType) {
      case "general":
        return <StarIcon className={classes.itemIcon} color="secondary" />;
      case "phone":
        return <PhoneIcon className={classes.itemIcon} color="secondary" />;
      case "email":
        return <EmailIcon className={classes.itemIcon} color="secondary" />;
      case "meeting":
        return <PeopleIcon className={classes.itemIcon} color="secondary" />;
      case "sms":
        return <ChatIcon className={classes.itemIcon} color="secondary" />;
      case "campaign":
        return <EventNoteIcon className={classes.itemIcon} color="secondary" />;
      default:
        return <StarIcon className={classes.itemIcon} color="secondary" />;
    }
  };

  const deleteActivity = async (act) => {
    await deleteActivityMutation({
      variables: {
        id: act._id,
      },
    });
  };

  let sortedActivityLog =
    activityLog && activityLog.length > 0
      ? Object.values(activityLog)
          // .filter((activity) => activity.user_id === user_id) // get only current user's activities
          .sort((a, b) => moment(b.dateTime).diff(moment(a.dateTime))) // sort activities according to date
      : [];

  sortedActivityLog = viewAll
    ? sortedActivityLog
    : sortedActivityLog.slice(0, 3); // only get latest 3

  return (
    <div className={classes.root}>
      <Timeline className={classes.timelineRoot}>
        {sortedActivityLog.map((activity, i) => (
          <TimelineItem key={i} className={classes.timelineItemRight}>
            <TimelineSeparator>
              <TimelineDot variant="outlined" className={classes.timelineDot}>
                {getIcon(activity.type)}
              </TimelineDot>
              {i + 1 < sortedActivityLog.length && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent className={classes.timelineContent}>
              <div className={classes.timelineText}>
                <Typography
                  className={classes.itemHeading}
                  variant="body1"
                  onClick={() => props.updateActivity(activity)}
                >
                  {activity.notes}
                </Typography>
                <Typography variant="body2" className={classes.blue}>
                  {activity.ownerName} ●{" "}
                  {moment(activity.dateTime).format("MMMM D, YYYY hh:mm a")} ●{" "}
                  <span
                    className={classes.deleteLine}
                    onClick={() => deleteActivity(activity)}
                  >
                    Delete
                  </span>
                </Typography>
              </div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
