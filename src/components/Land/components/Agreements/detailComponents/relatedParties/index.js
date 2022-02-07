import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useStyles as customStyles } from "../style";

// Components
import Fields from "./fieldsSection";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px 25px",
  },
  accordionRoot: {
    borderRadius: "5px",
    margin: "10px 0px",
    boxShadow: "none",
    "& .MuiButtonBase-root.MuiAccordionSummary-root": {
      maxHeight: "50px",
      minHeight: "50px",
      padding: 0,
    },
    "&.MuiAccordion-root.Mui-expanded": {
      margin: 0,
    },
  },
  accordionHeading: {
    display: "flex !important",
    alignItems: "center",
    "& .MuiChip-root": {
      width: "40px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#fff",
      borderRadius: "3px !important",
      backgroundColor: "#18aadd",
    },
  },
  accordionDetails: {
    padding: 0,
  },
}));

export default function RelatedParties(props) {
  const classes = useStyles();
  const customClasses = customStyles();
  const [partiesNumber, setPartiesNumber] = useState(1);

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordionRoot}>
        <AccordionSummary
          aria-label="Expand"
          aria-controls="additional-actions1-content"
          expandIcon={
            <IconButton>
              <ExpandMoreIcon fontSize="large" />
            </IconButton>
          }
          defaultExpanded={true}
          onClick={(e) => {}}
        >
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item xs={6} className={classes.accordionHeading}>
              <Typography variant="h5" className={customClasses.titleText}>
                Related Parties
              </Typography>
              <Chip color="info" label={partiesNumber} />
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Fields setPartiesNumber={setPartiesNumber} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
