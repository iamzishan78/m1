import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";
import ClearIcon from "@material-ui/icons/Clear";
import { IconButton } from "@material-ui/core";
import {useForm,Controller} from 'react-hook-form';


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
  const { control, watch, setValue, getValues } = useForm();


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


      <Controller
            control={control}
            name="spudDateFrom"          
            defaultValue={stateNav.spudDateFrom}
            render ={({onChange, onClick, value}
            ) => (

            <KeyboardDatePicker
              label={props.labelDates + " " + "From"}
              className={`${classes.datePicker} ${
                stateNav.spudDateFrom ? classes.blue : ""
              }`}
              variant="inline"
              value={watch('spudDateFrom')}
              onChange={(date) => {
                setValue('spudDateFrom',date);
                if(date && date.isValid()){handleStartDate(date)}
                if(!date || !date.isValid()){handleStartDate(null)}
                return {value: date}
              }}
              disableToolbar
              KeyboardButtonProps={{ "aria-label": "change date" }}
              autoOk="true"
              format="MM/DD/YYYY"
              PopoverProps={{ disablePortal: true }}
              fullWidth={true}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => {
                    setValue('spudDateFrom',null);
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
            name="spudDateTo"          
            defaultValue={stateNav.spudDateTo}
            render ={({onChange, onClick, value}
            ) => (


            <KeyboardDatePicker
              label={props.labelDates + " " + "To"}
              className={`${classes.datePicker} ${
                stateNav.spudDateTo ? classes.blue : ""
              }`}
              variant="inline"
              value={watch('spudDateTo')}
              onChange={(date) => {
                setValue('spudDateTo',date);
                if(date && date.isValid()){handleEndDate(date)}
                if(!date || !date.isValid()){handleEndDate(null)}
                return {value: date}
              }}
              disableToolbar
              KeyboardButtonProps={{ "aria-label": "change date" }}
              autoOk="true"
              format="MM/DD/YYYY"
              PopoverProps={{ disablePortal: true }}
              fullWidth={true}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => {
                    setValue('spudDateTo',null);
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
