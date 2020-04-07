import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import { AppContext } from '../../AppContext'
import OilDropIcon from './components/svgIcons/OilDropIcon'
import GasFlameIcon from './components/svgIcons/GasFlameIcon'
import OilGasIcon from './components/svgIcons/OilGasIcon'
import WaterDropIcon from './components/svgIcons/WaterDropIcon'
import QuestionIcon from '@material-ui/icons/Help';
import XIcon from '@material-ui/icons/HighlightOff';
import LocationOnIcon from '@material-ui/icons/LocationOn';



const useStyles = makeStyles(theme => ({
    iconContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',

    },
    tex1: {
      colorPrimary: 'white'
    }
  }))

  


  
export default function WellApiCard() {

  let classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext)
  const WellApiIcon = () => {

      return (
        <LocationOnIcon fontSize='large'/>
      )
  };





  return (
    <div className={classes.iconContainer}>

    <WellApiIcon/>
    <Typography
      //classes={classes.text1}
      align="center"
      variant="subtitle2"
    >
      API
    </Typography>
    <Typography
      align="center"
      //className={classes.text2}
      variant="caption"
    >
      {stateApp.selectedWell.api
        ? stateApp.selectedWell.api.toUpperCase()
        : '--'}
    </Typography>
    </div>


  );
};
