import React, { useContext, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Comments from "../Shared/Comments";
import Tags from "../Shared/Tagger";
import Avatar from "react-avatar";
import M1nTable from "../Shared/M1nTable/M1nTable";
import Badge from "@material-ui/core/Badge";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import FieldContent from "./components/FieldContent";
import { CONTACT } from "../../graphQL/useQueryContact";
import { TRANSACTIONDATA } from "../../graphQL/useQueryTransactionData";
import { MELISSARECORDS } from "../../graphQL/useQueryGetMelissaRecords";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useLazyQuery } from "@apollo/react-hooks";
import ConfirmationDialog from "./components/ConfirmationDialog";
import Activities from "../Shared/Activities";
import Deals from "../Shared/Deals";
import LeadScore from "../Shared/LeadScore";
import { AppContext } from "../../AppContext";
import RecentConversations from "../Shared/RecentConversations";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import Divider from "@material-ui/core/Divider";
import RightDialog from "./components/RightDialog";
import Dialog from "@material-ui/core/Dialog";
import ExpandableCardProvider from "../ExpandableCard/ExpandableCardProvider";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import { useDispatch, useSelector } from "react-redux";
import { toggleRightColumn } from "../../actions";
import MessageRoundedIcon from "@material-ui/icons/MessageRounded";
import DescriptionRoundedIcon from "@material-ui/icons/DescriptionRounded";
import Card from "@material-ui/core/Card";
import HandShake from "../Shared/svgIcons/HandShake";
import Parcels from "./components/Parcels";
import WellsCard from "./components/WellsCard";
import RecentActivities from "../RecentActivities/RecentActivities";
import ContactDetailedInfo from "../ContactDetailedInfo/ContactDetailedInfo";

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
    WebkitTransition: "width 0.3s ease-out",
    width: ({ shrinkRightColumn }) => (shrinkRightColumn ? "68px" : "37%"),
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
    marginTop: "7 !important",
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
    "& a": { color: "#12ABE0 !important" },
  },
  tags: {
    "& fieldset": {
      border: "none",
    },
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
      boxShadow:
        "0px 2px 2px -1px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.12), 0px 1px 10px 0px rgba(0,0,0,0.1)",
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
    backgroundColor: "#fff",
    flexGrow: "1",
    transition: "width 0.3s ease-out",
    WebkitTransition: "width 0.3s ease-out",
  },
  shrinkRightColumn: {
    position: "absolute",
    top: "55px",
    left: "-13px",
    backgroundColor: theme.palette.secondary.main,
    color: "#fff",
    boxShadow:
      "0px 2px 7px 2px rgba(0,0,0,0.15), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
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
}));

