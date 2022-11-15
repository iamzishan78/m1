import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import moment from "moment";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import _, { debounce, get, set } from "lodash";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, IconButton, Tabs, Tab, Button, Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  DescriptionOutlined as DocumentIcon,
  InfoOutlined as InfoOutlinedIcon,
  Delete as DeleteIcon,
  MoreHoriz as MoreHorizIcon,
} from "@material-ui/icons";
import Tags from "components/Shared/Tagger";

import { setLandReduxKey } from "actions";
import { AppContext } from "AppContext";

import { copy } from "components/Shared/functions";
// Components
import NavHeader from "components/Land/components/Common/NavHeader";
import DocViewer from "components/Shared/DocViewer";
import MetadataDrawer from "components/Revenue/components/Common/MetadataDrawer";
import Summary from "components/Land/components/Agreements/detailComponents/summary";
import RelatedParties from "components/Land/components/Agreements/detailComponents/relatedParties";
import Provisions from "components/Land/components/Agreements/detailComponents/provisions";
import LegalDescription from "components/Land/components/Agreements/detailComponents/legalDescription";
import RelatedWells from "components/Land/components/Agreements/detailComponents/relatedWells";
import Documents from "components/Land/components/Agreements/detailComponents/documents";
import RelatedAgreementsTable from "components/Land/components/Agreements/detailComponents/relatedAgreements";
import AddNewRelatedAgreementDialog from "components/Land/components/Agreements/detailComponents/relatedAgreements/AddNewRelatedAgreementDialog";

import { useLazyQuery, useMutation } from "@apollo/client";
import { CUSTOMLAYER } from "graphQL/useQueryCustomLayer";
import { GET_STANDARD_PROVISIONS } from "graphQL/useQueryGetStandardProvisions";
import { GET_AGREEMENT_PROVISIONS } from "graphQL/useQueryGetAgreementProvisions";
import { UPDATECUSTOMLAYER } from "graphQL/useMutationUpdateCustomLayer";
import { SHAPE_SUMMARY_DETAILS } from "graphQL/useQueryShapeSummaryDetail";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
// import { UPSERT_USER_DESCRIPTOR } from "graphQL/useMutationUserDescriptor";
import MapImgViewIcon from "components/Shared/svgIcons/MapImgViewIcon";
import MapProvider from "components/Map/MapProvider";
import { DrawerContext } from "./DrawerContext";

