import React, { useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { get } from "lodash";
import { TransitionGroup } from "react-transition-group";
import RootRef from "@material-ui/core/RootRef";
import { useMutation } from "@apollo/client";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Tab, Tabs, Chip } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import { AppContext } from "../../../../AppContext";
import List from "@material-ui/core/List";
import LayersIcon from "@material-ui/icons/Layers";
import MapDarkIcon from "../../pngImages/Dark.jpg";
import MapOutdoorIcon from "../../pngImages/Outdoors.jpg";
import MapSatelliteIcon from "../../pngImages/Satellite.jpg";
import MapLightIcon from "../../pngImages/Light.jpg";
import MapBasicIcon from "../../pngImages/Basic.jpg";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import BasemapIcon from "@material-ui/icons/Language";
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
import { UPDATE_USER_MAP_SETTINGS } from "graphQL/useMutationUserMapSettings";
// Contexts
import { NavigationContext } from "components/Navigation/NavigationContext";
import AddGroup from "./AddGroup";
import { mapControlsController } from "hookstate/mapControlsController";
import { layerController } from "hookstate/layerStateController";
import { mapStateController } from "hookstate/mapStateController";

const layerIcons = [
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

const BasemapImageBox = React.memo(({ mapStyles, setBaseMap, title, currentStyle }) => {

  return (
    <>
      <div>
        {mapStyles.map((style) => (
          <StyledMenuItem
            disableRipple
            key={style.id}
            role={undefined}
            style={{
              background: currentStyle === style.name ? '#4B618F' : ''
            }}
            onClick={() => {
              if (currentStyle === style.name) return;
              setBaseMap(style, "baseMap");
            }}
          >
            <Grid container alignContent="center" alignItems="center">
              <Grid item>
                {style.name === "Outdoors" && <Box component="img" src={MapOutdoorIcon} />}
                {style.name === "Satellite" && <Box component="img" src={MapSatelliteIcon} />}
                {style.name === "Light" && <Box component="img" src={MapLightIcon} />}
                {style.name === "Dark" && <Box component="img" src={MapDarkIcon} />}
                {style.name === "Basic" && <Box component="img" src={MapBasicIcon} />}
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
});

const DisplayList = React.memo(({ onDragEnd, type, classes, layerMap, handleToggle }) => (
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
));

const StyledSecondaryMenu = () => {

  const {
    addLayer,
    selectedLayerControl,
    manageSourceLayer,
    manageTransferData,
    manageLayer,
    mapControlsStateValues,
  } = mapControlsController.useState(
    [
      'addLayer',
      'selectedLayerControl',
      'manageSourceLayer',
      'manageTransferData',
      'manageLayer',
    ],
    'mapControlsStateValues'
  );

  const secondaryPanelState = React.useMemo(() => {
    if (mapControlsStateValues.addLayer || mapControlsStateValues.selectedLayerControl || mapControlsStateValues.manageTransferData || mapControlsStateValues.manageSourceLayer || mapControlsStateValues.manageLayer) {
      return true;
    } else return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addLayer, manageSourceLayer, manageTransferData, selectedLayerControl, manageLayer]);

  return <StyledMenu
    id="layer-secondary-panel"
    keepMounted
    open={secondaryPanelState}
    style={{ display: secondaryPanelState ? "flex" : "none", minWidth: "525px" }}
  >
    <TransitionGroup transitionName="carousel" transitionEnterTimeout={800} transitionLeaveTimeout={500}>
      <SecondaryPanel />
    </TransitionGroup>
  </StyledMenu>
}


function Panel({ type, title, headerButton, handleToggle, onDragEnd, panelItems }) {
  const { selectedControl, expandedPanel, mapControlsStateValues } = mapControlsController.useState(['selectedControl', 'expandedPanel'], 'mapControlsStateValues');
  const { mapStateValues } = mapStateController.useState(['mapVars', 'defaultMapVars'], 'mapStateValues');
  const [stateApp] = useContext(AppContext);
  const [stateNav] = useContext(NavigationContext);
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
    switch (mapControlsStateValues.selectedControl) {
      case "layer":
        setTab(0);
        break;
      // case "heatMaps":
      //   setTab(1);
      //   break;
      case "base":
        setTab(1);
        break;
      case "filter":
        setTab(2);
        break;
      default:
    }
  }, [selectedControl]);

  useEffect(() => {
    filterLayers(search);
  }, [panelItems]);

  useEffect(() => {
    if ((type === "layer" || type === "heatMaps" || type === "marketplace") && filteredItems) {
      setLayerMap(filteredItems);
    } else if (type === "base" && filteredItems) {
      setLayerMap(filteredItems.filter((item) => item.name !== "Water" && item.name !== "Land"));
    }
  }, [selectedControl, filteredItems, stateApp.checkedBaseLayers, stateApp.checkedHeatLayers, type]);

  useEffect(() => {
    dispatch(toggleLayersFiltersPanel(!!mapControlsStateValues.expandedPanel));
  }, [dispatch, expandedPanel]);

  useEffect(() => {
    const mapDefaultPosition = get(updatedMapSettings, "updateUserMapSettings.settings.settings.mapDefaultPosition");
    // Only when position is changed and not style
    if (mapDefaultPosition && !deepEqualObjects(mapStateValues.defaultMapVars.center, mapDefaultPosition.center)) {
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
      mapStateController.updateState({
        defaultMapVars: {
          ...mapStateValues.defaultMapVars,
          ...settings,
        }
      })
    }
  };

  const togglePullout = () => {
    mapControlsController.updateState({
      expandedPanel: !mapControlsController.getValue('expandedPanel'),
      addLayer: false,
      manageSourceLayer: false,
      manageLayer: false,
    })
  };

  const setBaseMap = (style, type) => {
    const map = window.mapRef;
    layerController.resetMapStates();
    mapStateController.updateState({
      mapVars: {
        ...mapStateValues.mapVars,
        center: map.getCenter(),
        zoom: map.getZoom(),
        styleId: style.name
      }
    })

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

  useEffect(() => {
    togglePullout()
  }, [])

  return (
    <div>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          width: "50px",
          maxWidth: "425px",
          left: mapControlsStateValues.expandedPanel ? "0px" : type === "marketplace" ? "-567px" : "0px",
          listStyleType: "none",
          zIndex: "2",
        }}
      >
        <StyledMenu
          id="layer-side-panel"
          style={!mapControlsStateValues.expandedPanel ? { display: "none" } : { minWidth: "425px" }}
          keepMounted
          open={Boolean(mapControlsStateValues.selectedControl)}
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
                        onClick={() => mapControlsController.updateState({ selectedControl: action.action })}
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
            {type === "base" && <BasemapImageBox mapStyles={mapStyles} setBaseMap={setBaseMap} currentStyle={mapStateValues.mapVars.styleId} title={title} />}

            {type === "layer" && mapControlsStateValues.expandedPanel && (<SortableLayer search={search} mongoId={stateApp.user.mongoId} />)}
            {type === "base" && (
              <Box height="calc((100vh - 50px) - 631px)" overflow='hidden scroll' >
                <Collapse in={true} timeout="auto" unmountOnExit>
                  <DisplayList onDragEnd={onDragEnd} type={type} classes={classes} layerMap={layerMap} handleToggle={handleToggle} />
                </Collapse>
                <MapPositions
                  setMapDefaultPosition={setMapDefaultPosition}
                  defaultMapVars={mapStateValues.defaultMapVars}
                  mapVars={mapStateValues.mapVars}
                />
              </Box>
            )}
            {type === "heatMaps" && <DisplayList onDragEnd={onDragEnd} type={type} classes={classes} layerMap={layerMap} handleToggle={handleToggle} />}
            {type === "filter" && <LayerFilters />}
          </div>
        </StyledMenu>
        <StyledSecondaryMenu />
        <div className={classes.pulloutBox} onClick={() => togglePullout()}>
          {mapControlsStateValues.expandedPanel ? <ArrowBackIosIcon id="arrowBackIcon" /> : <ArrowForwardIosIcon />}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Panel, deepEqualObjects);
