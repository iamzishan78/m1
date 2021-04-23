import React, {
  useContext,
  useEffect,
  useState,
  Fragment,
  useRef,
} from "react";

import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

import { AppContext } from "AppContext";
import { NavigationContext } from "../../../Navigation/NavigationContext";
import { spatialDataAttributes } from "../DrawShapes/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    minWidth: "220px",
    bottom: "56px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(1, 17, 51, 1.0)",
    color: "#fff",
  },
  TextField: {
    display: "flex",
    margin: theme.spacing(1),
    minWidth: 265,
    color: "#fff !important",
    borderColor: "#fff",
    backgroundColor: "white",
  },
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
  const [dataName, setDataName] = useState(shapeLabel);
  const [showError, setShowError] = useState(false);
  const { upsertCustomLayer, user, toggleSpatialDataCard } = props;

  const handleSaveSpatialDataToShape = (dataType = "interest") => {
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
        awaitRefetchQueries: true,
      });

      stateApp.toggleLayersActivity("Area of Interest", true);
      setStateApp((state) => ({
        ...state,
        editDraw: false,
      }));
    }
  };

  return (
    <form
      className={`${classes.root}`}
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        handleSaveSpatialDataToShape();
      }}
    >
      <div className={classes.TextField}>
        <TextField
          fullWidth
          variant="outlined"
          label="Name"
          type="text"
          placeholder="Enter Name"
          value={dataName}
          autoComplete="disabled"
          onChange={(evt) => setDataName(evt.target.value)}
          helperText={showError ? "Name is required!" : ""}
          required
        />
      </div>
    </form>
  );
}
