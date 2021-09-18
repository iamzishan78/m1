import React, { useState, useEffect, useMemo, useContext, Fragment } from "react";
import { useLazyQuery } from "@apollo/client";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import hat from "hat";
import union from "@turf/union";
import { AppContext } from "AppContext";
// import { UPSERTCUSTOMLAYER } from "graphQL/useMutationUpsertCustomLayer";
import { default as MouseClicked } from "../../../Shared/svgIcons/MouseClicked";
import { default as DrawPoly } from "../../../Shared/svgIcons/polygon";
import { default as Rect } from "../../../Shared/svgIcons/rectangle";
import { default as CheckCircle } from "../../../Shared/svgIcons/check-circle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import { USERBYEMAIL } from "graphQL/useQueryUserByEmail";
import { addCustomShapeProperties } from "../DrawShapes/drawShapesHelpers";

const DrawShapesPopup = (props) => {
  const { classes, children } = props;
  const [, setUser] = useState({ _id: "" });
  const [stateApp, setStateApp] = useContext(AppContext);
  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);

  const availableShapes = useMemo(
    () => [
      {
        title: "Multiple Select",
        mode: "simple_select",
        icon: <MouseClicked />,
        disable: stateApp.mapVars.zoom <= 12,
      },
      {
        title: "Polygon",
        mode: "draw_polygon",
        icon: <DrawPoly />,
        disable: stateApp.multiSelectLandGrids,
      },
      {
        title: "Circle",
        mode: "drag_circle",
        icon: <RadioButtonUncheckedIcon fontSize="small" />,
        disable: stateApp.multiSelectLandGrids,
      },
      {
        title: "Rectangle",
        mode: "draw_rectangle",
        icon: <Rect />,
        disable: stateApp.multiSelectLandGrids,
      },
    ],
    [stateApp.mapVars.zoom, stateApp.multiSelectLandGrids]
  );

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

  const onActionClick = (shape) => {
    if (shape.disable) return;
    if (shape.title === "Multiple Select") {
      if (stateApp.multiSelectLandGrids) {
        // removing all selected land grids
        handleCloseAbstractSelection();
      }
      // enabling/disabling multi select land grid
      setStateApp((state) => ({
        ...state,
        multiSelectLandGrids: !state.multiSelectLandGrids,
        editDraw: false,
      }));
    } else {
      setStateApp((state) => ({ ...state, editDraw: true, isDrawing: true }));
      props.handleClose();
    }
    stateApp.draw.changeMode(shape.mode);
  };

  const handleCloseAbstractSelection = () => {
    const { map } = stateApp;
    let popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();

    for (let i = 0; i < stateApp.selectedAbstracts.length; i++) {
      const id = stateApp.selectedAbstracts[i].properties.Id;
      map.setFeatureState({ source: "abstract_geo_source", id }, { click: false });
    }

    setStateApp((state) => ({
      ...state,
      selectedAbstracts: [],
    }));
  };

  const createMultiSelectedFeature = () => {
    let { draw, selectedAbstracts } = stateApp,
      newFeature,
      featureId = hat();
    selectedAbstracts.forEach((abstractFeature, index) => {
      if (index < selectedAbstracts.length - 1 && !newFeature) {
        newFeature = union(abstractFeature, selectedAbstracts[index + 1]);
      } else if (index < selectedAbstracts.length - 1 && newFeature) {
        newFeature = union(newFeature, selectedAbstracts[index + 1]);
      } else if (selectedAbstracts.length === 1) {
        newFeature = selectedAbstracts[index];
      }
    });
    newFeature.id = featureId;
    newFeature.properties.id = featureId;

    // adding new polygon into map instance
    draw.add(newFeature);

    setStateApp((state) => ({
      ...state,
      currentFeature: newFeature,
      multiSelectLandGrids: false,
      isAbstractedLayersPolygon: true,
      showShapeActionsPopup: true
    }));
    addCustomShapeProperties(newFeature, draw);
    stateApp.draw.changeMode("direct_select", {
      featureId: newFeature.id,
    });
  };

  const parcelLabel = stateApp.selectedAbstracts.length > 1 ? "tracts" : "tract";

  return (
    <Fragment>
      <span class={classes.label}>
        {stateApp.selectedAbstracts.length > 0 ? `${`${stateApp.selectedAbstracts.length} ${parcelLabel}`} selected` : "Tooltip"}
      </span>
      <span className={classes.actions}>
        {availableShapes.map((shape, index) => (
          <Fragment key={index}>
            <Tooltip title={shape.title} className={shape.disable ? classes.disableAction : ""}>
              <IconButton
                size="small"
                onClick={() => {
                  onActionClick(shape);
                }}
                aria-label={shape.title}
              >
                {shape.icon}
              </IconButton>
            </Tooltip>
          </Fragment>
        ))}
      </span>
      <span className={classes.multiSelectCheck}>
        {(stateApp.multiSelectLandGrids || stateApp.selectedAbstracts.length > 0) && (
          <Tooltip title="Set Boundary">
            <IconButton size="small" aria-label="Set Boundary" onClick={createMultiSelectedFeature}>
              <CheckCircle />
            </IconButton>
          </Tooltip>
        )}
      </span>
      {children}
    </Fragment>
  );
};

export default DrawShapesPopup;
