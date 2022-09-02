import React, { useEffect, useState } from "react";
import _ from "underscore";
import { get } from "lodash";
import { Controller, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { Grid, IconButton, InputAdornment, TextField } from "@material-ui/core";
import { addTrailingZeros } from "components/Shared/functions";

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

const ChangeDetectionNumberField = ({ name, label, control, offClickHandler, handleKeyDown, keysSum }) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={name}
      render={(params) => {
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
            className={(keysSum[name] && params.value && params.value !== keysSum[name]) ? classes.baseValueChanged : classes.numberField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {params.value && params.value !== keysSum[name] && (
                    <IconButton
                      aria-label={`toggle ${name}`}
                      onClick={() => {
                        params.onChange(keysSum[name]);
                        offClickHandler(name, keysSum[name])
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
  const [keysSum, setKeysSum] = useState({})

  useEffect(() => {
    reset(agreementDetails);
  }, [reset, agreementDetails]);

  useEffect(() => {
    if (tractOwners) {
      const sum = tractOwners.reduce((sum, tractOwner) => {
        if (tractOwner.sdGrossAcres)
          sum.grossAcres += parseFloat(tractOwner.sdGrossAcres);
        if (tractOwner.net_acres)
          sum.netAcres += parseFloat(tractOwner.net_acres);
        if (tractOwner.nra)
          sum.netRoyalty += parseFloat(tractOwner.nra);
        if (tractOwner.company_net_acres)
          sum.companyNetAcres += parseFloat(tractOwner.company_net_acres);
        if (tractOwner.sdGrossAcres && tractOwner.countAcres === "Yes")
          sum.reportGrossAcres += parseFloat(tractOwner.sdGrossAcres);
        if (tractOwner.net_acres && tractOwner.countAcres === "Yes")
          sum.reportNet += parseFloat(tractOwner.net_acres);
        return sum;
      }, { grossAcres: 0, netAcres: 0, netRoyalty: 0, companyNetAcres: 0, reportGrossAcres: 0, reportNet: 0 });
      sum.grossAcres = addTrailingZeros(sum.grossAcres?.toFixed(8));
      sum.netAcres = addTrailingZeros(sum.netAcres?.toFixed(8));
      sum.netRoyalty = addTrailingZeros(sum.netRoyalty?.toFixed(8));
      sum.companyNetAcres = addTrailingZeros(sum.companyNetAcres?.toFixed(8));
      sum.reportGrossAcres = addTrailingZeros(sum.reportGrossAcres?.toFixed(8));
      sum.reportNet = addTrailingZeros(sum.reportNet?.toFixed(8));

      reset(agreementDetails);
      setKeysSum(sum)
    }

  }, [tractOwners]);

  const offClickHandler = (key, value) => {
    if (agreementDetails[key] === value) return
    const fieldValue = {
      overridden: parseFloat(value) !== parseFloat(keysSum[key]),
      value
    }
    if (tractOwners) updateAgreement(key, fieldValue, key)
    else updateAgreement(key, value)
  };

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
                <ChangeDetectionNumberField
                  label="Gross"
                  name="grossAcres"
                  control={control}
                  offClickHandler={offClickHandler}
                  handleKeyDown={handleKeyDown}
                  keysSum={keysSum}
                />
              </Grid>
              <Grid item xs={4}>
                <ChangeDetectionNumberField
                  label="Net"
                  name="netAcres"
                  control={control}
                  offClickHandler={offClickHandler}
                  handleKeyDown={handleKeyDown}
                  keysSum={keysSum}
                />
              </Grid>
              <Grid item xs={4}>
                <ChangeDetectionNumberField
                  label="Co. Net"
                  name="companyNetAcres"
                  control={control}
                  offClickHandler={offClickHandler}
                  handleKeyDown={handleKeyDown}
                  keysSum={keysSum}
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
                  keysSum={keysSum}
                />
              </Grid>
              <Grid item xs={4}>
                <ChangeDetectionNumberField
                  label="Report Net"
                  name="reportNet"
                  control={control}
                  offClickHandler={offClickHandler}
                  handleKeyDown={handleKeyDown}
                  keysSum={keysSum}
                />
              </Grid>
              <Grid item xs={4}>
                <ChangeDetectionNumberField
                  label="Net Royalty"
                  name="netRoyalty"
                  control={control}
                  offClickHandler={offClickHandler}
                  handleKeyDown={handleKeyDown}
                  keysSum={keysSum}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
