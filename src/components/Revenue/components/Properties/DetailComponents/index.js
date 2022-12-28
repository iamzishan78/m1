import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { debounce, get } from "lodash";

import { Grid } from "@material-ui/core";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, IconButton, Tabs, Tab, Button, Menu, MenuItem, ListItemIcon, ListItemText, Dialog } from "@material-ui/core";
import {
  DescriptionOutlined as DocumentIcon,
  InfoOutlined as InfoOutlinedIcon,
  MoreHoriz as MoreHorizIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import moment from "moment";
import sortBy from 'lodash/sortBy'

import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
import { UPSERT_USER_DESCRIPTOR } from "graphQL/useMutationUserDescriptor";
import { UPDATE_PROPERTY } from "graphQL/useMutationUpdateProperty";
import { IFARECONTACTS } from "graphQL/useQueryIfOwnersAreContacts";
import { GET_PROPERTY } from "graphQL/useQueryGetProperty";
import { AppContext } from "AppContext";
import { GET_ASSOCIATED_WELL_PRODUCTION_DATA } from "graphQL/useQueryAssociatedWellProductionData";

import { WellCardContext, WellCardContextProvider } from "components/WellCard/WellCardContext";
import { WellProdChartContext, WellProdChartContextProvider } from "components/WellProdChart/WellProdChartContext";

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
import ValidationFilter from "./ValidationFilter";
import WellProdChart from "components/WellProdChart/WellProdChart";
import TabButtons from "components/Shared/TabPanels/TabButtons";
import AssociatedWellsProductionTable from "components/Table/Revenue/AssociatedWellsProductionTable";
import AddNewRelatedAgreementDialog from "components/Land/components/Agreements/detailComponents/relatedAgreements/AddNewRelatedAgreementDialog";
import OverShortComparison from 'components/Revenue/components/Properties/DetailComponents/Validation/OverShortComparison'

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
  const [tab, setTab] = useState(0);
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

const Validation = ({ propertyId }) => {
  const [esFilters, setESFilters] = useState([]);
  const [filterToggle, setFilterToggle] = useState(false);
  const [associatedWellIds, setAssociatedWellIds] = useState([]);
  const [wellProductionData, setWellProductionData] = useState([]);
  const [checkDetailsData, setCheckDetailsData] = useState([]);
  const [startDate, setStartDate] = useState(null);

  const [getESSimpleSearch, { data: elasticData }] = useLazyQuery(GET_ES_SIMPLE_SEARCH, { fetchPolicy: "no-cache" });

  useEffect(() => {
    getESSimpleSearch({
      variables: {
          index: 'checkdetails_flat',
          pagination: {
              first: 10000,
              after: null
          },
          search: {
              query: "",
              fields: [],
          },
          filters: [
            {field: "property._id.keyword", value: propertyId },
            {field: 'date', type: 'range', value: esFilters[0]?.value?.range?.date}
          ]
      }
  })
  },[esFilters])

  useEffect(() => {
    if(elasticData?.getESSimpleSearch?.hits?.length > 0){
      let data = []
      for(let i = 0; i < elasticData?.getESSimpleSearch?.hits?.length; i++) {
        const check = elasticData?.getESSimpleSearch?.hits[i]
        data.push({
          product: check.product,
          ReportDate: check.date,
          oil: check.product === 'OIL' ? check.grossPropertyVolume : 0,
          gas: check.product === 'GAS' ? check.grossPropertyVolume : 0,
          water: check.product === 'WATER' ? check.grossPropertyVolume : 0,
        })
      }
      data = sortBy(data, ['ReportDate']);
      setCheckDetailsData(data)
    }
    
  },[elasticData])

  return (
    <div style={{ background: "white", padding: "10px" }}>
      <ValidationFilter
        field={"date"}
        defaultStartDate={startDate}
        setESFilters={setESFilters}
        setFilterToggle={setFilterToggle}
        filterToggle={filterToggle}
      />

      <Grid
        container
        direction="row"
        display="flex"
        justify="space-between"      
      >
        <Grid item xs={6}>
          <WellCardContextProvider>
            <WellProdChartContextProvider>
              <ValidationChart
                filter={esFilters}
                propertyId={propertyId}
                setStartDate={setStartDate}
                wellProductionData={wellProductionData}
                setWellProductionData={setWellProductionData}
                setAssociatedWellIds={setAssociatedWellIds}
              />
            </WellProdChartContextProvider>
          </WellCardContextProvider>
        </Grid>
        <Grid item xs={6}>
          <OverShortComparison productionData={wellProductionData} checkData={checkDetailsData}/>
        </Grid>
      </Grid>

      <ValidationGrids associatedWellIds={associatedWellIds} />
    </div>
  );
};

const ValidationChart = ({ filter, setStartDate, propertyId, setAssociatedWellIds, wellProductionData, setWellProductionData }) => {
  const [, setStateWellCard] = useContext(WellCardContext);
  const [, setStateWellProdChart] = useContext(WellProdChartContext);
  const [getAssociatedWellProductionData, { data: associatedWells }] = useLazyQuery(GET_ASSOCIATED_WELL_PRODUCTION_DATA);

  useEffect(() => {
    setStateWellCard((state) => {
      return {
        ...state,
        wellProdHistory: JSON.parse(JSON.stringify(wellProductionData)),
      };
    });
    setStateWellProdChart((state) => ({
      ...state,
      wellProdHistory: JSON.parse(JSON.stringify(wellProductionData)),
    }));
  }, [wellProductionData]);

  useEffect(() => {
    if (associatedWells?.getAssociatedWellProductionData?.length > 0) {
      const wellData = JSON.parse(JSON.stringify(associatedWells.getAssociatedWellProductionData));
      const productionData = [];
      const wellIds = [];
      wellData.forEach((data) => {
        wellIds.push(data.well._id);
        if (data.well.productionData.length > 0) {
          let pData = JSON.parse(JSON.stringify(data.well.productionData));
          if (filter[0].value.range.date.lte) {
            pData = pData.filter((d) => moment(moment(d.data.ReportDate).format('MM/DD/yyyy')) <= moment(moment(filter[0].value.range.date.lte).format('MM/DD/yyyy')));
          }
          if (filter[0].value.range.date.gte) {
            pData = pData.filter((d) => moment(moment(d.data.ReportDate).format('MM/DD/yyyy')) >= moment(moment(filter[0].value.range.date.gte).format('MM/DD/yyyy')));
          }

          pData.forEach((production) => {
            production = JSON.parse(JSON.stringify(production.data));
            const date = moment(production.ReportDate).format("MM/yyyy");
            production.ReportDate = date;
            const index = productionData.findIndex((d) => d.ReportDate === date);

            if (index > -1) {
              productionData[index].allocatedGas = get(productionData[index], "allocatedGas", 0) + get(production, "allocatedGas", 0);
              productionData[index].allocatedOil = get(productionData[index], "allocatedOil", 0) + get(production, "allocatedOil", 0);
              productionData[index].allocatedWater = get(productionData[index], "allocatedWater", 0) + get(production, "allocatedWater", 0);
              productionData[index].gas = get(productionData[index], "gas", 0) + get(production, "gas", 0);
              productionData[index].oil = get(productionData[index], "oil", 0) + get(production, "oil", 0);
              productionData[index].water = get(productionData[index], "water", 0) + get(production, "water", 0);
            } else {
              production.allocatedGas = production.allocatedGas ? production.allocatedGas : 0;
              production.allocatedOil = production.allocatedOil ? production.allocatedOil : 0;
              production.allocatedWater = production.allocatedWater ? production.allocatedWater : 0;
              production.gas = production.gas ? production.gas : 0;
              production.oil = production.oil ? production.oil : 0;
              production.water = production.water ? production.water : 0;
              productionData.push(production);
            }
          });
        }
      });

      setAssociatedWellIds(wellIds);
      setWellProductionData(JSON.parse(JSON.stringify(productionData)));
    }
  }, [associatedWells, filter]);

  useEffect(() => {
    if (associatedWells?.getAssociatedWellProductionData) {
      let minDate = new Date();
      const wellData = JSON.parse(JSON.stringify(associatedWells.getAssociatedWellProductionData));

      wellData.forEach((data) => {
        let pData = data.well.productionData;
        const newMinDate = new Date(
          Math.min(
            ...pData.map((element) => {
              return new Date(element.data.ReportDate);
            })
          )
        );
        if (newMinDate < minDate) {
          minDate = newMinDate;
        }
      });
      setStartDate(minDate);
    }
  }, [associatedWells]);


  useEffect(() => {
    getAssociatedWellProductionData({
      variables: {
        relatedObject: propertyId,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <WellProdChart />;
};

const ValidationGrids = ({ associatedWellIds }) => {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);

  const Header = () => (
    <TabButtons
      labels={["Well Production"]}
      value={selectedTab}
      setValue={(n) => {
        setSelectedTab(n);
      }}
    />
  );

  return (
    <div className={`${classes.sectionCard} flex column justifyStart alignStart w-100`}>
      {selectedTab === 0 && (
        <AssociatedWellsProductionTable
          targetLabel="propertyInterest"
          parent="PropertyAssociatedWell"
          header={<Header />}
          associatedWellIds={associatedWellIds}
        />
      )}
    </div>
  );
};
