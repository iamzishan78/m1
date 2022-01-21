import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";

import StateField from "./State";
import CountyField from "./County";
import AssociatedWellsList from "components/Shared/Wells/AssociatedWells";
import AutoComplete from "components/Shared/components/Fields/AutoComplete";

import ContactCardIcon from "components/Shared/svgIcons/contact_card";

const useStyles = makeStyles((theme) => ({
  titleText: {
    textTransform: "uppercase",
    margin: "5px 16px 10px",
    color: "#5a5a5a",
  },
  fieldsSection: {
    margin: "0px 0px",
    "& .MuiOutlinedInput-root": {
      height: `46px !important`,
      borderRadius: "6px !important",
    },
  },
  gridStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  boldLabel: {
    fontWeight: "bold",
    fontSize: "15px",
  },
  wellsSelectField: {
    "& .MuiInputBase-root": {
      borderRadius: "8px",
    },
  },
  formControl: {
    width: "100%",
  },
  dateRoot: {
    color: "grey",
    "& input": {
      marginLeft: "20px",
    },
  },
  infoSection: {
    maxWidth: "70%",
  },
  associatedWell: {
    border: "2px solid #d5d5d5",
    height: "382px",
    borderRadius: "15px",
    maxWidth: "30%",
    width: "30%",
  },
  adornmentAutocomplete: {
    "& .MuiAutocomplete-endAdornment": {
      right: "50px !important",
      "& .MuiAutocomplete-clearIndicator": {
        display: "none",
      },
    },
  },
  contactCardIcon: {
    position: "absolute",
    right: "6px !important",
    marginTop: "4px !important",
  },
  textArea: {
    margin: "0px 0px",
    "& .MuiOutlinedInput-root": {
      height: `auto !important`,
      borderRadius: "6px !important",
    },
  },
  datePicker: {
    "& .MuiIconButton-root": {
      padding: "12px 0px",
    },
  },
}));

export default function HeaderFunction(props) {
  const classes = useStyles();

  const { control, setValue, watch, register } = useForm();

  useEffect(() => {
    register("state");
    register("county");
  }, [register]);

  const selectedState = watch("state", {});

  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid item className={classes.infoSection}>
        <Grid
          container
          direction="row"
          display="flex"
          justify="flex-start"
          alignItems="center"
          spacing={1}
          className={classes.fieldsSection}
        >
          <Grid item xs={5}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.boldLabel}>Property #</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="propertyNumber"
                  render={(params) => <TextField {...params} variant="outlined" margin="dense" type="text" fullWidth />}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.boldLabel}>Property</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="propertyName"
                  render={(params) => <TextField {...params} variant="outlined" margin="dense" type="text" fullWidth />}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={5}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.boldLabel}>Owner #</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="ownerNumber"
                  render={(params) => <TextField {...params} variant="outlined" margin="dense" placeholder="" fullWidth />}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.boldLabel}>Owner</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="ownerName"
                  render={(params) => (
                    <AutoComplete
                      options={["Hell", "Paradise"]}
                      fullWidth
                      className={classes.adornmentAutocomplete}
                      renderInput={(params) => (
                        <TextField
                          margin="dense"
                          {...params}
                          variant="outlined"
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            shrink: true,
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {params.InputProps.endAdornment}
                                <div className={classes.contactCardIcon}>
                                  <ContactCardIcon />
                                </div>
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={5}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.boldLabel}>Date</div>
              </Grid>
              <Grid item xs={8} className={classes.datePicker}>
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  disableToolbar
                  format="MM/DD/YYYY"
                  margin="normal"
                  id="date-picker-inline"
                  // value={moment.utc(check?.checkDate).format("MM/DD/YYYY") || ""}
                  // onChange={(date) => {
                  //   handleUpdateCheck({ checkDate: date ? String(date["_d"]) : "" });
                  // }}
                  KeyboardButtonProps={{ "aria-label": "change date" }}
                  InputAdornmentProps={{ position: "start" }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.boldLabel}>Operator</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="operatorName"
                  render={(params) => (
                    <AutoComplete
                      options={["Hell", "Paradise"]}
                      fullWidth
                      className={classes.adornmentAutocomplete}
                      renderInput={(params) => (
                        <TextField
                          margin="dense"
                          {...params}
                          variant="outlined"
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            shrink: true,
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {params.InputProps.endAdornment}
                                <div className={classes.contactCardIcon}>
                                  <ContactCardIcon />
                                </div>
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={5}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.boldLabel}>State</div>
              </Grid>
              <Grid item xs={8}>
                <StateField onStateChange={(state) => setValue("state", state)} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.boldLabel}>County</div>
              </Grid>
              <Grid item xs={9}>
                <CountyField state={selectedState.acronym} onCountyChange={(county) => setValue("county", county)} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={`${classes.gridStyle} ${classes.textArea}`}>
              <Grid item style={{ flexBasis: "10.3%" }}>
                <div className={classes.boldLabel}>Legal Description</div>
              </Grid>
              <Grid item style={{ flexBasis: "84.8%" }}>
                <TextField margin="dense" type="number" variant="outlined" fullWidth multiline rows={5} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes.associatedWell}>
        <AssociatedWellsList title="Associated Wells" />
      </Grid>
    </Grid>
  );
}
