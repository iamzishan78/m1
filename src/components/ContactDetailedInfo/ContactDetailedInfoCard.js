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
import { CONTACT_PURCHASE_DATA } from "graphQL/useQueryContactPurchaseData";

import { CONTACT } from "graphQL/useQueryContact";
import MelissaTable from "./components/MelissaTable";
import { LASTMELISSARECORD } from "graphQL/useQueryGetMelissaRecords";
import { LinkTypes } from "../ContactDetailCard/components/FieldContent/helper";

import { AppContext } from "../../AppContext";
import { NavigationContext } from "../Navigation/NavigationContext";
import { getBasicInfoContent, getBasicInfoExpContent, getBasicPurchaseInfoContent, getBasicPurchaseInfoExpContent } from 'components/ContactDetailedInfo/helper'
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { FEATURES } from "components/Shared/FeatureFlag/common";
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

export default function ContactDetailedInfoCard() {
  const classes = useStyles();
  let history = useHistory();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const [melissaData, setMelissaData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [purchaseData, setPurchaseData] = useState([]);
  const [selectedPurchaseData, setSelectedPurchaseData] = useState("");
  const contactId =
    history.location.pathname.split("/")[
      history.location.pathname.split("/").length - 2
    ];

  const [getContact, { data }] = useLazyQuery(CONTACT);
  const [getContactPurchaseData, { data: contactPurchaseData }] = useLazyQuery(CONTACT_PURCHASE_DATA);
  const [getLastMelissaRecord, { data: mData }] = useLazyQuery(LASTMELISSARECORD, { fetchPolicy: "network-only" } );

  useEffect(() => {
    if (contactId) {
      getContact({
        variables: {
          contactId: contactId,
        },
      });
      getContactPurchaseData({
        variables: {
          contactId: contactId,
        },
      })
      getLastMelissaRecord({
        variables: {
          contactId: contactId,
        },
      });
    }
  }, [contactId, getContact, getLastMelissaRecord]);

  useEffect(() => {
    if (data && data.contact) {
      setContactData(data.contact);
      setStateApp((stateApp) => ({
        ...stateApp,
        currentContatcAtivities: data.contact.activityLog,
      }));
    }
  }, [data, setStateApp]);

  useEffect(() => {
    if (contactPurchaseData?.getContactPurchaseData?.length > 0) {
      setPurchaseData(contactPurchaseData?.getContactPurchaseData);
      setSelectedPurchaseData(contactPurchaseData.getContactPurchaseData[0]._id)
    }
  }, [contactPurchaseData]);




  useEffect(() => {
    if (mData && mData.getLastMelissaRecord.success === true) {
      setMelissaData(mData.getLastMelissaRecord);
    }
  }, [mData]);

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
        rows={{ ...getBasicInfoContent(contactData), ...getBasicInfoExpContent(contactData) }}
        wrapperClass={classes.dataSect}
        melissaData={melissaData}
      />
      <FeatureFlag feature={FEATURES.IDICORE}>
        <MelissaTable
          header="Purchased Data"
          options={purchaseData ? purchaseData.map(data => ({_id: data._id, date: data.sysDateTime})): [] }
          id={contactData?._id}
          entity={contactData?.entity}
          rows={{ ...getBasicPurchaseInfoContent(purchaseData.find((purchaseData) => purchaseData._id === selectedPurchaseData)), ...getBasicPurchaseInfoExpContent(purchaseData.find((purchaseData) => purchaseData._id === selectedPurchaseData)) }}
          wrapperClass={classes.dataSect}
          melissaData={melissaData}
          selectedPurchaseData={selectedPurchaseData}
          setSelectedPurchaseData={setSelectedPurchaseData}
        />
      </FeatureFlag>
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
