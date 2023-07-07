import React, { useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";

import { CUSTOM_DATES } from "utils/data";
import { handleCustomDateTypeChange } from "utils/helper";

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
  inputFieldDate: {
    "&.MuiFormControl-marginDense": {
      marginBottom: 8,
    },
    "& .MuiOutlinedInput-input": {
      paddingLeft: "0px",
    },
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
}));

// fromDate and toDate should be passed from the parent
export default function Portfolio({
  onChangeDates,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  label,
  isProperties,
  lastCheckMinDate,
  onChange,
  defaultRange,
  datesInputWidth = 1
}) {
  const classes = useStyles();
  useEffect(() => {
    handleDateTypeChange(CUSTOM_DATES.ALL_DATES);

    delete CUSTOM_DATES.THIS_WEEK;
    delete CUSTOM_DATES.LAST_WEEK;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (onChangeDates) onChangeDates(fromDate, toDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  const getFlaggedMoment = (moment) => {
    return moment >= 10 ? moment : `0${moment}`;
  };

  // const getLastMonthStartDate = () => {
  //   return new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  // }
  // const getLastMonthEndDate = () => {
  //   return new Date(new Date().getFullYear(), new Date().getMonth(), 0);
  // }

  useEffect(() => {
    if (lastCheckMinDate) handleDateTypeChange(CUSTOM_DATES.ALL_DATES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastCheckMinDate]);

  const handleDateTypeChange = (date) => {
    handleCustomDateTypeChange(date, onChange, CUSTOM_DATES, setFromDate, setToDate, lastCheckMinDate, true);
  };

  return (
    <>
      {label && (
        <Grid style={{ marginTop: "2px", padding: 0 }}>
          <label className={classes.label}>{label}</label>
        </Grid>
      )}
      <Grid item xs md={2} style={{ marginTop: "2px", minWidth: "285px" }}>
        <Autocomplete
          size="small"
          onChange={(event, newValue) => {
            if (newValue === null) {
              handleDateTypeChange("This Month");
            } else {
              handleDateTypeChange(newValue);
            }
          }}
          options={Object.values(CUSTOM_DATES).filter((value) => {
            if (!isProperties && value === "All Dates") return false;
            else return true;
          })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Check Date Range"
              variant="outlined"
              placeholder=""
              style={{ backgroundColor: "white" }}
            />
          )}
          defaultValue={defaultRange ? defaultRange : CUSTOM_DATES.ALL_DATES}
          disableListWrap
          id="custom-date-dropdown"
        />
      </Grid>
      <Grid item xs md={datesInputWidth}>
        <TextField
          size="small"
          margin="dense"
          type="month"
          variant="outlined"
          placeholder=""
          fullWidth
          value={moment(fromDate).format("yyyy-MM")}
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
            if (event.target.value === "") {
              setFromDate(
                `${Math.round(new Date().getFullYear())}-${getFlaggedMoment(
                  Math.ceil(new Date().getMonth()) + 1
                )}`
              );
            } else {
              const values = event.target.value.split('-')

              values[0] = +values[0] > 3000 ? values[0].substring(0, 4) : values[0]

              setFromDate(values.join('-'));
            }
          }}
        />
      </Grid>
      <Grid>
        <label>to</label>
      </Grid>
      <Grid item xs md={datesInputWidth}>
        <TextField
          size="small"
          margin="dense"
          type="month"
          variant="outlined"
          placeholder="to"
          fullWidth
          value={moment(toDate).format("yyyy-MM")}
          className={classes.inputFieldDate}
          onChange={(event) => {
            if (event.target.value === "") {
              setToDate(
                `${Math.round(new Date().getFullYear())}-${getFlaggedMoment(
                  Math.ceil(new Date().getMonth()) + 1
                )}`
              );
            } else {
              const values = event.target.value.split('-')

              values[0] = +values[0] > 3000 ? values[0].substring(0, 4) : values[0]

              setToDate(values.join('-'));
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
    </>
  );
}
