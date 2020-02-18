import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { NavigationContext } from "../NavigationContext";
import FilterStateName from "./FilterStateName";
import FilterCountyName from "./FilterCountyName";
import FilterSurvey from "./FilterSurvey";
import FilterAbstract from "./FilterAbstract";
// import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  root: {
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
  const [filterRecall, setFilterRecall] = useState([]);
  const [statesInFilter, setStatesInFilter] = useState(
    stateNav.statesInFilter ? stateNav.statesInFilter : []
  );
  const [countyInFilter, setCountyInFilter] = useState(
    stateNav.countyInFilter ? stateNav.countyInFilter : []
  );
  const [surveyInFilter, setSurveyInFilter] = useState(
    stateNav.surveyInFilter ? stateNav.surveyInFilter : []
  );
  const [abstractInFilter, setAbstractInFilter] = useState(
    stateNav.abstractInFilter ? stateNav.abstractInFilter : []
  );
  const [displayVals, setDisplayVals] = useState([]);
  const [resetValueState, setResetValueState] = useState(false);
  const [resetValueCounty, setResetValueCounty] = useState(false);
  const [resetValueSurvey, setResetValueSurvey] = useState(false);
  const [resetValueAbstract, setResetValueAbstract] = useState(false);

  // const resetFilterState = () => {
  //   if (stateNav.stateName && stateNav.stateName.length > 0) {
  //     setResetValueState(!resetValueState)
  //   }
  // };

  // const resetFilterCounty = () => {
  //   if (stateNav.countyName && stateNav.countyName.length > 0) {
  //     setResetValueCounty(!resetValueCounty)
  //   }
  // };

  // const resetFilterSurvey = () => {
  //   if (stateNav.surveyName && stateNav.surveyName.length > 0) {
  //     setResetValueSurvey(!resetValueSurvey)
  //   }
  // };

  // const resetFilterAbstract = () => {
  //   if (stateNav.abstractName && stateNav.abstractName.length > 0) {
  //     setResetValueAbstract(!resetValueAbstract)
  //   }
  // };

  const resetFilter = () => {
    setStateNav(stateNav => ({
      ...stateNav,
      filterGeographyState: null,
      filterGeographyCounty: null,
      filterGeographySurvey: null,
      filterGeographyAbstract: null,
      statesInFilter: null,
      countyInFilter: null,
      surveyInFilter: null,
      abstractInFilter: null
    }));
    setDisplayVals([]);
  };

  const setFilterRunning = useCallback(() => {
    let stateFilter;
    let countyFilter;
    let surveyFilter;
    let abstractFilter;
    let filter;
    let filteredEl;
    let stateElFilter;
    let countyElFilter;
    let surveyElFilter;
    let abstractElFilter;
    if (filterRecall && filterRecall.length > 0) {
      if (filterRecall[0].length > 0) {
        filterRecall.forEach((element, i) => {
          element = filterRecall[i];
          filteredEl = element.filter(n => n);
        });
        stateElFilter = filteredEl[0];
        countyElFilter = filteredEl[1];
        surveyElFilter = filteredEl[2];
        abstractElFilter = filteredEl[3];
      }

      if (stateElFilter === undefined) {
        stateFilter = null;
      } else {
        stateFilter = ["match", ["get", "state"], stateElFilter, true, false];
      }
      if (countyElFilter === undefined) {
        countyFilter = null;
      } else {
        countyFilter = [
          "match",
          ["get", "county"],
          countyElFilter,
          true,
          false
        ];
      }
      if (surveyElFilter === undefined) {
        surveyFilter = null;
      } else {
        surveyFilter = [
          "match",
          ["get", "survey"],
          surveyElFilter,
          true,
          false
        ];
      }
      if (abstractElFilter === undefined) {
        abstractFilter = null;
      } else {
        abstractFilter = [
          "match",
          ["get", "abstract"],
          abstractElFilter,
          true,
          false
        ];
      }

      filter = [
        "all",
        ["match", ["get", "state"], stateElFilter, true, false],
        ["match", ["get", "county"], countyElFilter, true, false],
        ["match", ["get", "survey"], surveyFilter, true, false],
        ["match", ["get", "abstract"], abstractFilter, true, false],
        
      ];
    } else {
      filter = null;
    }
    console.log("GeoFilter change filter", filter);
    setStateNav(stateNav => ({
      ...stateNav,
      filterGeographyState: stateFilter,
      filterGeographyCounty: countyFilter,
      filterGeographySurvey: surveyFilter,
      filterGeographyAbstract: abstractFilter,
      statesInFilter: stateElFilter,
      countyInFilter: countyElFilter,
      surveyInFilter: surveyElFilter,
      abstractInFilter: abstractElFilter
    }));
  }, [filterRecall, setStateNav]);

  useEffect(() => {
    if (filterRecall && filterRecall.length > 0) {
      setFilterRunning();
    }
  }, [filterRecall, setFilterRunning]);

  useEffect(() => {
    const displayFilters = () => {
      let displayCheck;
      let display;
      if (filterRecall && filterRecall.length > 0) {
        displayCheck = filterRecall.filter(el => el !== undefined);
        display = [...new Set(displayCheck)];
      }
      setDisplayVals(display);
    };
    if (filterRecall && filterRecall.length > 0) {
      displayFilters();
    }
  }, [filterRecall]);

  const filters = displayVals.map(check =>
    <div>Filter: </div> ? (
      <div key={check}>
        <Chip onDelete={resetFilter} label={check} className={classes.chip} />
      </div>
    ) : (
      <div>Filter: </div>
    )
  );

  const addFilter = () => {
    let stateFilter;
    let countyFilter;
    let surveyFilter;
    let abstractFilter;
    let filter = [];
    if (stateNav.stateName && stateNav.stateName.length > 0) {
      if (stateNav.stateName !== null) {
        stateFilter = stateNav.stateName;
      }
      if (stateNav.countyName !== null) {
        countyFilter = stateNav.countyName.toString();
      }
      if (stateNav.surveyName !== null) {
        surveyFilter = stateNav.surveyName.toString();
      }
      if (stateNav.abstractName !== null) {
        abstractFilter = stateNav.abstractName.toString();
      }
    } else {
      stateFilter = null;
      countyFilter = null;
      surveyFilter = null;
      abstractFilter = null;
    }
    filter.push(stateFilter, countyFilter, surveyFilter, abstractFilter);

    setFilterRecall([...filterRecall, filter]);
  };

  return (
    <div className={classes.row}>
      <div className={classes.root}>
        <div>
          <FilterStateName />
        </div>
        <div>
          <FilterCountyName />
        </div>
        <div>
          <FilterSurvey />
        </div>
        <div>
          <FilterAbstract />
        </div>
        <div className={classes.filterButton}>
          <Button
            variant="contained"
            color="primary"
            onClick={addFilter}
            className={classes.button}
            size="large"
          >
            Add Filter
          </Button>
        </div>
      </div>
      <div className={classes.datesRow}>
        {filters}
      </div>
    </div>
  );
}
