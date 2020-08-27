import React, { useContext, useEffect, useState, Fragment } from "react";
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

const InvestingEntities = () => {
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
                                <Grid container>
                                    <Grid item sm={12}>
                                        <div style={{float: 'right', width: '25%'}}>
                                            <Grid container spacing={2}>
                                                <Grid item sm={6}>
                                                    <Button variant="contained" style={{width: '100%'}} disableElevation>Discard Entity</Button>
                                                </Grid>
                                                <Grid item sm={6}>
                                                    <Button variant="contained" style={{width: '100%'}} disableElevation>Save Entity</Button>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <FormControl style={{width: '100%', padding: 10}}>
                                            <FormLabel>Entity Information</FormLabel>
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
                                    <Grid item sm={12}>
                                        <Grid container spacing={2}>
                                            <Grid item sm={4}>
                                                <FormControl style={{width: '100%', padding: 10}}>
                                                    <FormLabel>Account type</FormLabel>
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
                                                    <FormLabel>Accredited</FormLabel>
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
                                    <Grid item sm={12}>
                                        <Grid container>
                                            <Grid item sm={4}>
                                                <FormControl style={{width: '100%', padding: 10}}>
                                                    <FormLabel>Tax ID / SSN</FormLabel>
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
                                                            <Grid item sm={6}>
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
                                                            <Grid item sm={12}>
                                                                <FormControl style={{width: '100%', padding: 10}}>
                                                                    <FormLabel>Role *</FormLabel>
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
                                                            <Grid item sm={12}>
                                                                <FormControl style={{width: '100%', padding: 10}}>
                                                                    <FormLabel>Signatory *</FormLabel>
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
                                                            <Grid item sm={12}>
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
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item sm={4}>
                                                <Card style={{flex: 1, display: 'flex', 
                                                                justifyContent: 'center', 
                                                                backgroundColor: '#f3f2f3', 
                                                                minHeight: '100%', 
                                                                textAlign:"center"}}>
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
                                                    <FormLabel>City *</FormLabel>
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
                                    <Grid item sm={12}>
                                        <Grid container spacing={2}>
                                            <Grid item sm={4}>
                                                <FormControl style={{width: '100%', padding: 10}}>
                                                    <FormLabel>State *</FormLabel>
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
                                                    <FormLabel>Zip or Postal Code *</FormLabel>
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
                                    <Grid item sm={12}>
                                        <Grid container spacing={2}>
                                            <Grid item sm={4}>
                                                <FormControl style={{width: '100%', padding: 10}}>
                                                    <FormLabel>Country *</FormLabel>
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
                                    <Grid item sm={12}>
                                        <Button variant="contained" style={{width: '100%'}} disableElevation>
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