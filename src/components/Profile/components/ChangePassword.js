import React, { useContext, useEffect, useState, Fragment } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { ThemeProvider } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';

const ChangePassword = () => {
    const classes = PanelGeneralStyle();
    return(
        <Fragment>
            <ThemeProvider theme={PanelTheme}>
                <Grid container spacing={2} className={classes.root}>
                    <Grid item sm={12}>
                        <Accordion className={classes.panels} >
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                                <Typography className={classes.heading}>Change Password</Typography>
                            </AccordionSummary>
                            <AccordionDetails style={{margin: 20}}>
                                <Grid container spacing={2} style={{flex: 1}}>
                                    <Grid item sm={6}>
                                        <Grid container spacing={0} style={{flex: 1, flexDirection: 'column'}}>
                                            <Grid item sm={10}>
                                                <FormControl style={{width: '100%'}}>
                                                    <FormLabel>Old Password *</FormLabel>
                                                    <TextField 
                                                        id="outlined-basic"
                                                        style={{paddingTop: 10, paddingBottom: 10}}
                                                        inputProps={{
                                                            style: {
                                                                height: 40,
                                                                padding: '0 14px',
                                                            },
                                                        }}
                                                        variant="outlined"/>
                                                </FormControl>
                                            </Grid>
                                            <Grid item sm={10}>
                                                <FormControl style={{width: '100%'}}>
                                                    <FormLabel>New Password *</FormLabel>
                                                    <TextField 
                                                        id="outlined-basic"
                                                        style={{paddingTop: 10, paddingBottom: 10}}
                                                        inputProps={{
                                                            style: {
                                                                height: 40,
                                                                padding: '0 14px',
                                                            },
                                                        }}
                                                        variant="outlined"/>
                                                </FormControl>
                                            </Grid>
                                            <Grid item sm={10}>
                                                <FormControl style={{width: '100%'}}>
                                                    <FormLabel>New Password Confirmation*</FormLabel>
                                                    <TextField 
                                                        id="outlined-basic"
                                                        style={{paddingTop: 10, paddingBottom: 10}}
                                                        inputProps={{
                                                            style: {
                                                                height: 40,
                                                                padding: '0 14px',
                                                            },
                                                        }}
                                                        variant="outlined"/>
                                                </FormControl>
                                            </Grid>
                                            <Grid item sm={8} style={{paddingTop: 10}}>
                                                <Button variant="contained" style={{width: '100%', backgroundColor: "#25b1e1", color: "#fff"}} disableElevation>
                                                    Update Password
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sm={6} style={{backgroundColor: '#fcfbf2', color: '#7e7e7d'}}>
                                        <Grid container spacing={2} style={{flex: 1, flexDirection: 'column', margin: 10}}>
                                            <Grid item sm={12}>
                                                <Typography component="div">
                                                    <Box fontWeight="bold">
                                                        Password Requirements
                                                    </Box>
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <Typography component="div" style={{display: 'inline-flex'}}>
                                                    <CheckCircleIcon style={{ color: '#12b906', marginRight: 5}}/>
                                                    <Box fontWeight="fontWeightLight">
                                                        Minimum of 8 character
                                                    </Box>
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <Typography component="div" style={{display: 'inline-flex'}}>
                                                    <CheckCircleIcon style={{ color: '#12b906', marginRight: 5}}/>
                                                    <Box fontWeight="fontWeightLight">
                                                    An UPPERCASE letter
                                                    </Box>
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <Typography component="div" style={{display: 'inline-flex'}}>
                                                    <CheckCircleIcon style={{ color: '#12b906', marginRight: 5}}/>
                                                    <Box fontWeight="fontWeightLight">
                                                        A lowercase letter
                                                    </Box>
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <Typography component="div" style={{display: 'inline-flex'}}>
                                                    <CheckCircleIcon style={{ color: '#12b906', marginRight: 5}}/>
                                                    <Box fontWeight="fontWeightLight">
                                                        A number
                                                    </Box>
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <Typography component="div" style={{display: 'inline-flex'}}>
                                                    <CheckCircleIcon style={{ marginRight: 5}}/>
                                                    <Box fontWeight="fontWeightLight">
                                                        A Symbol
                                                    </Box>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </Fragment>
    )
}

export default ChangePassword