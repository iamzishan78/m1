import React, { useState, useContext, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TabPanel from "./Utils/TabPanel";
import CircularProgress from "@material-ui/core/CircularProgress";
import { NavigationContext } from "../NavigationContext";
import ProductionSlider from "./ProductionSlider";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 650,
    minWidth: 630,
    height: "100%"
  },
  tabPanel: {
    display: "flex",
    flexDirection: "column"
  },
  formControl: {
    width: "100%",
    color: "black"
  },
  formControlMonths: {
    minWidth: 39,
    maxWidth: 40,
    color: "black",
  },
  sliderWrapper: {
    marginTop: "50px",
    width: "100%",
    color: "black"
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  slider: {
    width: "300px"
  },
  inputLabel: {
    color: "black",
    textAlign: "center",
    minWidth: 199,
    maxWidth: 200,
    // marginRight: 60
    // marginLeft: 10,
  },
  tabStyle: {
    maxWidth: 700
  },
  indicator: {
    backgroundColor: "rgba(23, 170, 221, 1) !important"
  },
  tab: {
    minWidth: "65px"
  },
  select: {
    width: "48px"
  },
  loader: {
    marginLeft: "40%",
    marginTop: "25%"
  },
  inputLabelMonths: {
    textAlign: "left",
    color: "black"
  }
}));



