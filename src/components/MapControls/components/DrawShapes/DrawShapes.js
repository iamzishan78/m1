import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import loadCSS from "fg-loadcss";
// STATE MANAGEMENT
import { MapControlsContext } from "../../MapControlsContext";
import { MapContext } from "../../../Map/MapContext";
import { AppContext } from "../../../../AppContext";
// STYLES - Material UI Required Components
import { useStyles, StyledMenu, StyledMenuItem } from "../muiThemes";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ListItemText from "@material-ui/core/ListItemText";
// STYLES - Font Awesome Icons Required for Menu Items
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faGripLines, faDrawPolygon } from "@fortawesome/free-solid-svg-icons";
//import { faCircle, faSquare } from "@fortawesome/free-regular-svg-icons";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
// COMPONENTS
import SpatialDataCard from "../spatialDataCard";
// HELPERS
import { area, convertArea } from "@turf/turf";
import { spatialDataAttributes } from "./constants";
import {
  addCustomShapeProperties,
  createShapeLabelLayer
} from "./drawShapesHelpers";
import mapboxgl, { Marker } from "mapbox-gl";
import { makeStyles, Icon } from "@material-ui/core";
import polylabel from "polylabel";
import { useHistory } from "react-router-dom";

// import { availableShapes } from "./constants";
const DEBUG_GREEN = "background: green; color: white; border: 1px solid black";
const DEBUG_YELLOW = "background: yellow; color: red; border: 1px solid black";
const DEBUG_BLUE = "background: blue; color: white; border: 1px solid black";
const DEBUG_RED = "background: red; color: white; border: 1px solid black";

export const availableShapes = [
  {
    title: "Polygon",
    mode: "draw_polygon"
    // icon: "fa fa-draw-polygon"
  },
  {
    title: "Circle",
    mode: "drag_circle"
    //icon: "fa fa-circle"
  },
  {
    title: "Rectangle",
    mode: "draw_rectangle"
    //icon: "fa fa-square"
  },
  {
    title: "Line",
    mode: "draw_line_string"
    //icon: "fa fa-grip-lines"
  }
];

const localStyles = makeStyles(theme => ({
  label: {
    width: "150px",
    height: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "1rem"
  }
}));

export default function DrawShapes(props) {
  const classes = useStyles();
  let history = useHistory();
  const localClasses = localStyles();
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateMap, setStateMap] = useContext(MapContext);
  const [showSpatialDataCard, toggleSpatialDataCard] = useState(false);

  const DEBUGGER = (source, value) => {
    console.log(`%c[DrawShapes.js] ${source}`, DEBUG_GREEN, value);
  };

  const createShapeMarker = feature => {
    var el = document.createElement("div");
    el.setAttribute("id", feature.id);
    el.innerHTML = "Feature_" + feature.id.slice(-4);
    el.className = localClasses.label;
    return el;
  };

  // useEffect(() => {
  //   loadCSS(
  //     'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
  //     document.querySelector('#font-awesome-css'),
  //   );
  // }, []);

  useEffect(() => {
    const { map } = stateMap;
    map.on("draw.create", ({ features }) => {
      const [feature] = features;
      const { draw } = stateMap;
      if (feature) {
        addCustomShapeProperties(feature, draw);
      }
      setStateApp({ ...stateApp, editDraw: false });
    });

    map.on("draw.selectionchange", ({ features }) => {
      const [feature] = features;
      if (feature) {
        setStateMap({ ...stateMap, currentFeature: feature });
        setStateApp(stateApp => {
          return {
            ...stateApp,
            featureOrMapShape: feature
          };
        });
      } else {
        setStateMap({ ...stateMap, currentFeature: undefined });
      }
    });
  }, [stateMap.map, showSpatialDataCard]);

  useEffect(() => {
    const { currentFeature } = stateMap;
    if (currentFeature !== undefined) {
      toggleSpatialDataCard(true);
    } else {
      toggleSpatialDataCard(false);
    }
  }, [stateMap.currentFeature]);
  // var y = {
  //   id: "5d6c18fbc0b0663ba2040ed20498c86e",
  //   type: "Feature",
  //   properties: {
  //     sdType: "",
  //     projectName: "",
  //     sdNotes: "",
  //     shapeArea: "118.31 miles",
  //     shapeCenter: [null, null],
  //     shapeLabel: "",
  //     shapeLabelLayer: ""
  //   },
  //   geometry: {
  //     coordinates: [
  //       [-97.47383148437652, 34.386634347399664],
  //       [-96.2873080468762, 34.413829174481435],
  //       [-96.92451507812635, 33.90473837382824]
  //     ],
  //     type: "LineString"
  //   }
  // };

  const createShapeDrawOptions = () => {
    return availableShapes.map((shape, index) => {
      return (
        <StyledMenuItem
          key={index}
          onClick={evt => {
            stateMap.draw.changeMode(shape.mode);
            setStateApp({ ...stateApp, editDraw: true });
            handleClose();
          }}
        >
          <div style={{ color: "white", paddingRight: "15px" }}>
            <Icon className={shape.icon} color="secondary" />
          </div>
          <ListItemText primary={shape.title} id={index} />
        </StyledMenuItem>
      );
    });
  };

  const handleClose = () => {
    setStateMapControls({ ...stateMapControls, anchorEl: null });
  };

  const handleSaveSpatialDataToShape = (spatialData, dataType) => {
    // save data onto geoJSON properties fields

    spatialDataAttributes.forEach(attribute => {
      stateMap.draw.setFeatureProperty(
        stateMap.currentFeature.id,
        attribute,
        spatialData[attribute]
      );
    });
    toggleSpatialDataCard(false);

    //////cleaning the selected title opinion and redirecting to title opinion page//

    if (dataType === "title") {
      setStateApp(stateApp => {
        return {
          ...stateApp,
          selectedTitleOpinionId: null
        };
      });

      history.push("/titleopinion");
    }
  };

  const handleDeleteSpatialDataAndShape = () => {
    const { currentFeature } = stateMap;
    if (currentFeature) {
      const elem = document.getElementById(currentFeature.id);
      // elem.parentNode.removeChild(elem);
      console.log("elem", elem);
      stateMap.draw.delete(currentFeature.id);
      setStateMap({ ...stateMap, currentFeature: undefined });
    }
  };

  return (
    <React.Fragment>
      <ClickAwayListener onClickAway={handleClose}>
        <StyledMenu
          id="draw-shapes"
          keepMounted
          anchorEl={stateMapControls.anchorEl}
          open={Boolean(stateMapControls.anchorEl)}
          onClose={handleClose}
        >
          <StyledMenuItem
            disableRipple
            key="subheader"
            role={undefined}
            dense
            className={classes.subHeaderItem}
          >
            <ListItemText primary="Draw Shapes" />
          </StyledMenuItem>
          {createShapeDrawOptions()}
        </StyledMenu>
      </ClickAwayListener>
      {showSpatialDataCard && stateMap.currentFeature !== undefined ? (
        <SpatialDataCard
          closeSpatialDataCard={() => toggleSpatialDataCard(false)}
          saveSpatialData={handleSaveSpatialDataToShape}
          deleteSpatialDataAndShape={handleDeleteSpatialDataAndShape}
          selectedFeature={stateMap.currentFeature}
        />
      ) : null}
    </React.Fragment>
  );
}
