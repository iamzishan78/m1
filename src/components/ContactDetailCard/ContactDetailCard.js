import React, { useContext, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Comments from "../Shared/Comments";
import Tags from "../Shared/Tagger";
import Avatar from "react-avatar";
import M1nTable from "../Shared/M1nTable/M1nTable";
import RoomIcon from "@material-ui/icons/Room";
import Badge from "@material-ui/core/Badge";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import { anyToDate } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import { IconButton } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import FieldContent from "./components/FieldContent";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import { CONTACT } from "../../graphQL/useQueryContact";
import { TRANSACTIONDATA } from "../../graphQL/useQueryTransactionData";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useLazyQuery } from "@apollo/react-hooks";
import ConfirmationDialog from "./components/ConfirmationDialog";
import Activities from "../Shared/Activities";
import Deals from "../Shared/Deals";
import LeadScore from "../Shared/LeadScore";
import { AppContext } from "../../AppContext";
import RecentConversations from "../Shared/RecentConversations";

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
    paddingTop: "5px",
    width: "100%",
    margin: "0",
  },
  dataSect: {
    color: "#757575",
    width: "100%",
    marginTop: "10px",
    "& p": {
      margin: "10px",
      wordWrap: "break-word",
    },
    "& .dataLabels": {
      fontWeight: "bold",
    },
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
  ownersTable: {
    visibility: "hidden",
    "&  .MuiPaper-root>*": {
      visibility: "visible",
    },
  },
  addressIcon: { top: "3px", position: "relative" },
  socialMediaSection: {
    // float: "right",
    verticalAlign: "sub",
    "& svg": { fontSize: "1.7rem" },
  },
  mainGridContainer: {
    height: "100%",
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
    // background: "#17AADD",
    // color: "#fff",
    // height: "24px",
    // width: "24px",
    // padding: "3px",
    // margin: "3px",
    // borderRadius: "50%",
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
      color: "#14ABDF",
      margin: "0 5px",
      padding: "2px 12px",
      fontSize: "0.85rem",
      boxShadow: "none",
      textTransform: "none",
      // "& .MuiButton-startIcon.MuiButton-iconSizeSmall": {
      //   marginRight: "2px",
      // },
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
    top: "8px",
    left: "2px",
  },
  noTextDecoration: { textDecoration: "none" },
}));

