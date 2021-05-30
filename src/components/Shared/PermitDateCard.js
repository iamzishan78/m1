import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import { AppContext } from '../../AppContext'
import PermitIcon from './components/svgIcons/PermitIcon'
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


    
export default function PermitDateCard() {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)

    return (
      <div className={classes.iconContainer}>

      <PermitIcon  viewBox="0 0 256 256" fontSize="large" />

      <Typography
        //classes={classes.text1}
        align="center"
        color = 'textPrimary'
        variant="subtitle2"
      >
        Permit Date
      </Typography>
      <Typography
        align="center"
        htmlColor='white'
        //className={classes.text2}
        variant="caption"
      >
      {convert_date(stateApp.selectedWell.permitApprovedDate)}

      </Typography>
      </div>


    );
  };