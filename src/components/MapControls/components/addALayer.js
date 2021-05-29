import React, { useContext, useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { MapControlsContext } from "../MapControlsContext";
import { AppContext } from "../../../AppContext";
import MuiAlert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import Checkbox from "@material-ui/core/Checkbox";
import { Collapse } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { deepEqual, deepEqualObjects } from "../../Shared/functions";
import { UPDATEMANYLAYERSETTINGS } from "../../../graphQL/useMutationUpdateManyLayerSettings";
import { useMutation } from "@apollo/client";
import { DropzoneAreaBase } from "material-ui-dropzone";
import shp from "shpjs";
import geojsonMerge from '@mapbox/geojson-merge';
import { IconButton } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const random_rgb = () => {
  var o = Math.round,
    r = Math.random,
    s = 255;
  return "rgb(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ")";
};

const Alert = (props) => {
  return <MuiAlert elevation={5} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme) => ({
  subHeaderItem: {
    backgroundColor: "#011133 !important",
    minWidth: "350px",
  },
  list: {
    border: "2px solid #A9A9A9",
    padding: "0px",
    margin: "8px 0px",
    borderRadius: "8px",
  },
  nested: {
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
  },
  disabledLayerTitle: {
    "& span": { color: "rgb(127, 149, 199) !important" },
  },
  addLayerButton: {
    padding: "20px",
    marginBottom: "10px",
    border: "2px dashed #999",
    backgroundColor: "#f0f9ff",
    width: "100%",
    textTransform: "initial",
  },
  dropzoneClass: {
    "&:hover": { backgroundColor: "aliceblue" },
    "& .MuiDropzoneArea-text": {
      margin: "10px",
    },
    "& .MuiDropzoneArea-icon": { display: "none" },
    minHeight: "0",
    marginBottom: "15px",
    backgroundColor: "#e8edefe8",
  },
  url: {
    textDecoration: "underline",
    "&:hover": {
      color: "darkblue",
    },
  },
  uploaderText: { color: "#828282", fontSize: "1rem" },
}));

const StyledListItem2 = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    backgroundColor: theme.palette.common.white,
    color: "#263451",
    border: "2px solid #263451",
    borderRadius: "5px",
    // "&:hover": {
    //   background: "#4B618F",
    // },
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: "#263451",
    },
  },
}))(ListItem);

const StyledListItem = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    // "&:hover": {
    //   background: "#ccc",
    // },
    backgroundColor: theme.palette.common.white,
    borderBottom: "2px solid #ccc",
    padding: "0px",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: "dark gray",
    },
    "&:first-child": {
      borderTopLeftRadius: "5px",
      borderTopRightRadius: "5px",
    },
    "&:last-child": {
      borderBottomLeftRadius: "5px",
      borderBottomRightRadius: "5px",
      borderBottom: "0px",
    },
  },
}))(ListItem);

