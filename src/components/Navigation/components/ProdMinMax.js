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

export default function FirstMonthWater(props) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [valueMinDisplay, setValueMinDisplay] = useState("");
  const [valueMaxDisplay, setValueMaxDisplay] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [id, setId] = useState(props.id);
  const [type, setType] = useState("");
  const [filterName, setFilterName] = useState(props.filter);
  const [name, setName] = useState(props.name);
  const [prodTypeName, setProdTypeName] = useState(
    stateNav.prodTypeName ? stateNav.prodTypeName : []
  );

  useEffect(() => {
    if (name.includes("Gas")) {
      setType("(MCF)");
    } else {
      setType("(BBL)");
    }
  }, [name]);

  const setFilter = useCallback(() => {
    let filter;
    let min = parseInt(valueMinDisplay);
    let max = parseInt(valueMaxDisplay);
    if (!min && !max) {
      filter = null;
    }
    if (!min && max) {
      filter = ["all", ["<=", ["get", id.toString()], max]];
      console.log("add filter", filter);
    } else if (min && !max) {
      filter = ["all", [">=", ["get", id.toString()], min]];
      console.log("add filter", filter);
    } else if (min && max) {
      if (min < max) {
        filter = [
          "all",
          [">=", ["get", id.toString()], min],
          ["<=", ["get", id.toString()], max]
        ];
        console.log("add filter", filter);
      }
    } else {
      filter = null;
    }

    setStateNav(stateNav => ({
      ...stateNav,
      [filterName]: filter
    }));
  }, [filterName, id, setStateNav, valueMaxDisplay, valueMinDisplay]);

  useEffect(() => {
    const recall = () => {
      let checkStateNav = stateNav[filterName];
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
  }, [filterName, stateNav, valueMaxDisplay, valueMinDisplay]);

  useEffect(() => {
    if (stateNav.prodOptions) {
      setFilter();
    }
  }, [setFilter, stateNav.prodOptions]);

  const handleChangeMin = event => {
    setValueMinDisplay(event.target.value.replace(/,/g, ""));
    setProdTypeName(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
    if (event.target.value === "") {
      setStateNav(stateNav => ({
        ...stateNav,
        [filterName]: null
      }));
    }
  };

  const handleChangeMax = event => {
    setValueMaxDisplay(event.target.value.replace(/,/g, ""));
    setProdTypeName(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
    if (event.target.value === "") {
      setStateNav(stateNav => ({
        ...stateNav,
        [filterName]: null
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
        {name} {type}
      </Typography>
      <NumberFormat
        value={valueMinDisplay}
        onChange={handleChangeMin}
        thousandSeparator={true}
        customInput={TextField}
        id={id}
        className={classes.input}
        aria-labelledby="range-number"
        type="text"
        label="Min"
        variant="outlined"
        onKeyPress={e => allowNumbersOnly(e)}
        InputProps={{
          inputProps: {
            min: Number.MIN_SAFE_INTEGER,
            max: Number.MAX_SAFE_INTEGER - 1,
            step: 1000
          }
        }}
      />
      <NumberFormat
        value={valueMaxDisplay}
        onChange={handleChangeMax}
        thousandSeparator={true}
        customInput={TextField}
        id={id}
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
            min: Number.MIN_SAFE_INTEGER + 1,
            max: Number.MAX_SAFE_INTEGER,
            step: 1000
          }
        }}
      />
    </div>
  );
}
