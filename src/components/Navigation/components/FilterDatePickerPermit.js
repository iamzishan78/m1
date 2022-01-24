import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";
import { TextField } from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  datesRow: {
    display: "flex",
    flexDirection: "row",
  },
  datePicker: {
    margin: "5px",
    "&& span": {
      pointerEvents: "none",
    },
    "& .MuiIconButton-root": {
      padding: "10px",
    },
  },
  blue: {
    "& .MuiInputBase-input": { color: "#17AADD" },
  },
  dateRoot: {
    color: "#ffffff",
    "& input": {
      marginLeft: 20,
      marginTop: 13
    },
  },
}));

export default function FilterDatePickerPermit(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { control, watch, setValue, reset } = useForm();

  useEffect(() => {
    let filter = null;

    if (stateNav.permitDateFrom || stateNav.permitDateTo) {
      filter = ["all"];

      //// permitDateFrom
      filter.push([
        ">=",
        ["get", "permitApprovedDate"],
        stateNav.permitDateFrom
          ? moment.parseZone(stateNav.permitDateFrom).utc(true).valueOf()
          : moment.parseZone(new Date("1900-01-01T00:00:00")).utc(true).valueOf(),
      ]);

      //// permitDateTo
      filter.push([
        "<=",
        ["get", "permitApprovedDate"],
        stateNav.permitDateTo
          ? moment.parseZone(stateNav.permitDateTo).utc(true).valueOf()
          : moment.parseZone(moment()).utc(true).valueOf(),
      ]);
    }

    if (JSON.stringify(stateNav.filterPermitDateRange) !== JSON.stringify(filter))
      setStateNav((stateNav) => ({
        ...stateNav,
        filterPermitDateRange: filter,
      }));
  }, [stateNav.permitDateFrom, stateNav.permitDateTo, setStateNav]);

  useEffect(() => {
    if (!stateNav.filterPermitDateRange?.length && (stateNav.permitDateFrom || stateNav.permitDateTo)) {
      const resetParams = { permitDateFrom: null, permitDateTo: null };
      setStateNav((stateNav) => ({
        ...stateNav,
        ...resetParams,
      }));
      reset(resetParams);
    }
  }, [stateNav.filterPermitDateRange]);

  const handleStartDate = (date) => {
    setStateNav((stateNav) => ({
      ...stateNav,
      permitDateFrom: moment(date),
    }));
  };

  const handleEndDate = (date) => {
    setStateNav((stateNav) => ({
      ...stateNav,
      permitDateTo: moment(date),
    }));
  };

  return (
    <div className={classes.root}>
      <div className={classes.datesRow}>
        <Controller
          control={control}
          name="permitDateFrom"
          defaultValue={stateNav.permitDateFrom}
          render={({ onChange, onClick, value }) => (
            <TextField
              type="date"
              label={props.labelDates + " " + "From"}
              className={`${classes.datePicker} ${stateNav.permitDateFrom ? classes.blue : ""}`}
              margin="dense"
              fullWidth
              onChange={(date) => {
                setValue("permitDateFrom", date);
                handleStartDate(date);
                return { value: date };
              }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                classes: {
                  root: classes.dateRoot,
                },
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="permitDateTo"
          defaultValue={stateNav.permitDateTo}
          render={({ onChange, onClick, value }) => (
            <TextField
              type="date"
              label={props.labelDates + " " + "To"}
              className={`${classes.datePicker} ${stateNav.permitDateTo ? classes.blue : ""}`}
              margin="dense"
              fullWidth
              onChange={(date) => {
                setValue("permitDateTo", date);
                handleEndDate(date);
                return { value: date };
              }}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ max: moment() }}
              InputProps={{
                classes: {
                  root: classes.dateRoot,
                },
              }}
            />
          )}
        />
      </div>
    </div>
  );
}
