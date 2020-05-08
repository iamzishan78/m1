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
import { anyToDate } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import { IconButton } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import FieldContent from "./components/FieldContent";
import LocationCityIcon from "@material-ui/icons/LocationCity";

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
    // marginLeft: "15px",
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
            <div className={classes.leftColumnTopRigthCorner}>
              {contactData.primaryEmail && (
                <Tooltip title={"Send Email"}>
                  <a href={"mailto:" + contactData.primaryEmail}>
                    <IconButton size="small" style={{ color: "#757575" }}>
                      <MailOutlineIcon />
                    </IconButton>
                  </a>
                </Tooltip>
              )}

              <Tooltip title={"Delete Contact"}>
                <IconButton
                  size="small"
                  style={{ color: "#757575" }}
                  onClick={() => {}}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
            <div>
              <div className={classes.userIcon}>
                <Avatar name={contactData.name} size="80" round />
              </div>
              <div className={classes.userName}>
                <h1 style={{ width: "max-content" }}>
                  {/* {contactData.name} */}

                  <FieldContent
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
                            href={"https://" + contactData.facebook}
                            target="_blank"
                          >
                            <FacebookIcon />
                          </a>
                        )}
                        {contactData.twitter && (
                          <a
                            href={"https://" + contactData.twitter}
                            target="_blank"
                          >
                            <TwitterIcon className={classes.twitterIcon} />
                          </a>
                        )}
                        {contactData.linkedln && (
                          <a
                            href={"https://" + contactData.linkedln}
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
                    id={contactData._id}
                    content={{
                      address1: contactData.address1,
                      address2: contactData.address2,
                      city: contactData.city,
                      state: contactData.state,
                      zip: contactData.zip,
                      country: contactData.country,
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
                    id={contactData._id}
                    content={{
                      companyName: contactData.companyName,
                      jobTitle: contactData.jobTitle,
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
                targetSourceId={contactData._id}
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
                  content={{ alternatePhone: contactData.alternatePhone }}
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
                  <a href={`https://:${contactData.linkedln}`} target="_blank">
                    {contactData.linkedln}
                  </a>
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
                  <a href={`https://:${contactData.facebook}`} target="_blank">
                    {contactData.facebook}
                  </a>
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
                  <a href={`https://:${contactData.twitter}`} target="_blank">
                    {contactData.twitter}
                  </a>
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
                {(contactData.createBy && contactData.createBy.name) ||
                contactData.createAt ? (
                  <p>
                    {`${contactData.createBy ? contactData.createBy.name : ""}${
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
                {(contactData.lastUpdateBy && contactData.lastUpdateBy.name) ||
                contactData.lastUpdateAt ? (
                  <p>
                    {`${
                      contactData.lastUpdateBy
                        ? contactData.lastUpdateBy.name
                        : ""
                    }${
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
