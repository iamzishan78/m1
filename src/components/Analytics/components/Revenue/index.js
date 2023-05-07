import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Grid, Divider, Tab, Tabs } from "@material-ui/core";

import { GET_ES_MIN_VALUE } from "graphQL/useQueryESMinValue";
import { GET_PORTFOLIO_GROSS_REVENUE_SUMMARY } from "graphQL/useQueryGetPortfolioGrossRevenueSummary";

import CustomDates from "components/Revenue/components/Common/CustomDates";
import DetailTabsSection from "components/Analytics/components/Revenue/DetailTabsSection";
import ReportGroupHeader from "components/Shared/ReportGroupHeader";

const useStyles = makeStyles((theme) => ({
  mainTabContainer: {
    margin: "75px 0 10px",
  },
  actionBar: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
  },
  actionsGrid: {
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

const StyledTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
    textTransform: "capitalize",
    padding: "0px 26px",
  },
  indicator: {
    backgroundColor: "#12abe0",
    height: "4px",
  },
})(Tabs);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "uppercase",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightBold,
    marginRight: theme.spacing(4),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      color: "black",
      opacity: 1,
    },
    "&$selected": {
      color: "black",
    },
    "&:focus": {
      color: "black",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

export default function RevenueAnalytics(props) {
  const classes = useStyles();
  const propertiesReportGroup = useSelector(({ Revenue }) => Revenue.propertiesReportGroup);
  const [tab, setTab] = useState(0);
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const [monthsInterval, setMonths] = useState([]);
  const [propertyFilter, setPropertyFilter] = useState([]);
  const [lastCheckMinDate, setLastCheckMinDate] = useState("");

  const [getESMinValue] = useLazyQuery(GET_ES_MIN_VALUE, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data?.getESMinValue) {
        setLastCheckMinDate(data?.getESMinValue);
        // setFromDate(`${moment(data.getESMinValue).startOf('month').format("yyyy-MM-DD")}`);
        // setToDate(`${moment().subtract(1, 'months').endOf('month').format('yyyy-MM-DD')}`);
      }
    },
  });

  useEffect(() => {
    getESMinValue({
      variables: {
        esIndex: "checks_flat",
        field: "checkDate",
        value_as_string: true,
      },
    });
  }, [getESMinValue]);

  useEffect(() => {
    setFromDate(moment().startOf("year").format("yyyy-MM-DD"));
    setToDate(moment().subtract(1, "months").endOf("month").format("yyyy-MM-DD"));
  }, []);
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

  const [getPortfolioSummary, { data: portfolioSummary, loading }] = useLazyQuery(GET_PORTFOLIO_GROSS_REVENUE_SUMMARY, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    getPortfolioSummary({
      variables: {
        filters: propertiesReportGroup || [],
        filterDate: { toDate: new Date(toDate), fromDate: new Date(fromDate) },
      },
    });
  }, [propertiesReportGroup, toDate, fromDate]);

  return (
    <>
      <div className={classes.mainTabContainer}>
        <StyledTabs
          value={tab}
          onChange={(event, tab) => {
            setTab(tab);
          }}
          aria-label="ant example"
        >
          <StyledTab label="Income Stmt" />
          <StyledTab label="Comparison" disabled />
          {/* <StyledTab label="Properties" /> */}
        </StyledTabs>
      </div>
      <div className={classes.actionBar}>
        <Grid container direction="row" display="flex" spacing={4} style={{ padding: "0px 36px" }}>
          <Grid item xs={8} md={6} style={{ marginTop: "4px" }}>
            <Grid container display="flex" alignItems="center" spacing={3} justifyContent="space-between">
              <CustomDates
                onChangeDates={onChangeDates}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                isProperties={true}
                lastCheckMinDate={lastCheckMinDate}
                datesInputWidth={4}
              />
            </Grid>
          </Grid>
          <Grid item xs={4} md={2}>
            <Grid container display="flex" className={classes.actionsGrid}>
              <ReportGroupHeader
                type="Properties"
                esFilters={propertiesReportGroup || []}
                setESFilters={(value) => setPropertyFilter(value)}
                setFilterToggle={() => {}}
                isBackground={false}
                noUpdate={true}
                strechedWidth
                isShrink
                noPadding
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
      {/* <AnalyticsCards cards={cards} /> */}
      <Divider className={classes.divider} />

      <DetailTabsSection
        monthsInterval={monthsInterval}
        portfolioSummary={portfolioSummary?.getPortfolioSummary || {}}
        {...props}
        loading={loading}
      />
    </>
  );
}
