import React, { useContext, useEffect, useState, Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
      padding: '30px',
      borderBottomColor: '#e4e6e7',
      borderBottom: 'solid',
      borderBottomWidth: '1px'
    },
    cancelButton: {
        width: '100%',
        backgroundColor: '#eafaff',
        color: '#92d8f0'
    },
    saveButton: {
        width: '100%',
        backgroundColor: '#92d8f0',
        color: '#fff'
    }
  }));

const ProfileHeader = () => {
    const classes = useStyles();
    return(
    <Fragment>
        <Grid container className={classes.root}>
            <Grid item sm={10}>
                <div style={{borderBottom: 1}}>
                    <Typography variant="h5" style={{fontWeight: 'bold'}}>My Account</Typography>
                </div>
            </Grid>
            <Grid item sm={2}>
                <Grid container spacing={2} justify="center">
                    <Grid item sm={6}>
                        <Button variant="contained" className={classes.cancelButton} disableElevation>CANCEL</Button>
                    </Grid>
                    <Grid item sm={6}>
                        <Button variant="contained" className={classes.saveButton} disableElevation>SAVE</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Fragment>
    )
}

export default ProfileHeader