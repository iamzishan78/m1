import React, {  useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import { NavigationContext } from "../NavigationContext";
import ClearIcon from "@material-ui/icons/Clear";
import { IconButton } from "@material-ui/core";
// import { useForm, Controller } from "./src";
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
    console.log('date', date)
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

  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


  return (
    <div 
    className={classes.root}
    >
      <div className={classes.datesRow}>
        {/* <KeyboardDatePicker
          label={props.labelDates + " " + "From"}
          // label="From"
          className={`${classes.datePicker} ${
            stateNav.firstProdDateFrom ? classes.blue : ""
          }`}
          maxDate={moment().subtract(1, "day")}
          variant="inline"
          value={
            stateNav.firstProdDateFrom
              ? moment(stateNav.firstProdDateFrom).format("MM/DD/YYYY")
              : new Date("1900-01-01T00:00:00")
          }
          onChange={(date) => handleStartDate(date)}
          //inputVariant="outlined"
          minDateMessage="Date should not be before minimal date"
          maxDateMessage="Date should not be after max date"
          disableToolbar
          KeyboardButtonProps={{ "aria-label": "change date" }}
          autoOk="true"
          format="MM/DD/YYYY"
          // orientation = 'landscape'
          // margin = 'normal'
          PopoverProps={{ disablePortal: true }}
          fullWidth={true}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => handleStartDate(null)}>
                <ClearIcon style={{ height: "22px", width: "22px" }} />
              </IconButton>
            ),
          }}
          InputAdornmentProps={{
            position: "start",
          }}
        /> */}

        <Controller
            control={control}
            name="prodDateFrom"          
            defaultValue={null}
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
                if(!date){handleStartDate(date)}
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

            // value={watch('receivedDate')}
            // defaultValue={watch('receivedDate')}

            // onChange={date => {
            //     setValue('receivedDate', date);
            //     handleBlur(getValues().id, 'receivedDate'); //Managing patch save at server
            //     return {value: date} //important to update the controller value after change else state is updated and the controller will not render
            // }}
            //disabled={state.disabled}
            />

            )}

        />

        <KeyboardDatePicker
          label={props.labelDates + " " + "To"}
          // label="To"
          className={`${classes.datePicker} ${
            stateNav.firstProdDateTo ? classes.blue : ""
          }`}
          maxDate={moment()}
          variant="inline"
          value={stateNav.firstProdDateTo ? stateNav.firstProdDateTo : moment()}
          onChange={(date) => handleEndDate(date)}
          //inputVariant="outlined"
          minDateMessage="Date should not be before minimal date"
          maxDateMessage="Date should not be after max date"
          disableToolbar
          KeyboardButtonProps={{ "aria-label": "change date" }}
          autoOk="true"
          format="MM/DD/YYYY"
          // orientation = 'landscape'
          // margin = 'normal'
          PopoverProps={{ disablePortal: true }}
          fullWidth={true}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => handleEndDate(null)}>
                <ClearIcon style={{ height: "22px", width: "22px" }} />
              </IconButton>
            ),
          }}
          InputAdornmentProps={{
            position: "start",
          }}
        />



      </div>


    </div>


  );
}
