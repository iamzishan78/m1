import React, { useContext, useState, useEffect, Fragment, useCallback, useMemo, memo } from "react";
import update from "immutability-helper";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { MapControlsContext } from "../../MapControlsContext";
import { AppContext } from "AppContext";
import { Typography, Divider, MenuItem, Menu, Popper, ClickAwayListener, MenuList, Paper, Grow } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import { Collapse } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { deepEqual, deepEqualObjects } from "components/Shared/functions";
import { UPDATEMANYLAYERSETTINGS } from "graphQL/useMutationUpdateManyLayerSettings";
import { useMutation } from "@apollo/client";
import { DropzoneAreaBase } from "material-ui-dropzone";
import shp from "shpjs";
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
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';
import { truncate } from "components/Shared/functions";

import proj4 from "proj4";
// cra webpack hack to call this a png to get included in bundle
import conus from "components/Shared/constants/nadgrids/conus.png";
import { UPDATE_MANY_LAYER } from "graphQL/useMutationUpdateManyLayer";
import { useHistory } from "react-router-dom";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { UPDATE_USER_MAP_SETTINGS } from "graphQL/useMutationUserMapSettings";
import { UPDATE_DATASET } from "graphQL/useMutationDataset";

const GCS_North_American_1927 =
  'GEOGCS["GCS_North_American_1927",DATUM["D_North_American_1927",SPHEROID["Clarke_1866",6378206.4,294.9786982]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]';
proj4.defs("EPSG:4267", "+proj=longlat +ellps=clrk66 +datum=NAD27 +nadgrids=@conus,null +no_defs");
proj4.defs(GCS_North_American_1927, proj4.defs("EPSG:4267"));

const GCS_North_American_1927_ALT1 =
  'GEOGCS["GCS_North_American_1927",DATUM["D_North_American_1927",SPHEROID["Clarke_1866",6378206.4,294.9786982]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]';
proj4.defs(GCS_North_American_1927_ALT1, proj4.defs("EPSG:4267"));

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
  const stateAppMemo = useMemo(() => ({ layers: stateApp.layers, user: stateApp.user, datasets: stateApp.datasets }), [stateApp.user, stateApp.datasets, stateApp.layers])

  return <SourceManagerMemo {...props} stateApp={stateAppMemo} setStateApp={setStateAppCallback} />
}

