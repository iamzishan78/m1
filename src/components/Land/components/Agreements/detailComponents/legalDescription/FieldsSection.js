import React, { useEffect, useMemo } from "react";
import _ from "underscore";
import { get } from "lodash";
import { Controller, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { Grid, IconButton, InputAdornment, TextField } from "@material-ui/core";

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
  baseValueChanged: {
    width: "100%",
    "& .MuiInputBase-input": {
      color: "dodgerblue",
      fontWeight: "bold",
    },
  },
}));

const ChangeDetectionNumberField = ({ name, label, control, offClickHandler, handleKeyDown, calculatedValues, isOverridden }) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={name}
      render={(params) => {
        const isChanged = (calculatedValues[name] && params.value && parseFloat(params.value) !== parseFloat(calculatedValues[name])) || isOverridden
        return (
          <TextField
            type="number"
            label={label}
            variant="outlined"
            defaultValue={get(params, "value", 0)}
            value={get(params, "value", 0)}
            onWheel={(e) => e.target.blur()}
            onBlur={(event) => offClickHandler(name, event.target.value)}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              params.onChange(e.target.value);
            }}
            className={isChanged ? classes.baseValueChanged : classes.numberField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isChanged && (
                    <IconButton
                      aria-label={`toggle ${name}`}
                      onClick={() => {
                        params.onChange(calculatedValues[name]);
                        offClickHandler(name, calculatedValues[name])
                      }}
                    >
                      <AutorenewIcon fontSize="small" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        )
      }}
    />
  );
}

export default function LagalDescription({ agreementDetails = {}, updateAgreement, tractOwners }) {
  const classes = useStyles();
  const { reset, control } = useForm();

  const calculatedValues = useMemo(() => agreementDetails.calculated ? agreementDetails.calculated : agreementDetails, [agreementDetails])

  useEffect(() => {
    reset(agreementDetails);
  }, [reset, agreementDetails]);

  const offClickHandler = (key, value) => {
    if (agreementDetails[key] === value) return
    const fieldValue = {
      overridden: parseFloat(value) !== parseFloat(calculatedValues[key]),
      value
    }
    if (tractOwners) updateAgreement(key, fieldValue, key)
    else updateAgreement(key, value)
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  };

  return (
    <Grid container spacing={2} display="flex" direction="row" alignItems="center" justify="space-between">
      <Grid item xs={5}>
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
      <Grid item xs={7}>
        <Grid container display="row" alignItems="center" justify="center" spacing={3}>
          <Grid item xs={12}>
            <Grid container display="row" alignItems="center" justify="space-between" spacing={3}>
              <Grid item xs={4}>
                <ChangeDetectionNumberField
                  label="Gross"
                  name="grossAcres"
                  control={control}
                  offClickHandler={offClickHandler}
                  handleKeyDown={handleKeyDown}
                  isOverridden={agreementDetails?.overridden?.grossAcres}
                  calculatedValues={calculatedValues}
                />
              </Grid>
              <Grid item xs={4}>
                <ChangeDetectionNumberField
                  label="Net"
                  name="netAcres"
                  control={control}
                  offClickHandler={offClickHandler}
                  handleKeyDown={handleKeyDown}
                  isOverridden={agreementDetails?.overridden?.netAcres}
                  calculatedValues={calculatedValues}
                />
              </Grid>
              <Grid item xs={4}>
                <ChangeDetectionNumberField
                  label="Co. Net"
                  name="companyNetAcres"
                  control={control}
                  offClickHandler={offClickHandler}
                  handleKeyDown={handleKeyDown}
                  isOverridden={agreementDetails?.overridden?.companyNetAcres}
                  calculatedValues={calculatedValues}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container display="row" alignItems="center" justify="space-between" spacing={3}>
              <Grid item xs={4}>
                <ChangeDetectionNumberField
                  label="Report Gross"
                  name="reportGrossAcres"
                  control={control}
                  offClickHandler={offClickHandler}
                  handleKeyDown={handleKeyDown}
                  isOverridden={agreementDetails?.overridden?.reportGrossAcres}
                  calculatedValues={calculatedValues}
                />
              </Grid>
              <Grid item xs={4}>
                <ChangeDetectionNumberField
                  label="Report Net"
                  name="reportNet"
                  control={control}
                  offClickHandler={offClickHandler}
                  handleKeyDown={handleKeyDown}
                  isOverridden={agreementDetails?.overridden?.reportNet}
                  calculatedValues={calculatedValues}
                />
              </Grid>
              <Grid item xs={4}>
                <ChangeDetectionNumberField
                  label="Net Royalty"
                  name="netRoyalty"
                  control={control}
                  offClickHandler={offClickHandler}
                  handleKeyDown={handleKeyDown}
                  isOverridden={agreementDetails?.overridden?.netRoyalty}
                  calculatedValues={calculatedValues}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
