import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";
import { Clear } from "@material-ui/icons";
import { IconButton, TextField } from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  root: {},
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
      padding: "10px 0px",
    },
  },
  blue: {
    "& .MuiInputBase-input": { color: "#17AADD" },
  },
  dateRoot: {
    color: "#ffffff",
    "& input": {
      marginLeft: 12,
    },
  },
}));


const format = "MM/DD/YYYY";

export default function FilterDatePickerCompletetion(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { labelDates } = props;
  const { control, reset } = useForm();

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
          : moment.parseZone(new Date("1900-01-01T00:00:00")).utc(true).valueOf(),
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

    if (JSON.stringify(stateNav.filterCompletetionDateRange) !== JSON.stringify(filter))
      setStateNav((stateNav) => ({
        ...stateNav,
        filterCompletetionDateRange: filter,
      }));
  }, [stateNav.completetionDateFrom, stateNav.completetionDateTo, setStateNav]);

  useEffect(() => {
    if (!stateNav.filterPermitDateRange?.length && (stateNav.permitDateFrom || stateNav.permitDateTo)) {
      const resetParams = { completetionDateFrom: null, completetionDateTo: null };
      setStateNav((stateNav) => ({
        ...stateNav,
        ...resetParams,
      }));
      reset(resetParams);
    }
  }, [stateNav.filterCompletetionDateRange]);

  const handleStartDate = (date) => {
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

  return (
    <div className={classes.root}>
      <div className={classes.datesRow}>
        <Controller
          control={control}
          name="completetionDateFrom"
          defaultValue={""}
          render={(props) => (
            <TextField
              type="date"
              label={labelDates + " " + "From"}
              className={`${classes.datePicker} ${stateNav.completetionDateFrom ? classes.blue : ""}`}
              margin="dense"
              fullWidth
              value={props.value}
              onChange={(date) => {
                props.onChange(date.target.value);
                handleStartDate(date);
                return { value: date };
              }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={(event) => {
                      props.onChange(event);
                      handleStartDate(null);
                    }}
                  >
                    <Clear style={{ height: 22, width: 22 }} />
                  </IconButton>
                ),
                classes: {
                  root: classes.dateRoot,
                },
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="completetionDateTo"
          defaultValue={""}
          render={(props) => (
            <TextField
              type="date"
              label={labelDates + " " + "To"}
              className={`${classes.datePicker} ${stateNav.completetionDateTo ? classes.blue : ""}`}
              margin="dense"
              fullWidth
              value={props.value}
              onChange={(date) => {
                props.onChange(date.target.value);
                handleStartDate(date);
                return { value: date };
              }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={(event) => {
                      props.onChange(event);
                      handleStartDate(null);
                    }}
                  >
                    <Clear style={{ height: 22, width: 22 }} />
                  </IconButton>
                ),
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
