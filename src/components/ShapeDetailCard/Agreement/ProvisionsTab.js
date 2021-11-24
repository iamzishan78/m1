import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Controller, useForm, useFieldArray } from "react-hook-form";
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
import ContactCardIcon from "components/Shared/svgIcons/contact_card";
import { summaryStyles } from "components/ShapeDetailCard/style";
import { FormControl, IconButton, InputLabel, MenuItem, Select } from "@material-ui/core";
import CommentsWithIcon from "components/Shared/CommentsWithIcon";

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
        '& .MuiFormControl-root': {
            backgroundColor: 'white',
        },
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
        marginBottom: '25px'
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
    const [selectionProvision, setSelectedProvision] = useState('')
    const { control, register, reset, getValues } = useForm();

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "provisions", // unique name for your Field Array
        // keyName: "id", default to "id", you can change the key name
    });

    useEffect(() => { reset({ provisions }) }, [])

    const addRemoveProvision = (addProvision, type) => {
        if (addProvision) {
            setSelectedProvision(type)
            append({ type, applicable: true })
        } else {
            remove(fields.findIndex(provision => provision.type === type))
        }
    }

    const handleChange = () => {
        console.log('getValues:', getValues())
    }

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
                                const isFound = !!fields.find(p => p.type === provision.key)
                                return (
                                    <Grid item md={4}>
                                        <FormControlLabel
                                            className={isFound ? classes.checked : classes.unchecked}
                                            control={
                                                <Checkbox
                                                    checked={isFound}
                                                    color="default"
                                                    onChange={(e) => { addRemoveProvision(e.target.checked, provision.key) }}
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
            {
                fields.map((item, index) =>
                    <Grid key={item.id} container direction="column" spacing={2}
                        className={`${classes.provisionCard} ${selectionProvision === item.type ? classes.provisionCardSelected : ''}`}
                        onClick={() => setSelectedProvision(item.type)}>
                        <Grid item>
                            <Grid container direction="row" spacing={2} >
                                <Grid item md={4}>
                                    <Controller
                                        control={control}
                                        name={`provisions[${index}].type`}
                                        defaultValue={item.type}
                                        render={(
                                            { onChange, value, ref },
                                        ) => (
                                            <FormControl variant="outlined" fullWidth >
                                                <InputLabel id="provision-type-label">Provision Type</InputLabel>
                                                <Select
                                                    labelId="provision-type-label"
                                                    id="provision-type-label"
                                                    label="Provision Type"
                                                    onChange={(value) => { onChange(value); handleChange(value) }}
                                                    inputRef={ref}
                                                    value={value}
                                                >
                                                    {standardProvisions.map((p) => <MenuItem value={p.key}>{p.label}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>
                                <Grid item md={2}>
                                    <Controller
                                        control={control}
                                        name={`provisions[${index}].applicable`}
                                        defaultValue={item.applicable || 'Yes'}
                                        render={(
                                            { onChange, value, ref },
                                        ) => (
                                            <FormControl variant="outlined" fullWidth >
                                                <InputLabel id="applicable-label">Applicable</InputLabel>
                                                <Select
                                                    labelId="applicable-label"
                                                    id="applicable-label"
                                                    label="Applicable"
                                                    onChange={(value) => { onChange(value); handleChange(value) }}
                                                    inputRef={ref}
                                                    value={value}
                                                >
                                                    <MenuItem value={true}>Yes</MenuItem>
                                                    <MenuItem value={false}>No</MenuItem>
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>
                                <Grid item md={6} >
                                    <FormControl variant="outlined" fullWidth>
                                        <TextField fullWidth id="p-value" label="Provison Value" variant="outlined" name={`provisions[${index}].value`}
                                            inputRef={register()} defaultValue={item.value} onChange={handleChange} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Grid container direction="row" spacing={2}>
                                <Grid item md={3} >
                                    <Controller
                                        control={control}
                                        name={`provisions[${index}].startDate`}
                                        render={(
                                            { onChange, value, ref },
                                        ) => (
                                            <KeyboardDatePicker
                                                className={classes.marginNormal}
                                                disableToolbar
                                                fullWidth
                                                label={'Start Date'}
                                                inputVariant="outlined"
                                                format="MM/DD/YYYY"
                                                margin="normal"
                                                id="date-picker-outlined"
                                                ref={ref}
                                                value={value}
                                                onChange={(date) => {
                                                    onChange(date)
                                                    handleChange()
                                                }}
                                                KeyboardButtonProps={{ "aria-label": "change date" }}
                                            />

                                        )}
                                    />
                                </Grid>
                                <Grid item md={3} >
                                    <Controller
                                        control={control}
                                        name={`provisions[${index}].endDate`}
                                        render={(
                                            { onChange, value, ref },
                                        ) => (
                                            <KeyboardDatePicker
                                                className={classes.marginNormal}
                                                disableToolbar
                                                fullWidth
                                                label={'End Date'}
                                                inputVariant="outlined"
                                                format="MM/DD/YYYY"
                                                margin="normal"
                                                id="date-picker-outlined"
                                                ref={ref}
                                                value={value}
                                                onChange={(date) => {
                                                    onChange(date)
                                                    handleChange()
                                                }}
                                                KeyboardButtonProps={{ "aria-label": "change date" }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item md={4} >
                                    <TextField id="p-value" label="Party Name" variant="outlined" fullWidth name={`provisions[${index}].partyName`}
                                        inputRef={register()} defaultValue={item.partyName} onChange={handleChange} />
                                </Grid>
                                <Grid item >
                                    <IconButton
                                        size={"medium"}
                                        color="primary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        aria-label="show contact"
                                    >
                                        <ContactCardIcon style={{ margin: "4px" }} />
                                    </IconButton>
                                    <CommentsWithIcon
                                        // objectId={targetSourceId.toLowerCase()}
                                        targetLabel={'provision'}
                                        iconZiseSmall={false}
                                    />
                                </Grid>

                            </Grid>
                        </Grid>

                        <Grid item>
                            <Grid container direction="row" >
                                <TextField id="p-value" label="Full Description" variant="outlined" fullWidth multiline rows={4} name={`provisions[${index}].description`}
                                    inputRef={register()} defaultValue={item.description} onChange={handleChange} />
                            </Grid>
                        </Grid>
                    </Grid>
                )
            }
        </Grid>

    </Grid>
}
