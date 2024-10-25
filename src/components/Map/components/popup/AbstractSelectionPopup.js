import React, { useEffect, useContext, useState, Fragment } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import LayerIcon from "@material-ui/icons/Layers";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { area, convertArea } from "@turf/turf";
import hat from 'hat';
import { AppContext } from "../../../../AppContext";
import { UPSERTCUSTOMLAYER } from "../../../../graphQL/useMutationUpsertCustomLayer";
import { USERBYEMAIL } from "../../../../graphQL/useQueryUserByEmail";
import Tooltip from "@material-ui/core/Tooltip";
import { gql } from "@apollo/client";

import { calculateShapeCenter } from "components/MapControls/components/DrawShapes/drawShapesHelpers";
import { popupController } from "hookstate/popupStateController";
import { drawController } from "hookstate/drawStateController";
import { layerRefs } from "hookstate";
import { layerController } from "hookstate/layerStateController";

const useStyles = makeStyles((theme) => ({
  mapOverlay: {
    position: "absolute",
    minWidth: "320px",
    bottom: "20px",
    left: "47%",
  },
  mapOverlayInner: {
    backgroundColor: "#fff",
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
  actions: {
    display: "flex",
    alignItems: "center"
  },
  label: {
    margin: "0 10px"
  },
  footer: {
    margin: "5px 0"
  }
}));

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [upsertCustomLayer, { data: customLayerInsertedData, loading: isSavingParcel }] = useMutation(
    UPSERTCUSTOMLAYER,
    {
      update(cache, { data: { upsertCustomLayer: { customLayer } } }) {
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
  const [user, setUser] = useState({ _id: "" });

  const parcelLabel = props.abstracts.length > 1 ? "tracts" : "tract";

  useEffect(() => {
    if (!customLayerInsertedData) {
      return;
    }
    if (customLayerInsertedData.upsertCustomLayer && customLayerInsertedData.upsertCustomLayer.customLayer) {
      const customLayer = customLayerInsertedData.upsertCustomLayer.customLayer;
      const feature = JSON.parse(customLayer.shape);
      feature.id = customLayer._id;
      feature.properties.id = customLayer._id;
      popupController.setState({
        selectedParcel: feature.properties,
        popupOpen: true,
        expandedCard: true,
      });
      props.onClickExpand();
      if (drawController.getValue('selectedAbstracts').length > 0) {
        drawController.updateState({
          selectedAbstracts: [],
        });
      }
    }
    if (customLayerInsertedData.upsertCustomLayer && customLayerInsertedData.upsertCustomLayer.customLayer && !customLayerInsertedData.upsertCustomLayer.success) {
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

  const saveAndOpenParcelDetail = function () {
    if (!user._id) {
      return;
    }
    const abstractShape = drawController.getValue('selectedAbstracts')[0];

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
    originalProperties = abstractShape.properties;

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
        "shapeCenter": calculateShapeCenter(abstractShape.geometry),
        "shapeLabelLayer": "",
        "id": featureId
      }
    }
    const customLayerData = {
      shapeJson: newShapeFeature,
      shape: JSON.stringify(newShapeFeature),
      layer: 'parcel',
      name: parcelName,
      user: user._id,
      state: abstractShape.properties.State
    };

    upsertCustomLayer({
      variables: { customLayer: customLayerData }
    }).then((result) => {
      layerController.resetBounds(result?.data?.upsertCustomLayer?.customLayer?.layer)
    });

    let layers = [...stateApp.customLayers];
    layers.push(customLayerData);

    popupController.updateState({
      selectedParcel: {
        originalProperties: abstractShape.properties.State === 'TX' ? JSON.stringify(abstractShape.properties) : [],
        sdType: 'parcel',
        shapeLabel: parcelName,
        projectName: '',
        sdNotes: '',
        sdGrossAcres: '',
        shapeArea: calculateLandArea(abstractShape),
        // needs to be a string to be consistent with queried data
        shapeCenter: JSON.stringify(calculateShapeCenter(abstractShape.geometry)),
        shapeLabelLayer: '',
        id: featureId,
      },
      expandedCard: true,
    });

    setStateApp((state) => ({
      ...state,
      customLayers: layers,
    }));
  }

  const handleClose = function () {
    let popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();

    const selectedAbstracts = drawController.getValue('selectedAbstracts');

    drawController.updateState({
      selectedAbstracts: []
    })

    const sourceId = layerRefs.abstract_geo?.get({ noproxy: true })?.sourceId;

    if (!sourceId) return;

    for (let i = 0; i < selectedAbstracts.length; i++) {
      const id = selectedAbstracts[i].properties.Id;
      window.mapRef?.setFeatureState(
        { source: sourceId, id: id },
        { click: false }
      );
    }
  }

  return (
    <Fragment>
      <div className={classes.mapOverlay}>
        <div class={classes.mapOverlayInner}>
          <div className={classes.content}>
            <strong>{props.abstracts.length} {parcelLabel} selected</strong>
            <div className={classes.actions}>
              {isSavingParcel ? (
                <CircularProgress size={20} color="secondary" />
              ) : (
                <Tooltip title="Add Shape to Layer">
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
      </div>
    </Fragment>
  );
}