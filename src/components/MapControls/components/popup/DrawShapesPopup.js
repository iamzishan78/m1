import React, { useState, useEffect, useMemo, useContext, Fragment } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import LayerIcon from "@material-ui/icons/Layers";
import polylabel from "polylabel";
import hat from 'hat';
import { area, convertArea, length } from "@turf/turf";
import { AppContext } from 'AppContext';
import { UPSERTCUSTOMLAYER } from "../../../../graphQL/useMutationUpsertCustomLayer";
import { default as MouseClicked } from "../../../Shared/svgIcons/MouseClicked";
import { default as DrawPoly } from "../../../Shared/svgIcons/polygon";
import { default as Rect } from "../../../Shared/svgIcons/rectangle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import { USERBYEMAIL } from "graphQL/useQueryUserByEmail";

import { gql } from "@apollo/client";

const DrawShapesPopup = (props) => {
  const { classes, children } = props;
  const [user, setUser] = useState({ _id: "" });
  const [stateApp, setStateApp] = useContext(AppContext);
  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);
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
    }
  }, [customLayerInsertedData]);

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

  const formatNumber = (number) => {
    return number.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };
  const calculateLandArea = (feature = {}) => {
    const { selectedFeature } = props;
    if (!feature) feature = selectedFeature;
    if (feature) {
      if (feature.geometry.type === "Polygon") {
        const areaInSqMeters = area(feature);
        const areaInAcres = convertArea(areaInSqMeters, "meters", "acres");
        return `${formatNumber(Math.round(areaInAcres * 100) / 100)} acres`;
      }
      if (feature.geometry.type === "LineString") {
        const distanceInMiles = length(feature, { units: "miles" });
        return `${formatNumber(Math.round(distanceInMiles * 100) / 100)} miles`;
      }
    }
  };

  const calculateShapeCenter = shapeCoordinates => polylabel(shapeCoordinates);

  const onActionClick = (shape) => {
    if (shape.title === 'Multiple Select') {
      if (stateApp.multiSelectLandGrids) {
        handleCloseAbstractSelection();
      }
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

  const saveAndOpenParcelDetail = () => {
    if (!user._id) {
      return;
    }
    const abstractShape = stateApp.selectedAbstracts[0];


    const properties = abstractShape?.properties;
    let township = properties?.Township;
    let range = properties?.Range;
    let section = properties?.ShortName;

    let parcelName, originalProperties;
    if (abstractShape.properties.State === "TX") {
      parcelName = abstractShape.properties.Survey + " " + abstractShape.properties.AbstractName;
    } else if (township && range && section) {
      parcelName = `T${township} R${range} — Section ${section}`;
    } else {
      parcelName = "PLSS Default Name";
    }
    originalProperties = [abstractShape.properties];

    const featureId = hat();
    const newShapeFeature = {
      id: featureId,
      type: "Feature",
      geometry: abstractShape.geometry,
      properties: {
        "originalProperties": originalProperties,
        "sdType": "parcel",
        "shapeLabel": parcelName,
        "projectName": "",
        "sdNotes": "",
        "sdGrossAcres": "",
        "shapeArea": calculateLandArea(abstractShape),
        "shapeCenter": calculateShapeCenter(abstractShape.geometry.coordinates),
        "shapeLabelLayer": "",
        "id": featureId
      }
    }
    const customLayerData = {
      shape: JSON.stringify(newShapeFeature),
      layer: 'parcel',
      name: parcelName,
      user: user._id,
      state: abstractShape.properties.State
    };

    upsertCustomLayer({
      variables: { customLayer: customLayerData }
    });

    let layers = [...stateApp.customLayers];
    layers.push(customLayerData);

    setStateApp((state) => ({
      ...state,
      selectedParcel: {
        "originalProperties": abstractShape.properties.State === "TX" ? JSON.stringify(abstractShape.properties) : [],
        "sdType": "parcel",
        "shapeLabel": parcelName,
        "projectName": "",
        "sdNotes": "",
        "sdGrossAcres": "",
        "shapeArea": calculateLandArea(abstractShape),
        // needs to be a string to be consistent with queried data
        "shapeCenter": JSON.stringify(calculateShapeCenter(abstractShape.geometry.coordinates)),
        "shapeLabelLayer": "",
        "id": featureId
      },
      customLayers: layers,
      expandedCard: true
    }));
  }

  const handleCloseAbstractSelection = () => {
    const { map } = stateApp;
    let popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();

    for (let i = 0; i < stateApp.selectedAbstracts.length; i++) {
      const id = stateApp.selectedAbstracts[i].properties.Id;
      map.setFeatureState(
        { source: 'abstract_geo_source', id },
        { click: false }
      );
    }

    setStateApp((state) => ({
      ...state,
      selectedAbstracts: []
    }));
  }

  const parcelLabel = stateApp.selectedAbstracts.length > 1 ? "tracts" : "tract";

  return (
    <Fragment>
      <span class={classes.label}>{
        stateApp.selectedAbstracts.length > 0 ? `${`${stateApp.selectedAbstracts.length} ${parcelLabel}`} selected` : 'Tooltip'
      }</span>
      <span className={classes.actions}>
        {
          stateApp.selectedAbstracts.length > 0 && (
            <Tooltip title="Create Parcel">
              <IconButton size="small" aria-label="Parcel" onClick={saveAndOpenParcelDetail}>
                <LayerIcon color="secondary" />
              </IconButton>
            </Tooltip>
          )
        }
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
