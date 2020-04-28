import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from "moment";
import { NavigationContext } from "../NavigationContext";
import Grid from '@material-ui/core/Grid';


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
    flexDirection: "row",
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

export default function FilterDatePickerFirstProd(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [selectedStartDate, handleStartDateChang] = useState(
    moment().subtract(120, 'Years')
  );
  const [selectedEndDate, handleEndDateChange] = useState(
    moment()
  );
  const [firstProductionFromDate, setFirstProductionFromDate] = useState({
    check: false,
    date: moment()
  });
  const [firstProductionToDate, setFirstProductionToDate] = useState({
    check: false,
    date: moment()
  });

  const [dateTypeName, setDateTypeName] = useState(
    stateNav.dateTypeName ? stateNav.dateTypeName : []
  );
  
  const setFilterName = useCallback(() => {
    let filter;
    if (firstProductionFromDate.date._isValid === true  && firstProductionToDate.date._isValid === true) {
      const checkDate = moment.parseZone(firstProductionToDate.date).utc(true).valueOf()
      const fromDate = moment.parseZone(firstProductionFromDate.date).utc(true).valueOf()
      if(firstProductionFromDate.check && !firstProductionToDate.check){
        filter = ["all", [">=",["get", "firstProductionDate"] ,fromDate], ["<=",["get", "firstProductionDate"] , checkDate]];
      } else if (!firstProductionFromDate.check && firstProductionToDate.check) {
        let checkDate = moment().subtract(120, 'Years')
        let fromDate = moment.parseZone(checkDate).utc(true).valueOf()
        const toDate =  moment.parseZone(firstProductionToDate.date).utc(true).valueOf()
        filter = ["all", [">=",["get", "firstProductionDate"] ,fromDate], ["<=",["get", "firstProductionDate"] , toDate]];
      }
      else{
        const fromDate = moment.parseZone(firstProductionFromDate.date).utc(true).valueOf()
        const toDate =  moment.parseZone(firstProductionToDate.date).utc(true).valueOf()
        filter = ["all", [">=", ["get", "firstProductionDate"]  ,fromDate], ["<=", ["get", "firstProductionDate"] ,toDate]];
      }
    } else {
      filter = null;
    }
    console.log("FirstProduction Range dates change filter", filter);
    setStateNav(stateNav => ({ ...stateNav, filterFirstProdDateRange: filter }));
}, [firstProductionFromDate.check, firstProductionFromDate.date, firstProductionToDate.date, setStateNav]);

  useEffect(() => {
    if (firstProductionFromDate.check === true) {
      setFilterName();
    }
    if (firstProductionToDate.check === true) {
      setFilterName();
    }
  }, [firstProductionFromDate.check, firstProductionToDate.check, setFilterName]);

  const setvaluesFrom = useCallback(() => {
    if (stateNav.firstProdDateFrom === null) {
      return;
    } else {
      handleStartDateChang(stateNav.firstProdDateFrom);
      setFirstProductionFromDate({ check: true, date: stateNav.firstProdDateFrom });
    }
  }, [stateNav.firstProdDateFrom]);

  const setvaluesTo = useCallback(() => {
    if (stateNav.firstProdDateTo === null) {
      return;
    } else {
      handleEndDateChange(stateNav.firstProdDateTo);
      setFirstProductionToDate({ check: true, date: stateNav.firstProdDateTo });
    }
  }, [stateNav.firstProdDateTo]);

  useEffect(() => {
    if (dateTypeName.length > 0) {
      setvaluesFrom();
      setvaluesTo();
    }
  }, [setvaluesTo, dateTypeName, setvaluesFrom]);

  const handleStartDate = date => {

    if (date === null) {
      const formatDateReset = moment().subtract(120, 'Years');
      setStateNav(stateNav => ({
        ...stateNav,
        firstProdDateFrom: null,
        filterFirstProdDateRange: null
      }));
      handleStartDateChang(formatDateReset);
    } else {
    const formatDateAfter = moment(date)
    let dateName = [];
    setFirstProductionFromDate({ check: true, date: formatDateAfter });
    handleStartDateChang(formatDateAfter);
    dateName.push("firstProd");
    setDateTypeName(dateName);
    setStateNav(stateNav => ({
      ...stateNav,
      firstProdDateFrom: formatDateAfter,
      dateTypeName: dateName
    }));
  }
  };
 
  const handleEndDate = date => {
    if (date === null) {
      const formatDateReset = moment();
      setStateNav(stateNav => ({ ...stateNav, firstProdDateTo: null, filterFirstProdDateRange: null}));
      handleEndDateChange(formatDateReset);
      return;
    } else {
    const newDateAfter = moment(date)
    let dateName = [];
    setFirstProductionToDate({ check: true, date: newDateAfter });
    handleEndDateChange(newDateAfter);
    dateName.push("firstProd");
    setDateTypeName(dateName);
    setStateNav(stateNav => ({
      ...stateNav,
      firstProdDateTo: newDateAfter,
      dateTypeName: dateName
    }));
  }
  };
  
  return (
    <div className={classes.root}>
      <div className={classes.datesRow}>

        <KeyboardDatePicker
          label={props.labelDates + " " + "From"}
          // label="From"
          className={classes.datePicker}
          maxDate={moment().subtract(1, 'day')}
          variant="inline"
          value={selectedStartDate}
          onChange={date => handleStartDate(date)}
          
          //inputVariant="outlined"
          minDateMessage = 'Date should not be before minimal date'
          maxDateMessage = 'Date should not be after max date'
          disableToolbar
          KeyboardButtonProps = {{'aria-label':'change date'}}
          autoOk = 'true'
          format="MM/DD/YYYY"
          // orientation = 'landscape'
          // margin = 'normal'
          PopoverProps={{ disablePortal: true }}
          fullWidth={true}          
        />

        <KeyboardDatePicker
          label={props.labelDates + " " + "To"}
          // label="To"
          className={classes.datePicker}
          maxDate={moment()}
          variant="inline"
          value={selectedEndDate}
          onChange={date => handleEndDate(date)}

          //inputVariant="outlined"
          minDateMessage = 'Date should not be before minimal date'
          maxDateMessage = 'Date should not be after max date'
          disableToolbar
          KeyboardButtonProps = {{'aria-label':'change date'}}
          autoOk = 'true'
          format="MM/DD/YYYY"
          // orientation = 'landscape'
          // margin = 'normal'
          PopoverProps={{ disablePortal: true }}
          fullWidth={true}          
          />

      </div>
    </div>
  );
}
