import React, { useContext, useEffect, useState, Fragment, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { get } from "lodash";
// STATE MANAGEMENT
import { MapControlsContext } from "components/MapControls/MapControlsContext";
import { AppContext } from "AppContext";
// STYLES - Material UI Required Components
import { AppStyles, StyledMenu, StyledMenuItem } from "../muiThemes";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ListItemText from "@material-ui/core/ListItemText";
// STYLES - Font Awesome Icons Required for Menu Items
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faGripLines, faDrawPolygon } from "@fortawesome/free-solid-svg-icons";
//import { faCircle, faSquare } from "@fortawesome/free-regular-svg-icons";
//import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
// COMPONENTS
import SpatialDataCard from "../spatialDataCard";
import ShapeActionsPopup from "../popup/ShapeActionsPopup";
import DrawShapePopup from "../popup/DrawShapesPopup";
import ShapeAOIPopup from "../popup/ShapeAOIPopup";
// HELPERS
import { area, convertArea } from "@turf/turf";
import { spatialDataAttributes } from "./constants";
import { addCustomShapeProperties, createShapeLabelLayer } from "./drawShapesHelpers";
import mapboxgl, { Marker } from "mapbox-gl";
import { makeStyles, Icon } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import polylabel from "polylabel";
import { useHistory } from "react-router-dom";

import { UPSERTCUSTOMLAYER } from "../../../../graphQL/useMutationUpsertCustomLayer";
import { CUSTOMLAYERSQUERY } from "../../../../graphQL/useQueryCustomLayers";
import { USERBYEMAIL } from "../../../../graphQL/useQueryUserByEmail";

//import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
//import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
//import { mdiShapePolygonPlus } from '@mdi/js';
import CloseIcon from "@material-ui/icons/Close";
import { default as DrawPoly } from "../../../Shared/svgIcons/polygon";
import { default as Rect } from "../../../Shared/svgIcons/rectangle";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import { NavigationContext } from "../../../Navigation/NavigationContext";
import { useDispatch } from "react-redux";
import { setMapGridCardState } from "actions";
import { clearMapAndCloseShapeActionsPopup, setFeatureProperty, drawShapeLayerToggle } from "components/MapControls/commonHelper";

// const localStyles = makeStyles((theme) => ({
//   label: {
//     width: "150px",
//     height: "15px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "white",
//     fontSize: "1rem",
//   },
// }));

