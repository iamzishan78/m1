import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import { AppContext } from '../../../AppContext';
import AbstractIcon from '../svgIcons/AbstractIcon';
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

function AbstractCard(props) {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)

    return (
        <div className={classes.iconContainer}>
            <AbstractIcon viewBox="0 0 700 492" fontSize="large" />
            <Typography
                align="center"
                variant="subtitle2"
            >
                Abstract
            </Typography>
            <Typography
                align="center"
                variant="caption"
            >
                {props.abstract == "" ? "--" : props.abstract}
            </Typography>
        </div>
    );
}

export default AbstractCard