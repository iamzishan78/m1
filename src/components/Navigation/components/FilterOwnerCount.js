import React, { useState, useContext, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import NumberFormat from "react-number-format";
import Switch from '@material-ui/core/Switch';
import { NavigationContext } from "../NavigationContext";

const useStyles = makeStyles({
  input: {
    margin: 20,
    maxWidth: 168,
    minWidth: 167
  },
  inputLabel: {
    color: "black",
    minWidth: 249,
    maxWidth: 250,
    marginLeft: 20
  },
  noOwners: {
    padding: "6px 0px",
    display: "flex",
  },
  noOwnersToggle:{
    marginLeft: 20,
  }
});

export default function FilterOwnerCount() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [valueMinDisplay, setValueMinDisplay] = useState("");
  const [valueMaxDisplay, setValueMaxDisplay] = useState("");
  const [noOwners , setNoOwners] = useState(false);
  const [ownerCountWell, setOwnerCountWell] = useState(
    stateNav.ownerCountWell ? stateNav.ownerCountWell : []
  );

  const setFilter = useCallback(() => {
    let filter;
    let min = parseInt(valueMinDisplay);
    let max = parseInt(valueMaxDisplay);
    if (!min && !max) {
      filter = null;
    }
    if (!min && max) {
      filter = ["all", ["<=", ["get", "ownerCount"], max]];
      console.log("add filter", filter);
    } else if (min && !max) {
      filter = ["all", [">=", ["get", "ownerCount"], min]];
      console.log("add filter", filter);
    } else if (min && max) {
        filter = [
          "all",
          [">=", ["get", "ownerCount"], min],
          ["<=", ["get", "ownerCount"], max]
        ];
        console.log("add filter", filter);
    } 
    else {
      filter = null;
    }

    setStateNav(stateNav => ({
      ...stateNav,
      filterOwnerCount: filter
    }));
  }, [setStateNav, valueMaxDisplay, valueMinDisplay]);

  useEffect(() => {
    const recall = () => {
      let checkStateNav = stateNav.filterOwnerCount;
      if (!valueMinDisplay && !valueMaxDisplay) {
        if (checkStateNav && checkStateNav.length === 3) {
          const recallMin = checkStateNav[1][2];
          const recallMax = checkStateNav[2][2];
          setValueMinDisplay(recallMin);
          setValueMaxDisplay(recallMax);
        }
      }
      if (!valueMaxDisplay) {
        if (checkStateNav && checkStateNav[1][0] === "<=") {
          const recallMax = checkStateNav[1][2];
          setValueMaxDisplay(recallMax);
        }
      }
      if (!valueMinDisplay) {
        if (checkStateNav && checkStateNav[1][0] === ">=") {
          const recallMin = checkStateNav[1][2];
          setValueMinDisplay(recallMin);
        }
      }
    };
    recall();
    return () => {
      recall();
    };
  }, [stateNav, valueMaxDisplay, valueMinDisplay]);

  useEffect(() => {
    if (stateNav.ownerCountWell) {
      setFilter();
    }
  }, [setFilter, stateNav.ownerCountWell]);

  const handleChangeMin = event => {
    setValueMinDisplay(event.target.value.replace(/,/g, ""));
    setOwnerCountWell(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, ownerCountWell: event.target.id }));
    if (event.target.value === "") {
      setStateNav(stateNav => ({
        ...stateNav,
        filterOwnerCount: null
      }));
    }
  };

  const handleChangeMax = event => {
    setValueMaxDisplay(event.target.value.replace(/,/g, ""));
    setOwnerCountWell(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, ownerCountWell: event.target.id }));
    if (event.target.value === "") {
      setStateNav(stateNav => ({
        ...stateNav,
        filterOwnerCount: null
      }));
    }
  };

  const allowNumbersOnly = e => {
    let code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  };

  const toggleNoOwners = () => {
    setNoOwners(noOwners => !noOwners)
  } 
  
  useEffect(() => {
    let filter;
    if (noOwners) {
      filter = ["any",["==",[ "get", "hasOwner"], false]] 
    } else {
      filter = null;
    }
    setStateNav(stateNav => ({
      ...stateNav,
      filterNoOwnerCount: filter
    }));
  },[noOwners, setStateNav])

  useEffect(() => {
    if (stateNav.filterNoOwnerCount && stateNav.filterNoOwnerCount.length > 1) {
      setNoOwners(true)
    }
  },[stateNav.filterNoOwnerCount])
  
  return (
    <div>
      <Typography
        className={classes.inputLabel}
        htmlFor="select-multiple-chip1"
      >
          Owner Count
      </Typography>
      <NumberFormat
        id="OwnerCountMin"
        value={valueMinDisplay}
        onChange={handleChangeMin}
        thousandSeparator={true}
        customInput={TextField}
        className={classes.input}
        aria-labelledby="range-number"
        type="text"
        label="Min"
        variant="outlined"
        onKeyPress={e => allowNumbersOnly(e)}
        InputProps={{
          inputProps: {
            min: 0,
            max: Number.MAX_SAFE_INTEGER - 1,
          }
        }}
      />
      <NumberFormat
        id="OwnerCountMax"
        value={valueMaxDisplay}
        onChange={handleChangeMax}
        thousandSeparator={true}
        customInput={TextField}
        className={classes.input}
        aria-labelledby="range-number"
        type="text"
        label="Max"
        variant="outlined"
        onKeyPress={e => allowNumbersOnly(e)}
        InputProps={{
          inputProps: {
            min: 0,
            max: Number.MAX_SAFE_INTEGER,
          }
        }}
      />
      <div className={classes.noOwners}>
        <Typography
          className={classes.inputLabel}
          htmlFor="select-multiple-chip1"
        >
          Wells With No Owners
        </Typography>
        <Switch
          className={classes.noOwnersToggle}
          checked={noOwners}
          onChange={toggleNoOwners}
          color="primary"
          name="checked"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </div>
    </div>
  );
}
