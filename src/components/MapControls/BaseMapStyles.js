import React, { useContext, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import { MapControlsContext } from "./MapControlsContext";
import { AppContext } from "../../AppContext";
import RoomIcon from "@material-ui/icons/Room";
import RootRef from "@material-ui/core/RootRef";
import LayersIcon from "@material-ui/icons/Layers";
import { style } from "@material-ui/system";
import { Icon } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";
import IconButton from "@material-ui/core/IconButton";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import MapDarkIcon from "../Shared/svgIcons/MapDarkIcon";
import MapOutdoorIcon from "../Shared/svgIcons/MapOutdoorIcon";
import MapSatelliteIcon from "../Shared/svgIcons/MapSatelliteIcon";
import MapLightIcon from "../Shared/svgIcons/MapLightIcon";
import MapBasicIcon from "../Shared/svgIcons/MapBasicIcon";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Collapse from "@material-ui/core/Collapse";
import { List, FormControlLabel, Switch } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import DragIndicator from "@material-ui/icons/DragIndicator";

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

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #011133",
    background: "#263451",
    "& .MuiMenu-list": {
      background: "#011133 !important",
    },
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
  },
}))(MenuItem);

const useStyles = makeStyles((theme) => ({
  subHeaderItem: {
    backgroundColor: "#011133 !important",
    width: "400px",
  },
  nested: {
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
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
    },
  },
}));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function BaseMapStyles(props) {
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );

  const [stateApp, setStateApp] = useContext(AppContext);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setStateMapControls((state) => ({ ...state, anchorEl: null }));
  };
  const [mapStyles, setMapStyles] = useState([]);
  const handleClick = () => {
    setOpen(!open);
  };

  const onDragEnd = (result) => {
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

  const handleToggle = (idx) => () => {
    const currentIndex = stateApp.checkedBaseLayers.indexOf(idx);
    const newChecked = [...stateApp.checkedBaseLayers];
    if (currentIndex === -1) {
      newChecked.push(idx);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setStateApp((stateApp) => ({ ...stateApp, checkedBaseLayers: newChecked }));
  };

  const StyledListItem = withStyles((theme) => ({
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
        // },
      },
    },
  }))(ListItem);

  useEffect(() => {
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
  }, []);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <StyledMenu
        id="customized-menu"
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
          <ListItemText primary="Base Map" />
        </StyledMenuHeaderItem>
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

        {/* <StyledListItem2 button onClick={handleClick}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Map Layers" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </StyledListItem2>


        {stateApp.baseMapLayers.map((layer, index) => {
          const labelId = `checkbox-list-label-${index}`;

          return (
            <Collapse in={open} timeout="auto" unmountOnExit>
            <StyledListItem button className={classes.nested}>
              <ListItemIcon>
                <Checkbox
                  icon={<VisibilityOffIcon htmlColor="#fff" />}
                  checkedIcon={<VisibilityIcon htmlColor="#fff" />}
                  edge="start"
                  checked={
                    stateApp.checkedBaseLayers
                      ? stateApp.checkedBaseLayers.indexOf(index) !== -1
                      : false
                  }
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                  onChange={handleToggle(index)}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={layer.name} />
            </StyledListItem>
            </Collapse>
          );
        })} */}

        <StyledListItem2 button onClick={handleClick}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Base Map Layers" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </StyledListItem2>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <RootRef rootRef={provided.innerRef}>
                  <List style={{ padding: 0 }}>
                    {stateApp.baseMapLayers.map((layer, index) => {
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

                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={
                                      stateApp.checkedBaseLayers
                                        ? stateApp.checkedBaseLayers.indexOf(
                                            index
                                          ) !== -1
                                        : false
                                    }
                                    onChange={handleToggle(index)}
                                  />
                                }
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
      </StyledMenu>
    </ClickAwayListener>
  );
}
