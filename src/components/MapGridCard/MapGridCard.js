import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../AppContext";
import Card from "@material-ui/core/Card";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import ExpandIcon from "../Shared/svgIcons/ExpandIcon";
import ShrinkIcon from "../Shared/svgIcons/ShrinkIcon";
import IconButton from "@material-ui/core/IconButton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MapGridCardSearch from "./components/MapGridCardSearch";
import M1nTable from "../Shared/M1nTable/M1nTable";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setMapGridCardState } from "../../actions";
import OwnersSummaryCard from "../OwnersSummaryCard/OwnersSummaryCard";
import TabPanels, { TabPanel } from "components/Shared/TabPanels"
import TabButtons from "components/Shared/TabPanels/TabButtons"

import ContactsHeadCells from '../Shared/constants/contacts-header-schema.js'
import wellsColumnHeaders from '../Shared/constants/well-interests-header-grid-schema.js'

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
      width: ({ mapGridCardActivated }) =>
        mapGridCardActivated === "min"
         ? "57vw"

          : mapGridCardActivated === "exp"
            ? "96vw"
            : "57vw",
      height: ({ mapGridCardActivated }) =>
        mapGridCardActivated === "min"
         ? "60vh"

          : mapGridCardActivated === "exp"
            ? "91vh"
            : "60vh",
      left: ({ mapGridCardActivated,expandGrid }) =>
        mapGridCardActivated === "exp"  ? "2vw" : "2vw",
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
      "& div": {
        "&>.MuiPaper-root": {
          "&>:nth-child(3)": {
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

function tabPanelsPropsAreEqual(prevProps, nextProps) {
  return Object.is(prevProps.value, nextProps.value);
}

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

  // contexts 
  const [stateApp, setStateApp] = useContext(AppContext);

  // function state 
  const [searchTapValue, SearchTapValue] = useState(0);
  const [viewportTapValue, ViewportTapValue] = useState(0);
  const [trackedTapValue, TrackedTapValue] = useState(0);
  const [gridTapValue, GridTapValue] = useState(0);

  // selectors 
  const {
    mapGridCardActivated,
    mapGridCardActiveTap,
    searchResultData,
    viewportData,
    trackedDataCount,
    selectedOwner,
  } = useSelector(({ MapGridCard }) => MapGridCard, shallowEqual);

  // queries 
  const dispatch = useDispatch();

  // handlers 
  const setSearchTapValue = (state) => {
    if (searchTapValue != state) {
      SearchTapValue(state);
    }
  };
  const setViewportTapValue = (state) => {
    if (viewportTapValue != state) {
      ViewportTapValue(state);
    }
  };
  const setTrackedTapValue = (state) => {
    if (trackedTapValue != state) {
      TrackedTapValue(state);
    }
  };
  const setGridTapValue = (state) => {
    if (gridTapValue != state) {
      GridTapValue(state);
    }
  };

  // styles 
  const classes = useStyles({
    mapGridCardActivated,
    mapGridCardActiveTap,
    viewportWells: stateApp.viewportWells  
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
    <TabButtons
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
                        privateColumns={ContactsHeadCells}
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
                          <TabButtons
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
                          <TabButtons
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

export default React.memo(MapGridCard, areEqual);
