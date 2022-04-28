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
    padding: "25px 0px 25px 0px",
    width: "inherit",
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
    "&>div": {
      flex: 1,
    },
  },
}));

const AdjustmentSection = ({ portfolioSummary }) => {
  const classes = useStyles();
  // const constItems = [
  //   {
  //     name: "Severance Tax",
  //     value: 0.15,
  //     data: {},
  //     total: 0
  //   },
  //   {
  //     name: "Transportation - Oil",
  //     value: 0.15,
  //     data: {},
  //     total: 0
  //   },
  //   {
  //     name: "Transportation - Gas",
  //     value: 0.20,
  //     data: {},
  //     total: 0
  //   },
  //   {
  //     name: "Compression",
  //     value: 0.15,
  //     data: {},
  //     total: 0
  //   },
  //   {
  //     name: "Processing",
  //     value: 0.15,
  //     data: {},
  //     total: 0
  //   },
  //   {
  //     name: "Lease Use",
  //     value: 0.05,
  //     data: {},
  //     total: 0
  //   },
  //   {
  //     name: "Other",
  //     value: 0.15,
  //     data: {},
  //     total: 0
  //   },
  // ];
  // const [items, setItems] = useState(constItems);

  // useEffect(() => {
  //   if (monthsInterval.length > 0 && adjustmentTotals.length > 0) {
  //     const _items = copy(constItems);
  //     let total = 0;
  //     _items.forEach((item) => {
  //       monthsInterval.forEach((month, index) => {
  //         item.data[`${month}`] = Math.round(adjustmentTotals[index] * item.value, 0);
  //         total += item.data[`${month}`];
  //       });
  //       item.total = vf_number(total);
  //       total = 0;
  //     });
  //     setItems(_items);
  //   }
  // }, [monthsInterval, adjustmentTotals]);

  // const total = useMemo(() => {
  //   if (items.length === 0) return 0;

  //   let _total = 0;
  //   monthsInterval.forEach((month) => {
  //     items.forEach((item) => {
  //       item.data && (_total += item.data[month]);
  //     });
  //   })
  //   return vf_number(_total);
  // }, [items, monthsInterval]);

  const items = portfolioSummary.adjustmentsDetails || [];
  const total = portfolioSummary.adjustmentTotal || 0;
  const monthsInterval = portfolioSummary.months || [];

  return (
    <>
      <Typography variant="h6" className={classes.sectionTitle}>
        Adjustments
      </Typography>
      <Grid container display="flex" direction="row" justify="flex-start" spacing={4} className={classes.root}>
        <Grid item md={5} style={{ paddingRight: "0px" }}>
          <DonutChart items={items.map((item) => ({ ...item, total: item?.total?.toFixed(0) }))} total={total} id="adjustment-chart" />
        </Grid>
        <Grid item md={7}>
          <StackedChart items={items} total={total} monthsInterval={monthsInterval} id="adjustment-chart-stacked" />
        </Grid>
      </Grid>
      <AdjustmentTable monthsInterval={monthsInterval} items={items} total={total} />
    </>
  );
};

export default AdjustmentSection;
