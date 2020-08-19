import React, { useContext, useEffect, useState, Fragment } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import { ThemeProvider, makeStyles  } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';

const InvestingPreferences = () => {
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
                                <Typography className={classes.heading}>Investing Entities</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2} style={{flex: 1, flexDirection: 'row'}}>
                                    <Grid item sm={3}>
                                        <h3>Asset Type</h3>
                                    </Grid>
                                    <Grid item sm={3}>
                                        <h3>Region</h3>
                                    </Grid>
                                    <Grid item sm={3}>
                                        <h3>Market & vehicles</h3>
                                    </Grid>
                                    <Grid item sm={3}>
                                        <h3>Hold period & Objectives</h3>
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
                                <Typography className={classes.heading}>Investing Entities</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2} style={{flex: 1, flexDirection: 'row'}}>
                                    <Grid item sm={6}>
                                        <Grid container spacing={2} style={{flex: 1, flexDirection: 'column'}}>
                                            <Grid item sm={6}>
                                                <h3>Expected</h3>
                                            </Grid>
                                            <Grid item sm={6}>
                                                <h3>Tolerance</h3>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sm={6}>
                                        <Grid container spacing={2} style={{flex: 1, flexDirection: 'column'}}>
                                            <Grid item sm={12}>
                                                <h3>Investment</h3>
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

export default InvestingPreferences