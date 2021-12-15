import React, { useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
  actionBar: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
    marginTop: "100px",
  },
  actionsGrid: {
    marginTop: "6px",
    "& .MuiButtonBase-root": {
      width: "149px",
      height: "35px",
      fontWeight: "bold",
    },
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

const CUSTOM_DATES = {
  THIS_YEAR_TO_LAST_MONTH: "This year-to-last-month",
  THIS_YEAR_TO_DATE: "This year to date",
  LAST_YEAR_TO_DATE: "Last year to date",
  LAST_MONTH: "Last Month",
  THIS_MONTH: "This Month",
  LAST_QUARTER: "Last Quarter",
  THIS_QUARTER: "This Quarter",
  LAST_YEAR: "Last Year",
};

export default function Portfolio({ onChangeDates }) {
  const classes = useStyles();
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);

  useEffect(() => {
    if (onChangeDates) onChangeDates(fromDate, toDate);
  }, [fromDate, toDate]);

  const getFlaggedMoment = (moment) => {
    return moment >= 10 ? moment : `0${moment}`;
  };

  const hadnleDateTypeChange = (date) => {
    const currentYear = Math.round(new Date().getFullYear());
    const currentMonth = Math.ceil(new Date().getMonth());
    const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
    switch (date) {
      case CUSTOM_DATES.THIS_YEAR_TO_LAST_MONTH:
        setFromDate(`${currentYear}-01`);
        setToDate(`${currentYear}-${getFlaggedMoment(currentMonth)}`);
        break;
      case CUSTOM_DATES.THIS_YEAR_TO_DATE:
        setFromDate(`${currentYear}-01`);
        setToDate(`${currentYear}-${getFlaggedMoment(currentMonth + 1)}`);
        break;
      case CUSTOM_DATES.LAST_YEAR_TO_DATE:
        setFromDate(`${currentYear - 1}-01`);
        setToDate(`${currentYear - 1}-${getFlaggedMoment(currentMonth + 1)}`);
        break;
      case CUSTOM_DATES.LAST_MONTH:
        const lastMonth = new Date().getMonth();
        setFromDate(`${currentYear}-${getFlaggedMoment(lastMonth)}`);
        setToDate(`${currentYear}-${getFlaggedMoment(lastMonth)}`);
        break;
      case CUSTOM_DATES.THIS_MONTH:
        setFromDate(`${currentYear}-${getFlaggedMoment(currentMonth + 1)}`);
        setToDate(`${currentYear}-${getFlaggedMoment(currentMonth + 1)}`);
        break;
      case CUSTOM_DATES.LAST_QUARTER:
        setFromDate(`${currentYear}-${getFlaggedMoment(currentQuarter * 3 - 5)}`);
        setToDate(`${currentYear}-${getFlaggedMoment(currentQuarter * 3 - 3)}`);
        break;
      case CUSTOM_DATES.THIS_QUARTER:
        setFromDate(`${currentYear}-${getFlaggedMoment(currentQuarter * 3 - 2)}`);
        setToDate(`${currentYear}-${getFlaggedMoment(currentQuarter * 3)}`);
        break;
      case CUSTOM_DATES.LAST_YEAR:
        setFromDate(`${currentYear - 1}-01`);
        setToDate(`${currentYear - 1}-12`);
        break;
      default:
        setFromDate(null);
        setToDate(null);
    }
  };

  return (
    <Grid item xs={7} md={8} style={{ marginTop: "4px" }}>
      <Grid container direction="row" display="flex" alignItems="center" spacing={3}>
        <Grid item xs={3} style={{ marginTop: "2px" }}>
          <Autocomplete
            size="small"
            onChange={(event, newValue) => {
              hadnleDateTypeChange(newValue);
            }}
            options={Object.values(CUSTOM_DATES)}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Custom" placeholder="" style={{ backgroundColor: "white" }} />
            )}
            disableListWrap
            id="custom-date-dropdown"
          />
        </Grid>
        <Grid item>
          <TextField
            size="small"
            margin="dense"
            type="month"
            variant="outlined"
            placeholder=""
            fullWidth
            value={fromDate}
            className={classes.inputFieldDate}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              classes: {
                root: classes.dateRoot,
                focused: classes.focused,
                notchedOutline: classes.notchedOutline,
              },
            }}
            onChange={(event) => {
              setFromDate(event.target.value);
            }}
          />
        </Grid>
        <Grid>
          <label>to</label>
        </Grid>
        <Grid item>
          <TextField
            size="small"
            margin="dense"
            type="month"
            variant="outlined"
            placeholder="to"
            fullWidth
            value={toDate}
            className={classes.inputFieldDate}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              classes: {
                root: classes.dateRoot,
                focused: classes.focused,
                notchedOutline: classes.notchedOutline,
              },
            }}
            onChange={(event) => {
              setToDate(event.target.value);
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
