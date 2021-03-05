import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";
import ClearIcon from "@material-ui/icons/Clear";
import { IconButton } from "@material-ui/core";
import { formatDiagnostics } from "typescript";

const useStyles = makeStyles(() => ({
  root: {},
  datesRow: {
    display: "flex",
    flexDirection: "row",
  },
  datePicker: {
    margin: "15px",
    "&& span": {
      pointerEvents: "none",
    },
  },
  blue: {
    "& .MuiInputBase-input": { color: "#17AADD" },
  },
}));

const format = "MM/DD/YYYY"


export default function FilterDatePickerCompletetion(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [displayValue, setDisplayValue] = useState(null);

  useEffect(() => {
    let filter = null;

    if (stateNav.completetionDateFrom || stateNav.completetionDateTo) {
      filter = ["all"];

      //// completetionDateFrom
      filter.push([
        ">=",
        ["get", "completionDate"],
        stateNav.completetionDateFrom
          ? moment.parseZone(stateNav.completetionDateFrom).utc(true).valueOf()
          : moment
              .parseZone(new Date("1900-01-01T00:00:00"))
              .utc(true)
              .valueOf(),
      ]);

      //// completetionDateTo
      filter.push([
        "<=",
        ["get", "completionDate"],
        stateNav.completetionDateTo
          ? moment.parseZone(stateNav.completetionDateTo).utc(true).valueOf()
          : moment.parseZone(moment()).utc(true).valueOf(),
      ]);
    }

    if (
      JSON.stringify(stateNav.filterCompletetionDateRange) !==
      JSON.stringify(filter)
    )
      setStateNav((stateNav) => ({
        ...stateNav,
        filterCompletetionDateRange: filter,
      }));
  }, [stateNav.completetionDateFrom, stateNav.completetionDateTo, setStateNav]);

  const handleStartDate = (date) => {

    console.log('check formatting', moment(date,format))
    console.log('check formatting 2', moment(date).format(format))

    //setDisplayValue(moment(date).format("MM/DD/YYYY"))

    setStateNav((stateNav) => ({
      ...stateNav,
      completetionDateFrom: !date ? null : moment(date),
    }));

  };

  const handleEndDate = (date) => {
    setStateNav((stateNav) => ({
      ...stateNav,
      completetionDateTo: !date ? null : moment(date),
    }));
  };

  console.log('display value',displayValue)

  return (
    <div className={classes.root}>
      <div className={classes.datesRow}>
        <KeyboardDatePicker
          label={props.labelDates + " " + "From"}
          className={`${classes.datePicker} ${
            stateNav.completetionDateFrom ? classes.blue : ""
          }`}
          maxDate={moment().subtract(1, "day")}
          variant="inline"
          // inputValue = {displayValue}
          value={
            stateNav.completetionDateFrom
            ? moment(stateNav.completetionDateFrom)
            : new Date("1900-01-01T00:00:00")
          }

          onChange={(date) => handleStartDate(date)}
          //inputVariant="outlined"
          minDateMessage="Date should not be before minimal date"
          maxDateMessage="Date should not be after max date"
          disableToolbar
          KeyboardButtonProps={{ "aria-label": "change date" }}
          autoOk="true"
          format = {format}
          PopoverProps={{ disablePortal: true }}
          fullWidth={true}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => handleStartDate(null)}>
                <ClearIcon style={{ height: "22px", width: "22px" }} />
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
            stateNav.completetionDateTo ? classes.blue : ""
          }`}
          variant="inline"
          //inputValue = {displayValue}
          value={
            stateNav.completetionDateTo
            ? moment(stateNav.completetionDateTo)
            : moment()
          }
          onChange={(date) => handleEndDate(date)}
          maxDate={moment()}
          //inputVariant="outlined"
          minDateMessage="Date should not be before minimal date"
          maxDateMessage="Date should not be after max date"
          disableToolbar
          KeyboardButtonProps={{ "aria-label": "change date" }}
          autoOk="true"
          format="MM/DD/YYYY"
          PopoverProps={{ disablePortal: true }}
          fullWidth={true}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => handleEndDate(null)}>
                <ClearIcon style={{ height: "22px", width: "22px" }} />
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
