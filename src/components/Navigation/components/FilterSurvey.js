import React, { useState, useContext, useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
import useQuerySurveyByCounty from "../../../graphQL/useQuerySurveyByCounty";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: "15px",
    minWidth: 319,
    maxWidth: 320,
    color: "black"
  },
}));

export default function FilterSurvey({keys}) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const [surveyName, handleSurveyNameChange] = useState(
    stateNav.surveyName ? stateNav.surveyName : []
  );
  const [surveyList, setSurveyList] = useState();
  const [querySurveys, {loading, data }] = useQuerySurveyByCounty(
    stateNav.countyName
  );
  
  useEffect(() => {
    if (stateNav.countyName != null && stateNav.countyName.length > 0) {
      querySurveys();
      if(!loading){
        console.log(data)
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
      } else{
        //handle errors
      }
    }
  }, [data, loading, querySurveys, stateNav.countyName]);
  
  useEffect(()=> {
    if( surveyName != null && surveyName.length > 0){
      setStateNav(stateNav => ({ ...stateNav, surveyName: surveyName}));
    }
  },[setStateNav, surveyName]) 

  return (
      <FormControl variant="outlined" className={classes.formControl}>
        <Autocomplete
              className={classes.maxWidth}
              options={surveyList}
              key={keys}
              getOptionLabel={option => option}
              autoComplete
              autoSelect
              disableClearable
              disableListWrap
              includeInputInList
              onChange={(event, newValue) => {
                handleSurveyNameChange(newValue);
              }}
              renderInput={params => (
                <form autoComplete="off">
                <TextField {...params} fullWidth label="Survey" variant="outlined"  />
                </form>
              )}
              renderOption= {option =>
                
                <Typography>{option}</Typography>
              }
            />
      </FormControl>
  );
}
