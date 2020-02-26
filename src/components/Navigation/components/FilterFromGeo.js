import React, {useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavigationContext } from "../NavigationContext";
import FilterStateName from "./FilterStateName";
import FilterCountyName from "./FilterCountyName";
import FilterSurvey from "./FilterSurvey";
import FilterAbstract from "./FilterAbstract";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around"
  }
}));

export default function FilterFormGeo() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  

  useEffect(() => {
    let state;
    let county;
    let survey;
    let abstract;
    let filter;
    if (stateNav.stateName !== null) {
      state = stateNav.stateName;
    }
    if (stateNav.countyName !== null) {
      county = stateNav.countyName;
    }
    if (stateNav.surveyName !== null) {
      survey = stateNav.surveyName;
    }
    if (stateNav.abstractName !== null) {
      abstract = stateNav.abstractName;
    }

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
    <div className={classes.root}>
      <FilterStateName />
      <FilterCountyName />
      <FilterSurvey />
      <FilterAbstract />
    </div>
  );
}
