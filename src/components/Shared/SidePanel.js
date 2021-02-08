import React, { useContext, useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import DragIndicator from "@material-ui/icons/DragIndicator";
import Button from "@material-ui/core/Button";
import { MapControlsContext } from "../MapControls/MapControlsContext";
import { AppContext } from "../../AppContext";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import ClickIcon from "..//Shared/svgIcons/cursor-click.js";
import UserDefined from "..//Shared/svgIcons/user-defined.js";
import ColorControl from "..//Shared/svgIcons/color-control.js";
import AddIcon from "@material-ui/icons/Add";
import LayersIcon from "@material-ui/icons/Layers";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MapDarkIcon from "../Shared/svgIcons/MapDarkIcon";
import MapOutdoorIcon from "../Shared/svgIcons/MapOutdoorIcon";
import MapSatelliteIcon from "../Shared/svgIcons/MapSatelliteIcon";
import MapLightIcon from "../Shared/svgIcons/MapLightIcon";
import MapBasicIcon from "../Shared/svgIcons/MapBasicIcon";
import Collapse from "@material-ui/core/Collapse";
import { Tooltip, FormControlLabel, Switch } from "@material-ui/core";
import { UPDATELAYERSETTINGS } from "../../graphQL/useMutationUpdateLayerSettings";
import { UPDATEMANYLAYERSETTINGS } from "../../graphQL/useMutationUpdateManyLayerSettings";
import { useMutation } from "@apollo/client";
import Box from "@material-ui/core/Box";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

const theme = createMuiTheme({
  overrides: {
    MuiSvgIcon: {
      root: {
        width: 90,
        height: 60,
      },
    },
    MuiListItemText: {
      root: {
        textAlign: "center",
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  subHeaderItem: {
    backgroundColor: "#011133 !important",
    minWidth: "400px",
  },
  list: {
    padding: 0,
  },
  nested: {
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
  },
  disabledLayerTitle: {
    "& span": { color: "rgb(127, 149, 199) !important" },
  },
  boxtext: {
    textAlign: "center",
    margin: "auto",
  },
  imageBox: {
    "& :nth-child(1)": {
      float: "left",
      display: "grid",
    },
    "& :nth-child(2)": {
      float: "left",
      display: "grid",
    },
    "& :nth-child(3)": {
      display: "grid",
    },
    "& :nth-child(4)": {
      float: "left",
      display: "grid",
    },
    "& :nth-child(5)": {
      display: "grid",
      float: "left",
    },
  },
}));

const reorder = (list, startPosition, endPosition) => {
  const reorderedLayers = Array.from(list);
  let startIndex = reorderedLayers.findIndex(
    (layer) => layer.position == startPosition
  );
  let endIndex = reorderedLayers.findIndex(
    (layer) => layer.position == endPosition
  );

  //// switch positions between layers
  let endI = endIndex;
  while (endI > startIndex) {
    let temp = reorderedLayers[endI].position;
    reorderedLayers[endI] = {
      ...reorderedLayers[endI],
      position: reorderedLayers[endI - 1].position,
    };
    reorderedLayers[endI - 1] = {
      ...reorderedLayers[endI - 1],
      position: temp,
    };
    endI--;
  }
  while (endI < startIndex) {
    let temp = reorderedLayers[endI].position;
    reorderedLayers[endI] = {
      ...reorderedLayers[endI],
      position: reorderedLayers[endI + 1].position,
    };
    reorderedLayers[endI + 1] = {
      ...reorderedLayers[endI + 1],
      position: temp,
    };
    endI++;
  }

  //// reorder the stateApp.layers
  const [removed] = reorderedLayers.splice(startIndex, 1);
  reorderedLayers.splice(endIndex, 0, removed);

  //// separate the layers to update
  let layersToUpdate = reorderedLayers
    .filter(
      (currentValue, index) =>
        (startIndex < endIndex && startIndex <= index && index <= endIndex) ||
        (startIndex > endIndex && startIndex >= index && index >= endIndex)
    )
    .map((layer) => ({ _id: layer._id, position: layer.position }));

  return { reorderedLayers, layersToUpdate };
};

export default function CheckboxList({ panelName }) {
  const { basinLayerColor, GLOUnitsColor, GLOLeasesColor } = useSelector(
    ({ MainMap }) => MainMap
  );
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);

  const classes = useStyles();

  const [layerMap, setLayerMap] = useState([]);
  const [open, setOpen] = useState(true);
  const [mapStyles, setMapStyles] = useState([]);
  const [currentLayers, setCurrentLayers] = useState(stateApp.layers);

  const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);
  const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);

  useEffect(() => {
    if (panelName === "base") {
      const req = new Request(
        "https://api.mapbox.com/styles/v1/m1neral?access_token=sk.eyJ1IjoibTFuZXJhbCIsImEiOiJjazdkbGg1YXAwMjVqM2VwanZzbm95Z2dvIn0.cdoQNZU42xxbybyGxlBNkw",
        {
          method: "GET",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "max-age=0",
          },
        }
      );

      const abortController = new AbortController();
      const signal = abortController.signal;

      fetch(req, { signal: signal })
        .then((results) => results.json())
        .then((data) => {
          setMapStyles(data.slice(0, 5));
        });

      //clean up
      return function cleanup() {
        abortController.abort();
      };
    }
  }, [panelName]);

  useEffect(() => {
    console.log(
      "Panelname and layer",
      panelName,
      stateApp.layers,
      stateApp.baseMapLayers
    );
    if (panelName === "layer" && stateApp.layers) {
      setLayerMap(stateApp.layers);
    } else if (panelName === "base" && stateApp.baseMapLayers) {
      setLayerMap(
        stateApp.baseMapLayers.filter(
          (item) => item.name !== "Water" && item.name !== "Land"
        )
      );
    }
  }, [
    stateMapControls.selectedControl,
    stateApp.layers,
    stateApp.baseMapLayers,
    stateApp.checkedBaseLayers
  ]);

  //   useEffect(() => {
  //     console.log("Panelname and basemap", panelName, stateApp.baseMapLayers);

  //   }, [stateApp.baseMapLayers]);

  useEffect(() => {
    console.log("Layer Map: ", layerMap);
  }, [layerMap]);

  if (panelName === "layer" && !stateApp.layers) {
    return null;
  }

  const handleClick = () => {
    setOpen(!open);
  };

  const handleToggleVisbility = (layer, index) => {
    const currentLayers = [...stateApp.layers];
    const updatedLayer = {
      ...layer,
      layerSettings: {
        ...layer.layerSettings,
        visiable: !layer.layerSettings.visiable,
      },
    };

    //// saving to stateApp
    currentLayers[index] = updatedLayer;
    setStateApp((stateApp) => ({ ...stateApp, layers: [...currentLayers] }));

    //// saving to mongo
    updateLayerSettings({
      variables: {
        settings: {
          _id: updatedLayer._id,
          layerSettings: updatedLayer.layerSettings,
        },
      },
    });
  };

  const handleToggleBasemap = (idx) => {
    const currentIndex = stateApp.checkedBaseLayers.indexOf(idx);
    const newChecked = [...stateApp.checkedBaseLayers];
    if (currentIndex === -1) {
      newChecked.push(idx);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setStateApp((stateApp) => ({ ...stateApp, checkedBaseLayers: newChecked }));
  };

  const handleToggle = ({ layer, index }) => () => {
    if (panelName === "layer") handleToggleVisbility(layer, index);
    else if (panelName === "base") handleToggleBasemap(index);
  };

  const handleToggleInteraction = (layer, index) => () => {
    const currentLayers = [...stateApp.layers];
    const updatedLayer = {
      ...layer,
      layerSettings: {
        ...layer.layerSettings,
        interaction: {
          ...layer.layerSettings.interaction,
          interactionDetail: {
            hover: !layer.layerSettings.interaction.interactionDetail.hover,
            click: !layer.layerSettings.interaction.interactionDetail.click,
          },
        },
      },
    };

    //// saving to stateApp
    currentLayers[index] = updatedLayer;
    setStateApp((stateApp) => ({ ...stateApp, layers: [...currentLayers] }));

    //// saving to mongo
    updateLayerSettings({
      variables: {
        settings: {
          _id: updatedLayer._id,
          layerSettings: updatedLayer.layerSettings,
        },
      },
    });
  };

  const StyledMenu = withStyles({
    paper: {
      border: "1px solid #011133",
      left: "30px !important",
      top: "90px !important",
      // right: "80px !important",
    },
  })((props) => (
    <Menu
      elevation={0}
      variant="menu"
      transitionDuration={0}
      getContentAnchorEl={null}
      // anchorOrigin={{
      //   vertical: "top",
      //   horizontal: "left",
      // }}
      MenuListProps={{
        disablePadding: true,
      }}
      // transformOrigin={{
      //   vertical: "top",
      //   horizontal: "right",
      // }}
      {...props}
    />
  ));

  const defaultProps = {
    borderLeft: 4,
  };

  const StyledMenuHeaderItem = withStyles((theme) => ({
    root: {
      fontFamily: "Poppins",
      "&:hover": {
        background: "#4B618F",
      },
      backgroundColor: "#263451",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
      "& .MuiButton-textPrimary": {
        color: theme.palette.common.white,
        background: "#17acdd",
        padding: "3px 10px",
      },
    },
  }))(MenuItem);

  const StyledMenuItem = withStyles((theme) => ({
    root: {
      fontFamily: "Poppins",
      display: "block",
      color: "white",
      "&:hover": {
        background: "#4B618F",
      },

      backgroundColor: "#263451",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
        // },
      },
    },
  }))(MenuItem);

  const StyledListItemSecondaryAction = withStyles((theme) => ({
    root: {
      "& .MuiButton-textPrimary": {
        color: theme.palette.common.white,
        background: "#17acdd",
        padding: "3px 10px",
      },
    },
  }))(ListItemSecondaryAction);

  const StyledListItem = withStyles((theme) => ({
    root: {
      fontFamily: "Poppins",
      "&:hover": {
        background: "#4B618F",
      },
      backgroundColor: "#263451",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
      "& .MuiListItemText-primary svg": {
        marginLeft: "5px",
        verticalAlign: "middle",
      },
    },
  }))(ListItem);

  const StyledListItem2 = withStyles((theme) => ({
    root: {
      fontFamily: "Poppins",
      "&:hover": {
        background: "#a3b2cf",
      },
      backgroundColor: "#4B618F",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  }))(ListItem);

  const handleClose = () => {
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      anchorEl: null,
    }));
  };

  const openAddLayer = () => {
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      addLayer: true,
      selectedControl: null,
    }));
  };

  const onDragEndLayer = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.source.index !== result.destination.index) {
      const { reorderedLayers, layersToUpdate } = reorder(
        stateApp.layers,
        result.source.index,
        result.destination.index
      );

      //// saving to stateApp
      setStateApp({
        ...stateApp,
        layers: [...reorderedLayers],
      });

      //// saving to mongo
      updateManyUserLayerSettings({
        variables: {
          manySettings: layersToUpdate,
        },
      });
    }
  };

  const onDragEndBasemap = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      stateApp.baseMapLayers,
      result.source.index,
      result.destination.index
    );

    let checkedBaseLayers = stateApp.checkedBaseLayers.slice(0);
    const sourceIndex = checkedBaseLayers.indexOf(result.source.index);

    let direction = 0;
    let from,
      to = 0;
    if (result.destination.index > result.source.index) {
      direction = -1;
      from = result.source.index;
      to = result.destination.index;
    } else {
      direction = 1;
      to = result.source.index;
      from = result.destination.index;
    }

    for (let i = 0; i < checkedBaseLayers.length; i++) {
      if (checkedBaseLayers[i] <= to && checkedBaseLayers[i] >= from) {
        checkedBaseLayers[i] += direction;
      }
    }

    if (sourceIndex !== -1) {
      checkedBaseLayers[sourceIndex] = result.destination.index;
    }

    setStateApp({
      ...stateApp,
      baseMapLayers: items,
      checkedBaseLayers: checkedBaseLayers,
    });
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (panelName === "layer") onDragEndLayer(result);
    else if (panelName === "base") onDragEndBasemap(result);
  };

  const ifLayerHaveData = (layer) => {
    //// temporary disabling the Title Layer
    if (layer.identifier === "Title") return false;
    ////

    if (
      (layer.identifier === "User Tags" &&
        !(
          stateApp.wellListFromTagsFilter &&
          stateApp.wellListFromTagsFilter.length > 0
        )) ||
      (layer.identifier === "Search" &&
        !(
          stateApp.wellListFromSearch && stateApp.wellListFromSearch.length > 0
        )) ||
      (layer.identifier === "Tracked Wells" &&
        !(stateApp.trackedwells && stateApp.trackedwells.length > 0)) ||
      (layer.identifier === "Tracked Owners" &&
        !(stateApp.trackedOwnerWells && stateApp.trackedOwnerWells.length > 0))
    )
      return false;
    return true;
  };

  const handleColorPicker = (layer) => {
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      selectedLayer: layer,
    }));
  };

  const getLayerName = (layer) => {
    if (layer.layerCategory == "M1 Layer") {
      return layer.layerName;
    } else {
      return (
        <>
          <span>{layer.layerName}</span>
          <UserDefined />
        </>
      );
    }
  };

  const getLayerColor = (layer) => {
    // layerName: "Rig Activity"
    if (layer) {
      if (layer.identifier == "Rig Activity") return "#263451";

      if (
        layer.layerPaintProps &&
        layer.layerPaintProps[0] &&
        layer.layerPaintProps[0].paintProps
      ) {
        if (layer.layerPaintProps[0].paintProps["circle-color"])
          return layer.layerPaintProps[0].paintProps["circle-color"];
        if (layer.layerPaintProps[0].paintProps["fill-color"])
          return layer.layerPaintProps[0].paintProps["fill-color"];
        if (layer.layerPaintProps[0].paintProps["line-color"])
          return layer.layerPaintProps[0].paintProps["line-color"];
        if (layer.layerPaintProps[0].paintProps["icon-color"])
          return layer.layerPaintProps[0].paintProps["icon-color"];
      }

      if (
        layer.layerPaintProps &&
        layer.layerPaintProps.ids &&
        layer.layerPaintProps.ids[0]
      ) {
        if (layer.layerPaintProps.ids[0] == "basinLayer")
          return basinLayerColor;
        if (layer.layerPaintProps.ids[0] == "GLOUnits") return GLOUnitsColor;
        if (layer.layerPaintProps.ids[0] == "GLOLeases") return GLOLeasesColor;
      }
    }
    return "#263451";
  };

  const getBasemapImageBox = () => {
    return (
      <>
        <div className={classes.imageBox}>
          {mapStyles.map((style) => (
            <StyledMenuItem
              disableRipple
              key={style.id}
              role={undefined}
              onClick={() => {
                setStateApp((stateApp) => ({
                  ...stateApp,
                  mapVars: { ...stateApp.mapVars, styleId: style.name },
                }));

                handleClose();
              }}
            >
              <ThemeProvider theme={theme}>
                <div>{style.name == "Outdoors" && <MapOutdoorIcon />}</div>
                <div>{style.name == "Satellite" && <MapSatelliteIcon />}</div>
                <div>{style.name == "Light" && <MapLightIcon />}</div>
                <div>{style.name == "Dark" && <MapDarkIcon />}</div>
                <div>{style.name == "Basic" && <MapBasicIcon />}</div>
                <div className={classes.boxtext}>
                  <ListItemText primary={style.name} />
                </div>
              </ThemeProvider>
            </StyledMenuItem>
          ))}
        </div>

        <StyledListItem2 button onClick={handleClick}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Base Map Layers" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </StyledListItem2>
      </>
    );
  };

