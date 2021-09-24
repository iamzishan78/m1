import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import { AppContext } from '../../../AppContext';
import Avatar from "@material-ui/core/Avatar";
import moment from 'moment'

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
        backgroundColor: "black",
        color: "white",
        width: "32px",
        height: "32px",
        margin: "0px",
      },
  }))

function TownshipCard(props) {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)

    return (
        <div className={classes.iconContainer}>
            <Avatar variant="circle" className={classes.avatar}>
                T
            </Avatar>
            <Typography
                align="center"
                variant="subtitle2"
            >
                Township
            </Typography>
            <Typography
                align="center"
                variant="caption"
            >
                {props.township == "" ? "--" : props.township }
            </Typography>
        </div>
    );
}

export default TownshipCard