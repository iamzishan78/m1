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
import Button from "@material-ui/core/Button";

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

const useStyles = makeStyles((theme) => ({
  rootList: {
    width: ({ expanded }) => (expanded ? "96vw" : "60vw"),
    height: ({ expanded }) => (expanded ? "82vh" : "60vh"),
    position: "relative",
    left: "2vw",
    top: "5vh",
    zIndex: "200",
  },
  tapsRoot: {
    flexGrow: 1,
    "& .MuiTab-root": {
      textTransform: "none",
    },
  },
  appBar: {
    cursor: "move",
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
    maxHeight: "calc(100% - 114px)",
    overflow: "auto",
    height: "calc(100% - 114px)",
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
}));

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

export default function MapGridCard(props) {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [mainTapValue, setMainTapValue] = useState(0);
  const [searchTapValue, setSearchTapValue] = useState(0);
  const [viewportTapValue, setViewportTapValue] = useState(0);
  const [trackedTapValue, setTrackedTapValue] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles({ expanded });

  const handleMainTapChange = (event, newValue) => {
    setMainTapValue(newValue);
    if (newValue === 2)
      setStateApp((state) => ({
        ...state,
        mapGridCardActivated: "track",
      }));
  };

  useEffect(() => {
    if (
      stateApp.mapGridCardActivated &&
      stateApp.mapGridCardActivated === "track" &&
      mainTapValue !== 2
    ) {
      setMainTapValue(2);
    }
  }, [stateApp.mapGridCardActivated]);

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
        if (searchTapValue !== n)
          setStateApp((state) => ({
            ...state,
            searchResultData: [],
            searchloading: true,
          }));
      }}
    />
  );

  const CardReturn = () => {
    return (
      <Card className={classes.rootList}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar style={{ paddingRight: "0" }}>
            <Tabs
              className={classes.tapsRoot}
              value={mainTapValue}
              onChange={handleMainTapChange}
              aria-label="simple tabs example"
            >
              <Tab
                className="cancelDraggableEffect"
                label={`Search Result (${stateApp.searchResultData.length})`}
                {...a11yProps(0)}
              />
              <Tab
                className="cancelDraggableEffect"
                label={`Viewport (${stateApp.viewportData.length})`}
                {...a11yProps(1)}
              />
              <Tab
                className="cancelDraggableEffect"
                label={`Tracked (${stateApp.trackedDataCount})`}
                {...a11yProps(2)}
              />
            </Tabs>

            <IconButton
              className="cancelDraggableEffect"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
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
                setStateApp((state) => ({
                  ...state,
                  mapGridCardActivated: false,
                }));
              }}
            >
              <CloseIcon htmlColor="#fff" />
            </IconButton>
          </Toolbar>
        </AppBar>

        <MapGridCardSearch
          ativateSearchPanel={() => {
            if (mainTapValue !== 0) setMainTapValue(0);
          }}
          searchOption={getTargetFromSearchTaps()}
        />
        <div className={`cancelDraggableEffect ${classes.mainPanelsDiv}`}>
          {/* //// search panel //// */}
          <TabPanel
            value={mainTapValue}
            index={0}
            className={classes.tapsPanelsPadding}
          >
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
          <TabPanel
            value={mainTapValue}
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
          </TabPanel>

          {/* //// tracked panel //// */}
          <TabPanel
            value={mainTapValue}
            index={2}
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
        zIndex: "199",
      }}
      onClick={() => {
        setExpanded(false);
      }}
    />
  );

  return expanded ? (
    <>
      {CardReturn()}
      {blackOut()}
    </>
  ) : (
    <Draggable cancel={'[class*="cancelDraggableEffect"]'}>
      {CardReturn()}
    </Draggable>
  );
}
