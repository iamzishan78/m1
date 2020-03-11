import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { NavigationContext } from "../NavigationContext";
import useQueryAbstractBySurvey from "../../../graphQL/useQueryAbstractBySurvey";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: "15px",
    minWidth: 249,
    // maxWidth: 250,
    color: "black"
  },
  loader: {
    marginLeft: "40%"
  },
  displayNone: {
    display: "none"
  }
}));

export default function FilterAbstract({ keys }) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [checkForStateProps, setCheckForStateProps] = useState(false);
  const [abstractName, setAbstractName] = useState(
    stateNav.abstractName ? stateNav.abstractName : []
  );
  const [abstractList, setAbstractList] = useState();
  const [queryAbstract, { loading, data }] = useQueryAbstractBySurvey(
    stateNav.surveyName
  );

  useEffect(() => {
    if (stateNav.stateName && stateNav.stateName.length > 0) {
      const listOfStatesWithProps = ["TX", "NM"];
      const check = listOfStatesWithProps.includes(stateNav.stateName);
      if (check) {
        setCheckForStateProps(true);
      } else {
        setCheckForStateProps(false);
      }
    } else {
      setCheckForStateProps(false)
    }
  }, [setCheckForStateProps, stateNav.stateName]);

  useEffect(() => {
    if (stateNav.surveyName == null) {
      setAbstractList([]);
    } else {
      if (stateNav.surveyName !== null && stateNav.surveyName.length > 0) {
        queryAbstract();
        if (!loading) {
          const abstract = data && data.abstracts ? data.abstracts : [];
          abstract.map(abstract => {
            const list = [];
            list.push(abstract.abstract);
            setAbstractList(list);
          });
        } else {
          //handle errors
        }
      }
    }
  }, [data, loading, queryAbstract, stateNav.surveyName]);

  useEffect(() => {
    if( abstractName != null && abstractName.length > 0){
      setStateNav(stateNav => ({ ...stateNav, abstractName: abstractName}));
    } 
  }, [abstractName, setStateNav]);
  
  const handleAbstractNameChange = (event, e) => {
    if (e == null) {
      setAbstractName(null)
      setStateNav(stateNav => ({ ...stateNav, asbtractName: null, surveyName: null, filterGeography: null}));
    } else {
      setAbstractName(e)
      setStateNav(stateNav => ({ ...stateNav, asbtractName: e}));
    }
  }

  const onEnterKey = (event) =>{   
    if(event.keyCode === 13){
      event.preventDefault();
    }
  }

  return checkForStateProps ? (
    <FormControl variant="outlined" className={classes.formControl}>
      {loading ? (
        <CircularProgress
          color="secondary"
          className={classes.loader}
          size={28}
        />
      ) : (
        <Autocomplete
          className={classes.maxWidth}
          options={abstractList}
          getOptionLabel={option => option}
          autoComplete
          autoSelect
          disableListWrap
          includeInputInList
          fullWidth={true}
          value={abstractName}
          onChange={(event, newValue) => {
            handleAbstractNameChange(event,newValue);
          }}
          onKeyDown={event  => onEnterKey(event)}
          renderInput={params => (
            <form autoComplete="off">
              <TextField
                {...params}
                fullWidth
                label="Abstract"
                variant="outlined"
              />
            </form>
          )}
          renderOption={option => <Typography>{option}</Typography>}
        />
      )}
    </FormControl>
  ) : (
    <div className={classes.displayNone}></div>
  );
}
