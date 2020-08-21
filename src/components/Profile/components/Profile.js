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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';    
import Box from '@material-ui/core/Box';
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
                            <Grid container style={{overflowY: 'scroll'}}>
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
                                        <FormLabel>Display Name (Username)</FormLabel>
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
                            <Grid container>
                                <Grid item sm={12}>
                                    <Grid container>
                                        <Grid item sm={4}>
                                            <FormControl style={{width: '100%', padding: 10}}>
                                                <FormLabel>Email *</FormLabel>
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
                                </Grid>
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Address</FormLabel>
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
                                        <FormLabel>City</FormLabel>
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
                                        <FormLabel>State</FormLabel>
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
                                        <FormLabel>Primary Phone</FormLabel>
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
                                        <FormLabel>Mobile Phone</FormLabel>
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
                                        <FormLabel>Work Phone</FormLabel>
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
                            <Typography className={classes.heading}>Professional Info</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container>
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Company</FormLabel>
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
                                        <FormLabel>Job Title</FormLabel>
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
                                        <FormLabel>Industry</FormLabel>
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
                        <Typography className={classes.heading}>Investment Backgroud</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container>
                            <Grid item sm={12}>
                                <Grid container>
                                    <Grid item sm={4}>
                                        <FormControl style={{width: '100%', padding: 10}}>
                                            <FormLabel>Are you an accredited investor?</FormLabel>
                                            <RadioGroup aria-label="accredited" name="accredited" value={"1"} onChange={()=> {}} row>
                                                <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="0" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={6}>
                                <FormControl style={{width: '100%', padding: 10}}>
                                    <FormLabel>General Investing Experience</FormLabel>
                                    <RadioGroup aria-label="accredited" name="accredited" value={"1"} onChange={()=> {}} row>
                                        <FormControlLabel value="1" control={<Radio />} label="Alternative assets" />
                                        <FormControlLabel value="0" control={<Radio />} label="Bonds" />
                                        <FormControlLabel value="0" control={<Radio />} label="Direct Real Estate Ownership" />
                                        <FormControlLabel value="0" control={<Radio />} label="Private Equity" />
                                        <FormControlLabel value="0" control={<Radio />} label="REITs" />
                                        <FormControlLabel value="0" control={<Radio />} label="Stocks & Mutual Funds" />
                                        <FormControlLabel value="0" control={<Radio />} label="Venture Capital" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item sm={4}>
                                <FormControl style={{width: '100%', padding: 10}}>
                                    <FormLabel>CRE Investing Experience</FormLabel>
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
                            <Typography className={classes.heading}>Notifications</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container>
                                <Grid item sm={6}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel component="legend">Email Notification</FormLabel>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<Checkbox name="newsletter" />}
                                                label="I would like to receive EnergyNet's weekly market report and newsletter"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox name="marketlease" />}
                                                label="I would like to receive information about upcoming government and market lease sales"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox name="relevantissue" />}
                                                label="I would like to be notified of new and upcoming property sales relevant to my interests"
                                            />
                                            </FormGroup>
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
                        <Typography className={classes.heading}>Employer Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container>
                            <Grid item sm={12}>
                                <Typography component="div">
                                    <Box fontStyle="italic" m={1}>
                                        If registering only as an individual, you may enter "N/A" for these fields.
                                    </Box>
                                </Typography>
                            </Grid>
                            <Grid item sm={12}>
                                <Grid container>
                                    <Grid item sm={2}>
                                        <Typography component="div">
                                            <Box fontWeight="fontWeightBold" m={1}>
                                                Employer / Company Name *
                                            </Box>
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={6}>
                                        <TextField 
                                            id="outlined-basic"
                                            style={{paddingTop: 10, paddingBottom: 10, width: '100%'}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px'
                                                },
                                            }}
                                            variant="outlined"/>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={12}>
                                <Grid container>
                                    <Grid item sm={2}>
                                        <Typography component="div">
                                            <Box fontWeight="fontWeightBold" m={1}>
                                                Employer Address *
                                            </Box>
                                            <Box fontWeight="fontWeightLight" fontSize={12} m={1}>
                                                (Street, City, State, Zip)
                                            </Box>
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={6}>
                                        <TextField 
                                            id="outlined-basic"
                                            style={{paddingTop: 10, paddingBottom: 10, width: '100%'}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px'
                                                },
                                            }}
                                            variant="outlined"/>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={12}>
                            <   Grid container>
                                    <Grid item sm={2}>
                                        <Typography component="div">
                                            <Box fontWeight="fontWeightBold" m={1}>
                                                Job Title *
                                            </Box>
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={6}>
                                        <TextField 
                                            id="outlined-basic"
                                            style={{paddingTop: 10, paddingBottom: 10, width: '100%'}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px'
                                                },
                                            }}
                                            variant="outlined"/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
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