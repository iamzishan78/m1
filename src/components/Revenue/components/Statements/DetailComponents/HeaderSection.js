import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField, InputAdornment } from "@material-ui/core";
import AutoComplete from "components/Shared/components/Fields/AutoComplete";
import moment from "moment";
import { KeyboardDatePicker } from "@material-ui/pickers";
import debounce from "lodash/debounce";

import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { UPDATE_CHECK_DATA } from "graphQL/useMutationUpdateCheck";
import AutocompEntityNamesList from "components/Shared/Forms/Fields/AutocompEntityNamesList";

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
  const [check, setCheck] = useState({});
  const [updateCheck] = useMutation(UPDATE_CHECK_DATA);

  const { control, reset } = useForm();

  const handleUpdateCheck = debounce((checkKey) => {
    setCheck({ ...props?.details, ...checkKey })
    updateCheck({
      variables: {
        check: { ...props?.details, ...checkKey }
      },
    });
  }, 500)

  useEffect(() => {
    if (props?.details) {
      reset(props?.details)
      setCheck(props?.details);
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
              <Controller
                control={control}
                name='payor'
                defaultValue={check?.payor || {}}
                render={(
                  { onChange, value, ref },
                ) => (
                  <AutocompEntityNamesList variant='outlined' margin='' size='' nameAutValue={value} withContactCard={true}
                    setNameAutValue={(value) => {
                      if (value?._id)
                        onChange({ _id: value._id, name: value.name });
                      else
                        onChange({});
                      handleUpdateCheck({ payor: { ...check.payor, name: value?.name, _id: value?._id } })
                    }} />
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

              <Controller
                control={control}
                name="checkDate"
                render={(props) => (
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    disableToolbar
                    format="MM/DD/YYYY"
                    margin="normal"
                    id="date-picker-inline"
                    value={moment.utc(props.value).format("MM/DD/YYYY")}
                    onChange={(date) => {
                      props.onChange(date)
                      handleUpdateCheck({ checkDate: date ? String(date["_d"]) : "" });
                    }}
                    KeyboardButtonProps={{ "aria-label": "change date" }}
                    InputAdornmentProps={{ position: "start" }}
                    fullWidth
                  />
                )}
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
              <Controller
                control={control}
                name="payee.number"
                defaultValue={''}
                render={(props) => (
                  <TextField
                    margin="dense"
                    type="text"
                    variant="outlined"
                    onChange={(e) => {
                      props.onChange(e.target.value)
                      handleUpdateCheck({ payee: { ...check.payee, number: e.target.value } })
                    }}
                    value={props.value || ""}
                  />
                )}
              />
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
              <Controller
                control={control}
                name='payee'
                defaultValue={check?.payee || {}}
                render={(
                  { onChange, value, ref },
                ) => (
                  <AutocompEntityNamesList variant='outlined' margin='' size='' nameAutValue={value} withContactCard={true}
                    setNameAutValue={(value) => {
                      if (value?._id)
                        onChange({ _id: value._id, name: value.name });
                      else
                        onChange({});
                      handleUpdateCheck({ payee: { ...check.payee, name: value?.name, _id: value?._id } })
                    }} />
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
              <Controller
                control={control}
                name="depositDate"
                render={(props) => (
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    disableToolbar
                    format="MM/DD/YYYY"
                    margin="normal"
                    id="date-picker-inline"
                    value={moment.utc(props.value).format("MM/DD/YYYY") || ""}
                    onChange={(date) => {
                      props.onChange(date)
                      handleUpdateCheck({ depositDate: date ? String(date["_d"]) : "" });
                    }}
                    KeyboardButtonProps={{ "aria-label": "change date" }}
                    InputAdornmentProps={{ position: "start" }}
                    fullWidth
                  />
                )}
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
              <Controller
                control={control}
                name="checkAmount"
                defaultValue={''}
                render={(props) => (
                  <TextField
                    margin="dense"
                    type="text"
                    variant="outlined"
                    onChange={(e) => {
                      props.onChange(e.target.value)
                      handleUpdateCheck({ checkAmount: e.target.value })
                    }}
                    InputProps={{
                      startAdornment: (< InputAdornment position="start" > $</InputAdornment>)
                    }}
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
              <div className={classes.boldLabel}>Source</div>
            </Grid>
            <Grid item xs={9}>
              <Controller
                control={control}
                name="source"
                defaultValue={''}
                render={(props) => (
                  <AutoComplete
                    options={["Manual Entry", "Imported", "CDEX"]}
                    value={props.value || ""}
                    onChange={(value) => {
                      props.onChange(value)
                      handleUpdateCheck({ source: value })
                    }}
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

              <Controller
                control={control}
                name="sourceId"
                defaultValue={''}
                render={(props) => (
                  <TextField
                    margin="dense"
                    type="text"
                    variant="outlined"
                    onChange={(e) => {
                      props.onChange(e.target.value)
                      handleUpdateCheck({ sourceId: e.target.value })
                    }}
                    value={props.value || ""}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
