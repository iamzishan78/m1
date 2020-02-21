import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Divider from '@material-ui/core/Divider';
import { NavigationContext } from "../NavigationContext";
import FilterStateName from "./FilterStateName";
import FilterCountyName from "./FilterCountyName";
import FilterSurvey from "./FilterSurvey";
import FilterAbstract from "./FilterAbstract";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    // maxWidth: 220,
    // minWidth: 200,
  },
  rootExtra: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "space-around"
    // maxWidth: 220,
    // minWidth: 200
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row"
  },
  datesRow: {
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "column",
    flex: "1",
    flexGrow: 2,
    maxWidth: 200,
    minWidth: 220
  },
  chip: {
    margin: 2
  },
  filterButton: {
    marginBottom: 15,
    display: "flex",
    justifyContent: "center"
  }
}));

export default function FilterFormGeo() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  // const resetFilter = () => {
  //   setStateNav(stateNav => ({
  //     ...stateNav,
  //     filterGeographyState: null,
  //     filterGeographyCounty: null,
  //     filterGeographySurvey: null,
  //     filterGeographyAbstract: null,
  //     statesInFilter: null,
  //     countyInFilter: null,
  //     surveyInFilter: null,
  //     abstractInFilter: null
  //   }));
  //   setDisplayVals([]);
  // };

  useEffect(() => {
    let state;
    let county;
    let survey;
    let abstract;
    let filter;

    if (stateNav.stateName && stateNav.stateName.length > 0) {
      if (stateNav.stateName !== null) {
        state = stateNav.stateName;
      }
      if (stateNav.countyName !== null) {
        county = stateNav.countyName.toString();
      }
      if (stateNav.surveyName !== null) {
        survey = stateNav.surveyName.toString();
      }
      if (stateNav.abstractName !== null) {
        abstract = stateNav.abstractName.toString();
      }
    }
    console.log(state, county, survey, abstract);
    if (state !== undefined) {
      filter = ["all", ["in", "state", state]];
    }
    if (county !== undefined) {
      filter = ["all", ["in", "state", state], ["in", "county", county]];
    }
    if (survey !== undefined) {
      filter = [
        "all",
        ["in", "state", state],
        ["in", "county", county],
        ["in", "survey", survey]
      ];
    }
    if (abstract !== undefined) {
      filter = [
        "all",
        ["in", "state", state],
        ["in", "county", county],
        ["in", "survey", survey],
        ["in", "abstract", abstract]
      ];
    }

    if (filter) {
      console.log("GeoFilter change filter", filter);
      setStateNav(stateNav => ({
        ...stateNav,
        filterGeography: filter
      }));
    } else {
      filter = null;
    }
  }, [
    setStateNav,
    stateNav.abstractName,
    stateNav.countyName,
    stateNav.stateName,
    stateNav.surveyName
  ]);

  return (
    <div className={classes.row}>
      <div className={classes.root}>
          <FilterStateName />
          <FilterCountyName />
      </div>
      <Divider />
      <div className={classes.rootExtras}>
        <FilterSurvey />
        <FilterAbstract />
      </div>
    </div>
  );
}
