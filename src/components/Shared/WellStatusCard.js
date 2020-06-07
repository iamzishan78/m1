import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import WellIcon from './components/svgIcons/WellIcon'
import { AppContext } from '../../AppContext'

import QuestionIcon from '@material-ui/icons/Help';
import XIcon from '@material-ui/icons/HighlightOff';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';


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


  
export default function WellStatusCard() {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)
    const WellStatusIcon = () => {


      console.log(stateApp.selectedWell.wellStatus)
      console.log('*')

      if(stateApp.selectedWell.wellStatus == "ACTIVE"){
        return (
          <CheckCircleIcon fontSize='large'/>
        );
      } else if(stateApp.selectedWell.wellStatus == "UNKNOWN") {
        return (
          <QuestionIcon fontSize='large'/>
        );

      } else {
        return (
          <XIcon fontSize='large'/>
        );
      }
    };





    return (
      <div className={classes.iconContainer}>

      <WellStatusIcon/>




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
        {stateApp.selectedWell.wellStatus
          ? stateApp.selectedWell.wellStatus.toUpperCase()
          : '--'}
      </Typography>
      </div>


    );
  };



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