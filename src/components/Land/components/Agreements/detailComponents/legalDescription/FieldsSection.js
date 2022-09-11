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
          sum.grossAcres += parseFloat(tractOwner.sdGrossAcres)
        if (tractOwner.net_acres)
          sum.netAcres += parseFloat(tractOwner.net_acres)
        if (tractOwner.nra)
          sum.netRoyalty += parseFloat(tractOwner.nra)
        return sum
      }, { grossAcres: 0, netAcres: 0, netRoyalty: 0 });
      sum.grossAcres = addTrailingZeros(sum.grossAcres?.toFixed(8))
      sum.netAcres = addTrailingZeros(sum.netAcres?.toFixed(8))
      sum.netRoyalty = addTrailingZeros(sum.netRoyalty?.toFixed(8))

      console.log(sum)
      reset(agreementDetails);
      setKeysSum(sum)
    }

  }, [tractOwners])

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
                <Controller
                  control={control}
                  name="grossAcres"
                  render={(params) => (
                    <TextField
                      type="number"
                      label="Gross"
                      variant="outlined"
                      defaultValue={get(params, "value", 0)}
                      value={get(params, "value", 0)}
                      onWheel={(e) => e.target.blur()}
                      onBlur={(event) => offClickHandler("grossAcres", event.target.value)}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => {
                        params.onChange(e.target.value);
                      }}
                      className={(keysSum.grossAcres && params.value !== keysSum.grossAcres) ? classes.baseValueChanged : classes.numberField}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {params.value !== keysSum.grossAcres && (
                              <IconButton
                                aria-label="toggle grossAcres"
                                onClick={() => {
                                  params.onChange(keysSum.grossAcres);
                                  offClickHandler("grossAcres", keysSum.grossAcres)
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
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  control={control}
                  name="netAcres"
                  render={(params) => (
                    <TextField
                      type="number"
                      label="Net"
                      variant="outlined"
                      value={get(params, "value", 0)}
                      defaultValue={get(params, "value", 0)}
                      onWheel={(e) => e.target.blur()}
                      onBlur={(event) => offClickHandler("netAcres", event.target.value)}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => {
                        params.onChange(e.target.value);
                      }}
                      className={(keysSum.netAcres && params.value !== keysSum.netAcres) ? classes.baseValueChanged : classes.numberField}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {params.value !== keysSum.netAcres && (
                              <IconButton
                                aria-label="toggle netAcres"
                                onClick={() => {
                                  params.onChange(keysSum.netAcres);
                                  offClickHandler("netAcres", keysSum.netAcres)
                                }}
                              >
                                <AutorenewIcon fontSize="small" />
                              </IconButton>
                            )}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                    // defaultValue={agreementDetails?.netAcres ?? ""}
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
                      label="Co. Net"
                      variant="outlined"
                      type="number"
                      value={get(agreementDetails, "companyNetAcres", 0)}
                      defaultValue={get(agreementDetails, "companyNetAcres", 0)}
                      className={classes.numberField}
                      onBlur={(event) => offClickHandler("companyNetAcres", event.target.value)}
                      onKeyDown={handleKeyDown}
                      fullWidth
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
                      fullWidth
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
                      fullWidth
                      onWheel={(e) => e.target.blur()}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  control={control}
                  name="netRoyalty"
                  render={(params) => (
                    <TextField
                      type="number"
                      label="Net Royalty"
                      variant="outlined"
                      value={get(params, "value", 0)}
                      defaultValue={get(params, "value", 0)}
                      onWheel={(e) => e.target.blur()}
                      onBlur={(event) => offClickHandler("netRoyalty", event.target.value)}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => {
                        params.onChange(e.target.value);
                      }}
                      className={(keysSum.netRoyalty && params.value !== keysSum.netRoyalty) ? classes.baseValueChanged : classes.numberField}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {params.value !== keysSum.netRoyalty && (
                              <IconButton
                                aria-label="toggle netRoyalty"
                                onClick={() => {
                                  params.onChange(keysSum.netRoyalty);
                                  offClickHandler("netRoyalty", keysSum.netRoyalty)
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
