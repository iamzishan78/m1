import React, { useContext, useState, useEffect } from "react";
import update from "immutability-helper";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { MapControlsContext } from "../../MapControlsContext";
import { AppContext } from "AppContext";
import { Typography } from "@material-ui/core";
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
import shp from "shpjs";
import geojsonMerge from "@mapbox/geojson-merge";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";
import Box from "@material-ui/core/Box";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import UploadIcon from "components/Shared/svgIcons/uploadIcon";
import EditableTextField from "components/Shared/components/Fields/EditableTextField";
import { truncate } from "components/Shared/functions";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { Popper, Grow, Paper, MenuList, MenuItem } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import proj4 from "proj4";
// cra webpack hack to call this a png to get included in bundle
import conus from "components/Shared/constants/nadgrids/conus.png";
import { UPDATE_MANY_LAYER } from "graphQL/useMutationUpdateManyLayer";
import { useHistory } from "react-router-dom";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
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

  moreIcon: {
    color: "#0000008a",
    marginRight: '15px',
    visibility: "hidden"
  },
  moreSourceIcon: {
    color: "#0000008a",
    marginRight: '15px',
    visibility: "hidden",
    cursor: 'pointer'
  }
}));

const StyledListItem2 = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    backgroundColor: theme.palette.common.white,
    color: "#263451",
    padding:"4px 0px 4px 0",
    border: "2px solid #263451",
    borderRadius: "5px",
    marginTop: "15px",
    marginBottom: "5px",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: "#263451",
    },
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
      "& .moreSourceIcon": {
        visibility: "visible"
      },
      "& .moreIcon": {
        visibility: "visible"
      }
    },
  },
}))(ListItem);

