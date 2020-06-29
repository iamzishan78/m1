import React, { useState, useContext, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import NumberFormat from "react-number-format";
import { NavigationContext } from "../NavigationContext";
import { FormLabel } from "@material-ui/core";

const useStyles = makeStyles({
  divBordersMinMax: {
    display: "flow-root",
    padding: "3.5px 15px 5.5px 15px",
    border: "1px solid #C4C4C4",
    borderRadius: "4px",
    "&:hover": {
      border: "1px solid black",
    },
  },
  input: {
    marginLeft: "30px",
    width: "160px",
    //float: "right",
    "& input": { color: "#17AADD" },
  },
  inputLabel: {
    position: "relative",
    top: "11.5px",
  },
  ownersToggle: {
    paddingLeft: "20px",
  },
});

export default function FilterOwnerConfidence() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [valueMinDisplay, setValueMinDisplay] = useState("");
  const [valueMaxDisplay, setValueMaxDisplay] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [type, setType] = useState("");
  const [ownerConfidenceWell, setOwnerConfidenceWell] = useState(
    stateNav.ownerConfidenceWell ? stateNav.ownerConfidenceWell : []
  );

  const setFilter = useCallback(() => {
    let filter;
    let min = parseInt(valueMinDisplay);
    let max = parseInt(valueMaxDisplay);

    if (!min && !max) {
      filter = null;
    }
    if (!min && max) {
      filter = ["all", ["<=", ["get", "ownerMatchConfidence"], max / 100]];
      console.log("add filter", filter);
    } else if (min && !max) {
      filter = ["all", [">=", ["get", "ownerMatchConfidence"], min / 100]];
      console.log("add filter", filter);
    } else if (min && max) {
      if (min < max) {
        filter = [
          "all",
          [">=", ["get", "ownerMatchConfidence"], min / 100],
          ["<=", ["get", "ownerMatchConfidence"], max / 100],
        ];
        console.log("add filter", filter);
      }
    } else {
      filter = null;
    }

    setStateNav((stateNav) => ({
      ...stateNav,
      filterOwnerConfidence: filter,
    }));
  }, [setStateNav, valueMaxDisplay, valueMinDisplay]);

  useEffect(() => {
    const recall = () => {
      let checkStateNav = stateNav.filterOwnerConfidence;
      if (!valueMinDisplay && !valueMaxDisplay) {
        if (checkStateNav && checkStateNav.length === 3) {
          const recallMin = checkStateNav[1][2];
          const recallMax = checkStateNav[2][2];
          setValueMinDisplay(recallMin * 100);
          setValueMaxDisplay(recallMax * 100);
        }
      }
      if (!valueMaxDisplay) {
        if (checkStateNav && checkStateNav[1][0] === "<=") {
          const recallMax = checkStateNav[1][2];
          setValueMaxDisplay(recallMax * 100);
        }
      }
      if (!valueMinDisplay) {
        if (checkStateNav && checkStateNav[1][0] === ">=") {
          const recallMin = checkStateNav[1][2];
          setValueMinDisplay(recallMin * 100);
        }
      }
    };
    recall();
    return () => {
      recall();
    };
  }, [stateNav, valueMaxDisplay, valueMinDisplay]);

  useEffect(() => {
    if (stateNav.ownerConfidenceWell) {
      setFilter();
    }
  }, [setFilter, stateNav.ownerConfidenceWell]);

  const handleChangeMin = (event) => {
    setValueMinDisplay(event.target.value.replace(/,/g, ""));
    setOwnerConfidenceWell(event.target.id);
    setStateNav((stateNav) => ({
      ...stateNav,
      ownerConfidenceWell: event.target.id,
    }));
    if (event.target.value === "") {
      setStateNav((stateNav) => ({
        ...stateNav,
        filterOwnerConfidence: null,
      }));
    }
  };

  const handleChangeMax = (event) => {
    setValueMaxDisplay(event.target.value.replace(/,/g, ""));
    setOwnerConfidenceWell(event.target.id);
    setStateNav((stateNav) => ({
      ...stateNav,
      ownerConfidenceWell: event.target.id,
    }));
    if (event.target.value === "") {
      setStateNav((stateNav) => ({
        ...stateNav,
        filterOwnerConfidence: null,
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

  const allowNumbersOnly = (e) => {
    let code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  };

  return (
    <React.Fragment>
      <div className={classes.divBordersMinMax}>
        <FormLabel className={classes.inputLabel}>
          Owner Confidence Score
        </FormLabel>

        <NumberFormat
          id="OwnerConfidenceMin"
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
              max: 1,
            },
          }}
        />
        <NumberFormat
          id="OwnerConfidenceMax"
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
              max: 1,
            },
          }}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="caption">
          *M1neral’s proprietary owner confidence score enriches public and
          consumer datasets with intelligence to attach a confidence metric on
          owner records in relation to a well asset.
        </Typography>
      </div>
    </React.Fragment>
  );
}
