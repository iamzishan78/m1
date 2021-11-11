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
  }, [stateNav]);

  const checkGeoFiltersChange = () => {
    let count = 0;
    if (stateNav.filterAOI) count++;
    if (stateNav.filterParcel) count++;
    if (stateNav.filterBasin) count++;
    if (stateNav.stateName) count++;
    if (stateNav.countyName) count++;
    setFilters({
      ...filterTypes,
      Geography: { ...filterTypes.Geography, appliedFiltersCount: count },
    });
  };

  const clearFilters = (filterType) => {
    switch (filterType) {
      case "Geography":
        setStateNav({
          ...stateNav,
          filterAOI: null,
          filterParcel: null,
          filterBasin: null,
          stateName: null,
          countyName: null,
          gridId1: null,
          gridId2: null,
          gridId3: null,
          gridId4: null,
          gridId5: null,
        });
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
