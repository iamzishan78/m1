import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { NavigationContext } from "../NavigationContext";

const useStyles = makeStyles({
  mark: {
    color: "black"
  },
  input: {
    margin: 10,
    maxWidth: 300
  },
  divInput: {
    display: "inline-flex"
  }
});

function valueText(value) {
  return `${value}`;
}

export default function ProductionSlider(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [valueMin, setValueMin] = useState(0);
  const [valueMax, setValueMax] = useState(1);
  // const [min, setMin] = useState(props.min);
  // const [max, setMax] = useState(props.max);
  // const [resetToMax, setResetToMax] = useState(props.resetToMax);
  // const [step, setStep] = useState(props.step);
  const [firstLast, setFirstLast] = useState(props.firstLast);
  const [months, setMonths] = useState(props.months);
  const [prod, setProd] = useState(props.prod);
  const [id, setId] = useState(props.id);

  const handleChangeMin = event => {
    setValueMin(event.target.value);
  };

  const handleChangeMax = event => {
    setValueMax(event.target.value);
  };

  console.log(
    "%c Min ",
    "background: #222; color: #bada55",
    valueMin
  );
  console.log(
    "%c Max ",
    "background: #232; color: #bada55",
    valueMax
  );
  // useEffect( () => {
  //   if(props.resetToMax) {
  //   setValue([0,props.max])
  //   }
  // },[props.max, props.resetMax, props.resetToMax])

  useEffect(() => {
    console.log("months effect", props.months);
    // console.log('value effect',value)
    // setValueMax(props.max);
    /* let currentValue;
    if(props.resetToMax) {
      currentValue = [0,props.max]
    }
    else {
      currentValue = value;
    } */
    let currentValue = [];
    currentValue.push(valueMin, valueMax)
    console.log("%c currentVal ",
    "background: #122; color: #bada55",currentValue)
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
          // code block
        }
      }
      //api outputs a specific format for the properties of a well. Filter must match
      let id = `${firstLastString}${monthsString}${prodString}`;
      //setFilter(value)
      console.log("firstlast", id);

      //const setFilter = (newValue) => {

      //create ids for varying months

      let filter;
      let selectedMin = valueMin;
      let selectedMax = valueMax;

      if (currentValue[0] === props.min && currentValue[1] !== props.max) {
        filter = null;
      } else {
        filter = [
          "all",
          [">=", id.toString(), selectedMin],
          ["<=", id.toString(), selectedMax]
        ];
        console.log("add filter", filter);
      }
      let filterId = `filter${id}`;
      let f = filterId.toString();
      console.log("production change filter", filterId, filter);
      //setState doesn't work if you make the key a variable, like id, so I had to do this
      //all this repetiton is necessary because of this mapbox setFilter limit

      if (id === "FirstMonthWater") {
        setStateNav(state => ({ ...state, filterFirstMonthWater: filter }));
      } else if (id === "FirstThreeMonthWater") {
        setStateNav(state => ({
          ...state,
          filterFirstThreeMonthWater: filter
        }));
      } else if (id === "FirstSixMonthWater") {
        setStateNav(state => ({ ...state, filterFirstSixMonthWater: filter }));
      } else if (id === "FirstTwelveMonthWater") {
        setStateNav(state => ({
          ...state,
          filterFirstTwelveMonthWater: filter
        }));
      } else if (id === "LastMonthWater") {
        setStateNav(state => ({ ...state, filterLastMonthWater: filter }));
      } else if (id === "LastThreeMonthWater") {
        setStateNav(state => ({ ...state, filterLastThreeMonthWater: filter }));
      } else if (id === "LastSixMonthWater") {
        setStateNav(state => ({ ...state, filterLastSixMonthWater: filter }));
      } else if (id === "LastTwelveMonthWater") {
        setStateNav(state => ({
          ...state,
          filterLastTwelveMonthWater: filter
        }));
      } else if (id === "FirstMonthGas") {
        setStateNav(state => ({ ...state, filterFirstMonthGas: filter }));
      } else if (id === "FirstThreeMonthGas") {
        setStateNav(state => ({ ...state, filterFirstThreeMonthGas: filter }));
      } else if (id === "FirstSixMonthGas") {
        setStateNav(state => ({ ...state, filterFirstSixMonthGas: filter }));
      } else if (id === "FirstTwelveMonthGas") {
        setStateNav(state => ({ ...state, filterFirstTwelveMonthGas: filter }));
      } else if (id === "LastMonthGas") {
        setStateNav(state => ({ ...state, filterLastMonthGas: filter }));
      } else if (id === "LastThreeMonthGas") {
        setStateNav(state => ({ ...state, filterLastThreeMonthGas: filter }));
      } else if (id === "LastSixMonthGas") {
        setStateNav(state => ({ ...state, filterLastSixMonthGas: filter }));
      } else if (id === "LastTwelveMonthGas") {
        setStateNav(state => ({ ...state, filterLastTwelveMonthGas: filter }));
      } else if (id === "FirstMonthOil") {
        setStateNav(state => ({ ...state, filterFirstMonthOil: filter }));
      } else if (id === "FirstThreeMonthOil") {
        setStateNav(state => ({ ...state, filterFirstThreeMonthOil: filter }));
      } else if (id === "FirstSixMonthOil") {
        setStateNav(state => ({ ...state, filterFirstSixMonthOil: filter }));
      } else if (id === "FirstTwelveMonthOil") {
        setStateNav(state => ({ ...state, filterFirstTwelveMonthOil: filter }));
      } else if (id === "LastMonthOil") {
        setStateNav(state => ({ ...state, filterLastMonthOil: filter }));
      } else if (id === "LastThreeMonthOil") {
        setStateNav(state => ({ ...state, filterLastThreeMonthOil: filter }));
      } else if (id === "LastSixMonthOil") {
        setStateNav(state => ({ ...state, filterLastSixMonthOil: filter }));
      } else if (id === "LastTwelveMonthOil") {
        setStateNav(state => ({ ...state, filterLastTwelveMonthOil: filter }));
      }
    } else {
      let filter;
      let selectedMin = valueMin;
      let selectedMax = valueMax;;
      let currentValue = [];
      currentValue.push(valueMin, valueMax)
      console.log("value is limits min max?", valueMin, valueMax);
      if (currentValue[0] === valueMin && currentValue[1] === valueMax) {
        filter = null;
      } else {
        filter = [
          "all",
          [">=", id.toString(), selectedMin],
          ["<=", id.toString(), selectedMax]
        ];
        console.log("add filter", filter);
      }
      let filterId = `filter${id}`;

      if (id === "CumulativeOil") {
        setStateNav(state => ({ ...state, filterCumulativeOil: filter }));
      } else if (id === "CumulativeGas") {
        setStateNav(state => ({ ...state, filterCumulativeGas: filter }));
      } else if (id === "CumulativeWater") {
        setStateNav(state => ({ ...state, filterCumulativeWater: filter }));
      }
    }
  }, [props.firstLast, props.months, props.prod, props.max, props.resetToMax, setStateNav, id, props.min, valueMin, valueMax]);

  return (
    <div className={classes.divInput}>
      <TextField
          className={classes.input}
          id={id}
          value={valueMin}
          InputProps={{ inputProps: { min: 0, max: props.max } }}
          onChange={handleChangeMin}
          getAriaValueText={valueText}
          aria-labelledby="range-number"
          type="number"
          label={id + " " + "Min"}
          variant="outlined"
        />
      <TextField
          className={classes.input}
          id={id}
          value={valueMax}
          InputProps={{ inputProps: { min: 1, max: props.max } }}
          onChange={handleChangeMax}
          getAriaValueText={valueText}
          aria-labelledby="range-number"
          type="number"
          label={id + " " + "Max"}
          variant="outlined"
        />
    </div>
  );
}

