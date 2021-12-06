import React from "react";
import { useSelector } from "react-redux";

import { Grid, Typography, Button } from "@material-ui/core";
import Add from "@material-ui/icons/Add";

import LandSearch from "../components/LandSearch";

export default function LandAppBar(props) {
  const { classes } = props;
  const { quickActionsPanelState } = useSelector(({ Land }) => Land);

  return (
    <Grid
      container
      direction="row"
      display="flex"
      justify="space-between"
      alignItems="center"
      style={{ marginLeft: quickActionsPanelState ? "433px" : "7px" }}
    >
      <Grid item md={8}>
        <Grid container direction="row" display="flex" justify="flex-start" alignItems="center">
          <Grid item md={2.5}>
            <Typography variant="h5" style={{ color: "black", fontWeight: "bold" }}>
              Agreements
            </Typography>
          </Grid>
          <Grid item md={5} style={{ marginLeft: "20px" }}>
            <LandSearch />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <div className={classes.filterTabs} style={{ paddingRight: "10px" }}>
          <Button color="secondary" variant="contained" startIcon={<Add />}>
            Add Agreement
          </Button>
        </div>
      </Grid>
    </Grid>
  );
}
