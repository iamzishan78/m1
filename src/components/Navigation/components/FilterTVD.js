import React, { useState, useContext, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import NumberFormat from "react-number-format";
import Switch from "@material-ui/core/Switch";
import { NavigationContext } from "../NavigationContext";
import Grid from "@material-ui/core/Grid";
import { FormLabel } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import OwnershipIcon from "../../Shared/svgIcons/ownership";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles({
  divBordersMinMax: {
    display: "flow-root",
    padding: "3.5px 5px 5.5px 15px",
    border: "1px solid #C4C4C4",
    borderRadius: "4px",
    "&:hover": {
      border: "1px solid black",
    },
  },
  divBordersSwitch: {
    textAlign: "center",
    padding: "3px 15px",
    border: "1px solid #C4C4C4",
    borderRadius: "4px",
    "&:hover": {
      border: "1px solid black",
    },
  },
  input: {
    marginLeft: "30px",
    width: "160px",
    "& input": { color: "#17AADD" },
  },
  inputLabel: {
    position: "relative",
    top: "11.5px",
  },
  IconButton: {
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#fff",
      cursor: "context-menu",
    },
  },
  ownersToggle: {
    marginRight: "50px",
  },
  floatRight: {
    float: "right",
  },
});

export default function FilterTVD() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [valueMinDisplay, setValueMinDisplay] = useState("");
  const [valueMaxDisplay, setValueMaxDisplay] = useState("");

  const [tvdWell, setTVDWell] = useState(
    stateNav.tvdWell ? stateNav.tvdWell : []
  );

  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const setFilter = useCallback(() => {
    let filter;
    let min = parseInt(valueMinDisplay);
    let max = parseInt(valueMaxDisplay);
    if (!min && !max) {
      filter = null;
    }
    if (!min && max) {
      filter = ["all", ["<=", ["get", "trueVerticalDepth"], max]];
    } else if (min && !max) {
      filter = ["all", [">=", ["get", "trueVerticalDepth"], min]];
    } else if (min && max) {
      filter = [
        "all",
        [">=", ["get", "trueVerticalDepth"], min],
        ["<=", ["get", "trueVerticalDepth"], max],
      ];
    } else {
      filter = null;
    }

    setStateNav((stateNav) => ({
      ...stateNav,
      filterTVD: filter,
    }));
  }, [setStateNav, valueMaxDisplay, valueMinDisplay]);


  useEffect(() => {
    const recall = () => {
      let checkStateNav = stateNav.filterTVD;
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
    if (stateNav.tvdWell) {
      setFilter();
    }
  }, [setFilter, stateNav.tvdWell]);

  const handleChangeMin = (event) => {
    setValueMinDisplay(parseInt(event.target.value.replace(/,/g, "")));
    setTVDWell(event.target.id);
    setStateNav((stateNav) => ({
      ...stateNav,
      tvdWell: event.target.id,
    }));
    if (event.target.value === "") {
      setStateNav((stateNav) => ({
        ...stateNav,
        filterTVD: null,
      }));
    }
  };

  const handleChangeMax = (event) => {
    setValueMaxDisplay(parseInt(event.target.value.replace(/,/g, "")));
    setTVDWell(event.target.id);
    setStateNav((stateNav) => ({
      ...stateNav,
      tvdWell: event.target.id,
    }));
    if (event.target.value === "") {
      setStateNav((stateNav) => ({
        ...stateNav,
        filterTVD: null,
      }));
    }
  };

  useEffect(() => {
    if (valueMinDisplay && valueMaxDisplay) {
      if (valueMinDisplay > valueMaxDisplay) {
        setError(true);
        setErrorText("Min value is greater than Max value");
      } else {
        setError(false);
        setErrorText("");
      }
    }
  }, [valueMaxDisplay, valueMinDisplay]);

  const allowNumbersOnly = (e) => {
    let code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  };

  // const toggleOwners = () => {
  //   if (stateNav.filterHasOwnerCount)
  //     setStateNav((stateNav) => ({
  //       ...stateNav,
  //       filterHasOwnerCount: null,
  //     }));
  //   else
  //     setStateNav((stateNav) => ({
  //       ...stateNav,
  //       filterHasOwnerCount: ["any", ["==", ["get", "hasOwner"], true]],
  //     }));
  // };

  return (
    <React.Fragment>

      <Grid item sm={12}>
        <div className={classes.divBordersMinMax}>
          <FormLabel className={classes.inputLabel}>TVD [ft.]</FormLabel>
          <div className={classes.floatRight}>
            <NumberFormat
              id="TVDMin"
              value={valueMinDisplay}
              onChange={handleChangeMin}
              thousandSeparator={true}
              customInput={TextField}
              className={classes.input}
              aria-labelledby="range-number"
              type="text"
              label="Min"
              size="small"
              onKeyPress={(e) => allowNumbersOnly(e)}
              InputProps={{
                inputProps: {
                  min: 0,
                  max: Number.MAX_SAFE_INTEGER - 1,
                },
              }}
            />
            <NumberFormat
              id="TVDMax"
              value={valueMaxDisplay}
              onChange={handleChangeMax}
              thousandSeparator={true}
              customInput={TextField}
              className={classes.input}
              aria-labelledby="range-number"
              type="text"
              label="Max"
              size="small"
              onKeyPress={(e) => allowNumbersOnly(e)}
              error={error}
              helperText={errorText}
              InputProps={{
                inputProps: {
                  min: 0,
                  max: Number.MAX_SAFE_INTEGER,
                },
              }}
            />
            <IconButton
              onClick={() => {
                handleChangeMax({ target: { id: "TVDMax", value: "" } });
                handleChangeMin({ target: { id: "TVDMin", value: "" } });
                setError(false);
                setErrorText("");
              }}
            >
              <CancelIcon height={"30px"} />
            </IconButton>
          </div>
        </div>
      </Grid>
    </React.Fragment>
  );
}
