import React, { useState, useContext, useRef, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import { NavigationContext } from "../NavigationContext";
import FilterDatePickerPermit from "./FilterDatePickerPermit";
import FilterDatePickerCompletetion from "./FilterDatePickerCompletetion";
import FilterDatePickerSpud from "./FilterDatePickerSpud";
import FilterDatePickerFirstProd from "./FilterDatePickerFirstProd";
import OperatorFilterJ from "./OperatorFilterJ";
import FilterWellTypeJ from "./FilterWellTypeJ";
import FilterWellProfileJ from "./FilterWellProfileJ";
import FilterWellStatusJ from "./FilterWellStatusJ";


// const ITEM_HEIGHT = 60;
// const ITEM_PADDING_TOP = 10;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "space-around",
    // maxWidth: 220,
    // minWidth: 500
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row"
  },
  datesRow: {
    display: "flex",
    // flexWrap: "nowrap",
    flexDirection: "column",
    // flex: "1",
    // flexGrow: 2,
    // maxWidth: 400,
    // minWidth: 300
  },
  formControl: {
    margin: "15px",
    // minWidth: 120,
    // maxWidth: 300,
    color: "black",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: "100px"
  },
  indicator: {
    backgroundColor: "rgba(23, 170, 221, 1) !important"
  },
  inputLabel: {
    color: "black"
  },
  
}));



export default function FilterFormWell() {
  const classes = useStyles();
  const theme = useTheme();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [typeName, setTypeName] = React.useState(
    stateNav.typeName ? stateNav.typeName : []
  );
  const [profileName, setProfileName] = React.useState(
    stateNav.profileName ? stateNav.profileName : []
  );
  const [statusName, setStatusName] = React.useState(
    stateNav.statusName ? stateNav.statusName : []
  );

  const [operatorName, setOperatorName] = React.useState(
    stateNav.operatorName ? stateNav.operatorName : []
  );


  return (
      <div className={classes.root}>

        <FormControl className={classes.formControl}>
          <OperatorFilterJ />
        </FormControl> 

        <FormControl variant="outlined" className={classes.formControl}>
        <FilterWellTypeJ/>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
        <FilterWellProfileJ/>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
        <FilterWellStatusJ/>
        </FormControl> 
      
     <div className={classes.datesRow}>
        <FilterDatePickerPermit labelDates={"Permit"} />
        <FilterDatePickerSpud labelDates={"Spud"} />
        <FilterDatePickerCompletetion labelDates={"Completetion"} />
        <FilterDatePickerFirstProd labelDates={"First Production"} />
      </div> 
      

    </div>
  );
}
