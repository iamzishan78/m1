import React, { useState, useContext, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../AppContext";
import Draggable from "react-draggable";
import Card from "@material-ui/core/Card";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import ExpandIcon from "../Shared/svgIcons/ExpandIcon";
import ShrinkIcon from "../Shared/svgIcons/ShrinkIcon";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import MapGridCardSearch from "./components/MapGridCardSearch";
import M1nTable from "../Shared/M1nTable/M1nTable";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Button from "@material-ui/core/Button";
import { setMapGridCardState } from "../../actions";
import OwnersSummaryCard from "../OwnersSummaryCard/OwnersSummaryCard";

import ContactsHeadCells from '../Shared/constants/contacts-header-schema.js'
import WellsHeadCells from '../Shared/constants/well-header-schema.js'
import wellsColumnHeaders from '../Shared/constants/well-header-schema.js'
import parcelsColumnHeaders from '../Shared/constants/parcel-header-grid.js'


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => {

  return {
    card: {
      "& .noDrag": {
        transform: "translate(0px, 0px) !important",
        transition:
          "transform 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out",
        WebkitTransition:
          "transform 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out",
      },
    },
    rootList: {
      //removing the shrinking of the search card on fly to for now
      // opacity: ({ mapGridCardActivated }) =>
      //   mapGridCardActivated === "min" ? ".6" : "1",
      // transition:
      //   "opacity 0.2s ease-out, transform 0.05s ease-out, width 0.3s ease-out, height 0.3s ease-out",
      // WebkitTransition:
      //   "opacity 0.2s ease-out, transform 0.05s ease-out, width 0.3s ease-out, height 0.3s ease-out",
      width: ({ mapGridCardActivated }) =>
        mapGridCardActivated === "min"
        //removed shrinking for now
        // ? "600px"
         ? "57vw"

          : mapGridCardActivated === "exp"
            ? "96vw"
            : "57vw",
      height: ({ mapGridCardActivated }) =>
        mapGridCardActivated === "min"
        //removed shrinking for now  
        // ? "114px"
         ? "60vh"

          : mapGridCardActivated === "exp"
            ? "91vh"
            : "60vh",
      left: ({ mapGridCardActivated }) =>
        mapGridCardActivated === "exp" ? "2vw" : "2vw",
      top: ({ mapGridCardActivated }) =>
        mapGridCardActivated === "exp" ? "5vh" : "12vh",
      zIndex: "1300",
      position: "fixed",
    },
    tapsRoot: {
      flexGrow: 1,
      "& .MuiTab-root": {
        textTransform: "none",
      },
    },
    appBar: {
      // cursor: ({ mapGridCardActivated }) =>
      //   mapGridCardActivated === "exp" || mapGridCardActivated === "min"
      //     ? "context-menu"
      //     : "move", 
      cursor: "context-menu",
      "& .MuiIconButton-root:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
      },
      "& button": {
        cursor: "pointer",
      },
    },
    tapsPanels: {
      "& .MuiBox-root": { padding: "0" },
    },
    tapsPanelsPadding: {
      "& .MuiBox-root": { padding: "0" },
    },
    mainPanelsDiv: {
      height: "calc(100% - 64px)",
      maxHeight: "calc(100% - 64px)",
      overflow: "auto",
      // overflowX: "auto",
      "& div": {
        "&>.MuiPaper-root": {
          "&>:nth-child(3)": {
            //   transition:
            //   "min-height 0.3s ease-out",
            // WebkitTransition:
            //   "min-height 0.3s ease-out",
            minHeight: ({ mapGridCardActiveTap, mapGridCardActivated }) =>
              mapGridCardActiveTap === 0
                ? mapGridCardActivated === "exp"
                  ? "calc(91vh - 233px)"
                  : "calc(60vh - 233px)"
                : mapGridCardActivated === "exp"
                  ? "calc(91vh - 183px)"
                  : "calc(60vh - 183px)",
          },
        },
      },
    },
    tapsLabelsButtons: {
      boxShadow: "none",
      backgroundColor: "#fff",
      color: "#757575",
      "&:hover": { boxShadow: "none !important" },
    },
    tapsLabelsButtonsSelected: {
      boxShadow: "none",
      color: "#fff",
      backgroundColor: theme.palette.secondary.main,
      "&:hover": { color: "#757575", boxShadow: "none !important" },
    },
    viewportWells: {
      textAlign: ({ viewportWells }) => (viewportWells ? "inherit" : "center"),
      "& #minimumZoomRequired": {
        margin: "30px",
        fontSize: "1.25rem",
        fontFamily: "Poppins",
        fontWeight: "500",
        lineHeight: "1.6",
        display: ({ viewportWells }) => (viewportWells ? "none" : "block"),
      },
      "& #viewportWellsTable": {
        display: ({ viewportWells }) => (viewportWells ? "block" : "none"),
      },
    },
  };
});

