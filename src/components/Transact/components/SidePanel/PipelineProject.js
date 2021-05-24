import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
} from "@material-ui/core";
import { ExpandMore, ExpandLess } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "95%",
    margin: "5px 5px 10px 5px",
  },
  accordionRoot: {
    borderRadius: "5px",
    backgroundColor: "#111c35",
    color: "#fff",
    '& .MuiButtonBase-root.MuiAccordionSummary-root': {
      maxHeight: '50px',
      minHeight: '50px'
    }
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 500,
  },
  detailRoot: {
    padding: 0,
    display: "contents",
  },
}));

const PipelineProject = ({ heading, children }) => {
  const classes = useStyles();
  const [isExpanded, setExpansion] = useState(false);

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordionRoot}>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            onClick={() => setExpansion(!isExpanded)}
          >
            <Grid item style={{ height: "24px" }}>
              {!isExpanded ? <ExpandMore /> : <ExpandLess />}
            </Grid>
            <Grid item>
              <Typography className={classes.heading}>
                {heading}
              </Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.detailRoot}>
          {children}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default PipelineProject;