export default function AddLayer(props) {
  const classes = useStyles();
  let history = useHistory();

  const [stateMapControls, setStateMapControls] = useContext(MapControlsContext);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [openM1, setOpenM1] = React.useState(true);
  const [isOpenUserDefinedLayers, setIsOpenUserDefinedLayers] = React.useState(true);
  const [currentLayers, setCurrentLayers] = React.useState(stateApp.layers);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUDLayers, setUDLayersStates] = useState([]);

  const [updateManyLayer] = useMutation(UPDATE_MANY_LAYER);
  const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);

  const [updateDataset] = useMutation(UPDATE_DATASET, { refetchQueries: ["getDatasets"], awaitRefetchQueries: true });
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [actionItem, setActionItem] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (e) => {
    setAnchorEl(null);
  };

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

  useOnClickOutside({ current: anchorEl }, handleMenuClose);
  
  useEffect(() => {
    if (stateApp.layers) {
      setCurrentLayers(stateApp.layers);
    }
  }, [stateApp.layers]);

  const handleCurrentLayersChange = () => {
    setCurrentLayers((currentLayers) => { handleApplyChange(currentLayers); return currentLayers; })
  };

  const windowClose = () => {
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      addLayer: false,
    }));
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
    handleCurrentLayersChange()
  };
  


  const checkAllLayers = (layers, layerType) => {
    let check = true;
    if (layers) {
      for (let index = 0; index < layers.length; index++) {
        if (layers[index].type === "group") {
          if (layers[index].layers.find((layer) => layer.layerSettings.showable === false)) check = false
        } else if (layers[index].layerSettings.showable === false) {
          check = false
        }
      }
    }
    if (layerType === "M1") {
      setSelectAllMinerallayers(check)
    } else if (layerType === "UD") {
      setSelectAllClientlayers(check)
    }
  }

  useEffect(() => {
    checkAllLayers(M1Layers, "M1")
    checkAllLayers(UdLayers, "UD")
  }, []);

  useEffect(() => {
    checkAllLayers(M1Layers, "M1")
    checkAllLayers(UdLayers, "UD")
  }, [currentLayers]);

  const [selectAllMinerallayers, setSelectAllMinerallayers] = useState(false)
  const [selectAllClientlayers, setSelectAllClientlayers] = useState(false)

  const changeAlllayers = (layers, value, layerType) => {

    const updatedLayers = layers.map(layer => {
      const updatefn = {};
      if (layer.type === "group") {
        layer.layers.forEach((l) => {
          const layerIndex = currentLayers.findIndex((clayer) => clayer.identifier === l.identifier);
          updatefn[layerIndex] = { layerSettings: { showable: { $set: value } } };
        });
      } else {
        const layerIndex = currentLayers.findIndex((clayer) => clayer.identifier === layer.identifier);
        updatefn[layerIndex] = { layerSettings: { showable: { $set: value } } };
      }
      return updatefn
    });

    let result = currentLayers
    for (let index = 0; index < updatedLayers.length; index++) {
      result = update(result, updatedLayers[index])
    }

    setCurrentLayers(result);
    if (layerType === "M1") {
      setSelectAllMinerallayers(value)
    } else if (layerType === "UD") {
      setSelectAllClientlayers(value)
    }

    handleCurrentLayersChange()
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
    handleCurrentLayersChange()
  };

  const handleApplyChange = (currentLayers) => {
    if (!deepEqual(currentLayers, stateApp.layers)) {
      const layersToUpdate = [];
      const layersSettingsToUpdate = [];
      for (let i = 0; i < currentLayers.length; i++) {
        if (!deepEqualObjects(currentLayers[i], stateApp.layers[i])) {
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

      //// saving to stateApp
      setStateApp({
        ...stateApp,
        layers: [...currentLayers],
      });

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

  const parseGeoForTypesAndNames = (geo, name) => {
    const layerTypes = [];
    const fileNames = [];
    geo.features.forEach((feature, index) => {
      feature.id = index + 1
      if (!feature.properties) {
        feature.properties = {};
      }
      feature.properties = { ...feature.properties, layerGeometry: feature.geometry.type };
      if (!layerTypes.includes(feature.geometry.type) && feature.geometry.type !== 'MultiPolygon') {
        layerTypes.push(feature.geometry.type);
      }
    });
    layerTypes.forEach((layerType) => {
      if (layerTypes.length > 1) {
        fileNames.push(`${geo.fileName || name} - ${layerType}`);
      } else {
        fileNames.push(`${geo.fileName || name} `);
      }
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
        layerAddControl: fileContent.featureTypes?.length > 1 ? "addGroup" : "add",
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
    return currentLayers.filter((layer) => layer.layerCategory === "M1 Layer");
  }, [currentLayers]);

  const UdLayers = React.useMemo(() => {
    const layers = currentLayers.filter((layer) => layer.layerCategory === "UD layer" || layer.file);
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
    return layers.filter((UdLayer) => !((UdLayer.layerType === "file layer" || UdLayer.groupName === "Agreements") && UdLayer.groupId));
  }, [currentLayers]);

  return (
    <ClickAwayListener onClickAway={() => { }}>
      <>
        <div style={{ height: "100%", display: "flex", width: "100%" }}>
          <div>
            <div className={classes.contentRoot}>
              <Typography varient="h5" style={{ textAlign: "start", paddingBottom: "20px", fontWeight: "bolder", fontFamily: 'sans-serif' }} onClick={(e) => e.stopPropagation()}>
                Add Layers to Map View
              </Typography>

              <Typography varient="h6" style={{ textAlign: "start", marginBottom: "10px" }} onClick={(e) => e.stopPropagation()}>
                Select one or more of the available layers below to add them to your current map view
              </Typography>

              <div onClick={(e) => e.stopPropagation()}>
                <StyledListItem2 button onClick={()=>setOpenM1(!openM1)}>
                <Checkbox
                    checked={selectAllMinerallayers}
                    color="darkgray"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {changeAlllayers(M1Layers,!selectAllMinerallayers,"M1")}}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                  <ListItemText primary="M1neral Platform Layers" />
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
                          <ListItemText id={labelId} primary={truncate(layer.layerName, 30)} />
                        </StyledListItem>
                      );
                    })}
                  </List>
                </Collapse>
                <StyledListItem2 button onClick={()=>setIsOpenUserDefinedLayers(!isOpenUserDefinedLayers)}>
                <Checkbox
                    checked={selectAllClientlayers}
                    color="darkgray"
                    
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {changeAlllayers(UdLayers,!selectAllClientlayers,"UD")}}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                  <ListItemText primary="Client Specific Layers" />
                  {isOpenUserDefinedLayers ? <ExpandLess /> : <ExpandMore />}
                </StyledListItem2>

                {/* Custom */}
                <Collapse in={isOpenUserDefinedLayers} timeout="auto" unmountOnExit>
                  <List className={classes.list}>
                    {UdLayers.map((layer, index) => {
                      const labelId = `udlayer-list-label-${index}`;
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
                              <StyledListItem>
                                <Checkbox
                                  checked={!!layer.layers.find((l) => l.layerSettings.showable)}
                                  color="dark gray"
                                  onClick={(event) => event.stopPropagation()}
                                  onChange={(e) => changeShowAble(layer)}
                                  inputProps={{ "aria-label": "primary checkbox" }}
                                />
                                {/* Group */}
                                <EditableTextField
                                  onChange={changeLayerName}
                                  item={layer}
                                  name={layer.name}
                                  isEditable={false}
                                  showExpandIcon
                                  openUd={openUDLayers.includes(index)}
                                  openEditField={layer?.id===actionItem?.group?.id && actionItem?.type==='editName'}
                                />
                                {checkIfDeleteAllow(layer) && <MoreHorizIcon aria-controls={"source-menu"} className={"moreIcon " + classes.moreIcon} onClick={(e) => { e.stopPropagation(); handleClick(e); setActionItem({ group: layer }) }} />}
                              </StyledListItem>
                            </AccordionSummary>
                            <Box paddingLeft={2} paddingRight={2}>
                              <List className={classes.list}>
                                {layer.layers.map((groupLayer, index) => (
                                  <StyledListItem key={index} ContainerComponent="li">
                                    <Checkbox
                                      checked={groupLayer.layerSettings.showable}
                                      color="dark gray"
                                      onChange={() => changeShowAble(groupLayer)}
                                      inputProps={{ "aria-label": "primary checkbox" }}
                                    />
                                    {/* Group Layer */}
                                    <EditableTextField onChange={changeLayerName} item={groupLayer} name={groupLayer.layerName} isEditable={false} openEditField={groupLayer?.layerId===actionItem?.layer?.layerId && actionItem?.type==='editName'} />
                                    {checkIfDeleteAllow(groupLayer) && <MoreHorizIcon aria-controls={"source-menu"} className={"moreSourceIcon " + classes.moreSourceIcon} onClick={(e) => { e.stopPropagation(); handleClick(e); setActionItem({ layer: groupLayer }) }} />}
                                  </StyledListItem>
                                ))}
                              </List>
                            </Box>
                          </Accordion>
                        );
                      }
                      //// remove the (layer.identifier!="Tracked Owners") if statement to show the tracked owers layer
                      if (layer.identifier !== "Tracked Owners") {
                        return (
                          <StyledListItem key={index} ContainerComponent="li">
                            <Checkbox
                              checked={layer.layerSettings.showable}
                              color="dark gray"
                              onChange={() => changeShowAble(layer)}
                              inputProps={{ "aria-label": "primary checkbox" }}
                            />
                            {layer.layerType === "file layer" ? (
                              <>
                                {/* Layer */}
                                <EditableTextField onChange={changeLayerName} item={layer} name={layer.layerName} isEditable={false} openEditField={layer?.layerId===actionItem?.layer?.layerId && actionItem?.type==='editName' } />

                                {checkIfDeleteAllow(layer) && <MoreHorizIcon aria-controls={"source-menu"} className={"moreSourceIcon " + classes.moreSourceIcon} onClick={(e) => { e.stopPropagation(); handleClick(e); setActionItem({ layer }) }} />}
                              </>
                            ) : (
                              <ListItemText id={labelId} primary={layer.layerName === "Parcels" ? "Tracts" : layer.layerName} />
                            )}

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
                      }
                    })}
                  </List>
                </Collapse>
              </div>
            </div>
          </div>
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
        </div>

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
                    <MenuItem onClick={(e) => { e.stopPropagation(); setOpenDeleteDialog(actionItem.layer||actionItem.group); handleMenuClose() }}><DeleteIcon /> Delete</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    </ClickAwayListener>
  );
}
