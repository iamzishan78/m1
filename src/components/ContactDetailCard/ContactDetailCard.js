// react core
import React, { useContext, useState, useEffect } from "react";
// mui styling
import { makeStyles, withStyles } from "@material-ui/core/styles";

// mui core components
import { Grid, IconButton, Tabs, Tab, Menu, MenuItem, Badge, CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import AddIcCallIcon from "@material-ui/icons/AddIcCall";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import { useHistory } from "react-router-dom";

// internal components
import Comments from "../Shared/Comments";
import Tags from "../Shared/Tagger";
import Avatar from "react-avatar";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import RequestPageIcon from "components/Shared/svgIcons/request_page";
import FieldContent from "./components/FieldContent";
import { CONTACT } from "../../graphQL/useQueryContact";
import { CONTACT_PURCHASE_DATA } from "graphQL/useQueryContactPurchaseData";
import { TRANSACTIONDATA } from "graphQL/useQueryTransactionData";
import { LASTMELISSARECORD } from "graphQL/useQueryGetMelissaRecords";
import { useLazyQuery, useMutation } from "@apollo/client";
import ConfirmationDialog from "./components/ConfirmationDialog";
import BuyContactsInfoDialogContent from "../Shared/M1nTable/components/SubComponents/BuyContactsInfoDialogContent";
import AddDealDialog from "components/Transact/components/DealDialog/AddDealDialog";
import RightDialog from "./components/RightDialog";
import Dialog from "@material-ui/core/Dialog";
import Toolbar from "@material-ui/core/Toolbar";
import { useSelector, useDispatch } from "react-redux";
import ContactDataMissingDialog from "./components/ContactDataMissingDialog";
import { UPDATECONTACT } from "graphQL/useMutationUpdateContact";
import DocViewer from "components/Shared/DocViewer";
import MetadataDrawer from "components/Revenue/components/Common/MetadataDrawer";
import AddActivityDialog from "../ContactDetailCard/components/AddActivityDialog";
import SummaryFields from "../ContactDetailedInfo/components/SummaryFields";
import ContactDetailedSelector from "./components/ContactDetailSelector";
import PipelinesFetchHoc from "components/Transact/components/Common/PipelinesFetchHoc";

import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Link from "@material-ui/core/Link";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { get } from "lodash";

// contexts
import { AppContext } from "AppContext";
import { NavigationContext } from "../Navigation/NavigationContext";
import { toggleRightColumn } from "actions/ContactDetailCard";
import { getAddressUrl } from "utils/helper";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { FEATURES } from "components/Shared/FeatureFlag/common";

const useStyles = makeStyles((theme) => ({
  Contacts: {
    color: "#011133",
    "&:hover": {
      cursor: "pointer",
      color: "rgb(18, 150, 194)",
    },
  },
  topBar: {
    color: "#12ABE0",
    backgroundColor: "rgb(239,239,239)",
    margin: "0 !important",
    paddingLeft: "10px !important",
    paddingTop: "15px",
    paddingBottom: "15px",
  },
  border: {
    borderBottom: "solid 1px #eaeaea",
  },
  rightColumnGrid: {
    display: "block",
    margin: "0",
    minHeight: "100%",
    backgroundColor: "#F0F6F8",
    position: "relative",
    transition: "width 0.3s ease-out",
    webkitTransition: "width 0.3s ease-out",
    width: ({ shrinkRightColumn }) => (shrinkRightColumn ? "0px" : "37%"),
  },
  gridStyling: {
    "& .MuiListItem-container": {
      borderBottom: "1px solid #c7c7c7",
    },
  },
  SectMargin: {
    margin: "23px 28px",
  },
  pDealCard: {
    fontWeight: "bold !important",
    marginTop: "8 !important",
    marginBottom: "7!important",
  },
  divDealCard: {
    padding: "11px",
    paddingLeft: "15px",
    paddingRight: "15px",
  },
  userIcon: {
    marginRight: "15px",
    float: "left",
  },
  userName: {
    color: "#919191",
    minWidth: "50%",
    maxWidth: "calc( 100% - 400px)",
    float: "left",
    fontWeight: "bold",
    "& h2": {
      margin: "0",
      color: "#202020",
      fontSize: "1.7em",
      maxWidth: "100%",
    },
    "& p": {
      margin: "0",
      maxWidth: "100%",
    },
    "& h4": { margin: "0" },
    "& a": { color: "#919191 !important" },
  },
  Comments: {
    "& fieldset": {
      border: "2px solid #DADEDF",
    },
    "& textarea": {
      fontSize: "0.85rem",
    },
  },
  CustomDialogBox: {
    "& fieldset": {
      border: "2px solid #DADEDF",
    },
    "& textarea": {
      fontSize: "0.85rem",
    },
  },
  ownersTable: {
    visibility: "hidden",
    "&  .MuiPaper-root>*": {
      visibility: "visible",
    },
  },
  addressIcon: { top: "3px", position: "relative" },
  socialMediaSection: {
    verticalAlign: "sub",
    "& svg": { fontSize: "1.7rem" },
  },
  mainGridContainer: {
    display: "flex",
    marginTop: "8px",
    height: "calc(100vh - 210px)",
    "& a": { color: "#757575" },
    "& .MuiPopover-paper": {
      zIndex: "1700",
    },
  },
  twitterIcon: {
    background: "#17AADD",
    color: "#fff",
    height: "21px",
    width: "21px",
    padding: "1px",
    margin: "3px",
    borderRadius: "2px",
  },
  notAvailableP: { color: "#898989b0", fontSize: "13px" },
  leftColumnTopRigthCorner: {
    width: "max-content",
    position: "relative",
    zIndex: "600",
    height: "0",
    float: "right",
    color: "#757575",
    "& a": {
      textDecoration: "none !important",
    },
    "& button": {
      backgroundColor: "#D5F4FF",
      color: theme.palette.secondary.main,
      margin: "0 5px",
      padding: "2px 12px",
      fontSize: "0.85rem",
      boxShadow: "none",
      textTransform: "none",
    },
    "& .MuiButton-contained:hover": {
      color: "#1da2cf",
      backgroundColor: "rgba(0, 0, 0, 0.08)",
      boxShadow: "0px 2px 2px -1px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.12), 0px 1px 10px 0px rgba(0,0,0,0.1)",
    },
  },
  userSmallLoader: {
    height: "0px",
    width: "22px",
    position: "relative",
    top: "6px",
    left: "2px",
  },
  noTextDecoration: { textDecoration: "none" },
  grey: {
    color: theme.palette.getContrastText("#808080"),
    backgroundColor: "#808080 !important",
  },
  dialogExpCard: {
    "& .MuiDialog-paperScrollPaper": {
      height: "100%",
    },
  },
  dialogFullScreen: {
    "& .MuiDialog-paperScrollPaper": {
      height: "100%",
      maxHeight: "100%",
      margin: "0px",
      width: "100%",
    },
  },
  dialog: {
    zIndex: "9999999999 !important",
  },
  linkClass: {},
  expTardTopBarNav: {
    fontWeight: "normal",
    flexGrow: 1,
    "& span": {
      color: theme.palette.secondary.main,
    },
  },
  expTardTopBarNavContName: {
    cursor: "pointer",
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": { color: "#757575" },
  },
  leftColumn: {
    MinHeight: "100%",
    backgroundColor: "#f2f2f2",
    flexGrow: "1",
    transition: "width 0.3s ease-out",
    webkitTransition: "width 0.3s ease-out",
    overflow: "overlay",
    maxHeight: "calc(100vh - 85px)",
    width: "100%",
  },
  shrinkRightColumn: {
    position: "absolute",
    top: "55px",
    left: "-13px",
    backgroundColor: theme.palette.secondary.main,
    color: "#fff",
    boxShadow: "0px 2px 7px 2px rgba(0,0,0,0.15), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
    padding: "5px",
    "& svg": { fontSize: "1rem" },
    "&:hover": {
      backgroundColor: "#EBEBEB",
      color: theme.palette.secondary.main,
    },
  },
  shrinkRightColumnIcons: {
    backgroundColor: "#6094a030",
    color: theme.palette.secondary.main,
    margin: "10px",
  },
  viewAll: {
    margin: "0 0 8px 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  menuIcon: {
    padding: "0px !important",
    margin: "0px 15px !important",
    "& svg": {
      cursor: "pointer",
      fill: "#808080 !important",
    },
  },

  emailButton: {
    backgroundColor: "#011133 !important",
    "& .MuiButton-label": {
      color: "white !important",
    },
  },
  disabledButton: {
    backgroundColor: "white !important",
    "& .MuiButton-label": {
      color: "grey !important",
    },
  },
  pulloutBox: {
    position: "absolute",
    top: "126px",
    right: 0,
    height: "80px",
    color: "white",
    width: "20px",
    background: "#141d32",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
      transform: "scaleX(0.5)",
    },
  },
  contactDataButton: {
    margin: "0px 5px",
    fontWeight: "600",
    border: "3px solid #eeebeb",
  },
  detailHeader: {
    backgroundColor: "#fff",
    padding: "20px",
    marginTop: "8px",
  },
  title: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  titleText: {
    marginLeft: 16,
    width: "100%",
    display: "flex !important",
    flexDirection: "column",
  },
  highlighter: {
    background: "#263451",
    padding: "5px 16px",
    borderRadius: 16,
    width: "max-content",
    transform: "translateX(5px) translateY(11px)",
    height: "32px",
  },
  highlight: {
    color: "#ffffff",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  tabsHeader: {
    background: "#ffffff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tabsSection: {},
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
  },
  tags: {
    "& fieldset": {
      border: "none",
    },
    width: "calc(100vw - 785px)",
  },
  metaActions: {
    position: "absolute",
    right: "15px",
    "& button": {
      margin: "0px 5px",
      color: "grey",
      fontWeight: "bold",
      textTransform: "capitalize",
      padding: "6px 12px",
    },
  },
  summarySection: {
    width: "100%",
    backgroundColor: "#fff",
  },
  detailCardSection: {
    backgroundColor: "#fff",
    marginTop: "3px",
    width: "100%",
  },
}));

const StyledTabs = withStyles({
  root: {
    textTransform: "capitalize",
  },
  indicator: {
    backgroundColor: "#12abe0",
    height: "5px",
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

function ContactDetailCard(props) {
  // contexts
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const dispatch = useDispatch();

  let history = useHistory();
  const pathName = history.location.pathname;
  const contactId = pathName.split("contact/details/")[1].replace("/", "");
  const shrinkRightColumn = useSelector(({ ContactDetailCard }) => ContactDetailCard.shrinkRightColumn);
  const classes = useStyles({ ...props, shrinkRightColumn });
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [transactData, setTransactData] = useState();
  const [transactId, setTransactId] = useState();
  const [contactData, setContactData] = useState(null);
  const [rightDialogOpen, setRightDialogOpen] = useState(false);
  const [showExpandableCard, setShowExpandableCard] = useState(false);
  const [expCardSubComponent, setExpCardSubComponent] = useState(null);
  const [showShrinkColumnContent, setShowShrinkColumnContent] = useState(false);
  const [showActivityDialog, setActivityDialog] = useState(null);
  const [purchaseData, setPurchaseData] = useState([]);

  const [expCardSubComponentTitle, setExpCardSubComponentTitle] = useState(null);

  const [getContact, { data }] = useLazyQuery(CONTACT);
  const [getContactPurchaseData, { data: contactPurchaseData }] = useLazyQuery(CONTACT_PURCHASE_DATA);

  const [getTransactionData, { data: tData, tLoading }] = useLazyQuery(TRANSACTIONDATA);

  const [getLastMelissaRecord] = useLazyQuery(LASTMELISSARECORD, {
    fetchPolicy: "network-only",
  });
  const [updateContact] = useMutation(UPDATECONTACT);

  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const handleClose = event => setAnchorEl(null);

  const handleClickRightDialogClose = (e) => {
    e.preventDefault();
    setRightDialogOpen(false);
  };

  const handleCloseExpandableCard = () => {
    setShowExpandableCard(false);
    setStateApp((state) => ({
      ...state,
      contactUpdated: null,
    }));
  };

  const handleExpandClick = async (type) => {
    setOpenDialog(type);
  };
  const handleCloseDialog = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      contactUpdated: null,
    }));
    setOpenDialog(false);
  };

  useEffect(() => {
    setActivityDialog(!!stateApp.activitySideDialog);
  }, [stateApp.activitySideDialog]);

  useEffect(() => {
    if (!showActivityDialog) {
      setStateApp(() => ({ ...stateApp, selectedActivity: null, activitySideDialog: false }));
    }
  }, [showActivityDialog]);

  useEffect(() => {
    setTimeout(() => {
      setShowShrinkColumnContent(shrinkRightColumn);
    }, 300);
  }, [shrinkRightColumn]);

  useEffect(() => {
    if (stateApp.selectedContact && stateApp.selectedContact === contactId) {
      getContact({
        variables: {
          contactId: stateApp.selectedContact,
        },
      });
      getContactPurchaseData({
        variables: {
          contactId: stateApp.selectedContact,
        },
      });
    } else if (contactId) {
      setStateApp((stateApp) => ({
        ...stateApp,
        selectedContact: contactId,
      }));
    }
  }, [contactId, getContact, setStateApp, stateApp.selectedContact]);

  useEffect(() => {
    if (contactPurchaseData?.getContactPurchaseData?.length > 0) {
      setPurchaseData(contactPurchaseData?.getContactPurchaseData);
    }
  }, [contactPurchaseData]);

  useEffect(() => {
    if (data && data.contact) {
      setContactData({ ...data.contact, metaOwner: { _id: data.contact.contactOwnerId } });
      setStateApp((stateApp) => ({
        ...stateApp,
        currentContatcAtivities: data.contact.activityLog,
      }));
    }
  }, [data, stateApp.contactUpdated]);

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
      getTransactionData({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [stateApp.user]);

  const StyleBadge = withStyles({
    badge: {
      transform: "unset",
      background: "#38c52e",
      color: "#fff",
      border: "2px solid",
      width: "30px",
      height: "30px",
      borderRadius: "50%",
    },
  })((props) => <Badge {...props} />);

  useEffect(() => {
    if (tData && tData.transactionData && tData.transactionData.allData) {
      setTransactData(tData.transactionData.allData);
      setTransactId(tData.transactionData._id);
    }
  }, [tData, tLoading]);

  useEffect(() => {
    return () => {
      setStateApp((stateApp) => ({
        ...stateApp,
        dealDialog: false,
        activeDeal: { cardId: null, laneId: null },
      }));
    };
  }, []);

  const checkModuleHistory = () => {
    if (stateNav.contactFromMap) {
      return !!stateNav.contactFromMap;
    } else if (history.pathHistory[1]?.includes("/map/")) {
      return true;
    }
    return !!stateNav.contactFromMap;
  };

  const ExtenstionGetter = (name) => {
    let fileExtension = name?.slice(name.lastIndexOf(".") + 1)?.toLowerCase();

    return fileExtension;
  };

  const getName = (contact) => {
    return contact.name || `${get(contact, "firstName", "")} ${get(contact, "lastName", "")}`;
  };
  const togglePullout = () => dispatch(toggleRightColumn());

  return contactData ? (
    <div style={{ position: "absolute", top: "41px", maxHeight: "calc(100vh - 64px)", width: "100%", backgroundColor: "#F2F2F2" }}>
      {/**
       * Detail title section
       */}
      <div className={`${classes.detailHeader} flex justifyBetween alignStart w-100`}>
        <div className="flex column alignStart justifyStart w-100">
          <div className={classes.title}>
            <StyleBadge>
              <Avatar
                color={Avatar.getRandomColor(
                  contactData.name ||
                  `${contactData.firstName ? contactData.firstName : contactData.name ? contactData.name.split(" ")[0] : ""}`,
                  ["#b5d2f6", "#ade2e9", "#eaeaea", "#f2c1e2", "#d7d6fb"])}
                // className={classes.grey}
                name={
                  (contactData.name ||
                    `${contactData.firstName ? contactData.firstName : contactData.name ? contactData.name.split(" ")[0] : ""}`).split(' ').splice(0, 2).join(' ')
                }
                size="93"
                round
              />

            </StyleBadge>
            <div className={classes.titleText}>
              <div className={classes.userName}>
                <h2 style={{ width: "max-content" }}>
                  <FieldContent
                    noInputFooter
                    noMargin
                    id={contactData._id}
                    entity={contactData.entity}
                    content={{ name: getName(contactData) }}
                    disabled
                  >
                    {(contactData.facebook || contactData.twitter || contactData.linkedIn) && (
                      <span className={classes.socialMediaSection}>
                        {contactData.facebook && (
                          <a
                            href={`${!contactData.facebook.startsWith("http") && !contactData.facebook.startsWith("//") ? "//" : ""}${contactData.facebook
                              }`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FacebookIcon />
                          </a>
                        )}
                        {contactData.twitter && (
                          <a
                            href={`${!contactData.twitter.startsWith("http") && !contactData.twitter.startsWith("//") ? "//" : ""}${contactData.twitter
                              }`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <TwitterIcon className={classes.twitterIcon} />
                          </a>
                        )}
                        {contactData.linkedIn && (
                          <a
                            href={`${!contactData.linkedIn.startsWith("http") && !contactData.linkedIn.startsWith("//") ? "//" : ""}${contactData.linkedIn
                              }`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <LinkedInIcon />
                          </a>
                        )}
                      </span>
                    )}
                  </FieldContent>
                </h2>
                <Link onClick={() => window.open(getAddressUrl(contactData), "_blank")}>
                  <FieldContent
                    childrenLeft
                    noMargin
                    name="Address"
                    id={contactData._id}
                    entity={contactData.entity}
                    disabled
                    content={{
                      address1: contactData.address1,
                      address2: contactData.address2,
                      city: contactData.city,
                      state: contactData.state,
                      zip: contactData.zip,
                      country: contactData.country,
                    }}
                  />
                </Link>
              </div>
              <div className={classes.tagsContainer}>
                <div className={classes.highlighter}>
                  <Typography className={classes.highlight} variant="highlight">
                    {get(contactData, "status", "Contact")}
                  </Typography>
                </div>
                <div className={classes.tags}>
                  <Tags width="100%" targetSourceId={contactData._id} targetLabel="contact" publicLeftBottom onlyTags />
                </div>
                <div className={classes.metaActions}>
                  <FeatureFlag feature={FEATURES.IDICORE}>
                    <Button
                      className={classes.contactDataButton}
                      startIcon={<RequestPageIcon color="grey" />}
                      onClick={() => {
                        handleExpandClick("buyContactsInfo");
                      }}
                    >
                      Contact Data
                    </Button>
                  </FeatureFlag>
                  <Button
                    className={classes.contactDataButton}
                    startIcon={<MonetizationOnIcon color="grey" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setStateApp((stateApp) => ({
                        ...stateApp,
                        dealDialog: true,
                      }));
                    }}
                  >
                    Add Deal
                  </Button>
                  <Button
                    className={classes.contactDataButton}
                    startIcon={<AddIcCallIcon color="grey" />}
                    onClick={() => setActivityDialog(true)}
                  >
                    Add Activity
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.mainGridContainer}>
        <Grid container className={classes.leftColumn} id="leftColumn">
          {stateApp.viewDoc && ExtenstionGetter(stateApp?.viewDoc.name) === "pdf" ? (
            <DocViewer
              divCondition={true}
              DocStyle={{
                position: "relative",
                height: "calc(100% - 5px)",
                width: "100vw"
              }}
            />
          ) : (
            <>
              <div className={classes.summarySection}>
                <Grid item xs={12} container spacing={0} style={{
                  padding: "5px 20px",
                  height: "550px",
                  // marginBottom: "-100px",
                  // marginTop: "20px",
                  textAlign: "center"
                }}>
                  <SummaryFields contactData={contactData} />
                </Grid>
              </div>
              <div className={classes.detailCardSection}>
                {/* <Divider sx={{backgroundColor: '#F2F2F2', borderBottomWidth: 5}}/> */}

                <Grid item xs={12} container className={classes.border} spacing={0}
                  style={{
                    padding: "0px 0px",
                    //  height: '100vh'
                  }}>
                  <ContactDetailedSelector
                    purchaseData={purchaseData}
                    contactData={contactData}
                    onAddActivity={setActivityDialog}
                  />
                </Grid>
              </div>
            </>
          )}
        </Grid>
        {/*/////////// rigth column //////////// */}
        <div className={classes.rightColumnGrid}>
          {!shrinkRightColumn && !showShrinkColumnContent && (
            <div
              style={{
                margin: "0px 15px",
                height: "calc(100vh - 210px)",
              }}
            >
              <MetadataDrawer
                title="Additional Details"
                documentsTitle="Recent Documents"
                setCollapse={() => togglePullout()}
                targetSourceId={contactData._id}
                showDescription={false}
                targetLabel="Contact"
                ownerTitle="Contact Owner"
                commentsWidth="23vw"
                viewAllDocuments
                menuComponent={
                  <IconButton className={classes.menuIcon} onClick={handleClick}>
                    <MoreHorizIcon id="MoreHorizIcon" fontSize="medium" aria-controls="simple-menu" aria-haspopup="true" />
                  </IconButton>
                }
                data={contactData}
                onUpdate={({ ownerName, owner }) => {
                  updateContact({
                    variables: {
                      contact: {
                        contactOwner: ownerName,
                        contactOwnerId: owner,
                        _id: contactData._id,
                        lastUpdateBy: stateApp.user.mongoId,
                      },
                      ignoreResponse: true,
                    },
                    refetchQueries: ["getPaginatedContacts", "getContact"],
                    awaitRefetchQueries: false,
                  });
                }}
                activityLog={contactData.activityLog}
                isSource={false}
              />

              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <FeatureFlag feature={FEATURES.IDICORE}>
                  <MenuItem
                    className={classes.userMenuItem}
                    onClick={(e) => {
                      if (!contactData.firstName || !contactData.lastName || !contactData.address1) {
                        handleExpandClick("contactDataMissing");
                      } else {
                        handleExpandClick("buyContactsInfo");
                      }
                      handleClose();
                    }}
                  >
                    Purchase contact data
                  </MenuItem>
                </FeatureFlag>
                <MenuItem
                  className={classes.userMenuItem}
                  onClick={(e) => {
                    handleClose();
                    handleExpandClick("deleteConfirmation");
                  }}
                >
                  Delete contact
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>
        {shrinkRightColumn && (
          <div className={classes.pulloutBox} onClick={togglePullout}>
            <ArrowBackIosIcon id="ArrowBackIosIcon" />
          </div>
        )}

        {openDialog === "buyContactsInfo" && (
          <RightDialog open={openDialog ? true : false} handleClickDialogClose={handleCloseDialog} width={"700px"}>
            <BuyContactsInfoDialogContent
              header="Contact Data Integration"
              onClose={handleCloseDialog}
              rows={[contactData]}
              setRows={() => { }}
              updateMelissaTable={() => {
                getLastMelissaRecord({
                  variables: {
                    contactId: stateApp.selectedContact,
                  },
                });
                updateContact({
                  variables: {
                    contact: {
                      _id: stateApp.selectedContact,
                      lastUpdateBy: stateApp.user.mongoId,
                    },
                    ignoreResponse: true,
                  },
                  refetchQueries: ["getPaginatedContacts", "getContact"],
                  awaitRefetchQueries: false,
                });
              }}
            />
          </RightDialog>
        )}

        {openDialog === "deleteConfirmation" && (
          <ConfirmationDialog openDialog={openDialog} handleDialogClose={setOpenDialog} id={contactData._id} />
        )}

        {openDialog === "contactDataMissing" && (
          <ContactDataMissingDialog openDialog={openDialog} onClose={handleCloseDialog} contacts={[{ ...contactData }]} />
        )}

        {/* //// ViewAll in a right dialog //// */}

        <RightDialog open={rightDialogOpen ? true : false} handleClickDialogClose={handleClickRightDialogClose} width="450px">
          {rightDialogOpen === "comments" && (
            <Grid item xs={12} className={classes.Comments}>
              <Comments
                className={classes.gridStyling}
                targetSourceId={contactData._id}
                targetLabel="contact"
                handleRightDialogClose={handleClickRightDialogClose}
              />
            </Grid>
          )}
        </RightDialog>
        {showExpandableCard && (
          <Dialog className={classes.dialogFullScreen} fullWidth maxWidth="xl" open={showExpandableCard} onClose={handleCloseDialog}>
            <div
              style={{
                width: "100%",
                backgroundColor: "#fff",
                minHeight: "100%",
              }}
            >
              <Toolbar style={{ backgroundColor: "#F0F6F8" }}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                  {checkModuleHistory() && (
                    <Link
                      className={classes.linkClass}
                      style={{
                        marginLeft: "5px",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                      color="inherit"
                      onClick={() => {
                        history.push(history.pathHistory[1]);
                        setStateNav((stateApp) => ({
                          ...stateApp,
                          contactFromMap: false,
                        }));
                      }}
                    >
                      Map
                    </Link>
                  )}
                  <Link
                    style={{
                      marginLeft: "5px",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    color="inherit"
                    onClick={() => history.push("/contacts")}
                  >
                    Contacts
                  </Link>
                  <Link
                    style={{
                      marginLeft: "5px",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    color="inherit"
                    onClick={handleCloseExpandableCard}
                  >
                    {contactData.name}
                  </Link>
                  <Typography
                    style={{
                      color: "#18AADD",
                      fontSize: "16px",
                      marginLeft: "5px",
                    }}
                  >
                    {expCardSubComponentTitle}
                  </Typography>
                </Breadcrumbs>
              </Toolbar>
              {expCardSubComponent}
            </div>
          </Dialog>
        )}
        {showActivityDialog && (
          <RightDialog open={true} handleClickDialogClose={() => setActivityDialog(false)} width="700px">
            <AddActivityDialog
              onClose={() => setActivityDialog(false)}
              id={props.id}
              contactData={contactData}
              selectedActivity={stateApp.selectedActivity}
            />
          </RightDialog>
        )}
        {stateApp.dealDialog && (
          <AddDealDialog
            open={stateApp.dealDialog ? true : false}
            width="450px"
            onClose={() =>
              setStateApp((stateApp) => ({
                ...stateApp,
                dealDialog: false,
                activeDeal: { cardId: null, laneId: null },
              }))
            }
            contactId={contactData?._id}
          />
        )}
      </div>
    </div>
  ) : (
    <div
      style={{
        padding: "20px",
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: "50",
      }}
    >
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  );
}

export default PipelinesFetchHoc(ContactDetailCard)