export default function AddLayer(props) {
  const [isOpen, setIsOpen] = useState(true);
  const classes = useStyles();

  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);
  const [openM1, setOpenM1] = React.useState(true);
  const [openUD, setOpenUD] = React.useState(true);
  const [currentLayers, setCurrentLayers] = React.useState(stateApp.layers);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);

  useEffect(() => {
    if (stateApp.layers) {
      setCurrentLayers(stateApp.layers);
    }
  }, [stateApp.layers]);

  const handleClose = () => {
    setIsOpen(false);
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      addLayer: false,
    }));
  };

  const windowClose = () => {
    setIsOpen(false);
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      addLayer: false,
    }));
  };

  const handleClickM1List = () => {
    setOpenM1(!openM1);
  };

  const handleClickUDList = () => {
    setOpenUD(!openUD);
  };

  const changeShowAble = (layer) => {
    const layerIndex = currentLayers.findIndex(
      (clayer) => clayer.identifier == layer.identifier
    );
    const cpLayer = {
      ...layer,
      layerSettings: {
        ...layer.layerSettings,
        showable: !layer.layerSettings.showable,
      },
    };

    const existCurrentLayers = [...currentLayers];
    existCurrentLayers[layerIndex] = cpLayer;
    setCurrentLayers(existCurrentLayers);
  };

  const handleApplyChange = () => {
    const layersToUpdate = [];
    for (let i = 0; i < currentLayers.length; i++) {
      if (!deepEqualObjects(currentLayers[i], stateApp.layers[i]))
        layersToUpdate.push({
          _id: currentLayers[i]._id,
          layerSettings: currentLayers[i].layerSettings,
        });
    }

    //// saving to stateApp
    setStateApp({
      ...stateApp,
      layers: [...currentLayers],
    });

    //// saving to mongo
    if (layersToUpdate.length > 0)
      updateManyUserLayerSettings({
        variables: {
          manySettings: layersToUpdate,
        },
      });

    handleClose();
  };

  const handleAddLayer = () => {
    setStateMapControls({
      ...stateMapControls,
      selectedControl: "add",
    });
  };

  async function handleFileAsync(file) {
    let inputFile = null;
    let fileName = null;
    if (Array.isArray(file)) {
      inputFile = file[0].data;
      fileName = file[0].file.name;
    } else {
      inputFile = file;
      fileName = file.split("?")[0].split("/");
      fileName = fileName[fileName.length - 1];
    }
    let res;
    if (fileName.endsWith(".geojson")) {
      res = await new Promise((resolve, reject) => {
        fetch(inputFile)
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => reject(error));
      });
    } else if (fileName.endsWith(".zip")) {
      res = await new Promise((resolve, reject) => {
        fetch(inputFile).then((response) => {
          response.arrayBuffer().then((buffer) => {
            shp(buffer).then((geojson) => {
              resolve(Array.isArray(geojson) ? geojsonMerge.merge(geojson) : geojson);
            });
          });
        });
      });
    }
    return res;
  }

  async function handleFileInput(fileObj) {
    setStateApp((stateApp) => ({
      ...stateApp,
      universalCircularLoaderAct: true,
    }));
    let fileContent = await handleFileAsync(fileObj);
    const featureTypes = []
    fileContent.features.forEach((feature) => {
      if (!feature.properties) {
        feature.properties = {}
      }
      feature.properties = { ...feature.properties, layerGeometry: feature.geometry.type }
      if (!featureTypes.includes(feature.geometry.type)) {
        featureTypes.push(feature.geometry.type)
      }
    })
    fileContent.featureTypes = featureTypes
    setStateApp((stateApp) => ({
      ...stateApp,
      universalCircularLoaderAct: false,
    }));


    setStateMapControls({
      ...stateMapControls,
      selectedControl: featureTypes.length > 0 ? "addGroup" : "add",
      fileUploadedContent: fileContent,
    });
  }

  const M1Layers = currentLayers.filter(
    (layer) => layer.layerCategory == "M1 Layer"
  );
  const UdLayers = currentLayers.filter(
    (layer) => layer.layerCategory == "UD layer"
  );
  return (
    <>
      <Dialog open={isOpen} onClose={windowClose}>
        <DialogTitle>Layer Management</DialogTitle>
        <DialogContent dividers>
          <DialogContentText color="dark gray">
            Select one or more of the available layers below to add them to your
            current map view.
          </DialogContentText>

          <DropzoneAreaBase
            onAdd={handleFileInput}
            onDelete={(fileObj) => ("Removed File:", fileObj)}
            onAlert={(message, variant) => {
            }}
            filesLimit={1}
            dropzoneText={
              <span className={classes.uploaderText}>
                To add a new user-defined layer, drag and drop a GeoJSON or
                Shapefile or click to select file.

                {/* //hiding for now as this functionality does not work currently
                {" "}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddLayer();
                  }}
                  className={classes.url}
                >
                  here
                </span>{" "}
                to enter an URL. */}
              </span>
            }
            // acceptedFiles={[".geojson", ".zip", ".shp",]}
            maxFileSize={10000000}
            dropzoneClass={classes.dropzoneClass}
          >

          </DropzoneAreaBase>
          <StyledListItem2 button onClick={handleClickM1List}>
            <ListItemText primary="M1neral Layers" />
            {openM1 ? <ExpandLess /> : <ExpandMore />}
          </StyledListItem2>
          <Collapse in={openM1} timeout="auto" unmountOnExit>
            <List className={classes.list}>
              {M1Layers.map((layer, index) => {
                const labelId = `m1layer-list-label-${index}`;
                return (
                  <StyledListItem key={index} ContainerComponent="li">
                    <Checkbox
                      checked={layer.layerSettings.showable}
                      color="dark gray"
                      onChange={() => changeShowAble(layer)}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                    <ListItemText id={labelId} primary={layer.layerName} />
                  </StyledListItem>
                );
              })}
            </List>
          </Collapse>
          <StyledListItem2 button onClick={handleClickUDList}>
            <ListItemText primary="User Defined Layers" />
            {openUD ? <ExpandLess /> : <ExpandMore />}
          </StyledListItem2>
          <Collapse in={openUD} timeout="auto" unmountOnExit>
            <List className={classes.list}>
              {UdLayers.map((layer, index) => {
                const labelId = `udlayer-list-label-${index}`;

                //// remove the (layer.identifier!="Tracked Owners") if statement to show the tracked owers layer
                if (layer.identifier != "Tracked Owners") {
                  return (
                    <StyledListItem key={index} ContainerComponent="li">
                      <Checkbox
                        checked={layer.layerSettings.showable}
                        color="dark gray"
                        onChange={() => changeShowAble(layer)}
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                      <ListItemText id={labelId} primary={layer.layerName} />

                      {layer.layerType == "file layer" && (
                        <ListItemSecondaryAction>
                          <Tooltip title="Delete" placement="top">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => {
                                setOpenDeleteDialog(layer);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      )}
                    </StyledListItem>
                  );
                }
              })}
            </List>
          </Collapse>
        </DialogContent>
        <DialogActions>
          <Button onClick={windowClose} color="primary">
            Close
          </Button>
          <Button
            disabled={deepEqual(currentLayers, stateApp.layers)}
            onClick={handleApplyChange}
            autoFocus
            color="primary"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
      {/* //// delete confirmation dialog */}
      {openDeleteDialog && (
        <Dialog
          className={classes.dialog}
          open={openDeleteDialog ? true : false}
          onClose={() => {
            setOpenDeleteDialog(false);
          }}
          fullWidth={true}
          maxWidth={"sm"}
        >
          <DeleteConfirmationDialog
            openDialog={openDeleteDialog ? true : false}
            handleDialogClose={setOpenDeleteDialog}
            layer={openDeleteDialog}
          />
        </Dialog>
      )}
    </>
  );
}
