import React, { Fragment, useState, useContext, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../AppContext";
import Card from "@material-ui/core/Card";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import M1nTable from "../Shared/M1nTable/M1nTable";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Button from "@material-ui/core/Button";
import { setMapGridCardState } from "../../actions";
import OwnersSummaryCard from "../OwnersSummaryCard/OwnersSummaryCard";
import TabPanels, { TabPanel } from "components/Shared/TabPanels";

import DockMenu from "./DockMenu";
import ShapeGridWellsTable from "components/Table/Wells/ShapeGridWellsTable";
import ShapeGridTaxOwnersTable from "components/Table/TaxOwners/ShapeGridTaxOwnersTable";
import MapGridContactTable from "components/Table/Contact/MapGridContactTable";

import SearchPanel from "./components/SearchPanel";
import { platformDataInitialData, platformDataWellsInitialData, snapGridSideBarData } from "./components/data";
import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { drawController } from "hookstate/drawStateController";
import MRTTable from "components/MRTTable";
import { mapControlsController } from "hookstate/mapControlsController";
import { tableGlobalController } from "hookstate/tableController";
import { layerFiltersController } from "hookstate/layerFiltersController";
import { generateFileFilters } from "components/Map/DeckGL/helpers/common";

const useStyles = makeStyles((theme) => {
  return {
    card: {
      "& .noDrag": {
        transform: "translate(0px, 0px) !important",
        transition: "transform 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out",
        WebkitTransition: "transform 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out",
      },
      "& .MuiInput-inputTypeSearch": {
        width: "96%",
      },
    },
    rootList: {
      width: ({ mapGridCardActivated }) => (mapGridCardActivated === "min" ? "57vw" : mapGridCardActivated === "exp" ? "96vw" : "57vw"),
      height: ({ mapGridCardActivated }) => (mapGridCardActivated === "min" ? "60vh" : mapGridCardActivated === "exp" ? "91vh" : "60vh"),
      left: ({ mapGridCardActivated, expandGrid }) => (mapGridCardActivated === "exp" ? "2vw" : "2vw"),
      top: ({ mapGridCardActivated }) => (mapGridCardActivated === "exp" ? "5vh" : "12vh"),
      zIndex: "1300",
      position: "fixed",
    },
    dockMenu: ({ dockMenu, mapLayersPanelExtended }) => {
      let css = {},
        leftMargin = mapLayersPanelExtended ? 477 : 52;
      if (dockMenu === "bottom" || dockMenu === "top") {
        css = {
          top: dockMenu === "bottom" ? "50vh" : "6vh",
          height: "50vh",
        };
        if (dockMenu === "top") {
          css = { ...css, width: `calc(100vw - ${leftMargin + 20}px)`, left: `${leftMargin + 20}px` };
        } else {
          css = { ...css, width: `calc(100vw - ${leftMargin}px)`, left: `${leftMargin}px` };
        }
      } else if (dockMenu === "left") {
        css = {
          left: `${leftMargin + 20}px`,
          width: "50vw",
          height: "94vh",
          top: "6vh",
        };
      } else if (dockMenu === "right") {
        css = {
          left: "50vw",
          width: "50vw",
          height: "94vh",
          top: "6vh",
        };
      } else if (dockMenu === "full") {
        css = {
          left: `${leftMargin + 20}px`,
          width: `calc(100vw - ${leftMargin + 20}px)`,
          height: "94vh",
          top: "6vh",
        };
      }
      css = { ...css, zIndex: "1300", position: "fixed" };
      return css;
    },
    tapsRoot: {
      // flexGrow: 1,
      "& .MuiTab-root": {
        textTransform: "none",
      },
    },
    appBar: {
      backgroundColor: "#F2F2F2",
      borderBottom: "1px solid rgba(224, 224, 224, 1)",
      boxShadow: "none",
      color: "#757575",
      cursor: "context-menu",
      "& .MuiIconButton-root:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
      },
      "& button": {
        cursor: "pointer",
      },
    },
    tapsPanels: {
      "& .MuiBox-root": { padding: "0" },
    },
    tapsPanelsPadding: {
      "& .MuiBox-root": { padding: "0" },
    },
    mainPanelsDiv: {
      height: "100%",
      maxHeight: "100vh",
      position: "relative",
      "&::-webkit-scrollbar": {
        width: "0.75em",
        height: "0.75em",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#929292",
        borderRadius: 10,
      },
      "& div": {
        "&>.MuiPaper-root": {
          "&>:nth-child(3)": {
            minHeight: ({ mapGridCardActiveTap, mapGridCardActivated, userGridViewFilters, dockMenu }) =>
              mapGridCardActiveTap === 0
                ? mapGridCardActivated === "exp"
                  ? "calc(91vh - 233px)"
                  : dockMenu === "bottom"
                    ? userGridViewFilters?.length > 0
                      ? "calc(58.75vh - 320px)"
                      : "calc(58.75vh - 280px)"
                    : userGridViewFilters?.length > 0
                      ? "calc(58.75vh - 275px)"
                      : "calc(58.75vh - 235px)"
                : mapGridCardActivated === "exp"
                  ? "calc(91vh - 183px)"
                  : "calc(58.75vh - 183px)",
            "@media (max-height:930px)": {
              maxHeight: ({ dockMenu }) => {
                if (dockMenu === "bottom" || dockMenu === "top") return "calc(50vh - 590px)";
                else if (dockMenu === "left" || dockMenu === "right") return "calc(100vh - 204px)";
                else if (dockMenu === "full") return "calc(100vh - 153px)";
              },
            },
            "@media (max-height:1600px)": {
              maxHeight: ({ dockMenu, userGridViewFilters }) => {
                if (dockMenu === "bottom" || dockMenu === "top") return "calc(50vh - 135px)";
                else if (dockMenu === "left" || dockMenu === "right")
                  return userGridViewFilters?.length > 0 ? "calc(100vh - 235px)" : "calc(100vh - 200px)";
                else if (dockMenu === "full") return userGridViewFilters?.length ? "calc(100vh - 275px)" : "calc(100vh - 183px)";
              },
            },
          },
        },
      },
    },
    tapsLabelsButtons: {
      boxShadow: "none",
      backgroundColor: "#fff",
      color: "#757575",
      "&:hover": { boxShadow: "none !important" },
    },
    tapsLabelsButtonsSelected: {
      boxShadow: "none",
      color: "#fff",
      backgroundColor: theme.palette.secondary.main,
      "&:hover": { color: "#757575", boxShadow: "none !important" },
    },
    viewportWells: {
      textAlign: ({ viewportWells }) => (viewportWells ? "inherit" : "center"),
      "& #minimumZoomRequired": {
        margin: "30px",
        fontSize: "1.25rem",
        fontFamily: "Poppins",
        fontWeight: "500",
        lineHeight: "1.6",
        display: ({ viewportWells }) => (viewportWells ? "none" : "block"),
      },
      "& #viewportWellsTable": {
        display: ({ viewportWells }) => (viewportWells ? "block" : "none"),
      },
    },
    selectBoundary: {
      background: "white",
      width: "180px",
      height: "35px",
      marginTop: "6px",
      marginBottom: "6px",
      marginLeft: "10px",
      "& .MuiSelect-select.MuiSelect-select": {
        paddingLeft: "10px",
      },
    },
  };
});

