import React, { useEffect, useState } from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import QuestionIcon from "@material-ui/icons/Help";
import StateIcon from "../svgIcons/StateIcon";
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

function StateCard(props) {
    let classes = useStyles();
    const [state, setState] = useState(null);

    return (
        <div className={classes.iconContainer}>
            <StateIcon htmlColor='black' viewBox="0 0 1000 1000" fontSize="large" style={{ transform: 'scale(1.2)' }} />
            <Typography
                align="center"
                variant="subtitle2"
            >
                State
            </Typography>
            <Typography
                align="center"
                variant="caption"
            >
                {props.state == "" ? "--" : props.state }
            </Typography>
        </div>
    );
}

export default StateCard