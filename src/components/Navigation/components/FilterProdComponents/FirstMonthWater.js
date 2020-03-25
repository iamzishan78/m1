import React, { useState, useContext, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { NavigationContext } from "../../NavigationContext";

const useStyles = makeStyles({
  input: {
    margin: 20,
    maxWidth: 280,
    minWidth: 278
  },
  divInput: {
    // display: "flex"
  },
  inputLabel: {
    color: "black",
    textAlign: "center",
    minWidth: 199,
    maxWidth: 200,
    marginLeft: 20
  }
});

export default function FirstMonthWater(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [valueMin, setValueMin] = useState(0);
  const [valueMax, setValueMax] = useState(props.max);
  const [valueMinDisplay, setValueMinDisplay] = useState();
  const [valueMaxDisplay, setValueMaxDisplay] = useState();
  const [max, setMax] = useState(props.max);
  const [id, setId] = useState("firstMonthWater");
  const [prodTypeName, setProdTypeName] = useState(
    stateNav.prodTypeName ? stateNav.prodTypeName : []
  );
  const minRef = useRef();
  const maxRef = useRef();

  useEffect(() => {
    const setFilter = () => {
        let filter;
        let selectedMin = valueMin;
        let selectedMax = valueMax;
        if (selectedMax !== null && selectedMin !== null) {
          selectedMin.toString();
          selectedMax.toString();
            filter = [
                "all",
                [">=", ["get", id.toString()], parseInt(selectedMin)],
                ["<=", ["get", id.toString()], parseInt(selectedMax)]
              ];
              console.log("add filter", filter);
        }
         else {
            filter = null;
        }
    
          setStateNav(stateNav => ({
            ...stateNav,
            filterFirstMonthWater: filter
          }));
    }
    
    if (valueMin && valueMax) {
      setFilter();
    }
  }, [id, setStateNav, valueMax, valueMin]);

  useEffect(() => {
    const updateMin = val => valueMinDisplay === val ? null : setValueMinDisplay(val);
    // const updateMax = val => valueMaxDisplay === val ? null : setValueMaxDisplay(val);
    if (stateNav.filterFirstMonthWater) {
        const recallMin = stateNav.filterFirstMonthWater[1][2];
        updateMin(recallMin)
        // const recallMax = stateNav.filterFirstMonthWater[2][2];
        // // if (recallMax !== max) {
        // //     updateMax(recallMax) 
        // // }
    }
  }, [max, stateNav.filterFirstMonthWater, valueMaxDisplay, valueMinDisplay]);
//   console.log('recallMax', valueMaxDisplay)
  const handleChangeMin = event => {
    setValueMin(event.target.value);
    setValueMinDisplay(event.target.value);
    setProdTypeName(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
    if (event.target.value === "") {
        setStateNav(stateNav => ({
            ...stateNav,
            filterFirstMonthWater: null
          }));
    }
  };

  const handleChangeMax = event => {
    setValueMax(event.target.value);
    setValueMaxDisplay(event.target.value);
    setProdTypeName(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
  };

  return (
    <div className={classes.divInput}>
      <Typography
        className={classes.inputLabel}
        htmlFor="select-multiple-chip1"
      >
        First Month Water (MBBL)
      </Typography>
      <TextField
        id={id}
        inputRef={minRef}
        className={classes.input}
        value={valueMinDisplay || ''}
        InputProps={{ inputProps: { min: valueMin, max: max - 1, step: 1000 } }}
        onChange={handleChangeMin}
        aria-labelledby="range-number"
        type="number"
        label="Min"
        variant="outlined"
        fullWidth={true}
        error={valueMinDisplay > valueMaxDisplay}
      />
      <TextField
        id={id}
        className={classes.input}
        inputRef={maxRef}
        value={valueMaxDisplay || ''}
        InputProps={{ inputProps: { min: valueMin, max: max, step: 1000 } }}
        onChange={handleChangeMax}
        aria-labelledby="range-number"
        type="number"
        label="Max"
        variant="outlined"
        fullWidth={true}
        error={valueMinDisplay > valueMaxDisplay}
      />
    </div>
  );
}
