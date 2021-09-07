import React, { useContext, useState } from "react";

import { useMutation } from "@apollo/client";
import { makeStyles, Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

import { AppContext } from "AppContext";
import { addCustomShapeProperties, drawBoundary } from "../../components/DrawShapes/drawShapesHelpers";
import { spatialDataAttributes } from "../DrawShapes/constants";
import { UPDATECUSTOMLAYER } from "graphQL/useMutationUpdateCustomLayer";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    bottom: "55px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(1, 17, 51, 1.0)",
    color: "#fff",
    minWidth: "220px",
    width: "420px !important",
    opacity: "0.9",
    borderColor: "rgba(1, 17, 51, 1.0)",
  },
  TextField: {
    display: "flex",
    //borderColor: "#fff",
    background: "rgba(1, 17, 51, 1.0)",
    color: "#fff",
  },

  TextFieldInput: {
    color: "#fff",
    //fontWeight: "bold"
  },
  TextFieldLabel: {
    color: "#fff",
    //fontWeight: "bold"
  },
  enterLabel: {
    height: "3px",
    margin: "0px 12px 15px 12px",
    textAlign: "right",
    color: "fff",
    fontSize: "11px",
    display: "flex",
    justifyContent: "space-between"
  },
}));

export default function ShapeAOIPopup(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const { shapeLabel } = stateApp.currentFeature.properties;
  const [showError, setShowError] = useState(false);
  const { upsertCustomLayer, user, toggleSpatialDataCard } = props;

  //mutations
  const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);

  const updateSourceAndAoiLayer = (currentFeature) => {
    const { map, draw } = stateApp;
    stateApp.map.getSource("aoi_label_source").setData({
      type: "FeatureCollection",
      features: [currentFeature],
    });

    // Add a symbol layer
    map.addLayer({
      id: "aoi_label_layer",
      type: "symbol",
      source: "aoi_label_source",
      layout: {
        "text-field": ["get", "shapeLabel"],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-size": 40,
        "text-anchor": "center",
        "text-justify": "center",
      },
    });

    setStateApp((state) => ({
      ...state,
      currentFeature,
    }));
    const drewShapeOnMap = draw.get(currentFeature.id);
    if (drewShapeOnMap) {
      draw.setFeatureProperty(currentFeature.id, "shapeLabel", currentFeature.properties.shapeLabel);
    }
  };

  const handleSaveSpatialDataToShape = (dataName, dataType = "interest") => {
    if (!dataName) {
      setShowError(true);
    } else {
      const spatialData = {
        sdType: dataType,
        shapeLabel: dataName,
        projectName: "",
        sdGrossAcres: "",
      };
      spatialDataAttributes.forEach((attribute) => {
        stateApp.draw.setFeatureProperty(stateApp.currentFeature.id, attribute, spatialData[attribute]);
        if (spatialData[attribute] != null || typeof spatialData[attribute] !== "undefined") {
          stateApp.currentFeature.properties[attribute] = spatialData[attribute];
        }
      });
      stateApp.currentFeature.properties.id = stateApp.currentFeature.id;
      drawBoundary(stateApp.map, stateApp.currentFeature)
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
          // awaitRefetchQueries: true,
        });

        updateSourceAndAoiLayer(stateApp.currentFeature);
      }
      toggleSpatialDataCard(false);
    }
  };

  const handleEditSpatialDataToShape = (dataName, dataType = "interest") => {
    // save data onto geoJSON properties fields
    const spatialData = {
      sdType: dataType,
      shapeLabel: dataName,
      projectName: "",
      sdGrossAcres: "",
      // sdNotes: dataNotes
    };
    const { currentFeature } = stateApp;

    addCustomShapeProperties(currentFeature, stateApp.draw);
    spatialDataAttributes.forEach((attribute) => {
      if (spatialData[attribute] != null || typeof spatialData[attribute] !== "undefined") {
        currentFeature.properties[attribute] = spatialData[attribute];
      }
    });

    // //////cleaning the selected title opinion and redirecting to title opinion page//
    if (stateApp.user.mongoId !== "") {
      const customLayerId = stateApp.selectedAoi.id;

      const customLayerData = {
        shape: JSON.stringify(currentFeature),
        layer: dataType,
        name: spatialData.shapeLabel,
        user: stateApp.user.mongoId,
      };
      updateCustomLayer({
        variables: {
          customLayerId: customLayerId,
          customLayer: customLayerData,
        },
        refetchQueries: ["getCustomLayers"],
        awaitRefetchQueries: true,
      });

      updateSourceAndAoiLayer(currentFeature);
    }
    toggleSpatialDataCard(false);
  };

  return (
    <div className={`${classes.root}`}>
      <form autoComplete="off">
        <TextField
          // label="Area of Interest Name"
          placeholder="Area of Interest Name"
          className={classes.TextField}
          variant="filled"
          id="reddit-input"
          defaultValue={shapeLabel}
          autoFocus
          InputProps={{ className: classes.TextFieldInput, disableUnderline: true }}
          InputLabelProps={{ className: classes.TextFieldLabel }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              e.preventDefault();
              if (!stateApp.selectedAoi) {
                handleSaveSpatialDataToShape(e.target.value);
              } else {
                handleEditSpatialDataToShape(e.target.value);
              }
            }
          }}
        />
      </form>
      <div className={classes.enterLabel}>
        <span style={{ color: 'red' }}>{showError ? "Name is required!" : ""}</span>
        <span>Press enter to save</span>
      </div>
    </div>
  );
}
