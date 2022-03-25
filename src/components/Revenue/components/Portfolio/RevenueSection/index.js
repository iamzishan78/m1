import React, { useEffect } from "react";
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import DonutChart from "./DonutChart";
import StackedChart from "./StackedChart";
import RevenueTable from "./RevenueTable";
import { useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { GET_PORTFOLIO_GROSS_REVENUE_SUMMARY } from "graphQL/useQueryGetPortfolioGrossRevenueSummary";


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

const RevenueSection = ({ adjustmentsRef, netRevenueRef }) => {
  const classes = useStyles();
  // const constItems = [
  //   {
  //     name: "Gross Revenue",
  //     value: 500000,
  //     data: {},
  //     total: 0
  //   },
  //   {
  //     name: "Adjustments",
  //     value: 95000,
  //     data: {},
  //     total: 0
  //   },
  //   {
  //     name: "Net Revenue",
  //     value: 405000,
  //     data: {},
  //     total: 0
  //   },
  //   // {
  //   //   name: "Lease Payments",
  //   //   value: 44000,
  //   //   data: {},
  //   //   total: 0
  //   // },
  //   // {
  //   //   name: "Other",
  //   //   value: 13000,
  //   //   data: {},
  //   //   total: 0
  //   // },
  // ];
  // const [items, setItems] = useState(constItems);
  // // const [donutItems, setDonutItems] = useState([]);
  // const [grossRevenue, setGrossRevenue] = useState([]);
  const propertiesReportGroup = useSelector(({ Revenue }) => Revenue.propertiesReportGroup);
  const filterDate = useSelector(({ Revenue }) => Revenue.filterDate);

  const [getPortfolioSummary, { data: portfolioSummary }] = useLazyQuery(GET_PORTFOLIO_GROSS_REVENUE_SUMMARY, {
    fetchPolicy: "no-cache"
  });

  const items = portfolioSummary?.getPortfolioSummary?.summaryDetails || []
  const total = portfolioSummary?.getPortfolioSummary?.total || 0
  const monthsInterval = portfolioSummary?.getPortfolioSummary?.months || []

  useEffect(() => {
    getPortfolioSummary({ variables: { filters: propertiesReportGroup || [], filterDate } })
  }, [propertiesReportGroup, filterDate])

  const chartItems = React.useMemo(() => {
    return items.filter((item) => ["Net Revenue", "Adjustments"].includes(item.name)) || []
  }, [portfolioSummary]);

  // useEffect(() => {
  //   setDonutItems([
  //     { category: 'Gross' }
  //   ])
  // }, [portfolioSummary])

  // useEffect(() => {
  //   if (monthsInterval.length > 0) {
  //     const _items = copy(constItems);
  //     const adjustmentTotals = [];
  //     const netRevenueTotals = [];
  //     // monthsInterval.forEach((month) => {
  //     //   const rand = Math.floor(Math.random() * (125 - 80 + 1) + 80) / 100
  //     //   _items.forEach((item, index) => {
  //     //     item.value = Math.round(item.value * rand, 0);
  //     //     if (item.name === "Adjustments") {
  //     //       adjustmentTotals.push(item.value)
  //     //     }
  //     //     if (item.name === "Net Revenue") {
  //     //       netRevenueTotals.push(item.value)
  //     //     }
  //     //     item.data[`${month}`] = item.value;
  //     //     item.total += item.value;
  //     //   });
  //     // });
  //     _items.forEach((item) => { item.totalK = vf_number(Math.floor(item.total / 1000)); item.total = vf_number(item.total) });
  //     adjustmentsRef(adjustmentTotals);
  //     netRevenueRef(netRevenueTotals);
  //     setItems(_items);
  //   }
  // }, [monthsInterval]);


  // const total = React.useMemo(() => {
  //   let _total = 0;
  //   monthsInterval.forEach((month) => {
  //     items.filter((item) => ["Net Revenue", "Lease Payments", "Other"].includes(item.name)).forEach((item) => {
  //       item.data && (_total += item.data[month]);
  //     });
  //   })
  //   return { withK: vf_number(Math.floor(_total / 1000)), withoutK: vf_number(Math.floor(_total)) }
  // }, [items, monthsInterval]);

  return (
    <>
      <Typography variant="h6" className={classes.sectionTitle}>
        Revenue
      </Typography>
      <Grid container display="flex" direction="row" alignItems="center" justify="flex-start" spacing={4} className={classes.root}>
        <Grid item md={5} style={{ paddingRight: '0px' }}>
          <DonutChart items={chartItems} total={total} />
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