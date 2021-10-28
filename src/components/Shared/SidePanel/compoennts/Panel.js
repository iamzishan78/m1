import React, { useContext, useState, useEffect } from "react";
import RootRef from "@material-ui/core/RootRef";
import { useMutation } from "@apollo/client";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Tooltip, Tab, Tabs, InputBase, IconButton } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import { MapControlsContext } from "../../../MapControls/MapControlsContext";
import { AppContext } from "../../../../AppContext";
import List from "@material-ui/core/List";
import LayersIcon from "@material-ui/icons/Layers";
import MapDarkIcon from "../../svgIcons/MapDarkIcon";
import MapOutdoorIcon from "../../svgIcons/MapOutdoorIcon";
import MapSatelliteIcon from "../../svgIcons/MapSatelliteIcon";
import MapLightIcon from "../../svgIcons/MapLightIcon";
import MapBasicIcon from "../../svgIcons/MapBasicIcon";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import HeatmapIcon from "@material-ui/icons/Gradient";
import BasemapIcon from "@material-ui/icons/Language";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

import { deepEqualObjects } from "../../functions";
import Layer from "./Layer";
import {
  useStyles,
  StyledMenu,
  StyledMenuItem,
  StyledListItem2,
  StyledListItemSecondaryAction,
  StyledMenuHeaderItem,
  StyledMenuHActionHeader,
} from "./style";
import SortableLayer from "./SortableLayer";
import { CircularProgress } from "@material-ui/core";
import { UPDATE_USER_MAP_SETTINGS } from "graphQL/useMutationUserMapSettings";

