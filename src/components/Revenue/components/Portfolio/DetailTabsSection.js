import React, { useState, useEffect, useRef } from "react";

import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, Tabs, Tab } from "@material-ui/core";

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
  tabsHeader: {
    padding: "20px 20px 0px 20px",
  },
  tabsSection: {
    marginTop: "20px",
    backgroundColor: "#fff",
  },
  headerSection: {
    padding: "20px 30px",
    backgroundColor: "#fff",
    marginBottom: "10px",
  },
  summarySection: {
    padding: "20px 30px",
    minHeight: "500px",
    backgroundColor: "#fff",
    marginBottom: "10px",
  },
  checkDetailsSection: {
    padding: "20px 30px",
    minHeight: "500px",
    backgroundColor: "#fff",
  },
}));

const StyledTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
    textTransform: "capitalize",
  },
  indicator: {
    backgroundColor: "#12abe0",
  },
})(Tabs);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "uppercase",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
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
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "black",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

export default function DetailTabsSection(props) {
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
          <StyledTab label="Properties" />
        </StyledTabs>
      </div>
      <div style={{ maxHeight: "calc(100vh - 310px)", overflow: "overlay", backgroundColor: "#f3f3f3" }}>
        <div className={classes.headerSection} ref={tab === 0 ? selectedTabRef : null}>
          <Typography varient="h6" style={{ textTransform: "uppercase" }}>
            Revenue
          </Typography>
        </div>
        <div className={classes.summarySection} ref={tab === 1 ? selectedTabRef : null}>
          <Typography varient="h6" style={{ textTransform: "uppercase" }}>
            Adjustments
          </Typography>
        </div>
        <div className={classes.checkDetailsSection} ref={tab === 2 ? selectedTabRef : null}>
          <Typography varient="h6" style={{ textTransform: "uppercase" }}>
            Products Details
          </Typography>
        </div>
      </div>
    </div>
  );
}
