import React, { useState } from "react";
import { Grid, Button, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import AnalyticsCards from "components/Revenue/components/Common/AnalyticsCards";
import CustomDates from "components/Revenue/components/Common/CustomDates";
import DetailTabsSection from "components/Revenue/components/Portfolio/DetailTabsSection";
import ReportGroupHeader from "components/Shared/ReportGroupHeader";

const useStyles = makeStyles((theme) => ({
  actionBar: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
    marginTop: "100px",
  },
  actionsGrid: {
    marginTop: "6px",
    "& .MuiButtonBase-root": {
      width: "149px",
      height: "35px",
      fontWeight: "bold",
    },
  },
  divider: {
    height: "10px",
    backgroundColor: "#f3f3f3",
  },
}));

const cards = [
  {
    heading: "Total Revenue",
    points: "$48,643",
  },
  {
    heading: "Properties",
    points: "123",
  },
  {
    heading: "Needs Approval",
    points: "17",
    type: "warning",
  },
  {
    heading: "Potential Issues",
    points: "8",
    type: "error",
  },
];

export default function Portfolio() {
  const classes = useStyles();
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const [monthsInterval, setMonths] = useState([]);

  const [filterToggle, setFilterToggle] = React.useState(false);
  // props to pass in table
  // const esIndex = "shapes_flat";
  const [esFilters, setESFilters] = useState([]);

  const onChangeDates = (fromDate, toDate) => {
    const months = [];
    if (fromDate && toDate) {
      const fromYear = Number(fromDate.split("-")[0]),
        toYear = Number(toDate.split("-")[0]),
        fromMonth = Number(fromDate.split("-")[1]),
        toMonth = Number(toDate.split("-")[1]);
      for (let year = fromYear; year <= toYear; year++) {
        const startMonth = year === fromYear ? fromMonth : 1;
        const endMonth = year === toYear ? toMonth : 12;
        for (let month = startMonth; month <= endMonth; month++) {
          months.push(`${month}/${year}`);
        }
      }
    }
    setMonths(months);
  };

  return (
    <>
      <div className={classes.actionBar}>
        <Grid container direction="row" display="flex" justify="space-between" style={{ padding: "0px 36px" }}>
          <Grid item xs={8} md={8} style={{ marginTop: "4px" }}>
            <CustomDates
              onChangeDates={onChangeDates}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <Grid container display="flex" justify="flex-end" direction="row" spacing={2} className={classes.actionsGrid}>
              {/* <Grid item>
                <Button variant="contained" color="secondary">
                  Save View
                </Button>
              </Grid> */}
              <Grid item>
                <Button variant="contained" color="secondary">Run Report</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <ReportGroupHeader type={"Portfolios"} esFilters={esFilters} setESFilters={setESFilters} setFilterToggle={setFilterToggle} />
      </div>
      {/* <AnalyticsCards cards={cards} /> */}
      <Divider className={classes.divider} />
      <DetailTabsSection monthsInterval={monthsInterval} />
    </>
  );
}
