import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField, Typography, Button } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";

import WellIcon from "components/Shared/svgIcons/well";
import TractIcon from "components/Shared/svgIcons/tract";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import AddIcon from "@material-ui/icons/Add";

import ProgressBar from "components/Shared/ui/ProgressBar";

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
  fieldLabel: {
    fontWeight: "bold",
    fontSize: "17px",
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
    maxWidth: "50%",
  },
  mapSection: {
    height: "382px",
    width: "45%",
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
  summaryHeaderIcons: {
    "& .MuiGrid-item": {
      display: "flex",
      alignItems: "center",
      "& div": {
        marginRight: "5px",
      },
    },
  },
  summaryHeader: {
    display: "flex",
    justify: "space-between",
    marginBottom: 20,
    fontWeight: "bold",
  },
  addDataButton: {
    backgroundColor: "white",
    color: "black",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.common.white,
      opacity: 0.15,
    },
  },
}));

export default function Summary({ agreementDetails }) {
  const classes = useStyles();
  const { control, reset } = useForm();

  useEffect(() => {
    reset(agreementDetails);
  }, [reset, agreementDetails]);

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
          <Grid item xs={12} className={classes.summaryHeader}>
            <div style={{ display: "flex", width: "50%" }}>
              <Typography variant="h5" style={{ marginRight: "15px", textTransform: "uppercase", fontWeight: "bold" }}>
                Summary
              </Typography>
              <ProgressBar value={35} height="3px" isNumeric />
            </div>
            <div style={{ width: "43%" }}>
              <Grid container spacing={2} justify="flex-end" className={classes.summaryHeaderIcons}>
                <Grid item>
                  <div className={classes.summaryValue}> {0} </div>
                  <WellIcon className={classes.icon} color={"#757575"} opacity="1.0" small />
                </Grid>
                <Grid item>
                  <div className={classes.summaryValue}> {0} </div>
                  <TractIcon className={classes.icon} opacity="1.0" small />
                </Grid>
                <Grid item>
                  <div className={classes.summaryValue}> {0} </div>
                  <InsertDriveFileOutlinedIcon className={classes.icon} opacity="1.0" small />
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Agreement Number</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="agreementNumber"
                  render={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="dense"
                      type="text"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Agreement Name</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="agreementName"
                  render={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="dense"
                      type="text"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Agreement Type</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="type"
                  render={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="dense"
                      type="text"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Agreement Subtype</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="agreementSubtype"
                  render={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="dense"
                      type="text"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Right Type</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="rightType"
                  render={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="dense"
                      type="text"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Agreement Status</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="status"
                  render={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="dense"
                      type="text"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Lessor (Grantor)</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="agreementName"
                  render={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="dense"
                      type="text"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Lessee (Grantee)</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="Grantee"
                  render={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="dense"
                      type="text"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Agreement Date</div>
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Effective Date</div>
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Expiration Date</div>
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Extension Date</div>
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Bonus Payment</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="agreementName"
                  render={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="dense"
                      type="text"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.fieldLabel}>Approval Status</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="agreementName"
                  render={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="dense"
                      type="text"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" className={classes.addDataButton} startIcon={<AddIcon />}>
              Add Custom Data
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes.mapSection}>
        <h1>Map Here</h1>
      </Grid>
    </Grid>
  );
}
