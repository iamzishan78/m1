import React, { useContext, useEffect, useState, Fragment } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from "@material-ui/core/FormControl";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from "@material-ui/core/Grid";
import { ThemeProvider } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';

const EmailPreferences = () => {
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
                                <Typography className={classes.heading}>Marketing Emails</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item sm={12}>
                                        <Grid container>
                                            <Grid item sm={1} style={{paddingTop: 10}}>
                                                <Typography variant="subtitle1" style={{textDecoration: 'underline', color: '#14abdf'}}>
                                                    Select All
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={1} style={{paddingTop: 10}}>
                                                <Typography variant="subtitle1" style={{textDecoration: 'underline', color: '#14abdf'}}>
                                                    Unselect All
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <FormControl style={{width: '100%'}}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={<Checkbox key="1" color='primary' name="new_offerings" />}
                                                    label={"New Offering Announcements"}
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox key="2" color='primary' name="usability_input" />}
                                                    label={"Usability Input & Feedback"}
                                                />
                                                <Typography variant="caption" style={{color: '#8c8c8c', paddingLeft: '32px'}} gutterBottom>
                                                    Receive occassional questionnaire requesting input to help improve and enhance usability.
                                                </Typography>
                                                <FormControlLabel
                                                    control={<Checkbox key="3" color='primary' name="weekly_investor" />}
                                                    label={"Weekly Investor Digest"}
                                                />
                                                <Typography variant="caption" style={{color: '#8c8c8c', paddingLeft: '32px'}} gutterBottom>
                                                    Distributed every Wednesday, this email provides a comprehensive overview of the previous week on the marketplace as well as highlights of important events.
                                                </Typography>
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Divider/>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <FormControl style={{width: '100%'}}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={<Checkbox key="1" name="opt_out" />}
                                                    label={"Opt out of all non-transactional emails"}
                                                />
                                            </FormGroup>
                                        </FormControl>
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

export default EmailPreferences