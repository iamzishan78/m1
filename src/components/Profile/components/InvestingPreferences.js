import React, { useContext, useEffect, useState, Fragment, useReducer } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import HelpIcon from '@material-ui/icons/Help';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ThemeProvider, makeStyles  } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';
import { InvestingPreFerencesReducers } from "./reducers";
import { ProfileContext } from "../ProfileContext";
const InvestingPreferences = () => {
    const classes = PanelGeneralStyle();
    const asset_type = [
        'Operated Working Interests',
        'Non-Operated Working Interests',
        'Overriding Royalty Interests',
        'Royalty Interests',
        'Non-Producing Minerals',
        'Oil Properties',
        'Gas Properties',
        'Pipeline',
        'Primary Production',
        'Water Flood',
        'Drilling Prospects',
        'Leases',
        'Other Investment Objective'
    ];
    const basin = [
        'US',
        'Midwest',
        'Northeast',
        'Nortwest',
        'Southeast',
        'Soutwest',
        'Southern',
        'Western'
    ];
    const vehicles = [
        'Funds',
        'Properties'
    ];
    const hold_period = [
        'Less than 1 year',
        '1-2 Years',
        '3-5 Years',
        '6-9 Years',
        '10+ Years'
    ];
    const objectives = [
        'Aggressive',
        'Growth'
    ];
    const expected_total_investment = [
        'Less than $100,000',
        '$100,000 - $249,999',
        '$250,000 - $499,999',
        '$500,000 - $999,999',
        '$1,000,000+'
    ];
    const expected_investment_amount = [
        '$10,000 - $24,999',
        '$25,000 - $49,999',
        '$50,000 - $99,999',
        '$100,000 - $249,999',
        '$250,000 - $499,999',
        '$500,000 - $999,9999',
        '$1,000,000+'
    ];

    const [stateProfile, setStateProfile] = useContext(ProfileContext);
    const [state, dispatch] = useReducer(InvestingPreFerencesReducers, stateProfile.fields);

    useEffect(() => {
        setStateProfile({...stateProfile, fields: {...state} });
    }, [state]);

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
                                <Typography className={classes.heading}>Investing Interests</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2} style={{flex: 1, flexDirection: 'row'}}>
                                    <Grid item sm={3}>
                                        <FormControl style={{width: '100%', padding: 10}}>
                                            <FormLabel component="legend">Asset Type</FormLabel>
                                            <FormGroup>
                                                {
                                                    asset_type.map((item, index) => {
                                                        return(
                                                            <FormControlLabel key={`asset_${index}`}
                                                                control={
                                                                    <Checkbox 
                                                                        key={`asset_${index}`} name={`asset_${index}`} 
                                                                        onChange={e=> dispatch({type:'assetType', value: item})} 
                                                                        checked={typeof state.investingPreferences.InvestingInterests !== "undefined" && 
                                                                            typeof state.investingPreferences.InvestingInterests.assetType !== "undefined" &&
                                                                            state.investingPreferences.InvestingInterests.assetType.includes(item)}
                                                                    />}
                                                                label={item}
                                                            />
                                                        )
                                                      })
                                                }
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item sm={3}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <FormLabel>Basin</FormLabel>
                                            <Autocomplete
                                                id="country-select-demo"
                                                style={{ width: '100%' }}
                                                options={basin}
                                                classes={{
                                                    option: classes.autocompleteOption,
                                                }}
                                                autoHighlight
                                                getOptionLabel={(option) => option}
                                                onChange={e=> dispatch({type:'basin', value: e.target.innerHTML})}
                                                renderInput={(params) => (
                                                    <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                    }}                                                
                                                    />                                                  
                                                )} 
                                                />
                                        </FormControl>
                                    </Grid>
                                    <Grid item sm={3}>
                                        <FormControl style={{width: '100%', padding: 10}}>
                                            <FormLabel component="legend">Vehicles</FormLabel>
                                            <FormGroup>
                                                {
                                                    vehicles.map((item, index) => {
                                                        return(
                                                            <FormControlLabel key={`vehicles_${index}`}
                                                                control={
                                                                    <Checkbox 
                                                                        key={`vehicles_${index}`} 
                                                                        name={`vehicles_${index}`}
                                                                        onChange={e=> dispatch({type:'vehicles', value: item})} 
                                                                        checked={typeof state.investingPreferences.InvestingInterests !== "undefined" && 
                                                                            typeof state.investingPreferences.InvestingInterests.vehicles !== "undefined" &&
                                                                            state.investingPreferences.InvestingInterests.vehicles.includes(item)}
                                                                         />}
                                                                label={item}
                                                            />
                                                        )
                                                      })
                                                }
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item sm={3}>
                                        <FormControl style={{width: '100%', padding: 10}}>
                                            <FormLabel component="legend">Hold Period</FormLabel>
                                            <FormGroup>
                                                { hold_period.map((item, index) => {
                                                        return(
                                                            <FormControlLabel key={`hold_period_${index}`}
                                                                control={
                                                                    <Checkbox 
                                                                        key={`hold_period_${index}`} 
                                                                        name={`hold_period_${index}`}
                                                                        onChange={e=> dispatch({type:'hold_period', value: item})} 
                                                                        checked={typeof state.investingPreferences.InvestingInterests !== "undefined" && 
                                                                            typeof state.investingPreferences.InvestingInterests.holdPeriod !== "undefined" &&
                                                                            state.investingPreferences.InvestingInterests.holdPeriod.includes(item)}
                                                                         />}
                                                                label={item}
                                                            />
                                                        )
                                                      })
                                                }
                                            </FormGroup>
                                        </FormControl>
                                        <FormControl style={{width: '100%', padding: 10}}>
                                            <FormLabel component="legend">Objectives</FormLabel>
                                            <FormGroup>
                                                {
                                                    objectives.map((item, index) => {
                                                        return(
                                                            <FormControlLabel key={`objectives_${index}`}
                                                                    control={<Checkbox 
                                                                    key={`objectives_${index}`} 
                                                                    name={`objectives_${index}`}
                                                                    onChange={e=> dispatch({type:'objectives', value: item})} 
                                                                    checked={typeof state.investingPreferences.InvestingInterests !== "undefined" && 
                                                                        typeof state.investingPreferences.InvestingInterests.objectives !== "undefined" &&
                                                                        state.investingPreferences.InvestingInterests.objectives.includes(item)}
                                                                     />}
                                                                label={item}
                                                            />
                                                        )
                                                      })
                                                }
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
                                <Typography className={classes.heading}>Investment Objectives</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2} style={{flex: 1, flexDirection: 'row'}}>
                                    <Grid item sm={6}>
                                        <Grid container spacing={2} style={{flex: 1, flexDirection: 'column'}}>
                                            <Grid item sm={12}>
                                                <FormControl variant="outlined" className={classes.formControl}>
                                                    <FormLabel>Expected Total Investments in Next Twelve Months</FormLabel>
                                                    <div style={{display:"inline-flex"}}>
                                                        <Select
                                                            native
                                                            variant="outlined"
                                                            inputProps={{
                                                                name: 'total-investment',
                                                                id: 'total-investment',
                                                            }}
                                                            style={{width: '100%'}}
                                                            value={typeof stateProfile.investingPreferences !== "undefined" &&
                                                                typeof stateProfile.investingPreferences.InvestingObjectives !== "undefined" &&
                                                                typeof stateProfile.investingPreferences.InvestingObjectives.expected_total_in_12_months !== "undefined" ?
                                                                stateProfile.investingPreferences.InvestingObjectives.expected_total_in_12_months : "undecided"
                                                            }
                                                            onChange={e=> dispatch({type:'expected_in_12_months', value: e.target.value})}
                                                        >
                                                        <option value={null}>Undecided</option>
                                                        { 
                                                            expected_total_investment.map((item, index) => {
                                                                return(
                                                                    <option key={index} value={item}>{item}</option>
                                                                )
                                                              })
                                                        }
                                                        </Select>
                                                        <HelpIcon style={{fontSize: 40, color: '#8c8c8c', margin: 10}}/>
                                                    </div>
                                                </FormControl>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <FormControl variant="outlined" className={classes.formControl}>
                                                    <FormLabel>Risk Tolerance</FormLabel>
                                                    <div style={{display: "inline-flex"}}>
                                                        <Select
                                                            native
                                                            inputProps={{
                                                                name: 'total-investment',
                                                                id: 'total-investment',
                                                            }}
                                                            style={{width: '100%'}}
                                                            value={ typeof stateProfile.investingPreferences !== "undefined" &&
                                                                typeof stateProfile.investingPreferences.InvestingObjectives !== "undefined" &&
                                                                typeof stateProfile.investingPreferences.InvestingObjectives.risk_tolerance !== "undefined" ?
                                                                stateProfile.investingPreferences.InvestingObjectives.risk_tolerance : "undecided"
                                                            }
                                                            onChange={e=> dispatch({type:'risk_tolerance', value: e.target.value})}
                                                        >
                                                        <option value={null}>Undecided</option>
                                                        <option value={'risk_averse'}>Risk Averse</option>
                                                        <option value={'moderate'}>Moderate</option>
                                                        </Select>
                                                        <HelpIcon style={{fontSize: 40, color: '#8c8c8c', margin: 10}}/>
                                                    </div>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sm={6}>
                                        <Grid container spacing={2} style={{flex: 1, flexDirection: 'column'}}>
                                            <Grid item sm={12}>
                                                <FormControl variant="outlined" className={classes.formControl}>
                                                    <FormLabel>Expected Investments Amount Per Project</FormLabel>
                                                    <div style={{display: "inline-flex"}}>
                                                        <Select
                                                            native
                                                            inputProps={{
                                                                name: 'total-investment',
                                                                id: 'total-investment',
                                                            }}
                                                            style={{width: '100%'}}
                                                            value={ typeof stateProfile.investingPreferences !== "undefined" &&
                                                                typeof stateProfile.investingPreferences.InvestingObjectives !== "undefined" &&
                                                                typeof stateProfile.investingPreferences.InvestingObjectives.expected_per_project !== "undefined" ?
                                                                stateProfile.investingPreferences.InvestingObjectives.expected_per_project : "undecided"
                                                            }
                                                            onChange={e=> dispatch({type:'expected_per_project', value: e.target.value})}
                                                        >
                                                        <option value={null}>Undecided</option>
                                                        { 
                                                            expected_investment_amount.map((item, index) => {
                                                                return(
                                                                    <option key={index} value={item}>{item}</option>
                                                                )
                                                              })
                                                        }
                                                        </Select>
                                                        <HelpIcon style={{fontSize: 40, color: '#8c8c8c', margin: 10}}/>
                                                    </div>
                                                </FormControl>
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