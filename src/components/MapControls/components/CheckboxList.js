import React, { useContext } from "react";
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
//import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import DragIndicator from "@material-ui/icons/DragIndicator";
//import IconButton from '@material-ui/core/IconButton';
//import EditIcon from '@material-ui/icons/Edit';
import { MapControlsContext } from "../MapControlsContext";
import { AppContext } from "../../../AppContext";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import LayersIcon from "@material-ui/icons/Layers";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import ClickIcon from "..//..//Shared/svgIcons/cursor-click.js";
import { borders } from "@material-ui/system";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";

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
  //const theme = useTheme()
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [openUD, setOpenUD] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClickUD = () => {
    setOpenUD(!openUD);
  };

  const handleToggle = (idx) => () => {
    const currentIndex = stateApp.checkedLayers.indexOf(idx);
    const newChecked = [...stateApp.checkedLayers];
    if (currentIndex === -1) {
      newChecked.push(idx);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setStateApp((stateApp) => ({ ...stateApp, checkedLayers: newChecked }));
  };

  const handleToggleInteraction = (idx) => () => {
    const currentIndex = stateApp.checkedLayersInteraction.indexOf(idx);
    const newChecked = [...stateApp.checkedLayersInteraction];
    if (currentIndex === -1) {
      newChecked.push(idx);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setStateApp((stateApp) => ({
      ...stateApp,
      checkedLayersInteraction: newChecked,
    }));
  };

  const handleToggleUserDefined = (idx) => () => {
    const currentIndex = stateApp.checkedUserDefinedLayers.indexOf(idx);
    const newChecked = [...stateApp.checkedUserDefinedLayers];
    if (currentIndex === -1) {
      newChecked.push(idx);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setStateApp((stateApp) => ({
      ...stateApp,
      checkedUserDefinedLayers: newChecked,
    }));
  };

  const handleToggleUserDefinedInteraction = (idx) => () => {
    const currentIndex = stateApp.checkedUserDefinedLayersInteraction.indexOf(
      idx
    );
    const newChecked = [...stateApp.checkedUserDefinedLayersInteraction];
    if (currentIndex === -1) {
      newChecked.push(idx);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setStateApp((stateApp) => ({
      ...stateApp,
      checkedUserDefinedLayersInteraction: newChecked,
    }));
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
        // },
      },
    },
  }))(MenuItem);

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

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      stateApp.styleLayers,
      result.source.index,
      result.destination.index
    );

    let checkedLayers = stateApp.checkedLayers.slice(0);
    const sourceIndex = checkedLayers.indexOf(result.source.index);

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

    for (let i = 0; i < checkedLayers.length; i++) {
      if (checkedLayers[i] <= to && checkedLayers[i] >= from) {
        checkedLayers[i] += direction;
      }
    }

    if (sourceIndex !== -1) {
      checkedLayers[sourceIndex] = result.destination.index;
    }

    let checkedLayersInteraction = stateApp.checkedLayersInteraction.slice(0);
    const sourceInteractionIndex = checkedLayersInteraction.indexOf(
      result.source.index
    );

    for (let i = 0; i < checkedLayersInteraction.length; i++) {
      if (
        checkedLayersInteraction[i] <= to &&
        checkedLayersInteraction[i] >= from
      ) {
        checkedLayersInteraction[i] += direction;
      }
    }

    if (sourceInteractionIndex !== -1) {
      checkedLayersInteraction[sourceInteractionIndex] =
        result.destination.index;
    }

    setStateApp({
      ...stateApp,
      styleLayers: items,
      checkedLayers: checkedLayers,
      checkedLayersInteraction: checkedLayersInteraction,
    });
  };

  const onDragEndUserDefined = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      stateApp.userDefinedLayers,
      result.source.index,
      result.destination.index
    );

    let checkedLayers = stateApp.checkedUserDefinedLayers.slice(0);
    const sourceIndex = checkedLayers.indexOf(result.source.index);

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

    for (let i = 0; i < checkedLayers.length; i++) {
      if (checkedLayers[i] <= to && checkedLayers[i] >= from) {
        checkedLayers[i] += direction;
      }
    }

    if (sourceIndex !== -1) {
      checkedLayers[sourceIndex] = result.destination.index;
    }

    let checkedInteractionLayers = stateApp.checkedUserDefinedLayersInteraction.slice(
      0
    );
    const sourceInteractionIndex = checkedInteractionLayers.indexOf(
      result.source.index
    );
    for (let i = 0; i < checkedInteractionLayers.length; i++) {
      if (
        checkedInteractionLayers[i] <= to &&
        checkedInteractionLayers[i] >= from
      ) {
        checkedInteractionLayers[i] += direction;
      }
    }

    if (sourceInteractionIndex !== -1) {
      checkedInteractionLayers[sourceInteractionIndex] =
        result.destination.index;
    }

    setStateApp({
      ...stateApp,
      userDefinedLayers: items,
      checkedUserDefinedLayers: checkedLayers,
      checkedUserDefinedLayersInteraction: checkedInteractionLayers,
    });
  };

  const ifLayerHaveData = (layer) => {
    //// temporary disabling the Title Layer
    if (layer.name === "Title") return false;
    ////

    if (
      (layer.name === "Tagged Wells/Owners" &&
        !(
          stateApp.wellListFromTagsFilter &&
          stateApp.wellListFromTagsFilter.length > 0
        )) ||
      (layer.name === "Search" &&
        !(
          stateApp.wellListFromSearch && stateApp.wellListFromSearch.length > 0
        )) ||
      (layer.name === "Tracked Wells" &&
        !(stateApp.trackedwells && stateApp.trackedwells.length > 0)) ||
      (layer.name === "Tracked Owners" &&
        !(stateApp.trackedOwnerWells && stateApp.trackedOwnerWells.length > 0))
    )
      return false;
    return true;
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
        </StyledMenuItem>

        <StyledListItem2 button onClick={handleClick}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="M1neral Layers" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </StyledListItem2>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppableM1">
              {(provided, snapshot) => (
                <RootRef rootRef={provided.innerRef}>
                  <List className={classes.list}>
                    {stateApp.styleLayers.map((layer, index) => {
                      const labelId = `checkbox-list-label-${index}`;
                      return (
                        <Draggable
                          key={labelId}
                          draggableId={labelId}
                          index={index}
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

                              <ListItemText id={labelId} primary={layer.name} />

                              {(layer.name === "Wells" || layer.name === "Permits" || layer.name === "Rig Activity") && (
                                <div style={{ paddingRight: 20 }}>
                                  <Checkbox
                                    icon={
                                      <CancelOutlinedIcon htmlColor="#12abe0" />
                                    }
                                    checkedIcon={<ClickIcon />}
                                    edge="start"
                                    checked={
                                      stateApp.checkedLayersInteraction
                                        ? stateApp.checkedLayersInteraction.indexOf(
                                            index
                                          ) !== -1
                                        : false
                                    }
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ "aria-labelledby": labelId }}
                                    onChange={handleToggleInteraction(index)}
                                  />
                                </div>
                              )}

                              <Checkbox
                                icon={<VisibilityOffIcon htmlColor="#fff" />}
                                checkedIcon={
                                  <VisibilityIcon htmlColor="#fff" />
                                }
                                edge="start"
                                checked={
                                  stateApp.checkedLayers
                                    ? stateApp.checkedLayers.indexOf(index) !==
                                      -1
                                    : false
                                }
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ "aria-labelledby": labelId }}
                                onChange={handleToggle(index)}
                              />
                            </StyledListItem>
                          )}
                        </Draggable>
                      );
                    })}
                  </List>
                </RootRef>
              )}
            </Droppable>
          </DragDropContext>
        </Collapse>

        <StyledListItem2 button onClick={handleClickUD}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="User Defined" />
          {openUD ? <ExpandLess /> : <ExpandMore />}
        </StyledListItem2>
        <Collapse in={openUD} timeout="auto" unmountOnExit>
          <DragDropContext onDragEnd={onDragEndUserDefined}>
            <Droppable droppableId="droppableUD">
              {(provided, snapshot) => (
                <RootRef rootRef={provided.innerRef}>
                  <List className={classes.list}>
                    {stateApp.userDefinedLayers.map((layer, index) => {
                      const labelId = `checkbox-list-label-${index}`;

                      return (
                        <Draggable
                          key={labelId}
                          draggableId={labelId}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Box borderColor={layer.idColor} {...defaultProps}>
                              <Tooltip
                                placement="top"
                                title={
                                  !ifLayerHaveData(layer)
                                    ? //// temporary disabling the Title Layer
                                      layer.name === "Title"
                                      ? "Temporary Disabled"
                                      : ////
                                        "Please choose the data first."
                                    : ""
                                }
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
                                    primary={layer.name}
                                    className={
                                      !ifLayerHaveData(layer)
                                        ? classes.disabledLayerTitle
                                        : ""
                                    }
                                  />

                                  <div style={{ paddingRight: 20 }}>
                                    <Checkbox
                                      disabled={!ifLayerHaveData(layer)}
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
                                        stateApp.checkedUserDefinedLayersInteraction
                                          ? stateApp.checkedUserDefinedLayersInteraction.indexOf(
                                              index
                                            ) !== -1
                                          : false
                                      }
                                      tabIndex={-1}
                                      disableRipple
                                      inputProps={{
                                        "aria-labelledby": labelId,
                                      }}
                                      onChange={handleToggleUserDefinedInteraction(
                                        index
                                      )}
                                    />
                                  </div>

                                  <Checkbox
                                    disabled={!ifLayerHaveData(layer)}
                                    icon={
                                      <VisibilityOffIcon
                                        htmlColor={
                                          !ifLayerHaveData(layer)
                                            ? "rgb(127, 149, 199)"
                                            : "#fff"
                                        }
                                      />
                                    }
                                    checkedIcon={
                                      <VisibilityIcon
                                        htmlColor={
                                          !ifLayerHaveData(layer)
                                            ? "rgb(127, 149, 199)"
                                            : "#fff"
                                        }
                                      />
                                    }
                                    edge="start"
                                    checked={
                                      stateApp.checkedUserDefinedLayers
                                        ? stateApp.checkedUserDefinedLayers.indexOf(
                                            index
                                          ) !== -1
                                        : false
                                    }
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ "aria-labelledby": labelId }}
                                    onChange={handleToggleUserDefined(index)}
                                  />
                                </StyledListItem>
                              </Tooltip>
                            </Box>
                          )}
                        </Draggable>
                      );
                    })}
                  </List>
                </RootRef>
              )}
            </Droppable>
          </DragDropContext>
        </Collapse>
      </StyledMenu>
    </ClickAwayListener>
  );
}
