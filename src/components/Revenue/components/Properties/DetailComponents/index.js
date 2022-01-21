import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useLazyQuery } from "@apollo/client";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, IconButton, Tabs, Tab, Button } from "@material-ui/core";
import { DescriptionOutlined as DocumentIcon, InfoOutlined as InfoOutlinedIcon, MoreHoriz as MoreHorizIcon } from "@material-ui/icons";

import { IFARECONTACTS } from "graphQL/useQueryIfOwnersAreContacts";
import { GET_PROPERTY } from "graphQL/useQueryGetProperty";

// Components
import Tags from "components/Shared/Tagger";
import PropertyInterestDetailsSection from "./PropertyInterestDetailsSection";
import InterestDetailForm from "./InterestDetailForm";
import { ConvertOwnerToContactContainer } from "store/containers/entity";
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
    padding: "20px 27px 0px 45px",
    marginTop: "7px",
  },
  title: {
    display: "flex",
  },
  titleText: {
    marginLeft: 16,
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
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
  icon: {
    height: 80,
    width: 80,
    backgroundColor: "#d5f4ff",
    borderRadius: 12,
    "& svg": {
      fontSize: "3.1875rem",
      fill: "#263451",
    },
  },
  tabsHeader: {
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
  menuIcon: {
    background: "transparent",
    align: "center",
    "& svg": {
      fill: "#808080 !important",
    },
  },
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
    "& fieldset": {
      border: "none",
    },
  },
  actionsContainer: {
    display: "flex",
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  metaActions: ({ collapse }) => ({
    marginTop: "2px",
    "& button": {
      backgroundColor: !collapse ? "#eceded" : "#fff",
      color: "grey",
      fontWeight: "bold",
      textTransform: "capitalize",
      padding: "6px 12px",
      "&:hover": {
        backgroundColor: !collapse ? "#eceded" : "#fff",
      },
    },
  }),
}));

const StyledTabs = withStyles({
  root: {
    textTransform: "capitalize",
  },
  indicator: {
    backgroundColor: "#12abe0",
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

export default function DetailComponents(props) {
  const history = useHistory();
  const propertyId = history.location.pathname.split("/")[history.location.pathname.split("/").length - 1];
  const [propertyOwnerContact, setPropertyOwnerContacts] = useState(null);
  const [showInterestDetails, setShowInterestDetails] = useState(false);
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const classes = useStyles({ ...props, showInterestDetails });
  const [tab, setTab] = useState(0);
  const [refetchContacts, setRefetchContacts] = useState(false);
  const selectedTabRef = useRef(null);
  const [collapse, setCollapse] = useState(false);

  const [getProperty, { data: getPropertyResult }] = useLazyQuery(GET_PROPERTY, {
    fetchPolicy: "no-cache",
  });

  const [checkIfOwnersAreContacts, { data: checkIfOwnersAreContactsData }] = useLazyQuery(IFARECONTACTS, {
    fetchPolicy: "cache-and-network",
  });

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
      {/**
       * Detail title section
       */}
      <div className={`${classes.detailHeader} flex justifyBetween alignStart w-100`}>
        <div className="flex column alignStart justifyStart w-100">
          <div className={classes.title}>
            <IconButton className={classes.icon}>
              <DocumentIcon />
            </IconButton>
            <div className={classes.titleText}>
              {propertyDetails && (
                <Typography style={{ fontWeight: "bold", fontSize: "large", marginLeft: 8 }}>{propertyDetails.name}</Typography>
              )}
              <div className={classes.tagsContainer}>
                <div className={classes.highlighter}>
                  <Typography className={classes.highlight} variant="highlight">
                    Division Order
                  </Typography>
                </div>
                <div className={classes.tags}>
                  <Tags targetSourceId={propertyId} width="100%" targetLabel="check" publicLeftBottom onlyTags />
                </div>
              </div>
            </div>
          </div>

          <div className={classes.actionsContainer}>
            <div className={classes.tabsHeader}>
              <StyledTabs
                value={tab}
                onChange={(event, tab) => {
                  // setButtonScroll(true);
                  setTab(tab);
                }}
                aria-label="ant example"
              >
                <StyledTab label="Header" />
                <StyledTab label="Details" />
              </StyledTabs>
            </div>
            <div className={classes.metaActions}>
              <Button startIcon={<InfoOutlinedIcon />} onClick={() => setCollapse(!collapse)}>
                Metadata
              </Button>
              <IconButton size="small" component="span" className={classes.menuIcon} onClick={() => {}}>
                <MoreHorizIcon size="medium" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justifyBetween alignStart w-100">
        <div className={`${classes.tabsDetailContainer}`}>
          {/**
           * Detail tabs section
           */}
          <div className={classes.tabsSection}>
            <div
              style={{
                maxHeight: "calc(100vh - 315px)",
                overflow: "overlay",
                backgroundColor: "#f3f3f3",
              }}
            >
              <div className={classes.headerSection} ref={tab === 0 ? selectedTabRef : null}>
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
    </NavHeader>
  );
}
