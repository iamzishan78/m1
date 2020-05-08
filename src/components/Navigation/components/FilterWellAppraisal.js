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
  }
});

export default function FilterWellAppraisal() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [valueMinDisplay, setValueMinDisplay] = useState("");
  const [valueMaxDisplay, setValueMaxDisplay] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [appraisalWell, setAppraisalWell] = useState(
    stateNav.appraisalWell ? stateNav.appraisalWell : []
  );

  const setFilter = useCallback(() => {
    let filter;
    let min = parseInt(valueMinDisplay);
    let max = parseInt(valueMaxDisplay);
    if (!min && !max) {
      filter = null;
    }
    if (!min && max) {
      filter = ["all", ["<=", ["get", "appraisalValueSum"], max]];
    } else if (min && !max) {
      filter = ["all", [">=", ["get", "appraisalValueSum"], min]];
    } else if (min && max) {
      if (min < max) {
        filter = [
          "all",
          [">=", ["get", "appraisalValueSum"], min],
          ["<=", ["get", "appraisalValueSum"], max]
        ];
      }
    } 
    else {
      filter = null;
    }

    setStateNav(stateNav => ({
      ...stateNav,
      filterWellAppraisal: filter
    }));

  }, [setStateNav, valueMaxDisplay, valueMinDisplay]);

  useEffect(() => {
    const recall = () => {
      let checkStateNav = stateNav.filterWellAppraisal;
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
    if (stateNav.appraisalWell) {
      setFilter();
    }
  }, [setFilter, stateNav.appraisalWell]);

  const handleChangeMin = event => {
    setValueMinDisplay(event.target.value.replace(/,/g, ""));
    setAppraisalWell(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, appraisalWell: event.target.id }));
    if (event.target.value === "") {
      setStateNav(stateNav => ({
        ...stateNav,
        filterWellAppraisal: null
      }));
    }
  };

  const handleChangeMax = event => {
    setValueMaxDisplay(event.target.value.replace(/,/g, ""));
    setAppraisalWell(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, appraisalWell: event.target.id }));
    if (event.target.value === "") {
      setStateNav(stateNav => ({
        ...stateNav,
        filterWellAppraisal: null
      }));
    }
  };

  useEffect(() => {
    if (valueMinDisplay && valueMaxDisplay) {
      if (valueMinDisplay >= valueMaxDisplay) {
        setError(true);
        setErrorText("Min value is greater than Max value");
      } else {
        setError(false);
        setErrorText("");
      }
    }
  }, [valueMaxDisplay, valueMinDisplay]);

  const allowNumbersOnly = e => {
    let code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <Typography
        className={classes.inputLabel}
        htmlFor="select-multiple-chip1"
      >
          Well Appraisal
      </Typography>
      <NumberFormat
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
        error={error}
        helperText={errorText}
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
