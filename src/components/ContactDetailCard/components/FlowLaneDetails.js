import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "AppContext";
import { Menu, MenuItem, Button, CardActions, CardContent, Grid } from "@material-ui/core";
import ArrowDown from "@material-ui/icons/ArrowDropDown";
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

const FlowLaneDetails = () => {
    const classes = useStyles();
    const [stateApp] = useContext(AppContext);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
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
                        <div className={classes.popOver}>
                            <Button aria-controls="laneProgressMenu" aria-haspopup="true" onClick={handleClick}>
                                All
                  <ArrowDown />
                            </Button>
                            <Menu id="laneProgressMenu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                                <MenuItem onClick={handleClose}>Option 1</MenuItem>
                                <MenuItem onClick={handleClose}>Option 2</MenuItem>
                                <MenuItem onClick={handleClose}>Option 3</MenuItem>
                            </Menu>
                        </div>
                    </Grid>
                    <Grid xs={12} className={classes.newLaneProgress}>
                        <div className={classes.newFlowLane}>+ Add New</div>
                    </Grid>
                </Grid>
            </CardActions>
            <CardContent style={{ padding: 0 }}>
                <div className={classes.laneProgressSection}></div>
            </CardContent>
        </div>
    );
};

export default FlowLaneDetails;
