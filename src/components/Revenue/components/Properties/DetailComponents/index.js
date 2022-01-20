import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useLazyQuery } from "@apollo/client";
import moment from "moment";
import { makeStyles, withStyles } from "@material-ui/styles";
import {
  Typography,
  IconButton,
  Tabs,
  Tab,
  Grid,
  Breadcrumbs,
} from "@material-ui/core";
import {
  DescriptionOutlined as DocumentIcon,
  NavigateNext as NavigateNextIcon,
  Close as CloseIcon,
} from "@material-ui/icons";
import Link from "@material-ui/core/Link";

import { IFARECONTACTS } from "graphQL/useQueryIfOwnersAreContacts";

import { GET_PROPERTY } from "graphQL/useQueryGetProperty";

import Tagger from "components/Shared/Tagger";
import PropertyInterestDetailsSection from "./PropertyInterestDetailsSection";
import InterestDetailForm from "./InterestDetailForm";
import { ConvertOwnerToContactContainer } from "store/containers/entity";
// Components
import HeaderSection from "./HeaderSection";
import NavHeader from "components/Revenue/components/Common/NavHeader";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundColor: "#f3f3f3",
    width: "100%",
  },
  navSection: {
    minHeight: "52px",
    padding: "10px 20px",
    backgroundColor: "#fff",
  },
  detailHeader: {
    backgroundColor: "#fff",
    padding: "20px",
  },
  title: {
    display: "flex",
  },
  titleText: {
    margin: "2px 0px 0px 10px",
  },
  icon: {
    height: "65px",
    width: "65px",
    backgroundColor: "lightgrey",
  },
  tabsHeader: {
    padding: "20px 20px 0px 20px",
    background: "#ffffff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tabsSection: {
    marginTop: "24px",
  },
  headerSection: {
    padding: "20px 30px",
    backgroundColor: "#fff",
    marginBottom: "20px",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  summarySection: {
    padding: "20px 30px",
    minHeight: "500px",
    backgroundColor: "#fff",
    marginBottom: "10px",
  },
  checkDetailsSection: {
    padding: "20px 30px",
    minHeight: "500px",
    backgroundColor: "#fff",
  },
  tabsDetailContainer: ({ showInterestDetails }) => ({
    maxWidth: showInterestDetails ? "68%" : "100%",
  }),
  sideModal: {
    marginTop: 24,
    padding: "16px 10px",
    background: "#ffffff",
    borderRadius: 8,
    overflow: "auto",
    height: "calc(100vh - 280px)",
    maxHeight: "calc(100vh - 280px)",
    maxWidth: 360,
    width: "100%",
  },
  tags: {
    margin: "20px 10px 0px 10px",
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
      "&.Mui-disabled fieldset": {
        borderColor: "#adadad",
      },
      "&.Mui-disabled svg": {
        fill: "#adadad !important",
      },
    },
  },
}));

const StyledTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
    textTransform: "capitalize",
  },
  indicator: {
    backgroundColor: "#12abe0",
    height: "4px",
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
    },
    "&:focus": {
      color: "black",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

export default function DetailComponents(props) {
  const history = useHistory();
  const propertyId =
    history.location.pathname.split("/")[
    history.location.pathname.split("/").length - 1
    ];
  const [propertyOwnerContact, setPropertyOwnerContacts] = useState(null);
  const [showInterestDetails, setShowInterestDetails] = useState(false);
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const classes = useStyles({ ...props, showInterestDetails });
  const [tab, setTab] = useState(0);
  const [refetchContacts, setRefetchContacts] = useState(false);
  const selectedTabRef = useRef(null);

  const [getProperty, { data: getPropertyResult }] = useLazyQuery(
    GET_PROPERTY,
    {
      fetchPolicy: "no-cache",
    }
  );

  const [checkIfOwnersAreContacts, { data: checkIfOwnersAreContactsData }] =
    useLazyQuery(IFARECONTACTS, { fetchPolicy: "cache-and-network" });

  const propertyDetails = getPropertyResult?.getProperty.property;

  useEffect(() => {
    selectedTabRef.current &&
      selectedTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
  }, [tab]);

  useEffect(() => {
    if (checkIfOwnersAreContactsData?.ifAreContacts?.length > 0) {
      setPropertyOwnerContacts({
        _id: checkIfOwnersAreContactsData.ifAreContacts[0].isContact,
        name: checkIfOwnersAreContactsData.ifAreContacts[0].name,
      });
    }
  }, [checkIfOwnersAreContactsData]);

  useEffect(() => {
    if (propertyDetails?.owner) {
      checkIfOwnersAreContacts({
        variables: {
          idsArray: [propertyDetails.owner],
        },
      });
    }
  }, [propertyDetails, refetchContacts]);

  useEffect(() => {
    getProperty({
      variables: { id: propertyId },
    });
  }, [propertyId]);

  return (
    <NavHeader title={propertyDetails?.name}>
      <div style={{ padding: "20px" }}>
        {/**
         * Detail title section
         */}
        <div className={classes.detailHeader}>
          <div className={classes.title}>
            <IconButton className={classes.icon}>
              <DocumentIcon fontSize="large" />
            </IconButton>
            <div className={classes.titleText}>
              {propertyDetails && (
                <Typography
                  style={{
                    fontWeight: "bold",
                    fontSize: "large",
                    textTransform: "uppercase",
                  }}
                >
                  {propertyDetails.name}
                </Typography>
              )}
              {propertyDetails && (
                <Typography variant="subtitle1">
                  {moment(propertyDetails.flatSyncAt).format("DD/MM/yyyy")}
                </Typography>
              )}
            </div>
          </div>
          <div className={classes.tags}>
            <Tagger
              objectId={null}
              targetLabel="property"
              iconZiseSmall={false}
              shareable={false}
              type="clickable"
            />
          </div>
        </div>
        <div className="flex justifyBetween alignStart w-100">
          <div className={`${classes.tabsDetailContainer}`}>
            {/**
             * Detail tabs section
             */}
            <div className={classes.tabsSection}>
              <div className={classes.tabsHeader}>
                <StyledTabs
                  value={tab}
                  onChange={(event, tab) => setTab(tab)}
                  aria-label="ant example"
                >
                  <StyledTab label="Header" />
                  <StyledTab label="Details" />
                </StyledTabs>
              </div>
              <div
                style={{
                  maxHeight: "calc(100vh - 440px)",
                  overflow: "overlay",
                  backgroundColor: "#f3f3f3",
                }}
              >
                <div
                  className={classes.headerSection}
                  ref={tab === 0 ? selectedTabRef : null}
                >
                  <HeaderSection />
                </div>
                <div ref={tab === 1 ? selectedTabRef : null}>
                  <PropertyInterestDetailsSection
                    propertyId={propertyId}
                    setSelectedInterest={setSelectedInterest}
                    showInterestDetails={showInterestDetails}
                    onClickAdd={() => setShowInterestDetails(true)}
                  />
                </div>
              </div>
            </div>
          </div>
          {showOwnerDialog && (
            <ConvertOwnerToContactContainer
              propertyDetails={propertyDetails}
              onClose={() => setShowOwnerDialog(false)}
              onSuccess={() => setRefetchContacts(!refetchContacts)}
            />
          )}
          {showInterestDetails && (
            <InterestDetailForm
              propertyDetails={propertyDetails}
              selectedInterest={selectedInterest}
              setShowOwnerDialog={setShowOwnerDialog}
              propertyOwnerContact={propertyOwnerContact}
              onClose={() => setShowInterestDetails(false)}
            />
          )}
        </div>
      </div>
    </NavHeader>
  );
}
