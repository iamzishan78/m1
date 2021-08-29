import React, {useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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

export default function ProfileCard(props) {
  let classes = useStyles();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (props.summary) {
      setSummary(props.summary);
      ;
    }
  }, [props.summary, setSummary]);


  return (


    <div >
    
    {summary && 


    <div className={classes.iconContainer}>
      <Avatar variant="circle" className={classes.avatar}>
        {summary.WellBoreProfile
          ? summary.WellBoreProfile.substring(0, 1)
          : "H"}{" "}
      </Avatar>

      <Typography
        //classes={classes.text1}
        align="center"
        color="textPrimary"
        variant="subtitle2"
      >
        Profile
      </Typography>
      <Typography align="center" className={classes.text2} variant="caption">
        {summary.WellBoreProfile &&
        summary.WellBoreProfile.toUpperCase()
          ? summary.WellBoreProfile.toUpperCase()
          : "--"}
      </Typography>
    </div>

}

</div>

  );
}
