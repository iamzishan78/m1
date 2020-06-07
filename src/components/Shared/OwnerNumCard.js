import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import OwnershipIcon from './components/svgIcons/OwnershipIcon'
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


export default function OwnerNumCard() {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)

    return (
      <div className={classes.iconContainer}>

      <OwnershipIcon htmlColor = 'black' viewBox="0 0 45 31" fontSize="large" />

      <Typography
        //classes={classes.text1}
        align="center"
        variant="subtitle2"
      >
        Owners
      </Typography>

      <Typography
        align="center"
        //className={classes.text2}
        variant="caption"
      >
              {stateApp.selectedWell.ownerCount
                ? stateApp.selectedWell.ownerCount
                : '--'}
      </Typography>
      </div>


    );
  };