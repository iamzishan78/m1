import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, TextField, IconButton, InputAdornment } from "@material-ui/core";
import AutoComplete from "components/Shared/components/Fields/AutoComplete";
import moment from "moment";
import { KeyboardDatePicker } from "@material-ui/pickers";
import ContactCardDisabledIcon from "components/Shared/svgIcons/contact_card_disabled";

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
      height: `46px!important`,
    },
  },
}));

export default function HeaderFunction(props) {
  const classes = useStyles();
  const [check, updateCheck] = useState({});

  const handleUpdateCheck = (checkKey) => {
    updateCheck({ ...check, ...checkKey });
  };

  useEffect(() => {
    if (props?.details) {
      updateCheck(props?.details);
    }
  }, [props]);

  return (
    <div className={classes.root}>
      {/* <Typography varient="h5" className={classes.titleText}>
        Check Header
      </Typography> */}

      <Grid
        container
        direction="row"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        spacing={3}
        className={classes.fieldsSection}
      >
        <Grid item xs={3}>
          {/* Check number */}
          <TextField margin="dense" type="text" variant="filled" label="Check Number" fullWidth value={check?.checkNumber || ""} />
        </Grid>

        {/* Purchaser name */}
        <Grid item xs={4}>
          <AutoComplete variant="filled" label="Purchaser Name" options={[check?.payor?.name]} value={check?.payor?.name || null} />
        </Grid>

        <Grid item xs={1}>
          <IconButton
            size="small"
            color="secondary"
            style={{ marginBottom: -16 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            aria-label="show purchaser name"
          >
            <ContactCardDisabledIcon />
          </IconButton>
        </Grid>

        {/* Check date */}
        <Grid item xs={4}>
          <KeyboardDatePicker
            autoOk
            variant="inline"
            disableToolbar
            label="Check Date"
            format="MM/DD/YYYY"
            margin="normal"
            id="date-picker-inline"
            value={moment.utc(check?.checkDate).format("MM/DD/YYYY") || ""}
            onChange={(date) => {
              handleUpdateCheck({ checkDate: date ? String(date["_d"]) : "" });
            }}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </Grid>

        {/* Owner number */}
        <Grid item xs={3}>
          <TextField margin="dense" type="text" variant="filled" label="Owner Number" fullWidth value={check?.payee?.number || ""} />
        </Grid>

        {/* Owner name */}
        <Grid item xs={4}>
          <AutoComplete label="Owner Name" options={[check?.payee?.name]} value={check?.payee?.name || null} />
        </Grid>

        <Grid item xs={1}>
          <IconButton
            size="small"
            color="secondary"
            style={{ marginBottom: -16 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            aria-label="show purchaser name"
          >
            <ContactCardDisabledIcon />
          </IconButton>
        </Grid>

        {/* Deposit date */}
        <Grid item xs={4}>
          <KeyboardDatePicker
            autoOk
            variant="inline"
            disableToolbar
            label="Deposit Date"
            format="MM/DD/YYYY"
            margin="normal"
            id="date-picker-inline"
            value={moment.utc(check?.depositDate).format("MM/DD/YYYY") || ""}
            onChange={(date) => {
              handleUpdateCheck({ depositDate: date ? String(date["_d"]) : "" });
            }}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </Grid>

        {/* Check amount */}
        <Grid item xs={4}>
          <TextField
            margin="dense"
            type="number"
            variant="filled"
            label="Check Amount"
            fullWidth
            value={check?.checkAmount || 0}
            InputProps={{
              startAdornment: (< InputAdornment position="start" > $</InputAdornment>)
            }}
          />
        </Grid>
      </Grid>
    </div >
  );
}
