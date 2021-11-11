import React, { useContext, useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon, Close as ClearButton } from "@material-ui/icons";

// Contexts
import { NavigationContext } from "components/Navigation/NavigationContext";
//Components
import * as LayerFiltersComponents from "components/Shared/SidePanel/compoennts/Filters";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#0e111a",
    height: "calc(100vh - 103px)",
    fontFamily: "Poppins",
    display: "block",
    color: "white",
    padding: "10px",
    overflow: "overlay",
    "& .MuiTypography-root": {
      padding: "15px 5px",
    },
  },
  accordionRoot: {
    borderRadius: "5px",
    backgroundColor: "#1a253c",
    color: "#fff",
    margin: "10px 0px",
    "& .MuiButtonBase-root.MuiAccordionSummary-root": {
      maxHeight: "50px",
      minHeight: "50px",
      "& .MuiAccordionSummary-expandIcon": {
        color: "#fff",
      },
    },
    "&.MuiAccordion-root.Mui-expanded": {
      margin: 0,
    },
  },
  accordionDetails: {
    backgroundColor: "white",
    padding: 0,
  },
  accordionHeading: {
    display: "flex",
    alignItems: "center",
    "& .MuiChip-root": {
      height: "22px !important",
      borderRadius: "3px !important",
      backgroundColor: "#18aadd",
    },
  },
  clearIcon: {
    "& .MuiButtonBase-root": {
      color: "grey",
    },
  },
}));

const geoFiltersParams = [
  "filterAOI",
  "filterParcel",
  "filterBasin",
  "stateName",
  "countyName",
  "gridId1",
  "gridId2",
  "gridId3",
  "gridId4",
  "gridId5",
];
const prodFiltersParams = ["prodOptions"];
const wellFiltersParams = [
  "operatorName",
  "typeName",
  "profileName",
  "statusName",
  "primaryFormationName",
  "playName",
  "fieldName",
  "filterTVD",
  "measuredDistanceWell",
  "lateralLengthWell",
  "filterPermitDateRange",
  "filterSpudDateRange",
  "filterCompletetionDateRange",
  "filterFirstProdDateRange",
];
const ownershipFiltersParams = ["interestName", "ownerTypeName", "filterOwnerCount", "filterHasOwnerCount", "filterOwnerConfidence"];
const tagFiltersParams = ["selectedTags", "filterTrackedWells"];

const LayerFilters = () => {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [filterTypes, setFilters] = useState({
    Geography: { component: "GeographyFilter", appliedFiltersCount: 0 },
    Wells: { component: "WellFilter", appliedFiltersCount: 0 },
    Production: { component: "ProductionFilter", appliedFiltersCount: 0 },
    Ownership: { component: "OwnershipFilter", appliedFiltersCount: 0 },
    Tags: { component: "TagsFilter", appliedFiltersCount: 0 },
  });

  useEffect(() => {
    checkGeoFiltersChange();
    checkProdFiltersChange();
    checkWellFiltersChange();
    checkOwnershipFiltersChange();
    checkTagFiltersChange();
  }, [stateNav]);

  const getFiltersCount = (params) => {
    let count = 0;
    params.forEach((filter) => {
      if ((!Array.isArray(stateNav[filter]) && stateNav[filter]) || (Array.isArray(stateNav[filter]) && stateNav[filter].length)) count++;
    });
    return count;
  };

  const resetFilters = (params, additionalParamsToReset = {}) => {
    const geoFiltersToReset = {};
    params.forEach((param) => {
      if (!Array.isArray(stateNav[param]) && stateNav[param]) geoFiltersToReset[param] = null;
      else {
        geoFiltersToReset[param] = [];
      }
    });
    setStateNav({
      ...stateNav,
      ...geoFiltersToReset,
      ...additionalParamsToReset,
    });
  };

  const checkGeoFiltersChange = () => {
    setFilters((prevState) => ({
      ...prevState,
      Geography: { ...filterTypes.Geography, appliedFiltersCount: getFiltersCount(geoFiltersParams) },
    }));
  };

  const checkWellFiltersChange = () => {
    setFilters((prevState) => ({
      ...prevState,
      Wells: { ...filterTypes.Wells, appliedFiltersCount: getFiltersCount(wellFiltersParams) },
    }));
  };

  const checkProdFiltersChange = () => {
    setFilters((prevState) => ({
      ...prevState,
      Production: { ...filterTypes.Production, appliedFiltersCount: getFiltersCount(prodFiltersParams) },
    }));
  };

  const checkOwnershipFiltersChange = () => {
    setFilters((prevState) => ({
      ...prevState,
      Ownership: { ...filterTypes.Ownership, appliedFiltersCount: getFiltersCount(ownershipFiltersParams) },
    }));
  };

  const checkTagFiltersChange = () => {
    setFilters((prevState) => ({
      ...prevState,
      Tags: { ...prevState.Tags, appliedFiltersCount: getFiltersCount(tagFiltersParams) },
    }));
  };

  const clearFilters = (filterType) => {
    switch (filterType) {
      case "Geography":
        resetFilters(geoFiltersParams);
        break;
      case "Wells":
        resetFilters(wellFiltersParams, { tvdWell: null, filterLateralLength: null, filterMeasuredDistance: null });
        break;
      case "Production":
        resetFilters(prodFiltersParams);
        break;
      case "Ownership":
        resetFilters(ownershipFiltersParams, { ownerCountWell: null, ownerConfidenceWell: null });
        break;
      case "Tags":
        resetFilters(tagFiltersParams);
        break;
      default:
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h6">Filters</Typography>
      {Object.keys(filterTypes).map((filterType, index) => (
        <Accordion className={classes.accordionRoot}>
          <AccordionSummary
            aria-controls="panel1a-content"
            id="panel1a-header"
            expandIcon={<ExpandMoreIcon />}
            defaultExpanded={index === 0}
            style={{ borderLeft: filterTypes[filterType].appliedFiltersCount > 0 ? "5px solid #18aadd" : "transparent" }}
          >
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Grid item className={classes.accordionHeading}>
                <Typography>{filterType}</Typography>
                {filterTypes[filterType].appliedFiltersCount > 0 && (
                  <Chip color="info" label={filterTypes[filterType].appliedFiltersCount} />
                )}
              </Grid>
              <Grid item className={classes.clearIcon}>
                <IconButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    clearFilters(filterType);
                  }}
                >
                  <ClearButton />
                </IconButton>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            {LayerFiltersComponents[filterTypes[filterType].component]()}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default LayerFilters;
