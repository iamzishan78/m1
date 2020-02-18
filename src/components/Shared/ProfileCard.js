import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import { AppContext } from '../../AppContext'
import Avatar from '@material-ui/core/Avatar'



const useStyles = makeStyles(theme => ({
    iconContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',

    },
    tex1: {
      colorPrimary: 'white'
    },
    avatar: {
      backgroundColor: 'black',
      color: 'white',
      width: '38px',
      height: '38px',
      margin: '0px'
    },
  }))


  
export default function ProfileCard() {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)

    return (
      <div className={classes.iconContainer}>
 
          <Avatar variant="circle" className={classes.avatar}>
              {stateApp.selectedWell.wellBoreProfile
                ? stateApp.selectedWell.wellBoreProfile.substring(0, 1)
                : 'H'}{' '}
          </Avatar>


      <Typography
        //classes={classes.text1}
        align="center"
        color = 'textPrimary'
        variant="subtitle2"
      >
        Profile
      </Typography>
      <Typography
              align="center"
              className={classes.text2}
              variant="caption"
            >
              {stateApp.selectedWell.wellBoreProfile.toUpperCase()
                ? stateApp.selectedWell.wellBoreProfile.toUpperCase()
                : '--'}
            </Typography>


      </div>


    );
  };