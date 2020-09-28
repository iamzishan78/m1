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
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton, Tooltip } from "@material-ui/core";
import { event } from "jquery";

const InvestingEntities = () => {

    const defaultEntityMembersValue = [{
        "firstname": "",
        "lastname": "",
        "role": "",
        "signatory": "",
        "email": ""
    }];
    
    const defaultValues = {
        "entityInformation": "",
        "accountType": "",
        "accredited": "",
        "taxIDSSN": "",
        "entityMembers": [],
        "mailingInformation": {
            "address": "",
            "city": "",
            "state": "",
            "postalCode": "",
            "country": ""
        },
        "distributionBankingInformation": ""
    }

    const classes = PanelGeneralStyle();
    const [stateProfile, setStateProfile] = useContext(ProfileContext);
    const [state, dispatch] = useReducer(ProfileTabReducer, stateProfile.fields);
    const [disabledButton, setDisabledButton] = useState(true);
    const [entities, setEntities] = useState([]);
    const [entityContainer, setEntityContainer] = useState([]);

    let tempForm = useRef();
    let membersTemp = defaultEntityMembersValue[0];
    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        switch(name) {
            case 'address':
            case 'city':
            case 'state':
            case 'postalCode':
            case 'country':
         
                tempForm.current[index] = {...tempForm.current[index],
                mailingInformation: {
                    ...tempForm.current[index].mailingInformation, [name]: value
                }}
                break;
            case 'firstname':
            case 'lastname':
            case 'role':
            case 'signatory':
            case 'email':
                // tempForm.current[index] = {...tempForm.current[index],
                //     entityMembers: [...tempForm.current[index].entityMembers, {
                //         ...tempForm.current[index].entityMembers[selectedEntityMembers], [name]: value
                //     }]}
                membersTemp = {...membersTemp, [name]: value};
                if(membersTemp.firstname === "" && membersTemp.lastname === "" && membersTemp.email === ""){
                    setDisabledButton(true);
                }else{
                     setDisabledButton(false);
                    }
                break;
            default:
                tempForm.current[index] = { ...tempForm.current[index], [name]: value };
                break;
        }
      };

    const constructEntityMembers = (data, key) => {
        const temp = [...entities[key].entityMembers];
        temp.push(membersTemp);
        const entTemp = [...entities];
        entTemp[key].entityMembers = temp;
        setEntities(entTemp);
    }


    const addNewEntity = () => {
        const entitiesTemp = [...entities];
        entitiesTemp.push(defaultValues);
        setEntities(entitiesTemp);
    }


    const discardEntity = (index) => {
        if(entities.length > 1){
            entities.splice(index, 1);
            setEntities([...entities]);
        }else{
            setEntities([]); 
        }
    }


    const saveEntity = (index) => {
        const entitiesTemp = tempForm.current;
        setEntities([...entitiesTemp]);
        dispatch({type:'investingEntities', value: [...entitiesTemp]});
    }
    

    useEffect(()=> {
        setStateProfile({...stateProfile, fields : state});
    },[state]);


    useEffect(() => {
        if (entities.length !== 0) {
            //console.log("Entities rendered: ",entities);
            tempForm.current = [...entities];
        }
        displayInvestingEntities([...entities]);
    }, [entities]);

    useEffect( () => {
        const { fields: {
            investingEntities
        }} = stateProfile;

        const temp = [];
        if(investingEntities.length > 0){
            investingEntities.forEach((entity, index) => {
                const members = entity.entityMembers !== null ? entity.entityMembers : [];
                temp.push({...entity, entityMembers: members})
            })
        }
        setEntities(temp);
    },[]);

    const displayInvestingEntities = (data) => {
        const temp = [];
        data.forEach((element, index) => {
            temp.push(
                <Fragment key={`entity_${index}`}>
                    
                    <Grid item sm={12}>
                        <FormControl style={{width: '100%', padding: 10}}>
                        <Grid container spacing={2}>
                            <Grid item md={12}>
                                <FormLabel><strong>Entity Information ({index+1}) </strong></FormLabel>
                                <Tooltip
                                    placement="top"
                                    title="Discard Entity"
                                >
                                    <IconButton 
                                        variant="contained"
                                        onClick={()=>  discardEntity(index) }
                                    >
                                        <DeleteIcon color="primary"/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
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
                                onChange={e => handleInputChange(e, index)}
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
                                        onChange={e => handleInputChange(e, index)}
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
                                        onChange={e => handleInputChange(e, index)}
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
                                        onChange={e => handleInputChange(e, index)}
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
                                                    onChange={e => handleInputChange(e, index)}
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
                                                    onChange={e => handleInputChange(e, index)}
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
                                                    onChange={e => handleInputChange(e, index)}
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
                                                    onChange={e => handleInputChange(e, index)}
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
                                                    onChange={e => handleInputChange(e, index)}
                                                    variant="outlined"/>
                                            </FormControl>
                                            <FormControl style={{width: '100%', padding: 10}}>
                                                <Tooltip placement="top" title={disabledButton ? "Don't leave empty fields" : ""}>
                                                    <Button
                                                        startIcon={<AddIcon style={{margin: '2px'}}/>}
                                                        onClick={()=> {
                                                            constructEntityMembers(element.entityMembers, index);
                                                        }}
                                                        disabled={disabledButton}
                                                    > 
                                                        Add Member
                                                    </Button>
                                                </Tooltip>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                            <Grid item sm={8}>
                                <Card 
                                style={{flex: 1, display: 'flex', 
                                                // justifyContent: 'center', 
                                                backgroundColor: '#f3f2f3', 
                                                minHeight: '100%', 
                                                textAlign:"center"}}
                                >
                                    {/* <CardContent style={{color: '#969696', display: 'inline-flex', alignItems: 'center', cursor:"pointer"}}> */}
                                    <CardContent>
                                        <Grid container spacing={1} >
                                        {element.entityMembers.length > 0 ?
                                            element.entityMembers.map((entity, key) => {
                                            return (
                                                    <Grid item md={12} key={key}>
                                                        <Typography>({key+1}) {entity.firstname} {entity.lastname}, {entity.email}</Typography>
                                                    </Grid>
                                            )})
                                        : <Typography variant="caption"> No entity members listed. Fill up the following fields (left) to add a member. </Typography>
                                    }
                                        </Grid>
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
                                        onChange={e => handleInputChange(e, index)}
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
                                        onChange={e => handleInputChange(e, index)}
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
                                        onChange={e => handleInputChange(e, index)}
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
                                        onChange={e => handleInputChange(e, index)}
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
                                        onChange={e => handleInputChange(e, index)}
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
                                        onChange={e => handleInputChange(e, index)}
                                        variant="outlined"/>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider/>
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
                                <Grid container spacing={2}>
                                    { 
                                        entityContainer
                                    }
                                    <Grid item sm={6}>
                                        <Button 
                                            variant="contained" 
                                            fullWidth 
                                            onClick={addNewEntity}
                                            disableElevation
                                        >
                                            <AddIcon style={{margin: '2px'}}/>
                                            Add Entity
                                        </Button>
                                    </Grid>
                                    <Grid item sm={6}>
                                        <Button 
                                            variant="contained" 
                                            fullWidth 
                                            onClick={saveEntity}
                                            disableElevation
                                        >
                                            Save Entities
                                        </Button>
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