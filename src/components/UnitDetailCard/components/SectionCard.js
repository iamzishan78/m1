import React, { useContext,useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import { AppContext } from '../../../AppContext';
import SectionIcon from '../svgIcons/SectionIcon';
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

function SectionCard(props) {
    let classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext)

    return (
        <div className={classes.iconContainer}>
            <SectionIcon viewBox="0 0 512.001 512.001" fontSize="large" />
            <Typography
                align="center"
                variant="subtitle2"
            >
                Section
            </Typography>
            <Typography
                align="center"
                variant="caption"
            >
                {props.section == "" ? "--" : props.section }
            </Typography>
        </div>
    );
}

export default SectionCard