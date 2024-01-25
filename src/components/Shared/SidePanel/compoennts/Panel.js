import React, { useContext, useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { get } from "lodash";
import { TransitionGroup } from "react-transition-group";
import RootRef from "@material-ui/core/RootRef";
import { useMutation } from "@apollo/client";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Tooltip, Tab, Tabs, InputBase, IconButton, Chip } from "@material-ui/core";
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
import FilterAltIcon from "components/Shared/svgIcons/FilterAltIcon";
import SecondaryPanel from "components/Shared/SecondaryPanel";
import Datasets from 'components/Shared/SidePanel/compoennts/Datasets'
import LayerFilters from "components/Shared/SidePanel/compoennts/Filters/LayerFilters";
import MapPositions from "components/Shared/SidePanel/compoennts/MapPositions";
import { showErrorMessage, showSuccessMessage } from "actions";

import { deepEqualObjects } from "../../functions";
import Layer from "./Layer";
import { toggleLayersFiltersPanel } from "actions/MainMap";

import {
  useStyles,
  StyledMenu,
  StyledMenuItem,
  StyledListItem2,
  StyledListItemSecondaryAction,
  StyledMenuHeaderItem,
  StyledMenuHActionHeader,
  StyledMenuSecondaryHeaderItem,
} from "./style";
import SortableLayer from "./SortableLayer";
import { CircularProgress } from "@material-ui/core";
import { UPDATE_USER_MAP_SETTINGS } from "graphQL/useMutationUserMapSettings";
// Contexts
import { NavigationContext } from "components/Navigation/NavigationContext";
import AddGroup from "./AddGroup";

