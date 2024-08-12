import React, { useContext, useState, useEffect, Fragment, useCallback, useMemo, memo } from "react";
import update from "immutability-helper";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { AppContext } from "AppContext";
import { Typography, Divider, MenuItem, Popper, ClickAwayListener, MenuList, Paper, Grow } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import { Collapse } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { copy, deepEqual, deepEqualObjects } from "components/Shared/functions";
import { UPDATEMANYLAYERSETTINGS } from "graphQL/useMutationUpdateManyLayerSettings";
import { useMutation } from "@apollo/client";
import { DropzoneAreaBase } from "material-ui-dropzone";
import geojsonMerge from "@mapbox/geojson-merge";
import { IconButton } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from '@material-ui/icons/Edit';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteSourceAndCategoryConfirmationDialog from "./DeleteSourceAndCategoryConfirmationDialog";
import Box from "@material-ui/core/Box";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import UploadIcon from "components/Shared/svgIcons/uploadIcon";
import EditableTextField from "components/Shared/components/Fields/EditableTextField";
import { truncate } from "components/Shared/functions";
import Button from "@material-ui/core/Button";
import * as turf from '@turf/turf';


// cra webpack hack to call this a png to get included in bundle
import { UPDATE_MANY_LAYER } from "graphQL/useMutationUpdateManyLayer";
import { useHistory } from "react-router-dom";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { UPDATE_USER_MAP_SETTINGS } from "graphQL/useMutationUserMapSettings";
import { UPDATE_DATASET } from "graphQL/useMutationDataset";

import { showErrorMessage, showInfoMessage } from "actions";
import { useDispatch } from "react-redux";
import { Close as ClearButton } from "@material-ui/icons";
import JSZip from 'jszip';
import { globalStateController } from "hookstate/globalStateController";
import { mapControlsController } from "hookstate/mapControlsController";
import { layerController } from "hookstate/layerStateController";

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
  dropzoneClass: {
    "& .MuiDropzoneArea-text": {
      marginTop: 0,
      marginBottom: 0
    },
    "& .MuiDropzoneArea-icon": {
      display: "none",
    },
    minHeight: "0",
    marginBottom: "0px",
    border: "none",
  },
  url: {
    textDecoration: "underline",
    "&:hover": {
      color: "darkblue",
    },
  },
  uploaderText: {
    color: "#828282",
    fontSize: "1rem",
    backgroundColor: "#e8edefe8",
    border: "2px dashed #999",
    padding: "10px",
    borderRadius: "5px",
  },
  multiSelectionTopBarButtons: {
    margin: "0px 5px",
    padding: "0px 5px",
    // fontWeight: "600",
    // backgroundColor: "rgba(1, 17, 51, 1)",
    // color: "#fff",
    border: "1px solid #B3B3B3",
    // "&:hover": {
    //   backgroundColor: "#263451",
    //   color: "#fff",
    // },
  },
  contentRoot: {
    padding: "15px",
    height: "calc(100% - 111px)",
    position: "absolute",
    overflow: "overlay",
  },
  footer: {
    position: "absolute",
    right: "0px",
    bottom: "0px",
    padding: "15px",
  },
  selectedType: {
    borderBottom: "4px solid #01B0F0",
    display: "inline",
    cursor: "pointer",
  },
  unSelectedType: {
    display: "inline",
    color: "#827F7F",
    cursor: "pointer",
  },
  moreIcon: {
    color: "#0000008a",
    marginRight: '15px',
    visibility: "hidden"
  },
  moreSourceIcon: {
    color: "#0000008a",
    marginRight: '15px',
    visibility: "hidden"
  }
}));

const StyledListItem2 = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    backgroundColor: theme.palette.common.white,
    color: "#827F7F",
    border: "2px solid #827F7F",
    borderRadius: "5px",
    marginTop: "15px",
    marginBottom: "5px",
    padding: "4px 0px 4px 0",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: "#827F7F"
    },

    "&:hover, &.isOpen": {
      backgroundColor: "#00000014",
      color: "#263451",
      border: "2px solid #263451",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "#263451",
      }
    },
    "&:hover": {
      "& .moreSourceIcon": {
        visibility: "visible"
      }
    }
  },
}))(ListItem);

