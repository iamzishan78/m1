import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Grid, Divider, Tab, Tabs, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import sortBy from "lodash/sortBy";

import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { GET_ES_MIN_VALUE } from "graphQL/useQueryESMinValue";
import { GET_PORTFOLIO_GROSS_REVENUE_SUMMARY } from "graphQL/useQueryGetPortfolioGrossRevenueSummary";
import { setStateIfDeepEqual } from "components/Shared/functions";
import CustomDates from "components/Revenue/components/Common/CustomDates";
import DetailTabsSection from "components/Analytics/components/Revenue/DetailTabsSection";
import ReportGroupHeader from "components/Shared/ReportGroupHeader";
import CheckDetailsSection from "./CheckDetailsSection";
import CheckComparisonTable from "./CheckComparisonSection/CheckComparisonTable";
import AnalyticsCards from "./Analytics";
import LastCheckDateFilter from "components/Revenue/components/Common/LastCheckDateFilter";

import SalesVolumeComparisonSection from "./SalesVolumeComparisonSection";
import { GET_CHECK_DETAILS_DATA } from "graphQL/useQueryCheckDetailsData";

const useStyles = makeStyles((theme) => ({
  mainTabContainer: {
    display: "flex",
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

  sectionCard: {
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": { minHeight: "calc(100vh - 265px) !important", maxHeight: "35vh" },
      },
    },
  },

  revenueTableInfContainer: {
    paddingTop: theme.spacing(1),
    // paddingLeft: "38px",
    // paddingRight: "38px",
    marginLeft: "-8px",
  },
  viewSwitcher: {
    height: "40px",
    backgroundColor: "white",
  },

  formControl: {
    width: "400px",
  },
}));

const StyledTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
    textTransform: "capitaliToze",
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
  const esIndex = "checkdetailsinterestscomparison_flat";
  const [esFilters, ESFilters] = useState([]);
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [propertyKeys, setPropertyKeys] = useState([]);
  const [propertyNumberFilter, setPropertyNumberFilter] = useState(null);
  const [filterToggle, setFilterToggle] = React.useState(false);
  const propertiesReportGroup = useSelector(({ Revenue }) => Revenue.propertiesReportGroup);
  const [tab, setTab] = useState(0);
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const [monthsInterval, setMonths] = useState([]);
  const [checkDetailsData, setCheckDetailsData] = useState([]);
  const [propertyFilter, setPropertyFilter] = useState([]);
  const [lastCheckMinDate, setLastCheckMinDate] = useState("");
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [checksCount, setChecksCount] = useState(0);
  const [misMatchedInterestsCount, setMisMatchedInterestsCount] = useState(0);
  const [potentialGainLossSum, setPotentialGainLossSum] = useState(0);
  const [totalChecks, setTotalChecks] = useState(0);
  const [propertyNumbers, setPropertyNumbers] = useState([]);
  const [checkNumbers, setCheckNumbers] = useState([]);
  const [comparisonReport, setComparisonReport] = useState("Check Detail Comparison");
  const loadMore = { type: "infiniteScroll", height: "calc(100vh - 166px)" };
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

  const [getPortfolioSummary, { data: portfolioSummary, loading }] = useLazyQuery(GET_PORTFOLIO_GROSS_REVENUE_SUMMARY, {
    fetchPolicy: "no-cache",
  });

  const [getCheckDetailData, { data: checkDetailData }] = useLazyQuery(GET_CHECK_DETAILS_DATA, {
    fetchPolicy: "no-cache",
  });

  const [getFilters, { data: filtersData }] = useLazyQuery(GET_ES_FILTER_LIST, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    getCheckDetailData({
      variables: {
        index: "checkdetailsinterestscomparison_flat",
      }
    })
    getFiltersAction();
  }, []);

  useEffect(() => {
    if (filtersData) {
      const keys = Object.keys(filtersData);
      if (keys && filtersData[keys[0]] && filtersData[keys[0]]?.hits)
        setPropertyOptions(filtersData[keys[0]].hits.map((hit) => hit.key_as_string));
      setPropertyKeys(
        filtersData[keys[0]].hits.map((hit) => ({
          key: typeof hit.key === "string" ? [hit.key] : hit.key,
          key_as_string: hit.key_as_string,
        }))
      );
    }
  }, [filtersData]);

  useEffect(() => {
    if (checkDetailData?.getCheckDetailsData?.checkDetails?.length > 0) {
      let data = [];
      for (let i = 0; i < checkDetailData?.getCheckDetailsData?.checkDetails?.length; i++) {
        const check = checkDetailData?.getCheckDetailsData?.checkDetails[i]._source;
        data.push({
          wells: check.wells,
          date: check.date,
          state: check?.property?.state,
          statementVolume: check.grossPropertyVolume || 0,
          product: check.product,
          ReportDate: check.date,
          oil: check.product === "OIL" ? check.grossPropertyVolume : 0,
          gas: check.product === "GAS" ? check.grossPropertyVolume : 0,
          water: check.product === "WATER" ? check.grossPropertyVolume : 0,
        });
      }
      data = sortBy(data, ["ReportDate"]);
      setCheckDetailsData(data);
    }
  }, [checkDetailData]);

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

  useEffect(() => {
    let filterDate = {};
    let filters = [];
    if (toDate && fromDate) filterDate = { toDate: new Date(toDate || Date.now()), fromDate: new Date(fromDate) };
    if (propertiesReportGroup) filters.push(propertiesReportGroup);
    if (propertyNumberFilter) filters.push(propertyNumberFilter);
    getPortfolioSummary({
      variables: {
        filters,
        filterDate,
      },
    });
  }, [propertiesReportGroup, toDate, fromDate, propertyNumberFilter]);

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

  const onGettingAnalytics = (analyticsList) => {
    const propertiesCount = analyticsList.propertiesCount;
    const checksCount = analyticsList.checksCount;
    const misMatchedInterestsCount = analyticsList.misMatchedInterestsCount;
    const potentialGainLossSum = analyticsList.potentialGainLossSum;
    setPropertiesCount(propertiesCount);
    setChecksCount(checksCount);
    setMisMatchedInterestsCount(misMatchedInterestsCount);
    setPotentialGainLossSum(potentialGainLossSum);
    setPropertyNumbers(analyticsList.propertyNumbers);
    setCheckNumbers(analyticsList.checkNumbers);
  };

  const setESFilters = (newFilter) => {
    setStateIfDeepEqual(ESFilters, newFilter);
  };

  const handlePropertyNumberChange = (search) => {
    getFiltersAction(search);
  };

  const handlePropertyFilterChange = (option) => {
    const propertyNumber = propertyKeys.find((property) => property.key_as_string === option);
    propertyNumber
      ? setPropertyNumberFilter({ field: "number.keyword", value: propertyNumber.key[0] })
      : setPropertyNumberFilter(null);
  };

  const getFiltersAction = (search) => {
    if (search) search = search.includes("-") ? `"*${search}*"` : `*${search}*`;
    getFilters({
      variables: {
        esIndex,
        filterKeys: ["property.number.keyword", "property.name.keyword"],
        search,
        size: 50,
      },
    });
  };

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
          <StyledTab label="Income Statement" />
          <StyledTab label="Check Ledger" />
          <StyledTab label="Comparisons" />
        </StyledTabs>
        {tab === 2 && (
          <Grid item xs md={2} style={{ marginTop: "2px", minWidth: "395px" }}>
            <Autocomplete
              size="small"
              onChange={(event, newValue) => setComparisonReport(newValue)}
              options={["Check Detail Comparison", "Sales Volume vs Reported Production"]}
              renderInput={(params) => (
                <form autoComplete="off">
                  <TextField {...params} variant="outlined" placeholder="" style={{ backgroundColor: "white" }} fullWidth={true} />
                </form>
              )}
              defaultValue={"Check Detail Comparison"}
              disableListWrap
              id="custom-date-dropdown"
            />
          </Grid>
        )}
      </div>

      {tab === 0 && (
        <>
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
                    setFilterToggle={() => { }}
                    isBackground={false}
                    noUpdate={true}
                    strechedWidth
                    isShrink
                    noPadding
                  />
                </Grid>
              </Grid>
              <Grid item xs={4} md={2} style={{ display: "flex", alignItems: "center" }}>

                <Grid item xs style={{ minWidth: "15%" }}>
                  <Autocomplete
                    size="small"
                    onChange={(event, newValue) => {
                      handlePropertyFilterChange(newValue)
                    }}
                    options={propertyOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Property"
                        variant="outlined"
                        placeholder=""
                        style={{ backgroundColor: "white" }}
                        onChange={(e) => handlePropertyNumberChange(e.target.value)}
                      />
                    )}
                    disableListWrap
                    id="custom-date-dropdown"
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
      )}

      {tab === 1 && (
        <div className={`${classes.sectionCard}`}>
          <CheckDetailsSection header="Check Details" loadMore={loadMore} />
        </div>
      )}

      {tab === 2 && (
        <>
          <LastCheckDateFilter
            field="date"
            esIndex={esIndex}
            esFilters={esFilters}
            setESFilters={setESFilters}
            setFilterToggle={setFilterToggle}
            filterToggle={filterToggle}
            propertyNumbers={propertyNumbers}
            checkNumbers={checkNumbers}
            extraFitlers={["propertyGroup", "checkNumber", "propertyNumber"]}
            stateESKey="property."
            isComparisonReport={comparisonReport === "Check Detail Comparison"}
          />
          {comparisonReport === "Sales Volume vs Reported Production" ? (
            <SalesVolumeComparisonSection checkDetailsData={checkDetailsData} esFilters={esFilters} loadMore={loadMore} />
          ) : (
            <>
              <AnalyticsCards
                propertiesCount={propertiesCount}
                misMatchedInterestsCount={misMatchedInterestsCount}
                potentialGainLossSum={potentialGainLossSum}
                checksCount={checksCount}
                esFilters={esFilters}
                setESFilters={setESFilters}
              />
              <div className={classes.revenueTableInfContainer}>
                <CheckComparisonTable
                  header="Property DOI vs Checkstub Interest"
                  loadMore={{ ...loadMore, height: "calc(100vh - 410px)" }}
                  esFilters={esFilters}
                  setESFilters={setESFilters}
                  onGettingAnalytics={onGettingAnalytics}
                  setTotalChecks={setTotalChecks}
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
