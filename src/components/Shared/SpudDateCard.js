import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import { AppContext } from '../../AppContext'
import RigIcon from './components/svgIcons/RigIcon'
import moment from 'moment'

// value formatters 
import convert_date from "../Shared/valueformatters/convert_date.js";



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

  
export default function SpudDateCard() {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)

    return (
      <div className={classes.iconContainer}>

      <RigIcon htmlColor='black' viewBox="65.8 0 481.7 792" fontSize="large" />

      <Typography
        //classes={classes.text1}
        align="center"
        variant="subtitle2"
      >
        Spud Date
      </Typography>
      <Typography
        align="center"
        //className={classes.text2}
        variant="caption"
      >
      {convert_date(stateApp.selectedWell.spudDate)}

      </Typography>
      </div>


    );
  };