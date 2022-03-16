import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

import Table from "./Table";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "25px 0px 25px 0px",
    width: "inherit",
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
    "&>div": {
      flex: 1
    }
  },
}));

export default function Products({ monthsInterval }) {
  const classes = useStyles();

  return (
    <Grid container display="flex" spacing={3} className={classes.root}>
      <Grid item xs={12}>
        <Table monthsInterval={monthsInterval} title="OIL" />
      </Grid>
      <Grid item xs={12}>
        <Table monthsInterval={monthsInterval} title="GAS" grossVolumeType="MCF" />
      </Grid>
      <Grid item xs={12}>
        <Table monthsInterval={monthsInterval} title="NGL" grossVolumeType="GAL" />
      </Grid>
      <Grid item xs={12}>
        <Table monthsInterval={monthsInterval} title="OTHER" />
      </Grid>
    </Grid>
  );
}
