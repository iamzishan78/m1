import React, { useState, useContext, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { NavigationContext } from "../NavigationContext";
import ProdMinMax from "./ProdMinMax";
import FilterOwnerConfidence from "./FilterOwnerConfidence";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 650,
    minWidth: 630,
    height: "100%"
  },
  autoComplete: {
    width: "95%",
    margin: 20
  },
  loader: {
    marginLeft: "40%",
    marginTop: "25%"
  },
  displayNone: {
    display: "none"
  }
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
    setProdOptions(value);
    setStateNav(stateNav => ({
      ...stateNav,
      prodOptions: value
    }));
  };

  useEffect(() => {
    if (stateNav.prodOptions && optionsCopy) {
      
      const check = optionsCopy.map(val => val)
      
      const removeFilters = check.filter(name => !stateNav.prodOptions.includes(name.name))

      removeFilters.forEach(element => {
        setStateNav(stateNav => ({
          ...stateNav,
          [element.filterName]: null
        }));
      })
      
    } 
  },[optionsCopy, setStateNav, stateNav.prodOptions])

  useEffect(() => {
    if (optionsCopy) {
      let compare = [];
      let optionUpdate;
      let elementUpdate;
      let matchName = prodOptions.map(option => option);
      matchName.forEach(element => {
        compare.push(element);
      });

      const check = optionsCopy.filter(name => compare.includes(name.name));
      optionsCopy.forEach((element, index) => {
        check.forEach(option => {
          if (element.name === option.name) {
            optionUpdate = option.name;
            elementUpdate = option.name;
          }
        });
      });
      if (optionUpdate && elementUpdate) {
        const updateState = optionsCopy.map(item =>
          compare.includes(item.name) ? { ...item, display: true } : item
        );
        setList(updateState);
      } else {
        const updateState = optionsCopy.map(item =>
          compare.includes(!item.name) ? { ...item, display: false } : item
        );
        setList(updateState);
      } 
    } 
  }, [optionsCopy, prodOptions, stateNav.prodOptions]);

  const renderFMW = list
    .filter(item => item.display === true)
    .map(item => (
      <ProdMinMax key={item.name} id={item.id} name={item.name} filter={item.filterName} />
    ));

  return (
    <div className={classes.root}>
      <FilterOwnerConfidence/>
      {renderFMW}
    </div>
  );
}
