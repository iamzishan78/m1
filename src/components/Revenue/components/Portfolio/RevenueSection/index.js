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

const RevenueSection = ({ monthsInterval, adjustmentsRef }) => {
  const classes = useStyles();
  const [items, setItems] = useState([
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
    {
      name: "Lease Payments",
      value: 44000,
      data: {},
      total: 0
    },
    {
      name: "Other",
      value: 13000,
      data: {},
      total: 0
    },
  ]);

  useEffect(() => {
    if (monthsInterval.length > 0) {
      const _items = copy(items);
      const adjustmentTotals = []
      monthsInterval.forEach((month) => {
        const rand = Math.floor(Math.random() * (125 - 80 + 1) + 80) / 100
        _items.forEach((item, index) => {
          item.value = Math.round(item.value * rand, 0);
          if (item.name === "Adjustments") {
            adjustmentTotals.push(item.value)
          }
          item.data[`${month}`] = item.value;
          item.total += item.value;
        });
      });
      _items.forEach((item) => {item.total = vf_number(item.total)})
      adjustmentsRef.current = adjustmentTotals
      setItems(_items);
    }
  }, [monthsInterval]);

  const total = React.useMemo(() => {
    let _total = 0;
    monthsInterval.forEach((month) => {
      items.filter((item) => ["Net Revenue", "Lease Payments", "Other"].includes(item.name)).forEach((item) => {
        item.data && (_total += item.data[month]);
      });
    })
    return vf_number(_total);
  }, [items, monthsInterval]);

  return (
    <>
      <Typography variant="h6" className={classes.sectionTitle}>
        Revenue & Income
      </Typography>
      <Grid container display="flex" direction="row" alignItems="center" justify="flex-start" spacing={3} className={classes.root}>
        <Grid item>
          <DonutChart items={items} total={total} />
        </Grid>
        <Grid item>
          <StackedChart items={items} total={total} monthsInterval={monthsInterval} />
        </Grid>
      </Grid>
      <RevenueTable monthsInterval={monthsInterval} items={items} total={total} />
    </>
  );
};

export default RevenueSection;
