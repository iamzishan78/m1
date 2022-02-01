import React, { useEffect, useState, Fragment } from "react";
import find from "lodash.find";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Grid, TextField, Typography, Button, Box, FormControl, InputLabel, InputBase, Select, MenuItem } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { useStyles as summaryStyles } from "./style";
import WellIcon from "components/Shared/svgIcons/well";
import TractIcon from "components/Shared/svgIcons/tract";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import AddIcon from "@material-ui/icons/Add";
import fieldsList from "./data";

import keys from "components/Shared/SpreadsheetGrid/kit/keymap";
import ProgressBar from "components/Shared/ui/ProgressBar";
import AutoCompleteTypeComponent from "components/Shared/Forms/Fields/AutoCompleteType";

export default function FieldsSection({ updateAgreement, control, agreementDetails }) {
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
    // console.log(console.log(getValues()));
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

      {fieldsList.map((field, index) => (
        <Grid item xs={12}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={3}>
              <div className={classes.fieldLabel}>{field.label}</div>
            </Grid>
            <Grid item xs={8}>
              <Fragment key={index}>
                {(field.type === "text" || field.type === "select") && (
                  <Controller
                    control={control}
                    name={field.key}
                    render={(params) => {
                      return (
                        <Fragment>
                          {field.type === "text" && (
                            <TextField
                              {...params}
                              id={`field-${index}`}
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
                          {field.type === "select" && (
                            <Select
                              {...params}
                              id={`field-${index}`}
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onBlur={offClickHandler}
                            >
                              {field.options.map((option) => (
                                <MenuItem value={option.value ? option.value : option}>{option.label ? option.label : option}</MenuItem>
                              ))}
                            </Select>
                          )}
                        </Fragment>
                      );
                    }}
                  />
                )}
                {field.type === "date" && (
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    disableToolbar
                    format="MM/DD/YYYY"
                    margin="normal"
                    id={`field-${index}`}
                    KeyboardButtonProps={{ "aria-label": "change date" }}
                    InputAdornmentProps={{ position: "start" }}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
                {field.type === "autocomplete" && (
                  <AutoCompleteTypeComponent
                    value={agreementDetails?.[field.key]}
                    shapeType={"Agreement"}
                    typeKey={field.key}
                    variant="outlined"
                    onChange={() => {}}
                  />
                )}
              </Fragment>
            </Grid>
          </Grid>
        </Grid>
      ))}
      <Grid item>
        <Button variant="contained" color="primary" className={classes.addDataButton} startIcon={<AddIcon />}>
          Add Custom Data
        </Button>
      </Grid>
    </Grid>
  );
}
