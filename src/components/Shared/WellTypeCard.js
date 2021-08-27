import React, { useContext, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { AppContext } from "../../AppContext";
import { WellCardContext } from "../WellCard/WellCardContext";

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


export default function WellTypeCard() {
  let classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateWellCard, setStateWellCard] = useContext(WellCardContext);


  const WellTypeIcon = () => {
    console.log('WELL CARD STATE', stateWellCard)
    if (
      stateApp.selectedWell.wellType &&
      stateApp.selectedWell.wellType.toUpperCase() == "OIL"
    ) {
      return <OilDropIcon fontSize="large" />;
    } else if (
      stateApp.selectedWell.wellType &&
      stateApp.selectedWell.wellType.toUpperCase() == "GAS"
    ) {
      return <GasFlameIcon fontSize="large" />;
    } else if (
      stateApp.selectedWell.wellType &&
      stateApp.selectedWell.wellType.toUpperCase() == "OIL AND GAS"
    ) {
      return <OilGasIcon fontSize="large" />;
    } else if (
      stateApp.selectedWell.wellType &&
      stateApp.selectedWell.wellType.toUpperCase() == "INJECTION"
    ) {
      return <WaterDropIcon fontSize="large" />;
    } else if (
      stateApp.selectedWell.wellType &&
      stateApp.selectedWell.wellType.toUpperCase() == "WATER"
    ) {
      return <WaterDropIcon fontSize="large" />;
    } else if (
      stateApp.selectedWell.wellType &&
      stateApp.selectedWell.wellType.toUpperCase() == "P&A"
    ) {
      return <XIcon fontSize="large" />;
    } else {
      return <QuestionIcon fontSize="large" />;
    }
  };

  return (
    <div className={classes.iconContainer}>
      <WellTypeIcon />

      <Typography
        //classes={classes.text1}
        align="center"
        variant="subtitle2"
      >
        Well Type
      </Typography>
      <Typography
        align="center"
        //className={classes.text2}
        variant="caption"
      >
        {stateApp.selectedWell.wellType
          ? stateApp.selectedWell.wellType.toUpperCase()
          : "--"}
      </Typography>
    </div>
  );
}
