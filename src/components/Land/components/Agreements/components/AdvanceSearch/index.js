import React from "react";
import { makeStyles } from "@material-ui/styles";
import { IconButton } from "@material-ui/core";
import { Divider, Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Chip } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon, Close as ClearButton } from "@material-ui/icons";
import * as FilterComponents from "./searchComponents";

const filterTypes = {
  // Summary: { component: "ProvisionFilters", countKey: "geographyFilterCount" },
  // "Related Parties": { component: "ProvisionFilters", countKey: "wellFilterCount" },
  Provisions: { component: "ProvisionFilters", countKey: "productionFilterCount" },
  // "Legal Description": { component: "ProvisionFilters", countKey: "ownershipFilterCount" },
  // Wells: { component: "ProvisionFilters", countKey: "tagFilterCount" },
  // Documents: { component: "ProvisionFilters", countKey: "tagFilterCount" },
  // "Related Agreements": { component: "ProvisionFilters", countKey: "tagFilterCount" },
};

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#0e111a",
    height: "calc(100vh - 172px)",
    fontFamily: "Poppins",
    display: "block",
    color: "white",
    padding: "0px 10px",
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
    backgroundColor: "#101d29",
    padding: 0,
    // overridding the default text fields colors
    "& svg": {
      fill: "white",
    },
    "& label": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& label.Mui-disabled": {
      color: "#adadad",
    },
    "& input": {
      color: "white !important",
    },
    "& .MuiInputBase-adornedStart:before": {
      borderBottomColor: "white",
    },
    "& .MuiInputBase-adornedStart:after": {
      borderBottomColor: "white",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
      "&.Mui-disabled fieldset": {
        borderColor: "#adadad",
      },
      "&.Mui-disabled svg": {
        fill: "#adadad !important",
      },
    },
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

export default function QuickActionsPanel({ children, title, actions, handlePanelStateChange, quickActionsPanelState, activeModule }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {Object.keys(filterTypes).map((filterType, index) => (
        <Accordion className={classes.accordionRoot}>
          <AccordionSummary
            aria-controls="panel1a-content"
            id="panel1a-header"
            expandIcon={<ExpandMoreIcon />}
            defaultExpanded={index === 0}
            // style={{ borderLeft: stateNav[filterTypes[filterType].countKey] > 0 ? "5px solid #18aadd" : "transparent" }}
            style={{ borderLeft: "5px solid #18aadd" }}
          >
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Grid item className={classes.accordionHeading}>
                <Typography style={{ padding: "15px 5px" }}>{filterType}</Typography>
                <Chip color="info" label={1} />
              </Grid>
              <Grid item className={classes.clearIcon}>
                <IconButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    // clearFilters(filterType);
                  }}
                >
                  <ClearButton />
                </IconButton>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>{FilterComponents[filterTypes[filterType].component]()}</AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
