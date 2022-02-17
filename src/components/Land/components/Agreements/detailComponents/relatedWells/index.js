import React, { useState, useEffect } from "react";
import _ from "underscore";
import { Controller, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton, TextField } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useStyles as customStyles } from "../style";

import { copy } from "components/Shared/functions";
import AgreementOwnersTractsTable from "components/Table/Agreement/AgreementOwnersTractsTable";

// Components
const useStyles = makeStyles((theme) => ({
    root: {
        padding: "10px 25px",
    },
    accordionRoot: {
        borderRadius: "5px",
        margin: "10px 0px",
        boxShadow: "none",
        "& .MuiButtonBase-root.MuiAccordionSummary-root": {
            maxHeight: "50px",
            minHeight: "50px",
            padding: 0,
        },
        "&.MuiAccordion-root.Mui-expanded": {
            margin: 0,
        },
    },
    accordionHeading: {
        display: "flex !important",
        alignItems: "center",
        "& .MuiChip-root": {
            width: "40px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "#fff",
            borderRadius: "3px !important",
            backgroundColor: "#18aadd",
        },
    },
    accordionDetails: {
        padding: "30px 18px"
    },
    numberField: {
        "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
        },
        "& input[type=number]": {
            "-moz-appearance": "textfield",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
    },
}));

export default function LagalDescription({ agreementDetails, activeAgreement, updateAgreement }) {
    const classes = useStyles();
    const customClasses = customStyles();
    const { reset, control } = useForm();
    const [uniObj, setUniObj] = useState();
    const [tractsNumber, setTractsNumber] = useState(0);

    useEffect(() => {
        if (!_.isEmpty(agreementDetails)) reset(agreementDetails);
    }, [reset, agreementDetails]);

    useEffect(() => {
        if (activeAgreement) {
            let shape = activeAgreement.shape;
            if (activeAgreement.shapeJson) shape = copy(activeAgreement.shapeJson);
            setUniObj({
                ...activeAgreement,
                shape,
            });
        }
    }, [activeAgreement]);

    return (
        <div className={classes.root}>
            <Accordion className={classes.accordionRoot} defaultExpanded={true}>
                <AccordionSummary
                    expandIcon={
                        <IconButton>
                            <ExpandMoreIcon fontSize="large" />
                        </IconButton>
                    }
                    onClick={(e) => { }}
                >
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Grid item xs={6} className={classes.accordionHeading}>
                            <Typography variant="h5" className={customClasses.titleText}>
                                Related Wells
                            </Typography>
                            <Chip color="info" label={tractsNumber} />
                        </Grid>
                    </Grid>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                    <Grid container direction="column" alignItems="center" spacing={4} style={{ display: "block" }}>
                        {uniObj && (
                            <Grid item xs={12} style={{ padding: "35px 20px 0px 0px" }}>
                                <AgreementOwnersTractsTable
                                    customLayer={uniObj}
                                    shapeType="Agreement"
                                    header={"Tracts"}
                                    setTractsNumber={setTractsNumber}
                                    dense
                                />
                            </Grid>
                        )}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
