import React, { useContext, useEffect, useState, Fragment } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { ThemeProvider } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';

const FinancialQualification = () => {
    const classes = PanelGeneralStyle();
    
    return(
        <Fragment>
            <ThemeProvider theme={PanelTheme}>
                <Grid container spacing={2} className={classes.root}>
                    <Grid item sm={12} style={{backgroundColor: '#f9f9f9'}}>
                        <Typography component="div">
                            <Box fontWeight="bold">
                                SEC 506(d) You must certify that you are an accredited investor. Choose which of the following options apply to you.
                                You may check more than one: *
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item sm={12}>
                        <FormControl style={{width: '100%'}}>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox key="1" color='primary' name="new_offerings" />}
                                    label={"I alone, or in combination with my spouse, have net worth of $1,000,000. Net worth for this purpose means the fair market" +
                                           "value of such person's total assets less such person's total liabilities; provided, that: (i) such person must excluded the value of his" +
                                           "primary residence as an assets; and (ii) such person may generally excluded the amount of indebtedness secured by his primary residence"}
                                    labelPlacement="end"
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
                </Grid>
            </ThemeProvider>
        </Fragment>
    )
}

export default FinancialQualification