import React from "react";
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import DonutChart from "../RevenueSection/DonutChart";
import StackedChart from "../RevenueSection/StackedChart";
import AdjustmentTable from "./AdjustmentTable";
import vf_number from "components/Shared/valueformatters/vf_number";
import { copy } from "utils/helper";

const { useState, useMemo, useEffect } = React;

const useStyles = makeStyles((theme) => ({
  sectionTitle: {
    textTransform: "uppercase",
    fontWeight: theme.typography.fontWeightBold,
  },
  root: {
    padding: "25px 50px 25px 0px",
  },
}));

const AdjustmentSection = ({ monthsInterval }) => {
  const classes = useStyles();
  const [items, setItems] = useState([
    {
      name: "Severance Tax",
      value: "10,000",
    },
    {
      name: "Transportation - Oil",
      value: "20,000",
    },
    {
      name: "Transportation - Gas",
      value: "30,000",
    },
    {
      name: "Compression",
      value: "66,000",
    },
    {
      name: "Processing",
      value: "44,000",
    },
    {
      name: "Lease Use",
      value: "69,000",
    },
    {
      name: "Other",
      value: "29,000",
    },
  ]);

  useEffect(() => {
    if (monthsInterval.length > 0) {
      const _items = copy(items);
      let total = 0;
      _items.forEach((item, index) => {
        item.data = {};
        monthsInterval.forEach((month) => {
          item.data[`${month}`] = item.value;
          total += Number(item.value.replace(/,/g, ""));
        });
        item.total = vf_number(total);
        total = 0;
      });
      setItems(_items);
    }
  }, [monthsInterval]);

  const total = useMemo(() => {
    if (items.length === 0) return 0;

    let _total = 0;
    items.forEach((item) => {
      _total += Number(item.value.replace(/,/g, ""));
    });
    _total = _total * monthsInterval.length;
    return vf_number(_total);
  }, [items, monthsInterval]);

  return (
    <>
      <Typography variant="h6" className={classes.sectionTitle}>
        Adjustments
      </Typography>
      <Grid container display="flex" direction="row" alignItems="center" justify="flex-start" spacing={3} className={classes.root}>
        <Grid item xs={5}>
          <DonutChart items={items} total={total} id="adjustment-chart" />
        </Grid>
        <Grid item xs={5}>
          <StackedChart items={items} total={total} monthsInterval={monthsInterval} id="adjustment-chart-stacked" />
        </Grid>
      </Grid>
      <AdjustmentTable monthsInterval={monthsInterval} items={items} total={total} />
    </>
  );
};

export default AdjustmentSection;
