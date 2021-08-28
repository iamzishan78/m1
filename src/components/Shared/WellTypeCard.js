import React, {useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import OilDropIcon from "./components/svgIcons/OilDropIcon";
import GasFlameIcon from "./components/svgIcons/GasFlameIcon";
import OilGasIcon from "./components/svgIcons/OilGasIcon";
import WaterDropIcon from "./components/svgIcons/WaterDropIcon";
import QuestionIcon from "@material-ui/icons/Help";
import XIcon from "@material-ui/icons/HighlightOff";

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


export default function WellTypeCard(props) {
  let classes = useStyles();
  const [summary, setSummary] = useState(null);



  const WellTypeIcon = () => {
    if (
      summary.WellType &&
      summary.WellType.toUpperCase() == "OIL"
    ) {
      return <OilDropIcon fontSize="large" />;
    } else if (
      summary.WellType &&
      summary.WellType.toUpperCase() == "GAS"
    ) {
      return <GasFlameIcon fontSize="large" />;
    } else if (
      summary.WellType &&
      summary.WellType.toUpperCase() == "OIL AND GAS"
    ) {
      return <OilGasIcon fontSize="large" />;
    } else if (
      summary.WellType &&
      summary.WellType.toUpperCase() == "INJECTION"
    ) {
      return <WaterDropIcon fontSize="large" />;
    } else if (
      summary.WellType &&
      summary.WellType.toUpperCase() == "WATER"
    ) {
      return <WaterDropIcon fontSize="large" />;
    } else if (
      summary.WellType &&
      summary.WellType.toUpperCase() == "P&A"
    ) {
      return <XIcon fontSize="large" />;
    } else {
      return <QuestionIcon fontSize="large" />;
    }
  };


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
      <WellTypeIcon />

      <Typography
        align="center"
        variant="subtitle2"
      >
        Well Type
      </Typography>
      <Typography
        align="center"
        variant="caption"
      >
        {summary.WellType
          ? summary.WellType.toUpperCase()
          : "--"}
      </Typography>
      </div>
    }

    </div>
    
  );
}
