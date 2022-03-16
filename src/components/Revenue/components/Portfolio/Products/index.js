import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import Table from "./Table";
import vf_number from "components/Shared/valueformatters/vf_number";
import { copy } from "utils/helper";

const { useState, useMemo, useEffect } = React;

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

export default function Products({ monthsInterval, netRevenueTotals }) {
  const classes = useStyles();

  const [items, setItems] = useState([
    {
      name: "OIL",
      value: 0.60,
      data: {},
      total: 0
    },
    {
      name: "GAS",
      value: 0.15,
      data: {},
      total: 0
    },
    {
      name: "NGL",
      value: 0.20,
      data: {},
      total: 0
    },
    {
      name: "OTHER",
      value: 0.05,
      data: {},
      total: 0
    },
  ]);

  useEffect(() => {
    if (monthsInterval.length > 0 && netRevenueTotals.length > 0) {
      const _items = copy(items);
      let total = 0;
      _items.forEach((item) => {
        monthsInterval.forEach((month, index) => {
          item.data[`${month}`] = Math.round(netRevenueTotals[index] * item.value, 0);
          total += item.data[`${month}`];
        });
        item.total = vf_number(total);
        total = 0;
      });
      setItems(_items);
    }
  }, [monthsInterval, netRevenueTotals]);

  return (
    <Grid container display="flex" spacing={3} className={classes.root}>
      <Grid item xs={12}>
        <Table monthsInterval={monthsInterval} item={items[0]} title="OIL" price={86.0} />
      </Grid>
      <Grid item xs={12}>
        <Table monthsInterval={monthsInterval} item={items[1]} title="GAS" grossVolumeType="MCF" price={5.15} />
      </Grid>
      <Grid item xs={12}>
        <Table monthsInterval={monthsInterval} item={items[2]} title="NGL" grossVolumeType="GAL" price={0.61} />
      </Grid>
      <Grid item xs={12}>
        <Table monthsInterval={monthsInterval} item={items[3]} title="OTHER" price={1.99} />
      </Grid>
    </Grid>
  );
}
