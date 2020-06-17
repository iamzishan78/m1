import React from "react";
import { format } from "date-fns/esm";
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
import FastfoodIcon from "@material-ui/icons/Fastfood";
import LaptopMacIcon from "@material-ui/icons/LaptopMac";
import HotelIcon from "@material-ui/icons/Hotel";
import RepeatIcon from "@material-ui/icons/Repeat";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
  },
  timelineItemRight: {
    "&:before": {
      content: "none",
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
  },
}));

export default function Activities() {
  const classes = useStyles();

  const activities = [
    {
      type: "general",
      timestamp: +new Date(),
      author: "Kyle Chapman",
      description: "Email sent about offer to James Sampleton",
    },
    {
      type: "meeting",
      timestamp: +new Date(),
      author: "Kyle Chapman",
      description: "Meeting with Jacob Avery",
    },
  ];

  const getIcon = (activityType) => {
    switch (activityType) {
      case "general":
        return <FastfoodIcon />;
      case "phone":
        return <FastfoodIcon />;
      case "emails":
        return <FastfoodIcon />;
      case "meeting":
        return <FastfoodIcon />;
      default:
        return <FastfoodIcon />;
    }
  };

  return (
    <Card className={classes.root} variant="outlined">
      <CardActions>
        <Grid container justify="space-between">
          <Grid item>
            <Typography variant="button" gutterBottom>
              Recent Activities
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="button" gutterBottom>
              Add Activity
            </Typography>
          </Grid>
        </Grid>
      </CardActions>
      <Timeline>
        <TimelineItem className={classes.timelineItemRight}>
          <TimelineSeparator>
            <TimelineDot className={classes.todayDot}>Today</TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
        </TimelineItem>
        {activities.map((activity, i) => (
          <TimelineItem key={i} className={classes.timelineItemRight}>
            <TimelineSeparator>
              <TimelineDot>{getIcon(activity.type)}</TimelineDot>
              {i + 1 !== activities.length && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <div className={classes.timelineText}>
                <Typography variant="body2">{activity.description}</Typography>
                <Typography variant="body2" className={classes.blue}>
                  {activity.author} – {format(activity.timestamp, "MMMM d, yyyy hh:mm a")}
                </Typography>
              </div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Card>
  );
}
