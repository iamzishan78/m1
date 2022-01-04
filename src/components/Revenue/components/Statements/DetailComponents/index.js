import React, { useState, useRef, useEffect, useContext } from "react";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, IconButton, TextField, Tabs, Tab, Grid, Avatar, FormControl, InputAdornment } from "@material-ui/core";
import { LocalAtm as CurrencyIcon } from "@material-ui/icons";
import Tags from "components/Shared/Tagger";
import MetaField from "components/Table/helpers/MetaField";
import { useLocation } from "react-router";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";
import CommentComponent from "components/Shared/CommentComponent";
import AddDialogeUploadZone from "components/ContactDetailCard/components/AddDialogUploadZone";
import { useLazyQuery } from "@apollo/client";
import { GETCHECK } from "graphQL/useQueryCheck";
import { VIEWFILESQUERY } from "graphQL/useQueryViewFile";
import { GETMONGOUSERS } from "graphQL/useQueryGetUsers";
import { GETRECENTCONTACTFILES } from "graphQL/useQueryGetContactFiles";
import moment from "moment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AppContext } from "AppContext";
import CustomAvatar from "components/Shared/ui/CustomAvatar";

// Components
import HeaderSection from "./HeaderSection";
import SummarySection from "./SummarySection";
import CheckDetailsSection from "./CheckDetailsSection";
import NavHeader from "components/Revenue/components/Common/NavHeader";

