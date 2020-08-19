import React, { useContext, useEffect, useState, Fragment } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import { ThemeProvider } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';

const Profile = () => {
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
                            <Typography className={classes.heading}>Personal Identification</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container>
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>First Name *</FormLabel>
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
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Middle Name *</FormLabel>
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
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Last Name *</FormLabel>
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

                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Display Name</FormLabel>
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
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>SSS / Tax ID</FormLabel>
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
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Date of Birth</FormLabel>
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


                            </Grid>    
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item sm={12}>
                    <Accordion className={classes.panels} >
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                            <Typography className={classes.heading}>Contact Info</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item sm={12}>
                    <Accordion className={classes.panels} >
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                            <Typography className={classes.heading}>Professional Info</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item sm={12}>
                    <Accordion className={classes.panels} >
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                            <Typography className={classes.heading}>Investment Backgroud</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item sm={12}>
                    <Accordion className={classes.panels} >
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                            <Typography className={classes.heading}>Notifications</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item sm={12}>
                    <Accordion className={classes.panels} >
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                            <Typography className={classes.heading}>Employer Information</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item sm={2}>
                    <Typography style={{color: 'red', fontSize: '15px', fontWeight: 'bold'}}>*required</Typography>
                </Grid>
            </Grid>
        </ThemeProvider>
    </Fragment>
    )
}

export default Profile