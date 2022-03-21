import React, { useEffect } from "react";
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import DonutChart from "./DonutChart";
import StackedChart from "./StackedChart";
import RevenueTable from "./RevenueTable";
import vf_number from "components/Shared/valueformatters/vf_number";
import { copy } from "utils/helper";

const { useState } = React;

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
  sectionTitle: {
    textTransform: "uppercase",
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const RevenueSection = ({ monthsInterval, adjustmentsRef, netRevenueRef }) => {
  const classes = useStyles();
  const constItems = [
    {
      name: "Gross Revenue",
      value: 500000,
      data: {},
      total: 0
    },
    {
      name: "Adjustments",
      value: 95000,
      data: {},
      total: 0
    },
    {
      name: "Net Revenue",
      value: 405000,
      data: {},
      total: 0
    },
    // {
    //   name: "Lease Payments",
    //   value: 44000,
    //   data: {},
    //   total: 0
    // },
    // {
    //   name: "Other",
    //   value: 13000,
    //   data: {},
    //   total: 0
    // },
  ];
  const [items, setItems] = useState(constItems);

  useEffect(() => {
    if (monthsInterval.length > 0) {
      const _items = copy(constItems);
      const adjustmentTotals = [];
      const netRevenueTotals = [];
      monthsInterval.forEach((month) => {
        const rand = Math.floor(Math.random() * (125 - 80 + 1) + 80) / 100
        _items.forEach((item, index) => {
          item.value = Math.round(item.value * rand, 0);
          if (item.name === "Adjustments") {
            adjustmentTotals.push(item.value)
          }
          if (item.name === "Net Revenue") {
            netRevenueTotals.push(item.value)
          }
          item.data[`${month}`] = item.value;
          item.total += item.value;
        });
      });
      _items.forEach((item) => { item.totalK = vf_number(Math.floor(item.total / 1000)); item.total = vf_number(item.total) });
      adjustmentsRef(adjustmentTotals);
      netRevenueRef(netRevenueTotals);
      setItems(_items);
    }
  }, [monthsInterval]);

  console.log(items)

  const total = React.useMemo(() => {
    let _total = 0;
    monthsInterval.forEach((month) => {
      items.filter((item) => ["Net Revenue", "Lease Payments", "Other"].includes(item.name)).forEach((item) => {
        item.data && (_total += item.data[month]);
      });
    })
    return { withK: vf_number(Math.floor(_total / 1000)), withoutK: vf_number(Math.floor(_total)) }
  }, [items, monthsInterval]);

  const donutItems = React.useMemo(() => {
    return items.filter((item) => ["Net Revenue", "Adjustments"].includes(item.name))
  }, [items]);

  return (
    <>
      <Typography variant="h6" className={classes.sectionTitle}>
        Revenue
      </Typography>
      <Grid container display="flex" direction="row" alignItems="center" justify="flex-start" spacing={4} className={classes.root}>
        <Grid item md={5} style={{ paddingRight: '0px' }}>
          <DonutChart items={donutItems} total={items[0].totalK} />
        </Grid>
        <Grid item md={7}>
          <StackedChart items={donutItems} total={total.withoutK} monthsInterval={monthsInterval} />
        </Grid>
      </Grid>
      <RevenueTable monthsInterval={monthsInterval} items={items} total={total.withoutK} />
    </>
  );
};

export default RevenueSection;
