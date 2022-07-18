import React from "react";
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import DonutChart from "./DonutChart";
import StackedChart from "./StackedChart";
import RevenueTable from "./RevenueTable";

const useStyles = makeStyles((theme) => ({
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
  sectionTitle: {
    textTransform: "uppercase",
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const RevenueSection = ({ portfolioSummary }) => {
  const classes = useStyles();

  const items = portfolioSummary.summaryDetails || [];
  const total = portfolioSummary.revenueTotal || 0;
  const monthsInterval = portfolioSummary.months || [];

  const chartItems = React.useMemo(() => {
    return items.filter((item) => ["Net Revenue", "Adjustments"].includes(item.name)) || [];
  }, [portfolioSummary]);

  return (
    <>
      <Typography variant="h6" className={classes.sectionTitle}>
        Revenue
      </Typography>
      <Grid container display="flex" direction="row" alignItems="center" justify="flex-start" spacing={4} className={classes.root}>
        <Grid item md={5} style={{ paddingRight: "0px" }}>
          <DonutChart items={chartItems.map((ci) => ({ ...ci, total: ci?.total?.toFixed(0) }))} total={total} />
        </Grid>
        <Grid item md={7}>
          <StackedChart items={chartItems} total={total} monthsInterval={monthsInterval} />
        </Grid>
      </Grid>
      <RevenueTable monthsInterval={monthsInterval} items={items} total={total} />
    </>
  );
};

export default RevenueSection;
