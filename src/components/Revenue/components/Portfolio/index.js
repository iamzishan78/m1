import React from "react";
import { Grid, Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

import AnalyticsCards from "components/Revenue/components/Portfolio/AnalyticsCards";

const useStyles = makeStyles((theme) => ({
  actionBar: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
    marginTop: "100px",
  },
  actionsGrid: {
    marginTop: "6px",
    "& .MuiButtonBase-root": {
      width: "149px",
      height: "35px",
      fontWeight: "bold",
    },
  },
}));

export default function Portfolio() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.actionBar}>
        <Grid container direction="row" display="flex" justify="space-between" align="center" style={{ padding: "0px 36px" }}>
          <Grid item xs={6}>
            <Grid container direction="row" display="flex">
              <Grid item xs={3}>
                <Autocomplete
                  onChange={(event, newValue) => {}}
                  options={[
                    "This year-to-last-month",
                    "Yesterday",
                    "Recent",
                    "Last Week",
                    "Last week-to-date",
                    "Last Month",
                    "Last month-to-date",
                    "Last Quarter",
                    "Last quarter-to-date",
                    "Last Year",
                    "Last year-to-date",
                  ]}
                  renderInput={(params) => <TextField {...params} variant="outlined" label="Custom" placeholder="" />}
                  disableListWrap
                  id="virtualize-aoi"
                />
              </Grid>

              <Grid item xs={3}>
                <TextField variant="outlined" label="Custom" placeholder="" />
              </Grid>
              <Grid item xs={3}>
                <TextField variant="outlined" label="Custom" placeholder="" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container display="flex" justify="flex-end" direction="row" spacing={2} className={classes.actionsGrid}>
              <Grid item>
                <Button variant="contained" color="secondary">
                  Save View
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained">Run Report</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <AnalyticsCards />
    </>
  );
}
