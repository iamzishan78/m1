import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tex1: {
    colorPrimary: "white",
  },
  avatar: {
    backgroundColor: "black",
    color: "white",
    width: "32px",
    height: "32px",
    margin: "0px",
  },
}));

function AltSurveyCard(props) {
  let classes = useStyles();

  return (
    <div className={classes.iconContainer}>
      <Avatar variant="circle" className={classes.avatar}>
        A
      </Avatar>
      <Typography align="center" variant="subtitle2">
        Alt Survey
      </Typography>
      <Typography align="center" variant="caption">
        {props.altSurvey == "" ? "--" : props.altSurvey}
      </Typography>
    </div>
  );
}

export default AltSurveyCard;