const TabLabels = ({ labels, value, setValue }) => {
  const classes = useStyles();

  return (
    <>
      {labels &&
        labels.length &&
        labels.map((label, i) => (
          <Button
            key={i}
            size="small"
            variant="contained"
            className={
              value === i
                ? classes.tapsLabelsButtonsSelected
                : classes.tapsLabelsButtons
            }
            onClick={() => {
              setValue(i);
            }}
          >
            {label}
          </Button>
        ))}
    </>
  );
};

function tabPanelsPropsAreEqual(prevProps, nextProps) {
  return Object.is(prevProps.value, nextProps.value);
}

const TabPanels = ({ panels, value }) => {

  const classes = useStyles();
  return (
    panels &&
    panels.length &&
    panels.map((panel, i) => (
      <TabPanel key={i} value={value} index={i} className={classes.tapsPanels}>
        {panel}
      </TabPanel>
    ))
  );
};


const ownersColumnHeaders = [
  {
    name: "entity",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "OwnerName",
    label: "Name",
  },
  {
    name: "StreetAddress",
    label: "Street Address",
  },
  {
    name: "City",
    label: "City",
  },
  {
    name: "State",
    label: "State",
  },
  {
    name: "Zip",
    label: "Zip Code",
  },

  // {
  //   name: "FullAddress",
  //   label: "Address",
  // },
];


const operatorsColumnHeaders = [
  {
    name: "Operator",
    label: "Operator",
  },
  {
    name: "StateCount",
    label: "# Active States",
  },
  {
    name: "BasinCount",
    label: "# Active Basins",
  },
  // {
  //   name: "TotalLeases",
  //   label: "Total Leases",
  // },
  {
    name: "TotalWellCount",
    label: "Total Wells",
  },
  {
    name: "GasWellCount",
    label: "Gas Wells",
  },
  {
    name: "OilWellCount",
    label: "Oil Wells",
  },
  {
    name: "ActiveWellCount",
    label: "Active Wells",
  },
  {
    name: "DUCWellCount",
    label: "DUCs",
  },
  {
    name: "PermitCount",
    label: "Active Permits",
  },
];
const leasesColumnHeaders = [
  {
    name: "Lease",
    label: "Lease",
  }, 
  {
    name: "LeaseId",
    label: "Lease Number",
  },
  {
    name: "State",
    label: "State",
  },
  {
    name: "County",
    label: "County",
  },
  // {
  //   name: "Acreage",
  //   label: "Acreage",
  // },
  {
    name: "BasinCount",
    label: "Basin Count",
  },
  {
    name: "PlayCount",
    label: "Play Count",
  },
  {
    name: "FormationCount",
    label: "Formation Count",
  },
  {
    name: "OperatorCount",
    label: "Operator Count",
  },
  {
    name: "TotalWellCount",
    label: "Total Wells",
  },
  {
    name: "GasWellCount",
    label: "Gas Wells",
  },
  {
    name: "OilWellCount",
    label: "Oil Wells",
  },
  {
    name: "ActiveWellCount",
    label: "Active Wells",
  },
  {
    name: "DUCWellCount",
    label: "DUC Wells",
  },
  {
    name: "PermitCount",
    label: "Active Permits",
  },

];

const locationsColumnHeaders = [
  {
    name: "Primary",
    label: "Location Name",
  },
  {
    name: "Secondary",
    label: "Location Address",
  },
];




