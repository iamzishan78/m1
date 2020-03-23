import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { NavigationContext } from "../../NavigationContext";

const useStyles = makeStyles({
  input: {
    margin: 20,
    maxWidth: 120,
    minWidth: 118
  },
  divInput: {
    display: "flex"
  },
  inputLabel: {
    color: "black",
    textAlign: "center",
    minWidth: 199,
    maxWidth: 200,
    margin: 40
  }
});

export default function FirstMonthWater(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [valueMin, setValueMin] = useState(0);
  const [valueMax, setValueMax] = useState(null);
  const [valueMinDisplay, setValueMinDisplay] = useState();
  const [valueMaxDisplay, setValueMaxDisplay] = useState();
  const [max, setMax] = useState(props.max);
  const [id, setId] = useState("firstMonthWater");
  const [prodTypeName, setProdTypeName] = useState(
    stateNav.prodTypeName ? stateNav.prodTypeName : []
  );

  useEffect(() => {
    const setFilter = () => {
      let currentValue = [];
      currentValue.push(valueMin, valueMax);
      let filter;
      let selectedMin = valueMin;
      let selectedMax = valueMax;
      if (selectedMin === "" || selectedMax === "") {
        filter = null;
      } else {
        let selectedMin = valueMin;
        let selectedMax = valueMax;
        let currentValue = [];
        if (selectedMax !== null && selectedMin !== null) {
          selectedMin.toString();
          selectedMax.toString();
        }
        currentValue.push(valueMin, valueMax);
        if (
          currentValue[0] !== selectedMin &&
          currentValue[1] !== selectedMax
        ) {
          filter = null;
          console.log(currentValue, selectedMax, selectedMin);
        } else {
          filter = [
            "all",
            [">=", ["get", id.toString()], parseInt(selectedMin)],
            ["<=", ["get", id.toString()], parseInt(selectedMax)]
          ];
          console.log("add filter", filter);
        }
        if (id === "firstMonthWater") {
          setStateNav(stateNav => ({
            ...stateNav,
            filterFirstMonthWater: filter
          }));
        }
      }
    };
    if (valueMin && valueMax) {
      setFilter();
    }
  }, [id, setStateNav, valueMax, valueMin]);

  const setvaluesRecall = useCallback(() => {
    if (stateNav.filterFirstMonthWater === null) {
      return;
    } else {
      const cOil = stateNav.filterFirstMonthWater[1][1][1];
      if (cOil.toString() === id.toString()) {
        const recallMin = stateNav.filterFirstMonthWater[1][2];
        setValueMinDisplay(recallMin);
      }
      if (cOil.toString() === id.toString()) {
        const recallMax = stateNav.filterFirstMonthWater[2][2];
        setValueMaxDisplay(recallMax);
      }
    }
  }, [id, stateNav.filterFirstMonthWater]);

  useEffect(() => {
    if (prodTypeName && prodTypeName.length > 0) {
      setvaluesRecall();
    }
  }, [prodTypeName, setvaluesRecall]);

  const handleChangeMin = event => {
    setValueMin(event.target.value);
    setValueMinDisplay(event.target.value);
    setProdTypeName(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
  };

  const handleChangeMax = event => {
    // if (event.target.value !== event.target.max) {
    //   if (event.target.value === "") {
    //     setValueMax(event.target.max);
    //   }
    setValueMax(event.target.value);
    setValueMaxDisplay(event.target.value);
    setProdTypeName(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
    // }
    // else if (event.target.value === event.target.max) {
    //   setValueMax(event.target.max);
    //   setValueMaxDisplay(event.target.value);
    //   setProdTypeName(event.target.id);
    //   setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
    // }
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
        className={classes.input}
        value={valueMinDisplay}
        InputProps={{ inputProps: { min: 0, max: props.max - 1, step: 1000 } }}
        onChange={handleChangeMin}
        aria-labelledby="range-number"
        type="number"
        label="Min"
        variant="outlined"
        error={valueMinDisplay > valueMaxDisplay}
      />
      <TextField
        id={id}
        className={classes.input}
        value={valueMaxDisplay}
        InputLabelProps={{ shrink: true }}
        InputProps={{ inputProps: { min: 0, max: props.max, step: 1000 } }}
        onChange={handleChangeMax}
        aria-labelledby="range-number"
        type="number"
        label="Max"
        variant="outlined"
        key={id}
        error={valueMinDisplay > valueMaxDisplay}
      />
    </div>
  );
}
