import React from "react";
import { Grid, Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

import AnalyticsCards from "components/Revenue/components/Properties/AnalyticsCards";

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
  dateRoot: {
    border: "1px solid #EBEBEB",
    backgroundColor: "#fff",
    "&.Mui-focused fieldset": {
      border: "1px solid black",
      backgroundColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "#EBEBEB",
    },
    "&:active": {
      border: "1px solid black",
      backgroundColor: "#fff",
    },
  },
}));

export default function Properties() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.actionBar}>
        <Grid container direction="row" display="flex" justify="space-between" style={{ padding: "0px 78px" }}>
          <Grid item xs={6} style={{ marginTop: "4px" }}>
            <Grid container direction="row" display="flex" alignItems="center" spacing={3}>
              <Grid item xs={4} style={{ marginTop: "2px" }}>
                <Autocomplete
                  size="small"
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
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Custom" placeholder="" style={{ backgroundColor: "white" }} />
                  )}
                  disableListWrap
                  // id="virtualize-aoi"
                />
              </Grid>
              <Grid item>
                <TextField
                  size="small"
                  margin="dense"
                  type="month"
                  variant="outlined"
                  placeholder=""
                  fullWidth
                  className={classes.inputFieldDate}
                  // onChange={(e) => {
                  //   setCloseDate(e.target.value);
                  // }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    classes: {
                      root: classes.dateRoot,
                      focused: classes.focused,
                      notchedOutline: classes.notchedOutline,
                    },
                  }}
                />
              </Grid>
              <Grid>
                <label>to</label>
              </Grid>
              <Grid item>
                <TextField
                  size="small"
                  margin="dense"
                  type="month"
                  variant="outlined"
                  placeholder="to"
                  fullWidth
                  className={classes.inputFieldDate}
                  // onChange={(e) => {
                  //   setCloseDate(e.target.value);
                  // }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    classes: {
                      root: classes.dateRoot,
                      focused: classes.focused,
                      notchedOutline: classes.notchedOutline,
                    },
                  }}
                />
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
