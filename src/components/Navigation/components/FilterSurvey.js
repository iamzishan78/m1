import React, { useState, useContext, useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
import useQuerySurveyByCounty from "../../../graphQL/useQuerySurveyByCounty";
import { display } from "@material-ui/system";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: "15px",
    minWidth: 249,
    // maxWidth: 250,
    color: "black"
  },
  loader: {
    marginLeft: "40%",
  },
  displayNone: {
    display: "none"
  }
}));

export default function FilterSurvey({key}) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [checkForStateProps, setCheckForStateProps] = useState(false);
  const [surveyName, setSurveyName] = useState(
    stateNav.surveyName ? stateNav.surveyName : []
  );
  const [surveyList, setSurveyList] = useState();
  const [querySurveys, {loading, data }] = useQuerySurveyByCounty(stateNav.countyName);
  
  useEffect (() => {
    if (stateNav.stateName && stateNav.stateName.length > 0) {
      const listOfStatesWithProps = ["TX"];
      const check = listOfStatesWithProps.includes(stateNav.stateName)
      if (check) {
        setCheckForStateProps(true)
      } else{
        setCheckForStateProps(false)
      }
    } else {
      setCheckForStateProps(false)
    }
  },[setCheckForStateProps, stateNav.stateName])

  useEffect(() => {
    if (stateNav.countyName == null) {
      setSurveyList([]);
    } else {
    if (stateNav.countyName && stateNav.countyName.length > 0) {
      querySurveys();
      if(!loading){
        const surveys =
          data && data.surveys
            ? data.surveys
            : [];
          let list = [];
          surveys.forEach((value) => { 
            if (value.survey === null || value.survey === "") {
              value.survey = "n/a";
            }
              list.push(value)
          })
          let sortedList = []
          list.map(survey => 
            sortedList.push(survey.survey)
          )
          setSurveyList(sortedList)
      } 
    }
  }
  }, [data, loading, querySurveys, stateNav.countyName]);
  
  useEffect(()=> {
    if( surveyName != null && surveyName.length > 0){
      setStateNav(stateNav => ({ ...stateNav, surveyName: surveyName}));
    } 
  },[setStateNav, stateNav.surveyName, surveyName]) 

  const handleSurveyNameChange = (event, e) => {
    if (e == null) {
      setSurveyName(null)
      setStateNav(stateNav => ({ ...stateNav, countyName: null, surveyName: null, abstractName: null , filterGeography: null}));
    } else {
      setSurveyName(e)
      setStateNav(stateNav => ({ ...stateNav, surveyName: e}));
    }
  }

  const onEnterKey = (event) =>{   
    if(event.keyCode === 13){
      event.preventDefault();
    }
  }

  return (
    checkForStateProps ?
      <FormControl variant="outlined" className={classes.formControl}>
        {loading ? 
          <CircularProgress color="secondary" className={classes.loader} size={28}  />
          :
        <Autocomplete
              className={classes.maxWidth}
              options={surveyList}
              getOptionLabel={option => option}
              autoComplete
              autoSelect
              disableListWrap
              includeInputInList
              value={surveyName}
              fullWidth={true}
              onChange={(event, newValue) => {
                handleSurveyNameChange( event,newValue);
              }}
              onKeyDown={event  => onEnterKey(event)}
              renderInput={params => (
                <form autoComplete="off">
                <TextField {...params} fullWidth label="Survey" variant="outlined"  />
                </form>
              )}
              renderOption= {option =>
                
                <Typography>{option}</Typography>
              }
            />
        }
      </FormControl>
      : <div className={classes.displayNone}></div>
  );
}