function MapGridCard(props) {
  const [stateApp, setStateApp] = useContext(AppContext);
  const dispatch = useDispatch();
  const {
    mapGridCardActivated,
    mapGridCardActiveTap,
    searchResultData,
    viewportData,
    trackedDataCount,
    selectedOwner,
  } = useSelector(({ MapGridCard }) => MapGridCard, shallowEqual);
  const [searchTapValue, SearchTapValue] = useState(0);
  const setSearchTapValue = (state) => {
    if (searchTapValue != state) {
      SearchTapValue(state);
    }
  };
  const [viewportTapValue, ViewportTapValue] = useState(0);
  const setViewportTapValue = (state) => {
    if (viewportTapValue != state) {
      ViewportTapValue(state);
    }
  };
  const [trackedTapValue, TrackedTapValue] = useState(0);
  const setTrackedTapValue = (state) => {
    if (trackedTapValue != state) {
      TrackedTapValue(state);
    }
  };
  const [gridTapValue, GridTapValue] = useState(0);
  const setGridTapValue = (state) => {
    if (gridTapValue != state) {
      GridTapValue(state);
    }
  };

  const classes = useStyles({
    mapGridCardActivated,
    mapGridCardActiveTap,
    viewportWells: stateApp.viewportWells,
  });

  const handleMainTapChange = (event, newValue) => {

    dispatch(
      setMapGridCardState({
        mapGridCardActiveTap: newValue,
        selectedOwner: null,
        selectedOwnerWellIntsSummary: null,
      })
    );
  };


  const getTargetFromSearchTaps = () => {
    /// this intends to set the search value that gets passed into the mapgridcardsearch.js
    /// value will control the cog api 

    switch (searchTapValue) {
      case 5:
        return "location";
      case 4:
        return "contacts";  
      // case 5:
      //   return "permits";      
      // case 4:
      //   return "parcel";
      case 3:
        return "lease";
      case 2:
        return "operator";
      case 1:
        return "owner";
      default:
        return "well";
    }
  };

  const SearchTabPanels = () => (
    <TabLabels
      labels={[
        "Wells",
        "Tax Owners",
        "Operators",
        "Leases",
        // "Parcels",
        // "Recent Permits",
        "Contacts",
        "Locations",
      ]}
      value={searchTapValue}
      setValue={(n) => {
        setSearchTapValue(n);
        if (searchTapValue !== n) {
          dispatch(
            setMapGridCardState({ searchResultData: [], searchloading: true })
          );
        }
      }}
    />
  );

  const CardReturn = () => {
    return (
      <Card
        className={`${mapGridCardActivated === "exp" ? "noDrag" : ""} ${classes.rootList
          }`}
      >
        <AppBar
          position="static"
          className={`${mapGridCardActivated === "exp" ? "cancelDraggableEffect" : ""
            } ${classes.appBar}`}
          onClick={() => {
            if (mapGridCardActivated === "min") {
              dispatch(setMapGridCardState({ mapGridCardActivated: true }));
            }
          }}
        >
          <Toolbar style={{ paddingRight: "0" }}>
            <Tabs
              className={classes.tapsRoot}
              value={mapGridCardActiveTap}
              onChange={handleMainTapChange}
              aria-label="simple tabs example"
            >
              <Tab
                className="cancelDraggableEffect"
                label={`Search Result (${searchResultData.length})`}
                {...a11yProps(0)}
              />

              <Tab
                className="cancelDraggableEffect"
                label={`Tracked (${trackedDataCount})`}
                {...a11yProps(1)}
              />

              <Tab
                className="cancelDraggableEffect"
                label={`Viewport${stateApp.viewportWells
                  ? " (" + stateApp.viewportWells?.length + ")"
                  : ""
                  }`}
                {...a11yProps(1)}
              />

            </Tabs>

            <IconButton
              className="cancelDraggableEffect"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  setMapGridCardState({
                    mapGridCardActivated:
                      mapGridCardActivated === "exp" ? true : "exp",
                  })
                );
              }}
            >
              {mapGridCardActivated === "exp" ? (
                <ShrinkIcon viewBox="0 0 64 64" color="secondary" />
              ) : (
                  <ExpandIcon viewBox="0 0 64 64" color="secondary" />
                )}
            </IconButton>
            <IconButton
              className="cancelDraggableEffect"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  setMapGridCardState({
                    mapGridCardActivated: false,
                    selectedOwner: null,
                    selectedOwnerWellIntsSummary: null,
                  })
                );
              }}
            >
              <CloseIcon color="secondary" />
            </IconButton>
          </Toolbar>
        </AppBar>


        {selectedOwner ? (
          <OwnersSummaryCard />
        ) : (
            <div className={`cancelDraggableEffect ${classes.mainPanelsDiv}`} style={{position:"relative"}}>
              {/* //// search panel //// */}
              <TabPanel
                value={mapGridCardActiveTap}
                index={0}
                className={classes.tapsPanelsPadding}
                style={{position:"absolute",width:"96vw"}}
              >
                <MapGridCardSearch
                  ativateSearchPanel={() => {
                    if (mapGridCardActiveTap !== 0) handleMainTapChange(null, 0);
                    if (mapGridCardActivated === "min") {
                      dispatch(
                        setMapGridCardState({ mapGridCardActivated: true })
                      );
                    }
                  }}
                  searchOption={getTargetFromSearchTaps()}
                />
                <div style={{ position: "relative" }}>
                  <TabPanels
                    value={searchTapValue}
                    panels={[
                      <M1nTable
                        dense
                        parent="search"
                        privateColumns={wellsColumnHeaders}
                        targetLabel={getTargetFromSearchTaps()}
                        header={<SearchTabPanels />}
                        showTags
                        showComments
                        showTracks
                      />,
                      <M1nTable
                        dense
                        parent="search"
                        privateColumns={ownersColumnHeaders}
                        targetLabel={getTargetFromSearchTaps()}
                        header={<SearchTabPanels />}
                        showTags
                        showComments
                        showTracks
                      />,
                    <M1nTable
                      dense
                      style 
                      parent="search"
                      privateColumns={operatorsColumnHeaders}
                      targetLabel={getTargetFromSearchTaps()}
                      header={<SearchTabPanels />}
                    />,
                    <M1nTable
                      dense
                      parent="search"
                      privateColumns={leasesColumnHeaders}
                      targetLabel={getTargetFromSearchTaps()}
                      header={<SearchTabPanels />}
                    />,
                  //   <M1nTable
                  //     dense
                  //     parent="search"
                  //     privateColumns={[parcelColumnHeaders]}
                  //     targetLabel={getTargetFromSearchTaps()}
                  //     header={<SearchTabPanels />}
                  //     // showTags
                  //     // showComments
                  //     // showTracks
                  //   />,
                  //   <M1nTable
                  //     dense
                  //     parent="search"
                  //     privateColumns={[]}
                  //     targetLabel={getTargetFromSearchTaps()}
                  //     header={<SearchTabPanels />}
                  //   />,


                      <M1nTable
                        dense
                        parent="search"
                        privateColumns={[ContactsHeadCells]}
                        targetLabel={getTargetFromSearchTaps()}
                        header={<SearchTabPanels />}
                      />,

                      <M1nTable
                        dense
                        parent="search"
                        privateColumns={locationsColumnHeaders}
                        targetLabel={getTargetFromSearchTaps()}
                        header={<SearchTabPanels />}
                      />,
                    ]}
                  />
                </div>
              </TabPanel>

              {/* //// tracked panel //// */}
              <TabPanel
                value={mapGridCardActiveTap}
                index={1}
                className={classes.tapsPanelsPadding}
                // 
                style ={{position:"absolute",width:"96vw"}}
                // 
              >
                <div style={{ position: "relative" }}>
                  <TabPanels
                    value={trackedTapValue}
                    panels={[
                      <M1nTable
                        dense
                        parent="trackWells"
                        header={
                          <TabLabels
                            labels={[
                              `Wells (${stateApp.trackedwells
                                ? stateApp.trackedwells.length
                                : 0
                              })`,
                            `Tax Owners (${
                              stateApp.owners ? stateApp.owners.length : 0

                              })`,
                            ]}
                            value={trackedTapValue}
                            setValue={setTrackedTapValue}
                          />
                        }
                      />,
                      <M1nTable
                        dense
                        parent="trackOwners"
                        header={
                          <TabLabels
                            labels={[
                              `Wells (${stateApp.trackedwells
                                ? stateApp.trackedwells.length
                                : 0
                              })`,
                            `Tax Owners (${
                              stateApp.owners ? stateApp.owners.length : 0

                              })`,
                            ]}
                            value={trackedTapValue}
                            setValue={setTrackedTapValue}
                          />
                        }
                      />,
                    ]}
                  />
                </div>
              </TabPanel>

              {/* //// viewport panel //// */}
              <TabPanel
                value={mapGridCardActiveTap}
                index={2}
                className={classes.tapsPanelsPadding}
                style ={{position:"absolute",width:"96vw"}}
              >
                <div style={{ position: "relative" }}>
                  {/* <TabLabels
                labels={["Wells", "Interests", "Parcels", "AOI"]}
                value={viewportTapValue}
                setValue={setViewportTapValue}
              /> */}
                  <TabPanels
                    value={viewportTapValue}
                    panels={[
                      <div className={classes.viewportWells}>
                        <M1nTable
                          id="viewportWellsTable"
                          dense
                          parent="mapViewportWells"
                          header={"Wells"}
                        />

                        <h6 id="minimumZoomRequired" style={{textAlign:"left", marginLeft:"5rem"}}>
                          Please zoom in to leverage this feature (min zoom level
                        = {stateApp.minZoomToQueryViewport})
                      </h6>
                      </div>,
                    ]}
                  />
                </div>
              </TabPanel>

            </div>
          )}
      </Card>
    );
  };

  const blackOut = () => (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: "1299",
      }}
      onClick={() => {
        dispatch(setMapGridCardState({ mapGridCardActivated: true }));
      }}
    />
  );

  return (
    <div className={classes.card}>
      {mapGridCardActivated === "min" ? (
        CardReturn()
      ) : (

          CardReturn()

        )}
      {mapGridCardActivated === "exp" && blackOut()}
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  return Object.is(
    prevProps.mapGridCardActivated,
    nextProps.mapGridCardActivated
  );
}

export default React.memo(MapGridCard, areEqual, TabLabels, TabPanels);
