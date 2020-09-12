import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";
import ClearIcon from "@material-ui/icons/Clear";
import { IconButton } from "@material-ui/core";

// DOCUMENTATION FOR THIS COMPONENT IS ON FILTERDATEPICKERPERMIT
const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex",
    // flexWrap: "wrap",
    // flexDirection: "column",
    // justifyContent: "space-around",
    // flexGrow: 1
  },
  datesRow: {
    display: "flex",
    flexDirection: "row",
    // flex: 1,
    // flexGrow: 1
  },
  datePicker: {
    margin: "15px",
    // minWidth: 175,
    // maxWidth: 176,
    "&& span": {
      pointerEvents: "none",
    },
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 10,
  },
  blue: {
    "& .MuiInputBase-input": { color: "#17AADD" },
  },
}));

export default function FilterDatePickerSpud(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [selectedStartDate, handleStartDateChang] = useState(
    new Date("1900-01-01T00:00:00")
  );
  const [selectedEndDate, handleEndDateChange] = useState(moment());
  const [spudFromDate, setSpudFromDate] = useState({
    check: false,
    date: moment(),
  });
  const [spudToDate, setSpudToDate] = useState({
    check: false,
    date: moment(),
  });

  const [dateTypeName, setDateTypeName] = useState(
    stateNav.dateTypeName ? stateNav.dateTypeName : []
  );

  const setFilterName = useCallback(() => {
    let filter;
    if (
      spudFromDate.date._isValid === true &&
      spudToDate.date._isValid === true
    ) {
      const checkDate = moment.parseZone(spudToDate.date).utc(true).valueOf();
      const fromDate = moment.parseZone(spudFromDate.date).utc(true).valueOf();
      if (spudFromDate.check && !spudToDate.check) {
        filter = [
          "all",
          [">=", ["get", "spudDate"], fromDate],
          ["<=", ["get", "spudDate"], checkDate],
        ];
      } else if (!spudFromDate.check && spudToDate.check) {
        let checkDate = moment().subtract(120, "Years");
        let fromDate = moment.parseZone(checkDate).utc(true).valueOf();
        const toDate = moment.parseZone(spudToDate.date).utc(true).valueOf();
        filter = [
          "all",
          [">=", ["get", "spudDate"], fromDate],
          ["<=", ["get", "spudDate"], toDate],
        ];
      } else {
        const fromDate = moment
          .parseZone(spudFromDate.date)
          .utc(true)
          .valueOf();
        const toDate = moment.parseZone(spudToDate.date).utc(true).valueOf();
        filter = [
          "all",
          [">=", ["get", "spudDate"], fromDate],
          ["<=", ["get", "spudDate"], toDate],
        ];
      }
    } else {
      filter = null;
    }
    console.log("Spud Date dates change filter", filter);
    setStateNav((stateNav) => ({ ...stateNav, filterSpudDateRange: filter }));
  }, [
    setStateNav,
    spudFromDate.check,
    spudFromDate.date,
    spudToDate.check,
    spudToDate.date,
  ]);

  useEffect(() => {
    if (spudFromDate.check === true) {
      setFilterName();
    }
    if (spudToDate.check === true) {
      setFilterName();
    }
  }, [spudFromDate.check, spudToDate.check, setFilterName]);

  const setvaluesFrom = useCallback(() => {
    if (stateNav.spudDateFrom === null) {
      return;
    } else {
      handleStartDateChang(stateNav.spudDateFrom);
      setSpudFromDate({ check: true, date: stateNav.spudDateFrom });
    }
  }, [stateNav.spudDateFrom]);

  const setvaluesTo = useCallback(() => {
    if (stateNav.spudDateTo === null) {
      return;
    } else {
      handleEndDateChange(stateNav.spudDateTo);
      setSpudToDate({ check: true, date: stateNav.spudDateTo });
    }
  }, [stateNav.spudDateTo]);

  useEffect(() => {
    if (dateTypeName.length > 0) {
      setvaluesFrom();
      setvaluesTo();
    }
  }, [setvaluesTo, dateTypeName, setvaluesFrom]);

  const handleStartDate = (date) => {
    if (date === null) {
      const formatDateReset = new Date("1900-01-01T00:00:00");
      setStateNav((stateNav) => ({
        ...stateNav,
        spudDateFrom: null,
        filterSpudDateRange: null,
      }));
      handleStartDateChang(formatDateReset);
    } else {
      const formatDateAfter = moment(date);
      let dateName = [];
      setSpudFromDate({ check: true, date: formatDateAfter });
      handleStartDateChang(formatDateAfter);
      dateName.push("Spud");
      setDateTypeName(dateName);
      setStateNav((stateNav) => ({
        ...stateNav,
        spudDateFrom: formatDateAfter,
        dateTypeName: dateName,
      }));
    }
  };

  const handleEndDate = (date) => {
    if (date === null) {
      const formatDateReset = moment();
      setStateNav((stateNav) => ({
        ...stateNav,
        spudDateTo: null,
        filterSpudDateRange: null,
      }));
      handleEndDateChange(formatDateReset);
      return;
    } else {
      const newDateAfter = moment(date);
      let dateName = [];
      setSpudToDate({ check: true, date: newDateAfter });
      handleEndDateChange(newDateAfter);
      dateName.push("Spud");
      setDateTypeName(dateName);
      setStateNav((stateNav) => ({
        ...stateNav,
        spudDateTo: newDateAfter,
        dateTypeName: dateName,
      }));
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.datesRow}>
        <KeyboardDatePicker
          label={props.labelDates + " " + "From"}
          className={`${classes.datePicker} ${
            JSON.stringify(selectedStartDate) !==
            JSON.stringify(new Date("1900-01-01T00:00:00"))
              ? classes.blue
              : ""
          }`}
          maxDate={moment().subtract(1, "day")}
          variant="inline"
          value={selectedStartDate}
          onChange={(date) => handleStartDate(date)}
          //inputVariant="outlined"
          minDateMessage="Date should not be before minimal date"
          maxDateMessage="Date should not be after max date"
          disableToolbar
          KeyboardButtonProps={{ "aria-label": "change date" }}
          autoOk="true"
          format="MM/DD/YYYY"
          // orientation = 'landscape'
          // margin = 'normal'
          PopoverProps={{ disablePortal: true }}
          fullWidth={true}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => handleStartDate(null)}>
                <ClearIcon />
              </IconButton>
            ),
          }}
          InputAdornmentProps={{
            position: "start",
          }}
        />

        <KeyboardDatePicker
          label={props.labelDates + " " + "To"}
          className={`${classes.datePicker} ${
            JSON.stringify(selectedEndDate).slice(1, 11) !==
            JSON.stringify(moment()).slice(1, 11)
              ? classes.blue
              : ""
          }`}
          variant="inline"
          maxDate={moment()}
          value={selectedEndDate}
          onChange={(date) => handleEndDate(date)}
          //inputVariant="outlined"
          minDateMessage="Date should not be before minimal date"
          maxDateMessage="Date should not be after max date"
          disableToolbar
          KeyboardButtonProps={{ "aria-label": "change date" }}
          autoOk="true"
          format="MM/DD/YYYY"
          // orientation = 'landscape'
          // margin = 'normal'
          PopoverProps={{ disablePortal: true }}
          fullWidth={true}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => handleEndDate(null)}>
                <ClearIcon />
              </IconButton>
            ),
          }}
          InputAdornmentProps={{
            position: "start",
          }}
        />
      </div>
    </div>
  );
}
