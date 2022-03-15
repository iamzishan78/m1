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
    padding: "25px 50px 25px 0px",
  },
  sectionTitle: {
    textTransform: "uppercase",
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const RevenueSection = ({ monthsInterval }) => {
  const classes = useStyles();
  const [items, setItems] = useState([
    {
      name: "Gross Revenue",
      value: "3,000",
    },
    {
      name: "Adjustments",
      value: "900,000",
    },
    {
      name: "Net Revenue",
      value: "2,000",
    },
    {
      name: "Lease Payments",
      value: "44,000",
    },
    {
      name: "Other",
      value: "13,000",
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

  const total = React.useMemo(() => {
    let _total = 0;
    if (items.length > 0) {
      items.forEach((item) => (_total += Number(item.value.replace(/,/g, ""))));
    }
    _total = _total * monthsInterval.length;
    return vf_number(_total);
  }, [items, monthsInterval]);

  return (
    <>
      <Typography variant="h6" className={classes.sectionTitle}>
        Revenue & Income
      </Typography>
      <Grid container display="flex" direction="row" alignItems="center" justify="flex-start" spacing={3} className={classes.root}>
        <Grid item xs={5}>
          <DonutChart items={items} total={total} />
        </Grid>
        <Grid item xs={5}>
          <StackedChart items={items} total={total} monthsInterval={monthsInterval} />
        </Grid>
      </Grid>
      <RevenueTable monthsInterval={monthsInterval} items={items} total={total} />
    </>
  );
};

export default RevenueSection;
