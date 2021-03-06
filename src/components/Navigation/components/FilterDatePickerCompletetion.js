import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";
import ClearIcon from "@material-ui/icons/Clear";
import { IconButton } from "@material-ui/core";
import { formatDiagnostics } from "typescript";
import {useForm,Controller} from 'react-hook-form';


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
  const { control, watch, setValue, getValues } = useForm();


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
            defaultValue={stateNav.completetionDateFrom}
            render ={({onChange, onClick, value}
            ) => (

            <KeyboardDatePicker
              label={props.labelDates + " " + "From"}
              className={`${classes.datePicker} ${
                stateNav.completetionDateFrom ? classes.blue : ""
              }`}
              variant="inline"
              value={ watch('completetionDateFrom')}
              onChange={(date) => {
                setValue('completetionDateFrom',date);
                if(!date || !date.isValid()){handleStartDate(null)}
                if(date && date.isValid()){handleStartDate(date)}
                return {value: date}
            }}
              disableToolbar
              KeyboardButtonProps={{ "aria-label": "change date" }}
              autoOk="true"
              format = {format}
              PopoverProps={{ disablePortal: true }}
              fullWidth={true}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => {
                    setValue('completetionDateFrom',null);
                    handleStartDate(null);
              }}>                    
                  <ClearIcon style={{ height: "22px", width: "22px" }} />
                  </IconButton>
                ),
              }}
              InputAdornmentProps={{
                position: "start",
              }}
            />

        )}
        />


        <Controller
            control={control}
            name="completetionDateTo"          
            defaultValue={stateNav.completetionDateTo}
            render ={({onChange, onClick, value}
            ) => (

            <KeyboardDatePicker
              label={props.labelDates + " " + "To"}
              className={`${classes.datePicker} ${
                stateNav.completetionDateTo ? classes.blue : ""
              }`}
              variant="inline"
              value={watch('completetionDateTo')}
              onChange={(date) => {
                setValue('completetionDateTo',date);
                if(date && date.isValid()){handleEndDate(date)}
                if(!date || !date.isValid()){handleEndDate(null)}
                return {value: date}
              }}
              maxDate={moment()}
              disableToolbar
              KeyboardButtonProps={{ "aria-label": "change date" }}
              autoOk="true"
              format="MM/DD/YYYY"
              PopoverProps={{ disablePortal: true }}
              fullWidth={true}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => {
                    setValue('completetionDateTo',null);
                    handleEndDate(null);
                  }}>
                  <ClearIcon style={{ height: "22px", width: "22px" }} />
                  </IconButton>
                ),
              }}
              InputAdornmentProps={{
                position: "start",
              }}
            />

        )}
        />


      </div>
    </div>
  );
}
