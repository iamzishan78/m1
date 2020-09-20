import React, { useContext, useEffect, useState, Fragment, useReducer, useRef } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import { ThemeProvider } from '@material-ui/core/styles';
import { PanelTheme, PanelGeneralStyle} from '../../../styles/Panel';
import Button from '@material-ui/core/Button';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Card from '@material-ui/core/Card';
import AddIcon from '@material-ui/icons/Add';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import LockIcon from '@material-ui/icons/Lock';
import InputAdornment from '@material-ui/core/InputAdornment';
import { ProfileContext } from "../ProfileContext";
import { ProfileTabReducer } from "./reducers";
import { event } from "jquery";

const InvestingEntities = () => {

    const defaultValues = {
        "entityInformation": "",
        "accountType": "",
        "accredited": "",
        "taxIDSSN": "",
        "entityMembers": [defaultEntityMembersValue],
        "mailingInformation": {
            "address": "",
            "city": "",
            "state": "",
            "postalCode": "",
            "country": ""
        },
        "distributionBankingInformation": ""
    }

    const defaultEntityMembersValue = {
        "firstname": "",
        "lastname": "",
        "role": "",
        "signatory": "",
        "email": ""
    }

    const classes = PanelGeneralStyle();
    const [stateProfile, setStateProfile] = useContext(ProfileContext);
    const [state, dispatch] = useReducer(ProfileTabReducer, stateProfile.fields);
    
    const [entity, setEntity] = useState(defaultValues);
    const [entityMembers, setEntityMembers] = useState([]);
    const [entities, setEntities] = useState([]);
    const [entityContainer, setEntityContainer] = useState([]);
    const [entityMemberContainer, setEntityMemberContainer] = useState([]);
    
    let tempForm = useRef();

    useEffect(()=> {
        setStateProfile({...stateProfile, fields : state});
        const { fields: {
            investingEntities
        }} = stateProfile;

        if (investingEntities.length != 0) {
            displayInvestingEntities(investingEntities);
            setEntity(investingEntities[0]); // Set 0 for now testing
            tempForm.current = investingEntities[0]; // Set 0 for now testing
        }
        console.log(entity);
    },[state]);

    const saveEntity = () => {
        dispatch({type:'investingEntities', value: tempForm.current})
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        switch(name) {
            case 'address':
            case 'city':
            case 'state':
            case 'postalCode':
            case 'country':
                tempForm.current = {...tempForm.current,
                mailingInformation: {
                    ...tempForm.current.mailingInformation, [name]: value
                }}
                break;
            case 'firstname':
            case 'lastname':
            case 'role':
            case 'signatory':
            case 'email':
                // Refactor this section
                tempForm.current = {...tempForm.current,
                    entityMembers: [{...tempForm.current.entityMembers, [name]: value}]
                }
                break;
            default:
                tempForm.current = { ...tempForm.current, [name]: value };
                break;
        }
      };

    const constructEntityMembers = (data) => {
        let temp_entity_member = [...entityMemberContainer];
        // temp_entity_member.push(
            
        // );
        setEntityMemberContainer(temp_entity_member);
    }

    const addNewEntity = () => {
        displayInvestingEntities([defaultValues]);
    }
    
    const displayInvestingEntities = (data) => {
        let temp = [...entityContainer];
        data.forEach(element => {
            temp.push(
                <Fragment key={entities.length}>
                    <Grid item sm={12}>
                        <div style={{float: 'right', width: '25%'}}>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <Button variant="contained" style={{width: '100%'}} onClick={()=> { }}disableElevation>Discard Entity</Button>
                                </Grid>
                                <Grid item sm={6}>
                                    <Button variant="contained" style={{width: '100%'}} onClick={saveEntity} disableElevation>Save Entity</Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                    <Grid item sm={12}>
                        <FormControl style={{width: '100%', padding: 10}}>
                            <FormLabel>Entity Information</FormLabel>
                            <TextField
                                style={{paddingTop: 10, paddingBottom: 10}}
                                inputProps={{
                                    style: {
                                        height: 40,
                                        padding: '0 14px',
                                    },
                                }}
                                name="entityInformation"
                                defaultValue={element.entityInformation}
                                onChange={handleInputChange}
                                variant="outlined"/>
                        </FormControl>
                    </Grid>
                    <Grid item sm={12}>
                        <Grid container spacing={2}>
                            <Grid item sm={4}>
                                <FormControl style={{width: '100%', padding: 10}}>
                                    <FormLabel>Account type</FormLabel>
                                    <TextField 
                                        style={{paddingTop: 10, paddingBottom: 10}}
                                        inputProps={{
                                            style: {
                                                height: 40,
                                                padding: '0 14px',
                                            },
                                        }}
                                        name="accountType"
                                        defaultValue={element.accountType}
                                        onChange={handleInputChange}
                                        variant="outlined"/>
                                </FormControl>
                            </Grid>
                            <Grid item sm={4}>
                                <FormControl style={{width: '100%', padding: 10}}>
                                    <FormLabel>Accredited</FormLabel>
                                    <TextField 
                                        style={{paddingTop: 10, paddingBottom: 10}}
                                        inputProps={{
                                            style: {
                                                height: 40,
                                                padding: '0 14px',
                                            },
                                        }}
                                        name="accredited"
                                        defaultValue={element.accredited}
                                        onChange={handleInputChange}
                                        variant="outlined"/>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={12}>
                        <Grid container>
                            <Grid item sm={4}>
                                <FormControl style={{width: '100%', padding: 10}}>
                                    <FormLabel>Tax ID / SSN</FormLabel>
                                    <TextField 
                                        style={{paddingTop: 10, paddingBottom: 10}}
                                        inputProps={{
                                            style: {
                                                height: 40,
                                                padding: '0 14px',
                                            }
                                        }}
                                        name="taxIDSSN"
                                        onChange={handleInputChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <LockIcon style={{color: '#8c8c8c'}}/>
                                                </InputAdornment>
                                            )
                                        }}
                                        defaultValue={element.taxIDSSN}
                                        variant="outlined"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={12} style={{paddingTop: 20, paddingBottom: 20}}>
                        <Divider />
                    </Grid>
                    <Grid item sm={12}>
                        <Typography component="div">
                            <Box fontWeight="fontWeightBold" m={1}>
                                Entity Members
                            </Box>
                            <Box fontWeight="fontWeightLight" m={1}>
                                Note: New members added to the investing entity will receive an email upon saving .
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item sm={12}>
                        <Grid container spacing={2}>
                        <Grid item sm={4}>
                            <Card>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item sm={6}>
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
                                                    name="firstname"
                                                    onChange={handleInputChange}
                                                    variant="outlined"/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={6}>
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
                                                    name="lastname"
                                                    onChange={handleInputChange}
                                                    variant="outlined"/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <FormControl style={{width: '100%', padding: 10}}>
                                                <FormLabel>Role *</FormLabel>
                                                <TextField 

                                                    style={{paddingTop: 10, paddingBottom: 10}}
                                                    inputProps={{
                                                        style: {
                                                            height: 40,
                                                            padding: '0 14px',
                                                        },
                                                    }}
                                                    name="role"
                                                    onChange={handleInputChange}
                                                    variant="outlined"/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <FormControl style={{width: '100%', padding: 10}}>
                                                <FormLabel>Signatory *</FormLabel>
                                                <TextField 

                                                    style={{paddingTop: 10, paddingBottom: 10}}
                                                    inputProps={{
                                                        style: {
                                                            height: 40,
                                                            padding: '0 14px',
                                                        },
                                                    }}
                                                    name="signatory"
                                                    onChange={handleInputChange}
                                                    variant="outlined"/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={12}>
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
                                                    name="email"
                                                    onChange={handleInputChange}
                                                    variant="outlined"/>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                            <Grid item sm={4}>
                                <Card style={{flex: 1, display: 'flex', 
                                                justifyContent: 'center', 
                                                backgroundColor: '#f3f2f3', 
                                                minHeight: '100%', 
                                                textAlign:"center"}}
                                        onClick={()=> {
                                            constructEntityMembers(element.entityMembers);
                                        }}>
                                    <CardContent style={{color: '#969696', display: 'inline-flex', alignItems: 'center'}}>
                                        <AddIcon style={{margin: '2px'}}/>
                                        <Typography component="div" >
                                        <Box fontStyle="bold" fontSize={20}>
                                            Add Member
                                        </Box>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={12} style={{paddingTop: 20, paddingBottom: 20}}>
                        <Divider />
                    </Grid>
                    <Grid item sm={12}>
                        <Typography component="div">
                            <Box fontWeight="fontWeightBold" m={1}>
                                Mailing Information
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item sm={12}>
                        <Grid container spacing={2}>
                            <Grid item sm={4}>
                                <FormControl style={{width: '100%', padding: 10}}>
                                    <FormLabel>Address *</FormLabel>
                                    <TextField 
                                        style={{paddingTop: 10, paddingBottom: 10}}
                                        inputProps={{
                                            style: {
                                                height: 40,
                                                padding: '0 14px',
                                            },
                                        }}
                                        name="address"
                                        defaultValue={element.mailingInformation.address}
                                        onChange={handleInputChange}
                                        variant="outlined"/>
                                </FormControl>
                            </Grid>
                            <Grid item sm={4}>
                                <FormControl style={{width: '100%', padding: 10}}>
                                    <FormLabel>City *</FormLabel>
                                    <TextField 
                                        style={{paddingTop: 10, paddingBottom: 10}}
                                        inputProps={{
                                            style: {
                                                height: 40,
                                                padding: '0 14px',
                                            },
                                        }}
                                        name="city"
                                        defaultValue={element.mailingInformation.city}
                                        onChange={handleInputChange}
                                        variant="outlined"/>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={12}>
                        <Grid container spacing={2}>
                            <Grid item sm={4}>
                                <FormControl style={{width: '100%', padding: 10}}>
                                    <FormLabel>State *</FormLabel>
                                    <TextField 
                                        style={{paddingTop: 10, paddingBottom: 10}}
                                        inputProps={{
                                            style: {
                                                height: 40,
                                                padding: '0 14px',
                                            },
                                        }}
                                        name="state"
                                        defaultValue={element.mailingInformation.state}
                                        onChange={handleInputChange}
                                        variant="outlined"/>
                                </FormControl>
                            </Grid>
                            <Grid item sm={4}>
                                <FormControl style={{width: '100%', padding: 10}}>
                                    <FormLabel>Zip or Postal Code *</FormLabel>
                                    <TextField 
                                        style={{paddingTop: 10, paddingBottom: 10}}
                                        inputProps={{
                                            style: {
                                                height: 40,
                                                padding: '0 14px',
                                            },
                                        }}
                                        name="postalCode"
                                        defaultValue={element.mailingInformation.postalCode}
                                        onChange={handleInputChange}
                                        variant="outlined"/>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={12}>
                        <Grid container spacing={2}>
                            <Grid item sm={4}>
                                <FormControl style={{width: '100%', padding: 10}}>
                                    <FormLabel>Country *</FormLabel>
                                    <TextField 
                                        style={{paddingTop: 10, paddingBottom: 10}}
                                        inputProps={{
                                            style: {
                                                height: 40,
                                                padding: '0 14px',
                                            },
                                        }}
                                        name="country"
                                        defaultValue={element.mailingInformation.country}
                                        onChange={handleInputChange}
                                        variant="outlined"/>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={12} style={{paddingTop: 20, paddingBottom: 20}}>
                        <Divider />
                    </Grid>
                    <Grid item sm={12}>
                        <Typography component="div">
                            <Box fontWeight="fontWeightBold" m={1}>
                                Distribution Banking Information
                            </Box>
                            <Box fontWeight="fontWeightLight" fontSize={10} m={1}>
                                Note: Preferred Payment Method
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item sm={12}>
                        <Grid container spacing={2}>
                        <   Grid item sm={4}>
                                <FormControl style={{width: '100%', padding: 10}}>
                                    <FormLabel>Mail *</FormLabel>
                                    <TextField 
                                        style={{paddingTop: 10, paddingBottom: 10}}
                                        inputProps={{
                                            style: {
                                                height: 40,
                                                padding: '0 14px',
                                            },
                                        }}
                                        name="distributionBankingInformation"
                                        defaultValue={element.distributionBankingInformation}
                                        onChange={handleInputChange}
                                        variant="outlined"/>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Fragment>
            )
        });
        setEntityContainer(temp);
    }

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
                                <Grid container>
                                    { 
                                        entityContainer
                                    }
                                    <Grid item sm={12}>
                                        <Button variant="contained" style={{width: '100%'}} onClick={addNewEntity} disableElevation>
                                            <AddIcon style={{margin: '2px'}}/>
                                            Add Entity</Button>
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

export default InvestingEntities