export default function ContactDetailCard(props) {
  const dispatch = useDispatch();
  const shrinkRightColumn = useSelector(
    ({ ContactDetailCard }) => ContactDetailCard.shrinkRightColumn
  );
  const classes = useStyles({ ...props, shrinkRightColumn });
  const [openDialog, setOpenDialog] = useState(false);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [transactData, setTransactData] = useState();
  const [transactId, setTransactId] = useState();
  const [contactData, setContactData] = useState(null);
  const [melissaData, setMelissaData] = useState(null);
  const [rightDialogOpen, setRightDialogOpen] = useState(false);
  const [showExpandableCard, setShowExpandableCard] = useState(false);
  const [expCardSubComponent, setExpCardSubComponent] = useState(null);
  const [showShrinkColumnContent, setShowShrinkColumnContent] = useState(false);

  const [expCardSubComponentTitle, setExpCardSubComponentTitle] = useState(
    null
  );
  const [getContact, { loading, data }] = useLazyQuery(CONTACT, {
    fetchPolicy: "cache-and-network",
  });
  const [getTransactionData, { data: tData, tLoading }] = useLazyQuery(
    TRANSACTIONDATA
  );
  const [getMelissaRecords, { data: mData }] = useLazyQuery(MELISSARECORDS, {
    fetchPolicy: "network-only",
  });

  const handleClickRightDialogOpen = (childrenToOpen) => {
    setRightDialogOpen(childrenToOpen);
  };
  const handleClickRightDialogClose = (e) => {
    e.preventDefault();
    setRightDialogOpen(false);
  };

  const handleCloseExpandableCard = () => {
    setShowExpandableCard(false);
    // setStateApp((state) => ({
    //   ...state,
    //   popupOpen: false,
    //   expandedCard: false,
    // }));
  };
  const handleOpenExpandableCard = (subComponent, subComponentTitle) => {
    setExpCardSubComponent(subComponent);
    setExpCardSubComponentTitle(subComponentTitle);
    setShowExpandableCard(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowShrinkColumnContent(shrinkRightColumn);
    }, 300);
  }, [shrinkRightColumn]);

  useEffect(() => {
    if (props.contactId) {
      getContact({
        variables: {
          contactId: props.contactId,
        },
      });
    }
  }, [props.contactId]);

  useEffect(() => {
    if (data && data.contact) {
      setContactData(data.contact);
    }
  }, [data]);

  useEffect(() => {
    if (props.contactId) {
      getMelissaRecords({
        variables: {
          contactId: props.contactId,
        },
      });
    }
  }, [props.contactId]);

  useEffect(() => {
    if (mData && mData.getMelissaRecords.success === true) {
      setMelissaData(mData.getMelissaRecords);
    }
  }, [mData]);

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

  return (
    contactData && (
      <div className={classes.mainGridContainer}>
        {/*/////////// left column //////////// */}
        <Grid container className={classes.leftColumn}>
          {/*/////////// section 1 //////////// */}

          <Grid
            item
            xs={12}
            style={{
              padding: "20px 25px",
            }}
            className={classes.border}
          >
            <div className={classes.leftColumnTopRigthCorner}>
              <Button
                variant="contained"
                // size="small"
                onClick={() => {}}
              >
                Buy Info
              </Button>
              {contactData.primaryEmail && (
                <a href={"mailto:" + contactData.primaryEmail}>
                  <Button
                    variant="contained"
                    //  size="small"
                  >
                    Email
                  </Button>
                </a>
              )}

              <Button
                variant="contained"
                // size="small"
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                Delete
              </Button>
            </div>
            <div>
              <div className={classes.userIcon}>
                <StyleBadge
                  badgeContent={5}
                  //color={"#f6c16b"}
                >
                  <Avatar
                    className={classes.grey}
                    name={contactData.name}
                    size="93"
                    round
                  />
                </StyleBadge>
              </div>
              <div className={classes.userName}>
                <h2 style={{ width: "max-content" }}>
                  {/* {contactData.name} */}

                  <FieldContent
                    noInputFooter
                    noMargin
                    id={contactData._id}
                    entity={contactData.entity}
                    content={{ name: contactData.name }}
                  >
                    {(contactData.facebook ||
                      contactData.twitte ||
                      contactData.linkedln) && (
                      <span className={classes.socialMediaSection}>
                        {contactData.facebook && (
                          <a
                            href={`${
                              !contactData.facebook.startsWith("http") &&
                              !contactData.facebook.startsWith("//")
                                ? "//"
                                : ""
                            }${contactData.facebook}`}
                            target="_blank"
                          >
                            <FacebookIcon />
                          </a>
                        )}
                        {contactData.twitter && (
                          <a
                            href={`${
                              !contactData.twitter.startsWith("http") &&
                              !contactData.twitter.startsWith("//")
                                ? "//"
                                : ""
                            }${contactData.twitter}`}
                            target="_blank"
                          >
                            <TwitterIcon className={classes.twitterIcon} />
                          </a>
                        )}
                        {contactData.linkedln && (
                          <a
                            href={`${
                              !contactData.linkedln.startsWith("http") &&
                              !contactData.linkedln.startsWith("//")
                                ? "//"
                                : ""
                            }${contactData.linkedln}`}
                            target="_blank"
                          >
                            <LinkedInIcon />
                          </a>
                        )}
                      </span>
                    )}
                  </FieldContent>
                </h2>
                <h4>
                  <FieldContent
                    childrenLeft
                    noMargin
                    name="Address"
                    id={contactData._id}
                    entity={contactData.entity}
                    content={{
                      address1: contactData.address1,
                      address2: contactData.address2,
                      city: contactData.city,
                      state: contactData.state,
                      zip: contactData.zip,
                      country: contactData.country,
                    }}
                  />
                </h4>
                <h4>
                  <FieldContent
                    childrenLeft
                    noMargin
                    name={"Company Name Or Job Title"}
                    id={contactData._id}
                    entity={contactData.entity}
                    content={{
                      companyName: contactData.companyName,
                      jobTitle: contactData.jobTitle,
                    }}
                  />
                </h4>
              </div>
            </div>
          </Grid>
          {/*/////////// section 2 //////////// */}
          <Grid
            item
            xs={12}
            style={{
              padding: "20px 15px 10px 15px",
            }}
            className={classes.border}
          >
            <div className={classes.tags}>
              <Tags
                width="100%"
                targetSourceId={contactData._id}
                targetLabel="contact"
                publicLeftBottom
              />
            </div>
          </Grid>

          {/*/////////// section 3 //////////// */}
          <Grid
            item
            xs={12}
            container
            className={classes.border}
            spacing={0}
            style={{ padding: "23px 28px" }}
          >
            <ContactDetailedInfo
              header={"Detailed Information"}
              contactData={contactData}
              handleOpenExpandableCard={handleOpenExpandableCard}
              melissaData={melissaData}
              id={contactData._id}
            />
          </Grid>

          {/*/////////// new section //////////// */}
          <Grid
            container
            item
            xs={12}
            className={`${classes.border}`}
            style={{ padding: "23px 28px" }}
            spacing={0}
          >
            <Grid item xs={12}>
              <h4 style={{ margin: "0 0 13px 0", float: "left" }}>
                Associated Interest
              </h4>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card raised style={{ minHeight: "35px" }}>
                    <WellsCard
                      handleOpenExpandableCard={handleOpenExpandableCard}
                    />
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card raised style={{ minHeight: "35px" }}>
                    <Parcels
                      handleOpenExpandableCard={handleOpenExpandableCard}
                    />
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card raised style={{ minHeight: "35px" }}>
                    <LeadScore score={5} lastContacted={"Jun 24, 2020"} />
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/*/////////// new section //////////// */}
          <Grid item xs={12} className={`${classes.border}`}>
            <div className={classes.SectMargin}>
              <Grid item xs={12} style={{ minHeight: "33px" }}>
                <h4 style={{ margin: "0 0 13px 0", float: "left" }}>
                  Lead Stage Changed:
                  <span style={{ fontWeight: "normal" }}> 4 months ago</span>
                </h4>
                <h4 style={{ margin: "0 0 13px 0", float: "right" }}>
                  Last Contacted:
                  <span style={{ fontWeight: "normal" }}> 2 hours ago</span>
                </h4>
              </Grid>

              <Grid
                item
                xs={12}
                style={{ minHeight: "35px", backgroundColor: "#E2E9F0" }}
              ></Grid>
            </div>
          </Grid>

          {/*/////////// Recent Activities. //////////// */}
          <Grid item xs={12} className={`${classes.border}`}>
            <div className={classes.SectMargin}>
              <RecentActivities
                header={"Recent Activities"}
                handleOpenExpandableCard={handleOpenExpandableCard}
                id={contactData._id}
                user_id={stateApp.user.email}
                activityLog={contactData.activityLog}
              />
            </div>
          </Grid>

          {/*/////////// Recent Converstaion. //////////// */}
          <Grid item xs={12} className={`${classes.border}`}>
            <div className={classes.SectMargin}>
              <RecentConversations
                header={"Recent Conversations"}
                handleOpenExpandableCard={handleOpenExpandableCard}
              />
            </div>
          </Grid>

          {/*/////////// new section //////////// */}
          <Grid item xs={12} className={`${classes.border}`}>
            <div className={classes.SectMargin}>
              <Grid item xs={12}>
                <h4 style={{ marginBottom: "8px" }}>
                  Add Wells and Parcels to this contact
                </h4>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  options={[]}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Search Wells, Parcels"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment>
                            <SearchIcon htmlColor="#929292" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            </div>
          </Grid>

          {/*/////////// table section //////////// */}
          {/* {contactData && contactData.owners && contactData.owners.length > 0 && (
            <Grid
              item
              xs={12}
              className={`${classes.border} ${classes.ownersTable}`}
            >
              <div className={classes.SectMargin}>
                <M1nTable
                  parent="ownersPerContacts"
                  ownersIdsArray={contactData.owners}
                  contactId={props.contactId}
                />
              </div>
            </Grid>
          )} */}
        </Grid>

        {/*/////////// rigth column //////////// */}
        <div className={classes.rightColumnGrid}>
          <IconButton
            size="small"
            className={classes.shrinkRightColumn}
            onClick={() => {
              dispatch(toggleRightColumn());
            }}
          >
            {shrinkRightColumn ? (
              <ArrowBackIosRoundedIcon />
            ) : (
              <ArrowForwardIosRoundedIcon />
            )}
          </IconButton>
          {shrinkRightColumn || showShrinkColumnContent ? (
            <div style={{ width: "68px" }}>
              <IconButton
                className={classes.shrinkRightColumnIcons}
                style={{ padding: "8px" }}
              >
                <HandShake />
              </IconButton>

              <IconButton className={classes.shrinkRightColumnIcons}>
                <MessageRoundedIcon />
              </IconButton>

              <IconButton className={classes.shrinkRightColumnIcons}>
                <DescriptionRoundedIcon />
              </IconButton>
            </div>
          ) : (
            <Grid container spacing={0} id="expandedRCContent">
              {/* //////////// Deal Card ////////////// */}

              {/* TEMPORARY COMMENT OUT. DO NOT DELETE. */}
              {/* <Grid item xs={12}>
              <Paper className={classes.paper}>
                <div className={classes.divDealCard}>
                  <p className={classes.pDealCard}>
                    Add a deal for this contact?
                  </p>
                  <Button variant="contained" color="secondary">
                    Add Deal
                  </Button>
                </div>
              </Paper>
            </Grid>
             */}

              <Grid item xs={12}>
                <Deals
                  contact={contactData}
                  transactData={transactData}
                  transactId={transactId}
                  selectRowOpenContact={props.selectRowOpenContact}
                />
                <Divider />
              </Grid>

              <Grid item xs={12} className={classes.Comments}>
                <Comments
                  targetSourceId={contactData._id}
                  targetLabel="contact"
                  detailCard
                  top={2}
                  viewAll={handleClickRightDialogOpen}
                />
                <Divider />
              </Grid>

              {/* <Grid item xs={12}>
                <Activities
                  id={contactData._id}
                  user_id={stateApp.user.email}
                  activityLog={contactData.activityLog}
                />
                <Divider />
              </Grid> */}
            </Grid>
          )}
        </div>

        <ConfirmationDialog
          openDialog={openDialog}
          handleDialogClose={setOpenDialog}
          handleCloseExpandableCard={props.handleCloseExpandableCard}
          id={contactData._id}
        />

        {/* //// ViewAll in a right dialog //// */}

        <RightDialog
          open={rightDialogOpen ? true : false}
          handleClickDialogClose={handleClickRightDialogClose}
          width="450px"
        >
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

        {/* //// ViewAll in a full screen dialog //// */}
        {showExpandableCard && (
          <Dialog
            className={classes.dialogExpCard}
            fullWidth
            maxWidth="xl"
            open={showExpandableCard}
            onClose={handleCloseExpandableCard}
          >
            <ExpandableCardProvider
              expanded={true}
              handleCloseExpandableCard={handleCloseExpandableCard}
              title={"CONTACT DETAILS"}
              subTitle={" "}
              parent="table"
              mouseX={0}
              mouseY={0}
              position="relative"
              cardLeft={"0"}
              cardTop={"0"}
              zIndex={1201}
              cardWidthExpanded="100%"
              cardHeightExpanded="100%"
              targetSourceId={props.contactId}
              targetLabel={"contact"}
              noTrackAvailable={true}
              component={
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#fff",
                  }}
                >
                  {/* //// ViewAll card top bar //// */}
                  <Toolbar style={{ backgroundColor: "#F0F6F8" }}>
                    <h3 className={classes.expTardTopBarNav}>
                      <span>Leads</span>
                      {" > "}
                      <span
                        className={classes.expTardTopBarNavContName}
                        onClick={handleCloseExpandableCard}
                      >
                        {contactData && contactData.name
                          ? contactData.name
                          : ""}
                      </span>
                      {" > "}
                      {expCardSubComponentTitle}
                    </h3>
                  </Toolbar>
                  {expCardSubComponent}
                </div>
              }
            />
          </Dialog>
        )}

        {loading && (
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
        )}
      </div>
    )
  );
}
