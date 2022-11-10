import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import ProvisionType from "./ProvisionType";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default function ProvisionsFilters(props) {
  const classes = useStyles();
  return (
    <Grid container item spacing={2} style={{ padding: "8px", width: "100%", margin: "0" }}>
      <Grid item sm={12} className={classes.gridItem}>
        <ProvisionType />
      </Grid>
    </Grid>
  );
}
