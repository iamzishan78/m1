import React, { useContext, useReducer, Fragment, useEffect} from "react";
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
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';    
import Box from '@material-ui/core/Box';
import LockIcon from '@material-ui/icons/Lock';
import InputAdornment from '@material-ui/core/InputAdornment';
import { ThemeProvider } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';
import { ProfileContext } from "../ProfileContext";
import { ProfileTabReducer } from "./reducers";
import EventIcon from '@material-ui/icons/Event';
import validateDate from "validate-date";
const Profile = (props) => {
   
    const [stateProfile, setStateProfile] = useContext(ProfileContext);
    const [state, dispatch] = useReducer(ProfileTabReducer, stateProfile.fields);
    const classes = PanelGeneralStyle();

    useEffect(() => {
        const fullname = `${state.firstname} ${state.middlename} ${state.lastname}`;
        setStateProfile({...stateProfile, fields : {...state, fullname}});
    }, [state]);

    const formatPhone = (number) => {
        const formatted = `${number}`.replace(/\D/g, "");
        const match = formatted.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return number;
      };

    const industry_list = [
        'Computer Software',
        'Construction',
        'Engineering',
        'Entertainment',
        'Financial Services & Banking',
        'Government',
        'Government Contracting',
        'Healthcare',
        'Hospitality',
        'Information Technology Services',
        'Insurance',
        'Legal',
        'Management Consulting',
        'Marketing & Advertising',
        'No Industry Selected'
    ];
    const investment_experience = [
        'Alternative assets',
        'Bonds',
        'Direct Real Estate Ownership',
        'Private Equity',
        'REITs',
        'Stocks & Mutual Funds',
        'Venture Capital'
    ];

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
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },
                                            }}
                                            onChange={e=>dispatch({type:'firstname', value: e.target.value})}
                                            value={state.firstname !== null ? state.firstname : ""}
                                            variant="outlined"/>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Middle Name *</FormLabel>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },
                                            }}
                                            onChange={e=>dispatch({type:'middlename', value: e.target.value})}
                                            value={state.middlename !== null ? state.middlename : ""}
                                            variant="outlined"/>
                                    </FormControl>
                                </Grid> 
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Last Name *</FormLabel>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },
                                            }}
                                            onChange={e=>dispatch({type:'lastname', value: e.target.value})}
                                            value={state.lastname !== null ? state.lastname : ""}
                                            variant="outlined"/>
                                    </FormControl>
                                </Grid>

                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Display Name (Username)</FormLabel>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },
                                            }}
                                            onChange={e=>dispatch({type:'displayname', value: e.target.value})}
                                            value={state.displayName !== null ? state.displayName : ""}
                                            variant="outlined"/>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>SSS / Tax ID</FormLabel>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                }
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <LockIcon style={{color: '#8c8c8c'}}/>
                                                    </InputAdornment>
                                                )
                                            }}
                                            onChange={e=>dispatch({type:'sss_tax_id', value: e.target.value})}
                                            value={state.sss_tax_id !== null ? state.sss_tax_id : ""}
                                            variant="outlined"
                                            />
                                    </FormControl>
                                </Grid> 
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Date of Birth</FormLabel>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            placeholder="MM/DD/YYYY"
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },

                                            }}
                                            InputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <EventIcon style={{color: '#8c8c8c'}}/>
                                                    </InputAdornment>
                                                )
                                            }}
                                            onChange={e=>dispatch({type:'dateOfBirth', value: e.target.value})}
                                            value={state.dateOfBirth}
                                            error={!validateDate(state.dateOfBirth, "boolean", "mm/dd/yyyy")}
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
    
                                                    style={{paddingTop: 10, paddingBottom: 10}}
                                                    inputProps={{
                                                        style: {
                                                            height: 40,
                                                            padding: '0 14px',
                                                        },
                                                    }}
                                                    value={state.email}
                                                    disabled
                                                    // onChange={e=> dispatch({type: 'email', value: e.target.value})}
                                                    variant="outlined"/>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Address</FormLabel>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },
                                            }}
                                            onChange={e=>dispatch({type:'address', value: e.target.value})}
                                            value={state.address}
                                            variant="outlined"/>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>City</FormLabel>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },
                                            }}
                                            onChange={e=>dispatch({type:'city', value: e.target.value})}
                                            value={state.city}
                                            variant="outlined"/>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>State</FormLabel>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },
                                            }}
                                            onChange={e=>dispatch({type:'state', value: e.target.value})}
                                            value={state.state}
                                            variant="outlined"/>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Primary Phone</FormLabel>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },
                                            }}
                                            value={formatPhone(state.phone)}
                                            onChange={e=> dispatch({type: 'phone', value: e.target.value})}
                                            variant="outlined"/>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Mobile Phone</FormLabel>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },
                                            }}
                                            onChange={e=>dispatch({type:'mobilephone', value: e.target.value})}
                                            value={formatPhone(state.mobilephone)}
                                            variant="outlined"/>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Work Phone</FormLabel>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },
                                            }}
                                            onChange={e=>dispatch({type:'workphone', value: e.target.value})}
                                            value={formatPhone(state.workphone !== null ? state.workphone : "")}
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
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },
                                            }}
                                            onChange={e=>dispatch({type:'company', value: e.target.value})}
                                            value={state.company}
                                            variant="outlined"/>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Job Title</FormLabel>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px',
                                                },
                                            }}
                                            onChange={e=>dispatch({type:'jobTitle', value: e.target.value})}
                                            value={state.jobTitle}
                                            variant="outlined"/>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4}>
                                    <FormControl style={{width: '100%', padding: 10}}>
                                        <FormLabel>Industry</FormLabel>
                                        <FormControl variant="outlined" className={classes.formControl} style={{paddingTop: 10}}>
                                            <Select
                                                native
                                                inputProps={{
                                                    name: 'industry',
                                                    id: 'industry',
                                                    style: {
                                                        height: 40,
                                                        padding: '0 14px'
                                                    }
                                                }}
                                                onChange={e=>dispatch({type:'industry', value: e.target.value})}
                                                value={state.industry !== null ? state.industry : ""}
                                                style={{width: '100%'}}
                                            >
                                                { 
                                                    industry_list.map((item, index) => {
                                                        return(
                                                            <option key={`industry_${index}`} value={index}>{item}</option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
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
                                            <RadioGroup 
                                                aria-label="accredited" 
                                                name="accredited"
                                                onChange={e=>dispatch({type:'isAccreditedInvestor', value: e.target.value})}
                                                value={state.isAccreditedInvestor} row
                                            >
                                                <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="0" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={6}>
                                <FormControl style={{width: '100%', padding: 10}}>
                                    <FormLabel component="legend">General Investing Experience</FormLabel>
                                    <FormGroup>
                                        {
                                            investment_experience.map((item, index)=> {
                                                return(
                                                    <FormControlLabel
                                                        key={index}
                                                        control={
                                                            <Checkbox 
                                                                key={index} 
                                                                name={item}
                                                                value={item}
                                                                onChange={e=>dispatch({type:'investingExperience', value: e.target.value})}
                                                                checked={state.investingExperience !== null && 
                                                                        state.investingExperience.includes(item)}
                                                            />}
                                                        label={item}
                                                    />
                                                )
                                            })
                                        }
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                            <Grid item sm={4}>
                                <FormControl style={{width: '100%', padding: 10}}>
                                    <FormLabel>CRE Investing Experience</FormLabel>
                                    <FormControl variant="outlined" className={classes.formControl} style={{paddingTop: 10}}>
                                            <Select
                                                native
                                                inputProps={{
                                                    name: 'industry',
                                                    id: 'industry',
                                                    style: {
                                                        height: 40,
                                                        padding: '0 14px'
                                                    }
                                                }}
                                                onChange={e=>dispatch({type:'CREexperience', value: e.target.value})}
                                                value={state.CREexperience}
                                                style={{width: '100%'}}
                                            >
                                            <option value="none">None</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="extensive">Extensive</option>
                                            </Select>
                                        </FormControl>
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
                                                control={
                                                <Checkbox 
                                                    name="newsletter"
                                                    value="newsletter"
                                                    onChange={e=>dispatch({type:'emailNotifications', value: e.target.value})}
                                                    checked={state.emailNotifications !== null && 
                                                            state.emailNotifications.includes("newsletter")}
                                                 />}
                                                label="I would like to receive EnergyNet's weekly market report and newsletter"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox 
                                                        name="marketlease"
                                                        value="marketlease"
                                                        onChange={e=>dispatch({type:'emailNotifications', value: e.target.value})}
                                                        checked={state.emailNotifications !== null && 
                                                                state.emailNotifications.includes("marketlease")}
                                                    />}
                                                label="I would like to receive information about upcoming government and market lease sales"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox 
                                                        name="relevantissue"
                                                        value="relevantissue"
                                                        onChange={e=>dispatch({type:'emailNotifications', value: e.target.value})}
                                                        checked={state.emailNotifications !== null && 
                                                                state.emailNotifications.includes("relevantissue")}
                                                     />}
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
                                            style={{paddingTop: 10, paddingBottom: 10, width: '100%'}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px'
                                                },
                                            }}
                                            value={state.employer}
                                            onChange={e=>dispatch({type:'employer', value: e.target.value})}
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
                                    <Grid item sm={4}>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10, width: '100%'}}
                                            multiline
                                            value={state.employerAddress}
                                            onChange={e=>dispatch({type:'employerAddress', value: e.target.value})}

                                            rows={5}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px'
                                                },
                                            }}
                                            variant="outlined"/>
                                    </Grid>
                                    <Grid item sm={2}>
                                        <FormControl style={{width: '100%', padding: 10}}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox 
                                                            name="address"
                                                            onChange={e=>dispatch({type:'isSameFromAbove'})}
                                                            checked={state.isSameFromAbove !== null && state.isSameFromAbove}
                                                         />}
                                                    label="Same as above"
                                                />
                                                </FormGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={12}>
                                <Grid container>
                                    <Grid item sm={2}>
                                        <Typography component="div">
                                            <Box fontWeight="fontWeightBold" m={1}>
                                                Job Title *
                                            </Box>
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={6}>
                                        <TextField 
                                            style={{paddingTop: 10, paddingBottom: 10, width: '100%'}}
                                            inputProps={{
                                                style: {
                                                    height: 40,
                                                    padding: '0 14px'
                                                },
                                            }}
                                            value={state.job_title !== null ? state.job_title : ""}
                                            onChange={e=>dispatch({type:'job_title', value: e.target.value})}
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