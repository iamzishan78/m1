import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useStyles as customStyles } from "../style";

// Components
import ProvisionsTab from "components/ShapeDetailCard/Agreement/ProvisionsTab";

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
        padding: 0,
    },
}));

export default function RelatedParties({ agreementId, agreementProvisions, standardProvisions }) {
    const classes = useStyles();
    const customClasses = customStyles();

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
                                Provisions & Obligations
                            </Typography>
                            {agreementProvisions.length > 0 && <Chip color="info" label={agreementProvisions.length} />}
                        </Grid>
                    </Grid>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                    <ProvisionsTab provisions={agreementProvisions} standardProvisions={standardProvisions} id={agreementId} />
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
