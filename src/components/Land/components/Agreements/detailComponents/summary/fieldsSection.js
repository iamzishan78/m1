import React, { useEffect, useState } from "react";
import find from "lodash.find";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Grid, TextField, Typography, Button, Box, FormControl, InputLabel, InputBase } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { useStyles as summaryStyles } from "./style";
import WellIcon from "components/Shared/svgIcons/well";
import TractIcon from "components/Shared/svgIcons/tract";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import AddIcon from "@material-ui/icons/Add";

import keys from "components/Shared/SpreadsheetGrid/kit/keymap";

import ProgressBar from "components/Shared/ui/ProgressBar";

export default function FieldsSection({ updateAgreement, control, getValues }) {
  const classes = summaryStyles();

  useEffect(() => {
    document.addEventListener("keydown", onGlobalKeyDown, false);
    document.addEventListener("blur", (e) => {
      console.log("blur triggered");
    });
    // document.addEventListener("focus", onGLobalFocus);
  }, []);

  // const onGLobalFocus = (e) => {
  //   console.log(e);
  // };
  const onGlobalKeyDown = (e) => {
    const id = e?.target?.id;

    if (e.keyCode === keys.TAB) {
      if (e.shiftKey) {
        if (!document.getElementById(`field-${Number(id.split("-")[1]) - 1}`)) {
          e.preventDefault();
          return;
        } else document.getElementById(`field-${Number(id.split("-")[1])}`).focus();
      }
    }
  };

  const offClickHandler = () => {
    console.log(console.log(getValues()));
  };
  return (
    <Grid container direction="row" display="flex" justify="flex-start" alignItems="center" spacing={1} className={classes.fieldsSection}>
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
              <WellIcon className={classes.icon} color="#757575" opacity="1.0" small />
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
                  id="field-1"
                  variant="outlined"
                  margin="dense"
                  type="text"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onBlur={offClickHandler}
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
                  id="field-2"
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
                  id="field-3"
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
                  id="field-4"
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
                  id="field-5"
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
                  id="field-6"
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
                  id="field-7"
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
                  id="field-8"
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
              id="field-9"
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
              id="field-10"
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
              id="field-11"
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
              id="field-12"
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
                  id="field-13"
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
                  id="field-14"
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
  );
}
