import React, { useState } from "react";
import MelissaTable from "./components/MelissaTable";
import { makeStyles } from "@material-ui/core/styles";
import FieldContent, {
  LinkTypes,
} from "./../ContactDetailCard/components/FieldContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import { anyToDate } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import {
  MenuItem,
  Checkbox,
  Select,
  InputLabel,
  Grid,
  Button,
  FormControl,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  avatar: {
    marginRight: "20px",
  },
  moreIcon: {
    color: "lightgray",
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
  viewAllCard: {
    display: "flex",
    justifyContent: "space-between",
  },
  inputField: {
    marginBottom: "30px",
  },
  textBtn: {
    margin: "0 0 8px 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  label: {
    backgroundColor: "white",
  },
  activitiesList: {
    padding: "20px",
  },
  activitiesFilter: {
    padding: "20px 30px",
    borderLeft: "1px solid #9A9A9A",
    minWidth: "250px",
  },
  checkBox: {
    minHeight: "35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  activityCardRight: {
    display: "flex",
  },
  activityStats: {
    margin: "20px 30px",
    padding: "30px",
    height: "fit-content",
    backgroundColor: "#FAFAEB",
  },
  activityScore: {
    border: "5px solid #F5A724",
    borderRadius: "50%",
    padding: "25px",
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "5px",
  },
  statsMessage: {
    color: "#7B7B7B",
    textAlign: "center",
  },
  dataSect: {
    borderTop: "2px solid #C9C9C9",
    // margin: "23px 28px",
    color: "#757575",
    width: "100%",
    "& p": {
      wordWrap: "break-word",
    },
    "& .dataLabels": {
      fontWeight: "bold",
    },
    "& > .MuiGrid-item": {
      borderBottom: "2px solid #C9C9C9",
      borderRight: "2px solid #C9C9C9",
      position: "relative",
    },
    "& .fieldName": {
      borderLeft: "2px solid #C9C9C9",
      backgroundColor: "#EBEBEB",
      "& p": { margin: "8px 10px" },
    },
    "& a": { color: "#757575" },
  },
  showAll: {
    margin: "8px 0 0 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
}));

