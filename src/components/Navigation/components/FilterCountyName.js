import React, { useState, useContext, useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from '@material-ui/core/CircularProgress';
import { NavigationContext } from "../NavigationContext";
import useQueryCountiesByState from "../../../graphQL/useQueryCountiesByState";

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
}));

export default function FilterCountyName() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const [countyName, setCountyName] = useState(
    stateNav.countyName ? stateNav.countyName : []
  );
  const [countyList, setCountyList] = useState();
  const [queryCounties, {loading, data }] = useQueryCountiesByState(stateNav.stateName);

  useEffect(() => {
    // this check is only here beacuse Texas is the only State we have Counties for
    if (stateNav.stateName == null){
      setCountyList([])
    } else {
      if ( stateNav.stateName === "TX") {
        queryCounties();
      if (!loading) {
        const counties =
          data && data.counties
            ? data.counties
            : [];
           counties.filter(county => {
            const list = [];
            for (let index = 0; index < counties.length; index++) {
              const element = counties[index];
              list.push(element.county);
            }
            setCountyList(list);
            }) 
      }
    } 
  }
    
  }, [data, loading, queryCounties, stateNav.stateName]);

  useEffect(()=> {
    if(countyName !== null && countyName.length > 0){
      setStateNav(stateNav => ({ ...stateNav, countyName: countyName}));
    } 
  },[countyName, setStateNav, stateNav.countyName]) 
  
  const handleCountyNameChange = (event, e) => {
    if (e == null) {
      setCountyName(null)
      setStateNav(stateNav => ({ ...stateNav, countyName: null, surveyName: null, abstractName: null , filterGeography: null}));
    } else {
      setCountyName(e)
      setStateNav(stateNav => ({ ...stateNav, countyName: e}));
    }
  }

  const onEnterKey = (event) =>{   
    if(event.keyCode === 13){
      event.preventDefault();
    }
  }

  return (
      <FormControl variant="outlined" className={classes.formControl}>
          {loading ? 
          <CircularProgress color="secondary" className={classes.loader} size={28}  />
          :
          <Autocomplete
                  className={classes.maxWidth}
                  options={countyList}
                  getOptionLabel={option => option}
                  autoComplete
                  autoSelect
                  disableListWrap
                  includeInputInList
                  value={countyName}
                  fullWidth={true}
                  onChange={(event, newValue) => {
                    handleCountyNameChange( event,newValue);
                  }}
                  onKeyDown={event  => onEnterKey(event)}
                  renderInput={params => (
                    <form autoComplete="off">
                    <TextField {...params} fullWidth label="County" variant="outlined"  />
                    </form>
                  )}
                  renderOption= {option =>
                    
                    <Typography>{option}</Typography>
                  }
                /> }
                
          </FormControl>
  )
}
