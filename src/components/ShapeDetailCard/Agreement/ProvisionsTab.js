import React, { useEffect, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { Grid, Button, FormControl, IconButton, InputLabel, MenuItem, Select } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { KeyboardDatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import ContactCardIcon from "components/Shared/svgIcons/contact_card";
import ContactCardDisabledIcon from "components/Shared/svgIcons/contact_card_disabled";
import AddIcon from '@material-ui/icons/Add';
import CommentsWithIcon from "components/Shared/CommentsWithIcon";
import AutocompEntityNamesList from "components/Shared/Forms/Fields/AutocompEntityNamesList";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_AGREEMENT_PROVISION } from "graphQL/useMutationCreateAgreementProvision";
import debounce from "lodash/debounce";
import AutoCompleteWithNewOption from "components/Shared/Forms/Fields/AutoCompleteWithNewOption";
import { GET_PROVISION_AUTOCOMPLETE_LIST } from "graphQL/useQueryGetProvisionAutoCompleteList";

const styles = makeStyles(() => ({
    root: {
        paddingLeft: "10px",
        paddingRight: "10px", paddingTop: '8px',
        paddingBottom: '40px',
        '& .MuiFormControl-root': {
            backgroundColor: 'white',
        },
        padding: '15px',
        '& .MuiIconButton-colorPrimary , & .MuiToggleButton-root, & .MuiSvgIcon-colorSecondary, & .MuiIconButton-label ': {
            color: '#7f7f7f !important',
            'svg': {
                fill: '#7f7f7f !important'
            }
        },
        '& .MuiIconButton-root, & .MuiButtonBase-root': {
            "&:hover": {
                backgroundColor: 'rgba(0, 0, 0, 0.08) !important'
            },
        },
        '& .MuiIconButton-label svg': {
            color: '#7f7f7f !important',
            fill: '#7f7f7f !important'
        }
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
    },
    addDataButton: {
        backgroundColor: 'white',
        color: 'black',
        textTransform: "capitalize",
        '&:hover': {
            backgroundColor: 'white',
            opacity: 0.15,
        }
    },
    contactCard: {
        '& path': {
            fill: 'grey'
        }
    }
}));


export default function ProvisionsTab({ provisions, standardProvisions, id }) {
    const classes = styles();
    let history = useHistory();
    const [selectionProvision, setSelectedProvision] = useState('')
    const { control, register, reset, getValues, setValue } = useForm();

    const [getProvisionAutoCompleteList, { data: dataProvisionAutoCompleteList = [] }] = useLazyQuery(GET_PROVISION_AUTOCOMPLETE_LIST);
    const [createAgreementProvision] = useMutation(CREATE_AGREEMENT_PROVISION, { refetchQueries: ['getAgreementProvisions', 'provisionAutoCompleteList'] });

    const { fields, append } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "provisions", // unique name for your Field Array
        // keyName: "id", default to "id", you can change the key name
    });

    useEffect(() => { reset({ provisions }) }, [])

    useEffect(() => {
        getProvisionAutoCompleteList({ variables: { key: 'type', agreementId: id } })
    }, [])

    useEffect(() => { reset({ provisions }) }, [provisions])

    const addRemoveProvision = (addProvision, provision) => {
        if (addProvision) {
            setSelectedProvision(provision.type)
            let addProvision = { agreement: id, type: provision.type, isDeleted: false, startDate: undefined, endDate: undefined }
            if (provision._id) {
                addProvision = { ...addProvision, isTemplate: false, applicable: true, templateRef: provision._id }
                createAgreementProvision({ variables: { provision: addProvision } });
            } else {
                append({ startDate: undefined, endDate: undefined })
            }

        } else {
            createAgreementProvision({ variables: { provision: { agreement: id, type: provision.type, isDeleted: true } } });
            // remove(fields.findIndex(p => p.type === provision.type))
        }
    }

    const handleChange = debounce((item, index) => {
        const formValues = getValues();
        if (formValues?.provisions && formValues?.provisions[index]) {
            const provision = formValues.provisions[index]
            console.log(formValues.provisions[index])
            if (provision.type)
                createAgreementProvision({
                    variables:
                    {
                        provision: { agreement: id, ...formValues.provisions[index] }
                    }
                });
        }
    }, 500)

    const provisionAutoCompleteList = dataProvisionAutoCompleteList?.provisionAutoCompleteList || []

    const getParty = (item) => {
        return item?.parties && item?.parties[0] ? item?.parties[0] : item?.parties
    }

    return <Grid container direction="column" spacing={5} className={classes.root}>
        <Grid item>
            <Accordion className={classes.accordion} defaultExpanded={true}>
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
                            standardProvisions?.map((provision) => {
                                const isFound = !!fields.find(p => p.type === provision.type)
                                return (
                                    <Grid item md={4}>
                                        <FormControlLabel
                                            className={isFound ? classes.checked : classes.unchecked}
                                            control={
                                                <Checkbox
                                                    checked={isFound}
                                                    color="default"
                                                    onChange={(e) => { addRemoveProvision(e.target.checked, provision) }}
                                                    inputProps={{ 'aria-label': provision.type }}
                                                />
                                            }
                                            label={provision.type}
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
                            {console.log(item)}
                            <Grid container direction="row" spacing={2} >
                                <TextField id="templateRef" name={`provisions[${index}].templateRef`} type={'hidden'} inputRef={register()} defaultValue={item.templateRef} />
                                <Grid item md={4}>
                                    <Controller
                                        control={control}
                                        name={`provisions[${index}].type`}
                                        defaultValue={item.type}
                                        render={(
                                            { onChange, value, ref },
                                        ) => (
                                            <>
                                                {item.templateRef ? <FormControl variant="outlined" fullWidth >
                                                    <InputLabel id="provision-type-label">Provision Type</InputLabel>
                                                    <Select
                                                        labelId="provision-type-label"
                                                        id="provision-type-label"
                                                        label="Provision Type"
                                                        onChange={(value) => { onChange(value); handleChange(item, index) }}
                                                        inputRef={ref}
                                                        disabled={provisions[index]?.isTemplate === false}
                                                        value={value}
                                                    >
                                                        {standardProvisions?.map((p) => <MenuItem value={p.type}>{p.type}</MenuItem>)}
                                                    </Select>
                                                </FormControl> :
                                                    <AutoCompleteWithNewOption variant="outlined" options={provisionAutoCompleteList} value={value} onChange={(_, value) => { onChange(value.name); handleChange(item, index) }} />}
                                            </>

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
                                                    onChange={(value) => { onChange(value); handleChange(item, index) }}
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
                                        <TextField fullWidth id="p-value" label="Provision Value" variant="outlined" name={`provisions[${index}].value`}
                                            inputRef={register()} defaultValue={item.value} onChange={() => handleChange(item, index)} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Grid container direction="row" spacing={2} >
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
                                                value={value || null}
                                                onChange={(date) => {
                                                    onChange(date)
                                                    handleChange(item, index)
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
                                                value={value || null}
                                                onChange={(date) => {
                                                    onChange(date)
                                                    handleChange(item, index)
                                                }}
                                                KeyboardButtonProps={{ "aria-label": "change date" }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item md={4} >
                                    <Controller
                                        control={control}
                                        name={`provisions[${index}].parties`}
                                        defaultValue={getParty(item)}
                                        render={(
                                            { onChange, value, ref },
                                        ) => (
                                            <AutocompEntityNamesList variant='outlined' margin='' size='' label='Party Name' nameAutValue={value}
                                                setNameAutValue={(value) => {
                                                    if (value?._id)
                                                        onChange([{ _id: value._id }]);
                                                    else
                                                        onChange([]);
                                                    handleChange(item, index)
                                                }} />
                                        )}
                                    />

                                </Grid>
                                <Grid item md={2} style={{ height: '0px' }}>
                                    <IconButton
                                        size={"medium"}
                                        color={getParty(item) ? 'primary' : 'secondary'}
                                        onClick={(e) => {
                                            if (getParty(item)?._id) {
                                                e.stopPropagation();
                                                history.push(`/contact/details/${getParty(item)._id}`);
                                            }
                                        }}
                                        aria-label="show contact"
                                    >
                                        {getParty(item) ? <ContactCardIcon /> : <ContactCardDisabledIcon />}

                                    </IconButton>
                                    <CommentsWithIcon
                                        objectId={item._id}
                                        targetLabel={'provision'}
                                        iconZiseSmall={false}
                                    />
                                </Grid>

                            </Grid>
                        </Grid>

                        <Grid item>
                            <TextField id="p-value" label="Full Description" variant="outlined" fullWidth multiline rows={4} name={`provisions[${index}].description`}
                                inputRef={register()} defaultValue={item.description} onChange={() => handleChange(item, index)} />
                        </Grid>
                    </Grid>
                )
            }
            <Grid item>
                <Button variant="contained" onClick={() => { addRemoveProvision(true, {}) }} color="primary" component="span" className={classes.addDataButton} startIcon={<AddIcon />}>
                    Add another provision
                </Button>
            </Grid>
        </Grid>


    </Grid>
}
