import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";

// Styles for the Material UI Components
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
// FILTERS ARE NOT WORKING, WAITING ON THE TILE SET TO UPDATE
// We are passing in Props from The FilterFromWells as labelDates to pass the Name of the filter
export default function FilterDatePickerPermit(props) {
  //Local States Are Below as well as connections to Context
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  //The 2 following states handle the dates for the start date and end date
  const [selectedStartDate, handleStartDateChang] = useState(
    moment().subtract(120, 'Years')
  );
  const [selectedEndDate, handleEndDateChange] = useState(
    moment()
  );
  
  // The 2 following states keep a object that has a date and a check boolean
  // Both states have a logic that is used to set off effect or compare them in a If statement
  const [permitFromDate, setPermitFromDate] = useState({
    check: false,
    date: moment()
  });
  const [permitToDate, setPermitToDate] = useState({
    check: false,
    date: moment()
  });

  const [dateTypeName, setDateTypeName] = useState(
    stateNav.dateTypeName ? stateNav.dateTypeName : []
  );

  const setvaluesFrom = useCallback(() => {
    // Check for the null date and if it is return
    if (stateNav.permitDateFrom == null) {
      return;
    } else {
      // else recall date from statenav context so display again 
      handleStartDateChang(stateNav.permitDateFrom);
      setPermitFromDate({ check: true, date: stateNav.permitDateFrom });
    }
  }, [stateNav.permitDateFrom]);

  const setvaluesTo = useCallback(() => {
    // Check for the null date and if it is return
    if (stateNav.permitDateTo == null) {
      // else recall date from statenav context so display again 
      return;
    } else {
      handleEndDateChange(stateNav.permitDateTo);
      setPermitToDate({ check: true, date: stateNav.permitDateTo });
    }
  }, [stateNav.permitDateTo]);
  
  const setFilterName = useCallback(() => {
      let filter;
      if (permitFromDate.date._isValid === true  && permitToDate.date._isValid === true) {
        const checkDate = moment.parseZone(permitToDate.date).utc(true).valueOf()
        const fromDate = moment.parseZone(permitFromDate.date).utc(true).valueOf()
        if(permitFromDate.check && !permitToDate.check){
          filter = ["all", [">=",["get", "permitApprovedDate"] ,fromDate], ["<=",["get", "permitApprovedDate"] , checkDate]];
        } else if (permitToDate.check &&  !permitFromDate.check ) {
          let checkDate = moment().subtract(120, 'Years')
          let fromDate = moment.parseZone(checkDate).utc(true).valueOf()
          const toDate =  moment.parseZone(permitToDate.date).utc(true).valueOf()
          filter = ["all", [">=",["get", "permitApprovedDate"] ,fromDate], ["<=",["get", "permitApprovedDate"] , toDate]];
        }
        else{
          const fromDate = moment.parseZone(permitFromDate.date).utc(true).valueOf()
          const toDate =  moment.parseZone(permitToDate.date).utc(true).valueOf()
          filter = ["all", [">=", ["get", "permitApprovedDate"]  ,fromDate], ["<=", ["get", "permitApprovedDate"] ,toDate]];
        }
      } else {
        filter = null;
      }
      console.log("Permit Range dates change filter", filter);
      setStateNav(stateNav => ({ ...stateNav, filterPermitDateRange: filter }));
  }, [permitFromDate.check, permitFromDate.date, permitToDate.check, permitToDate.date, setStateNav]);

  useEffect(() => {
    // check if value of the check are true to run the filter
    if (permitFromDate.check === true) {
      setFilterName();
    }
    if (permitToDate.check === true) {
      setFilterName();
    }
  }, [permitFromDate.check, permitToDate.check, setFilterName]);
  // effect to run if the array has some values to recall the dates
  useEffect(() => {
    if (dateTypeName.length > 0) {
      setvaluesFrom();
      setvaluesTo();
    }
  }, [setvaluesTo, dateTypeName, setvaluesFrom]);
  // function to handle the date changes
  const handleStartDate = date => {
    // moments js and react quick rerenders make the input to become a null as soon as 1 number is delted
    // if is equal it resets the date from the input
    if (date == null) {
      const formatDateReset = moment().subtract(120, 'Years');
      setStateNav(stateNav => ({
        ...stateNav,
        permitDateFrom: null,
        filterPermitDateRange: null
      }));
      handleStartDateChang(formatDateReset);
    } else {
    // format the date to keep consistency
    const formatDateAfter = moment(date)
    let dateName = [];
    // set the check and pass the date
    setPermitFromDate({ check: true, date: formatDateAfter });
    //handles the actual input value
    handleStartDateChang(formatDateAfter);
    // add the name to the array to be used in a check above
    dateName.push("PermitDate");
    //add to the  state the array
    setDateTypeName(dateName);
    // sets the state in context and date name
    setStateNav(stateNav => ({
      ...stateNav,
      permitDateFrom: formatDateAfter,
      dateTypeName: dateName
    }));
  }
  };

  const handleEndDate = date => {
    // moments js and react quick rerenders make the input to become a null as soon as 1 number is delted
    // if is equal it resets the date from the input
    if (date === null) {
      const formatDateReset = moment();
      setStateNav(stateNav => ({ ...stateNav, permitDateTo: null , filterPermitDateRange: null}));
      handleEndDateChange(formatDateReset);
      return;
    } else {
    // format the date to keep consistency
    
    const newDateAfter = moment(date)
    let dateName = [];
    // set the check and pass the date
    setPermitToDate({ check: true, date: newDateAfter });
    //handles the actual input value
    handleEndDateChange(newDateAfter);
    // add the name to the array to be used in a check above
    dateName.push("PermitDate");
    //add to the the  state array
    setDateTypeName(dateName);
    // sets the state in context and date name
    setStateNav(stateNav => ({
      ...stateNav,
      permitDateTo: newDateAfter,
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
          maxDate={moment().subtract(1, 'day')}
          variant="inline"
          value={selectedStartDate}
          onChange={date => handleStartDate(date)}

          //inputVariant="outlined"
          minDateMessage = 'Date should not be before minimal date'
          maxDateMessage = 'Date should not be after max date'
          disableToolbar
          KeyboardButtonProps={{'aria-label':'change date'}}
          autoOk = 'true'
          format="MM/DD/YYYY"
          // orientation = 'landscape'
          // margin = 'normal'
          PopoverProps={{ disablePortal: true }}
          fullWidth={true}
        />

        <KeyboardDatePicker
          label={props.labelDates + " " + "To"}
          className={classes.datePicker}
          variant="inline"
          maxDate={moment()}
          value={selectedEndDate}
          onChange={date => handleEndDate(date)}

          //inputVariant="outlined"
          minDateMessage = 'Date should not be before minimal date'
          maxDateMessage = 'Date should not be after max date'
          disableToolbar
          KeyboardButtonProps={{'aria-label':'change date'}}
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



