import React, { useContext, useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
//import Button from '@material-ui/core/Button';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

//import List from '@material-ui/core/List';
//import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import DragIndicator from "@material-ui/icons/DragIndicator";
import Button from '@material-ui/core/Button';
//import EditIcon from '@material-ui/icons/Edit';
import { MapControlsContext } from "./MapControlsContext";
import { AppContext } from "../../AppContext";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import LayersIcon from "@material-ui/icons/Layers";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import PaletteIcon from '@material-ui/icons/Palette';
import ClickIcon from "..//Shared/svgIcons/cursor-click.js";
import UserDefined from "..//Shared/svgIcons/user-defined.js";
import ColorControl from "..//Shared/svgIcons/color-control.js";
import AddIcon from '@material-ui/icons/Add';
import { borders } from "@material-ui/system";
import Box from "@material-ui/core/Box";
import { Tooltip, FormControlLabel, Switch } from "@material-ui/core";

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

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function CheckboxList(props) {
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);
  const [userFileLayers, setUserFileLayer] = useState([]);
  //const theme = useTheme()
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [openUD, setOpenUD] = React.useState(true);
  const [state, setState] = React.useState({
    checkedB: true,
  });
  const [currentLayers, setCurrentLayers] = useState(stateApp.layers);
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const handleClick = () => {
    setOpen(!open);
  };
  const handleClickUD = () => {
    setOpenUD(!openUD);
  };

  const handleToggle = (layer) => () => {
    const currentIndex = stateApp.layers.findIndex((cLayer) => cLayer.layerName == layer.layerName);
    const currentLayers = [...stateApp.layers];
    if (currentLayers[currentIndex].layerSettings.visiable === false) {
      currentLayers[currentIndex].layerSettings.visiable = true;
    } else {
      currentLayers[currentIndex].layerSettings.visiable = false;
    }
    setStateApp((stateApp) => ({ ...stateApp, layers: currentLayers }));
  };

  const handleToggleInteraction = (layer) => () => {
    const currentIndex = stateApp.layers.findIndex((cLayer) => cLayer.layerName == layer.layerName);
    const currentLayers = [...stateApp.layers];
    if (currentLayers[currentIndex].layerSettings.interaction.interactionDetail.click === true) {
      currentLayers[currentIndex].layerSettings.interaction.interactionDetail.click = false;
      currentLayers[currentIndex].layerSettings.interaction.interactionDetail.hover = false;
    } else {
      currentLayers[currentIndex].layerSettings.interaction.interactionDetail.click = true;
      currentLayers[currentIndex].layerSettings.interaction.interactionDetail.hover = true;
    }
    setStateApp((stateApp) => ({ ...stateApp, layers: currentLayers }));
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
    //bgcolor: 'background.paper',
    //m: 1,
    borderLeft: 4,
    //style: { width: '5rem', height: '5rem' },
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
      }
    },
  }))(MenuItem);

  const StyledListItemSecondaryAction = withStyles((theme) => ({
    root: {
      "& .MuiButton-textPrimary": {
        color: theme.palette.common.white,
        background: "#17acdd",
        padding: "3px 10px",
      }
    }
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
        marginLeft: '5px',
        verticalAlign: 'middle'
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
  }

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      stateApp.layers,
      result.source.index,
      result.destination.index
    );

    setCurrentLayers(items);

    setStateApp({
      ...stateApp,
      layers: items,
    });
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
      selectedLayer: layer
    }));
  }

  const getLayerName = (layer) => {
    if (layer.layerCategory == 'M1 Layer') {
      return layer.layerName
    } else {
      return (
        <>
          <span>{layer.layerName}</span>
          <UserDefined />
        </>
      );
    }
  }

  useEffect(() => {
    if (stateApp.userFileLayers && stateApp.userFileLayers.length > 0) {
      setUserFileLayer(stateApp.userFileLayers)
    }
  }, [stateApp.userFileLayers]);

  const M1Layers = currentLayers.filter((layer) => layer.layerCategory == 'M1 Layer');
  const UdLayers = currentLayers.filter((layer) => layer.layerCategory == 'UD layer');

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
            <Button onClick={openAddLayer} color="primary" startIcon={<AddIcon />}>
              Add Layer
            </Button>
          </StyledListItemSecondaryAction>
        </StyledMenuItem>

        {/* <StyledListItem2 button onClick={handleClick}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="M1neral Layers" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </StyledListItem2>
        <Collapse in={open} timeout="auto" unmountOnExit> */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppableM1">
              {(provided, snapshot) => (
                <RootRef rootRef={provided.innerRef}>
                  <List className={classes.list}>
                    {stateApp.layers.map((layer, index) => {
                      const labelId = `checkbox-list-label-${index}`;
                      if (layer.layerSettings.showable) {
                        return (
                          <Draggable
                            key={labelId}
                            draggableId={labelId}
                            index={currentLayers.findIndex((clayer) => clayer.layerName == layer.layerName)}
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

                                {layer.layerSettings.colorable && layer.layerSettings.interaction.interactionAble && (
                                  <ListItemIcon onClick={() => handleColorPicker(layer)}>
                                    <ColorControl />
                                  </ListItemIcon>
                                )}

                                {layer.layerSettings.colorable && !layer.layerSettings.interaction.interactionAble && (
                                  <div style={{ paddingRight: 40 }}>
                                    <ListItemIcon onClick={() => handleColorPicker(layer)}>
                                      <ColorControl />
                                    </ListItemIcon>
                                  </div>
                                )}
                                
                                {layer.layerSettings.interaction.interactionAble && (
                                  <div style={{ paddingRight: 20 }}>
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
                                        layer.layerSettings.interaction.interactionDetail.click
                                      }
                                      tabIndex={-1}
                                      disableRipple
                                      inputProps={{ "aria-labelledby": labelId }}
                                      onChange={handleToggleInteraction(layer)}
                                    />
                                  </div>
                                )}
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={
                                        layer.layerSettings.visiable !== false
                                      }
                                      onChange={handleToggle(layer)}
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