export default ({ header, ...props }) => {
  const [basicInfExp, setBasicInfExp] = useState(false);
  const classes = useStyles();

  const basicInfoContent = {
    "Primary Email": {
      data: { primaryEmail: props.contactData.primaryEmail },
      linkType: LinkTypes.Mail,
    },
    "Secondary Email": {
      data: { secondaryEmail: props.contactData.secondaryEmail },
      linkType: LinkTypes.Mail,
    },
    "Mobile Phone": {
      data: { mobilePhone: props.contactData.mobilePhone },
      linkType: LinkTypes.None,
    },
    "Home Phone": {
      data: { homePhone: props.contactData.homePhone },
      linkType: LinkTypes.None,
    },
    "Alternate Phone": {
      data: { AltPhone: props.contactData.AltPhone },
      linkType: LinkTypes.None,
    },
    "Primary Address": {
      data: {
        address1: props.contactData.address1,
        address2: props.contactData.address2,
        city: props.contactData.city,
        state: props.contactData.state,
        zip: props.contactData.zip,
        country: props.contactData.country,
      },
      linkType: LinkTypes.None,
    },
    "Secondary Address": {
      data: {
        address1Alt: props.contactData.address1Alt,
        address2Alt: props.contactData.address2Alt,
        cityAlt: props.contactData.cityAlt,
        stateAlt: props.contactData.stateAlt,
        zipAlt: props.contactData.zipAlt,
        countryAlt: props.contactData.countryAlt,
      },
      linkType: LinkTypes.None,
    },
  };

  const basicInfoExpContent = {
    Relatives: {
      data: { relatives: props.contactData.relatives },
      linkType: LinkTypes.None,
    },
    "Linkedln Profile": {
      data: { linkedln: props.contactData.linkedln },
      linkType: LinkTypes.None,
      inner: props.contactData.linkedln && (
        <a
          href={`${
            !props.contactData.linkedln.startsWith("http") &&
            !props.contactData.linkedln.startsWith("//")
              ? "//"
              : ""
          }${props.contactData.linkedln}`}
          target="_blank"
        >
          {props.contactData.linkedln}
        </a>
      ),
    },
    "Facebook Profile": {
      data: { facebook: props.contactData.facebook },
      linkType: LinkTypes.None,
      inner: props.contactData.facebook && (
        <a
          href={`${
            !props.contactData.facebook.startsWith("http") &&
            !props.contactData.facebook.startsWith("//")
              ? "//"
              : ""
          }${props.contactData.facebook}`}
          target="_blank"
        >
          {props.contactData.facebook}
        </a>
      ),
    },
    "Twitter Profile": {
      data: { twitter: props.contactData.twitter },
      linkType: LinkTypes.None,
      innner: props.contactData.twitter && (
        <a
          href={`${
            !props.contactData.twitter.startsWith("http") &&
            !props.contactData.twitter.startsWith("//")
              ? "//"
              : ""
          }${props.contactData.twitter}`}
          target="_blank"
        >
          {props.contactData.twitter}
        </a>
      ),
    },
    "Lead Source": {
      data: { leadSource: props.contactData.leadSource },
      linkType: LinkTypes.None,
    },
    "Created By": {
      data: { primaryEmail: props.contactData.primaryEmail },
      linkType: LinkTypes.None,
      inner:
        props.contactData.createBy &&
        props.contactData.createBy.name === null ? (
          <span className={classes.userSmallLoader}>
            <CircularProgress size={22} color="secondary" />
          </span>
        ) : (props.contactData.createBy && props.contactData.createBy.name) ||
          props.contactData.createAt ? (
          `${
            props.contactData.createBy && props.contactData.createBy.name
              ? props.contactData.createBy.name
              : ""
          }
          ${
            props.contactData.createAt
              ? " - " + anyToDate(props.contactData.createAt).toLocaleString()
              : ""
          }`
        ) : (
          <p className={classes.notAvailableP}>Not Available</p>
        ),
    },
    "Last Update By": {
      data: { primaryEmail: props.contactData.primaryEmail },
      linkType: LinkTypes.None,
      inner:
        props.contactData.lastUpdateBy &&
        props.contactData.lastUpdateBy.name === null ? (
          <span className={classes.userSmallLoader}>
            <CircularProgress size={22} color="secondary" />
          </span>
        ) : (props.contactData.lastUpdateBy &&
            props.contactData.lastUpdateBy.name) ||
          props.contactData.lastUpdateAt ? (
          `${
            props.contactData.lastUpdateBy &&
            props.contactData.lastUpdateBy.name
              ? props.contactData.lastUpdateBy.name
              : ""
          }
        ${
          props.contactData.lastUpdateAt
            ? " - " + anyToDate(props.contactData.lastUpdateAt).toLocaleString()
            : ""
        }`
        ) : (
          <p className={classes.notAvailableP}>Not Available</p>
        ),
    },
  };

  return (
    <div className={classes.root}>
      <Grid item xs={12} style={{ minHeight: "28px" }}>
        <h4 style={{ margin: "0 0 13px 0", float: "left" }}>
          Basic Information
        </h4>
        <h4
          className={classes.viewAll}
          onClick={() => {
            props.handleOpenExpandableCard(
              <MelissaTable
                rows={{ ...basicInfoContent, ...basicInfoExpContent }}
                wrapperClass={classes.dataSect}
                melissaData={props.melissaData}
              />,
              "Detailed Information"
            );
          }}
        >
          View All
        </h4>
      </Grid>

      <Grid item xs={12} container className={classes.dataSect} spacing={0}>
        {Object.entries(basicInfoContent).map(([key, row]) => (
          <React.Fragment>
            <Grid item xs={3} className="fieldName">
              <p className="dataLabels">{key}</p>
            </Grid>
            <Grid item xs={9}>
              <FieldContent
                id={props.contactData._id}
                entity={props.contactData.entity}
                content={row.data}
                linkType={row.linkType}
              />
            </Grid>
          </React.Fragment>
        ))}

        {basicInfExp && (
          <>
            {Object.entries(basicInfoExpContent).map(([key, row]) => (
              <React.Fragment>
                <Grid item xs={3} className="fieldName">
                  <p className="dataLabels">{key}</p>
                </Grid>
                <Grid item xs={9}>
                  <FieldContent
                    onlyChildren={row.inner ? true : false}
                    id={props.contactData._id}
                    entity={props.contactData.entity}
                    content={row.data}
                    linkType={row.linkType}
                  >
                    {row.inner}
                  </FieldContent>
                </Grid>
              </React.Fragment>
            ))}
          </>
        )}
      </Grid>
      <Grid item xs={12}>
        <h4
          className={classes.showAll}
          onClick={() => {
            setBasicInfExp(!basicInfExp);
          }}
        >
          Show {!basicInfExp ? "More" : "Less"}
          {!basicInfExp ? (
            <ExpandMoreIcon style={{ position: "relative", top: "8px" }} />
          ) : (
            <ExpandLessIcon style={{ position: "relative", top: "8px" }} />
          )}
        </h4>
      </Grid>
    </div>
  );
};
