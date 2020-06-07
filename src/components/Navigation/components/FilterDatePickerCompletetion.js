import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";

// DOCUMENTATION FOR THIS COMPONENT IS ON FILTERDATEPICKERPERMIT
const useStyles = makeStyles(theme => ({
  root: {
    // display: "flex",
    // flexWrap: "wrap",
    // flexDirection: "column",
    // justifyContent: "space-around",
    // flexGrow: 1
  },
  datesRow: {
    display: "flex",
    flexDirection: "row"
    // flex: 1,
    // flexGrow: 1
  },
  datePicker: {
    margin: "15px",
    // minWidth: 175,
    // maxWidth: 176,
    "&& span": {
      pointerEvents: "none"
    }
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 10
  }
}));

export default function FilterDatePickerCompletetion(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [selectedStartDate, handleStartDateChang] = useState(
    moment().subtract(120, "Years")
  );
  const [selectedEndDate, handleEndDateChange] = useState(moment());
  const [completetionFromDate, setCompletetionFromDate] = useState({
    check: false,
    date: moment()
  });
  const [completetionToDate, setCompletetionToDate] = useState({
    check: false,
    date: moment()
  });

  const [dateTypeName, setDateTypeName] = useState(
    stateNav.dateTypeName ? stateNav.dateTypeName : []
  );

  const setFilterName = useCallback(() => {
    let filter;
    if (
      completetionFromDate.date._isValid === true &&
      completetionToDate.date._isValid === true
    ) {
      const checkDate = moment.parseZone(completetionToDate.date).utc(true).valueOf();
      const fromDate = moment.parseZone(completetionFromDate.date.utc(true)).valueOf();
      if (completetionFromDate.check && !completetionToDate.check) {
        filter = [
          "all",
          [">=", ["get", "completionDate"], fromDate],
          ["<=", ["get", "completionDate"], checkDate]
        ];
      } else if (!completetionFromDate.check && completetionToDate.check) {
        let checkDate = moment().subtract(120, 'Years')
        let fromDate = moment.parseZone(checkDate).utc(true).valueOf()
        const toDate =  moment.parseZone(completetionToDate.date).utc(true).valueOf()
        filter = ["all", [">=",["get", "completionDate"] ,fromDate], ["<=",["get", "completionDate"] , toDate]];
      }
      else {
        const fromDate = moment.parseZone(completetionFromDate.date).utc(true).valueOf();
        const toDate = moment.parseZone(completetionToDate.date).utc(true).valueOf();
        filter = [
          "all",
          [">=", ["get", "completionDate"], fromDate],
          ["<=", ["get", "completionDate"], toDate]
        ];
      }
    } else {
      filter = null;
    }
    console.log("Completetion Range dates change filter", filter);
    setStateNav(stateNav => ({
      ...stateNav,
      filterCompletetionDateRange: filter
    }));
  }, [completetionFromDate.date, completetionToDate.date, setStateNav]);

  useEffect(() => {
    if (completetionFromDate.check === true) {
      setFilterName();
    }
    if (completetionToDate.check === true) {
      setFilterName();
    }
  }, [completetionFromDate.check, completetionToDate.check, setFilterName]);

  const setvaluesFrom = useCallback(() => {
    if (stateNav.completetionDateFrom === null) {
      return;
    } else {
      handleStartDateChang(stateNav.completetionDateFrom);
      setCompletetionFromDate({ check: true, date: stateNav.completetionDateFrom });
    }
  }, [stateNav.completetionDateFrom]);

  const setvaluesTo = useCallback(() => {
    if (stateNav.completetionDateTo === null) {
      return;
    } else {
      handleEndDateChange(stateNav.completetionDateTo);
      setCompletetionToDate({ check: true, date: stateNav.completetionDateTo });
    }
  }, [stateNav.completetionDateTo]);

  useEffect(() => {
    if (dateTypeName.length > 0) {
      setvaluesFrom();
      setvaluesTo();
    }
  }, [setvaluesTo, dateTypeName, setvaluesFrom]);

  const handleStartDate = date => {
    if (date === null) {
      const formatDateReset = moment().subtract(120, "Years");
      setStateNav(stateNav => ({
        ...stateNav,
        completetionDateFrom: null,
        filterCompletetionDateRange: null
      }));
      handleStartDateChang(formatDateReset);
    } else {
      const formatDateAfter = moment(date);
      let dateName = [];
      setCompletetionFromDate({ check: true, date: formatDateAfter });
      handleStartDateChang(formatDateAfter);
      dateName.push("CompletetionDate");
      setDateTypeName(dateName);
      setStateNav(stateNav => ({
        ...stateNav,
        completetionDateFrom: formatDateAfter,
        dateTypeName: dateName
      }));
    }
  };

  const handleEndDate = date => {
    if (date === null) {
      const formatDateReset = moment();
      setStateNav(stateNav => ({
        ...stateNav,
        completetionDateTo: null,
        filterCompletetionDateRange: null
      }));
      handleEndDateChange(formatDateReset);
      return;
    } else {
      const newDateAfter = moment(date);
      let dateName = [];
      setCompletetionToDate({ check: true, date: newDateAfter });
      handleEndDateChange(newDateAfter);
      dateName.push("CompletetionDate");
      setDateTypeName(dateName);
      setStateNav(stateNav => ({
        ...stateNav,
        completetionDateTo: newDateAfter,
        dateTypeName: dateName
      }));
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.datesRow}>
        <KeyboardDatePicker
          label={props.labelDates + " " + "From"}
          className={classes.datePicker}
          maxDate={moment().subtract(1, "day")}
          variant="inline"
          value={selectedStartDate}
          onChange={date => handleStartDate(date)}
          //inputVariant="outlined"
          minDateMessage="Date should not be before minimal date"
          maxDateMessage="Date should not be after max date"
          disableToolbar
          KeyboardButtonProps={{ "aria-label": "change date" }}
          autoOk="true"
          format="MM/DD/YYYY"
          PopoverProps={{ disablePortal: true }}
          fullWidth={true}
        />

        <KeyboardDatePicker
          label={props.labelDates + " " + "To"}
          className={classes.datePicker}
          variant="inline"
          value={selectedEndDate}
          onChange={date => handleEndDate(date)}
          //inputVariant="outlined"
          minDateMessage="Date should not be before minimal date"
          maxDateMessage="Date should not be after max date"
          disableToolbar
          KeyboardButtonProps={{ "aria-label": "change date" }}
          autoOk="true"
          format="MM/DD/YYYY"
          PopoverProps={{ disablePortal: true }}
          fullWidth={true}
        />
      </div>
    </div>
  );
}