const useStyles = makeStyles((theme) => ({
  mapOverlay: {
    position: "absolute",
    minWidth: "320px",
    bottom: "20px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(1, 17, 51, 1.0)",
    color: "#fff",
    borderRadius: "25px",
  },
  mapOverlayInner: {
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    borderRadius: "3px",
    padding: "10px 20px",
  },
  popUp: {
    minWidth: "320px",
    padding: "10px 20px",
    borderRadius: "15px",
    backgroundColor: "#ffffff",
  },
  content: {
    flexDirection: "row",
    display: "flex",
    placeContent: "center space-between",
    alignItems: "center",
  },
  label: {
    margin: "0 10px",
    fontWeight: "bold",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    marginLeft: "20px",
    "& button": {
      marginLeft: "5px",
      marginRight: "5px",
    },
    "& svg": {
      color: "#fff",
      "&:hover": {
        color: "rgb(102 146 202)",
      },
      "&.selected": {
        color: "rgb(102 146 202)",
      },
    },
  },
  disableAction: {
    "& svg": {
      color: "#717171",
    },
  },
  whiteText: {
    color: "#fff",
    "&:hover": {
      color: "rgb(102 146 202)",
    },
  },
  gray: {
    color: "#777",
    "&:hover": {
      color: "#777",
    },
    "& svg": {
      color: "#777",
      "&:hover": {
        color: "#777",
      },
      "&.selected": {
        color: "#777",
      },
    },
    "& svg.close": {
      color: "#fff",
      "&:hover": {
        color: "rgb(102 146 202)",
      },
    },
  },
  clearAction: {
    color: "rgb(102 146 202)",
  },
  footer: {
    margin: "5px 0",
  },
  divider: {
    borderRight: "1px solid",
    backgroundColor: "white",
    height: "20px",
    opacity: 0.8,
    margin: "5px",
  },
  multiSelectCheck: {
    display: "flex",
    alignItems: "center",
    "& button": {
      marginLeft: "5px",
      marginRight: "5px",
    },
    "& svg": {
      color: "green",
    },
  },
  buttonContainer: {
    display: "flex",
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
  },
  button: {
    width: "40%",
    justifyContent: "space-evenly",
    backgroundColor: "light gray",
    color: "dark gray",
  },
  modalContainer: {
    background: "white",
    width: "500px",
    textAlign: "center",
    padding: "15px",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

export default function DrawShapes() {
  const dispatch = useDispatch();
  let history = useHistory();
  const classes = useStyles();
  const [showSpatialDataCard, toggleSpatialDataCard] = useState(false);
  const [stateMapControls, setStateMapControls] = useContext(MapControlsContext);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [upsertCustomLayer, { data: customLayerInsertedData }] = useMutation(UPSERTCUSTOMLAYER);

  const eventsConfiguredRef = useRef(false);

  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);

  const [user, setUser] = useState({ _id: "" });

  useEffect(() => {
    const customLayer = get(customLayerInsertedData, "upsertCustomLayer.customLayer");
    if (customLayer) {
      setStateApp((state) => ({
        ...state,
        selectedAoi: customLayer,
      }));
    }
  }, [customLayerInsertedData]);

  useEffect(() => {
    const { selectedUserDefinedLayer, showShapeActionsPopup, selectedParcel } = stateApp;
    if (selectedUserDefinedLayer) {
      setStateApp((state) => ({
        ...state,
        currentFeature: selectedUserDefinedLayer,
        selectedAoi: selectedUserDefinedLayer,
      }));
      if (
        selectedUserDefinedLayer.source === "interests_source" &&
        showShapeActionsPopup === true &&
        selectedParcel === null
      ) {
        toggleSpatialDataCard(true);
      }
    }
  }, [stateApp.selectedUserDefinedLayer]);

  useEffect(() => {
    if (stateApp && stateApp.user && stateApp.user.email) {
      getUserByEmail({
        variables: {
          userEmail: stateApp.user.email,
        },
      });
    }
  }, [stateApp.user.email]);

  useEffect(() => {
    if (dataUser && dataUser.userByEmail) {
      setUser(dataUser.userByEmail);
    }
  }, [dataUser]);


  useEffect(() => {
    if (!eventsConfiguredRef.current) {
      const { map } = stateApp;

      map.on("draw.update", ({ features, action }) => {
        if (action === "move" || action === "change_coordinates") {
          const [feature] = features;
          const { draw } = stateApp;
          if (feature) {
            addCustomShapeProperties(feature, draw);
          }
          setStateApp((stateApp) => {
            return {
              ...stateApp,
              popupOpen: false,
              currentFeature: feature,
              featureOrMapShape: feature,
              editDraw: true,
            };
          });
        }
      });

      map.on("draw.create", ({ features }) => {
        const [feature] = features;
        const { draw } = stateApp;
        if (feature) {
          addCustomShapeProperties(feature, draw);
        }
        setFeatureProperty(draw, feature.id, 'shapeEdit', false)
        drawShapeLayerToggle(stateApp, "none")
        setStateApp((state) => ({ ...state, editDraw: false, showShapeActionsPopup: true }));
      });

      map.on("draw.selectionchange", ({ features }) => {
        const [feature] = features;
        if (feature && !feature.id.includes("edit_polygon")) {
          setStateApp((stateApp) => {
            return {
              ...stateApp,
              popupOpen: false,
              currentFeature: feature,
              featureOrMapShape: feature,
            };
          });
        } else {

          setStateApp((state) => {
            return {
              ...state,
              // currentFeature: undefined, // for allowing toolbar and filters if we off click shape
              editDraw: false,
            }
          });
        }
        setStateApp((stateApp) => {
          drawShapeLayerToggle(stateApp, stateApp.shapeEdit ? "visible" : "none")
          return stateApp
        })
      });

      eventsConfiguredRef.current = true;
    }
  }, [stateApp.map, stateApp.currentFeature]);

  // useEffect(() => {
  //   setStateApp((state) => ({ ...state, editDraw: !!stateApp.currentFeature }));
  // }, [setStateApp, stateApp.currentFeature]);

  const actionClose = () => {
    clearMapAndCloseShapeActionsPopup(stateApp, setStateApp)

    // Removing layer of AOI Label
    if (stateApp.map.getLayer("aoi_label_layer")) {
      stateApp.map.removeLayer("aoi_label_layer");
    }
    setStateApp((state) => ({
      ...state,
      gridPolygonString: '',
      selectedAoi: null,
      shapeGridWellsCount: 0,
      shapeGridOwnersCount: 0
    }));
    dispatch(
      setMapGridCardState({
        mapGridCardActiveTap: 0,
      })
    );
    toggleSpatialDataCard(false);
  };

  const handleClose = () => {
    setStateMapControls({ ...stateMapControls, anchorEl: null });
  };

  return (
    <Fragment>
      {stateApp.showDrawShapesPopup && !stateApp.currentFeature && (
        <ClickAwayListener onClickAway={handleClose}>
          <div className={classes.mapOverlay}>
            <div class={classes.mapOverlayInner}>
              <div className={classes.content}>
                <DrawShapePopup handleClose={handleClose} classes={classes}>
                  <span className={classes.clearAction}>
                    <Tooltip title="Close">
                      <IconButton size="small" onClick={actionClose} aria-label="Close" className={classes.clearAction}>
                        <CloseIcon className="close" fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </span>
                </DrawShapePopup>
              </div>
            </div>
          </div>
        </ClickAwayListener>
      )}
      {(stateApp.editDraw || stateApp.showShapeActionsPopup) &&
        stateApp.currentFeature !== undefined &&
        !stateApp.currentFeature.id.includes("draw_polygon") &&
        !stateApp.currentFeature.id.includes("drag_circle") &&
        !stateApp.currentFeature.id.includes("draw_rectangle") &&
        !stateApp.currentFeature.id.includes("edit_polygon") ? (
        <Fragment>
          {showSpatialDataCard && ( // for edit/create AOI
            <ShapeAOIPopup upsertCustomLayer={upsertCustomLayer} user={user} toggleSpatialDataCard={toggleSpatialDataCard} />
          )}
          <div className={classes.mapOverlay}>
            <div class={classes.mapOverlayInner}>
              <div className={classes.content}>
                <ShapeActionsPopup
                  classes={classes}
                  selectedFeature={stateApp.currentFeature}
                  toggleSpatialDataCard={toggleSpatialDataCard}
                  showSpatialDataCard={showSpatialDataCard}
                  popupCloseAction={actionClose}
                >
                  <span className={classes.clearAction}>
                    <Tooltip title="Close">
                      <IconButton size="small" onClick={actionClose} aria-label="Close" className={classes.clearAction}>
                        <CloseIcon className="close" fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </span>
                </ShapeActionsPopup>
              </div>
            </div>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  );
}
