import React, { useEffect } from "react";
import _ from "underscore";
import { Controller, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";
import { Grid, TextField } from "@material-ui/core";

// Components
const useStyles = makeStyles((theme) => ({
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

export default function LagalDescription({ agreementDetails = {}, updateAgreement }) {
  const classes = useStyles();
  const { reset, control } = useForm();

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
                      onKeyDown={handleKeyDown}
                      onWheel={(e) => e.target.blur()}
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
                      onKeyDown={handleKeyDown}
                      onWheel={(e) => e.target.blur()}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="companyNetAcres"
                  defaultValue={agreementDetails?.companyNetAcres ?? ""}
                  control={control}
                  render={(params) => (
                    <TextField
                      {...params}
                      label="Co. Net"
                      variant="outlined"
                      type="number"
                      className={classes.numberField}
                      onBlur={(event) => offClickHandler("companyNetAcres", event.target.value)}
                      onKeyDown={handleKeyDown}
                      onWheel={(e) => e.target.blur()}
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
                      onKeyDown={handleKeyDown}
                      onWheel={(e) => e.target.blur()}
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
                      onKeyDown={handleKeyDown}
                      onWheel={(e) => e.target.blur()}
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
                      label="Net Royalty"
                      variant="outlined"
                      type="number"
                      className={classes.numberField}
                      onBlur={(event) => offClickHandler("netRoyalty", event.target.value)}
                      onKeyDown={handleKeyDown}
                      onWheel={(e) => e.target.blur()}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
