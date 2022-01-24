import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";
import ClearIcon from "@material-ui/icons/Clear";
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

export default function FilterDatePickerFirstProd(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { control, watch, setValue, reset } = useForm();

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
          : moment.parseZone(new Date("1900-01-01T00:00:00")).utc(true).valueOf(),
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

    if (JSON.stringify(stateNav.filterFirstProdDateRange) !== JSON.stringify(filter))
      setStateNav((stateNav) => ({
        ...stateNav,
        filterFirstProdDateRange: filter,
      }));
  }, [stateNav.firstProdDateFrom, stateNav.firstProdDateTo, setStateNav]);

  useEffect(() => {
    if (!stateNav.filterPermitDateRange?.length && (stateNav.permitDateFrom || stateNav.permitDateTo)) {
      const resetParams = { prodDateFrom: null, prodDateTo: null };
      setStateNav((stateNav) => ({
        ...stateNav,
        ...resetParams,
      }));
      reset(resetParams);
    }
  }, [stateNav.filterFirstProdDateRange]);

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
        <Controller
          control={control}
          name="prodDateFrom"
          defaultValue={stateNav.firstProdDateFrom}
          render={({ onChange, onClick, value }) => (
            <TextField
              type="date"
              label={props.labelDates + " " + "From"}
              className={`${classes.datePicker} ${stateNav.firstProdDateFrom ? classes.blue : ""}`}
              margin="dense"
              fullWidth
              onChange={(date) => {
                setValue("firstProdDateFrom", date);
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
          name="prodDateTo"
          defaultValue={stateNav.firstProdDateTo}
          render={({ onChange, onClick, value }) => (
            <TextField
              type="date"
              label={props.labelDates + " " + "To"}
              className={`${classes.datePicker} ${stateNav.firstProdDateTo ? classes.blue : ""}`}
              margin="dense"
              fullWidth
              onChange={(date) => {
                setValue("firstProdDateTo", date);
                handleEndDate(date);
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
      </div>
    </div>
  );
}
