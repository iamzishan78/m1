import React from "react";
import { Grid } from "@material-ui/core";

import Table from "./Table";

export default function Products({ monthsInterval }) {
  return (
    <Grid container display="flex" spacing={3}>
      <Grid item xs={12}>
        <Table monthsInterval={monthsInterval} title="OIL" />
      </Grid>
      <Grid item xs={12}>
        <Table monthsInterval={monthsInterval} title="GAS" />
      </Grid>
      <Grid item xs={12}>
        <Table monthsInterval={monthsInterval} title="NGL" />
      </Grid>
      <Grid item xs={12}>
        <Table monthsInterval={monthsInterval} title="OTHER" />
      </Grid>
    </Grid>
  );
}
