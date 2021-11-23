import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { KeyboardDatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import { summaryStyles } from "components/ShapeDetailCard/style";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

const standardProvisions = [
    {
        label: 'Option to Extent',
        key: 'optionToExtend',
    },
    {
        label: 'Concent to Assign',
        key: 'concentToAssign',
    },
    {
        label: 'Cessation of Production',
        key: 'CessationOfProduction',
    },
    {
        label: 'Pugh - Vertical',
        key: 'pVertical',
    },
    {
        label: 'Pugh - Horizontal',
        key: 'pHorizontal',
    },
    {
        label: 'Shut In Provisions',
        key: 'shutInProvisions',
    },
    {
        label: 'Cost Free',
        key: 'costFree',
    },
    {
        label: 'Deductions Allowed',
        key: 'deductionsAllowed',
    },
    {
        label: 'Pooling Cause',
        key: 'poolingCause',
    },
    {
        label: 'Continues Drilling',
        key: 'continuesDrilling',
    },
    {
        label: 'Force Majeur',
        key: 'forceMajeur',
    },
    {
        label: 'No Titile Warrenty',
        key: 'noTitleWarrenty',
    }
]

const styles = makeStyles(() => ({
    root: {
        backgroundColor: 'white',
        padding: '15px'
    },
    accordion: {
        border: '3px solid #d9d9d9',
        backgroundColor: '#fcfcfc',
    },
    provisionCard: {
        border: '1px solid #d9d9d9',
        backgroundColor: '#f9f9f9',
    },
    provisionCardSelected: {
        borderLeft: '4px solid #4dc7f4',
    },
    marginNormal: {
        marginTop: '0px',
        marginBottom: '0px'
    },
    unchecked: { opacity: 0.5 },
    checked: { opacity: 1 },
    heading: {
        fontWeight: 'bold'
    }
}));


export default function ProvisionsTab({ provisions }) {
    const classes = styles();

    provisions = [{
        provisionType: 'optionToExtend',
        applicable: true,
        provisionValue: '202020'
    }]

    return <Grid container direction="column" spacing={5} className={classes.root}>
        <Grid item>
            <Accordion className={classes.accordion}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>Standard Provisions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container direction="row">
                        {
                            standardProvisions.map((provision) => {
                                const isFound = !!provisions.find(p => p.provisionType === provision.key)
                                return (
                                    <Grid item md={4}>
                                        <FormControlLabel
                                            className={isFound ? classes.checked : classes.unchecked}
                                            control={
                                                <Checkbox
                                                    checked={isFound}
                                                    color="default"
                                                    inputProps={{ 'aria-label': provision.label }}
                                                />
                                            }
                                            label={provision.label}
                                        />
                                    </Grid>
                                )
                            })
                        }
                    </Grid>

                </AccordionDetails>
            </Accordion>
        </Grid>
        <Grid item>
            <Grid container direction="column" spacing={2} className={`${classes.provisionCard} ${classes.provisionCardSelected}`}>
                <Grid item>
                    <Grid container direction="row" spacing={2} >
                        <Grid item md={4}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel id="provision-type-label">Provision Type</InputLabel>
                                <Select
                                    labelId="provision-type-label"
                                    id="provision-type"
                                    label="Provision Type"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item md={2}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel id="applicable-type-label">Applicable</InputLabel>
                                <Select
                                    labelId="applicable-type-label"
                                    id="applicable-type"
                                    label="Provision Type"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item md={6} >
                            <FormControl variant="outlined" fullWidth>
                                <TextField fullWidth id="p-value" label="Provison Value" variant="outlined" />
                            </FormControl>
                        </Grid>

                    </Grid>
                </Grid>

                <Grid item>
                    <Grid container direction="row" spacing={2}>
                        <Grid item md={3} >
                            <KeyboardDatePicker
                                className={classes.marginNormal}
                                disableToolbar
                                fullWidth
                                label={'Start Date'}
                                inputVariant="outlined"
                                format="MM/DD/YYYY"
                                margin="normal"
                                id="date-picker-outlined"
                                // value={properties[data.key] || null}
                                // onBlur={() => { setTableDataState({}); setTableTempProperties({ ...tableTempProperties, [data.key]: properties[data.key] }) }}
                                // onChange={(date) => {
                                //     if (date) { updateProperties(null, data.key, String(date["_d"])); }
                                // }}
                                KeyboardButtonProps={{ "aria-label": "change date" }}
                            />
                        </Grid>
                        <Grid item md={3} >
                            <KeyboardDatePicker
                                className={classes.marginNormal}
                                disableToolbar
                                fullWidth
                                label={'End Date'}
                                inputVariant="outlined"
                                format="MM/DD/YYYY"
                                margin="normal"
                                id="date-picker-outlined"
                                // value={properties[data.key] || null}
                                // onBlur={() => { setTableDataState({}); setTableTempProperties({ ...tableTempProperties, [data.key]: properties[data.key] }) }}
                                // onChange={(date) => {
                                //     if (date) { updateProperties(null, data.key, String(date["_d"])); }
                                // }}
                                KeyboardButtonProps={{ "aria-label": "change date" }}
                            />
                        </Grid>

                        <Grid item md={6} >
                            <TextField id="p-value" label="Party Name" variant="outlined" fullWidth />
                        </Grid>

                    </Grid>
                </Grid>

                <Grid item>
                    <Grid container direction="row" >
                        <TextField id="p-value" label="Full Description" variant="outlined" fullWidth multiline rows={4} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

    </Grid>
}
