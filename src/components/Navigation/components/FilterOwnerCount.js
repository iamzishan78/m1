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
    float: "right",
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
    // marginLeft: "20px",
    marginRight: "50px",
  },
});

export default function FilterOwnerCount() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [valueMinDisplay, setValueMinDisplay] = useState("");
  const [valueMaxDisplay, setValueMaxDisplay] = useState("");
  const [noOwners, setNoOwners] = useState(false);
  const [owners, setOwners] = useState(false);
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
        ["<=", ["get", "ownerCount"], max],
      ];
      console.log("add filter", filter);
    } else {
      filter = null;
    }

    setStateNav((stateNav) => ({
      ...stateNav,
      filterOwnerCount: filter,
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

  const handleChangeMin = (event) => {
    setValueMinDisplay(event.target.value.replace(/,/g, ""));
    setOwnerCountWell(event.target.id);
    setStateNav((stateNav) => ({
      ...stateNav,
      ownerCountWell: event.target.id,
    }));
    if (event.target.value === "") {
      setStateNav((stateNav) => ({
        ...stateNav,
        filterOwnerCount: null,
      }));
    }
  };

  const handleChangeMax = (event) => {
    setValueMaxDisplay(event.target.value.replace(/,/g, ""));
    setOwnerCountWell(event.target.id);
    setStateNav((stateNav) => ({
      ...stateNav,
      ownerCountWell: event.target.id,
    }));
    if (event.target.value === "") {
      setStateNav((stateNav) => ({
        ...stateNav,
        filterOwnerCount: null,
      }));
    }
  };

  const allowNumbersOnly = (e) => {
    let code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  };

  // const toggleNoOwners = () => {
  //   setNoOwners((noOwners) => !noOwners);
  // };

  const toggleOwners = () => {
    // setOwners((owners) => !owners);
    if (stateNav.filterHasOwnerCount)
      setStateNav((stateNav) => ({
        ...stateNav,
        filterHasOwnerCount: null,
      }));
    else
      setStateNav((stateNav) => ({
        ...stateNav,
        filterHasOwnerCount: ["any", ["==", ["get", "hasOwner"], true]],
      }));
  };

  // useEffect(() => {
  //   let filter;
  //   if (noOwners) {
  //     filter = ["any", ["==", ["get", "hasOwner"], false]];
  //   } else {
  //     filter = null;
  //   }
  //   setStateNav((stateNav) => ({
  //     ...stateNav,
  //     filterNoOwnerCount: filter,
  //   }));
  // }, [noOwners, setStateNav]);

  // useEffect(() => {
  //   let filter;
  //   if (owners) {
  //     filter = ["any", ["==", ["get", "hasOwner"], true]];
  //   } else {
  //     filter = null;
  //   }
  //   setStateNav((stateNav) => ({
  //     ...stateNav,
  //     filterHasOwnerCount: filter,
  //   }));
  // }, [noOwners, owners, setStateNav]);

  // useEffect(() => {
  //   if (stateNav.filterHasOwnerCount && stateNav.filterHasOwnerCount.length > 1) {
  //     setOwners(true);
  //   }
  // }, [stateNav.filterHasOwnerCount]);

  return (
    <React.Fragment>
      {/* TEMPORARY COMMENT OUT 
      FEATURE WORKS AND HELPS WITH M1 LOCAL DEBUGGING
      <div className={classes.noOwners}>
        <Typography
          className={classes.inputLabel}
          htmlFor="select-multiple-chip1"
        >
          Wells With Owners
        </Typography>
        <Switch
          className={classes.noOwnersToggle}
          checked={owners}
          onChange={toggleOwners}
          color="primary"
          name="checked"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </div> */}

      <Grid item sm={12}>
        <div className={classes.divBordersMinMax}>
          <FormLabel className={classes.inputLabel}>Owner Count</FormLabel>
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
            size="small"
            onKeyPress={(e) => allowNumbersOnly(e)}
            InputProps={{
              inputProps: {
                min: 0,
                max: Number.MAX_SAFE_INTEGER,
              },
            }}
          />
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
            size="small"
            onKeyPress={(e) => allowNumbersOnly(e)}
            InputProps={{
              inputProps: {
                min: 0,
                max: Number.MAX_SAFE_INTEGER - 1,
              },
            }}
          />
        </div>
      </Grid>
      <Grid item sm={12}>
        <div className={classes.divBordersSwitch}>
          <IconButton className={classes.IconButton}>
            <OwnershipIcon color="#808080" opacity="1.0" />
          </IconButton>
          <FormLabel style={{ verticalAlign: "middle", paddingRight: "60px" }}>
            Wells With Owners
          </FormLabel>
          <Switch
            className={classes.ownersToggle}
            checked={stateNav.filterHasOwnerCount ? true : false}
            onChange={toggleOwners}
            color="secondary"
            name="checked"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </div>
      </Grid>
    </React.Fragment>
  );
}
