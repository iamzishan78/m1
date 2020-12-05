import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import { AppContext } from '../../../AppContext';
import QuestionIcon from "@material-ui/icons/Help";
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

function RangeCard(props) {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)

    return (
        <div className={classes.iconContainer}>
            <QuestionIcon fontSize="large" />
            <Typography
                align="center"
                variant="subtitle2"
            >
                Range
            </Typography>
            <Typography
                align="center"
                variant="caption"
            >
                {props.range == "" ? "--" : props.range }
            </Typography>
        </div>
    );
}

export default RangeCard