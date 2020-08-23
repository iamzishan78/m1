import React, { useContext, useEffect, useState, Fragment } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { ThemeProvider } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';

const InvestorDocuments = () => {
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
                                <Typography className={classes.heading}>Investor Documents</Typography>
                            </AccordionSummary>
                            <AccordionDetails style={{margin: 20}}>
                                <Grid container spacing={2}>
                                    <Grid item sm={12}>
                                        <Grid container style={{justifyContent: 'center'}}>
                                            <Grid item sm={3}>
                                                <Button variant="contained" style={{width: '100%', backgroundColor: "#25b1e1", color: "#fff"}} disableElevation>
                                                    Upload Documents
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Grid container style={{justifyContent: 'center', textAlign: 'center'}}>
                                            <Grid item sm={3}>
                                                <Typography variant="subtitle1" style={{color: '#8c8c8c'}}>
                                                    Maximum file: 2MB
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sm={12} style={{backgroundColor: '#f9f9f9'}}>
                                        <div style={{textAlign: 'center', padding: 20}}>
                                            <Typography variant="subtitle1" style={{color: '#8c8c8c'}}>
                                                No documents found.
                                            </Typography>
                                        </div>
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

export default InvestorDocuments