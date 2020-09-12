import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";
import ClearIcon from "@material-ui/icons/Clear";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
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

export default function FilterDatePickerSpud(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  useEffect(() => {
    let filter = null;

    if (stateNav.spudDateFrom || stateNav.spudDateTo) {
      filter = ["all"];

      //// spudDateFrom
      filter.push([
        ">=",
        ["get", "spudDate"],
        stateNav.spudDateFrom
          ? moment.parseZone(stateNav.spudDateFrom).utc(true).valueOf()
          : moment
              .parseZone(new Date("1900-01-01T00:00:00"))
              .utc(true)
              .valueOf(),
      ]);

      //// spudDateTo
      filter.push([
        "<=",
        ["get", "spudDate"],
        stateNav.spudDateTo
          ? moment.parseZone(stateNav.spudDateTo).utc(true).valueOf()
          : moment.parseZone(moment()).utc(true).valueOf(),
      ]);
    }

    if (JSON.stringify(stateNav.filterSpudDateRange) !== JSON.stringify(filter))
      setStateNav((stateNav) => ({
        ...stateNav,
        filterSpudDateRange: filter,
      }));
  }, [stateNav.spudDateFrom, stateNav.spudDateTo, setStateNav]);

  const handleStartDate = (date) => {
    setStateNav((stateNav) => ({
      ...stateNav,
      spudDateFrom: !date ? null : moment(date),
    }));
  };

  const handleEndDate = (date) => {
    setStateNav((stateNav) => ({
      ...stateNav,
      spudDateTo: !date ? null : moment(date),
    }));
  };

  return (
    <div className={classes.root}>
      <div className={classes.datesRow}>
        <KeyboardDatePicker
          label={props.labelDates + " " + "From"}
          className={`${classes.datePicker} ${
            stateNav.spudDateFrom ? classes.blue : ""
          }`}
          maxDate={moment().subtract(1, "day")}
          variant="inline"
          value={
            stateNav.spudDateFrom
              ? stateNav.spudDateFrom
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
          className={`${classes.datePicker} ${
            stateNav.spudDateTo ? classes.blue : ""
          }`}
          variant="inline"
          maxDate={moment()}
          value={stateNav.spudDateTo ? stateNav.spudDateTo : moment()}
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
