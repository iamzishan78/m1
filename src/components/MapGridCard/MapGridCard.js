import React, { Fragment, useState, useContext, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../AppContext";
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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { setMapGridCardState } from "../../actions";
import OwnersSummaryCard from "../OwnersSummaryCard/OwnersSummaryCard";

import ContactsHeadCells from "../Shared/constants/contacts-header-schema.js";
import WellsHeadCells from "../Shared/constants/well-header-schema.js";
import wellsColumnHeaders from "../Shared/constants/well-interests-header-grid-schema.js";
import parcelsColumnHeaders from "../Shared/constants/parcel-header-grid.js";
import {
  leasesColumnHeaders,
  locationsColumnHeaders,
  operatorsColumnHeaders,
  ownersColumnHeaders,
} from "./MapGridCardHeaders";
import DockMenu from "./DockMenu";
import ShapeGridWellsTable from "components/Table/Wells/ShapeGridWellsTable";
import ShapeGridTaxOwnersTable from "components/Table/TaxOwners/ShapeGridTaxOwnersTable";
import ViewportGridWellsTable from "components/Table/Wells/ViewportGridWellsTable";

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
      left: ({ mapGridCardActivated, expandGrid }) =>
        mapGridCardActivated === "exp" ? "2vw" : "2vw",
      top: ({ mapGridCardActivated }) =>
        mapGridCardActivated === "exp" ? "5vh" : "12vh",
      zIndex: "1300",
      position: "fixed",
    },
    dockMenu: ({ dockMenu }) => {
      let css = {}
      if (dockMenu === 'bottom' || dockMenu === 'top')
        css = { top: dockMenu === 'bottom' ? "50vh" : '6vh', width: "100vw", height: "50vh", left: "0vw" }
      else if (dockMenu === 'left' || dockMenu === 'right')
        css = { left: dockMenu === 'left' ? "0vw" : '50vw', width: "50vw", height: "94vh", top: "6vh" }
      else if (dockMenu === 'full')
        css = { left: "0vw", width: "100vw", height: "94vh", top: "6vh" }
      css = { ...css, zIndex: "1300", position: "fixed" }
      return css
    },
    tapsRoot: {
      // flexGrow: 1,
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
    selectBoundary: {
      background: 'white',
      width: '180px',
      height: '35px',
      marginTop: '6px',
      marginBottom: '6px',
      marginLeft: '10px',
      "& .MuiSelect-select.MuiSelect-select": {
        paddingLeft: '10px',
      }
    }
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

function MapGridCard(props) {
  // contexts
  const [stateApp] = useContext(AppContext);

  // function state
  const [searchTapValue, SearchTapValue] = useState(0);
  const [viewportTapValue, ViewportTapValue] = useState(0);
  const [selectedBoundary, SelectBoundary] = useState('Shape Filter');
  const [dockMenu, SetDockMenu] = useState('bottom');
  const [trackedTapValue, TrackedTapValue] = useState(0);

  // selectors
  const {
    mapGridCardActivated,
    mapGridCardActiveTap,
    searchResultData,
    trackedDataCount,
    selectedOwner,
  } = useSelector(({ MapGridCard }) => MapGridCard, shallowEqual);

  // queries
  const dispatch = useDispatch();

  // handlers

  const setSelectedBoundary = (state) => {
    if (selectedBoundary !== state) {
      SelectBoundary(state);
    }
  };

  const setSelectedDockMenu = (state) => {
    if (dockMenu !== state) {
      SetDockMenu(state);
    }
  };

  const setSearchTapValue = (state) => {
    if (searchTapValue !== state) {
      SearchTapValue(state);
    }
  };

  const setTrackedTapValue = (state) => {
    if (trackedTapValue !== state) {
      TrackedTapValue(state);
    }
  };
  const setViewportTapValue = (state) => {
    if (viewportTapValue !== state) {
      ViewportTapValue(state);
    }
  };

  // styles
  const classes = useStyles({
    dockMenu,
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

  const getTaps = useMemo(
    () => [
      {
        label: "well",
        privateColumns: wellsColumnHeaders,
        showTags: true,
        showComments: true,
        showTracks: true,
      },
      {
        label: "owner",
        privateColumns: ownersColumnHeaders,
        showTags: true,
        showComments: true,
        showTracks: true,
      },
      {
        label: "operator",
        privateColumns: operatorsColumnHeaders,
      },
      {
        label: "lease",
        privateColumns: leasesColumnHeaders,
      },
      {
        label: "contacts",
        privateColumns: ContactsHeadCells,
      },
      {
        label: "location",
        privateColumns: locationsColumnHeaders,
      },
    ],
    []
  );

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
        className={`${mapGridCardActivated === "exp" ? "noDrag" : ""} ${classes.dockMenu
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

              {
                stateApp.gridPolygonString && <Tab
                  className="cancelDraggableEffect"
                  label={`Boundary${stateApp.shapeGridWellsCount
                    ? " (" + Number((stateApp.shapeGridWellsCount || '') + (stateApp.shapeGridOwnersCount || '')) + ")"
                    : ""
                    }`}
                  {...a11yProps(1)}
                >
                </Tab>
              }

            </Tabs>
            {
              mapGridCardActiveTap === 2 && stateApp.gridPolygonString && <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                className={classes.selectBoundary}
                value={selectedBoundary}
                onChange={(e) => { setSelectedBoundary(e.target.value) }}
              >
                <MenuItem value={'Shape Filter'}>Shape Filter</MenuItem>
                <MenuItem value={'Viewport'}>Viewport</MenuItem>
              </Select>
            }
            <div style={{ flexGrow: 1 }}></div>

            <DockMenu setSelectedDockMenu={setSelectedDockMenu} />

            {/* <IconButton
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
            </IconButton> */}
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
          <div
            className={`cancelDraggableEffect ${classes.mainPanelsDiv}`}
            style={{ position: "relative" }}
          >
            {/* //// search panel //// */}
            <TabPanel
              value={mapGridCardActiveTap}
              index={0}
              className={classes.tapsPanelsPadding}
              style={{ position: "absolute", width: "100vw" }}
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
                  panels={getTaps.map((tab, index) => (
                    <Fragment key={index}>
                      <M1nTable
                        dense
                        parent="search"
                        privateColumns={tab.privateColumns}
                        targetLabel={tab.label}
                        header={<SearchTabPanels />}
                        showTags={tab.showTags}
                        showComments={tab.showComments}
                        showTracks={tab.showTracks}
                      />
                    </Fragment>
                  ))}
                />
              </div>
            </TabPanel>

            {/* //// tracked panel //// */}
            <TabPanel
              value={mapGridCardActiveTap}
              index={1}
              className={classes.tapsPanelsPadding}
              //
              style={{ position: "absolute", width: "100vw" }}
            //
            >
              <div style={{ position: "relative" }}>
                <TabPanels
                  value={trackedTapValue}
                  panels={[
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
              style={{ position: "absolute", width: "100vw" }}
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
                            `Tax Owners (${stateApp.owners ? stateApp.owners.length : 0
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
                            `Tax Owners (${stateApp.owners ? stateApp.owners.length : 0
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
              style={{ position: "absolute", width: "100vw" }}
            >
              <div style={{ position: "relative" }}>
                <TabPanels
                  value={viewportTapValue}
                  panels={selectedBoundary === 'Shape Filter' ? [

                    <ShapeGridWellsTable
                      parent="wells"
                      header={<TabLabels
                        labels={[
                          `Wells (${stateApp.shapeGridWellsCount || 0})`,
                          `Tax Owners (${stateApp.shapeGridOwnersCount || 0})`,
                        ]}
                        value={viewportTapValue}
                        setValue={setViewportTapValue}
                      />}
                      targetLabel="well"
                      showTracks
                    />
                    ,
                    <ShapeGridTaxOwnersTable
                      parent="gridOwners"
                      header={<TabLabels
                        labels={[
                          `Wells (${stateApp.shapeGridWellsCount || 0})`,
                          `Tax Owners (${stateApp.shapeGridOwnersCount || 0})`,
                        ]}
                        value={viewportTapValue}
                        setValue={setViewportTapValue}
                      />}
                      targetLabel="owner"
                      showTracks
                    />
                  ] : [
                    <div className={classes.viewportWells}>
                      <ViewportGridWellsTable
                        parent="wells"
                        header={"Wells"}
                        targetLabel="well"
                        showTracks
                      />
                      {/* 
                      <M1nTable
                        id="viewportWellsTable"
                        dense
                        parent="mapViewportWells"
                        header={"Wells"}
                      /> */}
                      <h6
                        id="minimumZoomRequired"
                        style={{ textAlign: "left", marginLeft: "5rem" }}
                      >
                        Please zoom in to leverage this feature (min zoom level
                        = {stateApp.minZoomToQueryViewport})
                      </h6>
                    </div>
                  ]
                  }
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
      {mapGridCardActivated === "min" ? CardReturn() : CardReturn()}
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
