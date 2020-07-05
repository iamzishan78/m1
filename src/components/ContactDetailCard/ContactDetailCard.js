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
import Badge from '@material-ui/core/Badge';
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
    borderBottom: "solid 1px rgb(212, 227, 247)",
    borderLeft: "solid 1px rgb(212, 227, 247)",
  },
  rightColumnGrid: {
    paddingTop: "5px",
    width: "100%",
    margin: "0",
  },
  dataSect: {
    color: "#595959",
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
    margin: "20px",
    float: "left",
  },
  userName: {
    color: "#595959",
    minWidth: "50%",
    float: "left",
    "& h1": { marginBottom: "0" },
    "& p": { marginBottom: "0" },
    "& h4": { margin: "0" },
  },
  tags: {
    "& fieldset": {
      border: "1px solid rgba(32, 32, 32, 0)",
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
    float: "right",
  },
  mainGridContainer: {
    height: "100%",
    "& a": { color: "#12ABE0" },
    "& .MuiPopover-paper": {
      zIndex: "1700",
    },
  },
  twitterIcon: {
    background: "#17AADD",
    color: "#fff",
    height: "18px",
    width: "18px",
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
      color: "#757575",
      margin: "5px",
      padding: " 1px 3px 1px 4px",
      fontSize: "0.75rem",
      "& .MuiButton-startIcon.MuiButton-iconSizeSmall": {
        marginRight: "2px",
      },
    },
  },
  userSmallLoader: {
    height: "0px",
    width: "22px",
    position: "relative",
    top: "8px",
    left: "2px",
  },
}));