const StyledListItem = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
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

    "&:hover": {
      "& .moreIcon": {
        visibility: "visible"
      }
    }
  },
}))(ListItem);

// Hook
function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    [ref, handler]
  );
}

const SourceManagerMemo = memo(SourceManager);
export default function SourceManagerContainer(props) {
  const [stateApp, setStateApp] = useContext(AppContext);

  const setStateAppCallback = useCallback(setStateApp, [])
  const stateAppMemo = useMemo(() => ({ layers: stateApp.layers, user: stateApp.user }), [stateApp.user, stateApp.layers])

  return <SourceManagerMemo {...props} stateApp={stateAppMemo} setStateApp={setStateAppCallback} />
}

function SourceManager(props) {
  const classes = useStyles();
  let history = useHistory();

  const dispatch = useDispatch();

  const { stateApp, setStateApp } = props;
  const { layers, globalStateValues } = globalStateController.useState(['layers', 'datasets'], 'globalStateValues')
  const [openM1, setOpenM1] = React.useState(true);
  const [isOpenUserSources, setIsOpenUserSources] = React.useState(true);
  const [openDataSets, setOpenDataSets] = React.useState({});
  const [currentLayers, setCurrentLayers] = React.useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUDLayers, setUDLayersStates] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [actionItem, setActionItem] = React.useState(null);

  const [updateManyLayer] = useMutation(UPDATE_MANY_LAYER);
  const [updateDataset] = useMutation(UPDATE_DATASET, { refetchQueries: ["getDatasets"], awaitRefetchQueries: true });
  const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);
  const [updateUserMapSettings] = useMutation(UPDATE_USER_MAP_SETTINGS, { refetchQueries: ["getUserMapSettings", 'getDatasets'], awaitRefetchQueries: true });

  const updateStateLayers = (currentLayers) => {
    stateApp.layers = currentLayers;
    globalStateController.updateState({ layers: currentLayers });
  }

  useEffect(() => {
    if (!deepEqual(currentLayers, globalStateValues.layers)) {
      setCurrentLayers(copy(globalStateValues.layers));
    }
  }, [currentLayers, layers]);

  const M1Layers = React.useMemo(() => {
    const layers = currentLayers?.filter((layer) => layer.layerCategory === "M1 Layer" || ['Parcels', 'Agreements', 'Units', 'Area of Interest'].includes(layer.groupName || layer.layerName));
    const groupHandled = [];
    for (let index = 0; index < layers.length; index++) {
      const UdLayer = layers[index];
      if (UdLayer.groupId && !groupHandled.includes(UdLayer.groupId)) {
        groupHandled.push(UdLayer.groupId);
        const groupLayers = layers?.filter((ul) => ul.groupId === UdLayer.groupId);
        layers.splice(index, 0, { type: "group", collapsed: true, name: UdLayer.groupName, id: UdLayer.groupId, layers: groupLayers });
        index = 0;
      }
    }
    return layers?.filter((UdLayer) => !((UdLayer.layerCategory === "M1 Layer" || UdLayer.groupName === "Agreements") && UdLayer.groupId));
  }, [currentLayers]);

  const selectAllMineralSources = React.useMemo(() => {
    let check = true;

    if (M1Layers.length) {
      for (let index = 0; index < M1Layers.length; index++) {
        if (M1Layers[index].type === "group") {
          if (M1Layers[index].layers.find((layer) => layer.layerSettings.showable === false)) check = false
        } else if (M1Layers[index].layerSettings.showable === false) {
          check = false
        }
      }
    }
    return check;
  }, [currentLayers]);

  const handleCurrentLayersChange = () => {
    setCurrentLayers((currentLayers) => { handleApplyChange(currentLayers); return currentLayers; })
  };

  const handleApplyChange = (currentLayers) => {
    if (!deepEqual(currentLayers, globalStateValues.layers)) {
      const layersToUpdate = [];
      const layersSettingsToUpdate = [];
      for (let i = 0; i < currentLayers.length; i++) {
        if (!deepEqualObjects(currentLayers[i], globalStateValues.layers[i])) {
          layersSettingsToUpdate.push({
            _id: currentLayers[i]._id,
            layerSettings: currentLayers[i].layerSettings,
          });
          layersToUpdate.push({
            _id: currentLayers[i].layerId,
            layerName: currentLayers[i].layerName,
            groupName: currentLayers[i].groupName,
          });
        }
      }

      // //// saving to stateApp
      updateStateLayers([...currentLayers])

      //// saving to mongo
      if (layersToUpdate.length > 0) {
        updateManyLayer({
          variables: {
            layers: layersToUpdate,
          },
        });

        updateManyUserLayerSettings({
          variables: {
            manySettings: layersSettingsToUpdate,
          },
        });
      }
    }
  };

  // Common function added to change Layer showable key
  const handleLayerSettingChange = (layers, changeValue) => {
    const updatefn = {};
    const isReplace = typeof changeValue !== 'undefined'

    layers.forEach((layer) => {
      if (layer.type === "group") {
        const value = isReplace ? changeValue : !layer.layers.find((l) => l.layerSettings.showable);
        layer.layers.forEach((l) => {
          const layerIndex = currentLayers.findIndex((clayer) => clayer.identifier === l.identifier);
          updatefn[layerIndex] = { layerSettings: { showable: { $set: value } } };
          layerController.handleDeckLayer({ ...l, layerSettings: { ...l.layerSettings, showable: value } })
        });
      } else {
        const value = isReplace ? changeValue : !layer.layerSettings.showable;
        const layerIndex = currentLayers.findIndex((clayer) => clayer.identifier === layer.identifier);
        updatefn[layerIndex] = { layerSettings: { showable: { $set: value } } };
        layerController.handleDeckLayer({ ...layer, layerSettings: { ...layer.layerSettings, showable: value } })
      }
    })

    setCurrentLayers(update(currentLayers, updatefn));
    handleCurrentLayersChange()
  }

  // Common function added for User layer which uses handleLayerSettingChange internally
  const changeUserSources = (sources, value) => {
    const settings = {}
    const fileIds = sources.map((source, index) => {
      const datasetIndex = globalStateValues.datasets.findIndex(d => d._id === source._id);
      source.visibility = value
      globalStateValues.datasets[datasetIndex] = source

      settings[sources[index]._id] = value
      return source.file
    }).filter((fileId) => fileId)
    const layers = currentLayers.filter((layer) => fileIds.includes(layer.file))
    handleLayerSettingChange(layers, value)

    updateUserMapSettings({
      variables: {
        settings: {
          user: stateApp.user.mongoId,
          type: 'DatasetVisibility',
          settings,
        },
      },
    });

  }

  const changeLayerName = (layer, name) => {
    const updatefn = {};
    if (layer.type === "group") {
      layer.layers.forEach((l) => {
        const layerIndex = currentLayers.findIndex((clayer) => clayer.identifier === l.identifier);
        updatefn[layerIndex] = { groupName: { $set: name } };
      });
    } else {
      const layerIndex = currentLayers.findIndex((clayer) => clayer.identifier === layer.identifier);
      updatefn[layerIndex] = { layerName: { $set: name } };
    }

    setCurrentLayers(update(currentLayers, updatefn));
  };

  const parseGeoForTypesAndNames = (geo, name) => {
    const layerTypes = [];
    const fileNames = [];
    // Define the source and target projections
    geo.features.forEach((feature, index) => {
      feature.id = index + 1
      if (!feature.properties) {
        feature.properties = {};
      }

      const layerType = feature.geometry.type === 'MultiPolygon' ? 'Polygon' : feature.geometry.type;

      const layerShapeName = `${geo.fileName || name} - ${layerType}`
      feature.properties = { ...feature.properties, layerGeometry: layerType, layerShapeName };
      if (!layerTypes.includes(layerType)) {
        layerTypes.push(layerType);
      }
    });

    layerTypes.forEach((layerType) => {
      fileNames.push(`${geo.fileName || geo.name || name} - ${layerType}`);
    });

    // Create a MultiPoint geometry from the FeatureCollection's coordinates
    const allCoordinates = turf.explode(geo).features.map(feature => feature.geometry.coordinates);
    const multiPoint = turf.multiPoint(allCoordinates);

    // Calculate the bounding box
    const bbox = turf.bbox(multiPoint);

    return { layerTypes, fileNames, bbox };
  };

  const singleGeojson = (geojson, groupName) => {
    const { layerTypes, fileNames, bbox } = parseGeoForTypesAndNames(geojson, groupName);
    geojson.fileNames = fileNames;
    geojson.featureTypes = layerTypes;
    geojson.groupName = groupName;
    geojson.bboxes = [bbox];
    return geojson;
  };

  async function handleFileAsync(file) {
    try {
      let inputFile = null;
      let fileData = null;
      let fileName = null;
      let fileType = null;
      if (Array.isArray(file)) {
        inputFile = file[0].data;
        fileData = file[0].file;
        fileName = file[0].file.name;
        fileType = file[0].file.type;
      } else {
        inputFile = file;
        fileName = file.split("?")[0].split("/");
        fileName = fileName[fileName.length - 1];
      }
      let res;
      fileName = fileName.toLowerCase();
      if (fileName.endsWith(".geojson") || fileName.endsWith(".json")) {
        res = await new Promise((resolve, reject) => {
          fetch(inputFile)
            .then((response) => {
              return response.json();
            })
            .then((response) => {
              resolve({
                data: singleGeojson(response, fileName.replace(".geojson", "").replace(".json", "")),
                originalData: { file: fileData, fileName, fileType },
              });
            })
            .catch((error) => reject(error));
        });
      } else if (fileName.endsWith(".zip")) {
        res = await new Promise((resolve, reject) => {
          fetch(inputFile).then(async (response) => {
            const zip = await JSZip.loadAsync(response.arrayBuffer());

            // Iterate through each file in the zip
            const zipFiles = {}
            zip.forEach(async (relativePath, zipEntry) => {
              if (!zipEntry.dir && !relativePath.includes('xml') && !relativePath.includes('pdf') && !relativePath.includes('__MACOSX')) {
                const name = relativePath.split('.').slice(0, -1).join('.')
                if (!zipFiles[name]) zipFiles[name] = []
                zipFiles[name].push(zipEntry)
              }
            });
            const geojsons = []
            const zipKeys = Object.keys(zipFiles)

            for (let i = 0; i < zipKeys.length; i++) {
              const zipKey = zipKeys[i]
              const newZip = new JSZip();
              zipFiles[zipKey].forEach((file) => {
                newZip.file(file.name, file.async('arraybuffer'));
              })
              const newZipContent = await newZip.generateAsync({ type: 'blob' });

              var formdata = new FormData();
              formdata.append("upload", newZipContent, zipKey + '.zip');
              formdata.append("rfc7946", "on");

              var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
              };
              // eslint-disable-next-line no-loop-func
              res = await new Promise((resolve) => {
                fetch("https://ogre.adc4gis.com/convert", requestOptions)
                  .then(response => response.json())
                  .then(result => {
                    const name = fileName.replace(".zip", "");
                    geojsons.push(result)
                    resolve({ data: singleGeojson(result, name), originalData: { file: fileData, fileName, fileType } });
                  })
                  .catch(error => console.log('error', error));
              });
            }

            let allFileNames = [];
            let allLayerTypes = [];
            const allLayerBboxs = [];
            geojsons.forEach((geo) => {
              const { layerTypes, fileNames, bbox } = parseGeoForTypesAndNames(geo, geo.name);
              allLayerTypes = allLayerTypes.concat(layerTypes);
              allFileNames = allFileNames.concat(fileNames);
              allLayerBboxs.push(bbox);
            });
            const merged = geojsonMerge.merge(geojsons);
            merged.features.forEach((feature, index) => {
              feature.id = index + 1
            })
            merged.fileNames = allFileNames;
            merged.featureTypes = allLayerTypes;
            merged.bboxes = allLayerBboxs;
            merged.groupName = fileName.replace(".zip", "");
            resolve({ data: merged, originalData: { file: fileData, fileName, fileType } });
          });
        });
      }
      return res;
    } catch (err) {
      console.log("🚀 ~ handleFileAsync ~ err:", err)
      return {
        error: true,
        message: err.message
      }
    }
  }

  async function handleFileInput(fileObj) {
    setStateApp((stateApp) => ({
      ...stateApp,
      universalCircularLoaderAct: {
        localLoader: true,
        text: 'This may take some time depending on the file size'
      },
    }));
    let originalData;
    let fileContent = await handleFileAsync(fileObj);
    if (fileContent.error) {
      dispatch(showErrorMessage("Failed to parse the file"))
    }
    if (fileContent?.originalData) {
      originalData = fileContent.originalData;
      fileContent = fileContent.data;
    }
    setStateApp((stateApp) => ({
      ...stateApp,
      universalCircularLoaderAct: false,
    }));

    if (fileContent?.featureTypes)
      mapControlsController.updateState({
        layerAddControl: "addGroup",
        fileUploadedContent: fileContent,
        fileUploadedOriginalContent: originalData,
      })
  }

  const checkIfDeleteAllow = (layer) => {
    if (layer.name === 'Agreements' || layer.groupName === 'Agreements')
      return false;
    return true
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (e) => {
    setAnchorEl(null);
  };

  useOnClickOutside({ current: anchorEl }, handleMenuClose);

  const datasetNameChange = (item, name) => {
    const isSource = !actionItem?.category
    if (isSource) {
      actionItem.dataset.sourceName = name
    } else {
      const category = actionItem.dataset.categories.find((category) => category.name === actionItem.category.name)
      category.name = name
      category.layerName = name
    }
    const index = globalStateValues.datasets.findIndex((dataset) => dataset._id === actionItem.dataset._id)
    globalStateValues.datasets[index] = actionItem.dataset

    updateDataset({ variables: { dataset: actionItem.dataset } })
  }

  const openEditField = (name) => {
    const isSource = !actionItem?.category
    if (isSource) {
      return actionItem?.type === 'editName' && actionItem?.dataset?.sourceName === name
    } else {
      return actionItem?.type === 'editName' && (actionItem?.category?.layerName === name || actionItem?.category?.name === name)
    }
  }

  return (
    <div id="sourceManagerDiv" style={{ height: "100%", display: "flex", width: "100%" }}>
      <DropzoneAreaBase onAdd={handleFileInput}
        onDelete={(fileObj) => { }}
        onAlert={(message, variant) => { }}
        filesLimit={1}
        maxFileSize={104857600}
        dropzoneClass={classes.dropzoneClass}
        // acceptedFiles={[".geojson", ".zip", ".shp",]}
        dropzoneText={
          <>
            <div>
              <div className={classes.contentRoot}>
                <Typography varient="h5" style={{ textAlign: "start", paddingBottom: "20px", fontWeight: "bolder", fontFamily: 'sans-serif' }} onClick={(e) => e.stopPropagation()}>
                  Add New Sources
                </Typography>
                <div className={classes.uploaderText}>
                  <span>
                    To add a new user-defined shape layer, drag and drop a GeoJSON or Shapefile anywhere on this screen or click here to select file from your local drive
                  </span>
                </div>
                <Divider style={{ height: '2px', marginTop: "15px" }} />
                <Typography varient="h5" style={{ textAlign: "start", marginTop: "5px", fontWeight: "bolder", fontFamily: 'sans-serif' }} onClick={(e) => e.stopPropagation()}>
                  Add Sources to Map View
                </Typography>
                <Typography varient="h6" style={{ textAlign: "start", marginBottom: "10px" }} onClick={(e) => e.stopPropagation()}>
                  Select one or more of the available sources below to add them to your current map view
                </Typography>
                <div onClick={(e) => e.stopPropagation()}>
                  <StyledListItem2 button onClick={() => setOpenM1(!openM1)} className={openM1 ? 'isOpen' : ''}>
                    <Checkbox
                      checked={selectAllMineralSources}
                      color="darkgray"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => { handleLayerSettingChange(M1Layers, !selectAllMineralSources) }}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                    <ListItemText primary="M1neral Platform Sources" />
                    {openM1 ? <ExpandLess /> : <ExpandMore />}
                  </StyledListItem2>
                  <Collapse in={openM1} timeout="auto" unmountOnExit>
                    <List className={classes.list}>
                      {M1Layers?.filter(
                        (layer) => {
                          return (!props.search || layer.name?.toLowerCase().includes(props.search) || layer.layerName?.toLowerCase().includes(props.search)) &&
                            !['Land Grid', 'TX GLO Units', 'TX GLO Active Leases', 'Rig Activity'].includes(layer.layerName);
                        }
                      )?.map((layer, index) => {
                        const labelId = `m1layer-list-label-${index}`;

                        if (layer.type === "group") {
                          return (
                            <Accordion>
                              <AccordionSummary
                                // expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                style={{ paddingLeft: 0, marginTop: 0, marginBottom: 0 }}
                                onClick={() => {
                                  const _index = openUDLayers.findIndex(l => l === index);
                                  if (_index === -1) setUDLayersStates([...openUDLayers, index]);
                                  else setUDLayersStates(openUDLayers?.filter(l => l !== index));
                                }}
                              >
                                <Checkbox
                                  checked={!!layer.layers.find((l) => l.layerSettings?.showable)}
                                  color="dark gray"
                                  onClick={(event) => event.stopPropagation()}
                                  onChange={(e) => handleLayerSettingChange([layer])}
                                  inputProps={{ "aria-label": "primary checkbox" }}
                                />
                                <EditableTextField
                                  onChange={changeLayerName}
                                  item={layer}
                                  name={layer.name}
                                  isEditable={checkIfDeleteAllow(layer)}
                                  showExpandIcon
                                  openUd={openUDLayers.includes(index)}
                                />
                                {checkIfDeleteAllow(layer) && (
                                  <ListItemSecondaryAction onClick={(e) => e.stopPropagation()}>
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
                              </AccordionSummary>
                              <Box paddingLeft={2} paddingRight={2}>
                                <List className={classes.list}>
                                  {layer.layers?.map((groupLayer, index) => (
                                    <StyledListItem key={index} ContainerComponent="li">
                                      <Checkbox
                                        checked={groupLayer?.layerSettings?.showable}
                                        color="dark gray"
                                        onChange={() => handleLayerSettingChange([groupLayer])}
                                        inputProps={{ "aria-label": "primary checkbox" }}
                                      />
                                      <EditableTextField onChange={changeLayerName} item={groupLayer} name={groupLayer.layerName} isEditable={checkIfDeleteAllow(layer)} />
                                      <ListItemSecondaryAction>
                                        {
                                          checkIfDeleteAllow(layer) &&
                                          <Tooltip title="Delete" placement="top">
                                            <IconButton
                                              edge="end"
                                              size="small"
                                              onClick={() => {
                                                setOpenDeleteDialog(groupLayer);
                                              }}
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </Tooltip>
                                        }
                                      </ListItemSecondaryAction>
                                    </StyledListItem>
                                  ))}
                                </List>
                              </Box>
                            </Accordion>
                          );
                        }

                        return (
                          <StyledListItem key={index} ContainerComponent="li">
                            <Checkbox
                              checked={layer.layerSettings.showable}
                              color="dark gray"
                              onChange={() => handleLayerSettingChange([layer])}
                              inputProps={{ "aria-label": "primary checkbox" }}
                            />

                            {/* Override layer source names of Parcel and Wells */}
                            <ListItemText id={labelId} primary={layer.layerName === "Parcels" ? "Tracts" : layer.layerName === 'Wells' ? 'Platform Wells' : truncate(layer.layerName, 30)} />

                            {
                              (layer.layerName === 'Units') &&
                              <FeatureFlag feature={FEATURES.UNITIMPORT} >
                                <ListItemSecondaryAction>
                                  <IconButton edge="end" size="small" onClick={() => { history.push(`/bulkupload/units`); }}>
                                    <UploadIcon opacity="1.0" small />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </FeatureFlag>
                            }

                            {
                              (layer.layerName === 'Parcels') &&
                              <FeatureFlag feature={FEATURES.TRACTIMPORT} >
                                <ListItemSecondaryAction>
                                  <IconButton edge="end" size="small" onClick={() => { history.push(`/bulkupload/tracts`); }}>
                                    <UploadIcon opacity="1.0" small />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </FeatureFlag>
                            }
                          </StyledListItem>
                        );
                      })}
                    </List>
                  </Collapse>


                  <StyledListItem2 button onClick={() => setIsOpenUserSources(!isOpenUserSources)} className={isOpenUserSources ? 'isOpen' : ''}>

                    <ListItemText style={{ paddingLeft: '20px' }} primary="User Uploaded Sources" />
                    <Button
                      color="secondary"
                      startIcon={<ClearButton />}
                      className={classes.multiSelectionTopBarButtons}
                      onClick={(event) => {
                        event.stopPropagation();
                        changeUserSources(globalStateValues.datasets, false)
                      }}
                    >
                      CLEAR ALL
                    </Button>

                    {isOpenUserSources ? <ExpandLess /> : <ExpandMore />}
                  </StyledListItem2>
                  <Collapse in={isOpenUserSources} timeout="auto" unmountOnExit>
                    {globalStateValues.datasets?.filter(
                      (layer) => {
                        return !props.search || layer.name?.toLowerCase().includes(props.search)
                      }
                    )?.map((dataset, index) => (
                      <Fragment key={index}>
                        {
                          dataset.sourceName !== 'M1 Platform' ? <> <StyledListItem2 data-testid={`source-${dataset.sourceName}`} className={openDataSets[dataset.sourceName] ? 'isOpen' : ''} style={{ paddingLeft: '0px' }} button onClick={() => setOpenDataSets({ ...openDataSets, [dataset.sourceName]: !openDataSets[dataset.sourceName] })}>
                            <Checkbox
                              id={"source-checkbox-" + dataset.sourceName}
                              checked={dataset.visibility}
                              color="darkgray"
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => { changeUserSources([dataset], !dataset.visibility); }}
                              inputProps={{ "aria-label": "primary checkbox" }}
                            />
                            <EditableTextField onChange={datasetNameChange} item={dataset} name={dataset.sourceName} isEditable={true} openEditField={openEditField(dataset.sourceName)} />
                            {/* <ListItemText primary={dataset.sourceName} /> */}
                            <MoreHorizIcon id={"more-horiz-" + dataset.sourceName} aria-controls={"source-menu"} className={"moreSourceIcon " + classes.moreSourceIcon} onClick={(e) => { e.stopPropagation(); handleClick(e); setActionItem({ dataset }) }} />
                            {openDataSets[dataset.sourceName] ? <ExpandLess /> : <ExpandMore />}
                          </StyledListItem2>
                            <Collapse in={openDataSets[dataset.sourceName]} timeout="auto" unmountOnExit>
                              <List className={classes.list} data-testid={`source-ul-${dataset.sourceName}`}>
                                {dataset.categories?.map((layer, index) => {
                                  // const labelId = `m1layer-list-label-${index}`;
                                  return (
                                    <StyledListItem key={index} ContainerComponent="li" style={{ padding: 10 }}>
                                      <EditableTextField onChange={datasetNameChange} item={layer} name={layer.layerName || layer.name} isEditable={true} openEditField={openEditField(layer.layerName || layer.name)} />

                                      {/* <ListItemText style={{ padding: '5px 0px 5px 40px' }} id={labelId} primary={truncate(layer.layerName || layer.name, 30)} /> */}
                                      <MoreHorizIcon aria-controls={"more-source-menu"} className={"moreIcon " + classes.moreIcon} onClick={(e) => { handleClick(e); setActionItem({ dataset, category: layer }) }} />
                                    </StyledListItem>
                                  );
                                })}
                              </List>
                            </Collapse></> : <></>
                        }

                      </Fragment>
                    ))
                    }
                  </Collapse>
                </div>
              </div>
            </div>
          </>
        }
      />

      {/* //// delete confirmation dialog */}


      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} role={undefined} transition disablePortal >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper style={{ zIndex: 10 }}>
              <ClickAwayListener onClickAway={handleMenuClose}>
                <MenuList autoFocusItem={Boolean(anchorEl)} id="menu-list-grow">
                  <MenuItem onClick={(e) => { e.stopPropagation(); setActionItem((actionItem) => ({ ...actionItem, type: 'editName' })); handleMenuClose() }}><EditIcon /> Edit Name</MenuItem>
                  <MenuItem id="deleteSource" onClick={(e) => { e.stopPropagation(); setOpenDeleteDialog(actionItem); handleMenuClose() }}><DeleteIcon /> Delete</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

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
          <DeleteSourceAndCategoryConfirmationDialog
            openDialog={openDeleteDialog ? true : false}
            handleDialogClose={setOpenDeleteDialog}
            actionItem={openDeleteDialog}
          />
        </Dialog>
      )}
    </div>
  );
}
