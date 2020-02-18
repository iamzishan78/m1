import React, { useState, useContext, useEffect, useCallback} from "react";
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
    justifyContent: "space-around",
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
  const [filterReady, setFilterReady] = useState(false);
  const [displayFilters, setDisplayFilters] = useState(
    stateNav.displayFilters ? stateNav.displayFilters: []
  )
  // const [resetValues, setResetValues] = useState({
  //   state: 0, county: 1 , survey: 2, abstract: 3
  // });
  
  const addFilter = () => {
    setFilterReady(true);
    // setResetValues({
    //   state: 0, county: 1 , survey: 2, abstract: 3
    // })
    if (displayFilters.length > 0) {
      setStateNav(stateNav => ({ ...stateNav, displayFilters: displayFilters}));
    }
  };

  useEffect(()=> {
    const checkStateName =  stateNav.stateName  ? stateNav.stateName : "" ;
    const checkCountyName =  stateNav.countyName ? stateNav.countyName : "" ;
    const checkSurveyName =  stateNav.surveyName ? stateNav.surveyName : "" ;
    const checkAbstractName =  stateNav.abstractName ? stateNav.abstractName : "";
    let filterValues = [];
    filterValues.push(checkStateName + " " +  checkCountyName + " " + checkSurveyName + " " + checkAbstractName);
    setDisplayFilters(filterValues)
  },[stateNav.abstractName, stateNav.countyName, stateNav.stateName, stateNav.surveyName])

  // const resetFilter = () => {
  //   setFilterReady(false);
  //   setResetValues({
  //     state: 4, county: 5 , survey: 6, abstract: 7
  //   })
  //   setStateNav(stateNav => ({ ...stateNav, stateName: null, countyName: null, surveyName: null, abstractName: null, displayStateName: null}));
  // };

  const filters = () => {
    if(stateNav.displayFilters !== null){
      return (
        stateNav.displayFilters.map((list, i) => 
              <Chip
                key={i}
                value={displayFilters}
                // onDelete={resetFilter}
                label={list}
                className={classes.chip}
               />
            )
      )
    } else {
      return <div>Choose A Filter</div>
    }
  }
 
  useEffect(() => {
    if (filterReady) {
      const runFilter = () => {
        let states = [];
        // stateNav.stateName.forEach(state => {
        //   if (stateNav.stateName) {
              states.push(stateNav.stateName)
        //   }
          console.log(states)
        // });
        let stateFilter;
        let countyFilter; 
        let surveyFilter; 
        let abstractFilter;
        
        if (filterReady) {
          if (stateNav.stateName !== null ) {
            
            stateFilter = ["match", ["get", "state"], stateNav.stateName, true, false];
          }
          if (stateNav.countyName !== null ) {
            countyFilter = ["match", ["get", "county"], stateNav.countyName.toString(), true, false];
          }
          if (stateNav.surveyName !== null ) {
            surveyFilter = ["match", ["get", "survey"], stateNav.surveyName.toString(), true, false];
          }
          if (stateNav.abstractName !== null ) {
            abstractFilter = ["match", ["get", "abstract"], stateNav.abstractName.toString(), true, false];
          } 
        } else {
          stateFilter = null;
          countyFilter = null;
          surveyFilter = null;
          abstractFilter = null;
        }
        setStateNav(stateNav => ({ ...stateNav,   filterGeographyState: stateFilter, filterGeographyCounty: countyFilter, filterGeographySurvey: surveyFilter, filterGeographyAbstract: abstractFilter}));
        console.log("GeoFilter change filter", stateFilter, countyFilter, surveyFilter, abstractFilter);
      }
      runFilter()
    }
  },[filterReady, setStateNav, stateNav.abstractName, stateNav.countyName, stateNav.stateName, stateNav.surveyName])

  return (
    <div className={classes.row}>
      <div className={classes.root}>
        <FilterStateName key="hello"/>
        <FilterCountyName  key="hi"/>
        <FilterSurvey  key="hola"/>
        <FilterAbstract key="du" />
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
        <Typography component="div" className={classes.title}>
          {/* Filter: {filters()} */}
        </Typography>
      </div>
    </div>
  );
}
