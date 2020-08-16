import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
  console.log(`ue mapgridcard makestyles ${theme}`);

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
      opacity: ({ mapGridCardActivated }) =>
        mapGridCardActivated === "min" ? "0.6" : "1",
      transition:
        "opacity 0.2s ease-out, transform 0.05s ease-out, width 0.3s ease-out, height 0.3s ease-out",
      WebkitTransition:
        "opacity 0.2s ease-out, transform 0.05s ease-out, width 0.3s ease-out, height 0.3s ease-out",
      width: ({ mapGridCardActivated }) =>
        mapGridCardActivated === "min"
          ? "600px"
          : mapGridCardActivated === "exp"
          ? "96vw"
          : "57vw",
      height: ({ mapGridCardActivated }) =>
        mapGridCardActivated === "min"
          ? "114px"
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
      cursor: ({ mapGridCardActivated }) =>
        mapGridCardActivated === "exp" || mapGridCardActivated === "min"
          ? "context-menu"
          : "move",
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
      maxHeight: "calc(100% - 64px)",
      overflow: "auto",
      height: "calc(100% - 64px)",
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
  };
});

const TabLabels = ({ labels, value, setValue }) => {
  console.log(`ue mapgridcard tablabels ${(labels, value, setValue)}`);

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
  console.log(`${prevProps.value} ... ${nextProps.value}`)
  return Object.is(prevProps.value, nextProps.value);
}

const TabPanels = React.memo(({ panels, value }) => {
  console.log(`ue mapgridcard tabpanels ${(panels, value)}`);

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
}, tabPanelsPropsAreEqual);

const wellsColumnHeaders = [
  {
    name: "WellName",
    label: "Name",
  },
  {
    name: "ApiNumber",
    label: "Api",
  },
  {
    name: "Latitude",
    label: "Latitude",
  },
  {
    name: "Longitude",
    label: "Longitude",
  },
];
const ownersColumnHeaders = [
  {
    name: "OwnerName",
    label: "Name",
  },
  {
    name: "FullAddress",
    label: "Address",
  },
];
const operatorsColumnHeaders = [
  {
    name: "Operator",
    label: "Name",
  },
];
const leasesColumnHeaders = [
  {
    name: "Lease",
    label: "Lease",
  },
  {
    name: "LeaseId",
    label: "Lease Id",
  },
];
const locationsColumnHeaders = [
  {
    name: "Primary",
    label: " ",
  },
  {
    name: "Secondary",
    label: " ",
  },
];

