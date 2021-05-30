import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import { AppContext } from '../../AppContext'
import WellIcon from './components/svgIcons/WellIcon'

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

  
export default function FirstProdDateCard() {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)

    return (
      <div className={classes.iconContainer}>

      <WellIcon  viewBox="0 0 32 31" fontSize="large" />

      <Typography
        //classes={classes.text1}
        align="center"
        variant="subtitle2"
      >
        First Prod Date
      </Typography>
      <Typography
        align="center"
        //className={classes.text2}
        variant="caption"
      >
      {convert_date(stateApp.selectedWell.firstProductionDate)}
      </Typography>
      </div>


    );
  };