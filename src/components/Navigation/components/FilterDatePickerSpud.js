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

export default function FilterDatePickerSpud(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { labelDates } = props;
  const { control, reset } = useForm();

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
          : moment.parseZone(new Date("1900-01-01T00:00:00")).utc(true).valueOf(),
      ]);

      //// spudDateTo
      filter.push([
        "<=",
        ["get", "spudDate"],
        stateNav.spudDateTo ? moment.parseZone(stateNav.spudDateTo).utc(true).valueOf() : moment.parseZone(moment()).utc(true).valueOf(),
      ]);
    }

    if (JSON.stringify(stateNav.filterSpudDateRange) !== JSON.stringify(filter))
      setStateNav((stateNav) => ({
        ...stateNav,
        filterSpudDateRange: filter,
      }));
  }, [stateNav.spudDateFrom, stateNav.spudDateTo, setStateNav]);

  useEffect(() => {
    if (!stateNav.filterPermitDateRange?.length && (stateNav.permitDateFrom || stateNav.permitDateTo)) {
      const resetParams = { spudDateFrom: null, spudDateTo: null };
      setStateNav((stateNav) => ({
        ...stateNav,
        ...resetParams,
      }));
      reset(resetParams);
    }
  }, [stateNav.filterSpudDateRange]);

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
        <Controller
          control={control}
          name="spudDateFrom"
          defaultValue={""}
          render={(props) => (
            <TextField
              type="date"
              label={labelDates + " " + "From"}
              className={`${classes.datePicker} ${stateNav.spudDateFrom ? classes.blue : ""}`}
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
          name="spudDateTo"
          defaultValue={stateNav.spudDateTo}
          defaultValue={""}
          render={(props) => (
            <TextField
              type="date"
              label={labelDates + " " + "To"}
              className={`${classes.datePicker} ${stateNav.spudDateTo ? classes.blue : ""}`}
              margin="dense"
              fullWidth
              value={props.value}
              onChange={(date) => {
                props.onChange(date.target.value);
                handleEndDate(date);
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
