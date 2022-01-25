import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { Clear } from "@material-ui/icons";
import { NavigationContext } from "../NavigationContext";
import { TextField, IconButton } from "@material-ui/core";
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

export default function FilterDatePickerPermit(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { labelDates } = props;
  const { control, reset } = useForm();

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
      permitDateFrom: date,
    }));
  };

  const handleEndDate = (date) => {
    setStateNav((stateNav) => ({
      ...stateNav,
      permitDateTo: date,
    }));
  };

  return (
    <div className={classes.root}>
      <div className={classes.datesRow}>
        <Controller
          control={control}
          name="permitDateFrom"
          defaultValue={""}
          render={(props) => (
            <TextField
              type="date"
              label={labelDates + " " + "From"}
              className={`${classes.datePicker} ${stateNav.permitDateFrom ? classes.blue : ""}`}
              margin="dense"
              fullWidth
              value={props.value}
              onChange={(date) => {
                handleStartDate(date.target.value);
                props.onChange(date.target.value);
                return { value: date };
              }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputProps: { max: moment().subtract(1, "day").format("yyyy-MM-DD") },
                endAdornment: (
                  <IconButton
                    onClick={(event) => {
                      handleStartDate(null);
                      props.onChange(event);
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
          name="permitDateTo"
          defaultValue={''}
          render={(props) => (
            <TextField
              type="date"
              label={labelDates + " " + "To"}
              className={`${classes.datePicker} ${stateNav.permitDateTo ? classes.blue : ""}`}
              margin="dense"
              fullWidth
              value={props.value}
              onChange={(date) => {
                handleEndDate(date.target.value);
                props.onChange(date.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputProps: { max: moment().format("yyyy-MM-DD") },
                endAdornment: (
                  <IconButton
                    onClick={(event) => {
                      handleEndDate(null);
                      props.onChange(event);
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