export default function ContactDetailCard(props) {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [stateApp] = useContext(AppContext);
  const [transactData, setTransactData] = useState();
  const [transactId, setTransactId] = useState();
  const [getContact, { loading, data }] = useLazyQuery(CONTACT);
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
      transform: 'unset',
      background: 'white',
      color: '#0033de',
      border: '2px solid',
      width: '30px',
      height: '30px',
      borderRadius: '50%'
    },
  })((props) => (
    <Badge
      {...props}
    />
  ));

  useEffect(() => {
    if (tData && tData.transactionData && tData.transactionData.allData) {
      setTransactData(tData.transactionData.allData);
      setTransactId(tData.transactionData._id);
    }
  }, [tData, tLoading]);

  return data && data.contact && !loading ? (
    <Grid container spacing={0} className={classes.mainGridContainer}>
      {/*/////////// left column //////////// */}
      <Grid item xs={9} style={{ MinHeight: "100%", backgroundColor: "#fff" }}>
        <Grid item container>
          {/*/////////// section 1 //////////// */}

          <Grid item xs={12} className={classes.border}>
            <div className={classes.leftColumnTopRigthCorner}>
              {data.contact.primaryEmail && (
                <a href={"mailto:" + data.contact.primaryEmail}>
                  <Button
                    variant="contained"
                    size="small"
                    variant="outlined"
                    startIcon={<MailOutlineIcon />}
                  >
                    Email
                  </Button>
                </a>
              )}

              <Button
                variant="contained"
                size="small"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                Delete
              </Button>
            </div>
            <div>
              <div className={classes.userIcon}>
                <StyleBadge badgeContent={5} color={'primary'}>
                  <Avatar name={data.contact.name} size="80" round />
                </StyleBadge>
              </div>
              <div className={classes.userName}>
                <h1 style={{ width: "max-content" }}>
                  {/* {data.contact.name} */}

                  <FieldContent
                    noInputFooter
                    noMargin
                    id={data.contact._id}
                    content={{ name: data.contact.name }}
                  >
                    {(data.contact.facebook ||
                      data.contact.twitte ||
                      data.contact.linkedln) && (
                      <span className={classes.socialMediaSection}>
                        {data.contact.facebook && (
                          <a
                            href={`${
                              !data.contact.facebook.startsWith("http") &&
                              !data.contact.facebook.startsWith("//")
                                ? "//"
                                : ""
                            }${data.contact.facebook}`}
                            target="_blank"
                          >
                            <FacebookIcon />
                          </a>
                        )}
                        {data.contact.twitter && (
                          <a
                            href={`${
                              !data.contact.twitter.startsWith("http") &&
                              !data.contact.twitter.startsWith("//")
                                ? "//"
                                : ""
                            }${data.contact.twitter}`}
                            target="_blank"
                          >
                            <TwitterIcon className={classes.twitterIcon} />
                          </a>
                        )}
                        {data.contact.linkedln && (
                          <a
                            href={`${
                              !data.contact.linkedln.startsWith("http") &&
                              !data.contact.linkedln.startsWith("//")
                                ? "//"
                                : ""
                            }${data.contact.linkedln}`}
                            target="_blank"
                          >
                            <LinkedInIcon />
                          </a>
                        )}
                      </span>
                    )}
                  </FieldContent>
                </h1>
                <h4>
                  <FieldContent
                    childrenLeft
                    noMargin
                    name="Address"
                    id={data.contact._id}
                    content={{
                      address1: data.contact.address1,
                      address2: data.contact.address2,
                      city: data.contact.city,
                      state: data.contact.state,
                      zip: data.contact.zip,
                      country: data.contact.country,
                    }}
                  >
                    <RoomIcon
                      className={classes.addressIcon}
                      fontSize="small"
                    />
                  </FieldContent>
                </h4>

                <h4>
                  <FieldContent
                    childrenLeft
                    noMargin
                    name={"Company Name Or Job Title"}
                    id={data.contact._id}
                    content={{
                      companyName: data.contact.companyName,
                      jobTitle: data.contact.jobTitle,
                    }}
                  >
                    <LocationCityIcon
                      className={classes.addressIcon}
                      fontSize="small"
                    />
                  </FieldContent>
                </h4>
              </div>
            </div>
            <div className={classes.tags}>
              <Tags
                width="100%"
                targetSourceId={data.contact._id}
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
                  id={data.contact._id}
                  content={{ primaryEmail: data.contact.primaryEmail }}
                >
                  <a
                    href={`mailto:${data.contact.primaryEmail}`}
                    target="_blank"
                  >
                    {data.contact.primaryEmail}
                  </a>
                </FieldContent>
              </Grid>

              <Grid item xs={5}>
                <p className="dataLabels">Secondary Email</p>
              </Grid>
              <Grid item xs={7}>
                <FieldContent
                  onlyChildren
                  id={data.contact._id}
                  content={{ secondaryEmail: data.contact.secondaryEmail }}
                >
                  <a
                    href={`mailto:${data.contact.secondaryEmail}`}
                    target="_blank"
                  >
                    {data.contact.secondaryEmail}
                  </a>
                </FieldContent>
              </Grid>

              <Grid item xs={5}>
                <p className="dataLabels">Mobile Phone</p>
              </Grid>
              <Grid item xs={7}>
                <FieldContent
                  id={data.contact._id}
                  content={{ mobilePhone: data.contact.mobilePhone }}
                />
              </Grid>

              <Grid item xs={5}>
                <p className="dataLabels">Home Phone</p>
              </Grid>
              <Grid item xs={7}>
                <FieldContent
                  id={data.contact._id}
                  content={{ homePhone: data.contact.homePhone }}
                />
              </Grid>

              <Grid item xs={5}>
                <p className="dataLabels">Alternate Phone</p>
              </Grid>
              <Grid item xs={7}>
                <FieldContent
                  id={data.contact._id}
                  content={{ AltPhone: data.contact.AltPhone }}
                />
              </Grid>

              <Grid item xs={5}>
                <p className="dataLabels">Primary Address</p>
              </Grid>
              <Grid item xs={7}>
                <FieldContent
                  name=""
                  id={data.contact._id}
                  content={{
                    address1: data.contact.address1,
                    address2: data.contact.address2,
                    city: data.contact.city,
                    state: data.contact.state,
                    zip: data.contact.zip,
                    country: data.contact.country,
                  }}
                />
              </Grid>

              <Grid item xs={5}>
                <p className="dataLabels">Secondary Address</p>
              </Grid>
              <Grid item xs={7}>
                <FieldContent
                  name=""
                  id={data.contact._id}
                  content={{
                    address1Alt: data.contact.address1Alt,
                    address2Alt: data.contact.address2Alt,
                    cityAlt: data.contact.cityAlt,
                    stateAlt: data.contact.stateAlt,
                    zipAlt: data.contact.zipAlt,
                    countryAlt: data.contact.countryAlt,
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
                  id={data.contact._id}
                  content={{ relatives: data.contact.relatives }}
                />
              </Grid>

              <Grid item xs={5}>
                <p className="dataLabels">Linkedln Profile</p>
              </Grid>
              <Grid item xs={7}>
                <FieldContent
                  onlyChildren
                  id={data.contact._id}
                  content={{ linkedln: data.contact.linkedln }}
                >
                  {data.contact.linkedln && (
                    <a
                      href={`${
                        !data.contact.linkedln.startsWith("http") &&
                        !data.contact.linkedln.startsWith("//")
                          ? "//"
                          : ""
                      }${data.contact.linkedln}`}
                      target="_blank"
                    >
                      {data.contact.linkedln}
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
                  id={data.contact._id}
                  content={{ facebook: data.contact.facebook }}
                >
                  {data.contact.facebook && (
                    <a
                      href={`${
                        !data.contact.facebook.startsWith("http") &&
                        !data.contact.facebook.startsWith("//")
                          ? "//"
                          : ""
                      }${data.contact.facebook}`}
                      target="_blank"
                    >
                      {data.contact.facebook}
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
                  id={data.contact._id}
                  content={{ twitter: data.contact.twitter }}
                >
                  {data.contact.twitter && (
                    <a
                      href={`${
                        !data.contact.twitter.startsWith("http") &&
                        !data.contact.twitter.startsWith("//")
                          ? "//"
                          : ""
                      }${data.contact.twitter}`}
                      target="_blank"
                    >
                      {data.contact.twitter}
                    </a>
                  )}
                </FieldContent>
              </Grid>

              <Grid item xs={5}>
                <p className="dataLabels">Lead Source</p>
              </Grid>
              <Grid item xs={7}>
                <FieldContent
                  id={data.contact._id}
                  content={{ leadSource: data.contact.leadSource }}
                />
              </Grid>

              <Grid item xs={5}>
                <p className="dataLabels">Created By</p>
              </Grid>
              <Grid item xs={7}>
                {data.contact.createBy && data.contact.createBy.name === null && (
                  <div className={classes.userSmallLoader}>
                    <CircularProgress size={22} color="secondary" />
                  </div>
                )}
                {(data.contact.createBy && data.contact.createBy.name) ||
                data.contact.createAt ? (
                  <p style={{ minHeight: "28px" }}>
                    {data.contact.createBy && data.contact.createBy.name
                      ? data.contact.createBy.name
                      : ""}

                    {`${
                      data.contact.createAt
                        ? " - " +
                          anyToDate(data.contact.createAt).toLocaleString()
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
                {data.contact.lastUpdateBy &&
                  data.contact.lastUpdateBy.name === null && (
                    <div className={classes.userSmallLoader}>
                      <CircularProgress size={22} color="secondary" />
                    </div>
                  )}
                {(data.contact.lastUpdateBy &&
                  data.contact.lastUpdateBy.name) ||
                data.contact.lastUpdateAt ? (
                  <p style={{ minHeight: "28px" }}>
                    {data.contact.lastUpdateBy && data.contact.lastUpdateBy.name
                      ? data.contact.lastUpdateBy.name
                      : ""}
                    {`${
                      data.contact.lastUpdateAt
                        ? " - " +
                          anyToDate(data.contact.lastUpdateAt).toLocaleString()
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
          <RecentConversations
            header={"Recent Converstaion"}
            
          />

          {/*/////////// section 3 //////////// */}
          {data.contact &&
            data.contact.owners &&
            data.contact.owners.length > 0 && (
              <Grid
                item
                xs={12}
                className={`${classes.border} ${classes.ownersTable}`}
              >
                <M1nTable
                  parent="ownersPerContacts"
                  ownersIdsArray={data.contact.owners}
                  contactId={props.contactId}
                />
              </Grid>
            )}
        </Grid>
      </Grid>

      {/*/////////// rigth column //////////// */}
      <Grid
        className={classes.border}
        style={{ MinHeight: "100%" }}
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
                  contact={data.contact}
                  transactData={transactData}
                  transactId={transactId}
                />
              </Paper>
              <Paper className={classes.paper}>
                <LeadScore
                  score={5}
                  lastSeen={''}
                  lastContacted={'6 months ago'}
                  lastModified={'3 months ago'}
                />
              </Paper>
              <Paper className={classes.paper}>
                <Comments
                  targetSourceId={data.contact._id}
                  targetLabel="contact"
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Activities
                  id={data.contact._id}
                  activityLog={data.contact.activityLog}
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
        id={data.contact._id}
      />
    </Grid>
  ) : (
    <div style={{ padding: "15px" }}>
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  );
}
