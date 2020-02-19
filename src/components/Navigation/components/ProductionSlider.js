import React, {
  useState,
  useContext,
  useEffect,
  useCallback
} from "react";
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
    minWidth: 118,
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    }
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
    stateNav.prodTypeName ? stateNav.prodTypeName :[]
  )
  // const [check, setCheck] = useState(false);

  useEffect(() => {
    const setFilter = () => {
      let currentValue = [];
      currentValue.push(valueMin, valueMax);
      //create ids for varying months
      let filter;
      let selectedMin = valueMin;
      let selectedMax = valueMax;
      
      if (
        currentValue[0] !== selectedMin.toString() &&
        currentValue[1] === selectedMax.toString()
      ) {
        
        filter = null;
      } 
      else {
        console.log(currentValue, selectedMax)
        if (props.firstLast && props.months && props.prod) {
          let firstLastString = "";
          if (props.firstLast) {
            firstLastString = props.firstLast;
          }
          let prodString = "";
          if (props.prod) {
            prodString = props.prod;
          }

          let monthsString = "";
          if (props.months) {
            switch (props.months) {
              case 1:
                monthsString = "Month";
                break;
              case 3:
                monthsString = "ThreeMonth";
                break;
              case 6:
                monthsString = "SixMonth";
                break;
              case 12:
                monthsString = "TwelveMonth";
                break;
              default:
                monthsString = "TwelveMonth";
              // code block
            }
          }
          //api outputs a specific format for the properties of a well. Filter must match
          let id = `${firstLastString}${monthsString}${prodString}`;
          filter = [
            "all",
            [">=", ["get", id.toString()], parseInt(selectedMin)],
            ["<=", ["get", id.toString()], parseInt(selectedMax)]
          ];
          console.log("add filter", filter);

          console.log("production change filter", id, filter);
          //setState doesn't work if you make the key a variable, like id, so I had to do this
          //all this repetiton is necessary because of this mapbox setFilter limit
          if (id === "firstMonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstMonthWater: filter
            }));
          } else if (id === "firstThreeMonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstThreeMonthWater: filter
            }));
          } else if (id === "firstSixMonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstSixMonthWater: filter
            }));
          } else if (id === "firstTwelveMonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstTwelveMonthWater: filter
            }));
          } else if (id === "lastMonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastMonthWater: filter
            }));
          } else if (id === "lastThreeMonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastThreeMonthWater: filter
            }));
          } else if (id === "lastSixMonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastSixMonthWater: filter
            }));
          } else if (id === "lastTwelveMonthWater") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastTwelveMonthWater: filter
            }));
          } else if (id === "firstMonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstMonthGas: filter
            }));
          } else if (id === "firstThreeMonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstThreeMonthGas: filter
            }));
          } else if (id === "firstSixMonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstSixMonthGas: filter
            }));
          } else if (id === "firstTwelveMonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstTwelveMonthGas: filter
            }));
          } else if (id === "lastMonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastMonthGas: filter
            }));
          } else if (id === "lastThreeMonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastThreeMonthGas: filter
            }));
          } else if (id === "lastSixMonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastSixMonthGas: filter
            }));
          } else if (id === "lastTwelveMonthGas") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastTwelveMonthGas: filter
            }));
          } else if (id === "firstMonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstMonthOil: filter
            }));
          } else if (id === "firstThreeMonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstThreeMonthOil: filter
            }));
          } else if (id === "firstSixMonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstSixMonthOil: filter
            }));
          } else if (id === "firstTwelveMonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterFirstTwelveMonthOil: filter
            }));
          } else if (id === "lastMonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastMonthOil: filter
            }));
          } else if (id === "lastThreeMonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastThreeMonthOil: filter
            }));
          } else if (id === "lastSixMonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastSixMonthOil: filter
            }));
          } else if (id === "lastTwelveMonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastTwelveMonthOil: filter
            }));
          }
        } else {
          let filter;
          let selectedMin = valueMin;
          let selectedMax = valueMax;
          let currentValue = [];
          if (selectedMax !== null && selectedMin !== null) {
            selectedMin.toString();
            selectedMax.toString();
          }
          currentValue.push(valueMin, valueMax);
          console.log(currentValue, selectedMax)
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
          }
        }
      }
    };
    
    if (valueMin && valueMax ) {
      
      setFilter();
    }
  }, [
    id,
    props.firstLast,
    props.months,
    props.prod,
    setStateNav,
    valueMax,
    valueMin
  ]);

  const setvaluesRecallCumulative = useCallback(() => {
    if(stateNav.filterCumulativeOil === null) {
      return
    } else { 
    const cOil = stateNav.filterCumulativeOil[1][1][1];

    if (cOil.toString() === id.toString() ) { 
      const recallMin = stateNav.filterCumulativeOil[1][2]
      setValueMinDisplay(recallMin);
    }
    if (cOil.toString() === id.toString() ) { 
      const recallMax = stateNav.filterCumulativeOil[2][2]
      setValueMaxDisplay(recallMax);
    }
  }
    
    if(stateNav.filterCumulativeGas === null) {
      return
    } else { 
    const cOil = stateNav.filterCumulativeGas[1][1][1];
    if (cOil.toString() === id.toString() ) { 
        const recallMin = stateNav.filterCumulativeGas[1][2]
        setValueMinDisplay(recallMin);
      }
      if (cOil.toString() === id.toString() ) { 
        const recallMax = stateNav.filterCumulativeGas[2][2]
        setValueMaxDisplay(recallMax);
      }
    }
    

    if(stateNav.filterCumulativeWater === null) {
      return
    } else { 
    const cOil = stateNav.filterCumulativeWater[1][1][1];
    if (cOil.toString() === id.toString() ) { 
      const recallMin = stateNav.filterCumulativeWater[1][2]
      setValueMinDisplay(recallMin);
    }
    if (cOil.toString() === id.toString() ) { 
      const recallMax = stateNav.filterCumulativeWater[2][2]
      setValueMaxDisplay(recallMax);
    }}    

  }, [id, stateNav.filterCumulativeGas, stateNav.filterCumulativeOil, stateNav.filterCumulativeWater]);

  // const setvauesRecallMonths = useCallback(() => {
  //   if (props.firstLast && props.months && props.prod) {
  //     let firstLastString = "";
  //     if (props.firstLast) {
  //       firstLastString = props.firstLast;
  //     }
  //     let prodString = "";
  //     if (props.prod) {
  //       prodString = props.prod;
  //     }

  //     let monthsString = "";
  //     if (props.months) {
  //       switch (props.months) {
  //         case 1:
  //           monthsString = "Month";
  //           break;
  //         case 3:
  //           monthsString = "ThreeMonth";
  //           break;
  //         case 6:
  //           monthsString = "SixMonth";
  //           break;
  //         case 12:
  //           monthsString = "TwelveMonth";
  //           break;
  //         default:
  //           monthsString = "TwelveMonth";
  //         // code block
  //       }
  //     }
  //     //api outputs a specific format for the properties of a well. Filter must match
  //   let id = `${firstLastString}${monthsString}${prodString}`;
  //   console.log(id)
  //   if(stateNav.filterFirstMonthWater === null) {
  //     return
  //   } else { 
  //   const cOil = stateNav.filterFirstMonthWater[1][1][1];
  //   if (cOil.toString() === id.toString() ) { 
  //     const recallMin = stateNav.filterFirstMonthWater[1][2]
  //     setValueMinDisplay(recallMin);
  //   } 
  //   if (cOil.toString() === id.toString() ) { 
  //     const recallMax = stateNav.filterFirstMonthWater[2][2]
  //     setValueMaxDisplay(recallMax);
  //   }
  //     }
  //   }
  // },[props.firstLast, props.months, props.prod, stateNav.filterFirstMonthWater])

  
  useEffect(() => {
    if (prodTypeName && prodTypeName.length > 0) {
      // console.log(prodTypeName.length , prodTypeName)
      setvaluesRecallCumulative();
      // setvauesRecallMonths();
    }
  }, [prodTypeName, prodTypeName.length, setvaluesRecallCumulative]);

  const handleChangeMin = event => {
    setValueMin(event.target.value);
    setValueMinDisplay(event.target.value);
    setProdTypeName(event.target.id)
    setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
  };

  const handleChangeMax = event => {
    console.log(event.target)
    if(event.target.value !== event.target.max){
      if(event.target.value === ''){
        setValueMax(event.target.max);
      }
    setValueMax(event.target.value);
    setValueMaxDisplay(event.target.value);
    setProdTypeName(event.target.id)
    setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
    } else if(event.target.value === event.target.max) {
    setValueMax(event.target.max);
    setValueMaxDisplay(event.target.value);
    setProdTypeName(event.target.id)
    setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
    }
    
  };
  console.log(valueMax)
  // useEffect(() => {
  //   const checkMin = () => {
  //     if (valueMin >= valueMax) {
  //       setCheck(true);
  //     } else {
  //       setCheck(false);
  //     }
  //   };

  //   const checkMax = () => {
  //     if (valueMax <= valueMin) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   };
  //   checkMax();
  //   checkMin();
  // }, [check, valueMax, valueMin]);

  return (
    <div className={classes.divInput}>
      <TextField
        className={classes.input}
        id={id}
        value={valueMinDisplay}
        InputProps={{ inputProps: { min: 0, max: max - 1 , step:  1} }}
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
        InputLabelProps={{shrink: true}}
        InputProps={{ inputProps: { min: 0, max: max , step: 1} }}
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