function MapGridCard(props) {
  const dispatch = useDispatch();
  const {
    mapGridCardActivated,
    mapGridCardActiveTap,
    searchResultData,
    viewportData,
    trackedDataCount,
  } = useSelector(({ MapGridCard }) => MapGridCard,
    shallowEqual
  );
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

  const classes = useStyles({
    mapGridCardActivated,
    mapGridCardActiveTap,
  });

  const handleMainTapChange = (event, newValue) => {
    console.log(`ue mapgridcard handlemaintapchange ${newValue}`);

    dispatch(
      setMapGridCardState({
        mapGridCardActiveTap: newValue,
      })
    );
  };

  // useEffect(() => {
  //   if (
  //     stateApp.mapGridCardActiveTap &&
  //     stateApp.mapGridCardActiveTap !== mainTapValue
  //   ) {
  //     setMainTapValue(stateApp.mapGridCardActiveTap);
  //   }
  // }, [stateApp.mapGridCardActiveTap]);

  const getTargetFromSearchTaps = () => {
    switch (searchTapValue) {
      case 6:
        return "location";
      case 5:
        return "parcel";
      case 4:
        return "interest";
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
        "Owners",
        "Operators",
        "Leases",
        "Interests",
        "Parcels",
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
        className={`${mapGridCardActivated === "exp" ? "noDrag" : ""} ${
          classes.rootList
        }`}
      >
        <AppBar
          position="static"
          className={`${
            mapGridCardActivated === "exp" ? "cancelDraggableEffect" : ""
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
              {/* <Tab
                className="cancelDraggableEffect"
                label={`Viewport (${viewportData.length})`}
                {...a11yProps(1)}
              /> */}
              <Tab
                className="cancelDraggableEffect"
                label={`Tracked (${trackedDataCount})`}
                {...a11yProps(1)}
              />
            </Tabs>

            <IconButton
              className="cancelDraggableEffect"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                dispatch(
                  setMapGridCardState({
                    mapGridCardActivated:
                      mapGridCardActivated === "exp" ? true : "exp",
                  })
                );
              }}
            >
              {mapGridCardActivated === "exp" ? (
                <ShrinkIcon viewBox="0 0 64 64" htmlColor="#fff" />
              ) : (
                <ExpandIcon viewBox="0 0 64 64" htmlColor="#fff" />
              )}
            </IconButton>
            <IconButton
              className="cancelDraggableEffect"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                dispatch(setMapGridCardState({ mapGridCardActivated: false }));
              }}
            >
              <CloseIcon htmlColor="#fff" />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* <MapGridCardSearch
          ativateSearchPanel={() => {
            if (mapGridCardActiveTap !== 0) handleMainTapChange(null, 0);
            if (mapGridCardActivated === "min")
              dispatch(setMapGridCardState({ mapGridCardActivated: true }));
          }}
          searchOption={getTargetFromSearchTaps()}
        /> */}
        <div className={`cancelDraggableEffect ${classes.mainPanelsDiv}`}>
          {/* //// search panel //// */}
          <TabPanel
            value={mapGridCardActiveTap}
            index={0}
            className={classes.tapsPanelsPadding}
          >
            <MapGridCardSearch
              ativateSearchPanel={() => {
                if (mapGridCardActiveTap !== 0) handleMainTapChange(null, 0);
                if (mapGridCardActivated === "min") {
                  dispatch(setMapGridCardState({ mapGridCardActivated: true }));
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
                  <M1nTable
                    dense
                    parent="search"
                    privateColumns={[]}
                    targetLabel={getTargetFromSearchTaps()}
                    header={<SearchTabPanels />}
                  />,
                  <M1nTable
                    dense
                    parent="search"
                    privateColumns={[]}
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

          {/* //// viewport panel //// */}
          {/* <TabPanel
            value={mapGridCardActiveTap}
            index={1}
            className={classes.tapsPanelsPadding}
          >
            <div style={{ position: "relative" }}>
              <TabLabels
                labels={["Wells", "Interests", "Parcels", "AOI"]}
                value={viewportTapValue}
                setValue={setViewportTapValue}
              />
              <TabPanels
                value={viewportTapValue}
                panels={[
                  <div>panel1</div>,
                  <div>panel2</div>,
                  <div>panel3</div>,
                  <div>panel4</div>,
                ]}
              />
            </div>
          </TabPanel> */}

          {/* //// tracked panel //// */}
          <TabPanel
            value={mapGridCardActiveTap}
            index={1}
            className={classes.tapsPanelsPadding}
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
                        labels={["Wells", "Owners"]}
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
                        labels={["Wells", "Owners"]}
                        value={trackedTapValue}
                        setValue={setTrackedTapValue}
                      />
                    }
                  />,
                ]}
              />
            </div>
          </TabPanel>
        </div>
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
        <Draggable cancel={'[class*="cancelDraggableEffect"]'}>
          {CardReturn()}
        </Draggable>
      )}
      {mapGridCardActivated === "exp" && blackOut()}
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  console.log(`${prevProps.mapGridCardActivated} ... ${nextProps.mapGridCardActivated}`)
  return Object.is(prevProps.mapGridCardActivated, nextProps.mapGridCardActivated);
}

export default React.memo(MapGridCard, areEqual);
