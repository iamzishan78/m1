import React, { useState, useEffect } from "react";
import _ from "underscore";
import { Controller, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton, TextField } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useStyles as customStyles } from "../style";

import AgreementLegalDescriptionFields from "components/Land/components/Agreements/detailComponents/legalDescription/FieldsSection";
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
      width: "auto",
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#fff",
      borderRadius: "3px !important",
      backgroundColor: "#18aadd",
    },
  },
  accordionDetails: {
    padding: "30px 18px",
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

export default function LagalDescription({ agreementDetails, uniObj, updateAgreement }) {
  const classes = useStyles();
  const customClasses = customStyles();
  const [tractOwners, setTractOwners] = useState();
  const { reset } = useForm();
  const [tractsNumber, setTractsNumber] = useState(0);

  useEffect(() => {
    if (!_.isEmpty(agreementDetails)) reset(agreementDetails);
  }, [reset, agreementDetails]);

  const offClickHandler = (key, value) => updateAgreement(key, value);

  const handleKeyDown = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  };

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
                Legal Description
              </Typography>
              <Chip color="info" label={tractsNumber} />
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Grid container direction="column" alignItems="center" spacing={4} style={{ display: "block" }}>
            <Grid item xs={12} style={{ padding: "0px 50px 0px 0px" }}>
              <AgreementLegalDescriptionFields agreementDetails={agreementDetails} updateAgreement={updateAgreement} tractOwners={tractOwners} />
            </Grid>
            {uniObj && (
              <Grid item xs={12} style={{ padding: "35px 20px 0px 0px" }}>
                <AgreementOwnersTractsTable
                  setRecord={setTractOwners}
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
