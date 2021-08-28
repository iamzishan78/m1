import React, { useContext, useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import QuestionIcon from "@material-ui/icons/Help";
import XIcon from "@material-ui/icons/HighlightOff";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tex1: {
    colorPrimary: "white",
  },
}));

export default function WellStatusCard(props) {
  let classes = useStyles();
  const [summary, setSummary] = useState(null);


  
  const WellStatusIcon = () => {
    if (
     summary.WellStatus &&
     summary.WellStatus.toUpperCase() == "ACTIVE"
    ) {
      return <CheckCircleIcon fontSize="large" />;
    } else if (
      summary.WellStatus &&
      summary.WellStatus.toUpperCase() == "UNKNOWN"
    ) {
      return <QuestionIcon fontSize="large" />;
    } else {
      return <XIcon fontSize="large" />;
    }
  };

  
  useEffect(() => {
    if (props.summary) {
      setSummary(props.summary);
      ;
    }
  }, [props.summary, setSummary]);



  return (
    <div>

    {summary && 

    <div className={classes.iconContainer}>
      <WellStatusIcon />

      <Typography
        //classes={classes.text1}
        align="center"
        variant="subtitle2"
      >
        Well Status
      </Typography>
      <Typography
        align="center"
        //className={classes.text2}
        variant="caption"
      >
        {summary.WellStatus
          ? summary.WellStatus.toUpperCase()
          : "--"}
      </Typography>
    </div>

        }
        
    </div>
  );
}

/* 
import React, { useEffect, useState } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'

export default function WellProfileIcon(props) {
  const [letterPath, setLetterPath] = useState('')

  useEffect(() => {
    let h =
      'M24 30H17.924V17.1429H6.07595V30H0V0H6.07595V12.1566H17.924V0H24V30Z'
    if (props.letter === 'h') {
      setLetterPath(h)
    }
  }, [props.letter])

  return (
    <SvgIcon {...props}>
      <path d={letterPath} />
    </SvgIcon>
  )
}
 */
