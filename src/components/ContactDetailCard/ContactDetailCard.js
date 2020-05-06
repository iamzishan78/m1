import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../AppContext";
import { Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Comments from "../Shared/Comments";
import Tags from "../Shared/Tagger";
// import { useHistory } from "react-router-dom";
import Avatar from "react-avatar";
import M1nTable from "../Shared/M1nTable/M1nTable";
import RoomIcon from "@material-ui/icons/Room";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  Contacts: {
    color: "#011133",
    "&:hover": {
      cursor: "pointer",
      color: "rgb(18, 150, 194)",
    },
  },
  paper: {
    // height: "100%",
    // marginLeft: "6px"
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
    "& p": {
      margin: "10px",
      wordWrap: "break-word",
    },
    "& .dataLabels": {
      fontWeight: "bold",
    },
    // left: "4px",
    // top: "4px",
    // position: "relative",
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
  socialMediaContainer: {
    marginLeft: "15px",
  },
  mainGridContainer: { height: "100%", "& a": { color: "#12ABE0" } },
  twitterIcon: {
    background: "#17AADD",
    color: "#fff",
    height: "18px",
    width: "18px",
    padding: "1px",
    margin: "3px",
    borderRadius: "2px",
  },
}));

export default function ContactDetailCard(props) {
  const classes = useStyles();
  // let history = useHistory();
  const [stateApp] = useContext(AppContext);

  const [contactData, setContactData] = useState(props.contactData);

  return (
    <Grid container spacing={0} className={classes.mainGridContainer}>
      {/*/////////// left column //////////// */}
      <Grid item xs={9}>
        {/* <h3 className={`${classes.topBar} ${classes.border}`}>
          <span
            className={classes.Contacts}
            onClick={event => {
              history.push("/contacts");
            }}
          >
            Contacts
          </span>
          {` > ${contactData.name}`}
        </h3> */}

        <Grid item container>
          {/*/////////// section 1 //////////// */}
          <Grid item xs={12} className={classes.border}>
            <div>
              <div className={classes.userIcon}>
                <Avatar name={contactData.name} size="80" round />
              </div>
              <div className={classes.userName}>
                <h1>
                  {contactData.name}
                  {(contactData.facebook ||
                    contactData.twitte ||
                    contactData.linkedln) && (
                    <container className={classes.socialMediaContainer}>
                      {contactData.facebook && (
                        <a href={"https://" + contactData.facebook}>
                          <FacebookIcon />
                        </a>
                      )}
                      {contactData.twitter && (
                        <a href={"https://" + contactData.twitter}>
                          <TwitterIcon className={classes.twitterIcon} />
                        </a>
                      )}
                      {contactData.linkedln && (
                        <a href={"https://" + contactData.linkedln}>
                          <LinkedInIcon />
                        </a>
                      )}
                    </container>
                  )}
                </h1>
                <h4>
                  <RoomIcon className={classes.addressIcon} fontSize="small" />
                  {`${contactData.address1 ? contactData.address1 : ""}${
                    contactData.address2 ? " " + contactData.address2 : ""
                  }${contactData.city ? " " + contactData.city : ""}${
                    contactData.state ? " " + contactData.state : ""
                  }${contactData.zip ? " " + contactData.zip : ""}${
                    contactData.country ? " " + contactData.country : ""
                  }`}
                </h4>
                <h4>
                  {`${contactData.companyName ? contactData.companyName : ""}${
                    contactData.companyName && contactData.jobTitle ? " - " : ""
                  }${contactData.jobTitle ? contactData.jobTitle : ""}`}
                </h4>
              </div>
            </div>
            <div className={classes.tags}>
              <Tags
                width="100%"
                targetSourceId={contactData.id}
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
              <Grid item xs={6}>
                <p className="dataLabels">Primary Email</p>
              </Grid>
              <Grid item xs={6}>
                {contactData.primaryEmail ? (
                  <p>
                    <a href={`mailto:${contactData.primaryEmail}`}>
                      {contactData.primaryEmail}
                    </a>
                  </p>
                ) : (
                  <p>Not Avialable</p>
                )}
              </Grid>

              <Grid item xs={6}>
                <p className="dataLabels">Secondary Email</p>
              </Grid>
              <Grid item xs={6}>
                {contactData.secondaryEmail ? (
                  <p>
                    <a href={`mailto:${contactData.secondaryEmail}`}>
                      {contactData.secondaryEmail}
                    </a>
                  </p>
                ) : (
                  <p>Not Avialable</p>
                )}
              </Grid>

              <Grid item xs={6}>
                <p className="dataLabels">Mobile Phone</p>
              </Grid>
              <Grid item xs={6}>
                <p>
                  {contactData.mobilePhone
                    ? contactData.mobilePhone
                    : "Not Avialable"}
                </p>
              </Grid>

              <Grid item xs={6}>
                <p className="dataLabels">Home Phone</p>
              </Grid>
              <Grid item xs={6}>
                <p>
                  {contactData.homePhone
                    ? contactData.homePhone
                    : "Not Avialable"}
                </p>
              </Grid>

              <Grid item xs={6}>
                <p className="dataLabels">Alternate Phone</p>
              </Grid>
              <Grid item xs={6}>
                <p>
                  {contactData.alternatePhone
                    ? contactData.alternatePhone
                    : "Not Avialable"}
                </p>
              </Grid>

              <Grid item xs={6}>
                <p className="dataLabels">Primary Address</p>
              </Grid>
              <Grid item xs={6}>
                <p>
                  {contactData.address1 ||
                  contactData.address2 ||
                  contactData.city ||
                  contactData.state ||
                  contactData.zip ||
                  contactData.country
                    ? `${contactData.address1 ? contactData.address1 : ""}${
                        contactData.address2 ? " " + contactData.address2 : ""
                      }${contactData.city ? " " + contactData.city : ""}${
                        contactData.state ? " " + contactData.state : ""
                      }${contactData.zip ? " " + contactData.zip : ""}${
                        contactData.country ? " " + contactData.country : ""
                      }`
                    : "Not Avialable"}
                </p>
              </Grid>

              <Grid item xs={6}>
                <p className="dataLabels">Secondary Address</p>
              </Grid>
              <Grid item xs={6}>
                <p>
                  {contactData.address1Alt ||
                  contactData.address2Alt ||
                  contactData.cityAlt ||
                  contactData.stateAlt ||
                  contactData.zipAlt ||
                  contactData.countryAlt
                    ? `${
                        contactData.address1Alt ? contactData.address1Alt : ""
                      }${
                        contactData.address2Alt
                          ? " " + contactData.address2Alt
                          : ""
                      }${contactData.cityAlt ? " " + contactData.cityAlt : ""}${
                        contactData.stateAlt ? " " + contactData.stateAlt : ""
                      }${contactData.zipAlt ? " " + contactData.zipAlt : ""}${
                        contactData.countryAlt
                          ? " " + contactData.countryAlt
                          : ""
                      }`
                    : "Not Avialable"}
                </p>
              </Grid>
            </Grid>

            <Grid item xs={6} container spacing={1}>
              <Grid item xs={6}>
                <p className="dataLabels">Relatives</p>
              </Grid>
              <Grid item xs={6}>
                <p>
                  {contactData.relatives
                    ? contactData.relatives
                    : "Not Avialable"}
                </p>
              </Grid>

              <Grid item xs={6}>
                <p className="dataLabels">Linkedln Profile</p>
              </Grid>
              <Grid item xs={6}>
                <p>
                  {contactData.linkedln
                    ? contactData.linkedln
                    : "Not Avialable"}
                </p>
              </Grid>

              <Grid item xs={6}>
                <p className="dataLabels">Facebook Profile</p>
              </Grid>
              <Grid item xs={6}>
                <p>
                  {contactData.facebook
                    ? contactData.facebook
                    : "Not Avialable"}
                </p>
              </Grid>

              <Grid item xs={6}>
                <p className="dataLabels">Twitter Profile</p>
              </Grid>
              <Grid item xs={6}>
                <p>
                  {contactData.twitter ? contactData.twitter : "Not Avialable"}
                </p>
              </Grid>

              <Grid item xs={6}>
                <p className="dataLabels">Lead Source</p>
              </Grid>
              <Grid item xs={6}>
                <p>
                  {contactData.leadSource
                    ? contactData.leadSource
                    : "Not Avialable"}
                </p>
              </Grid>

              <Grid item xs={6}>
                <p className="dataLabels">Created By</p>
              </Grid>
              <Grid item xs={6}>
                <p>
                  {(contactData.createBy && contactData.createBy.name) ||
                  contactData.createAt
                    ? `${
                        contactData.createBy ? contactData.createBy.name : ""
                      } - ${contactData.createAt}`
                    : "Not Avialable"}
                </p>
                {/*////////////////add time converter//////////// */}
              </Grid>

              <Grid item xs={6}>
                <p className="dataLabels">Last Update By</p>
              </Grid>
              <Grid item xs={6}>
                <p>
                  {(contactData.lastUpdateBy &&
                    contactData.lastUpdateBy.name) ||
                  contactData.lastUpdateAt
                    ? `${
                        contactData.lastUpdateBy
                          ? contactData.lastUpdateBy.name
                          : ""
                      } - ${contactData.lastUpdateAt}`
                    : "Not Avialable"}
                </p>
                {/*////////////////add time converter//////////// */}
              </Grid>
            </Grid>
          </Grid>

          {/*/////////// section 3 //////////// */}
          <Grid
            item
            xs={12}
            className={`${classes.border} ${classes.ownersTable}`}
          >
            <M1nTable
              parent="ownersPerContacts"
              ownersIdsArray={contactData.owners}
            />
          </Grid>
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
            <Grid item xs={12}>
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

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Comments targetSourceId={contactData._id} />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
}
