import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ExpiredStorage from "expired-storage";
import useQueryProdHistory from "../../../graphQL/useQueryProdRange";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../../AppContext.js";
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
  const [appState, setAppState] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext)
  const [token, setToken] = (null)
  const [queryProdRange, { loading, data }] = useQueryProdHistory(appState.user.authToken);
  const [prodOptions, setProdOptions] = useState(
    stateNav.prodOptions ? stateNav.prodOptions : null
  )
  const [max, setMax] = useState();
  const [dataLoading, setDataLoading] = useState(false);
  const [fmw, setFmw] = useState(false);

  const handleLogout = useCallback(() => {
    window.sessionStorage.removeItem("user");
    const expiredStorage = new ExpiredStorage();
    expiredStorage.clear();
    setAppState(state => ({ ...state, user: null }));
  }, [setAppState]);

  useEffect(() => {
    if (appState.user) {
      let authToken = appState.user.authToken;
      setToken(authToken)
    }
  },[appState.user])
  

  useEffect(() => {
    if (token == null) {
      handleLogout();
    } else {
      queryProdRange();
      if (!loading) {
        if (data) {
          let ranges = data.wellsRanges;
          if (ranges == null) {
            handleLogout();
            console.log("log user out");
          } else {
            setMax(ranges);
            setDataLoading(true);
          }
        }
      }
    }
  }, [data, handleLogout, loading, queryProdRange, token]);

  const handleSelectedValueToDisplay = (value) => {
    setProdOptions(value)
    setStateNav(stateNav => ({
      ...stateNav,
      prodOptions: value
    }));
  };

  console.log(prodOptions, max);

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

  const renderFMW = fmw && max ? (
    <FirstMonthWater max={max.firstMonthProdWater} />
  ) : (
    <div className={classes.displayNone}></div>
  );

  return dataLoading ? (
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
  ) : (
    <CircularProgress color="secondary" className={classes.loader} size={75} />
  );
}
