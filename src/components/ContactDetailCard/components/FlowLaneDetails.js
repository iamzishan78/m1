import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "AppContext";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import ProgressBar from "../../Shared/ui/ProgressBar";

const useStyles = makeStyles((theme) => ({
    root: {
        // backgroundColor: "#fff",
    },
    newLaneProgress: {
        margin: "10px 0px 10px 0px",
    },
    newFlowLane: {
        cursor: "pointer",
    },
}));

export default function FlowLaneDetails(props) {
    const classes = useStyles();
    const [stateApp] = useContext(AppContext);
    const { pipeToShow } = props;

    return (
        <div className={classes.root}>
            <h1>{stateApp.activeDeal.name}</h1>
            <CardActions style={{ padding: 0, borderBottom: "1px solid lightgray" }}>
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item xs={6}>
                        <h4 style={{ height: "8px" }}>Lane Progress</h4>
                        <ProgressBar value={50} isNumeric />
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: "right" }}>
                        <h4>Details</h4>
                    </Grid>
                    <Grid xs={12} className={classes.newLaneProgress}>
                        <div className={classes.newFlowLane}>+ Add New</div>
                    </Grid>
                </Grid>
            </CardActions>
            <CardContent style={{ padding: 0 }}>
                <div className={classes.laneProgressSection}>{/* Show two recent docs */}</div>
            </CardContent>
        </div>
    );
}
