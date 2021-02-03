import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import CountyIcon from '../svgIcons/CountyIcon';
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

function CountyCard(props) {
    let classes = useStyles();
    return (
        <div className={classes.iconContainer}>
            <CountyIcon htmlColor='black' viewBox="0 0 280.245 280.245" fontSize="large" style={{ transform: 'scale(0.9)' }} />
            <Typography
                align="center"
                variant="subtitle2"
            >
                County
            </Typography>
            <Typography
                align="center"
                variant="caption"
            >
                {props.county == "" ? "--" : props.county }
            </Typography>
        </div>
    );
}

export default CountyCard