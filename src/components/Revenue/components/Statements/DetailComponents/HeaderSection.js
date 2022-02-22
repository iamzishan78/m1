import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, TextField, IconButton, InputAdornment } from "@material-ui/core";
import AutoComplete from "components/Shared/components/Fields/AutoComplete";
import moment from "moment";
import { KeyboardDatePicker } from "@material-ui/pickers";
import debounce from "lodash/debounce";
import ContactCardIcon from "components/Shared/svgIcons/contact_card";
import { Controller, useForm } from "react-hook-form";

const useStyles = makeStyles(() => ({
  root: {
    color: "black",
    "&.MuiAccordion-root.Mui-expanded": {
      margin: 0,
    },
    "& .MuiFilledInput-root, & .MuiSelect-select.MuiSelect-select": {
      background: `none!important`,
    },
  },
  titleText: {
    textTransform: "uppercase",
    margin: "5px 16px 10px",
    fontWeight: "bold",
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
  },
  datePicker: {
    "& .MuiIconButton-root": {
      padding: "12px 0px"
    }
  },
  adornmentAutocomplete: {
    "& .MuiAutocomplete-endAdornment": {
      right: "50px !important",
      "& .MuiAutocomplete-clearIndicator": {
        display: "none"
      }
    },
  },
  contactCardIcon: {
    position: "absolute",
    right: "6px !important",
    marginTop: "4px !important"
  }
}));

export default function HeaderFunction(props) {
  const classes = useStyles();
  const [check, updateCheck] = useState({});

  const { control, reset } = useForm();

  const handleUpdateCheck = debounce((checkKey) => {
    updateCheck({ ...check, ...checkKey });
  }, 500)

  useEffect(() => {
    if (props?.details) {
      reset(props?.details)
      updateCheck(props?.details);
    }
  }, [props]);

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        display="flex"
        justify="flex-start"
        alignItems="center"
        spacing={1}
        className={classes.fieldsSection}
      >
        <Grid item xs={3}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={6}>
              <div className={classes.boldLabel}>Check Number</div>
            </Grid>
            <Grid item xs={5}>

              <Controller
                control={control}
                name="checkNumber"
                defaultValue={''}
                render={(props) => (
                  <TextField
                    margin="dense"
                    type="text"
                    variant="outlined"
                    onChange={(e) => {
                      props.onChange(e.target.value)
                      handleUpdateCheck({ checkNumber: e.target.value })
                    }
                    }
                    value={props.value || ""}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={3}>
              <div className={classes.boldLabel}>Purchaser</div>
            </Grid>
            <Grid item xs={9}>
              <AutoComplete
                options={[check?.payor?.name]}
                value={check?.payor?.name || null}
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
                          <div className={classes.contactCardIcon}><ContactCardIcon /></div>
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Check date */}
        <Grid item xs={4}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={5} style={{ paddingLeft: "25px" }}>
              <div className={classes.boldLabel}>Check Date</div>
            </Grid>
            <Grid item xs={6} className={classes.datePicker}>
              <KeyboardDatePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                disableToolbar
                format="MM/DD/YYYY"
                margin="normal"
                id="date-picker-inline"
                value={moment.utc(check?.checkDate).format("MM/DD/YYYY") || ""}
                onChange={(date) => {
                  handleUpdateCheck({ checkDate: date ? String(date["_d"]) : "" });
                }}
                KeyboardButtonProps={{ "aria-label": "change date" }}
                InputAdornmentProps={{ position: "start" }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Owner number */}
        <Grid item xs={3}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={6}>
              <div className={classes.boldLabel}>Owner Number</div>
            </Grid>
            <Grid item xs={5}>
              <TextField margin="dense" type="text" variant="outlined" value={check?.payee?.number || ""} />
            </Grid>
          </Grid>
        </Grid>

        {/* Owner name */}
        <Grid item xs={5}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={3}>
              <div className={classes.boldLabel}>Owner</div>
            </Grid>
            <Grid item xs={9}>
              <AutoComplete
                options={[check?.payee?.name]}
                value={check?.payee?.name || null}
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
                          <div className={classes.contactCardIcon}><ContactCardIcon /></div>
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Deposit date */}
        <Grid item xs={4}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={5} style={{ paddingLeft: "25px" }}>
              <div className={classes.boldLabel}>Deposit Date</div>
            </Grid>
            <Grid item xs={6} className={classes.datePicker}>
              <KeyboardDatePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                disableToolbar
                format="MM/DD/YYYY"
                margin="normal"
                id="date-picker-inline"
                value={moment.utc(check?.depositDate).format("MM/DD/YYYY") || ""}
                onChange={(date) => {
                  handleUpdateCheck({ depositDate: date ? String(date["_d"]) : "" });
                }}
                KeyboardButtonProps={{ "aria-label": "change date" }}
                InputAdornmentProps={{ position: "start" }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Check amount */}
        <Grid item xs={3}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={6}>
              <div className={classes.boldLabel}>Check Amount</div>
            </Grid>
            <Grid item xs={5}>
              <TextField
                margin="dense"
                type="text"
                variant="outlined"
                value={check?.checkAmount}
                InputProps={{
                  startAdornment: (< InputAdornment position="start" > $</InputAdornment>)
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={5}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={3}>
              <div className={classes.boldLabel}>Source</div>
            </Grid>
            <Grid item xs={9}>
              <AutoComplete
                options={["Manual Entry", "Imported", "CDEX"]}
                value={check?.source}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    margin="dense"
                    {...params}
                    variant="outlined"
                    InputLabelProps={{
                      ...params.InputLabelProps,
                      shrink: true,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={5} style={{ paddingLeft: "25px" }}>
              <div className={classes.boldLabel}>Source ID</div>
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                type="text"
                variant="outlined"
                value={check?.sourceId}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
