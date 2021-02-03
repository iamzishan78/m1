import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import { AppContext } from '../../../AppContext';
import SurveyIcon from '../svgIcons/SurveyIcon';
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

function SurveyCard(props) {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)

    return (
        <div className={classes.iconContainer}>
            <SurveyIcon viewBox="0 0 585 593" fontSize="large" />
            <Typography
                align="center"
                variant="subtitle2"
            >
                Survey
            </Typography>
            <Typography
                align="center"
                variant="caption"
            >
                {props.survey == "" ? "--" : props.survey }
            </Typography>
        </div>
    );
}

export default SurveyCard