const useStyles = makeStyles((theme) => ({
  mapProvider: {
    position: "relative",
    zIndex: "9999",
    height: "calc(100vw - 63vw)",
  },
  detailHeader: {
    backgroundColor: "#fff",
    padding: "20px 27px 0px 45px",
    marginTop: "7px",
  },
  title: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  titleText: {
    marginLeft: 16,
    width: "100%",
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
  tabDetailSection: {
    padding: 20,
    background: "#ffffff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
  },
  tags: {
    "& fieldset": {
      border: "none",
    },
    width: "100%",
  },
  tabsSectionDetails: {
    maxHeight: "calc(100vh - 280px)",
    overflow: "overlay",
    backgroundColor: "#f3f3f3",
  },
  actionsContainer: {
    display: "flex",
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  metaActions: {
    marginTop: "2px",
    "& button": {
      margin: "0px 5px",
      color: "grey",
      fontWeight: "bold",
      textTransform: "capitalize",
      padding: "6px 12px",
    },
  },
  metaButton: ({ drawer }) => ({
    backgroundColor: drawer === "meta" ? "#eceded" : "#fff",
    "&:hover": {
      backgroundColor: !!drawer ? "#eceded" : "#fff",
    },
  }),
  mapButton: ({ mapCollapse }) => ({
    backgroundColor: !mapCollapse ? "#eceded" : "#fff",
    "&:hover": {
      backgroundColor: !mapCollapse ? "#eceded" : "#fff",
    },
  }),
  validationButton: ({ validationCollapse }) => ({
    backgroundColor: !validationCollapse ? "#eceded" : "#fff",
    "&:hover": {
      backgroundColor: !validationCollapse ? "#eceded" : "#fff",
    },
  }),
  flowlineButton: ({ flowlineCollapse }) => ({
    backgroundColor: !flowlineCollapse ? "#eceded" : "#fff",
    "&:hover": {
      backgroundColor: !flowlineCollapse ? "#eceded" : "#fff",
    },
  }),
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
  tabsDetailContainer: ({ drawer }) => ({
    padding: 20,
    width: !!drawer ? "calc(100% - 644px)" : "100%",
  }),
  menuIcon: {
    marginLeft: 10,
    background: "transparent",
    align: "center",
    "& svg": {
      fill: "#808080 !important",
    },
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

export function DetailComponents(props) {
  const { id: agreementId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const agreementDetails = useSelector(({ Land }) => Land.agreement?.activeAgreement?.shape)?.properties;
  const activeAgreement = useSelector(({ Land }) => Land.agreement?.activeAgreement);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [drawer, setDrawer] = useContext(DrawerContext);

  const [tab, setTab] = useState(0);
  const selectedTabRef = useRef(null);
  // const [isNewAgmt, setNewAgmtState] = useState(false);
  const [isButtonScroll, setButtonScroll] = useState(false);
  const [mapCollapse, setMapCollapse] = useState(true);
  const [validationCollapse, setValidationCollapse] = useState(true);
  const [flowlineCollapse, setFlowlineCollapse] = useState(true);
  const [anchorEl, setAnchorEl] = useState();
  const [uniObj, setUniObj] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles({ ...props, drawer, validationCollapse, flowlineCollapse, mapCollapse });
  // queries

  const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(CUSTOMLAYER);
  const [getStandardProvisions, { data: standardProvisions }] = useLazyQuery(GET_STANDARD_PROVISIONS);
  const [getAgreementProvisions, { data: agreementProvisions }] = useLazyQuery(GET_AGREEMENT_PROVISIONS);
  const [getShapeSummaryDetails, { data: dataShapeSummaryDetails }] = useLazyQuery(SHAPE_SUMMARY_DETAILS);
  const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);
  // const [updateMetaData] = useMutation(UPSERT_USER_DESCRIPTOR);

  useEffect(() => {
    return () => {
      dispatch(
        setLandReduxKey("agreement", {
          activeAgreement: {},
        })
      );
    };
  }, [dispatch]);

  useEffect(() => {
    if (agreementId) {
      getAgreementProvisions({ variables: { agreementId: agreementId } });
    }
  }, [agreementId, getAgreementProvisions]);

  useEffect(() => {
    getStandardProvisions();
  }, [getStandardProvisions]);

  useEffect(() => {
    if (selectedTabRef?.current && isButtonScroll) {
      selectedTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  }, [tab, isButtonScroll]);

  useEffect(() => {
    if (agreementId) {
      getCustomLayer({ variables: { id: agreementId } });
    }
  }, [agreementId, getCustomLayer]);

  useEffect(() => {
    if (dataCustomLayer && dataCustomLayer.customLayer) {
      let shape = JSON.parse(dataCustomLayer.customLayer.shape);
      if (dataCustomLayer.customLayer.shapeJson) shape = copy(dataCustomLayer.customLayer.shapeJson);

      shape.id = dataCustomLayer.customLayer._id;
      shape.properties.id = dataCustomLayer.customLayer._id;
      shape.layer = { id: "unit" };
      setStateApp((state) => ({
        ...state,
        selectedShape: { ...shape.properties, shape },
      }));
      dispatch(
        setLandReduxKey("agreement", {
          activeAgreement: {
            ...dataCustomLayer.customLayer,
            shape,
          },
        })
      );
    }
  }, [dataCustomLayer?.customLayer]);

  useEffect(() => {
    if (activeAgreement) {
      let shape = activeAgreement.shape;
      if (activeAgreement.shapeJson) shape = copy(activeAgreement.shapeJson);
      setUniObj({
        ...activeAgreement,
        shape,
      });
    }
  }, [activeAgreement]);

  useEffect(() => {
    if (activeAgreement?._id) {
      getShapeSummaryDetails({
        variables: {
          shapeId: activeAgreement._id,
          shapeType: "Agreement",
        },
      });
    }
  }, [activeAgreement, getShapeSummaryDetails]);

  useEffect(() => {
    const escapeFunc = (e) => {
      if (e.key === "Escape") {
        setMapCollapse(true);
      }
    };
    document.addEventListener("keyup", escapeFunc);
    return () => {
      setStateApp({ ...stateApp, viewDoc: null });
      document.removeEventListener("keyup", escapeFunc);
    };
  }, []);

  const updateAgreement = (field, value, isCustom) => {
    if (agreementDetails[field] === value) return;
    const shape = activeAgreement.shape;
    if (field === "agreementTerm" || field === "effectiveDate") {
      if (field === "agreementTerm") {
        shape.properties.expirationDate = moment(shape.properties.effectiveDate, "YYYY-MM-DD")
          .add(parseInt(value), "months")
          .format("YYYY-MM-DD");
      } else {
        shape.properties.expirationDate = moment(value, "YYYY-MM-DD")
          .add(parseInt(shape.properties.agreementTerm), "months")
          .format("YYYY-MM-DD");
      }
    }
    // Used for Agreement nra, net_acres and grossAcres overidden
    if (value?.overridden?.toString()) {
      set(shape, `properties.overridden.${field}`, value.overridden);
      value = value.value;
    }
    set(shape, `properties.${field}`, value);
    const customLayer = {};
    let shapeLabel = shape.properties.shapeLabel;
    if (field === "agreementNumber") shapeLabel = `${value}${shape.properties.agreementName ? `-${shape.properties.agreementName}` : ""}`;

    if (field === "agreementName") shapeLabel = `${shape.properties.agreementNumber ? `${shape.properties.agreementNumber}-` : ""}${value}`;

    if (field === "agreementType") {
      customLayer.layer = value;
    }
    if (field === "state") {
      if (shape.properties.originalProperties) {
        shape.properties.originalProperties.State = value;
        shape.properties.originalProperties.StateAbbreviation = value;
      } else {
        shape.properties.originalProperties = { State: value, StateAbbreviation: value }
      }
    }
    if (field === "county") {
      if (shape.properties.originalProperties) {
        shape.properties.originalProperties.County = value;
      } else {
        shape.properties.originalProperties = { County: value }
      }
    }

    shape.properties.shapeLabel = shapeLabel;
    shape.name = shapeLabel;
    shape.properties.name = shapeLabel;
    customLayer.shape = JSON.stringify(shape);
    customLayer.shapeJson = shape;

    updateCustomLayer({
      variables: {
        customLayerId: activeAgreement._id,
        customLayer,
        userId: stateApp.user.mongoId,
      },
      refetchQueries: ["customLayer"],
    });
  };

  const getRelativePosition = (childDivId) => {
    const parentPos = document.getElementById("parent-div").getBoundingClientRect();
    const childPos = document.getElementById(childDivId).getBoundingClientRect();
    const relativePos = {};

    relativePos.top = childPos.top - parentPos.top;
    relativePos.right = childPos.right - parentPos.right;
    relativePos.bottom = childPos.bottom - parentPos.bottom;
    relativePos.left = childPos.left - parentPos.left;
    return relativePos.top;
  };

  const handleScroll = (e) => {
    if (!isButtonScroll) {
      let activeTab = 0;
      if (getRelativePosition("summary-div") < 5) activeTab = 0;
      if (getRelativePosition("related-parties-div") < 30) activeTab = 1;
      if (getRelativePosition("provisions-div") < 30) activeTab = 2;
      if (getRelativePosition("legal-description-div") < 30) activeTab = 3;
      if (getRelativePosition("related-wells-div") < 30) activeTab = 4;
      if (getRelativePosition("related-docs-div") < 30) activeTab = 5;
      if (getRelativePosition("related-agrmt-div") < 30) activeTab = 6;

      if (tab !== activeTab) setTab(activeTab);
    }
    handleEndScroll();
  };

  const handleEndScroll = useMemo(() => debounce(() => setButtonScroll(false), 1000), []);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);

  const handleDeleteAgreement = () => {
    updateCustomLayer({
      variables: {
        customLayerId: dataCustomLayer?.customLayer?._id,
        customLayer: {
          IsDeleted: true,
        },
      },
    }).then(({ data }) => {
      if (data.updateCustomLayer?.success) history.push("/land/agreements");
    });
  };

  const handleMetaToggle = () => {
    setDrawer(drawer === "meta" ? null : "meta");
  };

  return (
    <NavHeader title={`${agreementDetails?.agreementNumber} - ${agreementDetails?.agreementName}`}>
      {/**
       * Detail title section
       */}
      <div className={`${classes.detailHeader} flex justifyBetween alignStart w-100`}>
        <div className="flex column alignStart justifyStart w-100">
          <div className={classes.title}>
            <IconButton className={classes.icon}>
              <DocumentIcon id="documentIcon" />
            </IconButton>
            <div className={classes.titleText}>
              {agreementDetails && (
                <Typography
                  style={{
                    fontWeight: "bold",
                    fontSize: "large",
                    marginLeft: 8,
                  }}
                >{`${agreementDetails?.agreementNumber} - ${agreementDetails?.agreementName}`}</Typography>
              )}
              <div className={classes.tagsContainer}>
                <div className={classes.highlighter}>
                  <Typography className={classes.highlight} variant="highlight">
                    {agreementDetails?.agreementType}
                  </Typography>
                </div>
                <div className={classes.tags}>
                  <Tags width="100%" targetSourceId={agreementId} targetLabel="agreement" publicLeftBottom onlyTags />
                </div>
              </div>
            </div>
          </div>

          <div className={classes.actionsContainer}>
            <div className={classes.tabsHeader}>
              <StyledTabs
                value={tab}
                onChange={(event, tab) => {
                  setButtonScroll(true);
                  setTab(tab);
                }}
                aria-label="ant example"
              >
                <StyledTab label="Summary" />
                <StyledTab label="Parties" />
                <StyledTab id="provisionsTab" label="Provisions" />
                <StyledTab label="Legal Description" />
                <StyledTab label="Wells" />
                <StyledTab label="Documents" />
                <StyledTab label="Related Agreements" />
                {/* <StyledTab label="Related Info" /> */}
              </StyledTabs>
            </div>
            <div className={classes.metaActions}>
              {/* temp hide these buttons until we add the functionality -kc 20220520 */}
              {/* <Button
                startIcon={<RuleIcon />}
                className={classes.validationButton}
                onClick={() => setValidationCollapse(!validationCollapse)}
              >
                Validation
              </Button>
              <Button startIcon={<FlowIcon />} className={classes.flowlineButton} onClick={() => setFlowlineCollapse(!flowlineCollapse)}>
                Flowline
              </Button> */}
              <Button
                startIcon={<MapImgViewIcon />}
                className={classes.mapButton}
                onClick={() => {
                  setMapCollapse((o) => !o);
                }}
              >
                Map View
              </Button>
              <Button id="metaDataButton" startIcon={<InfoOutlinedIcon />} className={classes.metaButton} onClick={handleMetaToggle}>
                Metadata
              </Button>
              <IconButton size="small" component="span" className={classes.menuIcon} onClick={handleMenuClick}>
                <MoreHorizIcon id="moreHorizIcon" size="medium" />
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
            <div id="parent-div" className={classes.tabsSectionDetails} onScroll={handleScroll}>
              {mapCollapse ? (
                <div
                  id="summary-div"
                  className={classes.tabDetailSection}
                  ref={tab === 0 ? selectedTabRef : null}
                  style={{ backgroundColor: "#fff" }}
                >
                  <Summary
                    agreementDetails={agreementDetails}
                    activeAgreement={activeAgreement}
                    agreementProvisions={get(agreementProvisions, "getAgreementProvisions", [])}
                    standardProvisions={get(standardProvisions, "getStandardProvisions", [])}
                    updateAgreement={updateAgreement}
                    shapeSummaryDetails={dataShapeSummaryDetails?.shapeSummaryDetails}
                  />
                </div>
              ) : (
                <div id="summary-div" ref={tab === 0 ? selectedTabRef : null} className={`${classes.mapProvider}  summary-div-small-map`}>
                  <MapProvider
                    match={{
                      params: {
                        expandedPanel: false,
                        openSpeedDial: false,
                        hideShape: true,
                        paramId: agreementId,
                        layerPadding: { padding: { top: 50, bottom: 50, left: !drawer ? 300 : 700, right: 20 } },
                      },
                    }}
                  ></MapProvider>
                </div>
              )}
              <div style={{ backgroundColor: "#f3f3f3 !important", height: 24 }} />
              <div id="related-parties-div" className={classes.tabDetailSection} ref={tab === 1 ? selectedTabRef : null}>
                <RelatedParties agreementDetails={agreementDetails} agreementId={agreementId} />
              </div>
              <div style={{ backgroundColor: "#f3f3f3 !important", height: 24 }} />
              <div id="provisions-div" className={classes.tabDetailSection} ref={tab === 2 ? selectedTabRef : null}>
                <Provisions
                  agreementDetails={agreementDetails}
                  agreementId={agreementId}
                  agreementProvisions={get(agreementProvisions, "getAgreementProvisions", [])}
                  standardProvisions={get(standardProvisions, "getStandardProvisions", [])}
                />
              </div>
              <div style={{ backgroundColor: "#f3f3f3 !important", height: 24 }} />
              <div id="legal-description-div" className={classes.tabDetailSection} ref={tab === 3 ? selectedTabRef : null}>
                <LegalDescription
                  agreementDetails={agreementDetails}
                  uniObj={uniObj}
                  agreementId={agreementId}
                  updateAgreement={updateAgreement}
                />
              </div>
              <div style={{ backgroundColor: "#f3f3f3 !important", height: 24 }} />
              <div id="related-wells-div" className={classes.tabDetailSection} ref={tab === 4 ? selectedTabRef : null}>
                <RelatedWells uniObj={uniObj} shapeSummaryDetails={dataShapeSummaryDetails?.shapeSummaryDetails} />
              </div>
              <div style={{ backgroundColor: "#f3f3f3 !important", height: 24 }} />
              <div id="related-docs-div" className={classes.tabDetailSection} ref={tab === 5 ? selectedTabRef : null}>
                <Documents uniObj={uniObj} />
              </div>
              <div style={{ backgroundColor: "#f3f3f3 !important", height: 24 }} />
              <div id="related-agrmt-div" className={classes.tabDetailSection} ref={tab === 6 ? selectedTabRef : null}>
                <RelatedAgreementsTable uniObj={uniObj} setDrawer={setDrawer} />
              </div>
            </div>
          </div>

          {/*** Component for viewing selected pdf file*/}
          {stateApp.viewDoc && <DocViewer divCondition={true} DocStyle={{ height: "calc(100vh - 280px)" }} />}
        </div>

        <div
          style={{
            marginTop: 20,
            marginRight: 24,
            height: "calc(100vh - 270px)",
            overflow: "auto",
            width: !!drawer ? 620 : 0,
            background: "white",
          }}
          id={"agreementDetailsDrawer"}
        >
          {drawer === "meta" && (
            <MetadataDrawer
              setCollapse={(value) => setDrawer(!value)}
              targetSourceId={agreementId}
              data={agreementDetails}
              targetLabel="Shape"
              showDescription={false}
              descriptionKey="description"
              ownerPlaceHolder="Assign Approver"
              ownerTitle="Approver"
              onUpdate={(data) => Object.keys(data).forEach((key) => updateAgreement(key, data[key]))}
              isSource={false}
              isApproval
              showCommentType
            />
          )}
          {drawer === "agrmt" && (
            <AddNewRelatedAgreementDialog
              customLayerId={get(dataCustomLayer, "customLayer._id")}
              setDrawer={setDrawer}
              parentType="Agreement"
            />
          )}
        </div>
      </div>

      {/**
       * Menu for meta data
       */}
      <Menu
        id="revStatementMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        className={classes.menu}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem
          onClick={() => {
            setOpenDialog(true);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <DeleteIcon size="medium" />
          </ListItemIcon>
          <ListItemText id="deleteItem">Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/**
       * Delete Custom Layer confirmation dialog
       * */}
      {openDialog && (
        <DeleteConfirmationDialogContent
          header="Delete Agreement"
          onClose={() => setOpenDialog(false)}
          deleteFunc={handleDeleteAgreement}
          m1nSelectedRowsIds={null}
          setM1nSelectedRowsIndexes={() => { }}
        >
          Are you sure you want to delete this agreement?
        </DeleteConfirmationDialogContent>
      )}
    </NavHeader>
  );
}
