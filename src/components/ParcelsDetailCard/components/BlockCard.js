import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import { AppContext } from '../../../AppContext';
import BlockIcon from '../svgIcons/BlockIcon';
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

function BlockCard(props) {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)

    return (
        <div className={classes.iconContainer}>
            <BlockIcon viewBox="0 0 96 96" fontSize="large" />
            <Typography
                align="center"
                variant="subtitle2"
            >
                Block
            </Typography>
            <Typography
                align="center"
                variant="caption"
            >
               {props.block == "" ? "--" : props.block }
            </Typography>
        </div>
    );
}

export default BlockCard