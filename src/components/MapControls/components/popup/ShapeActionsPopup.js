import React, { useEffect, useContext, useState, Fragment } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import hat from "hat";
import polylabel from "polylabel";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import GridOnIcon from "@material-ui/icons/GridOn";
import GpxFixedIcon from "@material-ui/icons/GpsFixed";
import LayerIcon from "@material-ui/icons/Layers";
import FilterAltIcon from "../../../Shared/svgIcons/FilterAltIcon";
import Typography from "@material-ui/core/Typography";
import { area, convertArea, length } from "@turf/turf";
import { AppContext } from "../../../../AppContext";
import {
  NavigationContext,
  DRAWING_MODES,
} from "../../../Navigation/NavigationContext";
import { UPSERTCUSTOMLAYER } from "../../../../graphQL/useMutationUpsertCustomLayer";
import { USERBYEMAIL } from "../../../../graphQL/useQueryUserByEmail";
import { ABSTRACTGEOCONTAINSQUERY } from "../../../../graphQL/useQueryAbstractGeoContains";
import Tooltip from "@material-ui/core/Tooltip";
import { useDispatch } from "react-redux";
import { spatialDataAttributes } from "../DrawShapes/constants";
import SpatialDataCard from "../spatialDataCard";
import { setMapGridCardState } from "../../../../actions";

import { gql } from "@apollo/client";