const useStyles = makeStyles((theme) => ({
  gridStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  dealOwnerRoot: {
    border: "1px solid #EBEBEB",
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      paddingLeft: 26,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "&:hover.MuiOutlinedInput-root": {
      backgroundColor: "#EBEBEB",
    },
    "&:hover .MuiAutocomplete-popupIndicator": {
      visibility: "visible",
      padding: "2px",
      marginRight: "-2px",
    },
  },
  dealOwnerRootFocused: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid black",
    },
  },
  popupIndicator: {
    visibility: "hidden",
    padding: "2px",
    marginRight: "-2px",
    "&:hover": {
      visibility: "visible",
    },
  },
  inputFieldOwner: {
    marginBottom: "7px",
  },
  dealOwnerAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    color: "#fff",
    fontSize: "0.6rem",
    backgroundColor: "#4880F6",
    padding: "0.5em",
  },
  dealOwnerLabel: {
    marginLeft: 4,
  },
  detailHeader: {
    backgroundColor: "#fff",
    padding: "20px 20px 8px 24px",
    borderRadius: 8,
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
    width: "max-content",
  },
  highlight: {
    color: "#ffffff",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  icon: {
    height: 80,
    width: 80,
    backgroundColor: "lightgrey",
  },
  tabsHeader: {
    padding: "20px 20px 0px 20px",
    background: "#ffffff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tabsSection: {
    marginTop: 24,
  },
  headerSection: {
    padding: "20px 30px",
    background: "#ffffff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  summarySection: {
    padding: 20,
    background: "#ffffff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
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
    width: "100%",
    margin: "20px 0 0",
    "& .MuiTextField-root": {
      backgroundColor: "#fffcdc",
      borderRadius: 4,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
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
  tabsSectionDetails: {
    maxHeight: "calc(100vh - 450px)",
    overflow: "overlay",
    backgroundColor: "#f3f3f3",
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
  const classes = useStyles(props);
  const [tab, setTab] = useState(0);
  const [checkId, setCheckId] = useState(null);
  const selectedTabRef = useRef(null);
  const location = useLocation();
  const [description, setDescription] = useState("");
  const [onFocusDescription, setFocusSate] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [stateApp, setStateApp] = useContext(AppContext);
  const { search } = location;
  const [users, setUsers] = useState([]);
  const [ownerId, setOwnerId] = useState("");

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileRequestCounter, setFileRequestCounter] = useState(1);
  // queries
  const [getCheck, { data: getCheckResult }] = useLazyQuery(GETCHECK, {
    fetchPolicy: "no-cache",
  });
  const [getRecentFiles, { data: files }] = useLazyQuery(GETRECENTCONTACTFILES, {
    fetchPolicy: "cache-and-network",
    onCompleted: ({ getFileDescriptors }) => {
      let allActive = true;

      if (getFileDescriptors)
        for (let i = 0; i < getFileDescriptors.length; i++) {
          if (getFileDescriptors[i].fileState !== "active") {
            allActive = false;
            break;
          }
        }

      if (!allActive) {
        if (fileRequestCounter <= 40) {
          let waitBeforeRequestAgain = setTimeout(() => {
            setFileRequestCounter(fileRequestCounter + 1);
            getRecentFiles({
              variables: {
                relatedObjectId: stateApp.activeDeal?.cardId,
                relatedObjectType: "Deal",
              },
            });
            clearTimeout(waitBeforeRequestAgain);
          }, 1000);
        } else {
          setFileRequestCounter(1);
        }
      } else setFileRequestCounter(1);
    },
  });
  const [viewFiles, { data: viewFileResult, loading: viewFileLoading }] = useLazyQuery(VIEWFILESQUERY, {
    fetchPolicy: "no-cache",
  });
  const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
    fetchPolicy: "no-cache",
  });

  const checksFlatData = getCheckResult?.getCheck?.check;

  useEffect(() => {
    selectedTabRef.current &&
      selectedTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
  }, [tab]);

  useEffect(() => {
    if (search !== "") {
      const checkId = search.replace("?id=", "");
      if (checkId) {
        setCheckId(checkId);
        getRecentFiles({
          variables: {
            relatedObjectId: checkId,
            relatedObjectType: "Check",
          },
        });
        getCheck({
          variables: { id: checkId },
        });
        getAllMongoUsers();
      }
    }
  }, [search]);

  useEffect(() => {
    let ID = [];
    for (let i = 0; i < files?.getFileDescriptors.length; i++) {
      ID.push(files?.getFileDescriptors[i].fileId);
    }
    for (let i = 0; i < uploadedFiles.length; i++) {
      ID.push(uploadedFiles[i].addFileDescriptor.file.id);
    }
    viewFiles({
      variables: { fileIds: ID },
    });
  }, [files, uploadedFiles, viewFiles]);

  useEffect(() => {
    if (userLists && userLists.allMongoUsers) {
      setUsers(
        userLists.allMongoUsers.map((user) => ({
          value: user._id,
          text: user.name,
          email: user.email,
        }))
      );
    }
  }, [userLists]);

  const setUploadedFileData = (uploadedfile) => {
    setUploadedFiles([...uploadedFiles, uploadedfile]);
  };

  return (
    <NavHeader title={`${checksFlatData?.checkNumber} - ${checksFlatData?.payor["name"]}`}>
      <div className="flex justifyBetween alignStart w-100">
        <div className="w-100" style={{ padding: 20, maxWidth: "calc(100% - 380px)" }}>
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
                  {checksFlatData && (
                    <Typography
                      style={{ fontWeight: "bold", fontSize: "large", marginLeft: 8 }}
                    >{`${checksFlatData.checkNumber} - ${checksFlatData.payor["name"]}`}</Typography>
                  )}
                  {checksFlatData && (
                    <Typography variant="subtitle1" style={{ marginLeft: 8 }}>
                      {moment.utc(checksFlatData.checkDate).format("MM/DD/YYYY")}
                    </Typography>
                  )}
                  <div className={classes.highlighter}>
                    <Typography className={classes.highlight} variant="highlight">
                      Revenue Check
                    </Typography>
                  </div>
                </div>
              </div>

              <Grid item xs={12} style={{ marginTop: 16 }}>
                <div className={classes.tags}>
                  <Tags width="100%" targetSourceId={checkId} targetLabel="check" publicLeftBottom />
                </div>
              </Grid>
            </div>

            {/* <div className="flex justifyEnd alignStart w-100" style={{ maxWidth: 290, marginLeft: 8 }}>
              <img src="https://miro.medium.com/max/1400/1*ybR6fbfwo6XTmWvTjXSOAA.png" alt="map-view" height={200} width={290} style={{ borderRadius: 8 }} />
            </div> */}
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

            <div className={classes.tabsSectionDetails}>
              <div className={classes.headerSection} ref={tab === 0 ? selectedTabRef : null}>
                <HeaderSection details={checksFlatData} />
              </div>
              <div style={{ backgroundColor: "#f3f3f3", height: 24 }} />
              <div className={classes.summarySection} ref={tab === 1 ? selectedTabRef : null}>
                <SummarySection checkId={checkId} />
              </div>
              <div style={{ backgroundColor: "#f3f3f3", height: 24 }} />
              <div className={classes.checkDetailsSection} ref={tab === 2 ? selectedTabRef : null}>
                <CheckDetailsSection checkId={checkId} />
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex column justifyStart alignStart w-100"
          style={{
            marginTop: 20,
            marginRight: 24,
            padding: "16px 10px",
            background: "#ffffff",
            borderRadius: 8,
            maxHeight: "calc(100vh + 135px)",
            overflow: "auto",
            height: "100%",
            maxWidth: collapse ? 40 : 360,
            width: "100%",
          }}
        >
          <div className="flex justifyBetween alignCenter w-100">
            {!collapse && (
              <Typography varient="h5" className={classes.titleText} style={{ textTransform: "uppercase", fontWeight: "bold" }}>
                Metadata
              </Typography>
            )}

            <div className="flex alignCenter">
              {!collapse ? (
                <span onClick={() => setCollapse(true)}>
                  <ArrowForwardIcon style={{ fontSize: 18, cursor: "pointer" }} />
                </span>
              ) : (
                <span onClick={() => setCollapse(false)}>
                  <ArrowBackIcon style={{ fontSize: 18, cursor: "pointer" }} />
                </span>
              )}
            </div>
          </div>

          {!collapse && (
            <div className="flex column justifyStart w-100">
              <div style={{ marginTop: 10, marginLeft: 4 }}>
                <FormControl variant="outlined" fullWidth size="small">
                  <Grid container className={classes.gridStyle}>
                    <Grid item xs={3}>
                      <div>Owner</div>
                    </Grid>
                    <Grid item xs={9}>
                      <Autocomplete
                        options={users.filter((u) => u.text)}
                        onChange={(e, user) => {
                          setOwnerId(user?.value);
                        }}
                        value={users.find((user) => user?.value === ownerId) || null}
                        getOptionLabel={(option) => option.text}
                        getOptionSelected={(option) => option.value === ownerId}
                        classes={{
                          inputRoot: classes.dealOwnerRoot,
                          focused: classes.dealOwnerRootFocused,
                          popupIndicator: classes.popupIndicator,
                        }}
                        renderInput={(params) => (
                          <TextField
                            margin="dense"
                            {...params}
                            variant="outlined"
                            className={classes.inputFieldOwner}
                            InputLabelProps={{
                              ...params.InputLabelProps,
                              shrink: true,
                              classes: {
                                root: classes.dealOwnerLabel,
                              },
                            }}
                            placeholder="Assign Owner"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <InputAdornment position="start">
                                    <Avatar className={classes.dealOwnerAvatar}>
                                      {users.find((user) => user?.value === ownerId) ? (
                                        <CustomAvatar
                                          diglog={true}
                                          email={users.find((user) => user?.value === ownerId).email}
                                          text={
                                            users
                                              .find((user) => user?.value === ownerId)
                                              .text.toString()
                                              .toUpperCase()
                                              .split(" ").length > 1
                                              ? users.find((user) => user?.value === ownerId).text.toString()
                                              : "Add Owner"
                                          }
                                        />
                                      ) : (
                                        "AO"
                                      )}
                                    </Avatar>
                                  </InputAdornment>
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </FormControl>
              </div>

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
                    if (e.keyCode === 13) {
                      setFocusSate(false);
                      setDescription("");
                    }
                  }}
                  onFocus={() => setFocusSate(true)}
                  InputProps={{
                    endAdornment: onFocusDescription === true && (
                      <p className={classes.foodText}>
                        <span>Return</span> to save
                      </p>
                    ),
                  }}
                />
              </Grid>

              <div
                onClick={() => {
                  setStateApp((stateApp) => ({
                    ...stateApp,
                    showFieldModal: true,
                  }));
                }}
                className="flex alignCenter"
                style={{
                  background: "#f2f2f2",
                  borderRadius: 8,
                  padding: "6px 16px",
                  marginLeft: 4,
                  marginTop: 8,
                  maxWidth: "max-content",
                  cursor: "pointer",
                }}
              >
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
                    console.log("navigate to view all page for documents");
                  }}
                >
                  View All
                </h4>
              </div>

              <AddDialogeUploadZone
                filesData={viewFileResult}
                id={checkId}
                loading={viewFileLoading}
                isRevenueDetailPage="Check"
                setUploadedFileData={setUploadedFileData}
              ></AddDialogeUploadZone>

              <div className={classes.tags}>
                <Tags width="100%" targetSourceId={checkId} targetLabel="check" publicLeftBottom />
              </div>
              <CommentComponent targetLabel={"check"} targetSourceId={checkId} />
            </div>
          )}
        </div>
      </div>

      {stateApp.showFieldModal && <MetaField columns={[]} category="Check" />}
    </NavHeader>
  );
}