function SourceManager(props) {
  const classes = useStyles();
  let history = useHistory();

  const [stateMapControls, setStateMapControls] = useContext(MapControlsContext);
  const { stateApp, setStateApp } = props;
  const [openM1, setOpenM1] = React.useState(true);
  const [openDataSets, setOpenDataSets] = React.useState({});
  const [currentLayers, setCurrentLayers] = React.useState(stateApp.layers);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUDLayers, setUDLayersStates] = useState([]);

  const [updateManyLayer] = useMutation(UPDATE_MANY_LAYER);
  const [updateDataset] = useMutation(UPDATE_DATASET, { refetchQueries: ["getDatasets"], awaitRefetchQueries: true });
  const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);
  const [updateUserMapSettings] = useMutation(UPDATE_USER_MAP_SETTINGS, { refetchQueries: ["getUserMapSettings"], awaitRefetchQueries: true });

  useEffect(() => {
    if (!deepEqual(currentLayers, stateApp.layers)) {
      setCurrentLayers(stateApp.layers);
    }
  }, [currentLayers, stateApp.layers]);

  const handleClose = () => {
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      addLayer: false,
      manageSourceLayer: false,
      manageLayer: false,
    }));
  };

  const handleClickM1List = () => {
    setOpenM1(!openM1);
  };

  const changeShowAble = (layer) => {
    const updatefn = {};
    if (layer.type === "group") {
      const value = !!layer.layers.find((l) => l.layerSettings.showable);
      layer.layers.forEach((l) => {
        const layerIndex = currentLayers.findIndex((clayer) => clayer.identifier === l.identifier);
        updatefn[layerIndex] = { layerSettings: { showable: { $set: !value } } };
      });
    } else {
      const layerIndex = currentLayers.findIndex((clayer) => clayer.identifier === layer.identifier);
      updatefn[layerIndex] = { layerSettings: { showable: { $set: !layer.layerSettings.showable } } };
    }

    setCurrentLayers(update(currentLayers, updatefn));
  };

  const handleDatasetChange = (dataset, value) => {
    const updatefn = {};
    const layersSettingsToUpdate = [];
    currentLayers.forEach((clayer, layerIndex) => {
      if (clayer.file === dataset.file) {
        updatefn[layerIndex] = { layerSettings: { showable: { $set: value } } };
        layersSettingsToUpdate.push({
          _id: clayer._id,
          layerSettings: { ...clayer.layerSettings, showable: value }
        });
      }
    });
    updateUserMapSettings({
      variables: {
        settings: {
          user: stateApp.user.mongoId,
          type: 'DatasetVisibility',
          settings: { [dataset._id]: value },
        },
      },
    });
    if (layersSettingsToUpdate.length > 0)
      updateManyUserLayerSettings({
        variables: {
          manySettings: layersSettingsToUpdate,
        },
      });

    const newLayers = update(currentLayers, updatefn)
    setCurrentLayers(newLayers);
    const datasetIndex = stateApp.datasets.findIndex(d => d._id === dataset._id);
    dataset.visibility = value
    stateApp.datasets[datasetIndex] = dataset
    setTimeout(() => { setStateApp((stateApp) => ({ ...stateApp, layers: newLayers })); }, 0)
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
    geo.features.forEach((feature, index) => {
      feature.id = index + 1
      if (!feature.properties) {
        feature.properties = {};
      }
      const layerShapeName = `${geo.fileName || name} - ${feature.geometry.type === 'MultiPolygon' ? 'Polygon' : feature.geometry.type}`
      feature.properties = { ...feature.properties, layerGeometry: feature.geometry.type, layerShapeName };
      if (!layerTypes.includes(feature.geometry.type) && feature.geometry.type !== 'MultiPolygon') {
        layerTypes.push(feature.geometry.type);
      }
    });
    layerTypes.forEach((layerType) => {
      fileNames.push(`${geo.fileName || name} - ${layerType}`);
    });
    return { layerTypes, fileNames };
  };

  const singleGeojson = (geojson, groupName) => {
    const { layerTypes, fileNames } = parseGeoForTypesAndNames(geojson, groupName);
    geojson.fileNames = fileNames;
    geojson.featureTypes = layerTypes;
    geojson.groupName = groupName;
    return geojson;
  };

  async function handleFileAsync(file) {
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
    if (fileName.endsWith(".geojson")) {
      res = await new Promise((resolve, reject) => {
        fetch(inputFile)
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            resolve({
              data: singleGeojson(response, fileName.replace(".geojson", "")),
              originalData: { file: fileData, fileName, fileType },
            });
          })
          .catch((error) => reject(error));
      });
    } else if (fileName.endsWith(".zip")) {
      // load contiguous lower 48 us nadgrid
      await new Promise((resolve, reject) => {
        fetch(conus)
          .then((response) => {
            response.arrayBuffer().then((buffer) => {
              const nadgrid = proj4.nadgrid("conus", buffer);
              resolve(nadgrid);
            });
          })
          .catch((err) => {
            console.error(err);
            resolve();
          });
      });

      res = await new Promise((resolve, reject) => {
        fetch(inputFile).then((response) => {
          response.arrayBuffer().then((buffer) => {
            shp(buffer).then((geojson) => {
              let allFileNames = [];
              let allLayerTypes = [];
              const name = fileName.replace(".zip", "");
              if (Array.isArray(geojson)) {
                geojson.forEach((geo) => {
                  const { layerTypes, fileNames } = parseGeoForTypesAndNames(geo, name);
                  allLayerTypes = allLayerTypes.concat(layerTypes);
                  allFileNames = allFileNames.concat(fileNames);
                });
                const merged = geojsonMerge.merge(geojson);
                merged.features.forEach((feature, index) => {
                  feature.id = index + 1
                })
                merged.fileNames = allFileNames;
                merged.featureTypes = allLayerTypes;
                merged.groupName = fileName.replace(".zip", "");
                resolve({ data: merged, originalData: { file: fileData, fileName, fileType } });
              } else {
                resolve({ data: singleGeojson(geojson, name), originalData: { file: fileData, fileName, fileType } });
              }
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
    let originalData;
    let fileContent = await handleFileAsync(fileObj);
    if (fileContent?.originalData) {
      originalData = fileContent.originalData;
      fileContent = fileContent.data;
    }
    setStateApp((stateApp) => ({
      ...stateApp,
      universalCircularLoaderAct: false,
    }));

    if (fileContent?.featureTypes)
      setStateMapControls({
        ...stateMapControls,
        // layerAddControl: fileContent.featureTypes?.length > 1 ? "addGroup" : "add",
        layerAddControl: "addGroup",
        fileUploadedContent: fileContent,
        fileUploadedOriginalContent: originalData,
      });
  }

  const checkIfDeleteAllow = (layer) => {
    if (layer.name === 'Agreements' || layer.groupName === 'Agreements')
      return false;
    return true
  }

  const M1Layers = React.useMemo(() => {
    const layers = currentLayers.filter((layer) => layer.layerCategory === "M1 Layer" || ['Parcels', 'Agreements', 'Units', 'Area of Interest'].includes(layer.groupName || layer.layerName));
    const groupHandled = [];
    for (let index = 0; index < layers.length; index++) {
      const UdLayer = layers[index];
      if (UdLayer.groupId && !groupHandled.includes(UdLayer.groupId)) {
        groupHandled.push(UdLayer.groupId);
        const groupLayers = layers.filter((ul) => ul.groupId === UdLayer.groupId);
        layers.splice(index, 0, { type: "group", collapsed: true, name: UdLayer.groupName, id: UdLayer.groupId, layers: groupLayers });
        index = 0;
      }
    }
    return layers.filter((UdLayer) => !((UdLayer.layerCategory === "M1 Layer" || UdLayer.groupName === "Agreements") && UdLayer.groupId));
  }, [currentLayers]);


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [actionItem, setActionItem] = React.useState(null);


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
    setStateApp((stateApp) => {
      const index = stateApp.datasets.findIndex((dataset) => dataset._id === actionItem.dataset._id)
      stateApp.datasets[index] = actionItem.dataset
      return { ...stateApp }
    })
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
    <div style={{ height: "100%", display: "flex", width: "100%" }}>
      <DropzoneAreaBase
        onAdd={handleFileInput}
        onDelete={(fileObj) => { }}
        onAlert={(message, variant) => { }}
        filesLimit={1}
        maxFileSize={10000000}
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
                  <StyledListItem2 button onClick={handleClickM1List} className={openM1 ? 'isOpen' : ''}>
                    <ListItemText primary="M1neral Platform Sources" />
                    {openM1 ? <ExpandLess /> : <ExpandMore />}
                  </StyledListItem2>
                  <Collapse in={openM1} timeout="auto" unmountOnExit>
                    <List className={classes.list}>
                      {M1Layers.map((layer, index) => {
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
                                  else setUDLayersStates(openUDLayers.filter(l => l !== index));
                                }}
                              >
                                <Checkbox
                                  checked={!!layer.layers.find((l) => l.layerSettings?.showable)}
                                  color="dark gray"
                                  onClick={(event) => event.stopPropagation()}
                                  onChange={(e) => changeShowAble(layer)}
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
                                  {layer.layers.map((groupLayer, index) => (
                                    <StyledListItem key={index} ContainerComponent="li">
                                      <Checkbox
                                        checked={groupLayer?.layerSettings?.showable}
                                        color="dark gray"
                                        onChange={() => changeShowAble(groupLayer)}
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
                              onChange={() => changeShowAble(layer)}
                              inputProps={{ "aria-label": "primary checkbox" }}
                            />

                            <ListItemText id={labelId} primary={layer.layerName === "Parcels" ? "Tracts" : truncate(layer.layerName, 30)} />

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

                  {
                    stateApp.datasets.map((dataset) => (
                      <Fragment key={dataset.sourceName}>
                        {
                          dataset.sourceName !== 'M1 Platform' ? <> <StyledListItem2 className={openDataSets[dataset.sourceName] ? 'isOpen' : ''} style={{ paddingLeft: '0px' }} button onClick={() => setOpenDataSets({ ...openDataSets, [dataset.sourceName]: !openDataSets[dataset.sourceName] })}>
                            <Checkbox
                              checked={dataset.visibility}
                              color="darkgray"
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => { handleDatasetChange(dataset, !dataset.visibility); }}
                              inputProps={{ "aria-label": "primary checkbox" }}
                            />
                            <EditableTextField onChange={datasetNameChange} item={dataset} name={dataset.sourceName} isEditable={true} openEditField={openEditField(dataset.sourceName)} />
                            {/* <ListItemText primary={dataset.sourceName} /> */}
                            <MoreHorizIcon aria-controls={"source-menu"} className={"moreSourceIcon " + classes.moreSourceIcon} onClick={(e) => { e.stopPropagation(); handleClick(e); setActionItem({ dataset }) }} />
                            {openDataSets[dataset.sourceName] ? <ExpandLess /> : <ExpandMore />}
                          </StyledListItem2>
                            <Collapse in={openDataSets[dataset.sourceName]} timeout="auto" unmountOnExit>
                              <List className={classes.list}>
                                {dataset.categories.map((layer, index) => {
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

                      </Fragment>))
                  }

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
                  <MenuItem onClick={(e) => { e.stopPropagation(); setOpenDeleteDialog(actionItem); handleMenuClose() }}><DeleteIcon /> Delete</MenuItem>
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
