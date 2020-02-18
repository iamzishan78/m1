import React, { useState, useContext, useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from '@material-ui/core/CircularProgress';
import { NavigationContext } from "../NavigationContext";
import useQueryAbstractBySurvey from "../../../graphQL/useQueryAbstractBySurvey";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: "15px",
    minWidth: 319,
    maxWidth: 320,
    color: "black"
  },
  loader: {
    marginLeft: "40%",
  },
}));

export default function FilterAbstract({keys}) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const [abstractName, handleAbstractNameChange] = useState(
    stateNav.abstractName ? stateNav.abstractName : []
  );
  const [abstractList, setAbstractList] = useState();
  const [queryAbstract, {loading, data }] = useQueryAbstractBySurvey(
    stateNav.surveyName
  );
  
  useEffect(() => {
    if (stateNav.surveyName != null && stateNav.surveyName.length > 0) {
      queryAbstract();
      if(!loading){
        const abstract =
          data && data.abstracts
            ? data.abstracts
            : [];
            abstract.map(abstract => {
              const list = [];
              list.push(abstract.abstract)
              setAbstractList(list)
              })
      } else{
        //handle errors
      }
    }
  }, [data, loading, queryAbstract, stateNav.surveyName]);
  
  useEffect(()=> {
    if(abstractName.length > 0){
      setStateNav(stateNav => ({ ...stateNav, abstractName: abstractName}));
    }
  },[abstractName, setStateNav]) 
 
  return (
    <FormControl variant="outlined" className={classes.formControl}>
    {loading ? 
      <CircularProgress color="secondary" className={classes.loader} size={28}  />
      :
    <Autocomplete
          className={classes.maxWidth}
          options={abstractList}
          getOptionLabel={option => option}
          autoComplete
          autoSelect
          disableClearable
          disableListWrap
          includeInputInList
          onChange={(event, newValue) => {
            handleAbstractNameChange(newValue);
          }}
          renderInput={params => (
            <form autoComplete="off">
            <TextField {...params} fullWidth label="Abstract" variant="outlined"  />
            </form>
          )}
          renderOption= {option =>
            
            <Typography>{option}</Typography>
          }
        />}
  </FormControl>
  );
}
