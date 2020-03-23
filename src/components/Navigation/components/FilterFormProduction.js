import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import ExpiredStorage from "expired-storage";
import useQueryProdHistory from "../../../graphQL/useQueryProdRange";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../../AppContext.js";
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
  const [queryProdRange, { loading, data }] = useQueryProdHistory(
    appState.user.authToken
  );
  const [max, setMax] = useState();
  const [dataLoading, setDataLoading] = useState(false);
  const [displayOptionName, setDisplayOptionName] = useState(null);
  const [fmw, setFmw] = useState(false);

  const handleLogout = useCallback(() => {
    window.sessionStorage.removeItem("user");
    const expiredStorage = new ExpiredStorage();
    expiredStorage.clear();
    setAppState(state => ({ ...state, user: null }));
  }, [setAppState]);

  useEffect(() => {
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
  }, [data, handleLogout, loading, max, queryProdRange]);

  const handleSelectedValueToDisplay = (event, value) => {
    setDisplayOptionName(value);
  };

  console.log(displayOptionName, max);

  useEffect(() => {
    if (displayOptionName) {
      let matchName = displayOptionName.map(option => option);
      console.log(matchName);
      if (matchName && matchName.length === 0) {
        setFmw(false);
      }
      matchName.forEach(element => {
        console.log(element);
        if (element === "First Month Water") {
          setFmw(true);
        }
      });
    }
  }, [displayOptionName]);
  console.log(fmw);
  const renderFMW = fmw ? (
    <FirstMonthWater max={max.firstMonthProdWater} removeFilter={fmw} />
  ) : (
    <div className={classes.displayNone}></div>
  );

  return dataLoading ? (
    <div className={classes.root}>
      <Autocomplete
        multiple
        options={prodListOptions.map(option => option.name)}
        filterSelectedOptions
        onChange={(event, value) => handleSelectedValueToDisplay(event, value)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={params => (
          <TextField
            className={classes.autoComplete}
            {...params}
            variant="outlined"
            label="Production Filters"
          />
        )}
      />
      {renderFMW}
    </div>
  ) : (
    <CircularProgress color="secondary" className={classes.loader} size={75} />
  );
}
