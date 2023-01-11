import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { debounce, get } from "lodash";

import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, IconButton, Tabs, Tab, Button, Menu, MenuItem, ListItemIcon, ListItemText, Dialog } from "@material-ui/core";
import {
  DescriptionOutlined as DocumentIcon,
  InfoOutlined as InfoOutlinedIcon,
  MoreHoriz as MoreHorizIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";


import { UPSERT_USER_DESCRIPTOR } from "graphQL/useMutationUserDescriptor";
import { UPDATE_PROPERTY } from "graphQL/useMutationUpdateProperty";
import { IFARECONTACTS } from "graphQL/useQueryIfOwnersAreContacts";
import { GET_PROPERTY } from "graphQL/useQueryGetProperty";
import { AppContext } from "AppContext";

// Components
import Tags from "components/Shared/Tagger";
import PropertyInterestDetailsSection from "./PropertyInterestDetailsSection";
import InterestDetailForm from "./InterestDetailForm";
import { ConvertOwnerToContactContainer } from "store/containers/entity";
import HeaderSection from "./HeaderSection";
import NavHeader from "components/Revenue/components/Common/NavHeader";
import MetadataDrawer from "components/Revenue/components/Common/MetadataDrawer";
import { MultipleOwnerToContactDrawerContainer } from "store/containers";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import DocViewer from "components/Shared/DocViewer";

import AddNewRelatedAgreementDialog from "components/Land/components/Agreements/detailComponents/relatedAgreements/AddNewRelatedAgreementDialog";
import Validation from 'components/Revenue/components/Properties/DetailComponents/Validation'

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
    width: "calc(65vw - 10px)",
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
  tabsSection: {},
  headerSection: {
    padding: "20px 30px",
    backgroundColor: "#fff",
    marginBottom: "20px",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  tabsDetailContainer: ({ showInterestDetails, collapse, isNewAgmt }) => ({
    padding: 20,
    width: showInterestDetails || !collapse || isNewAgmt ? "calc(100% - 644px)" : "100%",
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
    width: "100%",
  },
  actionsContainer: {
    display: "flex",
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  menu: {
    "& .MuiListItem-gutters": {
      paddingLeft: "10px !important",
      paddingRight: "10px !important",
    },
    "& .MuiListItem-root": {
      "& .MuiListItemIcon-root": {
        minWidth: "25px",
        "& .MuiSvgIcon-root": {
          fill: "red !important",
        },
      },
    },
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
  tabsSectionDetails: {
    maxHeight: "calc(100vh - 280px)",
    overflow: "overlay",
    backgroundColor: "#f3f3f3",
  },
}));

const StyledTabs = withStyles({
  root: {
    textTransform: "capitalize",
  },
  indicator: {
    backgroundColor: "#12abe0",
    height: "5px",
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
  const [stateApp, setStateApp] = useContext(AppContext);

  const propertyId = history.location.pathname.split("/")[history.location.pathname.split("/").length - 1];
  const [propertyOwnerContact, setPropertyOwnerContacts] = useState([]);
  const [showInterestDetails, setShowInterestDetails] = useState(false);
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [tab, setTab] = useState(1);
  const [refetchContacts, setRefetchContacts] = useState(false);
  const selectedTabRef = useRef(null);
  const [collapse, setCollapse] = useState(true);
  const [anchorEl, setAnchorEl] = useState();
  const [isButtonScroll, setButtonScroll] = useState(false);
  const [propertyDetails, setProperty] = useState(null);
  const [entityToConvert, setEntityToConvert] = useState(null);
  const [isNewAgmt, setNewAgmtState] = useState(false);

  const classes = useStyles({ ...props, showInterestDetails, collapse, isNewAgmt });

  const [updateMetaOwner] = useMutation(UPSERT_USER_DESCRIPTOR);
  const [updateProperty] = useMutation(UPDATE_PROPERTY);

  const [getProperty, { data: getPropertyResult }] = useLazyQuery(GET_PROPERTY, {
    fetchPolicy: "no-cache",
  });

  const [checkIfOwnersAreContacts, { data: checkIfOwnersAreContactsData }] = useLazyQuery(IFARECONTACTS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    getProperty({
      variables: { id: propertyId },
    });
  }, [getProperty, propertyId]);

  useEffect(() => {
    if (getPropertyResult) setProperty(getPropertyResult?.getProperty.property);
    setStateApp((state) => ({
      ...state,
      selectedRevenueProperty: getPropertyResult?.getProperty.property,
    }));
  }, [getPropertyResult]);

  useEffect(() => {
    selectedTabRef.current &&
      selectedTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
  }, [tab]);

  useEffect(() => {
    const idsArray = [];
    if (propertyDetails?.owner) idsArray.push(propertyDetails.owner._id);
    if (propertyDetails?.operator) idsArray.push(propertyDetails.operator._id);
    if (idsArray.length > 0)
      checkIfOwnersAreContacts({
        variables: { idsArray },
      });
  }, [propertyDetails, refetchContacts]);

  useEffect(() => {
    if (checkIfOwnersAreContactsData?.ifAreContacts?.length > 0) {
      setPropertyOwnerContacts(
        checkIfOwnersAreContactsData?.ifAreContacts.map((c) => ({
          _id: c.isContact,
          name: c.name,
          entityId: c._id,
        }))
      );
    }
  }, [checkIfOwnersAreContactsData]);

  const handleScroll = (e) => {
    if (!isButtonScroll) {
      const { scrollTop } = e.target;
      if (scrollTop <= 150 && tab !== 0) setTab(0);
      else if (scrollTop > 150 && tab !== 1) setTab(1);
    }
    handleEndScroll();
  };

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      for (let i = 0; i < ids.length; i++) {
        updateProperty({
          variables: {
            property: {
              _id: propertyDetails._id,
              IsDeleted: true,
            },
          },
        }).then((res) => {
          history.push("/revenue/properties");
        });
      }
    }
  };

  const handleEndScroll = useMemo(() => debounce(() => setButtonScroll(false), 1000), []);

  const onUpdateMetaData = (data) => {
    if (data.owner)
      updateMetaOwner({
        variables: {
          descriptorObject: data.owner,
          userId: stateApp.user.mongoId,
          relatedObject: propertyDetails._id,
          relatedObjectType: "Property",
        },
      });
    else {
      updateProperty({
        variables: {
          property: {
            _id: propertyId,
            ...data,
          },
        },
        refetchQueries: ["getProperty"],
        awaitRefetchQueries: true,
      });
    }
  };

  return (
    <NavHeader title={`${get(propertyDetails, "number", "")}-${get(propertyDetails, "name", "")}`}>
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
                    Property
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
                <StyledTab label="Details" />
                <StyledTab label="Validation" />
              </StyledTabs>
            </div>
            <div className={classes.metaActions}>
              <Button startIcon={<InfoOutlinedIcon />} onClick={() => setCollapse(!collapse)}>
                Metadata
              </Button>
              <IconButton size="small" component="span" className={classes.menuIcon} onClick={(event) => setAnchorEl(event.currentTarget)}>
                <MoreHorizIcon size="medium" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justifyBetween alignStart w-100">
        <div className={classes.tabsDetailContainer}>
          {/**
           * Detail tabs section
           */}
          <div className={classes.tabsSection} style={{ display: stateApp.viewDoc ? "none" : "" }}>
            {tab === 0 && (
              <div className={classes.tabsSectionDetails}>
                <div className={classes.headerSection}>
                  <HeaderSection
                    propertyId={propertyId}
                    propertyDetails={propertyDetails}
                    propertyOwnerContact={propertyOwnerContact}
                    setEntityToConvert={setEntityToConvert}
                  />
                </div>
                <div>
                  <PropertyInterestDetailsSection
                    propertyId={propertyId}
                    setSelectedInterest={setSelectedInterest}
                    showInterestDetails={showInterestDetails}
                    onClickAdd={() => setShowInterestDetails(true)}
                    setNewAgmtState={setNewAgmtState}
                  />
                </div>
              </div>
            )}
           {tab === 1 && (
              <Validation propertyId={propertyId} />
            )}
          </div>
          {stateApp.viewDoc && <DocViewer divCondition={true} DocStyle={{ height: "calc(100vh - 280px)" }} />}
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
            propertyOwnerContact={propertyOwnerContact?.find((owner) => owner.entityId === propertyDetails?.owner?._id)}
            onClose={() => setShowInterestDetails(false)}
          />
        )}

        {entityToConvert && (
          <MultipleOwnerToContactDrawerContainer
            onClose={() => setEntityToConvert(null)}
            rows={[entityToConvert]}
            setM1nSelectedRowsIndexes={() => {}}
            onSuccess={() => setRefetchContacts(!refetchContacts)}
            setRows={() => {}}
          />
        )}

        {((!collapse && !showInterestDetails && !showOwnerDialog) || isNewAgmt) && (
          <div
            style={{
              marginTop: 20,
              marginRight: 24,
              height: "calc(100vh - 270px)",
              width: "620px",
              maxWidth: "620px",
            }}
          >
            {!isNewAgmt ? (
              <MetadataDrawer
                data={propertyDetails}
                onUpdate={onUpdateMetaData}
                setCollapse={setCollapse}
                targetLabel="Property"
                targetSourceId={propertyId}
                setStateApp={setStateApp}
                ownerTitle="Approver"
                isApproval={true}
              />
            ) : (
              <AddNewRelatedAgreementDialog
                customLayerId={propertyId}
                setDrawer={(value) => setNewAgmtState(value === "agrmt")}
                parentType="Property"
              />
            )}
          </div>
        )}
      </div>
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} fullWidth={true} maxWidth={"sm"}>
        <DeleteConfirmationDialogContent
          header={`Delete Property`}
          onClose={() => setOpenDeleteDialog(false)}
          deleteFunc={deleteFunc}
          m1nSelectedRowsIds={[propertyDetails?._id]}
          setM1nSelectedRowsIndexes={() => {}}
        >
          {`Do you want to delete this property?`}
        </DeleteConfirmationDialogContent>
      </Dialog>
      {/**
       * Menu for meta data
       */}
      <Menu
        id="revPropertyMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        className={classes.menu}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem onClick={() => setOpenDeleteDialog(true)}>
          <ListItemIcon>
            <DeleteIcon size="medium" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </NavHeader>
  );
}
