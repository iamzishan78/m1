import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

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
}));

const FILTERS_TYPES = {
  Geography: "GeographyFilter",
  Wells: "WellFilter",
  Production: "ProductionFilter",
  Ownership: "OwnershipFilter",
  Tags: "TagsFilter",
};

const LayerFilters = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6">Filters</Typography>
      {Object.keys(FILTERS_TYPES).map((filterType, index) => (
        <Accordion className={classes.accordionRoot}>
          <AccordionSummary
            aria-controls="panel1a-content"
            id="panel1a-header"
            expandIcon={<ExpandMoreIcon />}
            defaultExpanded={index === 0}
          >
            <Grid container direction="row" justify="flex-start" alignItems="center">
              <Grid item>
                <Typography>{filterType}</Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>{LayerFiltersComponents[FILTERS_TYPES[filterType]]()}</AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default LayerFilters;
