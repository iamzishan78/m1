import React, { useState, useRef, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, IconButton, Tabs, Tab } from "@material-ui/core";
import { LocalAtm as CurrencyIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "calc(100vh - 62px)",
    backgroundColor: "#f3f3f3",
    padding: "55px",
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
    padding: "20px",
  },
  tabsSection: {
    marginTop: "20px",
    backgroundColor: "#fff",
  },
  headerSection: {
    padding: "20px",
    minHeight: "400px",
  },
  summarySection: {
    padding: "20px",
    minHeight: "400px",
  },
  checkDetailsSection: {
    padding: "20px",
    minHeight: "400px",
  },
}));

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: "#1890ff",
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
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

export default function DetailComponents() {
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
    <div className={classes.root}>
      {/**
       * Detail title section
       */}
      <div className={classes.detailHeader}>
        <div className={classes.title}>
          <IconButton className={classes.icon}>
            <CurrencyIcon />
          </IconButton>
          <div className={classes.titleText}>
            <Typography style={{ fontWeight: "bold", fontSize: "large" }}>43736848334 - Exxon Mobile Corp</Typography>
            <Typography variant="caption">10/3/2021</Typography>
          </div>
        </div>
      </div>
      {/**
       * Detail tabs section
       */}
      <div className={classes.tabsSection}>
        <div className={classes.tabsHeader}>
          <AntTabs value={tab} onChange={(event, tab) => setTab(tab)} aria-label="ant example">
            <AntTab label="Header" />
            <AntTab label="Summary" />
            <AntTab label="Check Details" />
          </AntTabs>
        </div>
        <div style={{ maxHeight: "719px", overflow: "overlay" }}>
          <div style={{ padding: "0px 10px" }}>
            <div className={classes.headerSection} ref={tab === 0 ? selectedTabRef : null}>
              <Typography varient="h6">Header</Typography>
            </div>
            <div className={classes.summarySection} ref={tab === 1 ? selectedTabRef : null}>
              <Typography varient="h6">Summary</Typography>
            </div>
            <div className={classes.checkDetailsSection} ref={tab === 2 ? selectedTabRef : null}>
              <Typography varient="h6">Check Details</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
