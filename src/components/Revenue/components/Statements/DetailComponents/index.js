import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, IconButton, Tabs, Tab, Grid, Breadcrumbs } from "@material-ui/core";
import { LocalAtm as CurrencyIcon, NavigateNext as NavigateNextIcon, Close as CloseIcon } from "@material-ui/icons";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: 0,
    zIndex: 1,
    height: "100vh",
    backgroundColor: "#f3f3f3",
    width: "100%",
  },
  navSection: {
    minHeight: "52px",
    padding: "10px 20px",
    backgroundColor: "#fff",
    width: "100%",
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
    minHeight: "400px",
    backgroundColor: "#fff",
    marginBottom: "10px",
  },
  summarySection: {
    padding: "20px 30px",
    minHeight: "400px",
    backgroundColor: "#fff",
    marginBottom: "10px",
  },
  checkDetailsSection: {
    padding: "20px 30px",
    minHeight: "400px",
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

export default function DetailComponents() {
  const history = useHistory();
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
       * Detail Header
       */}
      <div className={classes.navSection}>
        <Grid container alignItems="center" direction="row" display="flex" justify="space-between">
          <Grid item>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Link
                style={{ marginLeft: "5px", fontSize: "16px", cursor: "pointer", fontWeight: "bold" }}
                color="inherit"
                onClick={() => history.push("/revenue/statements")}
              >
                Revenue Statements
              </Link>

              <Typography style={{ color: "#18AADD", fontSize: "16px", marginLeft: "5px" }}>Sample Statement</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item>
            <IconButton onClick={() => history.push("/revenue/statements")}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      </div>
      <div style={{ padding: "20px" }}>
        {/**
         * Detail title section
         */}
        <div className={classes.detailHeader}>
          <div className={classes.title}>
            <IconButton className={classes.icon}>
              <CurrencyIcon fontSize="large" />
            </IconButton>
            <div className={classes.titleText}>
              <Typography style={{ fontWeight: "bold", fontSize: "large" }}>43736848334 - Exxon Mobile Corp</Typography>
              <Typography variant="subtitle1">10/3/2021</Typography>
            </div>
          </div>
        </div>
        {/**
         * Detail tabs section
         */}
        <div className={classes.tabsSection}>
          <div className={classes.tabsHeader}>
            <StyledTabs value={tab} onChange={(event, tab) => setTab(tab)} aria-label="ant example">
              <StyledTab label="Header" />
              <StyledTab label="Summary" />
              <StyledTab label="Check Details" />
            </StyledTabs>
          </div>
          <div style={{ maxHeight: "719px", overflow: "overlay", backgroundColor: "#f3f3f3" }}>
            <div style={{ padding: "0px 10px" }}>
              <div className={classes.headerSection} ref={tab === 0 ? selectedTabRef : null}>
                <Typography varient="h6" style={{ textTransform: "uppercase" }}>
                  Header
                </Typography>
              </div>
              <div className={classes.summarySection} ref={tab === 1 ? selectedTabRef : null}>
                <Typography varient="h6" style={{ textTransform: "uppercase" }}>
                  Summary
                </Typography>
              </div>
              <div className={classes.checkDetailsSection} ref={tab === 2 ? selectedTabRef : null}>
                <Typography varient="h6" style={{ textTransform: "uppercase" }}>
                  Check Details
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