export default function FilterFormProduction() {
  const classes = useStyles();
  const theme = useTheme();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [value, setValue] = useState(0);
  const [valueFirstMonthsOil, setValueFirstMonthsOil] = useState(12);
  const [valueFirstMonthsGas, setValueFirstMonthsGas] = useState(12);
  const [valueFirstMonthsWater, setValueFirstMonthsWater] = useState(12);
  const [valueLastMonthsOil, setValueLastMonthsOil] = useState(12);
  const [valueLastMonthsGas, setValueLastMonthsGas] = useState(12);
  const [valueLastMonthsWater, setValueLastMonthsWater] = useState(12);
  const [max, setMax] = useState();
  const [loading, setIsLoading] = useState(true);
  const [firstMonths, setFirstMonths] = useState(false);
  const [lastMonths, setLastMonths] = useState(false);
  // const [firstOilMax, setFirstOilMax] = useState();
  // const [firstGasMax, setFirstGasMax] = useState();
  // const [firstWaterMax, setFirstWaterMax] = useState();
  // const [lastOilMax, setLastOilMax] = useState();
  // const [lastGasMax, setLastGasMax] = useState();
  // const [lastWaterMax, setLastWaterMax] = useState();
  const [valsFirstMonthsOil, setValsFirstMonthsOil] = useState();
  const [valsFirstMonthsGas, setValsFirstMonthsGas] = useState();
  const [valsFirstMonthsWater, setValsFirstMonthsWater] = useState();
  const [valsLastMonthsOil, setValsLastMonthsOil] = useState();
  const [valsLastMonthsGas, setValsLastMonthsGas] = useState();
  const [valsLastMonthsWater, setValsLastMonthsWater] = useState();
  const [cumulativeOilMin, setCumulativeOilMin] = useState();
  const [cumulativeOilMax, setCumulativeOilMax] = useState();


  useEffect(()=> {
    if (stateNav.filterCumulativeOil && stateNav.filterCumulativeOil.length > 0) {
      let valMin = stateNav.filterCumulativeOil[1][2]
      let valMax = stateNav.filterCumulativeOil[2][2]
      setCumulativeOilMin(valMin)  
      setCumulativeOilMax(valMax); 
    }
  },[stateNav.filterCumulativeOil])

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) {
      setFirstMonths(true);
    } else {
      setFirstMonths(false);
    }
    if (newValue === 2) {
      setLastMonths(true);
    } else {
      setLastMonths(false);
    }
  };

  useEffect(() => {
    let session = sessionStorage.getItem("user");
    let info = JSON.parse(session);
    let token = info.authToken;

    const req = new Request(
      "https://m1-search-api.azurewebsites.net/api/v1.0/wells/ranges",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "M1-Correlation-Id": "997342965fd743f9a5fb16d03dfbdc7e",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    fetch(req)
      .then(res => res.json())
      .then(response => {
        setMax(response);
        console.log(response)
        setIsLoading(false);
      })
      .catch(error => console.log(error));
  }, []);

  
  const handleChangeFirstMonthsOil = (event, newValue) => {
    
    updateSliderRangesOil("first", newValue);
    setValsFirstMonthsOil(newValue);
  };
  const handleChangeFirstMonthsGas = (event, newValue) => {
    updateSliderRangesGas("first", newValue);
    setValsFirstMonthsGas(newValue);
  };
  const handleChangeFirstMonthsWater = (event, newValue) => {
    updateSliderRangesWater("first", newValue);
    setValsFirstMonthsWater(newValue);
  };
  const handleChangeLastMonthsOil = (event, newValue) => {
    updateSliderRangesOil("last", newValue);
    setValsLastMonthsOil(newValue)
  };
  const handleChangeLastMonthsGas = (event, newValue) => {
    updateSliderRangesGas("last", newValue);
    setValsLastMonthsGas(newValue)
  };
  const handleChangeLastMonthsWater = (event, newValue) => {
    updateSliderRangesWater("last", newValue);
    setValsLastMonthsWater(newValue)
  };

  const updateSliderRangesOil = (firstLast, newValue) => {
    console.log(firstLast, newValue)
    // if (firstLast === "first") {
    //   switch (newValue.props.value) {
    //     case 1:
    //       setFirstOilMax(max.firstMonthProdOil);
    //       break;
    //     case 3:
    //       setFirstOilMax(max.first3MonthProdOil);
    //       break;
    //     case 6:
    //       setFirstOilMax(max.first6MonthProdOil);
    //       break;
    //     case 12:
    //       setFirstOilMax(max.first12MonthProdOil);
    //       break;
    //     default:
    //       break;
    //   }

    // }

    // if (firstLast === "last") {
    //   switch (newValue.props.value) {
    //     case 1:
    //       setLastOilMax(max.lastMonthProdOil);
    //       break;
    //     case 3:
    //       break;
    //     case 6:
    //       setLastOilMax(max.last6MonthProdOil);
    //       break;
    //     case 12:
    //       setLastOilMax(max.last12MonthProdOil);
    //       break;
    //     default:
    //       break;
    //   }
    // }
    removePreviousMonthsFiltersOil(firstLast, newValue);
  };

  const updateSliderRangesGas = (firstLast, newValue) => {
    // if (firstLast === "first") {
    //   switch (newValue.props.value) {
    //     case 1:
    //       setFirstGasMax(max.firstMonthProdGas);
    //       break;
    //     case 3:
    //       setFirstGasMax(max.first3MonthProdGas);
    //       break;
    //     case 6:
    //       setFirstGasMax(max.first6MonthProdGas);
    //       break;
    //     case 12:
    //       setFirstGasMax(max.first12MonthProdGas);
    //       break;
    //     default:
    //       break;
    //   }
    // }

    // if (firstLast === "last") {
    //   switch (newValue.props.value) {
    //     case 1:
    //       setLastGasMax(max.lastMonthProdGas);
    //       break;
    //     case 3:
    //       break;
    //     case 6:
    //       setLastGasMax(max.last6MonthProdGas);
    //       break;
    //     case 12:
    //       setLastGasMax(max.last12MonthProdGas);
    //       break;
    //     default:
    //       break;
    //   }
    // }

    removePreviousMonthsFiltersGas(firstLast, newValue);
  };

  const updateSliderRangesWater = (firstLast, newValue) => {
    // if (firstLast === "first") {
    //   switch (newValue.props.value) {
    //     case 1:
    //       setFirstWaterMax(max.firstMonthProdWater);
    //       break;
    //     case 3:
    //       setFirstWaterMax(max.first3MonthProdWater);
    //       break;
    //     case 6:
    //       setFirstWaterMax(max.first6MonthProdWater);
    //       break;
    //     case 12:
    //       setFirstWaterMax(max.first12MonthProdWater);
    //       break;
    //     default:
    //       break;
    //   }
    // }

    // if (firstLast === "last") {
    //   switch (newValue.props.value) {
    //     case 1:
    //       setLastWaterMax(max.lastMonthProdWater);
    //       break;
    //     case 3:
    //       break;
    //     case 6:
    //       setLastWaterMax(max.last6MonthProdWater);
    //       break;
    //     case 12:
    //       setLastWaterMax(max.last12MonthProdWater);
    //       break;
    //     default:
    //       break;
    //   }
    // }

    removePreviousMonthsFiltersWater(firstLast, newValue);
  };

  const removePreviousMonthsFiltersOil = (firstLast, newValue) => {
    // console.log(firstLast, newValue)
    //you have to clear out previous months since they each have separate names in stateNav (because they have separate properties in well data). Not ideal.
    //setState doesn't like a variable as the key so I had to hard code each filter name.  may be a better way.
    // let filter = null;
    if (firstLast === "first") {
      // setStateNav(state => ({ ...state, filterFirstMonthOil: filter }));
      // setStateNav(state => ({ ...state, filterFirstThreeMonthOil: filter }));
      // setStateNav(state => ({ ...state, filterFirstSixMonthOil: filter }));
      // setStateNav(state => ({ ...state, filterFirstTwelveMonthOil: filter }));
      //after old cleared set new filters in productionSlider.js by reacting to new value for months and new max
      setValueFirstMonthsOil(newValue.props.value);
    } else {
      // setStateNav(state => ({ ...state, filterLastMonthOil: filter }));
      // setStateNav(state => ({ ...state, filterLastThreeMonthOil: filter }));
      // setStateNav(state => ({ ...state, filterLastSixMonthOil: filter }));
      // setStateNav(state => ({ ...state, filterLastTwelveMonthOil: filter }));

      //after old cleared set new filters in productionSlider.js by reacting to new value for months and new max
      setValueLastMonthsOil(newValue.props.value);
      // setResetToMax(true);
    }
  };

  const removePreviousMonthsFiltersGas = (firstLast, newValue) => {
    // console.log(firstLast, newValue)
    //you have to clear out previous months since they each have separate names in stateNav (because they have separate properties in well data). Not ideal.
    //setState doesn't like a variable as the key so I had to hard code each filter name.  may be a better way.
    let filter = null;
    if (firstLast === "first") {
      setStateNav(state => ({ ...state, filterFirstMonthGas: filter }));
      setStateNav(state => ({ ...state, filterFirstThreeMonthGas: filter }));
      setStateNav(state => ({ ...state, filterFirstSixMonthGas: filter }));
      setStateNav(state => ({ ...state, filterFirstTwelveMonthGas: filter }));
      //after old cleared set new filters in productionSlider.js by reacting to new value for months and new max
      setValueFirstMonthsGas(newValue.props.value);
    } else {
      setStateNav(state => ({ ...state, filterLastMonthGas: filter }));
      setStateNav(state => ({ ...state, filterLastThreeMonthGas: filter }));
      setStateNav(state => ({ ...state, filterLastSixMonthGas: filter }));
      setStateNav(state => ({ ...state, filterLastTwelveMonthGas: filter }));

      //after old cleared set new filters in productionSlider.js by reacting to new value for months and new max
      setValueLastMonthsGas(newValue.props.value);
      // setResetToMax(true);
    }
  };

  const removePreviousMonthsFiltersWater = (firstLast, newValue) => {
    // console.log(firstLast, newValue)
    //you have to clear out previous months since they each have separate names in stateNav (because they have separate properties in well data). Not ideal.
    //setState doesn't like a variable as the key so I had to hard code each filter name.  may be a better way.
    let filter = null;
    if (firstLast === "first") {
      setStateNav(state => ({ ...state, filterFirstMonthWater: filter }));
      setStateNav(state => ({ ...state, filterFirstThreeMonthWater: filter }));
      setStateNav(state => ({ ...state, filterFirstSixMonthWater: filter }));
      setStateNav(state => ({ ...state, filterFirstTwelveMonthWater: filter }));

      //after old cleared set new filters in productionSlider.js by reacting to new value for months and new max
      setValueFirstMonthsWater(newValue.props.value);
    } else {
      setStateNav(state => ({ ...state, filterLastMonthWater: filter }));
      setStateNav(state => ({ ...state, filterLastThreeMonthWater: filter }));
      setStateNav(state => ({ ...state, filterLastSixMonthWater: filter }));
      setStateNav(state => ({ ...state, filterLastTwelveMonthWater: filter }));

      //after old cleared set new filters in productionSlider.js by reacting to new value for months and new max
      setValueLastMonthsWater(newValue.props.value);
      // setResetToMax(true);
    }
  };

  const renderFirstMonthsOil = firstMonths ? (
    <FormControl id="dontClose" className={classes.formControlMonths}>
      <InputLabel className={classes.inputLabelMonths}>Months</InputLabel>
      <Select
        className={classes.inputMonths}
        id="select-first-months"
        value={valueFirstMonthsOil}
        onChange={handleChangeFirstMonthsOil}
        MenuProps={{ disablePortal: true }}
      >
        <MenuItem value={12}>12</MenuItem>
        <MenuItem value={6}>6</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={1}>1</MenuItem>
      </Select>
    </FormControl>
  ) : (
    <div className={classes.displayNone}></div>
  );

  const renderFirstMonthsGas = firstMonths ? (
    <FormControl className={classes.formControlMonths}>
      <InputLabel className={classes.inputLabelMonths}>Months</InputLabel>
      <Select
        className={classes.inputMonths}
        id="select-first-months"
        value={valueFirstMonthsGas}
        onChange={handleChangeFirstMonthsGas}
        MenuProps={{ disablePortal: true }}
      >
        <MenuItem value={12}>12</MenuItem>
        <MenuItem value={6}>6</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={1}>1</MenuItem>
      </Select>
    </FormControl>
  ) : (
    <div className={classes.displayNone}></div>
  );

  const renderFirstMonthsWater = firstMonths ? (
    <FormControl className={classes.formControlMonths}>
      <InputLabel className={classes.inputLabelMonths}>Months</InputLabel>
      <Select
        className={classes.inputMonths}
        id="select-first-months"
        value={valueFirstMonthsWater}
        onChange={handleChangeFirstMonthsWater}
        MenuProps={{ disablePortal: true }}
      >
        <MenuItem value={12}>12</MenuItem>
        <MenuItem value={6}>6</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={1}>1</MenuItem>
      </Select>
    </FormControl>
  ) : (
    <div className={classes.displayNone}></div>
  );

  const renderLastMonthsOil = lastMonths ? (
    <FormControl className={classes.formControlMonths}>
      <InputLabel className={classes.inputLabelMonths}>Months</InputLabel>
      <Select
        className={classes.inputMonths}
        id="select-last-months"
        value={valueLastMonthsOil}
        onChange={handleChangeLastMonthsOil}
        MenuProps={{ disablePortal: true }}
      >
        <MenuItem value={12}>12</MenuItem>
        <MenuItem value={6}>6</MenuItem>
        <MenuItem value={1}>1</MenuItem>
      </Select>
    </FormControl>
  ) : (
    <div className={classes.displayNone}></div>
  );

  const renderLastMonthsGas = lastMonths ? (
    <FormControl className={classes.formControlMonths}>
      <InputLabel className={classes.inputLabelMonths}>Months</InputLabel>
      <Select
        className={classes.inputMonths}
        id="select-last-months"
        value={valueLastMonthsGas}
        onChange={handleChangeLastMonthsGas}
        MenuProps={{ disablePortal: true }}
      >
        <MenuItem value={12}>12</MenuItem>
        <MenuItem value={6}>6</MenuItem>
        <MenuItem value={1}>1</MenuItem>
      </Select>
    </FormControl>
  ) : (
    <div className={classes.displayNone}></div>
  );

  const renderLastMonthsWater = lastMonths ? (
    <FormControl className={classes.formControlMonths}>
      <InputLabel className={classes.inputLabelMonths}>Months</InputLabel>
      <Select
        className={classes.inputMonths}
        id="select-last-months"
        value={valueLastMonthsWater}
        onChange={handleChangeLastMonthsWater}
        MenuProps={{ disablePortal: true }}
      >
        <MenuItem value={12}>12</MenuItem>
        <MenuItem value={6}>6</MenuItem>
        <MenuItem value={1}>1</MenuItem>
      </Select>
    </FormControl>
  ) : (
    <div className={classes.displayNone}></div>
  );
  // add id to match max and set vals in production slider to match so they can update
  const renderFirstMonthOil = (
    max && valueFirstMonthsOil  === 1 ?
        <FormControl className={classes.inputWrapper}>
          <ProductionSlider
            id="firstMonthOil"
            firstLast="first"
            min={0}
            max={max.firstMonthProdOil}
          />
        </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderFirstThreeMonthOil = (
     max && valueFirstMonthsOil  === 3 ?
      <FormControl className={classes.inputWrapper}>
        <ProductionSlider
          id="firstThreeMonthOil"
          firstLast="first"
          min={0}
          max={max.first3MonthProdOil}
        />
      </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderFirstSixMonthOil = (
    max && valueFirstMonthsOil  === 6 ?
   <FormControl className={classes.inputWrapper}>
     <ProductionSlider
       id="firstSixMonthOil"
       firstLast="first"
       min={0}
       max={max.first6MonthProdOil}
     />
   </FormControl>
   : 
     <div className={classes.displayNone}></div>
 )

 const renderFirstTwelveMonthOil = (
  max && valueFirstMonthsOil  === 12 ?
 <FormControl className={classes.inputWrapper}>
   <ProductionSlider
     id="firstTwelveMonthOil"
     // prod="Oil"
     firstLast="first"
     // months={valsFirstMonthsOil}
     min={0}
     max={max.first12MonthProdOil}
   />
 </FormControl>
 : 
   <div className={classes.displayNone}></div>
)

  const renderLastMonthOil = (
    max && valueLastMonthsOil  === 1 ?
        <FormControl className={classes.inputWrapper}>
          <ProductionSlider
            id="lastMonthOil"
            prod="Oil"
            firstLast="last"
            months={valsLastMonthsOil}
            min={0}
            max={max.lastMonthProdOil}
          />
        </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )
  
  const renderLastSixMonthOil = (
    max && valueLastMonthsOil  === 6 ?
    <FormControl className={classes.inputWrapper}>
      <ProductionSlider
        id="lastSixMonthOil"
        prod="Oil"
        firstLast="last"
        months={valsLastMonthsOil}
        min={0}
        max={max.last6MonthProdOil}
      />
    </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )
  const renderLastTwelveMonthOil = (
    max && valueLastMonthsOil  === 12 ?
    <FormControl className={classes.inputWrapper}>
      <ProductionSlider
        id="lastTwelveMonthOil"
        prod="Oil"
        firstLast="last"
        months={valsFirstMonthsOil}
        min={0}
        max={max.last12MonthProdOil}
      />
    </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderFirstMonthGas = (
    max && valueFirstMonthsGas  === 1 ?
        <FormControl className={classes.inputWrapper}>
          <ProductionSlider
            id="firstMonthGas"
            prod="Gas"
            firstLast="first"
            months={valsFirstMonthsGas}
            min={0}
            max={max.firstMonthProdGas}
          />
        </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderFirstThreeMonthGas = (
    max && valueFirstMonthsGas  === 3 ?
      <FormControl className={classes.inputWrapper}>
        <ProductionSlider
          id="firstThreeMonthGas"
          prod="Gas"
          firstLast="first"
          months={valsFirstMonthsGas}
          min={0}
          max={max.first3MonthProdGas}
        />
      </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderFirstSixMonthGas = (
    max && valueFirstMonthsGas  === 6 ?
    <FormControl className={classes.inputWrapper}>
      <ProductionSlider
        id="firstSixMonthGas"
        prod="Gas"
        firstLast="first"
        months={valsFirstMonthsGas}
        min={0}
        max={max.first6MonthProdGas}
      />
    </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderFirstTwelveMonthGas = (
    max && valueFirstMonthsGas  === 12 ?
    <FormControl className={classes.inputWrapper}>
      <ProductionSlider
        id="firstTwelveMonthGas"
        prod="Gas"
        firstLast="first"
        months={valsFirstMonthsGas}
        min={0}
        max={max.first12MonthProdGas}
      />
    </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderLastMonthGas = (
    max && valueLastMonthsGas  === 1 ?
        <FormControl className={classes.inputWrapper}>
          <ProductionSlider
            id="lastMonthGas"
            prod="Gas"
            firstLast="last"
            months={valsLastMonthsGas}
            min={0}
            max={max.lastMonthProdGas}
          />
        </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderLastSixMonthGas = (
    max && valueLastMonthsGas === 6 ?
    <FormControl className={classes.inputWrapper}>
      <ProductionSlider
        id="lastSixMonthGas"
        prod="Gas"
        firstLast="last"
        months={valsLastMonthsGas}
        min={0}
        max={max.last6MonthProdGas}
      />
    </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderLastTwelveMonthGas = (
    max && valueLastMonthsGas === 12 ?
    <FormControl className={classes.inputWrapper}>
      <ProductionSlider
        id="lastTwelveMonthGas"
        prod="Gas"
        firstLast="last"
        months={valsFirstMonthsGas}
        min={0}
        max={max.last12MonthProdGas}
      />
    </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderFirstMonthWater = (
    max && valueFirstMonthsWater  === 1 ?
        <FormControl className={classes.inputWrapper}>
          <ProductionSlider
            id="firstMonthWater"
            prod="Water"
            firstLast="first"
            months={valsFirstMonthsWater}
            min={0}
            max={max.firstMonthProdWater}
          />
        </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderFirstThreeMonthWater = (
   max && valueFirstMonthsWater  === 3 ?
      <FormControl className={classes.inputWrapper}>
        <ProductionSlider
          id="firstThreeMonthWater"
          prod="Water"
          firstLast="first"
          months={valsFirstMonthsWater}
          min={0}
          max={max.first3MonthProdWater}
        />
      </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderFirstSixMonthWater = (
  max && valueFirstMonthsWater  === 6 ?
    <FormControl className={classes.inputWrapper}>
      <ProductionSlider
        id="firstSixMonthWater"
        prod="Water"
        firstLast="first"
        months={valsFirstMonthsWater}
        min={0}
        max={max.first6MonthProdWater}
      />
    </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderFirstTwelveMonthWater = (
    max && valueFirstMonthsWater  === 12 ?
    <FormControl className={classes.inputWrapper}>
      <ProductionSlider
        id="firstTwelveMonthWater"
        prod="Water"
        firstLast="first"
        months={valsFirstMonthsWater}
        min={0}
        max={max.first12MonthProdWater}
      />
    </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )
  
  const renderLastMonthWater = (
    max && valueLastMonthsWater  === 1 ?
        <FormControl className={classes.inputWrapper}>
          <ProductionSlider
            id="lastMonthWater"
            prod="Water"
            firstLast="last"
            months={valsLastMonthsWater}
            min={0}
            max={max.lastMonthProdWater}
          />
        </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderLastSixMonthWater = (
    max && valueLastMonthsWater === 6 ?
    <FormControl className={classes.inputWrapper}>
      <ProductionSlider
        id="lastSixMonthWater"
        prod="Water"
        firstLast="last"
        months={valsLastMonthsWater}
        min={0}
        max={max.last6MonthProdWater}
      />
    </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  const renderLastTwelveMonthWater = (
   max && valueLastMonthsWater === 12 ?
    <FormControl className={classes.inputWrapper}>
      <ProductionSlider
        id="lastTwelveMonthWater"
        prod="Water"
        firstLast="last"
        months={valsFirstMonthsWater}
        min={0}
        max={max.last12MonthProdWater}
      />
    </FormControl>
    : 
      <div className={classes.displayNone}></div>
  )

  return !loading ? (
    
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleTabChange}
        variant="standard"
        textColor="primary"
        aria-label="tabs"
        classes={{ indicator: classes.indicator }}
      >
        <Tab
          label="Cumulative"
          value={0}
          className={classes.tab}
          aria-label="cumulative"
        />
        <Tab
          label="First Prod"
          value={1}
          className={classes.tab}
          aria-label="first"
        />
        <Tab
          label="Last Prod"
          value={2}
          className={classes.tab}
          aria-label="last"
        />
      </Tabs>
      <TabPanel className={classes.tabStyle} value={value} index={0}>
        <FormControl className={classes.inputWrapper}>
          <Typography className={classes.inputLabel} htmlFor="s">
            Cumulative Oil (MBBL)
          </Typography>
          <ProductionSlider
            id="cumulativeOil"
            min={0}
            max={max.cumulativeOil}
          />
        </FormControl>
        <FormControl className={classes.inputWrapper}>
          <Typography
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Cumulative Gas (MMCF)
          </Typography>
          <ProductionSlider
            id="cumulativeGas"
            min={0}
            max={max.cumulativeGas}
          />
        </FormControl>
        <FormControl className={classes.inputWrapper}>
          <Typography
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Cumulative H2O (MBBL)
          </Typography>
          <ProductionSlider
            id="cumulativeWater"
            min={0}
            max={max.cumulativeWater}
          />
        </FormControl>
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <FormControl className={classes.inputWrapper}>
          <Typography className={classes.inputLabel}>Oil (MBBL) </Typography>
          {renderFirstMonthsOil}
          {renderFirstMonthOil}
          {renderFirstThreeMonthOil}
          {renderFirstSixMonthOil}
          {renderFirstTwelveMonthOil}
        </FormControl>
        <FormControl className={classes.inputWrapper}>
          <Typography
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Gas (MMCF)
          </Typography>
          {renderFirstMonthsGas}
          {renderFirstMonthGas}
          {renderFirstThreeMonthGas}
          {renderFirstSixMonthGas}
          {renderFirstTwelveMonthGas}
        </FormControl>
        <FormControl className={classes.inputWrapper}>
          <Typography
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Water (MBBL)
          </Typography>
          {renderFirstMonthsWater}
          {renderFirstMonthWater}
          {renderFirstThreeMonthWater}
          {renderFirstSixMonthWater}
          {renderFirstTwelveMonthWater}
        </FormControl>
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <FormControl className={classes.inputWrapper}>
          <Typography
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Oil (MBBL)
          </Typography>
          {renderLastMonthsOil}
          {renderLastMonthOil}
          {renderLastSixMonthOil}
          {renderLastTwelveMonthOil}
        </FormControl>
        <FormControl className={classes.inputWrapper}>
          <Typography
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Gas (MMCF)
          </Typography>
          {renderLastMonthsGas}
          {renderLastMonthGas}
          {renderLastSixMonthGas}
          {renderLastTwelveMonthGas}
        </FormControl>
        <FormControl className={classes.inputWrapper}>
          <Typography
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Water (MBBL)
          </Typography>
          {renderLastMonthsWater}
          {renderLastMonthWater}
          {renderLastSixMonthWater}
          {renderLastTwelveMonthWater}
        </FormControl>
      </TabPanel>
    </div>
  ) : (
    <CircularProgress color="secondary" className={classes.loader} size={75} />
  );
}