function Panel({ type, title, headerButton, handleToggle, onDragEnd, panelItems, showSidePanel }) {
  const [stateMapControls, setStateMapControls] = useContext(MapControlsContext);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [totalFilterCount, setTotalFilterCount] = useState(null);
  const [totalHitMapCount, setTotalHitMapCount] = useState(null);
  const [updateUserMapSettings, { data: updatedMapSettings }] = useMutation(UPDATE_USER_MAP_SETTINGS);

  const classes = useStyles();
  const dispatch = useDispatch();

  const [filteredItems, setFilteredItems] = useState([]);
  const [layerMap, setLayerMap] = useState([]);
  const [mapStyles, setMapStyles] = useState([]);
  const [search, setSearch] = useState("");
  const [searchState, setSearchState] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    setTotalFilterCount(stateNav.totalFilterCount);
  }, [stateNav]);

  useEffect(() => {
    setTotalHitMapCount(stateApp.checkedHeats.length);
  }, [stateApp]);

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
      case "filter":
        setTab(3);
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

  useEffect(() => {
    dispatch(toggleLayersFiltersPanel(!!stateMapControls.expandedPanel));
  }, [dispatch, stateMapControls.expandedPanel]);

  useEffect(() => {
    const mapDefaultPosition = get(updatedMapSettings, "updateUserMapSettings.settings.settings.mapDefaultPosition");
    // Only when position is changed and not style
    if (mapDefaultPosition && !deepEqualObjects(stateApp.defaultMapVars.center, mapDefaultPosition.center)) {
      if (mapDefaultPosition) {
        dispatch(showSuccessMessage("Map Default Position saved."));
      } else if (updatedMapSettings) {
        dispatch(showErrorMessage("Error in saving Map Default Position."));
      }
    }
    setMapVars(mapDefaultPosition);
  }, [updatedMapSettings]);

  const setMapVars = (settings) => {
    if (settings) {
      // setSettings(settings);
      setStateApp((stateApp) => ({
        ...stateApp,
        defaultMapVars: {
          ...stateApp.defaultMapVars,
          ...settings,
        },
      }));
    }
  };

  const togglePullout = (expandedPanel) => {
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      expandedPanel: expandedPanel ?? !stateMapControls.expandedPanel,
      addLayer: false,
      manageSourceLayer: false,
      manageLayer: false,
    }));
  };

  const setBaseMap = (style, type) => {
    setStateApp((stateApp) => ({
      ...stateApp,
      mapVars: { ...stateApp.mapVars, styleId: style.name },
      defaultMapVars: { ...stateApp.mapVars, styleId: style.name },
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

  const setMapDefaultPosition = (params) => {
    updateUserMapSettings({
      variables: {
        settings: {
          user: stateApp.user.mongoId,
          type: "baseMap",
          settings: {
            mapDefaultPosition: {
              ...params,
            },
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
          setFilteredItems(panelItems?.filter((i) => (i.layerName ?? i.name).toLowerCase().includes(search.toLowerCase())));
          break;
        case "base":
        case "heatMaps":
          setFilteredItems(panelItems?.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())));
          break;
        default:
      }
    }
  };

  const layerIcons = React.useMemo(() => {
    return [
      {
        action: "layer",
        icon: <LayersIcon fontSize="medium" />,
      },
      // {
      //   action: "heatMaps",
      //   icon: <HeatmapIcon fontSize="medium" />,
      // },
      {
        action: "base",
        icon: <BasemapIcon fontSize="medium" />,
      },
      {
        action: "filter",
        icon: <FilterAltIcon fontSize="medium" />,
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

        <div
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <hr
            style={{
              border: "1px solid #263451",
              borderRadius: "5px",
              marginTop: "30px",
              marginBottom: "10px",
            }}
          />
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
  };

  const secondaryPanelState = React.useMemo(() => {
    if (stateMapControls.addLayer || stateMapControls.selectedLayer || stateMapControls.manageTransferData || stateMapControls.manageSourceLayer || stateMapControls.manageLayer) {
      return true;
    } else return false;
  }, [stateMapControls.addLayer, stateMapControls.manageSourceLayer, stateMapControls.manageTransferData, stateMapControls.selectedLayer, stateMapControls.manageLayer]);

  useEffect(() => {
    togglePullout(showSidePanel)
  }, [showSidePanel])

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
          zIndex: "2",
        }}
      >
        <StyledMenu
          id="layer-side-panel"
          style={!stateMapControls.expandedPanel ? { display: "none" } : { minWidth: "425px" }}
          keepMounted
          open={Boolean(stateMapControls.selectedControl)}
        >
          <StyledMenuHeaderItem disableRipple key="subheader" role={undefined} dense className={classes.subHeaderItem}>
            <ListItemText primary="Map" />
          </StyledMenuHeaderItem>

          {/* Layer Icons */}
          <StyledMenuHActionHeader>
            <Grid container direction="row" justify="space-between" alignItems="center" className={classes.toolbarActions}>
              {!searchState && (
                <Grid item>
                  <Tabs value={tab} aria-label="find-map-tabs" indicatorColor="primary" textColor="primary" variant="fullWidth">
                    {layerIcons.map((action, index) => (
                      <Tab
                        icon={action.icon}
                        {...a11yProps(index)}
                        onClick={() => setStateMapControls((stateMapControls) => ({ ...stateMapControls, selectedControl: action.action }))}
                      />
                    ))}
                    {totalHitMapCount !== 0 && <Chip color="info" label={totalHitMapCount} className={classes.totalHitMap} />}
                    {totalFilterCount !== 0 && <Chip color="info" label={totalFilterCount} className={classes.totalFilter} />}
                  </Tabs>
                </Grid>
              )}
              {/* <Grid item xs={searchState ? 12 : 1}>
                <div className={classes.search}>
                  {
                    type === "layer" &&
                    <>
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
                          <IconButton size="small" htmlColor="white" onClick={clearSearch}>
                            <ClearIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  }
                </div>
              </Grid> */}
            </Grid>
          </StyledMenuHActionHeader>

          {type === "layer" &&
            <Datasets search={search} headerButton={headerButton} />
          }

          <div className={classes.panelContent}>

            <StyledMenuSecondaryHeaderItem>
              <div>
                <ListItemText primary={title} />
                {
                  type === "layer" &&
                  <AddGroup userId={stateApp.user.mongoId} above={layerMap[layerMap.length - 1]?.id} />
                }
              </div>
              {headerButton && (
                <StyledListItemSecondaryAction>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button onClick={() => headerButton.fn()} color="secondary" variant="outlined" startIcon={headerButton.icon}>
                      {headerButton.text}
                    </Button>
                  </div>
                </StyledListItemSecondaryAction>
              )}

            </StyledMenuSecondaryHeaderItem>

            {/* base Stuff */}
            {type === "base" && getBasemapImageBox()}

            {type === "layer" && showSidePanel &&
              (<SortableLayer search={search} mongoId={stateApp.user.mongoId} />)}
            {type === "base" && (
              <Box height="calc((100vh - 50px) - 631px)" overflow='hidden scroll' >
                <Collapse in={true} timeout="auto" unmountOnExit>
                  {displayList}
                </Collapse>
                <MapPositions
                  setMapDefaultPosition={setMapDefaultPosition}
                  defaultMapVars={stateApp.defaultMapVars}
                  mapVars={stateApp.mapVars}
                />
              </Box>
            )}
            {type === "heatMaps" && displayList}
            {type === "filter" && <LayerFilters />}
          </div>
        </StyledMenu>
        <StyledMenu
          id="layer-secondary-panel"
          keepMounted
          open={secondaryPanelState}
          style={{ display: secondaryPanelState ? "flex" : "none", minWidth: "525px" }}
        >
          <TransitionGroup transitionName="carousel" transitionEnterTimeout={800} transitionLeaveTimeout={500}>
            <SecondaryPanel />
          </TransitionGroup>
        </StyledMenu>
        <div className={classes.pulloutBox} onClick={() => togglePullout()}>
          {stateMapControls.expandedPanel ? <ArrowBackIosIcon id="arrowBackIcon" /> : <ArrowForwardIosIcon />}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Panel, deepEqualObjects);
