import React, { useContext, useState } from "react";

import { useMutation } from "@apollo/client";
import { makeStyles, fade } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

import { AppContext } from "AppContext";
import { NavigationContext } from "../../../Navigation/NavigationContext";
import { addCustomShapeProperties } from "../../components/DrawShapes/drawShapesHelpers";
import { spatialDataAttributes } from "../DrawShapes/constants";
import { UPDATECUSTOMLAYER } from "graphQL/useMutationUpdateCustomLayer";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    minWidth: "220px",
    bottom: "65px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(1, 17, 51, 1.0)",
    color: "#fff",
  },
  TextField: {
    display: "flex",
    borderColor: "#fff",
    background: "rgba(1, 17, 70, 1)",
    color: "#fff"
  },
  TextFieldInput: {
    color: "#fff",
    fontWeight: "bold"
  },
  TextFieldLabel: {
    color: "#fff",
    fontWeight: "bold"
  }
}));

export default function DrawShapes(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const {
    sdType,
    shapeLabel,
    projectName,
    sdNotes,
    sdGrossAcres,
  } = stateApp.currentFeature.properties;
  const [showError, setShowError] = useState(false);
  const { upsertCustomLayer, user, toggleSpatialDataCard } = props;

  //mutations
  const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);

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
          // awaitRefetchQueries: true,
        });

        // for showing all aois
        stateApp.toggleLayersActivity("Area of Interest", true);
        setStateApp((state) => ({
          ...state,
          editDraw: false,
        }));
      }
    }
  };

  const handleEditSpatialDataToShape = (dataName, dataType = 'interest') => {
    // save data onto geoJSON properties fields

    const { selectedUserDefinedLayer } = stateApp;
    const spatialData = {
      sdType: dataType,
      shapeLabel: dataName,
      projectName: "",
      sdGrossAcres: "",
      // sdNotes: dataNotes
    };

    spatialDataAttributes.forEach((attribute) => {
      if (
        spatialData[attribute] != null ||
        typeof spatialData[attribute] !== "undefined"
      ) {
        selectedUserDefinedLayer.properties[attribute] = spatialData[attribute];
      }
    });
    selectedUserDefinedLayer.id = selectedUserDefinedLayer.properties.id;

    let update_layer = selectedUserDefinedLayer;

    let draw_id = selectedUserDefinedLayer.id;
    if (!draw_id.includes("edit_polygon")) {
      draw_id = `edit_polygon_${draw_id}`;
    }

    let current_feature = stateApp.draw.get(draw_id);
    if (current_feature) {
      addCustomShapeProperties(current_feature, stateApp.draw);
      current_feature = stateApp.draw.get(draw_id);
      spatialDataAttributes.forEach((attribute) => {
        if (
          spatialData[attribute] != null ||
          typeof spatialData[attribute] !== "undefined"
        ) {
          current_feature.properties[attribute] = spatialData[attribute];
        }
      });
      current_feature.id = current_feature.properties.id;
      update_layer = current_feature;
    }

    // //////cleaning the selected title opinion and redirecting to title opinion page//
    if (stateApp.user.mongoId !== "") {
      const id = update_layer.properties.id;
      let update_layers = stateApp.editingUserDefinedLayers.filter((layer) => {
        const shape_properties = JSON.parse(layer.shape).properties;
        return shape_properties.id && shape_properties.id.includes(id);
      });
      if (update_layers.length === 0) {
        update_layers = stateApp.customLayers.filter((layer) => {
          return layer._id && layer._id.includes(id);
        });
        // handleCloseSpatialDataCard();
      } else {
        stateApp.draw.delete(`edit_polygon_${id}`);
        const updated_layers = stateApp.editingUserDefinedLayers.filter(
          (layer) => {
            const shape_properties = JSON.parse(layer.shape).properties;
            return !shape_properties.id || !shape_properties.id.includes(id);
          }
        );
        setStateApp({
          ...stateApp,
          selectedUserDefinedLayer: null,
          editingUserDefinedLayers: updated_layers,
        });
        // handleCloseSpatialDataCardEdit();
      }
      const customLayerId = update_layers[0]._id;

      const customLayerData = {
        shape: JSON.stringify(update_layer),
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
    }
  };

  const RedditTextField = (props) => {
    return <TextField InputProps={{ disableUnderline: true }} {...props} />;
  }

  return (
    <form
      className={`${classes.root}`}
      autoComplete="off"
    >
      <RedditTextField
        label="Area of Interest Name"
        placeholder="Area of Interest Name"
        className={classes.TextField}
        variant="filled"
        id="reddit-input"
        defaultValue={shapeLabel}
        autoFocus
        required
        helperText={showError ? "Name is required!" : ""}
        InputProps={{ className: classes.TextFieldInput }}
        InputLabelProps={{ className: classes.TextFieldLabel }}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            e.preventDefault();
            if (!stateApp.selectedUserDefinedLayer) {
              handleSaveSpatialDataToShape(e.target.value);
            } else {
              handleEditSpatialDataToShape(e.target.value);
            }
          }
        }}
      />
    </form>
  );
}
