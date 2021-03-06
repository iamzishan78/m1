import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";
import ClearIcon from "@material-ui/icons/Clear";
import { IconButton } from "@material-ui/core";
import {useForm,Controller} from 'react-hook-form';


const useStyles = makeStyles((theme) => ({
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

export default function FilterDatePickerPermit(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { control, watch, setValue, getValues } = useForm();


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
          : moment
              .parseZone(new Date("1900-01-01T00:00:00"))
              .utc(true)
              .valueOf(),
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

    if (
      JSON.stringify(stateNav.filterPermitDateRange) !== JSON.stringify(filter)
    )
      setStateNav((stateNav) => ({
        ...stateNav,
        filterPermitDateRange: filter,
      }));
  }, [stateNav.permitDateFrom, stateNav.permitDateTo, setStateNav]);

  const handleStartDate = (date) => {
    setStateNav((stateNav) => ({
      ...stateNav,
      permitDateFrom: !date ? null : moment(date),
    }));
  };

  const handleEndDate = (date) => {
    setStateNav((stateNav) => ({
      ...stateNav,
      permitDateTo: !date ? null : moment(date),
    }));
  };

  return (
    <div className={classes.root}>
      <div className={classes.datesRow}>

        <Controller
            control={control}
            name="permitDateFrom"          
            defaultValue={stateNav.permitDateFrom}
            render ={({onChange, onClick, value}
            ) => (
              <KeyboardDatePicker
                label={props.labelDates + " " + "From"}
                className={`${classes.datePicker} ${
                  stateNav.permitDateFrom ? classes.blue : ""
                }`}
                maxDate={moment().subtract(1, "day")}
                variant="inline"
                value={watch('permitDateFrom')}
                onChange={(date) => {
                  setValue('permitDateFrom',date);
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
                      setValue('permitDateFrom',null);
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
            name="permitDateTo"          
            defaultValue={stateNav.firstProdDateTo}
            render ={({onChange, onClick, value}
            ) => (

          <KeyboardDatePicker
            label={props.labelDates + " " + "To"}
            className={`${classes.datePicker} ${
              stateNav.permitDateTo ? classes.blue : ""
            }`}
            variant="inline"
            maxDate={moment()}
            value={watch('permitDateTo')}
            onChange={(date) => {
              setValue('permitDateTo',date);
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
                        setValue('permitDateTo',null);
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
