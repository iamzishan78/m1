
import React, { useState, useContext, useEffect } from "react";
import { makeStyles, useTheme} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import PropTypes from 'prop-types'
import { NavigationContext } from '../NavigationContext'
import ProductionSlider from './ProductionSlider';
import CircularProgress from "@material-ui/core/CircularProgress";

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
    marginBottom: 10,
    marginRight: 60,
    marginLeft: 10,
  },
  inputLabel2: {
    color: "black",
    textAlign: "center",
    minWidth: 249,
    maxWidth: 250,
    marginBottom: 15
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




const TabPanel = props => {
  const classes = useStyles()
  const { children, value, index, ...other } = props

  return (
    <div className={classes.tabPanel}
      role="tabpanel"
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}


export default function FilterFormProduction() {
  const classes = useStyles();
  const theme = useTheme();
  const [stateNav, setStateNav] = useContext(NavigationContext)
  const [value,setValue] = useState(0)
  const [valueFirstMonths,setValueFirstMonths] = useState(12)
  const [valueLastMonths,setValueLastMonths] = useState(12)
  const [max, setMax] = useState();
  const [resetToMax,setResetToMax] = useState(false)
  const [firstOilMax,setFirstOilMax] = useState(max.first12MonthProdOil)
  const [firstGasMax,setFirstGasMax] = useState(max.first12MonthProdGas)
  const [firstWaterMax,setFirstWaterMax] = useState(max.first12MonthProdWater)
  const [lastOilMax,setLastOilMax] = useState(max.last12MonthProdOil)
  const [lastGasMax,setLastGasMax] = useState(max.last12MonthProdGas)
  const [lastWaterMax,setLastWaterMax] = useState(max.last12MonthProdWater)
  
  const [valueFirstMonthsOil, setValueFirstMonthsOil] = useState(12);
  const [valueFirstMonthsGas, setValueFirstMonthsGas] = useState(12);
  const [valueFirstMonthsWater, setValueFirstMonthsWater] = useState(12);
  const [valueLastMonthsOil, setValueLastMonthsOil] = useState(12);
  const [valueLastMonthsGas, setValueLastMonthsGas] = useState(12);
  const [valueLastMonthsWater, setValueLastMonthsWater] = useState(12);
  const [loading, setIsLoading] = useState(true);
  const [firstMonths, setFirstMonths] = useState(false);
  const [lastMonths, setLastMonths] = useState(false);
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



  const handleChangeFirstMonths = (event, newValue) => {
    updateSliderRanges('First',newValue) 
  }
  const handleChangeLastMonths = (event, newValue) => {
    updateSliderRanges('Last',newValue)
  }

  const updateSliderRanges = (firstLast,newValue) => {
      if(firstLast === 'First'){
        console.log(newValue.props.value)
        switch(newValue.props.value) {
          case 1: 
            setFirstOilMax(max.firstMonthProdOil)
            setFirstGasMax(max.firstMonthProdGas)
            setFirstWaterMax(max.firstMonthProdWater)
          break
          case 3: 
            setFirstOilMax(max.first3MonthProdOil)
            setFirstGasMax(max.first3MonthProdGas)
            setFirstWaterMax(max.first3MonthProdWater)
          break
          case 6: 
            setFirstOilMax(max.first6MonthProdOil)
            setFirstGasMax(max.first6MonthProdGas)
            setFirstWaterMax(max.first6MonthProdWater)
          break
          case 12: 
            setFirstOilMax(max.first12MonthProdOil)
            setFirstGasMax(max.first12MonthProdGas)
            setFirstWaterMax(max.first12MonthProdWater)
          break
        }
    }

    if(firstLast === 'Last'){

      switch(newValue.props.value) {
        case 1: 
          setLastOilMax(max.lastMonthProdOil)
          setLastGasMax(max.lastMonthProdGas)
          setLastWaterMax(max.lastMonthProdWater)
        break
        case 3: 
         
        break
        case 6: 
          setLastOilMax(max.last6MonthProdOil)
          setLastGasMax(max.last6MonthProdGas)
          setLastWaterMax(max.last6MonthProdWater)
        break
        case 12: 
          setLastOilMax(max.last12MonthProdOil)
          setLastGasMax(max.last12MonthProdGas)
          setLastWaterMax(max.last12MonthProdWater)
        break
      }
    }

    removePreviousMonthsFilters(firstLast,newValue)
  }
  

  const removePreviousMonthsFilters = (firstLast,newValue) => {
    //you have to clear out previous months since they each have separate names in stateNav (because they have separate properties in well data). Not ideal.
    //setState doesn't like a variable as the key so I had to hard code each filter name.  may be a better way.
    let filter = null;
    if(firstLast === 'First'){
      setStateNav(state => ({ ...state, filterFirstMonthWater:filter }))
      setStateNav(state => ({ ...state, filterFirstThreeMonthWater:filter }))
      setStateNav(state => ({ ...state, filterFirstSixMonthWater:filter }))
      setStateNav(state => ({ ...state, filterFirstTwelveMonthWater:filter }))

      setStateNav(state => ({ ...state, filterFirstMonthGas:filter }))
      setStateNav(state => ({ ...state, filterFirstThreeMonthGas:filter }))
      setStateNav(state => ({ ...state, filterFirstSixMonthGas:filter }))
      setStateNav(state => ({ ...state, filterFirstTwelveMonthGas:filter }))

      setStateNav(state => ({ ...state, filterFirstMonthOil:filter }))
      setStateNav(state => ({ ...state, filterFirstThreeMonthOil:filter }))
      setStateNav(state => ({ ...state, filterFirstSixMonthOil:filter }))
      setStateNav(state => ({ ...state, filterFirstTwelveMonthOil:filter }))

      //after old cleared set new filters in productionSlider.js by reacting to new value for months and new max
      setValueFirstMonths(newValue.props.value)
      setResetToMax(true)
    }
    else {
      setStateNav(state => ({ ...state, filterLastMonthWater:filter }))
      setStateNav(state => ({ ...state, filterLastThreeMonthWater:filter }))
      setStateNav(state => ({ ...state, filterLastSixMonthWater:filter }))
      setStateNav(state => ({ ...state, filterLastTwelveMonthWater:filter }))

      setStateNav(state => ({ ...state, filterLastMonthGas:filter }))
      setStateNav(state => ({ ...state, filterLastThreeMonthGas:filter }))
      setStateNav(state => ({ ...state, filterLastSixMonthGas:filter }))
      setStateNav(state => ({ ...state, filterLastTwelveMonthGas:filter }))

      setStateNav(state => ({ ...state, filterLastMonthOil:filter }))
      setStateNav(state => ({ ...state, filterLastThreeMonthOil:filter }))
      setStateNav(state => ({ ...state, filterLastSixMonthOil:filter }))
      setStateNav(state => ({ ...state, filterLastTwelveMonthOil:filter }))
  
      //after old cleared set new filters in productionSlider.js by reacting to new value for months and new max
      setValueLastMonths(newValue.props.value)
      setResetToMax(true)
    }
     
 
  }
  



  return (
      
     <div className={classes.root}>
     <Tabs
              value={value}
              onChange={handleTabChange}
              variant="standard"
              textColor="primary"
              aria-label="tabs"
              classes={{ indicator: classes.indicator }}
            >
              <Tab label="Cumulative"
                value={0}
                className={classes.tab}
                aria-label="cumulative"
              />
               <Tab label="First Prod"
                value={1}
                className={classes.tab}
                aria-label="first"
              />
               <Tab label="Last Prod"
                value={2}
                className={classes.tab}
                aria-label="last"
              />
      </Tabs>
      <TabPanel  value={value} index={0} >
         <FormControl  className={classes.sliderWrapper}>
            <InputLabel className={classes.inputLabel} htmlFor="s">Cumulative Oil (MBBL)</InputLabel>
           <ProductionSlider id="CumulativeOil" min={0}  max={max.cumulativeOil} />
          </FormControl> 
          <FormControl   className={classes.sliderWrapper}>
            <InputLabel className={classes.inputLabel} htmlFor="select-multiple-chip1">Cumulative Gas (MMCF)</InputLabel> 
            <ProductionSlider id="CumulativeGas" min={0} step={100} max={max.cumulativeGas} /> 
          </FormControl> 
          <FormControl   className={classes.sliderWrapper}>
            <InputLabel className={classes.inputLabel} htmlFor="select-multiple-chip1">Cumulative Water (MBBL)</InputLabel> 
            <ProductionSlider id="CumulativeWater" min={0} step={1000} max={max.cumulativeWater} />
          </FormControl>
       </TabPanel>
       <TabPanel value={value} index={1} dir={theme.direction}>
          <FormControl   className={classes.formControl}>
          <InputLabel>Months</InputLabel>
            <Select className={classes.select}  id="select-first-months" value={valueFirstMonths} onChange={handleChangeFirstMonths}>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={1}>1</MenuItem>
            </Select>
            </FormControl>
          <FormControl className={classes.sliderWrapper}>
            <InputLabel className={classes.inputLabel}>Oil (MBBL)</InputLabel>
           
            <ProductionSlider id="FirstOil" prod="Oil" firstLast="First" months={valueFirstMonths} min={0} resetToMax={resetToMax}  max={firstOilMax} />
          
           </FormControl> 
         <FormControl   className={classes.sliderWrapper} >
            <InputLabel className={classes.inputLabel} htmlFor="select-multiple-chip1">Gas (MMCF)</InputLabel>
            
            <ProductionSlider id="FirstGas" prod="Gas" firstLast="First"  months={valueFirstMonths} min={0} resetToMax={resetToMax} max={firstGasMax} />
          </FormControl> 
          <FormControl   className={classes.sliderWrapper} >
            <InputLabel className={classes.inputLabel} htmlFor="select-multiple-chip1">Water (MBBL)</InputLabel>
      
            <ProductionSlider id="FirstWater" prod="Water" firstLast="First"  months={valueFirstMonths} min={0} resetToMax={resetToMax} max={firstWaterMax} />
          </FormControl> 
       </TabPanel>
       <TabPanel value={value} index={2} dir={theme.direction}>
       <FormControl   className={classes.formControl}>
          <InputLabel>Months</InputLabel>
            <Select className={classes.select}  id="select-last-months" value={valueLastMonths} onChange={handleChangeLastMonths}>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={1}>1</MenuItem>
            </Select>
            </FormControl>
       <FormControl   className={classes.sliderWrapper} >
            <InputLabel className={classes.inputLabel} htmlFor="select-multiple-chip1">Oil (MBBL)</InputLabel>
            <ProductionSlider id="LastOil" prod="Oil" firstLast="Last"  months={valueLastMonths} min={0} resetToMax={resetToMax} max={lastOilMax} />
          </FormControl> 
          <FormControl   className={classes.sliderWrapper} >
            <InputLabel className={classes.inputLabel} htmlFor="select-multiple-chip1">Gas (MMCF)</InputLabel>
            <ProductionSlider id="LastGas" prod="Gas" firstLast="Last" months={valueLastMonths} min={0} resetToMax={resetToMax} max={lastGasMax} />
          </FormControl> 
          <FormControl   className={classes.sliderWrapper} >
            <InputLabel className={classes.inputLabel} htmlFor="select-multiple-chip1">Water (MBBL)</InputLabel>
            <ProductionSlider id="LastWater" prod="Water" firstLast="Last" months={valueLastMonths} min={0} resetToMax={resetToMax}  max={lastWaterMax} />
          </FormControl> 
       </TabPanel>
     
       
      </div>
      
   
  )
}