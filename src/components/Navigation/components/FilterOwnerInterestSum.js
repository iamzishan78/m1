import React, { useState, useContext, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import NumberFormat from "react-number-format";
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
});

export default function FilterOwnerCount() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [valueMinDisplay, setValueMinDisplay] = useState("");
  const [valueMaxDisplay, setValueMaxDisplay] = useState("");
  const [noOwners , setNoOwners] = useState(false);
  const [ownerWellInterestSum, setOwnerWellInterestSum] = useState(
    stateNav.ownerWellInterestSum ? stateNav.ownerWellInterestSum : []
  );


  const setFilter = useCallback(() => {
    let filter;
    let min = parseInt(valueMinDisplay);
    let max = parseInt(valueMaxDisplay);
    if (!min && !max) {
      filter = null;
    }
    if (!min && max) {
      filter = ["all", ["<=", ["get", "ownerInterestSum"], max]];
    } else if (min && !max) {
      filter = ["all", [">=", ["get", "ownerInterestSum"], min]];
    } else if (min && max) {
        filter = [
          "all",
          [">=", ["get", "ownerInterestSum"], min],
          ["<=", ["get", "ownerInterestSum"], max]
        ];
    } 
    else {
      filter = null;
    }
    console.log('set filter',filter)
    setStateNav(stateNav => ({
      ...stateNav,
      filterOwnerWellInterestSum: filter
    }));
  }, [setStateNav, valueMaxDisplay, valueMinDisplay]);

  useEffect(() => {
    const recall = () => {
      let checkStateNav = stateNav.filterOwnerWellInterestSum;
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
    if (stateNav.ownerWellInterestSum) {
      setFilter();
    }
  }, [setFilter, stateNav.ownerWellInterestSum]);

  const handleChangeMin = event => {
    console.log('handle change min')
    setValueMinDisplay(event.target.value.replace(/,/g, ""));
    setOwnerWellInterestSum(event.target.id);
    console.log(event.target.value.replace(/,/g, ""));
    console.log(event.target.id);
    console.log(event.target)
    setStateNav(stateNav => ({ ...stateNav, ownerWellInterestSum: event.target.id }));
    if (event.target.value === "") {
      setStateNav(stateNav => ({
        ...stateNav,
        filterOwnerWellInterestSum: null
      }));
    }
  };

  const handleChangeMax = event => {
    console.log('handle change max')
    setValueMaxDisplay(event.target.value.replace(/,/g, ""));
    setOwnerWellInterestSum(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, ownerWellInterestSum: event.target.id }));
    if (event.target.value === "") {
      setStateNav(stateNav => ({
        ...stateNav,
        filterOwnerWellInterestSum: null
      }));
    }
  };

  const allowNumbersOnly = e => {
    let code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  };


  // useEffect(() => {
  //   if (stateNav.filterOwnerWellInterestSum && stateNav.filterOwnerWellInterestSum.length > 1) {
  //     setNoOwners(true)
  //   }
  // },[stateNav.filterOwnerWellInterestSum])
  
  return (
    <div>
      <Typography
        className={classes.inputLabel}
        htmlFor="select-multiple-chip1"
      >
          Owner Well Interest Sum
      </Typography>
      <NumberFormat
        id="OwnerInterestSumMin"
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
        id="OwnerInterestSumMax"
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
    </div>
  );
}
