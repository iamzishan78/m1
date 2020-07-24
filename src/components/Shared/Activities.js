import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
import { useMutation } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import Icon from "@material-ui/core/Icon";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import AddActivityModal from "../ContactDetailCard/components/AddActivityModal";
import { UPDATECONTACT } from "../../graphQL/useMutationUpdateContact";

import EnvelopeIcon from "../Shared/svgIcons/envelope.js";
import PhoneIcon from "../Shared/svgIcons/phone.js";
import StarIcon from "../Shared/svgIcons/star.js";
import MeetingIcon from "../Shared/svgIcons/meeting.js";
import { ProfileContext } from "../Profile/ProfileContext";
import { GETPROFILE } from "../../graphQL/useQueryGetProfile";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
  },
  timelineItemRight: {
    "&:hover": {
      backgroundColor: "#F0F6F8",
    },
    paddingLeft: "10px",
    "&:before": {
      content: "none",
    },
  },
  timelineItemRightToday: {
    paddingLeft: "10px",
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
    "& .MuiTypography-body1": { fontSize: "0.85rem" },
    "& .MuiTypography-body2": { fontSize: "0.7rem" },
    "&  p": {
      margin: "0",
    },
  },
  blue: {
    color: theme.palette.secondary.main,
  },
  todayDot: {
    fontSize: "8px",
    paddingLeft: "10px",
    paddingRight: "10px",
    borderRadius: "20px",
    color: "#000",
    backgroundColor: "#d9d9d9",
  },
  imageIcon: {
    height: "100%",
    padding: "3px",
    display: "block",
  },
  iconRoot: {
    textAlign: "center",
  },
  deleteLine: {
    textDecoration: "underline",
    color: "#757575",
    display: "block",
    margin: "0",
    fontWeight: "normal",
    "&:hover": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
  },
}));

export default function Activities({ activityLog, user_id, ...props }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [updateContact] = useMutation(UPDATECONTACT);

  const classes = useStyles();

  const getIcon = (activityType) => {
    let icon = "";
    switch (activityType) {
      case "general":
        icon = "star_icon";
        break;
      case "phone":
        icon = "phone_call_icon";
        break;
      case "email":
        icon = "envelope_icon";
        break;
      case "meeting":
        icon = "meeting_icon";
        break;
      default:
        icon = "star_icon";
    }

    return (
      <Icon classes={{ root: classes.iconRoot }}>
        <img
          className={classes.imageIcon}
          src={require(`../Shared/svgIcons/${icon}.svg`)}
          alt={activityType}
        />
      </Icon>
    );
  };

  const deleteActivity = (act) => {
    let newActLog = [...activityLog];
    const index =
      newActLog &&
      newActLog.findIndex(
        (activity) =>
          activity.dateTime === act.dateTime && activity.user_id === act.user_id
      );
    if (index > -1) {
      newActLog.splice(index, 1);
      newActLog.forEach((v) => delete v.__typename);
      updateContact({
        variables: {
          contact: {
            _id: props.id,
            activityLog: [...newActLog],
          },
        },
        refetchQueries: ["getContact"],
        awaitRefetchQueries: true,
      });
    }
  };

  const updateActivity = (activity) => {
    setSelectedActivity(activity);
    setActivityModalOpen(true);
  };

  const addActivity = () => {
    setSelectedActivity(null);
    setActivityModalOpen(true);
  };

  console.log("Activities: ", activityLog);

  const sortedActivityLog =
    activityLog && activityLog.length > 0
      ? activityLog
          .filter((activity) => activity.user_id === user_id)
          .sort((a, b) => moment(b.dateTime).diff(moment(a.dateTime)))
      : [];

  console.log("Sorted: ", sortedActivityLog);

  return (
    <Card className={classes.root} variant="outlined">
      <AddActivityModal
        open={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        id={props.id}
        activityLog={activityLog}
        selectedActivity={selectedActivity}
      />
      <CardActions>
        <Grid container justify="space-between">
          <Grid item>
            <Typography variant="button" gutterBottom>
              Recent Activities
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="button"
              onClick={addActivity}
              gutterBottom
              style={{ cursor: "pointer" }}
            >
              Add Activity
            </Typography>
          </Grid>
        </Grid>
      </CardActions>
      <Timeline>
        <TimelineItem className={classes.timelineItemRightToday}>
          <TimelineSeparator style={{ transform: "translateX(-5px)" }}>
            <TimelineDot className={classes.todayDot}>Today</TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
        </TimelineItem>
        {sortedActivityLog.map((activity, i) => (
          <TimelineItem key={i} className={classes.timelineItemRight}>
            <TimelineSeparator>
              <TimelineDot variant="outlined">
                {getIcon(activity.type)}
              </TimelineDot>
              {i + 1 !== activityLog.length && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <div className={classes.timelineText}>
                <Typography
                  className={classes.itemHeading}
                  variant="body1"
                  onClick={() => updateActivity(activity)}
                >
                  {activity.notes}
                </Typography>
                <Typography variant="body2" className={classes.blue}>
                  {activity.fullname} –{" "}
                  {moment(activity.dateTime).format("MMMM D, YYYY hh:mm a")}{" "}
                  <br />
                  <h5
                    className={classes.deleteLine}
                    onClick={() => deleteActivity(activity)}
                  >
                    Delete
                  </h5>
                </Typography>
              </div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Card>
  );
}
