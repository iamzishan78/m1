import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Breadcrumbs, Typography, Grid, IconButton, Accordion, AccordionSummary, AccordionDetails, TextField } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  accordionRoot: {
    color: "black",
  },
  accordionSummary: {
    backgroundColor: "#F2F2F2",
    minHeight: "70px",
    padding: "10px 30px 10px 30px",
  },
}));

function AgreementDetailSection({ setTitle }) {
  const classes = useStyles();
  const [title, setHeaderTitle] = useState({ name: "", number: "" });

  useEffect(() => {
    if (!title.number) {
      setTitle(`${title.name}`);
    }
    if (!title.name) {
      setTitle(`${title.number}`);
    }
    if (title.name && title.number) {
      setTitle(`${title.number}-${title.name}`);
    }
  }, [title, setTitle]);

  return (
    <>
      <Accordion className={classes.accordionRoot}>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          expandIcon={<ExpandMoreIcon />}
          className={classes.accordionSummary}
        >
          Agreement Details
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item xl={2.5}>
              <TextField
                margin="dense"
                label="Agreement Number"
                fullWidth
                onChange={({ target }) => setHeaderTitle({ ...title, number: target.value })}
              />
            </Grid>
            <Grid item xl={4}>
              <TextField
                margin="dense"
                label="Agreement Name"
                fullWidth
                onChange={({ target }) => setHeaderTitle({ ...title, name: target.value })}
              />
            </Grid>
            <Grid item xl={2.5}></Grid>
            <Grid item xl={2.5}></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default AgreementDetailSection;
