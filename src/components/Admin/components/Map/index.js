import React, { useState } from "react";

import { makeStyles, withStyles } from "@material-ui/styles";
import { Tabs, Tab, RadioGroup, Radio, FormControlLabel, TextField } from "@material-ui/core";

import Filters from "./Filters";

const useStyles = makeStyles((theme) => ({
  contenContainer: {
    padding: "40px",
    "& span": {
      fontWeight: "bold",
      fontSize: "16px",
    },
  },
  actionsContainer: {
    padding: "0px 35px",
  },
  options: {
    marginTop: "20px",
    "& .MuiFormControl-marginDense": {
      marginTop: "0px !important",
    },
  },
}));

const StyledTabs = withStyles({
  root: {
    textTransform: "capitalize",
  },
  indicator: {
    backgroundColor: "#12abe0",
    height: "5px",
  },
})(Tabs);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "uppercase",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      color: "black",
      opacity: 1,
    },
    "&$selected": {
      color: "black",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "black",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

export default function RevenueStatements() {
  const classes = useStyles();

  const [tab, setTab] = useState(0);

  return (
    <div
      style={{
        marginTop: "65px",
      }}
    >
      <div className={classes.actionsContainer}>
        <div className={classes.tabsHeader}>
          <StyledTabs value={tab} onChange={(event, tab) => setTab(tab)} aria-label="ant example">
            <StyledTab id="settings" label="Settings" />
            <StyledTab id="validations" label="Validations" disabled />
          </StyledTabs>
        </div>
      </div>
      <Filters />

      <div className={classes.contenContainer}>
        <span>Select the method by which Net Royalty Acres (NRA) should be calculatedd for unit owners:</span>

        <div className={classes.options}>
          <RadioGroup column value={"standard"} onChange={(event) => {}}>
            <FormControlLabel value="standard" control={<Radio />} label="Standard Calculation = (Unit Acres * Unit Decimal Interests)" />
            <div>
              <FormControlLabel value="custom" control={<Radio />} label="Custom Calculations = (Unit Acres * Unit Decimal Interests) / " />
              <TextField variant="outlined" margin="dense" />
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
