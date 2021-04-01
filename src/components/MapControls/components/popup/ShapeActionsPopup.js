import React, { useEffect, useContext, useState, Fragment } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import GridOnIcon from "@material-ui/icons/GridOn";
import GpxFixedIcon from "@material-ui/icons/GpsFixed";
import FilterAltIcon from "../../../Shared/svgIcons/FilterAltIcon";
import Typography from "@material-ui/core/Typography";
import { area, convertArea, length } from "@turf/turf";
import { AppContext } from "../../../../AppContext";
import { NavigationContext } from "../../../Navigation/NavigationContext";
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
  const { classes, children } = props;
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [showSpatialDataCard, toggleSpatialDataCard] = useState(false);
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
      props.onClickExpand();
      setStateApp((state) => ({
        ...state,
        selectedAbstracts: [],
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
  useEffect(()=>{
    return () => {
      clearFilter();
    };
  }, []);

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
        //currentFeature: undefined,
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
    stateApp.draw.changeMode("simple_select");
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
  }

  const actionFilter = () => {
    if (isLine()) return;
    if (stateApp.shapeActionsFilterSelected) {
      clearFilter();
    } else {
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
    }
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

          {/**
                * Commenting APO and Parcel per design implementation
              <Tooltip title="AOI">
                <IconButton size="small" onClick={actionAOI} aria-label="AOI" >
                  <span className={`${classes.whiteText} ${isLine() ? classes.gray : ""}`}>AOI</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Parcel">
                <IconButton size="small" onClick={actionParcel} aria-label="Parcel" >
                  <LayerIcon />
                </IconButton>
              </Tooltip>
                */}

          <Tooltip title="Track">
            <IconButton
              size="small"
              /*onClick={saveAndOpenParcelDetail}*/ aria-label="Track"
            >
              <GpxFixedIcon />
            </IconButton>
          </Tooltip>
          <span className={classes.divider}></span>
          <Tooltip title="Edit Active Shape">
            <IconButton size="small" aria-label="Edit Active Shape">
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
