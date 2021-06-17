import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);


export default function CustomizedProgressBars() {
    const useStyles = makeStyles({
        root: {
            flexGrow: 1,
        },
    });
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <BorderLinearProgress variant="determinate" value={50} />
        </div>
    );
}
