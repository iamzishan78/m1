import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import { AppContext } from '../../../AppContext';
import BlockIcon from '../svgIcons/BlockIcon';

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

function MeridianCard(props) {
    let classes = useStyles();
    return (
        <div className={classes.iconContainer}>
            <BlockIcon viewBox="0 0 96 96" fontSize="large" />
            <Typography
                align="center"
                variant="subtitle2"
            >
                Meridian
            </Typography>
            <Typography
                align="center"
                variant="caption"
            >
                {props.meridian == "" ? "--" : props.meridian }
            </Typography>
        </div>
    );
}

export default MeridianCard