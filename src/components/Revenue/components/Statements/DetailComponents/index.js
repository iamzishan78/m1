import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, IconButton, CardActions, TextField, Tabs, Tab, Grid, Breadcrumbs } from "@material-ui/core";
import { LocalAtm as CurrencyIcon, NavigateNext as NavigateNextIcon, Close as CloseIcon } from "@material-ui/icons";
import Link from "@material-ui/core/Link";
import Tags from "components/Shared/Tagger";
import { useLocation } from "react-router";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from "@material-ui/icons/Add";
import CommentComponent from "components/Shared/CommentComponent";
import AddDialogeUploadZone from "components/ContactDetailCard/components/AddDialogUploadZone";
import { useLazyQuery } from "@apollo/client";
import { GETCHECK } from "graphQL/useQueryCheck";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { VIEWFILESQUERY } from "graphQL/useQueryViewFile";
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
  tags: {
    "& fieldset": {
      border: "none",
    },
  },

  viewAll: {
    textDecoration: "underline",
    margin: "0 0 8px 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  descriptionInput: {
    width: '100%',
    margin: "20px 0 0",
    '& .MuiTextField-root': {
      backgroundColor: '#fffcdc',
      borderRadius: 4,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  },
  foodText: {
    position: "absolute",
    bottom: "20px",
    right: "0px",
    fontSize: "10px",
    color: "#6e6e6e",
    margin: "0 !important",
    textAlign: "right",
    height: "0",
    paddingRight: "10px",
    "& span": {
      fontWeight: "bold",
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
  const [description, setDescription] = useState("");
  const [onFocusDescription, setFocusSate] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const { search } = location;

  const [uploadedFiles, setUploadedFiles] = useState([]);
  // queries 

  const [getESPaginatedList, { data: elasticData }] = useLazyQuery(GET_ES_PAGINATED_LIST, { fetchPolicy: "no-cache" });
  const tableData = elasticData?.getESPaginatedList;

  const [viewFiles, { data: viewFileResult, loading: viewFileLoading }] = useLazyQuery(VIEWFILESQUERY, {
    fetchPolicy: "no-cache",
  });

  const [getCheck, { data: getCheckResult }] = useLazyQuery(GETCHECK, {
    fetchPolicy: "no-cache",
  });

  console.log("getCheckResult", getCheckResult);
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
        viewFiles({
          variables: { fileIds: checkId },
        });
        getCheck({
          variables: { id: checkId },
        });
      }
    }
  }, [search]);


  const setUploadedFileData = (uploadedfile) => {
    setUploadedFiles([...uploadedFiles, uploadedfile]);
  };

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
        <div className="w-100" style={{ padding: 20, maxWidth: collapse ? "95%" : "70%" }}>
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
                  <Tags width="100%" targetSourceId={checkId} targetLabel="check" publicLeftBottom />
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
                <CheckDetailsSection checkId={checkId} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex column justifyStart alignStart w-100" style={{ marginTop: 20, marginRight: 24, padding: "16px 10px", background: "#ffffff", borderRadius: 8, minHeight: "calc(100vh + 12px)", height: "100%", maxWidth: collapse ? 40 : 360, width: "100%" }}>
          <div className="flex justifyBetween alignCenter w-100">
            {!collapse && (
              <Typography varient="h5" className={classes.titleText} style={{ textTransform: "uppercase", fontWeight: "bold" }}>
                Metadata
              </Typography>
            )}

            <div className="flex alignCenter">
              {!collapse ?
                <span onClick={() => setCollapse(true)}>
                  <ArrowForwardIcon style={{ fontSize: 20 }} />
                </span>
                :
                <span onClick={() => setCollapse(false)}>
                  <ArrowBackIcon style={{ fontSize: 20 }} />
                </span>
              }
            </div>
          </div>

          {!collapse && (
            <div className="flex column justifyStart w-100">
              <Grid item className={classes.descriptionInput}>
                <TextField
                  id="outlined-multiline-static"
                  label="Description"
                  value={description}
                  multiline
                  fullWidth
                  rows={5}
                  variant="outlined"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13)
                      console.log("sample description will go for save: " + description);
                    // console.log(e, 'description', unitProperties.description);
                  }}
                  onFocus={() => setFocusSate(true)}
                  InputProps={{
                    endAdornment: (
                      onFocusDescription === true &&
                      <p className={classes.foodText}>
                        <span>Return</span> to save
                      </p>
                    )
                  }}
                />
              </Grid>


              <div className="flex alignCenter" style={{ background: "#f2f2f2", borderRadius: 8, padding: "6px 16px", marginLeft: 8, marginTop: 8, maxWidth: "max-content", cursor: "pointer" }}>
                <span>
                  <AddIcon style={{ marginTop: 4, marginRight: 4, fontSize: 16, alignItems: "center" }} htmlColor="#000000" />
                </span>
                {` Add`}
              </div>


              <div className="flex justifyBetween alignCenter" style={{ padding: "20px 16px", marginBottom: -56 }}>
                <h4 style={{ margin: "0 0 8px 0", float: "left" }}>Documents</h4>
                <h4
                  className={classes.viewAll}
                  onClick={() => {
                    console.log("navigate to view all page for documents")
                  }}
                >
                  View All
                </h4>
              </div>

              <AddDialogeUploadZone
                isTransactPage={false}
                filesData={viewFileResult}
                id={checkId}
                loading={viewFileLoading}
                setUploadedFileData={setUploadedFileData}
              ></AddDialogeUploadZone>



              <div className={classes.tags} style={{ marginTop: -32 }}>
                <Tags width="100%" targetSourceId={checkId} targetLabel="check" publicLeftBottom />
              </div>
              <CommentComponent targetLabel={'check'} targetSourceId={checkId} />
            </div>
          )}
        </div>
      </div>
    </div >
  );
}