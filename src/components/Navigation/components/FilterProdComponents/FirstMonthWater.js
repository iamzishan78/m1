import React, { useState, useContext, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { NavigationContext } from "../../NavigationContext";

const useStyles = makeStyles({
  input: {
    margin: 20,
    maxWidth: "18vw",
    minWidth: "15vw"
  },
  inputLabel: {
    color: "black",
    textAlign: "center",
    minWidth: 199,
    maxWidth: 200,
    marginLeft: 20
  }
});

export default function FirstMonthWater() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [valueMinDisplay, setValueMinDisplay] = useState("");
  const [valueMaxDisplay, setValueMaxDisplay] = useState("");
  const [id, setId] = useState("firstMonthWater");
  const [prodTypeName, setProdTypeName] = useState(
    stateNav.prodTypeName ? stateNav.prodTypeName : []
  );

  const setFilter = useCallback(() => {
    let filter;
    if (!valueMinDisplay && !valueMaxDisplay) {
      filter = null;
    }
    if (!valueMinDisplay && valueMaxDisplay) {
      filter = ["all", ["<=", ["get", id.toString()], valueMaxDisplay]];
      console.log("add filter", filter);
    } else if (valueMinDisplay && !valueMaxDisplay) {
      filter = ["all", [">=", ["get", id.toString()], valueMinDisplay]];
      console.log("add filter", filter);
    } else if (valueMinDisplay && valueMaxDisplay) {
      if (valueMinDisplay < valueMaxDisplay) {
        filter = [
          "all",
          [">=", ["get", id.toString()], valueMinDisplay],
          ["<=", ["get", id.toString()], valueMaxDisplay]
        ];
        console.log("add filter", filter);
      }
    } else {
      filter = null;
    }

    setStateNav(stateNav => ({
      ...stateNav,
      filterFirstMonthWater: filter
    }));
  }, [id, setStateNav, valueMaxDisplay, valueMinDisplay]);

  useEffect(() => {
    const recall = () => {
      if (!valueMinDisplay && !valueMaxDisplay) {
        if (
          stateNav.filterFirstMonthWater &&
          stateNav.filterFirstMonthWater.length === 3
        ) {
          const recallMin = stateNav.filterFirstMonthWater[1][2];
          const recallMax = stateNav.filterFirstMonthWater[2][2];
          setValueMinDisplay(recallMin);
          setValueMaxDisplay(recallMax);
        }
      }
      if (!valueMaxDisplay) {
        if (
          stateNav.filterFirstMonthWater &&
          stateNav.filterFirstMonthWater[1][0] === "<="
        ) {
          const recallMax = stateNav.filterFirstMonthWater[1][2];
          setValueMaxDisplay(recallMax);
        }
      }
      if (!valueMinDisplay) {
        if (
          stateNav.filterFirstMonthWater &&
          stateNav.filterFirstMonthWater[1][0] === ">="
        ) {
          const recallMin = stateNav.filterFirstMonthWater[1][2];
          setValueMinDisplay(recallMin);
        }
      }
    };
    recall();
    return () => {
      recall();
    };
  }, [stateNav.filterFirstMonthWater, valueMaxDisplay, valueMinDisplay]);

  useEffect(() => {
    if (stateNav.prodOptions) {
      setFilter();
    }
  }, [setFilter, stateNav.prodOptions]);

  const handleChangeMin = event => {
    setValueMinDisplay(event.target.valueAsNumber || event.target.value);
    setProdTypeName(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
    if (event.target.value === "") {
      setStateNav(stateNav => ({
        ...stateNav,
        filterFirstMonthWater: null
      }));
    }
  };

  const handleChangeMax = event => {
    setValueMaxDisplay(event.target.valueAsNumber || event.target.value);
    setProdTypeName(event.target.id);
    setStateNav(stateNav => ({ ...stateNav, prodTypeName: event.target.id }));
    if (event.target.value === "") {
      setStateNav(stateNav => ({
        ...stateNav,
        filterFirstMonthWater: null
      }));
    }
  };

  return (
    <div>
      <Typography
        className={classes.inputLabel}
        htmlFor="select-multiple-chip1"
      >
        First Month Water (BBL)
      </Typography>
      <TextField
        id={id}
        className={classes.input}
        value={valueMinDisplay}
        InputProps={{
          inputProps: {
            min: Number.MIN_SAFE_INTEGER,
            max: Number.MAX_SAFE_INTEGER - 1,
            step: 1000
          }
        }}
        onChange={handleChangeMin}
        aria-labelledby="range-number"
        type="number"
        label="Min"
        variant="outlined"
      />
      <TextField
        id={id}
        className={classes.input}
        value={valueMaxDisplay}
        InputProps={{
          inputProps: {
            min: Number.MIN_SAFE_INTEGER + 1,
            max: Number.MAX_SAFE_INTEGER,
            step: 1000
          }
        }}
        onChange={handleChangeMax}
        aria-labelledby="range-number"
        type="number"
        label="Max"
        variant="outlined"
      />
    </div>
  );
}
