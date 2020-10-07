import React, { useEffect, useContext, useState, Fragment } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import LayerIcon from "@material-ui/icons/Layers";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { area, convertArea, length } from "@turf/turf";
import polylabel from "polylabel";
import hat from 'hat';
import { AppContext } from "../../../../AppContext";
import { UPSERTCUSTOMLAYER } from "../../../../graphQL/useMutationUpsertCustomLayer";
import { USERBYEMAIL } from "../../../../graphQL/useQueryUserByEmail";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
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
  actions: {
    display: "flex",
    alignItems: "center"
  },
  label : {
    margin: "0 10px"
  },
  footer: {
    margin: "5px 0"
  }
}));

export default (props) => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [upsertCustomLayer, { data: customLayerInsertedData, loading: isSavingParcel}] = useMutation(UPSERTCUSTOMLAYER);
  const [upsertCustomLayerSymbol] = useMutation(UPSERTCUSTOMLAYER);

  const [error, setError] = useState(false);
  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);
  const [user, setUser] = useState({ _id: "" });

  const parcelLabel = props.abstracts.length > 1 ? "tracts" : "tract";

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
    if (customLayerInsertedData.upsertCustomLayer  && customLayerInsertedData.upsertCustomLayer.customLayer && !customLayerInsertedData.success) {
      setError(true);
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

  const calculateLandArea = (feature) => {
    if (feature) {
      if (feature.geometry.type === "Polygon") {
        const areaInSqMeters = area(feature);
        const areaInAcres = convertArea(areaInSqMeters, "meters", "acres");
        return `${Math.round(areaInAcres * 100) / 100}`;
      }
    }
  };

  const calculateShapeCenter = shapeCoordinates => polylabel(shapeCoordinates);

  const saveAndOpenParcelDetail = function () {
    if (!user._id) {
      console.log("No user found!");
      return;
    }
    const abstractShape = stateApp.selectedAbstracts[0];
    let parcelName, originalProperties;
    if(abstractShape.properties.State === "TX") {
      parcelName = abstractShape.properties.Survey + " " + abstractShape.properties.AbstractName;
      originalProperties = [abstractShape.properties];
    } else {
      parcelName = "PLSS Default Name";
      originalProperties = [];
    }
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

    let position = null;

    if (typeof newShapeFeature.properties.shapeCenter == 'string') {
      position = JSON.parse(newShapeFeature.properties.shapeCenter);
    } else {
      position = newShapeFeature.properties.shapeCenter
    }

    const symbolFeature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: position
      },
      properties: {
        ...newShapeFeature.properties,
        id: `${newShapeFeature.id}_label`,
        label: parcelName,
      }
    }

    const customLayerSymbolData = {
      shape: JSON.stringify(symbolFeature),
      layer: `parcel_labels`,
      name: parcelName,
      user: user._id,
      state: abstractShape.properties.State
    };

    upsertCustomLayer({
      variables: { customLayer: customLayerData }
    });

    upsertCustomLayerSymbol({
      variables: { customLayer: customLayerSymbolData }
    });
  }

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

  return (
    <Fragment>
      <div className={classes.popUp}>
        <div className={classes.content}>
          <strong>{props.abstracts.length} {parcelLabel} selected</strong>
          <div className={classes.actions}>
            {isSavingParcel ? (
              <CircularProgress size={20} color="secondary" />
            ): (
            <Tooltip title="Create Parcel">
            <IconButton size="small" onClick={saveAndOpenParcelDetail} aria-label="Parcel" >
              <LayerIcon color="secondary" />
            
            </IconButton>
            </Tooltip>
            )}
            {/* <strong className={classes.label}>Parcel/Tract</strong> */}
            <IconButton size="small" onClick={handleClose} aria-label="Close">
              <CloseIcon color="secondary" fontSize="small" />
            </IconButton>
          </div>
        </div>
        {error &&
          <div className={classes.footer}>
            <Typography color="error" align="center">Failed to create parcel.</Typography>
          </div>
        }
      </div>
    </Fragment>
  );
}