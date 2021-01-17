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
import hat from 'hat';
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

const useStyles = makeStyles((theme) => ({
  mapOverlay: {
    position: "absolute",
    minWidth: "320px",
    bottom: "20px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(1, 17, 51, 1.0)",
    color: "#fff",
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
    alignItems: "center"
  },
  label : {
    margin: "0 10px",
    fontWeight: "bold",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    marginLeft: "20px",
    '& button': {
      marginLeft: "5px",
      marginRight: "5px",
    },
    '& svg': {
      color: "#fff",
      '&:hover': {
        color: "rgb(102 146 202)",
      },
      '&.selected': {
        color: "rgb(102 146 202)",
      },
    }
  },
  whiteText: {
    color: "#fff",
    '&:hover': {
      color: "rgb(102 146 202)",
    }
  },
  footer: {
    margin: "5px 0"
  }
}));

export default (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [showSpatialDataCard, toggleSpatialDataCard] = useState(false);
  const [upsertCustomLayer, { data: customLayerInsertedData, loading: isSavingParcel}] = useMutation(
    UPSERTCUSTOMLAYER,
    {
      update(cache, { data: { upsertCustomLayer: { customLayer } } }) {
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
                `
              });

              // Quick safety check - if the new comment is already
              // present in the cache, we don't need to add it again.
              if (existingCustomLayers.some(
                ref => readField('id', ref) === customLayer._id
              )) {
                return existingCustomLayers;
              }

              return [...existingCustomLayers, newCustomLayerRef];
            }
          }
        });
      }
    }
  );
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
    if(!customLayerInsertedData) {
      return;
    }
    if (customLayerInsertedData.upsertCustomLayer && customLayerInsertedData.upsertCustomLayer.customLayer) {
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
        selectedParcel: feature.properties
      }));
      setStateApp((state) => ({
        ...state,
        popupOpen: true,
        expandedCard: true
      }));
      props.onClickExpand();
      setStateApp((state) => ({
        ...state,
        selectedAbstracts: []
      }));
    }
    if (customLayerInsertedData.upsertCustomLayer  && customLayerInsertedData.upsertCustomLayer.customLayer && !customLayerInsertedData.upsertCustomLayer.success) {
      setError(true);
    }
  }, [customLayerInsertedData]);

  const formatNumber = (number) => {
    return number.toLocaleString('en-US', { maximumFractionDigits:2 });
  }
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

  const handleClose = function () {
    let popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();

    for (let i = 0; i < stateApp.selectedAbstracts.length; i++) {
      const id = stateApp.selectedAbstracts[i].properties.Id;
      props.map.setFeatureState(
        { source: 'abstract_geo_source', id: id },
        { click: false }
      );
    }

    setStateApp((state) => ({
      ...state,
      selectedAbstracts: []
    }));
  }

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

      if ((dataType = "parcel"))
        stateApp.toggleLayersActivity("Parcels", true);
      if ((dataType = "interest"))
        stateApp.toggleLayersActivity("Area of Interest", true);
      setStateApp((state) => ({
        ...state,
        currentFeature: undefined,
        editDraw: false,
      }));
    }
  };

  const actionShowWellsAndOwners = () => {
    // TODO: save in state grid wells and owners
    // maybe better save in state boundaries than wells and owners
    dispatch(
      setMapGridCardState({
        mapGridCardActivated: true,
        mapGridCardActiveTap: 3,
      })
    );
    setStateApp((state) => ({
      ...state,
      gridWells: [],
      gridOwners: [],
    }));
  }

  const actionFilter = () => {
    if (stateApp.shapeActionsFilterSelected) {
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
    } else {
      let feature = props.selectedFeature;

      let polygonString = "POLYGON((";
      feature.geometry.coordinates[0].forEach((coordinate, index) => {
        polygonString += coordinate[0] + " " + coordinate[1];
        if (index < feature.geometry.coordinates[0].length - 1) {
          polygonString += ", ";
        }
      });
      polygonString += "))";

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
  }

  const actionAOI = () => {
    props.selectedFeature.properties.sdType = "interest";
    toggleSpatialDataCard(true);
  }

  const actionParcel = () => {
    props.selectedFeature.properties.sdType = "parcel";
    toggleSpatialDataCard(true);
  }

  return (
    <Fragment>
      {showSpatialDataCard &&
        <SpatialDataCard
          closeSpatialDataCard={() => toggleSpatialDataCard(false)}
          saveSpatialData={handleSaveSpatialDataToShape}
          //deleteSpatialDataAndShape={handleDeleteSpatialDataAndShape}
          selectedFeature={stateApp.currentFeature}
        />
      }
      <div className={classes.mapOverlay}>
        <div class={classes.mapOverlayInner}>
          <div className={classes.content}>
            <span class={classes.label}>Calc. Area</span> {calculateLandArea()}
            <span class={classes.actions}>
              <Tooltip title="Grid">
                <IconButton size="small" onClick={actionShowWellsAndOwners} aria-label="Grid" >
                  <GridOnIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter">
                <IconButton size="small" onClick={actionFilter} aria-label="Filter" >
                  <FilterAltIcon className={ stateApp.shapeActionsFilterSelected ? "selected" : "" } />
                </IconButton>
              </Tooltip>
              <Tooltip title="AOI">
                <IconButton size="small" onClick={actionAOI} aria-label="AOI" >
                  <span class={classes.whiteText}>AOI</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Parcel">
                <IconButton size="small" onClick={actionParcel} aria-label="Parcel" >
                  <LayerIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Track">
                <IconButton size="small" /*onClick={saveAndOpenParcelDetail}*/ aria-label="Track" >
                  <GpxFixedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Close">
                <IconButton size="small" onClick={handleClose} aria-label="Close">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </span>
          </div>
          {error &&
            <div className={classes.footer}>
              <Typography color="error" align="center"></Typography>
            </div>
          }
        </div>
      </div>
    </Fragment>
  );
}