import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { NavigationContext } from "../NavigationContext";
import ProdMinMax from "./ProdMinMax";
import FormControl from "@material-ui/core/FormControl";
import FilterOwnerAppraisalValue from "./FilterOwnerAppraisalValue";
import FilterWellAppraisal from "./FilterWellAppraisal";


const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row"
  },
  formControl: {
    margin: "15px",
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



export default function FilterFormProduction() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [prodOptions, setProdOptions] = useState(
    stateNav.prodOptions ? stateNav.prodOptions : null
  );
  const [list, setList] = useState([]);
  const [optionsCopy, setOptionsCopy] = useState(null);

  const handleSelectedValueToDisplay = value => {
    // setProdOptions(value);
    // setStateNav(stateNav => ({
    //   ...stateNav,
    //   prodOptions: value
    // }));
  };

  useEffect(() => {
    if (stateNav.prodOptions && optionsCopy) {
      
      // const check = optionsCopy.map(val => val)
      
      // const removeFilters = check.filter(name => !stateNav.prodOptions.includes(name.name))

      // removeFilters.forEach(element => {
      //   setStateNav(stateNav => ({
      //     ...stateNav,
      //     [element.filterName]: null
      //   }));
      // })
      
    } 
  },[optionsCopy, setStateNav, stateNav.prodOptions])

  useEffect(() => {
    if (optionsCopy) {
      let compare = [];
      let optionUpdate;
      let elementUpdate;
      // let matchName = prodOptions.map(option => option);
      // matchName.forEach(element => {
      //   compare.push(element);
      // });

      // const check = optionsCopy.filter(name => compare.includes(name.name));
      // optionsCopy.forEach((element, index) => {
      //   check.forEach(option => {
      //     if (element.name === option.name) {
      //       optionUpdate = option.name;
      //       elementUpdate = option.name;
      //     }
      //   });
      // });
      // if (optionUpdate && elementUpdate) {
      //   const updateState = optionsCopy.map(item =>
      //     compare.includes(item.name) ? { ...item, display: true } : item
      //   );
      //   setList(updateState);
      // } else {
      //   const updateState = optionsCopy.map(item =>
      //     compare.includes(!item.name) ? { ...item, display: false } : item
      //   );
      //   setList(updateState);
      // } 
    } 
  }, [optionsCopy, prodOptions, stateNav.prodOptions]);

  const renderFMW = list
    .filter(item => item.display === true)
    .map(item => (
      <ProdMinMax key={item.name} id={item.id} name={item.name} filter={item.filterName} />
    ));

  return (
    <div className={classes.root}>

    <FilterWellAppraisal />

    <FormControl className={classes.formControl}>
    <FilterOwnerAppraisalValue />
    </FormControl> 

    </div>
  );
}
