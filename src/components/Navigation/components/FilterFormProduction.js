import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
import FirstMonthWater from "./FilterProdComponents/FirstMonthWater";

const prodListOptions = [{ name: "First Month Water" }];

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 650,
    minWidth: 630,
    height: "100%"
  },
  autoComplete: {
    width: "95%",
    margin: 20
  },
  loader: {
    marginLeft: "40%",
    marginTop: "25%"
  },
  displayNone: {
    display: "none"
  }
}));

export default function FilterFormProduction() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext)
  const [prodOptions, setProdOptions] = useState(
    stateNav.prodOptions ? stateNav.prodOptions : null
  )

  const [fmw, setFmw] = useState(false);

  const handleSelectedValueToDisplay = (value) => {
    setProdOptions(value)
    setStateNav(stateNav => ({
      ...stateNav,
      prodOptions: value
    }));
  };

 
  useEffect(() => {
    if (prodOptions) {
      let matchName = prodOptions.map(option => option);
      console.log(matchName);
      if (matchName && matchName.length === 0) {
        setFmw(false);
        setStateNav(stateNav => ({
          ...stateNav,
          filterFirstMonthWater: null
        }));
      }
      matchName.forEach(element => {
        if (element === "First Month Water") {
          setFmw(true);
        }
      });
    }
  }, [prodOptions, setStateNav]);

  const renderFMW = fmw ? (
    <FirstMonthWater />
  ) : (
    <div className={classes.displayNone}></div>
  );

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        options={prodListOptions.map(option => option.name)}
        disableListWrap
        defaultValue={stateNav.prodOptions}
        onChange={(event, value) => handleSelectedValueToDisplay(value)}
        renderInput={params => (
          <TextField
            className={classes.autoComplete}
            {...params}
            variant="outlined"
            label="Production Filters"
            fullWidth={true}
          />
        )}
      />
      {renderFMW}
    </div>
  ) 
}