//   const WithBox = ({ children, layer, ...defaultProps }) => {
//     console.log("Children default props", children, defaultProps);
//     return panelName === "layer " ? (
//       <Box borderColor={getLayerColor(layer)} {...defaultProps}>
//         {children}
//       </Box>
//     ) : (
//       { children }
//     );
//   };

  const getLayerControls = (layer, labelId, index) => {
    const control1 = layer.layerSettings.colorable && (
      <div
        style={{
          paddingRight: !layer.layerSettings.interaction.interactionAble
            ? "40"
            : "",
        }}
      >
        <ListItemIcon onClick={() => handleColorPicker(layer)}>
          <Tooltip title="Layer Styling">
            <ColorControl />
          </Tooltip>
        </ListItemIcon>
      </div>
    );

    const control2 = layer.layerSettings.interaction.interactionAble && (
      <div
        style={{
          paddingRight: 20,
          height: "42px",
          width: "42px",
        }}
      >
        <Checkbox
          icon={
            <CancelOutlinedIcon
              htmlColor={
                !ifLayerHaveData(layer) ? "rgb(127, 149, 199)" : "#12abe0"
              }
            />
          }
          checkedIcon={
            <ClickIcon
              color={!ifLayerHaveData(layer) ? "rgb(127, 149, 199)" : "#12abe0"}
            />
          }
          edge="start"
          checked={layer.layerSettings.interaction.interactionDetail.click}
          tabIndex={-1}
          disableRipple
          inputProps={{
            "aria-labelledby": labelId,
          }}
          onChange={handleToggleInteraction(layer, index)}
        />
      </div>
    );

    return (
      <>
        {control1}
        {control2}
      </>
    );
  };

  const getLayerChecked = ({ layer, index }) => {
    if (panelName === "layer" && layer) {
      return layer.layerSettings.visiable !== false;
    } else if (panelName === "base" && index) {
      return stateApp.checkedBaseLayers
        ? stateApp.checkedBaseLayers.indexOf(index) !== -1
        : false;
    } else {
      return false;
    }
  };

  const displayList = (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppableM1">
        {(provided, snapshot) => (
          <RootRef rootRef={provided.innerRef}>
            <List className={classes.list}>
              {layerMap.map((layer, index) => {
                const labelId = `checkbox-list-label-${index}`;

                //// remove the (layer.identifier!="Tracked Owners") condition from the if statement to show the tracked owers layer
                if (
                  panelName === "base" ||
                  (panelName === "layer" &&
                    layer.layerSettings &&
                    layer.layerSettings.showable &&
                    layer.identifier != "Tracked Owners")
                ) {
                  return (
                    <Draggable
                      key={labelId}
                      draggableId={labelId}
                      index={panelName === "layer" ? layer.position : index}
                    >
                      {(provided, snapshot) => (
                        <Box
                          borderColor={
                            panelName === "layer" ? getLayerColor(layer) : {}
                          }
                          {...defaultProps}
                        >
                          <StyledListItem
                            ContainerComponent="li"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <ListItemIcon {...provided.dragHandleProps}>
                              <DragIndicator />
                            </ListItemIcon>
                            <ListItemText
                              id={labelId}
                              primary={
                                panelName === "layer"
                                  ? getLayerName(layer)
                                  : layer.name
                              }
                              className={
                                !ifLayerHaveData(layer) && panelName === "layer"
                                  ? classes.disabledLayerTitle
                                  : ""
                              }
                            />
                            {panelName === "layer" &&
                              layer.layerSettings.colorable &&
                              getLayerControls(layer, labelId, index)}
                            <FormControlLabel
                              control={
                                <Switch
                                  disabled={
                                    !ifLayerHaveData(layer) &&
                                    panelName === "layer"
                                  }
                                  checked={getLayerChecked({
                                    layer,
                                    index,
                                  })}
                                  onChange={handleToggle({ layer, index })}
                                />
                              }
                            />
                          </StyledListItem>
                        </Box>
                      )}
                    </Draggable>
                  );
                }
              })}
            </List>
          </RootRef>
        )}
      </Droppable>
    </DragDropContext>
  );

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <StyledMenu
        id="checklist-menu"
        anchorEl={stateMapControls.anchorEl}
        keepMounted
        open={Boolean(stateMapControls.anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuHeaderItem
          disableRipple
          key="subheader"
          role={undefined}
          dense
          className={classes.subHeaderItem}
        >
          <ListItemText
            primary={panelName === "layer" ? "Layer Visibility" : "Base Map"}
          />
          {panelName === "layer" && (
            <StyledListItemSecondaryAction>
              <Button
                onClick={openAddLayer}
                color="primary"
                startIcon={<AddIcon />}
              >
                Add Layer
              </Button>
            </StyledListItemSecondaryAction>
          )}
        </StyledMenuHeaderItem>

        {/* base Stuff */}
        {panelName === "base" && getBasemapImageBox()}

        {panelName === "base" ? (
          <Collapse in={open} timeout="auto" unmountOnExit>
            {displayList}
          </Collapse>
        ) : (
          displayList
        )}

        {/* </Collapse> */}
      </StyledMenu>
    </ClickAwayListener>
  );
}
