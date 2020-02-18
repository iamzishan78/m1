import React, { useState, useContext } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
// import InputLabel from '@material-ui/core/InputLabel';
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
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
    textAlign: "center"
  },
  tabStyle: {
    maxWidth: 600
  },
  indicator: {
    backgroundColor: "rgba(23, 170, 221, 1) !important"
  },
  tab: {
    minWidth: "65px"
  },
  select: {
    width: "48px"
  }
}));

const TabPanel = props => {
  const classes = useStyles();
  const { children, value, index, ...other } = props;

  return (
    <div
      className={classes.tabPanel}
      role="tabpanel"
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};
let maxDefaults = {
  cumulativeOil: 167614975.0,
  cumulativeGas: 823336323.25,
  cumulativeWater: 7478643329.0,
  firstMonthProdOil: 904242,
  firstMonthProdGas: 5819855.0,
  firstMonthProdWater: 24401940.0,
  first3MonthProdOil: 2653353.0,
  first3MonthProdGas: 20238464.0,
  first3MonthProdWater: 102591264.0,
  first6MonthProdOil: 5292337.0,
  first6MonthProdGas: 38892339.0,
  first6MonthProdWater: 216727496.0,
  first12MonthProdOil: 10669511.0,
  first12MonthProdGas: 70110546.0,
  first12MonthProdWater: 440230944.0,
  lastMonthProdOil: 901862.0,
  lastMonthProdGas: 2873067.0,
  lastMonthProdWater: 568357376.0,
  last6MonthProdOil: 5377174.0,
  last6MonthProdGas: 16297259.0,
  last6MonthProdWater: 2840916576.0,
  last12MonthProdOil: 10669511.0,
  last12MonthProdGas: 32214448.0,
  last12MonthProdWater: 4585077920.0
};

let minDefaults = {
  cumulativeOil: 0,
  cumulativeGas: 0,
  cumulativeWater: 0,
  firstMonthProdOil: 0,
  firstMonthProdGas: 0,
  firstMonthProdWater: 0,
  first3MonthProdOil: 0,
  first3MonthProdGas: 0,
  first3MonthProdWater: 0,
  first6MonthProdOil: 0,
  first6MonthProdGas: 0,
  first6MonthProdWater: 0,
  first12MonthProdOil: 0,
  first12MonthProdGas: 0,
  first12MonthProdWater: 0,
  lastMonthProdOil: 0,
  lastMonthProdGas: 0,
  lastMonthProdWater: 0,
  last6MonthProdOil: 0,
  last6MonthProdGas: 0,
  last6MonthProdWater: 0,
  last12MonthProdOil: 0,
  last12MonthProdGas: 0,
  last12MonthProdWater: 0
};

export default function FilterFormProduction() {
  const classes = useStyles();
  const theme = useTheme();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [value, setValue] = useState(0);
  const [valueFirstMonths, setValueFirstMonths] = useState(12);
  const [valueLastMonths, setValueLastMonths] = useState(12);
  const [max, setMax] = useState(maxDefaults);
  const [min, setMin] = useState(minDefaults);
  const [resetToMax, setResetToMax] = useState(false);
  const [firstOilMax, setFirstOilMax] = useState(max.first12MonthProdOil);
  const [firstGasMax, setFirstGasMax] = useState(max.first12MonthProdGas);
  const [firstWaterMax, setFirstWaterMax] = useState(max.first12MonthProdWater);
  const [lastOilMax, setLastOilMax] = useState(max.last12MonthProdOil);
  const [lastGasMax, setLastGasMax] = useState(max.last12MonthProdGas);
  const [lastWaterMax, setLastWaterMax] = useState(max.last12MonthProdWater);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeFirstMonths = (event, newValue) => {
    updateSliderRanges("First", newValue);
  };
  const handleChangeLastMonths = (event, newValue) => {
    updateSliderRanges("Last", newValue);
  };

  const updateSliderRanges = (firstLast, newValue) => {
    if (firstLast === "First") {
      console.log(newValue.props.value);
      switch (newValue.props.value) {
        case 1:
          setFirstOilMax(max.firstMonthProdOil);
          setFirstGasMax(max.firstMonthProdGas);
          setFirstWaterMax(max.firstMonthProdWater);
          break;
        case 3:
          setFirstOilMax(max.first3MonthProdOil);
          setFirstGasMax(max.first3MonthProdGas);
          setFirstWaterMax(max.first3MonthProdWater);
          break;
        case 6:
          setFirstOilMax(max.first6MonthProdOil);
          setFirstGasMax(max.first6MonthProdGas);
          setFirstWaterMax(max.first6MonthProdWater);
          break;
        case 12:
          setFirstOilMax(max.first12MonthProdOil);
          setFirstGasMax(max.first12MonthProdGas);
          setFirstWaterMax(max.first12MonthProdWater);
          break;
      }
    }

    if (firstLast === "Last") {
      switch (newValue.props.value) {
        case 1:
          setLastOilMax(max.lastMonthProdOil);
          setLastGasMax(max.lastMonthProdGas);
          setLastWaterMax(max.lastMonthProdWater);
          break;
        case 3:
          break;
        case 6:
          setLastOilMax(max.last6MonthProdOil);
          setLastGasMax(max.last6MonthProdGas);
          setLastWaterMax(max.last6MonthProdWater);
          break;
        case 12:
          setLastOilMax(max.last12MonthProdOil);
          setLastGasMax(max.last12MonthProdGas);
          setLastWaterMax(max.last12MonthProdWater);
          break;
      }
    }

    removePreviousMonthsFilters(firstLast, newValue);
  };

  const removePreviousMonthsFilters = (firstLast, newValue) => {
    //you have to clear out previous months since they each have separate names in stateNav (because they have separate properties in well data). Not ideal.
    //setState doesn't like a variable as the key so I had to hard code each filter name.  may be a better way.
    let filter = null;
    if (firstLast === "First") {
      setStateNav(state => ({ ...state, filterFirstMonthWater: filter }));
      setStateNav(state => ({ ...state, filterFirstThreeMonthWater: filter }));
      setStateNav(state => ({ ...state, filterFirstSixMonthWater: filter }));
      setStateNav(state => ({ ...state, filterFirstTwelveMonthWater: filter }));

      setStateNav(state => ({ ...state, filterFirstMonthGas: filter }));
      setStateNav(state => ({ ...state, filterFirstThreeMonthGas: filter }));
      setStateNav(state => ({ ...state, filterFirstSixMonthGas: filter }));
      setStateNav(state => ({ ...state, filterFirstTwelveMonthGas: filter }));

      setStateNav(state => ({ ...state, filterFirstMonthOil: filter }));
      setStateNav(state => ({ ...state, filterFirstThreeMonthOil: filter }));
      setStateNav(state => ({ ...state, filterFirstSixMonthOil: filter }));
      setStateNav(state => ({ ...state, filterFirstTwelveMonthOil: filter }));

      //after old cleared set new filters in productionSlider.js by reacting to new value for months and new max
      setValueFirstMonths(newValue.props.value);
      setResetToMax(true);
    } else {
      setStateNav(state => ({ ...state, filterLastMonthWater: filter }));
      setStateNav(state => ({ ...state, filterLastThreeMonthWater: filter }));
      setStateNav(state => ({ ...state, filterLastSixMonthWater: filter }));
      setStateNav(state => ({ ...state, filterLastTwelveMonthWater: filter }));

      setStateNav(state => ({ ...state, filterLastMonthGas: filter }));
      setStateNav(state => ({ ...state, filterLastThreeMonthGas: filter }));
      setStateNav(state => ({ ...state, filterLastSixMonthGas: filter }));
      setStateNav(state => ({ ...state, filterLastTwelveMonthGas: filter }));

      setStateNav(state => ({ ...state, filterLastMonthOil: filter }));
      setStateNav(state => ({ ...state, filterLastThreeMonthOil: filter }));
      setStateNav(state => ({ ...state, filterLastSixMonthOil: filter }));
      setStateNav(state => ({ ...state, filterLastTwelveMonthOil: filter }));

      //after old cleared set new filters in productionSlider.js by reacting to new value for months and new max
      setValueLastMonths(newValue.props.value);
      setResetToMax(true);
    }
  };

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
            id="CumulativeOil"
            min={min.cumulativeOil}
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
            id="CumulativeGas"
            min={min.cumulativeGas}
            max={max.cumulativeGas}
          />
        </FormControl>
        <FormControl className={classes.inputWrapper}>
          <Typography
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Cumulative Water (MBBL)
          </Typography>
          <ProductionSlider
            id="CumulativeWater"
            min={min.cumulativeWater}
            max={max.cumulativeWater}
          />
        </FormControl>
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <FormControl className={classes.formControl}>
          <Typography>Months</Typography>
          <Select
            className={classes.inputWrapper}
            id="select-first-months"
            value={valueFirstMonths}
            onChange={handleChangeFirstMonths}
            variant="outlined"
          >
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={1}>1</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.inputWrapper}>
          <Typography className={classes.inputLabel}>Oil (MBBL)</Typography>

          <ProductionSlider
            id="FirstOil"
            prod="Oil"
            firstLast="First"
            months={valueFirstMonths}
            min={min.first12MonthProdOil}
            // resetToMax={resetToMax}
            max={firstOilMax}
          />
        </FormControl>
        <FormControl className={classes.inputWrapper}>
          <Typography
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Gas (MMCF)
          </Typography>

          <ProductionSlider
            id="FirstGas"
            prod="Gas"
            firstLast="First"
            months={valueFirstMonths}
            min={min.first12MonthProdGas}
            // resetToMax={resetToMax}
            max={firstGasMax}
          />
        </FormControl>
        <FormControl className={classes.inputWrapper}>
          <Typography
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Water (MBBL)
          </Typography>

          <ProductionSlider
            id="FirstWater"
            prod="Water"
            firstLast="First"
            months={valueFirstMonths}
            min={0}
            // resetToMax={resetToMax}
            max={firstWaterMax}
          />
          <ProductionSlider
            id="FirstWater"
            prod="Water"
            firstLast="First"
            months={valueFirstMonths}
            min={0}
            resetToMax={resetToMax}
            max={firstWaterMax}
          />
        </FormControl>
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <FormControl className={classes.formControl}>
          <Typography>Months</Typography>
          <Select
            className={classes.inputWrapper}
            id="select-last-months"
            value={valueLastMonths}
            onChange={handleChangeLastMonths}
            variant="outlined"
          >
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={1}>1</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.inputWrapper}>
          <Typography
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Oil (MBBL)
          </Typography>
          <ProductionSlider
            id="LastOil"
            prod="Oil"
            firstLast="Last"
            months={valueLastMonths}
            min={0}
            resetToMax={resetToMax}
          />
          <ProductionSlider
            id="LastOil"
            prod="Oil"
            firstLast="Last"
            months={valueLastMonths}
            resetToMax={resetToMax}
            max={lastOilMax}
          />
        </FormControl>
        <FormControl className={classes.inputWrapper}>
          <Typography
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Gas (MMCF)
          </Typography>
          <ProductionSlider
            id="LastGas"
            prod="Gas"
            firstLast="Last"
            months={valueLastMonths}
            min={0}
            resetToMax={resetToMax}
            max={lastGasMax}
          />
          <ProductionSlider
            id="LastGas"
            prod="Gas"
            firstLast="Last"
            months={valueLastMonths}
            min={0}
            resetToMax={resetToMax}
            max={lastGasMax}
          />
        </FormControl>
        <FormControl className={classes.inputWrapper}>
          <Typography
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Water (MBBL)
          </Typography>
          <ProductionSlider
            id="LastWater"
            prod="Water"
            firstLast="Last"
            months={valueLastMonths}
            min={0}
            resetToMax={resetToMax}
            max={lastWaterMax}
          />
          <ProductionSlider
            id="LastWater"
            prod="Water"
            firstLast="Last"
            months={valueLastMonths}
            min={0}
            resetToMax={resetToMax}
            max={lastWaterMax}
          />
        </FormControl>
      </TabPanel>
    </div>
  );
}
