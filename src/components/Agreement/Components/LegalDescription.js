import React from "react";

import { makeStyles, Accordion, AccordionSummary, AccordionDetails, Grid, TextField } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  accordionRoot: {
    color: "black",
    "&.MuiAccordion-root.Mui-expanded": {
      margin: 0,
    },
  },
  accordionSummary: {
    backgroundColor: "#F2F2F2",
    maxHeight: "50px",
    padding: "10px 30px 10px 30px",
    fontSize: "medium",
    fontWeight: "bold",
    textTransform: "uppercase",
    "& .MuiAccordionSummary-content": {
      margin: "0px !important",
    },
  },
  detailFieldsRow2: {
    marginRight: 30,
    marginTop: "40px",
  },
  textArea: {
    height: 41,

    "& .MuiOutlinedInput-root": {
      height: 41,
    },
  },
}));

export default function LagelDescription(props) {
  const classes = useStyles();
  return (
    <Accordion className={classes.accordionRoot}>
      <AccordionSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
        expandIcon={<ExpandMoreIcon />}
        className={classes.accordionSummary}
      >
        Legal Description
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="row" justify="space-between" alignItems="center" style={{ margin: "5px 5px 5px 20px" }}>
          <Grid item xs={5}>
            <TextField
              //   margin="dense"
              label="Full Legal Description"
              fullWidth
              multilinde
              rows={4}
              variant="outlined"

              // onChange={({ target }) => setHeaderTitle({ ...title, number: target.value })}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              margin="dense"
              label="Gross Acres"
              fullWidth
              type="number"
              // onChange={({ target }) => setHeaderTitle({ ...title, number: target.value })}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              margin="dense"
              label="Net Acres"
              fullWidth
              type="number"
              // onChange={({ target }) => setHeaderTitle({ ...title, number: target.value })}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              margin="dense"
              label="Net Royalty Acres"
              fullWidth
              type="number"
              // onChange={({ target }) => setHeaderTitle({ ...title, number: target.value })}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
