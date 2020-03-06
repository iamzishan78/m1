import React, { useState, useContext, useEffect, useCallback } from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { NavigationContext } from "../NavigationContext";
import Slider from '@material-ui/core/Slider';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles(theme => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
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
}));

function valueText(value) {
  return `${value}`;
}

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};




const PrettoSlider = withStyles({
  root: {
    color: 'primary',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  valueLabel: {
    left: 'calc(-50% )',
    top: -22,
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  },
  active: {},
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
  mark: {
    color: 'transparent'
  }
})(Slider);







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
  const [value, setValue] = useState([0,props.max]);


  useEffect(() => {
    const setFilter = () => {
      let currentValue = [];
      currentValue.push(valueMin, valueMax);
      //create ids for varying months
      
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
          console.log(currentValue, selectedMax);
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
          } else if (id === "lastTwelveMonthOil") {
            setStateNav(stateNav => ({
              ...stateNav,
              filterLastTwelveMonthOil: filter
            }));
          } else if (id === "firstMonthWater") {
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
          } else if (id === "lastSixMonthOil") {
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
  }, [
    id,
    stateNav.filterCumulativeGas,
    stateNav.filterCumulativeOil,
    stateNav.filterCumulativeWater,
    stateNav.filterFirstMonthWater
  ]);

  // console.log(stateNav.filterFirstMonthWater, prodTypeName);

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeMouseUp = (event, newValue) => {
    //console.log(newValue)
    setValue(newValue);
    //setFilter(newValue)
  };

  const marks = [
    {
      value: 0,
      label: 0,
    },
    {
      value: max,
      label: max,
    },
  ];


  return (
    <div className={classes.root}>


    <PrettoSlider 
      //track = {false}
      valueLabelDisplay="auto" 
      aria-label="pretto slider" 
      defaultValue={[0.20*max,0.40*max]}
      valueLabelDisplay='on'
      min={0}
      max={max}
      onChange={handleChange}
      onChangeCommitted={handleChangeMouseUp}
      marks = {marks}
        />
    </div>






  );
}
