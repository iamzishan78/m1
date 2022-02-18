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
  const { reset, control } = useForm();
  const [tractsNumber, setTractsNumber] = useState(0);

  useEffect(() => {
    if (!_.isEmpty(agreementDetails)) reset(agreementDetails);
  }, [reset, agreementDetails]);

  const offClickHandler = (key, value) => updateAgreement(key, value);

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordionRoot} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={
            <IconButton>
              <ExpandMoreIcon fontSize="large" />
            </IconButton>
          }
          onClick={(e) => {}}
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
              <Grid container display="flex" direction="row" alignItems="center" justify="space-between">
                <Grid item xs={6}>
                  <Controller
                    control={control}
                    name="legalDesctiption"
                    defaultValue={agreementDetails?.legalDescription ?? ""}
                    render={(params) => (
                      <TextField
                        {...params}
                        label="Full Legal Description"
                        variant="outlined"
                        multiline
                        rows={7}
                        fullWidth
                        className={classes.numberField}
                        onBlur={(event) => offClickHandler("legalDesctiption", event.target.value)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={5}>
                  <Grid container display="row" alignItems="center" justify="center" spacing={3}>
                    <Grid item xs={12}>
                      <Grid container display="row" alignItems="center" justify="space-between" spacing={3}>
                        <Grid item xs={4}>
                          <Controller
                            name="grossAcres"
                            defaultValue={agreementDetails?.grossAcres ?? ""}
                            control={control}
                            render={(params) => (
                              <TextField
                                {...params}
                                label="Gross"
                                variant="outlined"
                                type="number"
                                className={classes.numberField}
                                onBlur={(event) => offClickHandler("grossAcres", event.target.value)}
                                onWheel={(event) => {
                                  event.stopPropagation();
                                  event.target.blur();
                                }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Controller
                            name="netAcres"
                            defaultValue={agreementDetails?.netAcres ?? ""}
                            control={control}
                            render={(params) => (
                              <TextField
                                {...params}
                                label="Net"
                                variant="outlined"
                                type="number"
                                className={classes.numberField}
                                onBlur={(event) => offClickHandler("netAcres", event.target.value)}
                                onWheel={(event) => {
                                  event.preventDefault();
                                }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Controller
                            name="coNetAcres"
                            defaultValue={agreementDetails?.coNetAcres ?? ""}
                            control={control}
                            render={(params) => (
                              <TextField
                                {...params}
                                label="Co. Net"
                                variant="outlined"
                                type="number"
                                className={classes.numberField}
                                onBlur={(event) => offClickHandler("coNetAcres", event.target.value)}
                                onWheel={(event) => {
                                  event.preventDefault();
                                }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container display="row" alignItems="center" justify="space-between" spacing={3}>
                        <Grid item xs={4}>
                          <Controller
                            name="reportGrossAcres"
                            defaultValue={agreementDetails?.reportGrossAcres ?? ""}
                            control={control}
                            render={(params) => (
                              <TextField
                                {...params}
                                label="Report Gross"
                                variant="outlined"
                                type="number"
                                className={classes.numberField}
                                onBlur={(event) => offClickHandler("reportGrossAcres", event.target.value)}
                                onWheel={(event) => {
                                  event.preventDefault();
                                }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Controller
                            name="reportNet"
                            defaultValue={agreementDetails?.reportNet ?? ""}
                            control={control}
                            render={(params) => (
                              <TextField
                                {...params}
                                label="Report Net"
                                variant="outlined"
                                type="number"
                                className={classes.numberField}
                                onBlur={(event) => offClickHandler("reportNet", event.target.value)}
                                onWheel={(event) => {
                                  event.preventDefault();
                                }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Controller
                            name="netRoyalty"
                            defaultValue={agreementDetails?.netRoyalty ?? ""}
                            control={control}
                            render={(params) => (
                              <TextField
                                {...params}
                                defaultValue={params.value ?? null}
                                label="Net Royalty"
                                variant="outlined"
                                type="number"
                                className={classes.numberField}
                                onBlur={(event) => offClickHandler("netRoyalty", event.target.value)}
                                onWheel={(event) => {
                                  event.preventDefault();
                                }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
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
