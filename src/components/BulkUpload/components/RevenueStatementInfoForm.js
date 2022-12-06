import React, { useEffect } from "react";
import { get } from "lodash";
import { Grid, TextField, InputAdornment, Select, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Controller } from "react-hook-form";
import { useLazyQuery } from "@apollo/client";

import AutoCompleteWithAddNew from "components/Shared/AutoCompleteWithAddNew";
import AutocompEntityNamesList from "components/Shared/Forms/Fields/AutocompEntityNamesList";

import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px 33%",
  },
  title: {
    textAlign: "center",
    fontSize: "17px",
    fontWeight: 700,
    padding: "20px 0px",
  },
  gridStyle: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  boldLabel: {
    fontWeight: "bold",
  },
  dateRoot: {
    border: "1px solid #EBEBEB",
    backgroundColor: "#fff",
    "&.Mui-focused fieldset": {
      border: "1px solid black",
      backgroundColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "#EBEBEB",
    },
    "&:active": {
      border: "1px solid black",
      backgroundColor: "#fff",
    },
  },
}));

const RevenueStatementInfoForm = ({ ...rest }) => {
  const classes = useStyles();
  const { control, watch, reset, getValues, setStateApp, revenueStatementInfo } = rest;

  const [getPayorList, { data: payorList }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });

  useEffect(() => {
    if (revenueStatementInfo) reset(revenueStatementInfo);
    return () => {
      const values = getValues();
      Object.keys(values).forEach(key => {
        if (typeof values[key] === "object") {
          Object.keys(values[key]).forEach(vk => {
            values[`check.${key}.${vk}`] = values[key][vk];
          });
        } else {
          values[`check.${key}`] = values[key];
        }
      });
      setStateApp(stateApp => ({ ...stateApp, revenueStatementInfo: values }));
    };
  }, []);

  useEffect(() => {
    getPayorList({
      variables: {
        search: "*",
        filterKey: "payor.name.keyword",
        esIndex: "checks_flat",
        size: 50,
      },
    });
  }, [getPayorList]);

  return (
    <div className={classes.root}>
      <div className={classes.title}>Begin by entering the following revenue statement information</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Grid container display="flex" direction="row" alignItems="center" style={{ padding: "10px 35px", maxWidth: "540px" }}>
          <Grid item sm={12} md={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={4}>
                <div className={classes.boldLabel}>Payor *</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="payor"
                  render={(params) => (
                    <AutoCompleteWithAddNew
                      {...params}
                      value={get(params, "value.name", "")}
                      variant="outlined"
                      setValue={params.onChange}
                      options={get(payorList, "getESFilterList.hits", [])?.map((payor) => ({
                        _id: get(payor, `original.hits.hits.${0}._id`),
                        name: payor.key,
                      }))}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={4}>
                <div className={classes.boldLabel}>Check Number *</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="checkNumber"
                  defaultValue={""}
                  render={(params) => <TextField {...params} fullWidth margin="dense" type="text" variant="outlined" />}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={4}>
                <div className={classes.boldLabel}>Check Amount *</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="checkAmount"
                  defaultValue={""}
                  render={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="dense"
                      type="text"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"> $</InputAdornment>,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={4}>
                <div className={classes.boldLabel}>Check Date</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="checkDate"
                  render={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      type="date"
                      variant="outlined"
                      margin="dense"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disableToolbar
                      KeyboardButtonProps={{ "aria-label": "change date" }}
                      format="MM/DD/YYYY"
                      PopoverProps={{ disablePortal: false }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={4}>
                <div className={classes.boldLabel}>Owner Number</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="payee.number"
                  defaultValue={""}
                  render={(params) => <TextField {...params} fullWidth margin="dense" type="text" variant="outlined" />}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={4}>
                <div className={classes.boldLabel}>Owner</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="payee"
                  render={({ onChange, value, ref }) => (
                    <AutocompEntityNamesList
                      variant="outlined"
                      margin="dense"
                      nameAutValue={value?.name ?? ""}
                      withContactCard={false}
                      setNameAutValue={(value) => {
                        if (value?._id) onChange({ number: watch("payee.number"), _id: value._id, name: value.name });
                        else {
                          onChange({
                            number: watch("payee.number"),
                            name: "",
                            _id: "",
                          });
                        }
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={4}>
                <div className={classes.boldLabel}>Source ID</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="sourceId"
                  defaultValue={""}
                  render={(params) => <TextField {...params} fullWidth margin="dense" type="text" variant="outlined" />}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={4}>
                <div className={classes.boldLabel}>Import Type</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="importType"
                  defaultValue="Standard M1 Import"
                  render={(params) => (
                    <Select {...params} fullWidth margin="dense" variant="outlined">
                      <MenuItem value="Standard M1 Import">Standard M1 Import</MenuItem>
                    </Select>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default RevenueStatementInfoForm;
