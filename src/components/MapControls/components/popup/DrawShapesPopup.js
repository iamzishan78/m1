import React, { useEffect, useMemo, useContext, Fragment } from "react";
import { useMutation } from "@apollo/client";
import IconButton from "@material-ui/core/IconButton";
import { area, convertArea, length } from "@turf/turf";
import { AppContext } from 'AppContext';
import { UPSERTCUSTOMLAYER } from "../../../../graphQL/useMutationUpsertCustomLayer";
import Tooltip from "@material-ui/core/Tooltip";
import { default as MouseClicked } from "../../../Shared/svgIcons/MouseClicked";
import { default as DrawPoly } from "../../../Shared/svgIcons/polygon";
import { default as Rect } from "../../../Shared/svgIcons/rectangle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

import { gql } from "@apollo/client";

const DrawShapesPopup = (props) => {
  const { classes, children } = props;
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

  const availableShapes = useMemo(() => [
    {
      title: "Multiple Select",
      mode: "multiple_select",
      icon: <MouseClicked />,
      disable: stateApp.mapVars.zoom <= 13
    },
    {
      title: "Polygon",
      mode: "draw_polygon",
      icon: <DrawPoly />,
    },
    {
      title: "Circle",
      mode: "drag_circle",
      icon: <RadioButtonUncheckedIcon fontSize="small" />,
    },
    {
      title: "Rectangle",
      mode: "draw_rectangle",
      icon: <Rect />,
    },
  ], [stateApp.mapVars.zoom]);

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

  const onActionClick = (shape) => {
    if (shape.title === 'Multiple Select') {
      setStateApp(state => ({
        ...state,
        multiSelectLandGrids: !state.multiSelectLandGrids
      }))
    } else {
      stateApp.draw.changeMode(shape.mode);
      setStateApp((state) => ({ ...state, editDraw: true }));
      props.handleClose();
    }
  }

  return (
    <Fragment>
      <span class={classes.label}>Tooltip</span> {calculateLandArea()}
      <span className={classes.actions}>
        {availableShapes.map((shape, index) => (
          <Fragment key={index}>
            <Tooltip title={shape.title} className={shape.disable ? classes.disableAction : ''}>
              <IconButton
                size="small"
                onClick={() => {
                  onActionClick(shape)
                }}
                aria-label={shape.title}
              >
                {shape.icon}
              </IconButton>
            </Tooltip>
          </Fragment>
        ))}
      </span>
      {children}
    </Fragment>
  );
};

export default DrawShapesPopup;
