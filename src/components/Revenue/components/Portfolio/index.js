import React from "react";
import { Grid, Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

import AnalyticsCards from "components/Revenue/components/Portfolio/AnalyticsCards";

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
  YESTERDAY: "Yesterday",
  RECENT: "Recent",
  LAST_WEEK: "Last week",
  LAST_WEEK_TO_DATE: "Last week-to-date",
  LAST_MONTH: "Last Month",
  LAST_MONTH_TO_DATE: "Last month-to-date",
  LAST_QUARTER: "Last Quarter",
  LAST_QUARTER_TO_DATE: "Last quarter-to-date",
  LAST_YEAR: "Last Year",
  LAST_YEAR_TO_DATE: "Last year-to-date",
};

export default function Portfolio() {
  const classes = useStyles();
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);

  const hadnleDateTypeChange = (date) => {
    const currentYear = Math.round(new Date().getFullYear());
    switch (date) {
      case CUSTOM_DATES.THIS_YEAR_TO_LAST_MONTH:
        setFromDate(`${currentYear}-01`);
        setToDate(`${currentYear}-12`);
        break;
      case CUSTOM_DATES.YESTERDAY:
      case CUSTOM_DATES.RECENT:
      case CUSTOM_DATES.LAST_WEEK:
      case CUSTOM_DATES.LAST_WEEK_TO_DATE:
        const currentMonth = new Date().getMonth();
        setFromDate(`${currentYear}-${currentMonth}`);
        setToDate(`${currentYear}-${currentMonth}`);
        break;
      case CUSTOM_DATES.LAST_MONTH:
      case CUSTOM_DATES.LAST_MONTH_TO_DATE:
        const lastMonth = new Date().getMonth(-1);
        setFromDate(`${currentYear}-${lastMonth}`);
        setToDate(`${currentYear}-${lastMonth}`);
        break;
      case CUSTOM_DATES.LAST_QUARTER:
      case CUSTOM_DATES.LAST_QUARTER_TO_DATE:
        const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
        setFromDate(`${currentYear}-${currentQuarter * 3 - 2}`);
        setToDate(`${currentYear}-${currentQuarter * 3}`);
        break;
      case CUSTOM_DATES.LAST_YEAR:
        setFromDate(`${currentYear - 1}-01`);
        setToDate(`${currentYear - 1}-12`);
        break;
      case CUSTOM_DATES.LAST_YEAR_TO_DATE:
        setFromDate(`${currentYear - 1}-01`);
        setToDate(`${currentYear}-12`);
        break;
      default:
    }
  };

  return (
    <>
      <div className={classes.actionBar}>
        <Grid container direction="row" display="flex" justify="space-between" style={{ padding: "0px 78px" }}>
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
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5} md={4}>
            <Grid container display="flex" justify="flex-end" direction="row" spacing={2} className={classes.actionsGrid}>
              <Grid item>
                <Button variant="contained" color="secondary">
                  Save View
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained">Run Report</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <AnalyticsCards />
    </>
  );
}