function Panel({ type, title, headerButton, handleToggle, onDragEnd, panelItems }) {
  const [stateMapControls, setStateMapControls] = useContext(MapControlsContext);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [updateUserMapSettings] = useMutation(UPDATE_USER_MAP_SETTINGS);

  const classes = useStyles();

  const [filteredItems, setFilteredItems] = useState([]);
  const [layerMap, setLayerMap] = useState([]);
  const [mapStyles, setMapStyles] = useState([]);
  const [search, setSearch] = useState("");
  const [searchState, setSearchState] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (stateApp.mapStyles && stateApp.mapStyles.length > 0) setMapStyles([...stateApp.mapStyles]);
  }, [stateApp.mapStyles]);

  useEffect(() => {
    switch (stateMapControls.selectedControl) {
      case "layer":
        setTab(0);
        break;
      case "heatMaps":
        setTab(1);
        break;
      case "base":
        setTab(2);
        break;
      default:
    }
  }, [stateMapControls.selectedControl]);

  useEffect(() => {
    filterLayers(search);
  }, [panelItems]);

  useEffect(() => {
    if ((type === "layer" || type === "heatMaps" || type === "marketplace") && filteredItems) {
      setLayerMap(filteredItems);
    } else if (type === "base" && filteredItems) {
      setLayerMap(filteredItems.filter((item) => item.name !== "Water" && item.name !== "Land"));
    }
  }, [stateMapControls.selectedControl, filteredItems, stateApp.checkedBaseLayers, stateApp.checkedHeatLayers, type]);

  const togglePullout = () => {
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      expandedPanel: !stateMapControls.expandedPanel,
    }));
  };

  const setBaseMap = (style, type) => {
    setStateApp((stateApp) => ({
      ...stateApp,
      mapVars: { ...stateApp.mapVars, styleId: style.name },
    }));
    updateUserMapSettings({
      variables: {
        settings: {
          user: stateApp.user.mongoId,
          type,
          settings: {
            activeBaseMap: style.name,
          },
        },
      },
    });
  };

  const filterLayers = (search) => {
    if (!search) setFilteredItems(panelItems);
    else {
      switch (type) {
        case "layer":
          setFilteredItems(panelItems.filter(i => i.layerName.toLowerCase().includes(search.toLowerCase())));
          break;
        case "base":
        case "heatMaps":
          setFilteredItems(panelItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase())));
          break;
        default:
      }
    }
  }

  const layerIcons = React.useMemo(() => {
    return [
      {
        action: "layer",
        icon: <LayersIcon fontSize="medium" />,
      },
      {
        action: "heatMaps",
        icon: <HeatmapIcon fontSize="medium" />,
      },
      {
        action: "base",
        icon: <BasemapIcon fontSize="medium" />,
      },
    ];
  }, []);

  const getBasemapImageBox = () => {
    return (
      <>
        <div>
          {mapStyles.map((style) => (
            <StyledMenuItem
              disableRipple
              key={style.id}
              role={undefined}
              onClick={() => {
                setBaseMap(style, "baseMap");
              }}
            >
              <Grid container alignContent="center" alignItems="center">
                <Grid item>
                  {style.name === "Outdoors" && <MapOutdoorIcon />}
                  {style.name === "Satellite" && <MapSatelliteIcon />}
                  {style.name === "Light" && <MapLightIcon />}
                  {style.name === "Dark" && <MapDarkIcon />}
                  {style.name === "Basic" && <MapBasicIcon />}
                </Grid>

                <Grid item>
                  <ListItemText primary={style.name} style={{ paddingLeft: "25px" }} />
                </Grid>
              </Grid>
            </StyledMenuItem>
          ))}
        </div>

        <StyledListItem2>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary={`${title} Layers`} />
        </StyledListItem2>
      </>
    );
  };

  const displayList = (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppableM1">
        {(provided, snapshot) => (
          <RootRef rootRef={provided.innerRef}>
            {type === "base" && (
              <List className={classes.list}>
                <Layer layerMap={layerMap} type={type} handleToggle={handleToggle} />
              </List>
            )}

            {type === "heatMaps" && (
              <List className={classes.heatmapList}>
                <Layer layerMap={layerMap} type={type} handleToggle={handleToggle} />
              </List>
            )}
          </RootRef>
        )}
      </Droppable>
    </DragDropContext>
  );
  const a11yProps = (index) => ({
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  });

  const clearSearch = () => {
    setTimeout(() => {
      setSearch("");
      setSearchState(false);
      filterLayers();
    }, 200);
  };
  const setSearchValue = (value) => {
    setSearch(value);
    filterLayers(value);
  }
  return (
    <div>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          width: "50px",
          maxWidth: "425px",
          left: stateMapControls.expandedPanel ? "0px" : type === "marketplace" ? "-567px" : "0px",
          listStyleType: "none",
          zIndex: "1240",
        }}
      >
        <StyledMenu
          id="checklist-menu"
          style={!stateMapControls.expandedPanel ? { display: "none" } : { minWidth: "425px" }}
          keepMounted
          open={Boolean(stateMapControls.selectedControl)}
        >
          <StyledMenuHeaderItem disableRipple key="subheader" role={undefined} dense className={classes.subHeaderItem}>
            <ListItemText primary={title} />

            {headerButton && (
              <StyledListItemSecondaryAction>
                <Button onClick={headerButton.fn} color="secondary" variant="outlined" startIcon={headerButton.icon}>
                  {headerButton.text}
                </Button>
              </StyledListItemSecondaryAction>
            )}
          </StyledMenuHeaderItem>

          {/* Layer Icons */}
          <StyledMenuHActionHeader>
            <Grid container direction="row" justify="space-between" alignItems="center" className={classes.toolbarActions}>
              {!searchState && (
                <Grid item>
                  <Tabs
                    value={tab}
                    onChange={(event, tab) => setTab(tab)}
                    aria-label="simple tabs example"
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                  >
                    {layerIcons.map((action, index) => (
                      <Tab
                        icon={action.icon}
                        {...a11yProps(index)}
                        onClick={() => setStateMapControls((stateMapControls) => ({ ...stateMapControls, selectedControl: action.action }))}
                      />
                    ))}
                  </Tabs>
                </Grid>
              )}
              <Grid item xs={searchState ? 12 : 1}>
                <div className={classes.search}>
                  <Tooltip title="Search" className={classes.iconSearch} onClick={() => document.getElementById("searchInput").focus()}>
                    <SearchIcon />
                  </Tooltip>
                  <InputBase
                    id="searchInput"
                    fullWidth
                    placeholder="Search by Layer Name"
                    value={search}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    autoComplete="off"
                    inputProps={{ "aria-label": "search" }}
                    onFocus={() => setSearchState(true)}
                    onChange={(evt) => setSearchValue(evt.target.value)}
                  />
                  {searchState && (
                    <Tooltip title="Clear" className={classes.iconClear}>
                      <IconButton
                        size="small"
                        htmlColor="white"
                        onClick={clearSearch}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </Grid>
            </Grid>
          </StyledMenuHActionHeader>

          {/* base Stuff */}
          {type === "base" && getBasemapImageBox()}

          {type === "layer" ? (
            layerMap && layerMap[0]?.type ? (
              <SortableLayer layerMap={layerMap} panelItems={panelItems} />
            ) : (
              <Box height="calc(100vh - 50px - 64px)" bgcolor="#040e24" display="flex" justifyContent="center">
                <CircularProgress style={{ top: "50%", position: "absolute" }} size={40} color="secondary" />
              </Box>
            )
          ) : type === "base" ? (
            <Collapse in={true} timeout="auto" unmountOnExit>
              {displayList}
            </Collapse>
          ) : (
            displayList
          )}
        </StyledMenu>
        <div className={classes.pulloutBox} onClick={togglePullout}>
          {stateMapControls.expandedPanel ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
        </div>
        {/* // </ClickAwayListener> */}
      </div>
    </div>
  );
}

export default React.memo(Panel, deepEqualObjects);
