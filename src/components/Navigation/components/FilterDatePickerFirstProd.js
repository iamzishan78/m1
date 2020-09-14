import React, {  useContext, useEffect,  } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";
import ClearIcon from "@material-ui/icons/Clear";
import { IconButton } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  root: {
  },
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

export default function FilterDatePickerFirstProd(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  useEffect(() => {
    let filter = null;

    if (stateNav.firstProdDateFrom || stateNav.firstProdDateTo) {
      filter = ["all"];

      //// firstProdDateFrom
      filter.push([
        ">=",
        ["get", "firstProductionDate"],
        stateNav.firstProdDateFrom
          ? moment.parseZone(stateNav.firstProdDateFrom).utc(true).valueOf()
          : moment
              .parseZone(new Date("1900-01-01T00:00:00"))
              .utc(true)
              .valueOf(),
      ]);

      //// firstProdDateTo
      filter.push([
        "<=",
        ["get", "firstProductionDate"],
        stateNav.firstProdDateTo
          ? moment.parseZone(stateNav.firstProdDateTo).utc(true).valueOf()
          : moment.parseZone(moment()).utc(true).valueOf(),
      ]);
    }

    if (
      JSON.stringify(stateNav.filterFirstProdDateRange) !==
      JSON.stringify(filter)
    )
      setStateNav((stateNav) => ({
        ...stateNav,
        filterFirstProdDateRange: filter,
      }));
  }, [stateNav.firstProdDateFrom, stateNav.firstProdDateTo, setStateNav]);

  const handleStartDate = (date) => {
    setStateNav((stateNav) => ({
      ...stateNav,
      firstProdDateFrom: !date ? null : moment(date),
    }));
  };

  const handleEndDate = (date) => {
    setStateNav((stateNav) => ({
      ...stateNav,
      firstProdDateTo: !date ? null : moment(date),
    }));
  };

  return (
    <div className={classes.root}>
      <div className={classes.datesRow}>
        <KeyboardDatePicker
          label={props.labelDates + " " + "From"}
          // label="From"
          className={`${classes.datePicker} ${
            stateNav.firstProdDateFrom ? classes.blue : ""
          }`}
          maxDate={moment().subtract(1, "day")}
          variant="inline"
          value={
            stateNav.firstProdDateFrom
              ? stateNav.firstProdDateFrom
              : new Date("1900-01-01T00:00:00")
          }
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
          // label="To"
          className={`${classes.datePicker} ${
            stateNav.firstProdDateTo ? classes.blue : ""
          }`}
          maxDate={moment()}
          variant="inline"
          value={stateNav.firstProdDateTo ? stateNav.firstProdDateTo : moment()}
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
