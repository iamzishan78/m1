import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useLazyQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Toolbar from "@material-ui/core/Toolbar";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { anyToDate } from "@amcharts/amcharts4/.internal/core/utils/Utils";

import { CONTACT } from "graphQL/useQueryContact";
import MelissaTable from "./components/MelissaTable";
import { LASTMELISSARECORD } from "graphQL/useQueryGetMelissaRecords";
import { LinkTypes } from "../ContactDetailCard/components/FieldContent/helper";

import { AppContext } from "../../AppContext";
import { NavigationContext } from "../Navigation/NavigationContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
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
}));

export default function ContactDetailedInfoCard(props) {
  const classes = useStyles();
  let history = useHistory();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const [melissaData, setMelissaData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(false);
  const contactId =
    history.location.pathname.split("/")[
      history.location.pathname.split("/").length - 2
    ];

  const [getContact, { data }] = useLazyQuery(CONTACT);
  const [getLastMelissaRecord, { data: mData }] = useLazyQuery(LASTMELISSARECORD, { fetchPolicy: "network-only" } );

  useEffect(() => {
    if (contactId) {
      debugger;
      getContact({
        variables: {
          contactId: contactId,
        },
      });
      getLastMelissaRecord({
        variables: {
          contactId: contactId,
        },
      });
    }
  }, [contactId, getContact, getLastMelissaRecord]);

  useEffect(() => {
    if (data && data.contact) {
      debugger;
      setContactData(data.contact);
      setStateApp((stateApp) => ({
        ...stateApp,
        currentContatcAtivities: data.contact.activityLog,
      }));
    }
  }, [data, setStateApp]);

  useEffect(() => {
    if (mData && mData.getLastMelissaRecord.success === true) {
      debugger
      setMelissaData(mData.getLastMelissaRecord);
    }
  }, [mData]);

  const basicInfoContent = {
    "Primary Email": {
      data: { primaryEmail: contactData?.primaryEmail },
      linkType: LinkTypes.Mail,
    },

    "Primary Mobile Phone": {
      data: { mobilePhone: contactData?.mobilePhone },
      linkType: LinkTypes.None,
    },
    "Primary Home Phone": {
      data: { homePhone: contactData?.homePhone },
      linkType: LinkTypes.None,
    },
    "Primary Work Phone": {
      data: { AltPhone: contactData?.AltPhone },
      linkType: LinkTypes.None,
    },
    "Primary Address": {
      data: {
        address1: contactData?.address1,
        address2: contactData?.address2,
        city: contactData?.city,
        state: contactData?.state,
        zip: contactData?.zip,
        country: contactData?.country,
      },
      linkType: LinkTypes.None,
    },
    "Secondary Address": {
      data: {
        address1Alt: contactData?.address1Alt,
        address2Alt: contactData?.address2Alt,
        cityAlt: contactData?.cityAlt,
        stateAlt: contactData?.stateAlt,
        zipAlt: contactData?.zipAlt,
        countryAlt: contactData?.countryAlt,
      },
      linkType: LinkTypes.None,
    },
  };

  const lastUpdateByRow =
    contactData?.lastUpdateBy && contactData?.lastUpdateBy.name === null ? (
      <span className={classes.userSmallLoader}>
        <CircularProgress size={22} color="secondary" />
      </span>
    ) : (contactData?.lastUpdateBy && contactData?.lastUpdateBy.name) ||
      contactData?.lastUpdateAt ? (
      `${
        contactData?.lastUpdateBy && contactData?.lastUpdateBy.name
          ? contactData?.lastUpdateBy.name
          : ""
      }
    ${
      contactData?.lastUpdateAt
        ? " - " + anyToDate(contactData?.lastUpdateAt).toLocaleString()
        : ""
    }`
    ) : (
      <p className={classes.notAvailableP}>Not Available</p>
    );

  const createByRow =
    contactData?.createBy && contactData?.createBy.name === null ? (
      <span className={classes.userSmallLoader}>
        <CircularProgress size={22} color="secondary" />
      </span>
    ) : (contactData?.createBy && contactData?.createBy.name) ||
      contactData?.createAt ? (
      `${
        contactData?.createBy && contactData?.createBy.name
          ? contactData?.createBy.name
          : ""
      }
    ${
      contactData?.createAt
        ? " - " + anyToDate(contactData?.createAt).toLocaleString()
        : ""
    }`
    ) : (
      <p className={classes.notAvailableP}>Not Available</p>
    );

  const basicInfoExpContent = {
    "Email 2": {
      data: { secondaryEmail: contactData?.secondaryEmail },
      linkType: LinkTypes.Mail,
    },
    "Email 3": {
      data: { email3: contactData?.email3 },
      linkType: LinkTypes.None,
    },
    "Mobile Phone 2": {
      data: { mobilephone2: contactData?.mobilephone2 },
      linkType: LinkTypes.None,
    },
    "Mobile Phone 3": {
      data: { mobilephone3: contactData?.mobilephone3 },
      linkType: LinkTypes.None,
    },
    "Home Phone 2": {
      data: { homePhone2: contactData?.homePhone2 },
      linkType: LinkTypes.None,
    },
    "Home Phone 3": {
      data: { homePhone3: contactData?.homePhone3 },
      linkType: LinkTypes.None,
    },
    "Work Phone 2": {
      data: { AltPhone2: contactData?.AltPhone2 },
      linkType: LinkTypes.None,
    },
    "Work Phone 3": {
      data: { AltPhone3: contactData?.AltPhone3 },
      linkType: LinkTypes.None,
    },
    "Relative Names": {
      data: { relatives: contactData?.relatives },
      linkType: LinkTypes.None,
    },
    "LinkedIn Profile": {
      data: { linkedIn: contactData?.linkedIn },
      linkType: LinkTypes.Simple,
    },
    "Facebook Profile": {
      data: { facebook: contactData?.facebook },
      linkType: LinkTypes.Simple,
    },
    "Twitter Profile": {
      data: { twitter: contactData?.twitter },
      linkType: LinkTypes.Simple,
    },
    Website: {
      data: { website: contactData?.website },
      linkType: LinkTypes.None,
    },
    "Industry Type": {
      data: { industryType: contactData?.industryType },
      linkType: LinkTypes.None,
    },

    "Campaign Name": {
      data: { campaignName: contactData?.campaignName },
      linkType: LinkTypes.None,
    },
    "Lead Source": {
      data: { leadSource: contactData?.leadSource },
      linkType: LinkTypes.None,
    },

    "Time Zone": {
      data: { timeZone: contactData?.timeZone },
      linkType: LinkTypes.None,
    },
    Territory: {
      data: { territory: contactData?.territory },
      linkType: LinkTypes.None,
    },
    Status: {
      data: { status: contactData?.status },
      linkType: LinkTypes.None,
    },
    "Contact Owner": {
      data: {
        contactOwner: contactData?.contactOwner,
        contactOwnerId: contactData?.contactOwnerId,
      },
      linkType: LinkTypes.None,
    },
    "Created By": {
      data: { createByRow },
      linkType: LinkTypes.None,
      inner: createByRow,
    },
    "Last Updated By": {
      data: { lastUpdateByRow },
      linkType: LinkTypes.None,
      inner: lastUpdateByRow,
    },
  };

  useEffect(() => {
    setLoading(true);
    async function update() {
      setLoading(false);
    }
    update();
  }, [contactData]);

  const checkModuleHistory = () => {
    return !!stateNav.contactFromMap;
  };

  return contactData ? (
    <div className={classes.root}>
      <Toolbar style={{ backgroundColor: "#F0F6F8" }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
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
                history.push("/");
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
            onClick={() => history.push(`/contact/details/${contactId}`)}
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
            Detailed Information 
          </Typography>
        </Breadcrumbs>
      </Toolbar>

      <MelissaTable
        id={contactData?._id}
        entity={contactData?.entity}
        rows={{ ...basicInfoContent, ...basicInfoExpContent }}
        wrapperClass={classes.dataSect}
        melissaData={melissaData}
      />
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
