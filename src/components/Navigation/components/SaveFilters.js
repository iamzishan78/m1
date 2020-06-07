import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../AppContext";
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 350,
  },
  header: {
    padding: "10px 30px",
  },
  input: {
    width: "100%",
    padding: "10px 40px",
  },
  label: {
    padding: "15px 40px",
    fontSize: 15,
    fontWeight: 600,
  },
  buttonDiv: {
    padding: "30px 40px",
    textAlign: "center",
  },
  close: {
    float: "right",
    padding: "3px 30px",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  loader: {
    marginLeft: "45%",
    marginBottom: 8,
    marginTop: 20,
  },
  savedMessage: {
    padding: "10px 40px",
    fontWeight: 600,
    textAlign: "center",
  },
}));

export default function SaveFilters(props) {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [saveSearch, setSaveSearch] = useState("");
  const [upDateSearch, setUpdateSearch] = useState("");
  const [errorTextField, setErrorTextField] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [filterList, setFilterList] = useState(null);
  const [filters, setFilters] = useState(null);
  const [dateCreated, setDateCreated] = useState();
  const [savedCompleted, setSavedCompleted] =useState(false);
  const [completedSaving, setCompletedSaving] = useState(false)
  const classes = useStyles();
  
  useEffect(() => {
    // effect to get filters from parent and set the date
    if (props.filters) {
        setFilters(props.filters)
        setDateCreated(new Date())
    }
  },[props.filterList, props.filters])
  
  
  useEffect(() => {
    // validation and error message effect
    if ( saveSearch && saveSearch.length <= 2) {
      setErrorTextField(true);
      setErrorText("Name is to short")
    } else {
      setErrorTextField(false);
      setErrorText("")
    }
  },[saveSearch])

  const handleFilterName = (e) => {
      // set the name of the filter and make the 1st letter a capital letter
      let name = e.target.value;
      let format = name.charAt(0).toUpperCase() + name.slice(1)
      setSaveSearch(format)
  }

  const save = () => {
    // create the filter object with state and props 
    // to be saved to the db 
    let filterInfo = {
      name: saveSearch ? saveSearch : upDateSearch,
      user: props.user,
      created: dateCreated.toDateString(),
      filters: filters,
      on: true,
      default: false,
    }
    // flag to say we started the saving proccess waiting for a response
    setCompletedSaving(true)
    // response  gotten and its good

    // currently with out saving we are just alerting when updated
    // or passing it to context
    if (!saveSearch) {
      /// pass filters to context 
      // setStateApp(stateApp => ({...stateApp, filtersAdd: [filterInfo] }))
      alert(
        JSON.stringify(filterInfo)
      )
    } else {
      // set error message
      setStateApp(stateApp => ({...stateApp, filtersAdd: [filterInfo] }))
    }
  }

  useEffect(() => {
    // wait for response 
    if (completedSaving) {
      setSavedCompleted(true)
    }
  },[completedSaving])
  // onchange for filter list
  const handleChangeFilterList = newVal => {
    setUpdateSearch(newVal)
  }

  useEffect(() => {
    // set names for filter list
    if (stateApp.filters) {
      let findNames = stateApp.filters;
      let name;
      let Names = [];
      findNames.forEach(e => {
        name = e[0].name;
        Names.push(name)
      })
      setFilterList(Names);
    }
  },[stateApp.filters])

  return (
    <Paper className={classes.paper}>
      <IconButton
        color="secondary"
        onClick={props.close}
        className={classes.close}
        disableFocusRipple={true}
        disableRipple={true}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
      <h2 className={classes.header}>Save Search</h2>
      <div className={classes.label}>Name</div>
      <TextField
        className={classes.input}
        variant="outlined"
        placeholder="My Saved Search"
        inputProps={{ "aria-label": "save search" }}
        value={saveSearch}
        onChange={e => handleFilterName(e)}
        error={errorTextField}
        helperText={errorText}
        required
      />
      <div className={classes.label}>Update Existing Search</div>
      <Autocomplete
        className={classes.input}
        onChange={(event, newValue) => {
            handleChangeFilterList(newValue);
        }}
        options={filterList}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Saved Searches"
            placeholder=""
            fullWidth={true}
          />
        )}
        disableListWrap
        id="virtualize-well-profiles"
      />
      {!savedCompleted && completedSaving ? 
       <CircularProgress color="secondary" size={40} className={classes.loader} />
      : null}
      {savedCompleted && savedCompleted ? <div className={classes.savedMessage}>{saveSearch} {" "} Successfully Saved</div> : null}
      <div className={classes.buttonDiv}>
        {!completedSaving ? (
        <Button onClick={save} disabled={completedSaving} variant="contained" color="secondary">
          Save Search
        </Button>
        ):( 
        <Button onClick={props.close} variant="contained" color="secondary">
        Close
        </Button>
        )}
      </div>
    </Paper>
  );
}
