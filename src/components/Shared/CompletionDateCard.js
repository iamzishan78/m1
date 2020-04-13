import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import { AppContext } from '../../AppContext'
import CompletionIcon from './components/svgIcons/CompletionIcon'
import moment from 'moment'


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

const formatDateString = dateString => {
    if (!dateString) return '--'
    return new Date(dateString).toLocaleDateString()
  }

const convertDate = unixStamp => {
  const date = moment.utc(unixStamp).format("MM/DD/YYYY");

  if (unixStamp === 'null') {return '--'}
  else if(unixStamp === null) {return '--'}
  else if(unixStamp === undefined) {return '--'}
  else {return date}
}

  
export default function CompletionDateCard() {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)

    return (
      <div className={classes.iconContainer}>

      <CompletionIcon  viewBox="0 0 77.5 60.5" fontSize="large" />

      <Typography
        //classes={classes.text1}
        align="center"
        color = 'textPrimary'
        variant="subtitle2"
      >
        Comp Date
      </Typography>
      <Typography
        align="center"
        htmlColor='white'
        //className={classes.text2}
        variant="caption"
      >
      {convertDate(stateApp.selectedWell.completionDate)}
      </Typography>
      </div>


    );
  };