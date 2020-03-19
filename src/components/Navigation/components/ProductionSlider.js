import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { NavigationContext } from "../NavigationContext";

const useStyles = makeStyles({
  mark: {
    color: "black"
  },
  input: {
    margin: 20,
    maxWidth: 120,
    minWidth: 118
    // "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    //   "-webkit-appearance": "none",
    //   margin: 0
    // }
  },
  inputMax: {
    margin: 10,
    maxWidth: 120,
    minWidth: 118
  },
  divInput: {
    display: "inherit"
  }
});

function valueText(value) {
  return `${value}`;
}

// function nFormatter(num, digits) {
//   var si = [
//     { value: 1, symbol: "" },
//     { value: 1E3, symbol: "k" },
//     { value: 1E6, symbol: "M" },
//     { value: 1E9, symbol: "B" },
//     { value: 1E12, symbol: "T" },
//     { value: 1E15, symbol: "P" },
//     { value: 1E18, symbol: "E" }
//   ];
//   var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
//   var i;
//   for (i = si.length - 1; i > 0; i--) {
//     if (num >= si[i].value) {
//       break;
//     }
//   }
//   return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
// }

export default function ProductionSlider(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [valueMin, setValueMin] = useState(0);
  const [valueMax, setValueMax] = useState(props.max);
  const [valueMinDisplay, setValueMinDisplay] = useState();
  const [valueMaxDisplay, setValueMaxDisplay] = useState();
  const [max, setMax] = useState(props.max);
  const [id, setId] = useState(props.id);
  const [prodTypeName, setProdTypeName] = useState(
    stateNav.prodTypeName ? stateNav.prodTypeName : []
  );
  // const [check, setCheck] = useState(false);

  useEffect(() => {
    const setFilter = () => {
      let currentValue = [];
      currentValue.push(valueMin, valueMax);
      let filter;
      let selectedMin = valueMin;
      let selectedMax = valueMax;
      if (selectedMin === "" || selectedMax === "") {
        filter = null;
      } 
      else {
        // if (
        //   currentValue[0] !== selectedMin.toString() &&
        //   currentValue[1] === selectedMax.toString()
        // ) {
        //   filter = null;
        // } else {
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
          if (id === "cumulativeOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterCumulativeOil: filter
            }));
          } else if (id === "cumulativeGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterCumulativeGas: filter
            }));
          } else if (id === "cumulativeWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterCumulativeWater: filter
            }));
          } else if (id === "last12MonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastTwelveMonthOil: filter
            }));
          } else if (id === "firstMonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstMonthWater: filter
            }));
          } else if (id === "first3MonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstThreeMonthWater: filter
            }));
          } else if (id === "first6MonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstSixMonthWater: filter
            }));
          } else if (id === "first12MonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstTwelveMonthWater: filter
            }));
          } else if (id === "lastMonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastMonthWater: filter
            }));
          } else if (id === "last6MonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastSixMonthWater: filter
            }));
          } else if (id === "last12MonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastTwelveMonthWater: filter
            }));
          } else if (id === "firstMonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstMonthGas: filter
            }));
          } else if (id === "first3MonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstThreeMonthGas: filter
            }));
          } else if (id === "first6MonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstSixMonthGas: filter
            }));
          } else if (id === "first12MonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstTwelveMonthGas: filter
            }));
          } else if (id === "lastMonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastMonthGas: filter
            }));
          } else if (id === "last6MonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastSixMonthGas: filter
            }));
          } else if (id === "last12MonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastTwelveMonthGas: filter
            }));
          } else if (id === "firstMonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstMonthOil: filter
            }));
          } else if (id === "first3MonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstThreeMonthOil: filter
            }));
          } else if (id === "first6MonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstSixMonthOil: filter
            }));
          } else if (id === "first12MonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstTwelveMonthOil: filter
            }));
          } else if (id === "lastMonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastMonthOil: filter
            }));
          } else if (id === "last6MonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastSixMonthOil: filter
            }));
          }
        }
      // }
    }
    if (valueMin && valueMax) {
      setFilter();
    }
  }, [id, setStateNav, valueMax, valueMin]);

  const setvaluesRecallCumulative = useCallback(() => {
    if (stateNav.filterCumulativeOil === null) {
      return;
    } else {
      const cOil = stateNav.filterCumulativeOil[1][1][1];

      if (cOil.toString() === id.toString()) {
        const recallMin = stateNav.filterCumulativeOil[1][2];
        setValueMinDisplay(recallMin);
      }
      if (cOil.toString() === id.toString()) {
        const recallMax = stateNav.filterCumulativeOil[2][2];
        setValueMaxDisplay(recallMax);
      }
    }

    if (stateNav.filterCumulativeGas === null) {
      return;
    } else {
      const cOil = stateNav.filterCumulativeGas[1][1][1];
      if (cOil.toString() === id.toString()) {
        const recallMin = stateNav.filterCumulativeGas[1][2];
        setValueMinDisplay(recallMin);
      }
      if (cOil.toString() === id.toString()) {
        const recallMax = stateNav.filterCumulativeGas[2][2];
        setValueMaxDisplay(recallMax);
      }
    }

    if (stateNav.filterCumulativeWater === null) {
      return;
    } else {
      const cOil = stateNav.filterCumulativeWater[1][1][1];
      if (cOil.toString() === id.toString()) {
        const recallMin = stateNav.filterCumulativeWater[1][2];
        setValueMinDisplay(recallMin);
      }
      if (cOil.toString() === id.toString()) {
        const recallMax = stateNav.filterCumulativeWater[2][2];
        setValueMaxDisplay(recallMax);
      }
    }
    console.log(stateNav.filterFirstMonthWater)
    // if (stateNav.filterFirstMonthWater === null) {
    //   return;
    // } else {
      
      // const cOil = stateNav.filterFirstMonthWater[1][1][1];
      // if (cOil.toString() === id.toString()) {
      //   const recallMin = stateNav.filterFirstMonthWater[1][2];
      //   setValueMinDisplay(recallMin);
      // }
      // if (cOil.toString() === id.toString()) {
      //   const recallMax = stateNav.filterFirstMonthWater[2][2];
      //   setValueMaxDisplay(recallMax);
      // }
    // }
  }, [
    id,
    stateNav.filterCumulativeGas,
    stateNav.filterCumulativeOil,
    stateNav.filterCumulativeWater,
    stateNav.filterFirstMonthWater
  ]);

  useEffect(() => {
    if (prodTypeName && prodTypeName.length > 0) {
      setvaluesRecallCumulative();
    }
  }, [prodTypeName, prodTypeName.length, setvaluesRecallCumulative]);

  const handleChangeMin = event => {
    setValueMin(event.target.value);
    setValueMinDisplay(event.target.value);
    setProdTypeName(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
  };

  const handleChangeMax = event => {
    if (event.target.value !== event.target.max) {
      if (event.target.value === "") {
        setValueMax(event.target.max);
      }
      setValueMax(event.target.value);
      setValueMaxDisplay(event.target.value);
      setProdTypeName(event.target.id);
      setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
    } else if (event.target.value === event.target.max) {
      setValueMax(event.target.max);
      setValueMaxDisplay(event.target.value);
      setProdTypeName(event.target.id);
      setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
    }
  };

  return (
    <div className={classes.divInput}>
      <TextField
        className={classes.input}
        id={id}
        value={valueMinDisplay}
        InputProps={{ inputProps: { min: 0, max: max - 1, step: 1000 } }}
        onChange={handleChangeMin}
        getAriaValueText={valueText}
        aria-labelledby="range-number"
        type="number"
        label="Min"
        variant="outlined"
        
        error={valueMinDisplay > valueMaxDisplay}
      />
      <TextField
        className={classes.input}
        id={id}
        value={valueMaxDisplay}
        InputLabelProps={{ shrink: true }}
        InputProps={{ inputProps: { min: 0, max: max, step: 1000 } }}
        onChange={handleChangeMax}
        getAriaValueText={valueText}
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