const TabLabels = ({ labels, value, setValue }) => {
  const classes = useStyles();

  return (
    <>
      {labels &&
        labels.length &&
        labels.map((label, i) => (
          <Button
            key={i}
            size="small"
            variant="contained"
            className={value === i ? classes.tapsLabelsButtonsSelected : classes.tapsLabelsButtons}
            onClick={() => {
              setValue(i);
            }}
          >
            {label}
          </Button>
        ))}
    </>
  );
};

function MapGridCard(props) {
  // contexts
  const [stateApp] = useContext(AppContext);

  const { drawStateValues } = drawController.useState(['selectedPolygonString'], 'drawStateValues');

  const { layerGridCard, selectedLayer, mapControlsStateValues } = mapControlsController.useState(['selectedLayer', 'selectedDataset', 'layerGridCard', 'mapGridCardActivated'], 'mapControlsStateValues');
  const layerInitialData = platformDataInitialData.find(data => data.value === 'layer');
  // function state
  const [searchTapValue, SearchTapValue] = useState(mapControlsStateValues.layerGridCard ? layerInitialData : platformDataInitialData[0]);
  const [viewportTapValue, ViewportTapValue] = useState(0);
  const [dockMenu, SetDockMenu] = useState("bottom");
  const [trackedTapValue, TrackedTapValue] = useState(0);

  // selectors
  const { mapGridCardActiveTap, selectedOwner } = useSelector(({ MapGridCard }) => MapGridCard, shallowEqual);
  const mapLayersPanelExtended = useSelector(({ MainMap }) => MainMap.mapLayersPanelExtended);
  const userGridViewFilters = useSelector(({ session }) => session.userGridViewSettings?.filters);

  const dispatch = useDispatch();

  const onClose = (e) => {
    e.stopPropagation();
    mapControlsController.updateState({ selectedDataset: null, mapGridCardActivated: false, });
    layerFiltersController.clearSnapGridFilters()
    dispatch(
      setMapGridCardState({
        selectedOwner: null,
        selectedOwnerWellIntsSummary: null,
      })
    );
  }

  const shapeFileTableOverride = useMemo(() => {
    // generic generateFileFilters used for files so that it remain consistent in all places.
    if (mapControlsStateValues?.selectedLayer?.layerShapeName) {
      const fileQuery = generateFileFilters({ fileLayer: mapControlsStateValues.selectedLayer })
      tableGlobalController.reInitialized();
      return {
        filterLayerType: mapControlsStateValues.selectedLayer?.layerShapeName,
        maxTableHeight: '40vh',
        toolbarInternalActions: {
          onClose,
          style: {
            marginRight: '0.5rem',
          },
        },
        defaultFilters: fileQuery.variables.filters,
        advanceSearch: fileQuery.variables.search.advanceSearch
      };
    } else {
      return {}
    }

  }, [selectedLayer]);

  React.useEffect(() => {
    if (!mapControlsStateValues.layerGridCard) {
      SearchTapValue(platformDataInitialData[0])
    } else {
      SearchTapValue(layerInitialData)
    }
  }, [layerGridCard]);

  const setSelectedDockMenu = (state) => {
    if (dockMenu !== state) {
      SetDockMenu(state);
    }
  };

  const setSearchTapValue = (state) => {
    if (searchTapValue !== state) {
      SearchTapValue(state);
    }
  };

  const setTrackedTapValue = (state) => {
    if (trackedTapValue !== state) {
      TrackedTapValue(state);
    }
  };
  const setViewportTapValue = (state) => {
    if (viewportTapValue !== state) {
      ViewportTapValue(state);
    }
  };

  // styles
  const classes = useStyles({
    dockMenu,
    mapLayersPanelExtended,
    mapGridCardActivated: mapControlsStateValues.mapGridCardActivated,
    mapGridCardActiveTap,
    viewportWells: stateApp.viewportWells,
    userGridViewFilters,
    // screenSizes
  });

  const handleMainTapChange = (event, newValue) => {
    dispatch(
      setMapGridCardState({
        mapGridCardActiveTap: newValue,
        selectedOwner: null,
        selectedOwnerWellIntsSummary: null,
      })
    );
  };

  const handleSearchPanelChange = (value) => {
    setSearchTapValue(value);
    if (searchTapValue.index !== value.index) {
      dispatch(setMapGridCardState({ searchInputValue: "", searchResultData: [], searchloading: true }));
    }
  };

  const ativateSearchPanel = () => {
    if (mapGridCardActiveTap !== 0) handleMainTapChange(null, 0);
    if (mapControlsStateValues.mapGridCardActivated === "min") {
      mapControlsController.updateState({ mapGridCardActivated: true, });
    }
  };

  const options = {
    toolbarActionMarginRight: "105px !important",
    customToolbar: () => {
      const dynamicLeftPos = mapGridCardActiveTap !== 2 ? 236 : 122;
      return (
        <div style={{ display: "flex", float: "left", position: "relative", left: `${dynamicLeftPos}px`, marginRight: "15px" }}>
          <DockMenu setSelectedDockMenu={setSelectedDockMenu} />

          <IconButton
            className="cancelDraggableEffect"
            onClick={onClose}
          >
            <CloseIcon color="secondary" />
          </IconButton>
        </div>
      );
    },
  };

  const commonProps = {
    isShapeGridOnly: drawStateValues.selectedPolygonString,
    isLayerOnly: mapControlsStateValues.selectedLayer,
    handleChange: handleSearchPanelChange,
    value: searchTapValue,
    ativateSearchPanel: ativateSearchPanel,
  };

  const CardReturn = () => {
    return (
      <Card className={`${mapControlsStateValues.mapGridCardActivated === "exp" ? "noDrag" : ""} ${classes.dockMenu}`}>
        {selectedOwner ? (
          <OwnersSummaryCard />
        ) : (
          <div id="snapGrid" className={`cancelDraggableEffect ${classes.mainPanelsDiv}`} style={{ position: "relative" }}>
            {/* //// search panel //// */}
            <TabPanel
              value={mapGridCardActiveTap}
              index={0}
              className={classes.tapsPanelsPadding}
              style={{ position: "absolute", width: "100%" }}
            >
              <Grid
                container
                direction="row"
                style={{ height: '100%', marginBottom: '20px' }}
              >
                {mapControlsStateValues?.selectedDataset?.name === 'M1 Platform' && <Grid item md={2} style={{ backgroundColor: '#F2F2F2' }}>
                  <Typography variant="h6" component="h1" style={{ fontWeight: "bold", padding: '10px 0px 0px 20px' }}>
                    M1 Platform
                  </Typography>

                  <List component="nav" aria-label="main mailbox folders">

                    {[...platformDataWellsInitialData, ...snapGridSideBarData].map((row) => {
                      const Icon = row.Icon
                      return (
                        <FeatureFlag feature={FEATURES[row.featureFlag]} noCheck={!FEATURES[row.featureFlag]}>
                          <ListItem
                            button
                            selected={row.value === searchTapValue.value}
                            onClick={() => handleSearchPanelChange(row)}
                          >
                            <ListItemIcon>
                              <Icon />
                            </ListItemIcon>
                            <ListItemText primary={row.label} />
                          </ListItem>
                        </FeatureFlag>
                      )
                    }
                    )}
                  </List>
                </Grid>}

                {mapControlsStateValues.selectedDataset && mapControlsStateValues.selectedDataset?.name !== 'M1 Platform' && <Grid item md={2} style={{ backgroundColor: '#F2F2F2' }}>
                  <Typography variant="h6" component="h1" style={{ fontWeight: "bold", padding: '10px 0px 0px 20px' }}>
                    {mapControlsStateValues.selectedDataset?.name}
                  </Typography>

                  <List component="nav" aria-label="main mailbox folders">

                    {mapControlsStateValues.selectedDataset?.categories.map((row) => {
                      const Icon = mapControlsStateValues.selectedDataset?.Icon
                      return (
                        <ListItem
                          key={row.name}
                          button
                          selected={row.name === mapControlsStateValues.selectedLayer?.name}
                          onClick={() => {
                            mapControlsController.updateState({ selectedLayer: { ...row } });
                            tableGlobalController.reInitialized();
                          }}
                        >
                          <ListItemIcon>
                            <Icon />
                          </ListItemIcon>
                          <ListItemText style={{ wordWrap: 'break-word' }} primary={row.name} />
                        </ListItem>
                      )
                    }
                    )}
                  </List>
                </Grid>}

                <Grid item md={mapControlsStateValues.selectedDataset ? 10 : 12}>
                  <div style={{ position: "relative" }} classes={classes.gridTables}>
                    <Fragment>
                      {searchTapValue.value === "well" && (
                        <MRTTable
                          name="WellsTable"
                          overrideMeta={{
                            toolbarInternalActions: {
                              onClose,
                              style: {
                                marginRight: '0.5rem',
                              },
                            },
                            maxTableHeight: '45vh',
                            filterLayerType: 'Wells'
                          }}

                        />
                      )}
                      {searchTapValue.value === "owner" && drawStateValues.selectedPolygonString && (
                        <ShapeGridTaxOwnersTable
                          parent="boundary_grid_owners"
                          header={<SearchPanel {...commonProps} />}
                          customOptions={options}
                          targetLabel="owner"
                          showTracks
                        />
                      )}
                      {searchTapValue.value === "owner" && !drawStateValues.selectedPolygonString && (
                        <MRTTable name="TaxOwnerTable" overrideMeta={{
                          toolbarInternalActions: {
                            onClose,
                            style: {
                              marginRight: '0.5rem',
                            },
                          },
                          maxTableHeight: '45vh',
                        }} />
                      )}
                      {searchTapValue.value === "layer" && (
                        <MRTTable
                          name='ShapesFilesGenericTable'
                          overrideMeta={shapeFileTableOverride}
                        />
                      )}
                      {searchTapValue.value === "contacts" && (
                        <MapGridContactTable
                          dense
                          parent="search"
                          customOptions={options}
                          targetLabel={searchTapValue.value}
                          header={
                            <SearchPanel
                              isShapeGridOnly={drawStateValues.selectedPolygonString}
                              handleChange={handleSearchPanelChange}
                              value={searchTapValue}
                              ativateSearchPanel={ativateSearchPanel}
                            />
                          }
                        />
                      )}
                      {searchTapValue.value === "unit" && (
                        <MRTTable
                          name="UnitTable"
                          overrideMeta={{
                            toolbarInternalActions: {
                              onClose,
                              style: {
                                marginRight: '0.5rem',
                              },
                            },
                            maxTableHeight: '45vh',
                            filterLayerType: 'Units'
                          }}
                        />
                      )}
                      {searchTapValue.value === "agreement" && (
                        <MRTTable
                          name="AgreementTable"
                          overrideMeta={{
                            toolbarInternalActions: {
                              onClose,
                              style: {
                                marginRight: '0.5rem',
                              },
                            },
                            maxTableHeight: '45vh',
                            filterLayerType: 'Agreements'
                          }}
                        />
                      )}

                      {searchTapValue.value === 'tract' && (
                        <MRTTable
                          name="TractsTable"
                          overrideMeta={{
                            toolbarInternalActions: {
                              onClose,
                              style: {
                                marginRight: '0.5rem',
                              },
                            },
                            maxTableHeight: '45vh',
                            filterLayerType: 'Parcels'
                          }}
                        />
                      )}
                      {searchTapValue.value === 'mywell' && (
                        <MRTTable
                          name="MyWellsTable"
                          overrideMeta={{
                            toolbarInternalActions: {
                              onClose,
                              style: {
                                marginRight: '0.5rem',
                              },
                            },
                            maxTableHeight: '45vh',
                            filterLayerType: 'My Wells'
                          }}
                        />
                      )}
                    </Fragment>
                  </div>

                </Grid>
              </Grid >
            </TabPanel>

            {/* //// tracked panel //// */}
            <TabPanel
              value={mapGridCardActiveTap}
              index={1}
              className={classes.tapsPanelsPadding}
              //
              style={{ position: "absolute", width: "100vw" }}
            //
            >
              <div style={{ position: "relative" }}>
                <TabPanels
                  value={trackedTapValue}
                  panels={[
                    <M1nTable
                      dense
                      parent="trackWells"
                      header={
                        <TabLabels
                          labels={[
                            `Tax Owners (${stateApp.owners ? stateApp.owners.length : 0})`,
                          ]}
                          value={trackedTapValue}
                          setValue={setTrackedTapValue}
                        />
                      }
                    />,
                    <M1nTable
                      dense
                      parent="trackOwners"
                      header={
                        <TabLabels
                          labels={[
                            `Tax Owners (${stateApp.owners ? stateApp.owners.length : 0})`,
                          ]}
                          value={trackedTapValue}
                          setValue={setTrackedTapValue}
                        />
                      }
                    />,
                  ]}
                />
              </div>
            </TabPanel>

            {/* //// boundary panel //// */}
            <TabPanel
              value={mapGridCardActiveTap}
              index={2}
              className={classes.tapsPanelsPadding}
            // style={{ position: "absolute", width: "100vw" }}
            >
              <div style={{ position: "relative" }} classes={classes.gridTables}>
                <TabPanels
                  value={viewportTapValue}
                  panels={[
                    <ShapeGridWellsTable
                      parent="boundary_grid_wells"
                      header={
                        <TabLabels
                          labels={[`Wells (${stateApp.shapeGridWellsCount || 0})`, `Tax Owners (${stateApp.shapeGridOwnersCount || 0})`]}
                          value={viewportTapValue}
                          setValue={setViewportTapValue}
                        />
                      }
                      options={options}
                      targetLabel="well"
                      showTracks
                    />,
                    <ShapeGridTaxOwnersTable
                      parent="boundary_grid_owners"
                      header={
                        <TabLabels
                          labels={[`Wells (${stateApp.shapeGridWellsCount || 0})`, `Tax Owners (${stateApp.shapeGridOwnersCount || 0})`]}
                          value={viewportTapValue}
                          setValue={setViewportTapValue}
                        />
                      }
                      options={options}
                      targetLabel="owner"
                      showTracks
                    />,
                  ]}
                />
              </div>
            </TabPanel>
          </div>
        )
        }
      </Card >
    );
  };

  // black
  // darken
  const blackOut = () => (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        // zIndex: "1299",
        zIndex: "1199",
      }}
      onClick={() => {
        mapControlsController.updateState({ mapGridCardActivated: true, });
      }}
    />
  );

  return (
    <div className={classes.card}>
      {mapControlsStateValues.mapGridCardActivated === "min" ? CardReturn() : CardReturn()}
      {mapControlsStateValues.mapGridCardActivated === "exp" && blackOut()}
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  return Object.is(prevProps.mapGridCardActivated, nextProps.mapGridCardActivated);
}

export default React.memo(MapGridCard, areEqual);
