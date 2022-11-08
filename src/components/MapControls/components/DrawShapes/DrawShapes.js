import React, { useContext, useEffect, useState, Fragment, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { get } from "lodash";
import union from "@turf/union";
// STATE MANAGEMENT
import { MapControlsContext } from "components/MapControls/MapControlsContext";
import { AppContext } from "AppContext";
// STYLES - Material UI Required Components
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
// COMPONENTS
import ShapeActionsPopup from "../popup/ShapeActionsPopup";
import DrawShapePopup from "../popup/DrawShapesPopup";
import ShapeAOIPopup from "../popup/ShapeAOIPopup";
// HELPERS
import { addCustomShapeProperties } from "./drawShapesHelpers";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import { UPSERTCUSTOMLAYER } from "graphQL/useMutationUpsertCustomLayer";
import { USERBYEMAIL } from "graphQL/useQueryUserByEmail";

import CloseIcon from "@material-ui/icons/Close";
import { useDispatch } from "react-redux";
import { setMapGridCardState } from "actions";
import { clearMapAndCloseShapeActionsPopup, setFeatureProperty, drawShapeLayerToggle } from "components/MapControls/commonHelper";

const useStyles = makeStyles((theme) => ({
  mapOverlay: {
    position: "fixed",
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
  selectedAction: {
    "& svg": {
      color: "rgb(102 146 202)",
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
  parcelPopover: {
    "& .MuiPopover-paper": {
      left: "49% !important",
      top: "auto !important",
      bottom: "98px !important",
    },
    "& .Mui-disabled": {
      paddingBottom: "10px",
      borderBottom: "1px solid lightgrey",
    },
    "& .MuiMenuItem-root": {
      "&:hover": {
        color: "rgba(23, 170, 221, 1)",
      },
    },
  },
  convertPopoverGrid: {
    paddingRight: theme.spacing(3),
    color: "black",
  },
  hoverGrid: {
    "&:hover": {
      color: 'gray'
    }
  },
  convertPopover: {
    "& .MuiPopover-paper": {
      left: "47% !important",
      top: "auto !important",
      bottom: "98px !important",
    },
    "& .Mui-disabled": {
      paddingBottom: "10px",
      borderBottom: "1px solid lightgrey",
    },
    "& .MuiMenuItem-root": {
      "&:hover": {
        color: "gray",
      },
    },
  },
  convertMenuColor: {
    color: 'black',
    "&:hover": {
      color: theme.palette.info.main
    }
  },
  downloadIcon: { width: "30px", height: "28px", },
  contactIcon: { width: "35px", height: "20px", },
  areaExceed: {
    fontSize: 16, marginTop: 10
  }
}));

export default function DrawShapes() {
  const dispatch = useDispatch();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customLayerInsertedData]);

  useEffect(() => {
    const { selectedUserDefinedLayer, showShapeActionsPopup, selectedParcel, selectedShape } = stateApp;
    if (selectedUserDefinedLayer) {
      setStateApp((state) => ({
        ...state,
        currentFeature: selectedUserDefinedLayer,
        // selectedParcel: selectedUserDefinedLayer.source === 'parcels_source' ? selectedUserDefinedLayer : null,
        selectedAoi: selectedUserDefinedLayer.source === "interests_source" ? selectedUserDefinedLayer : null,
      }));
      if (
        selectedUserDefinedLayer.source === "interests_source" &&
        showShapeActionsPopup === true &&
        selectedParcel === null &&
        selectedShape === null
      ) {
        toggleSpatialDataCard(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.selectedUserDefinedLayer]);

  useEffect(() => {
    if (stateApp && stateApp.user && stateApp.user.email) {
      getUserByEmail({
        variables: {
          userEmail: stateApp.user.email,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          // Don't run when shape is in rotate state
          if (feature?.properties?.isrotate) {
            return
          }
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
        setFeatureProperty(draw, feature.id, "shapeEdit", false);

        let currentFeature = feature;
        setStateApp((state) => {

          drawShapeLayerToggle(state, state.lastSelectedDrawMode === "draw_polygon" ? "visible" : "none");
          if (state.reDrawShape) {
            state.currentFeature.geometry = feature.geometry
          }
          else if (state.currentFeature && !state.reDrawShape) {
            const newFeature = union(feature, state.currentFeature);
            state.currentFeature.geometry = newFeature.geometry
          }
          currentFeature = state?.currentFeature ? state.currentFeature : feature;
          return { ...state, editDraw: false, showShapeActionsPopup: true, currentFeature, reDrawShape: false }
        });
        setTimeout(() => {

          setStateApp((state) => {
            draw.deleteAll();
            draw.add(currentFeature)
            addCustomShapeProperties(currentFeature, draw);
            setFeatureProperty(draw, currentFeature.id, "shapeEdit", false);
            draw.changeMode("simple_select");
            // isDrawing: false
            return { ...state, currentFeature }

          });
        }, 10);
      });

      map.on("draw.selectionchange", ({ features }) => {
        const [feature] = features;
        // Don't run when shape is in rotate state
        if (feature?.properties?.isrotate) {
          return
        }
        if (feature && !feature.id.includes("edit_polygon")) {
          setStateApp((stateApp) => {
            let currentFeature = feature;
            // if (stateApp.currentFeature) {
            //   currentFeature = union(feature, stateApp.currentFeature);
            //   currentFeature.id = stateApp.currentFeature.id
            //   currentFeature.properties.id = stateApp.currentFeature.id;
            // }
            return {
              ...stateApp,
              // popupOpen: false,
              currentFeature,
              featureOrMapShape: currentFeature,
            };
          });
        }
        // else {
        //   setStateApp((state) => {
        //     return {
        //       ...state,
        //       editDraw: false,
        //     };
        //   });
        // }
        setStateApp((stateApp) => {
          // if (!stateApp.shapeEdit) {
          //   stateApp.draw.changeMode("static");
          // } else if (stateApp.draw.get(stateApp.currentFeature?.id) || stateApp.draw.get(stateApp.featureOrMapShape?.id)) {
          //   stateApp.draw.changeMode("direct_select", {
          //     featureId: stateApp?.currentFeature?.id || stateApp?.featureOrMapShape?.id,
          //   });
          // }
          const { features } = stateApp.draw.getAll();
          drawShapeLayerToggle(stateApp, stateApp.shapeEdit || !features ||
            features.length === 0 || stateApp.lastSelectedDrawMode === "draw_polygon" ? "visible" : "none");
          return stateApp;
        });
      });

      eventsConfiguredRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.map, stateApp.currentFeature]);

  // useEffect(() => {
  //   setStateApp((state) => ({ ...state, editDraw: !!stateApp.currentFeature }));
  // }, [setStateApp, stateApp.currentFeature]);

  const actionClose = (additionalProps = {}) => {
    clearMapAndCloseShapeActionsPopup(stateApp, setStateApp);

    // Removing layer of AOI Label
    if (stateApp.map.getLayer("aoi_label_layer")) {
      stateApp.map.removeLayer("aoi_label_layer");
    }
    setStateApp((state) => ({
      ...state,
      gridPolygonString: "",
      selectedAoi: null,
      shapeEditMode: state.shapeEditMode === 'redraw' ? "" : state.shapeEditMode,
      shapeGridWellsCount: 0,
      shapeGridOwnersCount: 0,
      changeDrawShapeType: false,
      reDrawShape: false,
      ...additionalProps
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

  const renderAddShapePopup = (onlyAddShape) => (
    <Fragment>
      {showSpatialDataCard &&
        stateApp.currentFeature?.properties?.sdType === "interest" && ( // for edit/create AOI
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
              onlyAddShape={onlyAddShape}
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
  )

  return (
    <Fragment>
      {((stateApp.showDrawShapesPopup && !stateApp.currentFeature) || (stateApp.changeDrawShapeType) || stateApp.reDrawShape) && (
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
        !stateApp.changeDrawShapeType &&
        !stateApp.reDrawShape &&
        !stateApp.currentFeature.id?.includes("draw_polygon") &&
        !stateApp.currentFeature.id?.includes("drag_circle") &&
        !stateApp.currentFeature.id?.includes("draw_rectangle") &&
        !stateApp.currentFeature.id?.includes("edit_polygon") ? (
          renderAddShapePopup()
      ) : null}
      {stateApp.showAddShapePopup ? (
          renderAddShapePopup(true)
      ) : null}
    </Fragment>
  );
}
