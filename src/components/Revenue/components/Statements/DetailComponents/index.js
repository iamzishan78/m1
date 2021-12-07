import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, IconButton, Tabs, Tab, Grid, Breadcrumbs } from "@material-ui/core";
import { LocalAtm as CurrencyIcon, NavigateNext as NavigateNextIcon, Close as CloseIcon } from "@material-ui/icons";
import Link from "@material-ui/core/Link";
import Tags from "components/Shared/Tagger";
import { useLocation } from "react-router";

import { useLazyQuery } from "@apollo/client";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import moment from "moment";

// Components
import HeaderSection from "./HeaderSection";
import SummarySection from "./SummarySection";
import CheckDetailsSection from "./CheckDetailsSection";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: "#f3f3f3",
    width: "100%",
  },
  navSection: {
    minHeight: 56,
    padding: "10px 20px",
    backgroundColor: "#fff",
  },
  detailHeader: {
    backgroundColor: "#fff",
    padding: "20px 20px 8px 24px",
    borderRadius: 8
  },
  title: {
    display: "flex",
    alignItems: "center",
  },
  titleText: {
    marginLeft: 16,
  },
  highlighter: {
    background: "#263451",
    padding: "6px 16px",
    borderRadius: 16,
    width: "max-content"
  },
  highlight: {
    color: "#ffffff",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  icon: {
    height: 64,
    width: 64,
    backgroundColor: "lightgrey",
  },
  tabsHeader: {
    padding: "20px 20px 0px 20px",
    background: "#ffffff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  tabsSection: {
    marginTop: 24,
  },
  headerSection: {
    padding: "20px 30px",
    background: "#ffffff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  summarySection: {
    padding: 20,
    background: "#ffffff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  checkDetailsSection: {
    padding: 20,
    background: "#ffffff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  tags: {
    "& fieldset": {
      border: "none",
    },
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

export default function DetailComponents(props) {
  const history = useHistory();
  const classes = useStyles(props);
  const [tab, setTab] = useState(0);
  const [checkId, setCheckId] = useState(null);
  const [checkDetails, setCheckDetails] = useState(null);
  const selectedTabRef = useRef(null);
  const location = useLocation();

  const { search } = location;

  // queries 

  const [getESPaginatedList, { data: elasticData }] = useLazyQuery(GET_ES_PAGINATED_LIST, { fetchPolicy: "no-cache" });
  const tableData = elasticData?.getESPaginatedList;

  useEffect(() => {
    selectedTabRef.current &&
      selectedTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
  }, [tab]);

  const esIndex = "checks_flat";

  useEffect(() => {
    if (search !== "") {
      const checkId = search.replace("?id=", "");
      if (checkId) {
        setCheckId(checkId);
        getESPaginatedList({
          variables: {
            esIndex,
            pagination: {
              first: 50,
              keep_alive: "1micros"
            },
          },
        });
      }

    }
  }, [search]);



  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      const activeCheck = tableData?.hits.filter((check) => check._id === checkId.trim() && check);
      setCheckDetails(activeCheck[0]);
    }
  }, [tableData]);


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

              {checkDetails && (
                <Typography style={{ color: "#18AADD", fontSize: "16px", marginLeft: "5px" }}>{`${checkDetails.checkNumber} - ${checkDetails.payor["name"]}`}</Typography>
              )}
            </Breadcrumbs>
          </Grid>
          <Grid item>
            <IconButton onClick={() => history.push("/revenue/statements")}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      </div>
      <div className="flex justifyBetween alignStart w-100">
        <div className="w-100" style={{ padding: 20 }}>
          {/**
         * Detail title section
         */}
          <div className={`${classes.detailHeader} flex justifyBetween alignStart w-100`}>
            <div className="flex column alignStart justifyStart w-100">
              <div className={classes.title}>
                <IconButton className={classes.icon}>
                  <CurrencyIcon fontSize="large" />
                </IconButton>
                <div className={classes.titleText}>
                  {checkDetails && (
                    <Typography style={{ fontWeight: "bold", fontSize: "large", marginLeft: 8 }}>{`${checkDetails.checkNumber} - ${checkDetails.payor["name"]}`}</Typography>
                  )}
                  {checkDetails && (
                    <Typography variant="subtitle1" style={{ marginLeft: 8 }}>{moment.utc(checkDetails.checkDate).format("MM/DD/YYYY")}</Typography>
                  )}
                  <div className={classes.highlighter}>
                    <Typography className={classes.highlight} variant="highlight">Revenue Check</Typography>
                  </div>
                </div>
              </div>

              <Grid
                item
                xs={12}
                style={{ marginTop: 16 }}
              >
                <div className={classes.tags}>
                  <Tags width="100%" targetSourceId={"619ae183b5a69178952b6a9c"} targetLabel="revenue" publicLeftBottom />
                </div>
              </Grid>
            </div>

            <div className="flex justifyEnd alignStart w-100" style={{ maxWidth: 290, marginLeft: 8 }}>
              <img src="https://miro.medium.com/max/1400/1*ybR6fbfwo6XTmWvTjXSOAA.png" alt="map-view" height={200} width={290} style={{ borderRadius: 8 }} />
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


            <div style={{ maxHeight: "calc(100vh - 310px)", overflow: "overlay", backgroundColor: "#f3f3f3" }}>
              <div className={classes.headerSection} ref={tab === 0 ? selectedTabRef : null}>
                <HeaderSection details={checkDetails} />
              </div>
              <div style={{ backgroundColor: "#f3f3f3", height: 24 }} />
              <div className={classes.summarySection} ref={tab === 1 ? selectedTabRef : null}>
                <SummarySection />
              </div>
              <div style={{ backgroundColor: "#f3f3f3", height: 24 }} />
              <div className={classes.checkDetailsSection} ref={tab === 2 ? selectedTabRef : null}>
                <CheckDetailsSection />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, marginRight: 24, padding: 20, background: "#ffffff", borderRadius: 8, minHeight: "calc(100vh + 24px)", height: "100%", maxWidth: 360, width: "100%" }}>

        </div>
      </div>
    </div>
  );
}