export default function ContactDetailCard(props) {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [stateApp] = useContext(AppContext);
  const [transactData, setTransactData] = useState();
  const [transactId, setTransactId] = useState();
  const [contactData, setContactData] = useState(null);
  const [getContact, { loading, data }] = useLazyQuery(CONTACT, {
    fetchPolicy: "cache-and-network",
  });
  const [getTransactionData, { data: tData, tLoading }] = useLazyQuery(
    TRANSACTIONDATA
  );

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
      background: "white",
      color: "#0033de",
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
      <Grid container spacing={0} className={classes.mainGridContainer}>
        {/*/////////// left column //////////// */}
        <Grid
          item
          xs={9}
          style={{ MinHeight: "100%", backgroundColor: "#fff" }}
        >
          <Grid item container>
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
                  <StyleBadge badgeContent={5} color={"primary"}>
                    <Avatar name={contactData.name} size="93" round />
                  </StyleBadge>
                </div>
                <div className={classes.userName}>
                  <h2 style={{ width: "max-content" }}>
                    {/* {contactData.name} */}

                    <FieldContent
                      noInputFooter
                      noMargin
                      id={contactData._id}
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
                      content={{
                        companyName: contactData.companyName,
                        jobTitle: contactData.jobTitle,
                      }}
                    />
                  </h4>
                </div>
              </div>
            </Grid>
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

            {/*/////////// section 2 //////////// */}
            <Grid
              item
              xs={12}
              container
              className={`${classes.border} ${classes.dataSect}`}
              spacing={0}
            >
              <Grid item xs={6} container spacing={1}>
                <Grid item xs={5}>
                  <p className="dataLabels">Primary Email</p>
                </Grid>
                <Grid item xs={7}>
                  <FieldContent
                    onlyChildren
                    id={contactData._id}
                    content={{ primaryEmail: contactData.primaryEmail }}
                  >
                    <a
                      href={`mailto:${contactData.primaryEmail}`}
                      target="_blank"
                      className={classes.noTextDecoration}
                    >
                      {contactData.primaryEmail}
                    </a>
                  </FieldContent>
                </Grid>

                <Grid item xs={5}>
                  <p className="dataLabels">Secondary Email</p>
                </Grid>
                <Grid item xs={7}>
                  <FieldContent
                    onlyChildren
                    id={contactData._id}
                    content={{ secondaryEmail: contactData.secondaryEmail }}
                  >
                    <a
                      href={`mailto:${contactData.secondaryEmail}`}
                      target="_blank"
                      className={classes.noTextDecoration}
                    >
                      {contactData.secondaryEmail}
                    </a>
                  </FieldContent>
                </Grid>

                <Grid item xs={5}>
                  <p className="dataLabels">Mobile Phone</p>
                </Grid>
                <Grid item xs={7}>
                  <FieldContent
                    id={contactData._id}
                    content={{ mobilePhone: contactData.mobilePhone }}
                  />
                </Grid>

                <Grid item xs={5}>
                  <p className="dataLabels">Home Phone</p>
                </Grid>
                <Grid item xs={7}>
                  <FieldContent
                    id={contactData._id}
                    content={{ homePhone: contactData.homePhone }}
                  />
                </Grid>

                <Grid item xs={5}>
                  <p className="dataLabels">Alternate Phone</p>
                </Grid>
                <Grid item xs={7}>
                  <FieldContent
                    id={contactData._id}
                    content={{ AltPhone: contactData.AltPhone }}
                  />
                </Grid>

                <Grid item xs={5}>
                  <p className="dataLabels">Primary Address</p>
                </Grid>
                <Grid item xs={7}>
                  <FieldContent
                    name=""
                    id={contactData._id}
                    content={{
                      address1: contactData.address1,
                      address2: contactData.address2,
                      city: contactData.city,
                      state: contactData.state,
                      zip: contactData.zip,
                      country: contactData.country,
                    }}
                  />
                </Grid>

                <Grid item xs={5}>
                  <p className="dataLabels">Secondary Address</p>
                </Grid>
                <Grid item xs={7}>
                  <FieldContent
                    name=""
                    id={contactData._id}
                    content={{
                      address1Alt: contactData.address1Alt,
                      address2Alt: contactData.address2Alt,
                      cityAlt: contactData.cityAlt,
                      stateAlt: contactData.stateAlt,
                      zipAlt: contactData.zipAlt,
                      countryAlt: contactData.countryAlt,
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={6} container spacing={1}>
                <Grid item xs={5}>
                  <p className="dataLabels">Relatives</p>
                </Grid>
                <Grid item xs={7}>
                  <FieldContent
                    id={contactData._id}
                    content={{ relatives: contactData.relatives }}
                  />
                </Grid>

                <Grid item xs={5}>
                  <p className="dataLabels">Linkedln Profile</p>
                </Grid>
                <Grid item xs={7}>
                  <FieldContent
                    onlyChildren
                    id={contactData._id}
                    content={{ linkedln: contactData.linkedln }}
                  >
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
                        {contactData.linkedln}
                      </a>
                    )}
                  </FieldContent>
                </Grid>

                <Grid item xs={5}>
                  <p className="dataLabels">Facebook Profile</p>
                </Grid>
                <Grid item xs={7}>
                  <FieldContent
                    onlyChildren
                    id={contactData._id}
                    content={{ facebook: contactData.facebook }}
                  >
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
                        {contactData.facebook}
                      </a>
                    )}
                  </FieldContent>
                </Grid>

                <Grid item xs={5}>
                  <p className="dataLabels">Twitter Profile</p>
                </Grid>
                <Grid item xs={7}>
                  <FieldContent
                    onlyChildren
                    id={contactData._id}
                    content={{ twitter: contactData.twitter }}
                  >
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
                        {contactData.twitter}
                      </a>
                    )}
                  </FieldContent>
                </Grid>

                <Grid item xs={5}>
                  <p className="dataLabels">Lead Source</p>
                </Grid>
                <Grid item xs={7}>
                  <FieldContent
                    id={contactData._id}
                    content={{ leadSource: contactData.leadSource }}
                  />
                </Grid>

                <Grid item xs={5}>
                  <p className="dataLabels">Created By</p>
                </Grid>
                <Grid item xs={7}>
                  {contactData.createBy && contactData.createBy.name === null && (
                    <div className={classes.userSmallLoader}>
                      <CircularProgress size={22} color="secondary" />
                    </div>
                  )}
                  {(contactData.createBy && contactData.createBy.name) ||
                  contactData.createAt ? (
                    <p style={{ minHeight: "28px" }}>
                      {contactData.createBy && contactData.createBy.name
                        ? contactData.createBy.name
                        : ""}

                      {`${
                        contactData.createAt
                          ? " - " +
                            anyToDate(contactData.createAt).toLocaleString()
                          : ""
                      }`}
                    </p>
                  ) : (
                    <p className={classes.notAvailableP}>Not Available</p>
                  )}
                </Grid>

                <Grid item xs={5}>
                  <p className="dataLabels">Last Update By</p>
                </Grid>
                <Grid item xs={7}>
                  {contactData.lastUpdateBy &&
                    contactData.lastUpdateBy.name === null && (
                      <div className={classes.userSmallLoader}>
                        <CircularProgress size={22} color="secondary" />
                      </div>
                    )}
                  {(contactData.lastUpdateBy &&
                    contactData.lastUpdateBy.name) ||
                  contactData.lastUpdateAt ? (
                    <p style={{ minHeight: "28px" }}>
                      {contactData.lastUpdateBy && contactData.lastUpdateBy.name
                        ? contactData.lastUpdateBy.name
                        : ""}
                      {`${
                        contactData.lastUpdateAt
                          ? " - " +
                            anyToDate(contactData.lastUpdateAt).toLocaleString()
                          : ""
                      }`}
                    </p>
                  ) : (
                    <p className={classes.notAvailableP}>Not Available</p>
                  )}
                </Grid>
              </Grid>
            </Grid>

            {/*/////////// Recent Converstaion. //////////// */}
            <Grid item xs={12} className={`${classes.border}`}>
              <RecentConversations header={"Recent Conversations"} />
            </Grid>

            {/*/////////// section 3 //////////// */}
            {contactData &&
              contactData.owners &&
              contactData.owners.length > 0 && (
                <Grid
                  item
                  xs={12}
                  className={`${classes.border} ${classes.ownersTable}`}
                >
                  <M1nTable
                    parent="ownersPerContacts"
                    ownersIdsArray={contactData.owners}
                    contactId={props.contactId}
                  />
                </Grid>
              )}
          </Grid>
        </Grid>

        {/*/////////// rigth column //////////// */}
        <Grid
          className={classes.border}
          style={{ MinHeight: "100%", backgroundColor: "#F0F6F8" }}
          item
          xs={3}
        >
          <div style={{ marginBottom: "4px" }}>
            <Grid container className={classes.rightColumnGrid} spacing={1}>
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
                <Paper className={classes.paper}>
                  <Deals
                    contact={contactData}
                    transactData={transactData}
                    transactId={transactId}
                  />
                </Paper>
                <Paper className={classes.paper}>
                  <LeadScore
                    score={5}
                    //lastSeen={""}
                    lastContacted={"6 months ago"}
                    lastModified={"3 months ago"}
                  />
                </Paper>
                <Paper className={classes.paper}>
                  <Comments
                    targetSourceId={contactData._id}
                    targetLabel="contact"
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Activities
                    id={contactData._id}
                    activityLog={contactData.activityLog}
                  />
                </Paper>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <ConfirmationDialog
          openDialog={openDialog}
          handleDialogClose={setOpenDialog}
          handleCloseExpandableCard={props.handleCloseExpandableCard}
          id={contactData._id}
        />
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
      </Grid>
    )
  );
}
