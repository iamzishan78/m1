import React, { useEffect, useContext, useState, Fragment } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import LayerIcon from "@material-ui/icons/Layers";
import CloseIcon from "@material-ui/icons/Close";
import GridOnIcon from "@material-ui/icons/GridOn";
import GpxFixedIcon from "@material-ui/icons/GpsFixed";
import FilterAltIcon from "../../../Shared/svgIcons/FilterAltIcon";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { area, convertArea, length } from "@turf/turf";
import polylabel from "polylabel";
import hat from "hat";
import { AppContext } from "../../../../AppContext";
import { UPSERTCUSTOMLAYER } from "../../../../graphQL/useMutationUpsertCustomLayer";
import Tooltip from "@material-ui/core/Tooltip";
import {default as MouseClicked} from "../../../Shared/svgIcons/MouseClicked";
import { default as DrawPoly } from "../../../Shared/svgIcons/polygon";
import { default as Rect } from "../../../Shared/svgIcons/rectangle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

import { gql } from "@apollo/client";

export const availableShapes = [
  {
    title: "Polygon",
    mode: "draw_polygon",
    icon: <MouseClicked />
  },
  {
    title: "Polygon",
    mode: "draw_polygon",
    icon: <DrawPoly />
  },
  {
    title: "Circle",
    mode: "drag_circle",
    icon: <RadioButtonUncheckedIcon fontSize="small" />
  },
  {
    title: "Rectangle",
    mode: "draw_rectangle",
    icon: <Rect />
  },
  // {
  //   title: "Line",
  //   mode: "draw_line_string",
  //   //icon: "fa fa-grip-lines"
  // },
];

const useStyles = makeStyles((theme) => ({
  mapOverlay: {
    position: "absolute",
    minWidth: "320px",
    bottom: "20px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(1, 17, 51, 1.0)",
    color: "#fff",
    borderRadius: '25px'
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
  footer: {
    margin: "5px 0",
  },
}));

const DrawShapesPopup = (props) => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [
    upsertCustomLayer,
    { data: customLayerInsertedData, loading: isSavingParcel },
  ] = useMutation(UPSERTCUSTOMLAYER, {
    update(
      cache,
      {
        data: {
          upsertCustomLayer: { customLayer },
        },
      }
    ) {
      console.log(`newCustomLayer: ${JSON.stringify(customLayer)}`);
      cache.modify({
        fields: {
          allCustomLayers(existingCustomLayers = [], { readField }) {
            const newCustomLayerRef = cache.writeFragment({
              data: customLayer,
              fragment: gql`
                fragment NewCustomLayer on CustomLayer {
                  _id
                  shape
                  name
                  layer
                  user {
                    _id
                    name
                    email
                  }
                }
              `,
            });

            // Quick safety check - if the new comment is already
            // present in the cache, we don't need to add it again.
            if (
              existingCustomLayers.some(
                (ref) => readField("id", ref) === customLayer._id
              )
            ) {
              return existingCustomLayers;
            }

            return [...existingCustomLayers, newCustomLayerRef];
          },
        },
      });
    },
  });

  useEffect(() => {
    if (!customLayerInsertedData) {
      return;
    }
    if (
      customLayerInsertedData.upsertCustomLayer &&
      customLayerInsertedData.upsertCustomLayer.customLayer
    ) {
      setStateApp((state) => ({
        ...state,
        popupOpen: false,
      }));

      const customLayer = customLayerInsertedData.upsertCustomLayer.customLayer;
      const feature = JSON.parse(customLayer.shape);
      feature.id = customLayer._id;
      feature.properties.id = customLayer._id;
      setStateApp((state) => ({
        ...state,
        selectedParcel: feature.properties,
      }));
      setStateApp((state) => ({
        ...state,
        popupOpen: true,
        expandedCard: true,
      }));
      props.onClickExpand();
      setStateApp((state) => ({
        ...state,
        selectedAbstracts: [],
      }));
    }
  }, [customLayerInsertedData]);

  // useEffect(() => {
  //   if (stateApp && stateApp.editDraw === false) {
  //     setStateApp(()=>({editDraw: true}))
  //   }
  // }, [stateApp.editDraw]);

  const formatNumber = (number) => {
    return number.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };
  const calculateLandArea = () => {
    const { selectedFeature } = props;
    if (selectedFeature) {
      if (selectedFeature.geometry.type === "Polygon") {
        const areaInSqMeters = area(selectedFeature);
        const areaInAcres = convertArea(areaInSqMeters, "meters", "acres");
        return `${formatNumber(Math.round(areaInAcres * 100) / 100)} acres`;
      }
      if (selectedFeature.geometry.type === "LineString") {
        const distanceInMiles = length(selectedFeature, { units: "miles" });
        return `${formatNumber(Math.round(distanceInMiles * 100) / 100)} miles`;
      }
    }
  };

  const clearMapAndCloseShapeActionsPopup = () => {
    stateApp.draw.delete(stateApp?.currentFeature?.id);
    setStateApp((state) => ({
      ...state,
      //selectedAbstracts: [],
      editDraw: false,
      showShapeActionsPopup: false,
      showDrawShapesPopup: false,
      currentFeature: undefined,
    }));
  };
  const actionClose = () => {
    clearMapAndCloseShapeActionsPopup();
  };

  const isLine = () => {
    return stateApp.currentFeature?.geometry.type === "LineString"
      ? true
      : false;
  };

  return (
    <Fragment>
      <div className={classes.mapOverlay}>
        <div class={classes.mapOverlayInner}>
          <div className={classes.content}>
            <span class={classes.label}>Tooltip</span> {calculateLandArea()}
            <span
              className={`${classes.actions} ${isLine() ? classes.gray : ""}`}
            >
              {availableShapes.map((shape, index) => (
                <Fragment key={index}>
                  <Tooltip title={shape.title}>
                    <IconButton
                      size="small"
                        onClick={() => {
                          stateApp.draw.changeMode(shape.mode);
                          setStateApp((state) => ({ ...state, editDraw: true }));
                          props.handleClose();
                        }}
                      aria-label={shape.title}
                    >
                      {shape.icon}
                    </IconButton>
                  </Tooltip>
                  </Fragment>
              ))}
              <Tooltip title="Close">
                <IconButton
                  size="small"
                  onClick={actionClose}
                  aria-label="Close"
                >
                  <CloseIcon className="close" fontSize="small" />
                </IconButton>
              </Tooltip>
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DrawShapesPopup;
