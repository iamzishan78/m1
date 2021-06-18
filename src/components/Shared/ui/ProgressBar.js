import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        width: '100%',
        borderRadius: 5,
        direction: 'row'
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

export default function CustomizedProgressBars(props) {
    const { value, isNumeric } = props;
    const useStyles = makeStyles({
        root: {
            color: 'lightgray'
        },
    });
    const classes = useStyles();

    return (
        <Grid container direction="row" alignItems="center" justify="flex-start" className={classes.root}>
            <Grid item style={{ minWidth: '70%' }}>
                <BorderLinearProgress variant="determinate" value={value} />
            </Grid>
            <Grid item>
                {isNumeric && <span>{value}%</span>}
            </Grid>
        </Grid>
    );
}
