import React, { useState, useEffect } from "react";
import { makeStyles, Grid, Accordion, AccordionSummary, AccordionDetails, TextField } from "@material-ui/core";
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
    if (!title.number && title.name) {
      setTitle(`${title.name}`);
    } else if (!title.name && title.number) {
      setTitle(`${title.number}`);
    } else if (title.name && title.number) {
      setTitle(`${title.number}-${title.name}`);
    } else if (!title.number && !title.name) {
      setTitle("New Agreement");
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
          <Grid container direction="row" justify="space-between" alignItems="center" style={{ width: "100%" }}>
            <Grid item>
              <TextField
                margin="dense"
                label="Agreement Number"
                fullWidth
                onChange={({ target }) => setHeaderTitle({ ...title, number: target.value })}
              />
            </Grid>
            <Grid item>
              <TextField
                margin="dense"
                label="Agreement Name"
                fullWidth
                onChange={({ target }) => setHeaderTitle({ ...title, name: target.value })}
              />
            </Grid>
            <Grid item>
              <TextField
                select
                label="Agreement Type"
                fullWidth
                style={{ minWidth: 200 }}
                // onChange={({ target }) => setHeaderTitle({ ...title, name: target.value })}
              >
                <option key="Oil, gas" value="Oil, gas........">
                  Oil, gas
                </option>
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                select
                label="Agreement Status"
                fullWidth
                style={{ minWidth: 200 }}
                // onChange={({ target }) => setHeaderTitle({ ...title, name: target.value })}
              >
                <option key="Active" value="Active">
                  Active
                </option>
                <option key="DeActive" value="DeActive">
                  DeActive
                </option>
              </TextField>
            </Grid>
          </Grid>
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item>
              <TextField
                select
                margin="dense"
                label="Rights"
                fullWidth
                // onChange={({ target }) => setHeaderTitle({ ...title, number: target.value })}
              >
                <option key="Oil, gas" value="Oil, gas........">
                  Oil, gas
                </option>
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                margin="dense"
                label="Property Status"
                fullWidth
                // onChange={({ target }) => setHeaderTitle({ ...title, name: target.value })}
              >
                <option key="Oil, gas" value="Oil, gas........">
                  Held by Production
                </option>
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                select
                label="Agreement Type"
                fullWidth
                style={{ minWidth: 200 }}
                // onChange={({ target }) => setHeaderTitle({ ...title, name: target.value })}
              >
                <option key="Oil, gas" value="Oil, gas........">
                  Oil, gas
                </option>
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                select
                label="Agreement Status"
                fullWidth
                style={{ minWidth: 200 }}
                // onChange={({ target }) => setHeaderTitle({ ...title, name: target.value })}
              >
                <option key="Active" value="Active">
                  Active
                </option>
                <option key="DeActive" value="DeActive">
                  DeActive
                </option>
              </TextField>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default AgreementDetailSection;
