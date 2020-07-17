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
import Typography from "@material-ui/core/Typography";
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
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
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
    width: ({ expanded }) => (expanded ? "96vw" : "55vw"),
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
    "& .MuiIconButton-root:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
  },
  tapsPanels: {
    "& .MuiBox-root": { padding: "0" },
    "& .MuiTableHead-root": {
      "& th": { backgroundColor: "#F2F2F2" },
    },
    "& td": {
      padding: "0 !important", //////
    },
  },
  tapsPanelsPadding: {
    "& .MuiBox-root": { padding: "0" },
  },
  mainPanelsDiv: {
    maxHeight: "calc(100% - 114px)",
    overflow: "auto",
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
      <TabPanel value={value} index={i} className={classes.tapsPanels}>
        {panel}
      </TabPanel>
    ))
  );
};

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
  };

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
                label={`Search Result (${stateApp.searchResultData.length})`}
                {...a11yProps(0)}
              />
              <Tab
                label={`Viewport (${stateApp.viewportData.length})`}
                {...a11yProps(1)}
              />
              <Tab
                label={`Tracked (${stateApp.trackedData.length})`}
                {...a11yProps(2)}
              />
            </Tabs>

            <IconButton
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

        <MapGridCardSearch />
        <div className={classes.mainPanelsDiv}>
          {/* //// search panel //// */}
          <TabPanel
            value={mainTapValue}
            index={0}
            className={classes.tapsPanelsPadding}
          >
            <div style={{ position: "relative" }}>
              <TabLabels
                labels={[
                  "Wells",
                  "Operators",
                  "Interests",
                  "Leases",
                  "Parcels",
                  "Locations",
                ]}
                value={searchTapValue}
                setValue={setSearchTapValue}
              />
              <TabPanels
                value={searchTapValue}
                panels={[
                  <p>panel1</p>,
                  <p>panel2</p>,
                  <p>panel3</p>,
                  <p>panel4</p>,
                  <p>panel5</p>,
                  <p>panel6</p>,
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
                  <p>panel1</p>,
                  <p>panel2</p>,
                  <p>panel3</p>,
                  <p>panel4</p>,
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

  return expanded ? (
    <>
      {CardReturn()}
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
    </>
  ) : (
    <Draggable>{CardReturn()}</Draggable>
  );
}
