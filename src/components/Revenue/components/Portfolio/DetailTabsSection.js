import React, { useState, useEffect, useRef } from "react";

import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, Tabs, Tab } from "@material-ui/core";

// Components
import RevenueTable from "./RevenueTable";
import AdjustmentTable from "./AdjustmentTable";
import ProductsSection from "./Products";

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
    marginBottom: "10px",
    height: "auto",
  },
  adjustmentSection: {
    padding: "20px 38px",
    backgroundColor: "#fff",
    marginBottom: "10px",
    height: "auto",
  },
  productSection: {
    padding: "20px 38px",
    backgroundColor: "#fff",
    marginBottom: "10px",
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

export default function DetailTabsSection({ monthsInterval }) {
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const selectedTabRef = useRef(null);

  useEffect(() => {
    selectedTabRef.current &&
      selectedTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
  }, [tab]);

  return (
    <div className={classes.tabsSection}>
      <div className={classes.tabsHeader}>
        <StyledTabs value={tab} onChange={(event, tab) => setTab(tab)} aria-label="ant example">
          <StyledTab label="Revenue" />
          <StyledTab label="Adjustments" />
          <StyledTab label="Products" />
          {/* <StyledTab label="Properties" /> */}
        </StyledTabs>
      </div>
      <div style={{ maxHeight: "calc(100vh - 282px)", overflow: "overlay", backgroundColor: "#f3f3f3" }}>
        <div className={classes.revenueSection} ref={tab === 0 ? selectedTabRef : null}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Revenue & Income
          </Typography>
          <RevenueTable monthsInterval={monthsInterval} />
        </div>
        <div className={classes.adjustmentSection} ref={tab === 1 ? selectedTabRef : null}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Adjustments
          </Typography>
          <AdjustmentTable monthsInterval={monthsInterval} />
        </div>
        <div className={classes.productSection} ref={tab === 2 ? selectedTabRef : null}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Products
          </Typography>
          <ProductsSection monthsInterval={monthsInterval} />
        </div>
        {/* temp hide until we get properties section designed --kc 20220307 */}
        {/* <div className={classes.propertiesSection} ref={tab === 3 ? selectedTabRef : null}>
          <Typography varient="h6" className={classes.sectionTitle}>
            Properties
          </Typography>
        </div> */}
      </div>
    </div>
  );
}
