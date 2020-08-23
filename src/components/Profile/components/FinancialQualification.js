import React, { useContext, useEffect, useState, Fragment } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { ThemeProvider } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';

const FinancialQualification = () => {
    const classes = PanelGeneralStyle();
    const annual_income = [
        'Select One',
        '$0 to $199,999',
        '$200,000 to $299,999',
        '$300,000 to $499,999',
        '$500,000 to $999,999',
        '$1,000,000 or higher'
    ];
    const approximate_net_worth = [
        'Select One',
        '$0 to $499,999',
        '$500,000 to $999,999',
        '$1,000,000 to $1,499,999',
        '$1,500,000 to $1,999,999',
        '$2,000,000 to $4,999,999',
        '$5,000,000 or higher'
    ];
    const approximate_liquid_net_worth = [
        'Select One',
        '$0 to $24,999',
        '$25,000 to $49,999',
        '$50,000 to $99,999',
        '$100,000 to $249,999',
        '$250,000 to $499,999',
        '$500,000 to $999,999',
        '$1,000,000 or higher'
    ];
    
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
                    <Grid item sm={12} style={{backgroundColor: '#f9f9f9'}}>
                        <Typography component="div">
                            <Box fontWeight="bold">
                                You must certify your oil and gas industry experience and agree to the statement below: *
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item sm={12}>
                        <FormControl style={{width: '100%'}}>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox key="1" color='primary' name="new_offerings" />}
                                    label={"I am / My company engaged in the business of exploring for or producing oil or gas or other minerals as an ongoing business."}
                                    labelPlacement="end"
                                />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <Grid item sm={12} style={{backgroundColor: '#f9f9f9'}}>
                        <Typography component="div">
                            <Box fontWeight="bold">
                                Please detail your investment experience. You may select more than one option: *
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item sm={12}>
                        <FormControl style={{width: '100%'}}>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox key="1" color='primary'/>}
                                    label={"At least 70% of annual income derived from oil and gas exploration and/or production"}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    control={<Checkbox key="2" color='primary'/>}
                                    label={"Have been an oil and gas well operator for 3 or more years"}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    control={<Checkbox key="3" color='primary'/>}
                                    label={"Have been a non-operated working interest owner for 5 or more years"}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    control={<Checkbox key="4" color='primary'/>}
                                    label={"During one of the last two years earned $300,000 from oil and gas investments"}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    control={<Checkbox key="5" color='primary'/>}
                                    label={"Currently act as bonded operator for at least 10 producing oil or gas wells"}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    control={<Checkbox key="6" color='primary'/>}
                                    label={"Currently employed as an investment advisor"}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    control={<Checkbox key="7" color='primary'/>}
                                    label={"Currently hold FINRA or other securities license"}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    control={<Checkbox key="8" color='primary'/>}
                                    label={"Other oil and gas investment experience"}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    control={<Checkbox key="9" color='primary'/>}
                                    label={"None of the above describe my investment experience"}
                                    labelPlacement="end"
                                />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <Grid item sm={12} style={{backgroundColor: '#f9f9f9'}}>
                        <Typography component="div">
                            <Box fontWeight="bold">
                                The following financial detail is required. Please use your personal information if you are registering as an 
                                individual or your business income if you are registering as a business representative
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item sm={12}>
                        <Grid container spacing={2}>
                            <Grid item sm={3} style={{textAlign: 'right'}}>
                                <Typography component="div">
                                    <Box fontWeight="fontWeightBold" m={1}>
                                        Annual Income *
                                    </Box>
                                </Typography>
                            </Grid>
                            <Grid item sm={9}>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <Select
                                        native
                                        inputProps={{
                                            name: 'total-investment',
                                            id: 'total-investment',
                                            style: {
                                                height: 40,
                                                padding: '0 14px'
                                            }
                                        }}
                                        style={{width: '100%'}}
                                    >
                                        { 
                                            annual_income.map((item, index) => {
                                                return(
                                                    <option value={index}>{item}</option>
                                                )
                                                })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={12}>
                        <Grid container spacing={2}>
                            <Grid item sm={3} style={{textAlign: 'right'}}>
                                <Typography component="div">
                                    <Box fontWeight="fontWeightBold" m={1}>
                                        Approximate Net Worth (excluding residence) *
                                    </Box>
                                </Typography>
                            </Grid>
                            <Grid item sm={9}>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <Select
                                        native
                                        inputProps={{
                                            name: 'total-investment',
                                            id: 'total-investment',
                                            style: {
                                                height: 40,
                                                padding: '0 14px'
                                            }
                                        }}
                                        style={{width: '100%'}}
                                    >
                                        { 
                                            approximate_net_worth.map((item, index) => {
                                                return(
                                                    <option value={index}>{item}</option>
                                                )
                                                })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={12}>
                        <Grid container spacing={2}>
                            <Grid item sm={3} style={{textAlign: 'right'}}>
                                <Typography component="div">
                                    <Box fontWeight="fontWeightBold" m={1}>
                                        Approximate Liquid Net Worth (cash, stocks etc.) *
                                    </Box>
                                </Typography>
                            </Grid>
                            <Grid item sm={9}>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <Select
                                        native
                                        inputProps={{
                                            name: 'total-investment',
                                            id: 'total-investment',
                                            style: {
                                                height: 40,
                                                padding: '0 14px'
                                            }
                                        }}
                                        style={{width: '100%'}}
                                    >
                                        { 
                                            approximate_liquid_net_worth.map((item, index) => {
                                                return(
                                                    <option value={index}>{item}</option>
                                                )
                                                })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid> 
                </Grid>
            </ThemeProvider>
        </Fragment>
    )
}
export default FinancialQualification