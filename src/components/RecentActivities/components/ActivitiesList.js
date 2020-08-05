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
import SvgIcon from "@material-ui/core/SvgIcon";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import StarIcon from "@material-ui/icons/Star";
import PeopleIcon from "@material-ui/icons/People";
import Icon from "@material-ui/core/Icon";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import AddActivityModal from "../../ContactDetailCard/components/AddActivityModal";
import { UPDATECONTACT } from "../../../graphQL/useMutationUpdateContact";

// import EnvelopeIcon from "../../Shared/svgIcons/envelope.js";
// import PhoneIcon from "../../Shared/svgIcons/phone.js";
// import StarIcon from "../../Shared/svgIcons/star.js";
// import MeetingIcon from "../../Shared/svgIcons/meeting.js";
import { ProfileContext } from "../../Profile/ProfileContext";
import { GETPROFILE } from "../../../graphQL/useQueryGetProfile";

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
      color: "rgb(120,120,120)",
      fontWeight: "bold",
    },
    "& .MuiTypography-body2": { fontSize: "0.7rem", color: "rgb(120,120,120)" },
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

export default function ActivitiesList({ activityLog, user_id, ...props }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [updateContact] = useMutation(UPDATECONTACT);

  const classes = useStyles();

  const getIcon = (activityType) => {
    // let icon = "";
    switch (activityType) {
      case "general":
        return <StarIcon className={classes.itemIcon} color="secondary" />;
      // icon = "star_icon";
      // break;
      case "phone":
        return <PhoneIcon className={classes.itemIcon} color="secondary" />;
      // icon = "phone_call_icon";
      // break;
      case "email":
        return <EmailIcon className={classes.itemIcon} color="secondary" />;
      // icon = "envelope_icon";
      // break;
      case "meeting":
        return <PeopleIcon className={classes.itemIcon} color="secondary" />;
      // icon = "meeting_icon";
      // break;
      default:
        return <StarIcon className={classes.itemIcon} color="secondary" />;
      // icon = "star_icon";
    }

    // return (
    //   <Icon classes={{ root: classes.iconRoot }} color="secondary">
    //     <img
    //       className={classes.imageIcon}
    //       src={require(`../../Shared/svgIcons/${icon}.svg`)}
    //       alt={activityType}
    //     />
    //   </Icon>
    // );
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

  let sortedActivityLog =
    activityLog && activityLog.length > 0
      ? activityLog
          .filter((activity) => activity.user_id === user_id) // get only current user's activities
          .sort((a, b) => moment(b.dateTime).diff(moment(a.dateTime))) // sort activities according to date
          .slice(0, 3) // only get latest 3
      : [];

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
                  onClick={() => updateActivity(activity)}
                >
                  {activity.notes}
                </Typography>
                <Typography variant="body2" className={classes.blue}>
                  {activity.fullname} ●{" "}
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
