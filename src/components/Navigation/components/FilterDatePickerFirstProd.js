import React, {  useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";
import ClearIcon from "@material-ui/icons/Clear";
import { IconButton } from "@material-ui/core";
import {useForm,Controller} from 'react-hook-form';
import TextField from '@material-ui/core/TextField';




const useStyles = makeStyles((theme) => ({
  root: {
  },
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

export default function FilterDatePickerFirstProd(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { control, watch, setValue, getValues } = useForm();


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
          : moment
              .parseZone(new Date("1900-01-01T00:00:00"))
              .utc(true)
              .valueOf(),
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

    if (
      JSON.stringify(stateNav.filterFirstProdDateRange) !==
      JSON.stringify(filter)
    )
      setStateNav((stateNav) => ({
        ...stateNav,
        filterFirstProdDateRange: filter,
      }));
  }, [stateNav.firstProdDateFrom, stateNav.firstProdDateTo, setStateNav]);

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
    <div 
    className={classes.root}
    >
      <div className={classes.datesRow}>
        <Controller
            control={control}
            name="prodDateFrom"          
            defaultValue={stateNav.firstProdDateFrom}
            render ={({onChange, onClick, value}
            ) => (

            <KeyboardDatePicker 
            label={props.labelDates + " " + "From"}
            className={`${classes.datePicker} ${
              stateNav.firstProdDateFrom ? classes.blue : ""
            }`}
            variant="inline"
            value={ watch('prodDateFrom')}
            onChange={(date) => {
                setValue('prodDateFrom',date);
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
                      setValue('prodDateFrom',null);
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
            name="prodDateTo"          
            defaultValue={stateNav.firstProdDateTo}
            render ={({onChange, onClick, value}
            ) => (

            <KeyboardDatePicker
              label={props.labelDates + " " + "To"}
              className={`${classes.datePicker} ${
                stateNav.firstProdDateTo ? classes.blue : ""
              }`}
              variant="inline"
              value={watch('prodDateTo')}
              onChange={(date) => {
                setValue('prodDateTo',date);
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
                      setValue('prodDateTo',null);
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