const ShapeActionsPopup = (props) => {
  const dispatch = useDispatch();
  const { classes, children, toggleSpatialDataCard } = props;
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
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
  const [error, setError] = useState(false);
  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);
  const [getAbstractGeoContains, { data: abstractContainsData }] = useLazyQuery(
    ABSTRACTGEOCONTAINSQUERY
  );
  const [user, setUser] = useState({ _id: "" });

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
    if (
      customLayerInsertedData.upsertCustomLayer &&
      customLayerInsertedData.upsertCustomLayer.customLayer &&
      !customLayerInsertedData.upsertCustomLayer.success
    ) {
      setError(true);
    }
  }, [customLayerInsertedData]);

  /**
   * Disabling filter on Cross Button / Unmounting
   */
  useEffect(() => {
    return () => {
      clearFilter();
    };
  }, []);

  useEffect(() => {
    // USE EFFECT for applying filter to new shape
    if (stateApp.shapeActionsFilterSelected) {
      applyFilter();
    }
  }, [stateApp.currentFeature]);

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

  const handleSaveSpatialDataToShape = (spatialData, dataType) => {
    spatialDataAttributes.forEach((attribute) => {
      stateApp.draw.setFeatureProperty(
        stateApp.currentFeature.id,
        attribute,
        spatialData[attribute]
      );
      if (
        spatialData[attribute] != null ||
        typeof spatialData[attribute] !== "undefined"
      ) {
        stateApp.currentFeature.properties[attribute] = spatialData[attribute];
      }
    });
    stateApp.currentFeature.properties.id = stateApp.currentFeature.id;

    toggleSpatialDataCard(false);
    const { currentFeature } = stateApp;
    stateApp.draw.delete(currentFeature.id);

    if (user._id !== "") {
      const customLayerData = {
        shape: JSON.stringify(stateApp.currentFeature),
        layer: dataType,
        name: spatialData.shapeLabel,
        user: user._id,
      };

      upsertCustomLayer({
        variables: { customLayer: customLayerData },
        refetchQueries: ["getCustomLayers"],
        awaitRefetchQueries: true,
      });

      if ((dataType = "parcel")) stateApp.toggleLayersActivity("Parcels", true);
      if ((dataType = "interest"))
        stateApp.toggleLayersActivity("Area of Interest", true);
      setStateApp((state) => ({
        ...state,
        editDraw: false,
      }));
    }
  };

  const getSelectedFeaturePolygonString = () => {
    let feature = props.selectedFeature;

    let polygonString = "POLYGON((";
    feature.geometry.coordinates[0].forEach((coordinate, index) => {
      polygonString += coordinate[0] + " " + coordinate[1];
      if (index < feature.geometry.coordinates[0].length - 1) {
        polygonString += ", ";
      }
    });
    polygonString += "))";

    return polygonString;
  };

  const actionShowWellsAndOwners = () => {
    if (isLine()) return;
    setStateApp((state) => ({
      ...state,
      gridPolygonString: getSelectedFeaturePolygonString(),
    }));
    dispatch(
      setMapGridCardState({
        mapGridCardActivated: true,
        mapGridCardActiveTap: 0,
      })
    );
  };

  const clearFilter = () => {
    // stateApp.draw.changeMode("simple_select");
    setStateNav((stateNav) => ({
      ...stateNav,
      drawingMode: null,
      filterFeatureId: null,
      filterDrawing: [],
    }));

    setStateApp((state) => ({
      ...state,
      shapeActionsFilterSelected: false,
    }));
  };

  const applyFilter = () => {
    let feature = props.selectedFeature;
    let polygonString = getSelectedFeaturePolygonString();

    getAbstractGeoContains({
      variables: {
        polygon: polygonString,
      },
    });

    setStateNav((stateNav) => ({
      ...stateNav,
      drawingMode: null,
      filterDrawing: ["within", feature],
    }));

    setStateApp((state) => ({
      ...state,
      shapeActionsFilterSelected: true,
    }));
  };

  const actionFilter = () => {
    if (isLine()) return;
    if (stateApp.shapeActionsFilterSelected) {
      clearFilter();
    } else {
      applyFilter();
    }
  };

  const actionEdit = () => {
    const { selectedFeature } = props;
    stateApp.draw.changeMode("direct_select", {
      featureId: selectedFeature.id,
    });
    setStateNav((stateNav) => ({
      ...stateNav,
      drawingMode: DRAWING_MODES.DRAW_CIRCLE,
    }));
  };

  // const actionAOI = () => {
  //   if (isLine()) return;
  //   props.selectedFeature.properties.sdType = "interest";
  //   toggleSpatialDataCard(true);
  // };

  // const actionParcel = () => {
  //   if (isLine()) return;
  //   props.selectedFeature.properties.sdType = "parcel";
  //   toggleSpatialDataCard(true);
  // };

  const isLine = () => {
    return stateApp.currentFeature.geometry.type === "LineString"
      ? true
      : false;
  };

  const { showSpatialDataCard } = props;

  const calculateShapeCenter = (shapeCoordinates) =>
    polylabel(shapeCoordinates);

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
      parcelName =
        abstractShape.properties.Survey +
        " " +
        abstractShape.properties.AbstractName;
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
        originalProperties: originalProperties,
        sdType: "parcel",
        shapeLabel: parcelName,
        projectName: "",
        sdNotes: "",
        sdGrossAcres: "",
        shapeArea: calculateLandArea(abstractShape),
        shapeCenter: calculateShapeCenter(abstractShape.geometry.coordinates),
        shapeLabelLayer: "",
        id: featureId,
      },
    };
    const customLayerData = {
      shape: JSON.stringify(newShapeFeature),
      layer: "parcel",
      name: parcelName,
      user: user._id,
      state: abstractShape.properties.State,
    };

    upsertCustomLayer({
      variables: { customLayer: customLayerData },
    });

    let layers = [...stateApp.customLayers];
    layers.push(customLayerData);

    setStateApp((state) => ({
      ...state,
      selectedParcel: {
        originalProperties:
          abstractShape.properties.State === "TX"
            ? JSON.stringify(abstractShape.properties)
            : [],
        sdType: "parcel",
        shapeLabel: parcelName,
        projectName: "",
        sdNotes: "",
        sdGrossAcres: "",
        shapeArea: calculateLandArea(abstractShape),
        // needs to be a string to be consistent with queried data
        shapeCenter: JSON.stringify(
          calculateShapeCenter(abstractShape.geometry.coordinates)
        ),
        shapeLabelLayer: "",
        id: featureId,
      },
      customLayers: layers,
      expandedCard: true,
    }));
  };

  return (
    <Fragment>
      {showSpatialDataCard && (
        <SpatialDataCard
          closeSpatialDataCard={() => toggleSpatialDataCard(false)}
          saveSpatialData={handleSaveSpatialDataToShape}
          selectedFeature={stateApp.currentFeature}
        />
      )}
      <Fragment>
        <span class={classes.label}>
          {isLine() ? "Calc. Dist" : "Calc. Area"}
        </span>{" "}
        {calculateLandArea()}
        <span className={`${classes.actions} ${isLine() ? classes.gray : ""}`}>
          <Tooltip title="Grid">
            <IconButton
              size="small"
              onClick={actionShowWellsAndOwners}
              aria-label="Grid"
            >
              <GridOnIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter">
            <IconButton size="small" onClick={actionFilter} aria-label="Filter">
              <FilterAltIcon
                className={
                  stateApp.shapeActionsFilterSelected ? "selected" : ""
                }
              />
            </IconButton>
          </Tooltip>

          {stateApp.selectedAbstracts.length > 0 && (
            <Tooltip title="Create Parcel">
              <IconButton
                size="small"
                aria-label="Parcel"
                onClick={saveAndOpenParcelDetail}
              >
                <LayerIcon color="secondary" />
              </IconButton>
            </Tooltip>
          )}

          {/* * Commenting APO and Parcel per design implementation */}
          {/* <Tooltip title="AOI">
            <IconButton size="small" onClick={actionAOI} aria-label="AOI">
              <span
                className={`${classes.whiteText} ${
                  isLine() ? classes.gray : ""
                }`}
              >
                AOI
              </span>
            </IconButton>
          </Tooltip> */}
          {/* <Tooltip title="Parcel">
            <IconButton size="small" onClick={actionParcel} aria-label="Parcel">
              <LayerIcon />
            </IconButton>
          </Tooltip> */}

          {/* <Tooltip title="Track">
            <IconButton size="small" onClick={actionAOI} aria-label="Track">
              <GpxFixedIcon />
            </IconButton>
          </Tooltip> */}

          <span className={classes.divider}></span>
          <Tooltip title="Edit Active Shape">
            <IconButton
              size="small"
              aria-label="Edit Active Shape"
              onClick={actionEdit}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Active Shape">
            <IconButton size="small" aria-label="Delete Active Shape">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </span>
        {children}
        {error && (
          <div className={classes.footer}>
            <Typography color="error" align="center"></Typography>
          </div>
        )}
      </Fragment>
    </Fragment>
  );
};

export default ShapeActionsPopup;
