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
import { MapControlsContext } from "./MapControlsContext";
import { AppContext } from "../../AppContext";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import ClickIcon from "..//Shared/svgIcons/cursor-click.js";
import UserDefined from "..//Shared/svgIcons/user-defined.js";
import ColorControl from "..//Shared/svgIcons/color-control.js";
import AddIcon from "@material-ui/icons/Add";
import { Tooltip, FormControlLabel, Switch } from "@material-ui/core";
import { UPDATELAYERSETTINGS } from "../../graphQL/useMutationUpdateLayerSettings";
import { UPDATEMANYLAYERSETTINGS } from "../../graphQL/useMutationUpdateManyLayerSettings";
import { useMutation } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  subHeaderItem: {
    backgroundColor: "#011133 !important",
    minWidth: "350px",
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

export default function CheckboxList(props) {
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);

  const classes = useStyles();

  const [currentLayers, setCurrentLayers] = useState(stateApp.layers);

  const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);
  const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);

  if (!stateApp.layers) return;

  const handleToggle = (layer, index) => () => {
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
    setStateApp((stateApp) => ({ ...stateApp, layers: currentLayers }));

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

  const handleToggleInteraction = (layer, index) => () => {
    const currentLayers = [...stateApp.layers];
    const updatedLayer = {
      ...layer,
      layerSettings: {
        ...layer.layerSettings,
        interaction: {
          ...layer.layerSettings.interaction,
          interactionDetail: {
            hover: !layer.layerSettings.interaction.interactionDetail.click,
            click: !layer.layerSettings.interaction.interactionDetail.click,
          },
        },
      },
    };

    //// saving to stateApp
    currentLayers[index] = updatedLayer;
    setStateApp((stateApp) => ({ ...stateApp, layers: currentLayers }));

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
      left: "unset !important",
      right: "80px !important",
    },
  })((props) => (
    <Menu
      elevation={0}
      variant="menu"
      transitionDuration={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      MenuListProps={{
        disablePadding: true,
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ));

  const defaultProps = {
    borderLeft: 4,
  };

  const StyledMenuItem = withStyles((theme) => ({
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
    }));
  };

  const onDragEnd = (result) => {
    // dropped outside the list
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
        layers: reorderedLayers,
      });

      //// saving to mongo
      updateManyUserLayerSettings({
        variables: {
          manySettings: layersToUpdate,
        },
      });
    }
  };

  const ifLayerHaveData = (layer) => {
    //// temporary disabling the Title Layer
    if (layer.layerName === "Title") return false;
    ////

    if (
      (layer.layerName === "Tagged Wells/Owners" &&
        !(
          stateApp.wellListFromTagsFilter &&
          stateApp.wellListFromTagsFilter.length > 0
        )) ||
      (layer.layerName === "Search" &&
        !(
          stateApp.wellListFromSearch && stateApp.wellListFromSearch.length > 0
        )) ||
      (layer.layerName === "Tracked Wells" &&
        !(stateApp.trackedwells && stateApp.trackedwells.length > 0)) ||
      (layer.layerName === "Tracked Owners" &&
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

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <StyledMenu
        id="checklist-menu"
        anchorEl={stateMapControls.anchorEl}
        keepMounted
        open={Boolean(stateMapControls.anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem
          disableRipple
          key="subheader"
          role={undefined}
          dense
          className={classes.subHeaderItem}
        >
          <ListItemText primary="Layer Visibility" />
          <StyledListItemSecondaryAction>
            <Button
              onClick={openAddLayer}
              color="primary"
              startIcon={<AddIcon />}
            >
              Add Layer
            </Button>
          </StyledListItemSecondaryAction>
        </StyledMenuItem>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppableM1">
            {(provided, snapshot) => (
              <RootRef rootRef={provided.innerRef}>
                <List className={classes.list}>
                  {stateApp.layers.map((layer, index) => {
                    const labelId = `checkbox-list-label-${index}`;
                    if (layer.layerSettings && layer.layerSettings.showable) {
                      return (
                        <Draggable
                          key={labelId}
                          draggableId={labelId}
                          index={layer.position}
                        >
                          {(provided, snapshot) => (
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
                                primary={getLayerName(layer)}
                                className={
                                  !ifLayerHaveData(layer)
                                    ? classes.disabledLayerTitle
                                    : ""
                                }
                              />
                              {layer.layerSettings.colorable && (
                                <div
                                  style={{
                                    paddingRight: !layer.layerSettings
                                      .interaction.interactionAble
                                      ? "40"
                                      : "",
                                  }}
                                >
                                  <ListItemIcon
                                    onClick={() => handleColorPicker(layer)}
                                  >
                                    <ColorControl />
                                  </ListItemIcon>
                                </div>
                              )}
                              {layer.layerSettings.interaction
                                .interactionAble && (
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
                                          !ifLayerHaveData(layer)
                                            ? "rgb(127, 149, 199)"
                                            : "#12abe0"
                                        }
                                      />
                                    }
                                    checkedIcon={
                                      <ClickIcon
                                        color={
                                          !ifLayerHaveData(layer)
                                            ? "rgb(127, 149, 199)"
                                            : "#12abe0"
                                        }
                                      />
                                    }
                                    edge="start"
                                    checked={
                                      layer.layerSettings.interaction
                                        .interactionDetail.click
                                    }
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ "aria-labelledby": labelId }}
                                    onChange={handleToggleInteraction(
                                      layer,
                                      index
                                    )}
                                  />
                                </div>
                              )}
                              <FormControlLabel
                                control={
                                  <Switch
                                    disabled={!ifLayerHaveData(layer)}
                                    checked={
                                      layer.layerSettings.visiable !== false
                                    }
                                    onChange={handleToggle(layer, index)}
                                  />
                                }
                              />
                            </StyledListItem>
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
        {/* </Collapse> */}
      </StyledMenu>
    </ClickAwayListener>
  );
}
