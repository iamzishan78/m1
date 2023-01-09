import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, Tabs, Tab } from "@material-ui/core";

// Components
import RevenueSection from "./RevenueSection";
import AdjustmentSection from "./AdjustmentSection";
import ProductsSection from "./Products";
import { debounce } from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundColor: "#f3f3f3",
    width: "100%",
  },
  navSection: {
    minHeight: "52px",
    padding: "10px 20px",
    backgroundColor: "#fff",
  },
  detailHeader: {
    backgroundColor: "#fff",
    padding: "20px",
  },
  title: {
    display: "flex",
  },
  titleText: {
    margin: "2px 0px 0px 5px",
  },
  icon: {
    height: "65px",
    width: "65px",
    backgroundColor: "lightgrey",
  },
  tabsHeader: {},
  tabsSection: {
    marginTop: "10px",
    backgroundColor: "#fff",
    width: "100%",
  },
  revenueSection: {
    padding: "20px 38px",
    backgroundColor: "#fff",
    marginBottom: "20px",
    height: "auto",
  },
  adjustmentSection: {
    padding: "20px 38px",
    backgroundColor: "#fff",
    marginBottom: "20px",
    height: "auto",
  },
  productSection: {
    padding: "20px 38px",
    backgroundColor: "#fff",
    marginBottom: "20px",
  },
  propertiesSection: {
    padding: "20px 38px",
    backgroundColor: "#fff",
    height: "400px",
  },
  sectionTitle: {
    textTransform: "uppercase",
    fontWeight: theme.typography.fontWeightBold,
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

export default function DetailTabsSection({ monthsInterval, portfolioSummary, ...rest }) {
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const [isButtonScroll, setButtonScroll] = useState(false);
  const selectedTabRef = useRef(null);
  const [adjustmentTotals, setAdjustmentTotals] = useState([]);
  const [netRevenueTotals, setNetRevenueTotals] = useState([]);

  useEffect(() => {
    selectedTabRef.current &&
      selectedTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
  }, [tab]);

  const handleScroll = (e) => {
    if (!isButtonScroll) {
      const { scrollTop } = e.target;
      if (scrollTop <= 270 && tab !== 0) setTab(0);
      else if (scrollTop > 270 && scrollTop <= 470 && tab !== 1) setTab(1);
      else if (scrollTop > 470 && tab !== 2) setTab(2);
    }
    handleEndScroll();
  };

  const handleEndScroll = useMemo(() => debounce(() => setButtonScroll(false), 1000), []);
  const adjustmentsRef = useCallback(obj => {
    if (obj != null) {
      setAdjustmentTotals(obj);
    }
  }, []);

  const netRevenueRef = useCallback(obj => {
    if (obj != null) {
      setNetRevenueTotals(obj);
    }
  }, []);

  return (
    <div className={classes.tabsSection} >
      <div className={classes.tabsHeader} >
        <StyledTabs
          value={tab}
          onChange={(event, tab) => {
            setButtonScroll(true);
            setTab(tab);
          }}
          aria-label="ant example"
        >
          <StyledTab label="Revenue" />
          <StyledTab label="Adjustments" />
          <StyledTab label="Products" />
          {/* <StyledTab label="Properties" /> */}
        </StyledTabs>
      </div>
      <div style={{ overflow: "overlay", backgroundColor: "#f3f3f3", maxHeight: rest.isRevenueTab ? "calc(100vh - 385px)" : "calc(100vh - 235px)" }} onScroll={handleScroll}>
        <div className={classes.revenueSection} ref={tab === 0 ? selectedTabRef : null}>
          <RevenueSection monthsInterval={monthsInterval} portfolioSummary={portfolioSummary} adjustmentsRef={adjustmentsRef} netRevenueRef={netRevenueRef} />
        </div>
        <div className={classes.adjustmentSection} ref={tab === 1 ? selectedTabRef : null}>
          <AdjustmentSection monthsInterval={monthsInterval} portfolioSummary={portfolioSummary} adjustmentTotals={adjustmentTotals} />
        </div>
        <div className={classes.productSection} ref={tab === 2 ? selectedTabRef : null}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Products
          </Typography>
          <ProductsSection monthsInterval={monthsInterval} portfolioSummary={portfolioSummary} netRevenueTotals={netRevenueTotals} />
        </div>
        {/* temp hide until we get properties section designed --kc 20220307 */}
        {/* <div className={classes.propertiesSection} ref={tab === 3 ? selectedTabRef : null}>
          <Typography varient="h6" className={classes.sectionTitle}>
            Properties
          </Typography>
        </div> */}
      </div>
    </div >
  );
}
