import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import ProductionIcon from './components/svgIcons/ProductionIcon'
import { AppContext } from '../../AppContext'



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

const formatBOE = boe => {
    if (!boe || isNaN(boe)) return '--'
    return Math.round(boe).toLocaleString()
  }

export default function Last12StatusCard() {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)

    return (
      <div className={classes.iconContainer}>

      <ProductionIcon htmlColor='black' viewBox="0 0 32 31" fontSize="large" />

      <Typography
        //classes={classes.text1}
        align="center"
        variant="subtitle2"
      >
        Last 12Mo.
      </Typography>
      <Typography
        align="center"
        //className={classes.text2}
        variant="caption"
      >
        {`${formatBOE(stateApp.selectedWell.lastTwelveMonthBOE)} BOE`}

      </Typography>
      </div>


    );
  };