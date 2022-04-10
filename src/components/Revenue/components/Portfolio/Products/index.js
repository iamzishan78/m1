import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import DonutChart from "./DonutChart";
import ProductTable from "./ProductTable";
import StackedAreaChart from "./StackedChart";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "25px 0px 25px 0px",
    width: "inherit",
    // display: "flex",
    // "flex-direction": "row",
    // "align-items": "stretch",
    // "&>div": {
    //   flex: 1
    // }
  },
}));

export default function Products({ portfolioSummary }) {
  const classes = useStyles();

  const productDetails = portfolioSummary.productDetails || []
  const total = portfolioSummary.revenueTotal || 0
  const monthsInterval = portfolioSummary.months || []

  const getUnit = (key) => {
    return key === 'GAS' ? 'MCF' : key === 'OIL' ? 'BBL' : key.includes('NGL') ? 'GAL' : ''
  }

  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item md={5} style={{ paddingRight: '0px' }}>
        <DonutChart productDetails={productDetails} getUnit={getUnit} />
      </Grid>
      <Grid item md={7}>
        <StackedAreaChart items={productDetails} total={total} monthsInterval={monthsInterval} />
      </Grid>
      {
        Object.keys(productDetails).map((key) =>
          <Grid item md={12}>
            <ProductTable monthsInterval={monthsInterval} name={key} items={productDetails[key]} total={total} unit={getUnit(key)} />
          </Grid>)
      }
    </Grid>
  );
}
