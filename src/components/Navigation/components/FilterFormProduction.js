import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
import ProdMinMax from "./ProdMinMax";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  loader: {
    marginLeft: "40%",
    marginTop: "25%",
  },
  displayNone: {
    display: "none",
  },
}));

const listOptions = [
  {
    name: "Cumulative  -  Oil",
    filterName: "filterCumulativeOil",
    id: "cumulativeOil",
    display: false,
  },
  {
    name: "Cumulative  -  Gas",
    filterName: "filterCumulativeGas",
    id: "cumulativeGas",
    display: false,
  },
  {
    name: "Cumulative  -  Water",
    filterName: "filterCumulativeWater",
    id: "cumulativeWater",
    display: false,
  },
  {
    name: "First Month  -  Oil",
    filterName: "filterFirstMonthOil",
    id: "firstMonthOil",
    display: false,
  },
  {
    name: "First Month  -  Gas",
    filterName: "filterFirstMonthGas",
    id: "firstMonthGas",
    display: false,
  },
  {
    name: "First Month  -  Water",
    filterName: "filterFirstMonthWater",
    id: "firstMonthWater",
    display: false,
  },
  {
    name: "First Three Months  -  Oil",
    filterName: "filterFirstThreeMonthOil",
    id: "firstThreeMonthOil",
    display: false,
  },
  {
    name: "First Three Months  -  Gas",
    filterName: "filterFirstThreeMonthGas",
    id: "firstThreeMonthGas",
    display: false,
  },
  {
    name: "First Three Months  -  Water",
    filterName: "filterFirstThreeMonthWater",
    id: "firstThreeMonthWater",
    display: false,
  },
  {
    name: "First Six Months  -  Oil",
    filterName: "filterFirstSixMonthOil",
    id: "firstSixMonthOil",
    display: false,
  },
  {
    name: "First Six Months  -  Gas",
    filterName: "filterFirstSixMonthGas",
    id: "firstSixMonthGas",
    display: false,
  },
  {
    name: "First Six Months  -  Water",
    filterName: "filterFirstSixMonthWater",
    id: "firstSixMonthWater",
    display: false,
  },
  {
    name: "First Twelve Months  -  Oil",
    filterName: "filterFirstTwelveMonthOil",
    id: "firstTwelveMonthOil",
    display: false,
  },
  {
    name: "First Twelve Months  -  Gas",
    filterName: "filterFirstTwelveMonthGas",
    id: "firstTwelveMonthGas",
    display: false,
  },
  {
    name: "First Twelve Months  -  Water",
    filterName: "filterFirstTwelveMonthWater",
    id: "firstTwelveMonthWater",
    display: false,
  },
  {
    name: "Last Month  -  Oil",
    filterName: "filterLastMonthOil",
    id: "lastMonthOil",
    display: false,
  },
  {
    name: "Last Month  -  Gas",
    filterName: "filterLastMonthGas",
    id: "lastMonthGas",
    display: false,
  },
  {
    name: "Last Month  -  Water",
    filterName: "filterLastMonthWater",
    id: "lastMonthWater",
    display: false,
  },
  {
    name: "Last Six Months  -  Oil",
    filterName: "filterLastSixMonthOil",
    id: "lastSixMonthOil",
    display: false,
  },
  {
    name: "Last Six Months  -  Gas",
    filterName: "filterLastSixMonthGas",
    id: "lastSixMonthGas",
    display: false,
  },
  {
    name: "Last Six Months  -  Water",
    filterName: "filterLastSixMonthWater",
    id: "lastSixMonthWater",
    display: false,
  },
  {
    name: "Last Twelve Months  -  Oil",
    filterName: "filterLastTwelveMonthOil",
    id: "lastTwelveMonthOil",
    display: false,
  },
  {
    name: "Last Twelve Months  -  Gas",
    filterName: "filterLastTwelveMonthGas",
    id: "lastTwelveMonthGas",
    display: false,
  },
  {
    name: "Last Twelve Months  -  Water",
    filterName: "filterLastTwelveMonthWater",
    id: "lastTwelveMonthWater",
    display: false,
  },
];

export default function FilterFormProduction() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [prodOptions, setProdOptions] = useState(
    stateNav.prodOptions ? stateNav.prodOptions : null
  );
  const [list, setList] = useState([]);
  const [optionsCopy, setOptionsCopy] = useState(null);

  useEffect(() => {
    if (!optionsCopy) {
      const listOptionsCopy = [...listOptions];
      setOptionsCopy(listOptionsCopy);
    }
  }, [optionsCopy]);

  const handleSelectedValueToDisplay = (value) => {
    setProdOptions(value);
    setStateNav((stateNav) => ({
      ...stateNav,
      prodOptions: value,
    }));
  };

  useEffect(() => {
    if (stateNav.prodOptions && optionsCopy) {
      const check = optionsCopy.map((val) => val);

      const removeFilters = check.filter(
        (name) => !stateNav.prodOptions.includes(name.name)
      );

      removeFilters.forEach((element) => {
        setStateNav((stateNav) => ({
          ...stateNav,
          [element.filterName]: null,
        }));
      });
    }
  }, [optionsCopy, setStateNav, stateNav.prodOptions]);

  useEffect(() => {
    if (optionsCopy) {
      let compare = [];
      let optionUpdate;
      let elementUpdate;
      // let matchName = prodOptions.map((option) => option);
      let matchName = [...prodOptions];
      matchName.forEach((element) => {
        compare.push(element);
      });

      const check = optionsCopy.filter((name) => compare.includes(name.name));
      optionsCopy.forEach((element, index) => {
        check.forEach((option) => {
          if (element.name === option.name) {
            optionUpdate = option.name;
            elementUpdate = option.name;
          }
        });
      });
      if (optionUpdate && elementUpdate) {
        const updateState = optionsCopy.map((item) =>
          compare.includes(item.name) ? { ...item, display: true } : item
        );
        setList(updateState);
      } else {
        const updateState = optionsCopy.map((item) =>
          compare.includes(!item.name) ? { ...item, display: false } : item
        );
        setList(updateState);
      }
    }
  }, [optionsCopy, prodOptions, stateNav.prodOptions]);

  const renderFMW = list
    .filter((item) => item.display === true)
    .map((item) => (
      <Grid item sm={12}>
        <ProdMinMax
          key={item.name}
          id={item.id}
          name={item.name}
          filter={item.filterName}
        />
      </Grid>
    ));

  return (
    <Grid
      container
      item
      spacing={2}
      style={{ padding: "8px", width: "100%", margin: "0" }}
    >
      <Grid item sm={12}>
        <Autocomplete
          ChipProps={{ color: "secondary" }}
          multiple
          options={listOptions.map((option) => option.name)}
          disableListWrap
          defaultValue={stateNav.prodOptions}
          onChange={(event, value) => handleSelectedValueToDisplay(value)}
          renderInput={(params) => (
            <TextField
              // className={classes.autoComplete}
              {...params}
              variant="outlined"
              label="Production Filters"
              fullWidth={true}
            />
          )}
        />
      </Grid>

      {renderFMW}
    </Grid>
  );
}
