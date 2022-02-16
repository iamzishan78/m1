import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton, TextField } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useStyles as customStyles } from "../style";

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
    padding: "0px 80px 0px 0px",
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

export default function LagalDescription({ agreementDetails, updateAgreement }) {
  const classes = useStyles();
  const customClasses = customStyles();
  const { reset, control } = useForm();

  useEffect(() => {
    if (agreementDetails) reset(agreementDetails);
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
          onClick={(e) => { }}
        >
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item xs={6} className={classes.accordionHeading}>
              <Typography variant="h5" className={customClasses.titleText}>
                Legal Description
              </Typography>
              <Chip color="info" label={1} />
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Grid container display="row" alignItems="center" justify="space-between">
            <Grid item xs={6}>
              <Controller
                control={control}
                name="legalDesctiption"
                render={params => (
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
                        control={control}
                        render={params => (
                          <TextField
                            {...params}
                            defaultValue={params.value ?? null}
                            label="Gross"
                            variant="outlined"
                            type="number"
                            className={classes.numberField}
                            onBlur={(event) => offClickHandler("grossAcres", event.target.value)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name="netAcres"
                        control={control}
                        render={params => (
                          <TextField
                            {...params}
                            label="Net"
                            variant="outlined"
                            type="number"
                            className={classes.numberField}
                            onBlur={(event) => offClickHandler("netAcres", event.target.value)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name="coNetAcres"
                        control={control}
                        render={params => (
                          <TextField
                            {...params}
                            label="Co. Net"
                            variant="outlined"
                            type="number"
                            className={classes.numberField}
                            onBlur={(event) => offClickHandler("coNetAcres", event.target.value)}
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
                        control={control}
                        render={params => (
                          <TextField
                            {...params}
                            label="Report Gross"
                            variant="outlined"
                            type="number"
                            className={classes.numberField}
                            onBlur={(event) => offClickHandler("reportGrossAcres", event.target.value)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name="reportNet"
                        control={control}
                        render={params => (
                          <TextField
                            {...params}
                            label="Report Net"
                            variant="outlined"
                            type="number"
                            className={classes.numberField}
                            onBlur={(event) => offClickHandler("reportNet", event.target.value)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name="netRoyalty"
                        control={control}
                        render={params => (
                          <TextField
                            {...params}
                            defaultValue={params.value ?? null}
                            label="Net Royalty"
                            variant="outlined"
                            type="number"
                            className={classes.numberField}
                            onBlur={(event) => offClickHandler("netRoyalty", event.target.value)}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
