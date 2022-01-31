import React, { useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";

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

// fromDate and toDate should be passed from the parent
export default function Portfolio({ onChangeDates, fromDate, setFromDate, toDate, setToDate }) {
  const classes = useStyles();

  useEffect(() => {
    handleDateTypeChange(CUSTOM_DATES.LAST_MONTH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (onChangeDates) onChangeDates(fromDate, toDate);
  }, [onChangeDates, fromDate, toDate]);

  const getFlaggedMoment = (moment) => {
    return moment >= 10 ? moment : `0${moment}`;
  };

  // const getLastMonthStartDate = () => {
  //   return new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  // }
  // const getLastMonthEndDate = () => {
  //   return new Date(new Date().getFullYear(), new Date().getMonth(), 0);
  // }

  const handleDateTypeChange = (date) => {
    const currentYear = Math.round(new Date().getFullYear());
    switch (date) {
      case CUSTOM_DATES.THIS_YEAR_TO_LAST_MONTH:
        setFromDate(`${currentYear}-01-01`);
        setToDate(moment().subtract(1, 'months').startOf('month').format('yyyy-MM-DD'));
        break;
      case CUSTOM_DATES.THIS_YEAR_TO_DATE:
        setFromDate(`${currentYear}-01-01`);
        setToDate(`${moment().format('yyyy-MM-DD')}`);
        break;
      case CUSTOM_DATES.LAST_YEAR_TO_DATE:
        setFromDate(`${currentYear - 1}-01-01`);
        setToDate(`${moment().format('yyyy-MM-DD')}`);
        break;
      case CUSTOM_DATES.LAST_MONTH:
        setFromDate(`${moment().subtract(1, 'months').startOf('month').format('yyyy-MM-DD')}`);
        setToDate(`${moment().subtract(1, 'months').endOf('month').format('yyyy-MM-DD')}`);
        break;
      case CUSTOM_DATES.THIS_MONTH:
        setFromDate(`${moment().startOf('month').format('yyyy-MM-DD')}`);
        setToDate(`${moment().endOf('month').format('yyyy-MM-DD')}`);
        break;
      case CUSTOM_DATES.LAST_QUARTER:
        setFromDate(moment().subtract(1, 'quarter').startOf('quarter').format("yyyy-MM-DD"));
        setToDate(moment().subtract(1, 'quarter').endOf('quarter').format("yyyy-MM"));
        break;
      case CUSTOM_DATES.THIS_QUARTER:
        setFromDate(`${moment().startOf('quarter').format("yyyy-MM-DD")}`);
        setToDate(`${moment().endOf('quarter').format("yyyy-MM-DD")}`);
        break;
      case CUSTOM_DATES.LAST_YEAR:
        setFromDate(`${currentYear - 1}-01-01`);
        setToDate(`${currentYear - 1}-12-31`);
        break;
      default:
        setFromDate(`${moment().startOf('month').format('yyyy-MM-DD')}`);
        setToDate(`${moment().endOf('month').format('yyyy-MM-DD')}`);
    }
  };

  return (
    <Grid item xs={8} md={8} style={{ marginTop: "4px" }}>
      <Grid container direction="row" display="flex" alignItems="center" spacing={3}>
        <Grid item xs={3} style={{ marginTop: "2px" }}>
          <Autocomplete
            size="small"
            onChange={(event, newValue) => {
              if (newValue === null) {
                handleDateTypeChange("This Month");
              } else {
                handleDateTypeChange(newValue);
              }
            }}
            options={Object.values(CUSTOM_DATES)}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Date Range" placeholder="" style={{ backgroundColor: "white" }} />
            )}
            defaultValue={CUSTOM_DATES.LAST_MONTH}
            disableListWrap
            id="custom-date-dropdown"
          />
        </Grid>
        <Grid item xs={4} >
          <TextField
            size="small"
            margin="dense"
            type="month"
            variant="outlined"
            placeholder=""
            fullWidth
            value={moment(fromDate).format('yyyy-MM')}
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
              if (event.target.value == "") {
                setFromDate(`${Math.round(new Date().getFullYear())}-${getFlaggedMoment(Math.ceil(new Date().getMonth()) + 1)}`)
              } else {
                setFromDate(event.target.value);
              }
            }}
          />
        </Grid>
        <Grid>
          <label>to</label>
        </Grid>
        <Grid item xs={4} >
          <TextField
            size="small"
            margin="dense"
            type="month"
            variant="outlined"
            placeholder="to"
            fullWidth
            value={moment(toDate).format('yyyy-MM')}
            className={classes.inputFieldDate}
            onChange={(event) => {
              if (event.target.value == "") {
                setToDate(`${Math.round(new Date().getFullYear())}-${getFlaggedMoment(Math.ceil(new Date().getMonth()) + 1)}`)
              } else {
                setToDate(event.target.value);
              }
            }}
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
  );
}
