import React, { useContext, useEffect, useState } from "react";
import { NavigationContext } from "../NavigationContext";
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 548,
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
  // const [stateNav, setStateNav] = useContext(NavigationContext)
  const [saveSearch, setSaveSearch] = useState("");
  const [filterList, setFilterList] = useState(null);
  const [filters, setFilters] = useState(null);
  const [dateCreated, setDateCreated] = useState(new Date());
  const [saveOrUpdtae, setSaveOrUpdate] = useState("");
  const [savedCompleted, setSavedCompleted] =useState(false);
  const [completedSaving, setCompletedSaving] = useState(false)
  const classes = useStyles();

  useEffect(() => {
    if (props.filters) {
        setFilters(props.filters)
    }
  },[props.filters])
  
  const handleFilterName = (e) => {
      setSaveSearch(e.target.value)
  }

  const save = () => {
    let filterInfo = {
      name: saveSearch,
      user: props.user,
      created: dateCreated.toDateString(),
      filters: filters,
      on: false,
      default: false,
    }

    setCompletedSaving(true)
    
  }

  useEffect(() => {
    if (completedSaving) {
      setSavedCompleted(true)
    }
  },[completedSaving])

  return (
    <Paper className={classes.paper}>
      <IconButton
        color="secondary"
        onClick={props.close}
        className={classes.close}
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
        required
      />
      <div className={classes.label}>Update Existing Search</div>
      <Autocomplete
        className={classes.input}
        // defaultValue={stateNav.profileName}
        // onChange={(event, newValue) => {
        //     handleProfileChange(newValue);
        // }}
        // options={profileList}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Saved Filters"
            placeholder=""
            fullWidth={true}
          />
        )}
        disableListWrap
        id="virtualize-well-profiles"
        // style={{ maxWidth: 300, minWidth: 120 }}
      />
      <Divider />
      {!savedCompleted && completedSaving ? 
       <CircularProgress color="secondary" size={40} className={classes.loader} />
      : null}
      {savedCompleted && savedCompleted ? <div className={classes.savedMessage}>{saveSearch} {" "} Have Been Saved</div> : null}
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
