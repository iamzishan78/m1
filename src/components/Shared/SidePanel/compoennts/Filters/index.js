import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

//Components
import FilterFromGeo from "components/Navigation/components/FilterFromGeo";
import FilterFormWell from "components/Navigation/components/FilterFormWell";
import FilterFormProduction from "components/Navigation/components/FilterFormProduction";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#0e111a",
    height: "calc(100vh - 103px)",
    fontFamily: "Poppins",
    display: "block",
    color: "white",
    padding: "10px",
    overflow: "overlay",
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
}));

const LayerFilters = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6">Filters</Typography>
      {/**
       * Geo Filter
       */}
      <Accordion className={classes.accordionRoot}>
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />} defaultExpanded={false}>
          <Grid container direction="row" justify="flex-start" alignItems="center">
            <Grid item>
              <Typography>Geography</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <FilterFromGeo />
        </AccordionDetails>
      </Accordion>

      {/**
       * Well Filter
       */}
      <Accordion className={classes.accordionRoot}>
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
          <Grid container direction="row" justify="flex-start" alignItems="center">
            <Grid item>
              <Typography>Wells</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <FilterFormWell />
        </AccordionDetails>
      </Accordion>

      {/**
       * Production Filter
       */}
      <Accordion className={classes.accordionRoot}>
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
          <Grid container direction="row" justify="flex-start" alignItems="center">
            <Grid item>
              <Typography>Production</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <FilterFormProduction />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default LayerFilters;
