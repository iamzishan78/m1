import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { Grid, TextField, InputAdornment, Select, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Controller } from "react-hook-form";
import { useLazyQuery } from "@apollo/client";

import AutoCompleteWithAddNew from "components/Shared/AutoCompleteWithAddNew";
import AutocompEntityNamesList from "components/Shared/Forms/Fields/AutocompEntityNamesList";
import _ from "lodash";
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
  const { control, reset, getValues, setStateApp, uploaderFormValues } = rest;

  useEffect(() => {
    if (uploaderFormValues) reset(uploaderFormValues);
    return () => {
      const values = getValues();
      // Object.keys(values).forEach((key) => {
      //   if (typeof values[key] === "object") {
      //     Object.keys(values[key]).forEach((vk) => {
      //       values[`check.${key}.${vk}`] = values[key][vk];
      //     });
      //   } else {
      //     values[`check.${key}`] = values[key];
      //   }
      // });
      setStateApp((stateApp) => ({ ...stateApp, uploaderFormValues: values }));
    };
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.title}>Begin by entering the following agreement header information</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Grid container display="flex" direction="row" alignItems="center" style={{ padding: "10px 35px", maxWidth: "540px" }}>
          <Grid item sm={12} md={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={4}>
                <div className={classes.boldLabel}>Recording Date</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="recordedDate"
                  render={(params) => (
                    <TextField
                      {...params}
                      id="recordedDate"
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
                <div className={classes.boldLabel}>Book</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="recordedBook"
                  defaultValue={""}
                  render={(params) => <TextField id="recordedBook" {...params} fullWidth margin="dense" type="text" variant="outlined" />}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={4}>
                <div className={classes.boldLabel}>Page</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="recordedPage"
                  defaultValue={""}
                  render={(params) => <TextField id="recordedPage" {...params} fullWidth margin="dense" type="text" variant="outlined" />}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={4}>
                <div className={classes.boldLabel}>Instrument #</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="recordedInstrumentNumber"
                  defaultValue={""}
                  render={(params) => (
                    <TextField id="recordedInstrumentNumber" {...params} fullWidth margin="dense" type="text" variant="outlined" />
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
