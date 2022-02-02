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
    margin: "12px 0"
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


export default function FilterDatePickerFirstProd(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { labelDates } = props;
  const { control, reset } = useForm();

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
      firstProdDateFrom: date,
    }));
  };

  const handleEndDate = (date) => {
    setStateNav((stateNav) => ({
      ...stateNav,
      firstProdDateTo: date,
    }));
  };

  return (
    <div className={classes.root}>
      <div className={classes.datesRow}>
        <Controller
          control={control}
          name="prodDateFrom"
          defaultValue={""}
          render={(props) => (
            <TextField
              type="date"
              label={labelDates + " " + "From"}
              className={`${classes.datePicker} ${stateNav.prodDateFrom ? classes.blue : ""}`}
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
          name="prodDateTo"
          defaultValue={""}
          render={(props) => (
            <TextField
              type="date"
              label={labelDates + " " + "To"}
              className={`${classes.datePicker} ${stateNav.prodDateTo ? classes.blue : ""}`}
              margin="dense"
              fullWidth
              value={props.value}
              onChange={(date) => {
                handleEndDate(date.target.value);
                props.onChange(date.target.value);
                return { value: date };
              }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
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
