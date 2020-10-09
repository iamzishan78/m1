import React, {
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { AppContext } from "../../AppContext";
import { NavigationContext } from "../Navigation/NavigationContext";
import { MapControlsContext } from "../MapControls/MapControlsContext";
import Popover from "@material-ui/core/Popover";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import { makeStyles } from "@material-ui/core/styles";
import MapControlsProvider from "../MapControls/MapControlsProvider";
import WellCardProvider from "../WellCard/WellCardProvider";
import ExpandableCardProvider from "../ExpandableCard/ExpandableCardProvider";
import Portal from "@material-ui/core/Portal";
import PortalD from "./components/Portal";
import Coordinates from "./components/Coordinates";
import DrawStatus from "./components/DrawStatus";
import ZoomFault from "./components/ZoomFault";
import HugeRequest from "./components/HugeRequest";
import SpatialDataCardEdit from "../MapControls/components/spatialDataCardEdit";
import SpatialDataCard from "../MapControls/components/spatialDataCard";
import "./popup.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode,
} from "mapbox-gl-draw-circle";
import DrawRectangle from "mapbox-gl-draw-rectangle-mode";
import * as MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import DefaultFiltersTest from "./filtersDefaultTest";
import FilterControl from "./components/FilterControl";
import { useLazyQuery, useMutation } from "@apollo/client";
import { WELLSQUERY } from "../../graphQL/useQueryWells";
import { TRACKSBYOBJECTTYPE } from "../../graphQL/useQueryTracksByObjectType";
import { OWNERSWELLSQUERY } from "../../graphQL/useQueryOwnersWells";
import { CUSTOMLAYERSQUERY } from "../../graphQL/useQueryCustomLayers";
import { REMOVECUSTOMLAYER } from "../../graphQL/useMutationRemoveCustomLayer";
import { UPDATECUSTOMLAYER } from "../../graphQL/useMutationUpdateCustomLayer";
import { PERMITSQUERY } from "../../graphQL/useQueryPermits";
import { RIGSQUERY } from "../../graphQL/useQueryRigs";
import { ABSTRACTGEOQUERY } from "../../graphQL/useQueryAbstractGeo";
import { VIEWFILEQUERY } from "../../graphQL/useQueryViewFile";
import { ALLLAYERSETTINGSBYUSER } from "../../graphQL/useQueryAllLayerSettingsByUser";
import {
  ABSTRACTGEOQUERYCONTAINS,
  ABSTRACTGEOCONTAINSQUERY,
} from "../../graphQL/useQueryAbstractGeoContains";
import { spatialDataAttributes } from "../MapControls/components/DrawShapes/constants";
import { addCustomShapeProperties } from "../MapControls/components/DrawShapes/drawShapesHelpers";
import MapGridCard from "../MapGridCard/MapGridCard";
import { useDispatch, useSelector } from "react-redux";
import MarkerIcon from "./sprites/marker-icon.png";
import AbstractSelectionPopup from "./components/popup/AbstractSelectionPopup";
import ParcelCardProvider from "../ParcelsDetailCard/ParcelCardProvider";
import { deepEqualObjects } from "../Shared/functions";
import gjv from "geojson-validation";
import { setMainMapState, showErrorMessage } from "../../actions";
import { ZoomOutMapSharp } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  mapWrapper: {
    width: "100%",
  },
  map: {
    position: "absolute",
    top: "64px",
    bottom: "0",
    width: "100%",
    height: "calc(100% - 64px)",
    overflow: "hidden !important",
    "& a.mapboxgl-ctrl-logo, .mapboxgl-ctrl.mapboxgl-ctrl-attrib": {
      display: "none",
    },
  },
  filterPopup: {
    "& .mapboxgl-popup-tip": {
      display: "none",
    },
  },
  footerLeftLogo: {
    position: "absolute",
    bottom: "5px",
    zIndex: "1",
    left: "10px",
  },
  portal: {
    position: "absolute",
    top: "45%",
    left: "47%",
    transform: "translate(-50%, -50%)",
  },
}));

const random_hex_color_code = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
};
let hoveredAbstractId = null;

export default function Map() {
  let classes = useStyles();
  const dispatch = useDispatch();
  const mapGridCardActivated = useSelector(
    ({ MapGridCard }) => MapGridCard.mapGridCardActivated
  );
  const removeLayerFromMap = useSelector(
    ({ MainMap }) => MainMap.removeLayerFromMap
  );
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [filtersDefault, FiltersDefault] = useState(
    stateApp.user.defaultFilters ? stateApp.user.defaultFilters : []
  );
  const setFiltersDefault = (state) => {
    if (filtersDefault != state) {
      FiltersDefault(state);
    }
  };
  const [lng, Lng] = useState();
  const setLng = (state) => {
    if (lng != state) {
      Lng(state);
    }
  };
  const [lat, Lat] = useState();
  const setLat = (state) => {
    if (lat != state) {
      Lat(state);
    }
  };
  const [zoom, Zoom] = useState(stateApp.mapVars.zoom);
  const setZoom = (state) => {
    if (zoom != state) {
      Zoom(state);
    }
  };

  const [transform, Transform] = useState("transform: inherit");
  const setTransform = (state) => {
    if (transform != state) {
      Transform(state);
    }
  };
  const container = useRef(null);
  const [showExpandableCard, ShowExpandableCard] = useState(false);
  const setShowExpandableCard = (state) => {
    if (showExpandableCard != state) {
      ShowExpandableCard(state);
    }
  };
  const [mapStyles, MapStyles] = useState([]);
  const setMapStyles = (state) => {
    if (mapStyles != state) {
      MapStyles(state);
    }
  };
  const [wellsTileset, WellsTileset] = useState();
  const setWellsTileset = (state) => {
    if (wellsTileset != state) {
      WellsTileset(state);
    }
  };
  const [defaultsCheckOnOff, DefaultsCheckOnOff] = useState(true);
  const setDefaultsCheckOnOff = (state) => {
    if (defaultsCheckOnOff != state) {
      DefaultsCheckOnOff(state);
    }
  };
  const [m1neralCheckOnOff, M1neralCheckOnOff] = useState(true);
  const setM1neralCheckOnOff = (state) => {
    if (m1neralCheckOnOff != state) {
      M1neralCheckOnOff(state);
    }
  };
  const [map, Map] = useState(null);
  const setMap = (state) => {
    if (map != state) {
      Map(state);
    }
  };
  const [mapClick, MapClick] = useState(null);
  const setMapClick = (state) => {
    if (mapClick != state) {
      MapClick(state);
    }
  };
  const [draw, Draw] = useState(null);
  const setDraw = (state) => {
    if (draw != state) {
      Draw(state);
    }
  };
  const [drawStatus, DrawStatus] = useState(false);
  const setDrawStatus = (state) => {
    if (drawStatus != state) {
      DrawStatus(state);
    }
  };
  const [rigs, RigData] = useState([]);
  const setRigData = (state) => {
    if (rigs != state) {
      RigData(state);
    }
  };
  const [permits, PermitData] = useState([]);
  const setPermitData = (state) => {
    if (permits != state) {
      PermitData(state);
    }
  };
  const [layersData, setLayersData] = useState([]);

  const [drawingFilterFeatureId, DrawingFilterFeatureId] = useState(null);
  const setDrawingFilterFeatureId = (state) => {
    if (drawingFilterFeatureId != state) {
      DrawingFilterFeatureId(state);
    }
  };
  // const [geocoder, setGeocoder] = useState(null);
  const [anchorElPoPOver, AnchorElPoPOver] = useState(null);
  const setAnchorElPoPOver = (state) => {
    if (anchorElPoPOver != state) {
      AnchorElPoPOver(state);
    }
  };
  const mapEl = useRef(null);

  const [hoverUdIds, HoverUdIds] = useState([]);
  const setHoverUdIds = (id) => {
    const ids = hoverUdIds.slice(0);
    if (ids.indexOf(id) > -1) {
      const tmpIds = ids.filter((item) => item != id);
      HoverUdIds(tmpIds);
    } else {
      ids.push(id);
      HoverUdIds(ids);
    }
  };

  const [fileRequestCounter, FileRequestCounter] = useState(1);
  const setFileRequestCounter = (state) => {
    if (fileRequestCounter != state) {
      FileRequestCounter(state);
    }
  };

  const [filterAbstract, setFilterAbstract] = useState(false);

  const [mapMouseMoveHandler, setMapMouseMoveHandler] = useState(null);
  const [mapMouseRClickHandler, setMapMouseRClickHandler] = useState(null);

  const [isLoadedLayerConfig, setIsLoadedLayerConfig] = useState(false);
  const [isLoadedLayerState, setIsLoadedLayerState] = useState(false);

  mapboxgl.accessToken = stateApp.mapboxglAccessToken;

  //////////// TEMP UNTIL PROVIDER IS MADE //////////

  //////begin////////temporary

  const [rows, Rows] = React.useState([]);
  const setRows = (state) => {
    if (rows != state) {
      Rows(state);
    }
  };
  const [loading, Loading] = useState(true);
  const setLoading = (state) => {
    if (loading != state) {
      Loading(state);
    }
  };
  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);
  const [tracksByObjectType, { data: dataTracks }] = useLazyQuery(
    TRACKSBYOBJECTTYPE
  );
  const [tracksByObjectTypeOwner, { data: dataTracksOwner }] = useLazyQuery(
    TRACKSBYOBJECTTYPE
  );

  const [getOwnersWells, { data: dataOwnersWells }] = useLazyQuery(
    OWNERSWELLSQUERY
  );

  const [
    getCustomLayers,
    { data: customLayerData },
  ] = useLazyQuery(CUSTOMLAYERSQUERY, { fetchPolicy: "network-only" });

  const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
    fetchPolicy: "network-only",
  });

  const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);

  const [removeCustomLayer] = useMutation(REMOVECUSTOMLAYER);

  const [
    getWellsForLayer,
    { data: dataWellsForOwnerWellTrackLayer },
  ] = useLazyQuery(WELLSQUERY);

  const [getPermits, { data: permitData }] = useLazyQuery(PERMITSQUERY);

  const [getRigs, { data: rigData }] = useLazyQuery(RIGSQUERY);

  const [getAbstractGeo, { data: abstractData }] = useLazyQuery(
    ABSTRACTGEOQUERY
  );
  const [getAbstractGeoContains, { data: abstractContainsData }] = useLazyQuery(
    ABSTRACTGEOCONTAINSQUERY
  );

  const [getAllLayerSettingsByUser, { data: layerStates }] = useLazyQuery(
    ALLLAYERSETTINGSBYUSER
  );

  /////end/////////temporary

  useEffect(() => {
    console.log("useEffect line310");
    if (stateApp.user && stateApp.user.mongoId && stateApp.defaultLayers) {
      console.log("useEffect 1");
      setLoading(true);

      tracksByObjectType({
        variables: {
          objectType: "well",
        },
      });

      tracksByObjectTypeOwner({
        variables: {
          objectType: "owner",
        },
      });

      getAllLayerSettingsByUser({
        variables: {
          userId: stateApp.user.mongoId,
          defaultLayers: stateApp.defaultLayers,
        },
      });

      getCustomLayers();
    }
  }, [stateApp.user, stateApp.defaultLayers]);

  useEffect(() => {
    if (dataTracks && dataTracks.tracksByObjectType) {
      if (dataTracks.tracksByObjectType.length !== 0) {
        const tracksIdArray = dataTracks.tracksByObjectType.map(
          (track) => track.trackOn
        );

        // setStateApp((stateApp) => ({
        //   ...stateApp,
        //   trackedwells: dataTracks.tracksByObjectType,
        // }));

        getWells({
          variables: {
            wellIdArray: tracksIdArray,
            authToken: stateApp.user.authToken,
          },
        });
      } else {
        setRows([]);
        setLoading(false);
      }
    }
  }, [dataTracks]);

  useEffect(() => {
    console.log("useEffect 2");
    if (dataTracksOwner && dataTracksOwner.tracksByObjectType) {
      if (dataTracksOwner.tracksByObjectType.length !== 0) {
        var objectsIdsArray = dataTracksOwner.tracksByObjectType.map(
          (item) => item.trackOn
        );

        setStateApp((state) => ({
          ...state,
          owners: objectsIdsArray,
        }));

        getOwnersWells({
          variables: {
            ownersIds: objectsIdsArray,
          },
        });
      }
    }
  }, [dataTracksOwner]);

  useEffect(() => {
    console.log("useEffect 3");

    if (customLayerData && customLayerData.allCustomLayers) {
      setStateApp((state) => ({
        ...state,
        customLayers: customLayerData.allCustomLayers,
        selectedUserDefinedLayer: null,
        editLayer: false,
        popupOpen: false, //// temporary comented
      }));
    }
  }, [customLayerData]);

  useEffect(() => {
    console.log("useEffect 4l");
    if (layerStates && layerStates.allLayerSettingsByUser) {
      setStateApp({
        ...stateApp,
        layers: [...layerStates.allLayerSettingsByUser],
      });

      if (layerStates.allLayerSettingsByUser.length > 0) {
        setLayersData(layerStates.allLayerSettingsByUser);
        for (let i = 0; i < layerStates.allLayerSettingsByUser.length; i++) {
          const layer = layerStates.allLayerSettingsByUser[i];
          if (layer.layerType == "file layer") {
            setFileRequestCounter(1);
            viewFile({
              variables: {
                fileId: layer.file,
              },
            });
            break;
          }
        }
      }
    }
  }, [layerStates]);

  const handleFileAsync = async (uri, internalKey, layerIndex) => {
    if (uri && internalKey && layerIndex != -1) {
      let response = await fetch(uri, {
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
          "X-Ms-Blob-Type": "BlockBlob",
          "X-Ms-Meta-Internalkey": internalKey,
          "X-Ms-Version": "2015-02-21",
        },
        method: "GET",
      });
      response = await response.json();

      let layers = layersData.slice(0);
      let currentLayer = { ...layers[layerIndex] };
      currentLayer.fileContent = response;
      layers[layerIndex] = currentLayer;
      setLayersData(layers);

      let nextLayerIndex;

      if (layerIndex < layersData.length - 1)
        for (let i = layerIndex + 1; i < layers.length; i++) {
          if (layers[i].layerType == "file layer") {
            setFileRequestCounter(1);
            viewFile({
              variables: {
                fileId: layers[i].file,
              },
            });
            nextLayerIndex = i;
            break;
          }
        }
      //// no more file layers to looks for
      if (!nextLayerIndex) {
        setStateApp((stateApp) => ({
          ...stateApp,
          layers: [...layers],
        }));
      }
    }
  };

  // useEffect(() => {
  //   if (viewFileResult && viewFileResult.viewFile && stateApp.layers) {
  //     const result = viewFileResult.viewFile;
  //     const fileId = result.id;
  //     if (result.uri && result.internalKey) {
  //       const layerIndex = stateApp.layers.findIndex(
  //         (layer) => layer.file == fileId
  //       );
  //       handleFileAsync(result.uri, result.internalKey, layerIndex);
  //     } else if (fileId)
  //       viewFile({
  //         variables: {
  //           fileId,
  //         },
  //       });
  //   }
  // }, [viewFileResult]);

  useEffect(() => {
    if (viewFileResult && viewFileResult.viewFile && stateApp.layers) {
      const result = viewFileResult.viewFile;
      const fileId = result.id;
      if (result.uri && result.internalKey) {
        const layerIndex = stateApp.layers.findIndex(
          (layer) => layer.file == fileId
        );
        handleFileAsync(result.uri, result.internalKey, layerIndex);
      } else if (fileId && fileRequestCounter < 30) {
        let waitBeforeRequestAgain = setTimeout(() => {
          setFileRequestCounter(fileRequestCounter + 1);
          viewFile({
            variables: {
              fileId,
            },
          });
          clearTimeout(waitBeforeRequestAgain);
        }, 1000);
      } else {
        ////fail all request
        setStateApp((stateApp) => ({
          ...stateApp,
          universalCircularLoaderAct: false,
        }));
        dispatch(
          showErrorMessage(
            "The file is not ready yet, please wait a few minutes and then reload the application."
          )
        );
      }
    }
  }, [viewFileResult]);

  useEffect(() => {
    console.log("useEffect 4");

    if (dataOwnersWells && dataOwnersWells.length !== 0) {
      console.log(dataOwnersWells.ownersWells);
      var ownerObjectIds = dataOwnersWells.ownersWells.map(
        (item) => item.wells
      );

      var merged = [].concat.apply([], ownerObjectIds);

      var stripped = merged.map((item) => item.wellId);

      getWellsForLayer({
        variables: {
          wellIdArray: stripped,
          authToken: stateApp.user.authToken,
        },
      });
    }
  }, [dataOwnersWells]);

  useEffect(() => {
    console.log("useEffect 5");

    if (dataWells) {
      if (
        dataWells.wells &&
        dataWells.wells.results &&
        dataWells.wells.results.length > 0
      ) {
        setStateApp((state) => ({
          ...state,
          trackedwells: dataWells.wells.results,
        }));
      } else {
        setStateApp((state) => ({
          ...state,
          trackedwells: null,
        }));
      }
    }
  }, [dataWells]);

  const setLayer = (data, layerName, map, bLayer = null) => {
    let beforelayer = bLayer;

    //// configIndex = actual layer index
    const configIndex = stateApp.layers.findIndex(
      (value) => value.layerName === layerName
    );
    //// config = actual layer
    const config = stateApp.layers[configIndex];
    const paintProps = config.layerPaintProps;
    const layerSettings = config.layerSettings;
    for (let i = paintProps.length - 1; i >= 0; i--) {
      const prop = paintProps[i];
      let layerData = null;
      if (layerName == "Parcels" || layerName == "Area of Interest") {
        const dataId = prop.id;
        const groupBy = (arr, property) => {
          return arr.reduce((memo, x) => {
            if (!memo[x[property]]) {
              memo[x[property]] = [];
            }
            memo[x[property]].push(x);
            return memo;
          }, {});
        };
        layerData = groupBy(data, "layer")[dataId];
        if (!layerData) {
          layerData = [];
        }
      } else {
        layerData = data;
      }

      let geoJson = null;

      if (config.layerType == "file layer") {
        geoJson = layerData;
      } else {
        const makeGeoJSON = (mdata) => {
          return {
            type: "FeatureCollection",
            features: mdata.map((feature) => {
              if (feature.latitude && feature.longitude) {
                return {
                  type: "Feature",
                  properties: feature,
                  geometry: {
                    type: "Point",
                    coordinates: [feature.longitude, feature.latitude],
                  },
                };
              } else if (feature.shape) {
                // This is temporary solution to replace Mapbox.Draw library's autogenerated `id`
                // with mongondb id.
                if (feature._id) {
                  let shape = JSON.parse(feature.shape);
                  shape.id = feature._id;
                  shape.properties.id = feature._id;
                  return shape;
                }
                ///////////

                return JSON.parse(feature.shape);
              } else {
                return {
                  type: "Feature",
                  properties: feature,
                  geometry: {
                    type: "Point",
                    coordinates: [feature.Longitude, feature.Latitude],
                  },
                };
              }
            }),
          };
        };

        geoJson = makeGeoJSON(layerData);
      }

      const sourceId = prop.sourceProps;
      const paintType = prop.paintType;

      // -> add source
      if (map.getSource(sourceId)) {
        let mapSourceData = map.getSource(sourceId)._data;
        if (mapSourceData && !deepEqualObjects(geoJson, mapSourceData))
          map.getSource(sourceId).setData(geoJson);
      } else {
        if (paintType == "circle" || paintType == "symbol") {
          map.addSource(sourceId, {
            type: "geojson",
            data: geoJson,
            cluster: true,
            clusterRadius: 50,
            clusterMaxZoom: 6,
          });
        } else {
          map.addSource(sourceId, {
            type: "geojson",
            data: geoJson,
            promoteId: "id",
          });
        }
      }

      if (map.getSource(`${sourceId}_filter`)) {
        let mapSourceFilterData = map.getSource(`${sourceId}_filter`)._data;
        if (
          mapSourceFilterData &&
          !deepEqualObjects(geoJson, mapSourceFilterData)
        )
          map.getSource(`${sourceId}_filter`).setData(geoJson);
      } else {
        map.addSource(`${sourceId}_filter`, {
          type: "geojson",
          data: geoJson,
          promoteId: "id",
        });
      }

      // -> add layer
      const layerId = prop.id;
      const visible =
        layerSettings.showable && layerSettings.visiable !== false;

      if (prop.paintProps) {
        Object.keys(prop.paintProps).forEach((key) => {
          if (prop.paintProps[key] == "#undefined") {
            prop.paintProps[key] = random_hex_color_code();
          }
        });
      }

      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          "visibility",
          visible ? "visible" : "none"
        );
        if (prop.paintProps) {
          Object.keys(prop.paintProps).forEach((key) => {
            map.setPaintProperty(layerId, key, prop.paintProps[key]);
          });
        }
      } else {
        //// joining all properties before to set the new layer ////
        let layout = { visibility: visible ? "visible" : "none" };
        if (prop.layoutProps) layout = { ...layout, ...prop.layoutProps };
        // symbols
        if (prop.symbolProps) layout = { ...layout, ...prop.symbolProps };

        const layerConfig = {
          id: layerId,
          type: paintType,
          source: sourceId,
          layout,
        };

        if (prop.paintProps) layerConfig.paint = prop.paintProps;

        if (prop.minZoom) {
          layerConfig.minzoom = prop.minZoom;
        }

        map.addLayer(layerConfig);

        if(prop.labelProps) {
          let labelLayout = { visibility: visible ? "visible" : "none" };
          labelLayout = { ...labelLayout, ...prop.labelProps.symbolProps }
          map.addLayer({
            "id": `${prop.id}_label`,
            "type": prop.labelProps.paintType,
            "source": sourceId,
            "minzoom": prop.labelProps.minZoom,
            "layout": labelLayout
          });
        }
        ////////////////////////////////////////////////////////////
      }

      if (prop.clusterProps) {
        const mLayer = map.getLayer(layerId);
        const clusterVisible =
          visible && mLayer && !mLayer.source.includes("_filter");

        const clusterVar = layerId + "-clusters";
        const clusterLabelBar = layerId + "-clusters-counts";
        if (map.getLayer(clusterLabelBar)) {
          map.setLayoutProperty(
            clusterLabelBar,
            "visibility",
            clusterVisible ? "visible" : "none"
          );
        } else {
          map.addLayer({
            id: clusterLabelBar,
            type: "symbol",
            source: sourceId,
            filter: ["has", "point_count"],
            layout: prop.clusterProps.clusterSymbolProps,
          });
          map.setLayoutProperty(
            clusterLabelBar,
            "visibility",
            clusterVisible ? "visible" : "none"
          );
        }

        if (beforelayer) {
          map.moveLayer(clusterLabelBar, beforelayer);
        }
        beforelayer = clusterLabelBar;

        if (config.layerSettings.interaction.interactionAble) {
          map.off("mousemove", clusterLabelBar, mouseMoveHandler);
          map.off("mouseleave", clusterLabelBar, mouseLeaveHandler);
          if (config.layerSettings.interaction.interactionDetail.hover) {
            map.on("mousemove", clusterLabelBar, mouseMoveHandler);
            map.on("mouseleave", clusterLabelBar, mouseLeaveHandler);
          }
        }

        if (map.getLayer(clusterVar)) {
          map.setLayoutProperty(
            clusterVar,
            "visibility",
            clusterVisible ? "visible" : "none"
          );
          Object.keys(prop.clusterProps.clusterPaintProps).forEach((key) => {
            map.setPaintProperty(
              clusterVar,
              key,
              prop.clusterProps.clusterPaintProps[key]
            );
          });
        } else {
          map.addLayer({
            id: clusterVar,
            type: "circle",
            source: sourceId,
            filter: ["has", "point_count"],
            paint: prop.clusterProps.clusterPaintProps,
          });
          map.setLayoutProperty(
            clusterVar,
            "visibility",
            clusterVisible ? "visible" : "none"
          );
        }

        if (beforelayer) {
          map.moveLayer(clusterVar, beforelayer);
        }
        beforelayer = clusterVar;

        if (config.layerSettings.interaction.interactionAble) {
          map.off("mousemove", clusterVar, mouseMoveHandler);
          map.off("mouseleave", clusterVar, mouseLeaveHandler);
          if (config.layerSettings.interaction.interactionDetail.hover) {
            map.on("mousemove", clusterVar, mouseMoveHandler);
            map.on("mouseleave", clusterVar, mouseLeaveHandler);
          }
        }
      }

      if (beforelayer) {
        map.moveLayer(layerId, beforelayer);
      }
      beforelayer = layerId;

      if (config.layerSettings.interaction.interactionAble) {
        map.off("mousemove", layerId, mouseMoveHandler);
        map.off("mouseleave", layerId, mouseLeaveHandler);
        if (config.layerSettings.interaction.interactionDetail.hover) {
          map.on("mousemove", layerId, mouseMoveHandler);
          map.on("mouseleave", layerId, mouseLeaveHandler);
        }
      }
    }
    return beforelayer;
  };

  // const setUserDefinedLayer = (data, layerName, map) => {
  //   const configIndex = stateApp.userDefinedLayers.findIndex(
  //     (value) => value.name === layerName
  //   );
  //   const config = stateApp.userDefinedLayers[configIndex];
  //   let beforelayer = null;
  //   for (let i = 0; i < config.id.length; i++) {
  //     // -> fetch data
  //     let layerData = [];
  //     if (config.dataProps[i].dataId == "trackedWellsWells") {
  //       layerData = data;
  //     } else if (config.dataProps[i].dataId == "trackedOwnersWells") {
  //       layerData = data;
  //     } else if (config.dataProps[i].dataId == "wellsFromSearch") {
  //       layerData = data;
  //     } else if (config.dataProps[i].dataId == "wellsFromTagsFilter") {
  //       layerData = data;
  //     } else {
  //       const dataId = config.dataProps[i].dataId;

  //       const groupBy = (arr, property) => {
  //         return arr.reduce((memo, x) => {
  //           if (!memo[x[property]]) {
  //             memo[x[property]] = [];
  //           }
  //           memo[x[property]].push(x);
  //           return memo;
  //         }, {});
  //       };

  //       layerData = groupBy(data, "layer")[dataId];
  //     }

  //     if (layerData && layerData.length !== 0) {
  //       const layerId = config.layerProps[i].layerId;

  //       if (!map.getLayer(layerId)) {
  //         // -> make GEOJSON

  //         const makeGeoJSON = (data) => {
  //           return {
  //             type: "FeatureCollection",
  //             features: data.map((feature) => {
  //               if (config.dataProps[i].dataTypeId == "Point") {
  //                 return {
  //                   type: "Feature",
  //                   properties: feature,
  //                   geometry: {
  //                     type: config.dataProps[i].dataTypeId,
  //                     coordinates: [feature.longitude, feature.latitude],
  //                   },
  //                 };
  //               } else {
  //                 return JSON.parse(feature.shape);
  //               }
  //             }),
  //           };
  //         };

  //         const myGeoJSONData = makeGeoJSON(layerData);

  //         // -> add source
  //         if (config.dataProps[i].dataTypeId == "Point") {
  //           if (map.getSource(config.sourceProps[i].sourceId)) {
  //             map
  //               .getSource(config.sourceProps[i].sourceId)
  //               .setData(myGeoJSONData);
  //           } else {
  //             map.addSource(config.sourceProps[i].sourceId, {
  //               type: config.sourceProps[i].sourceType,
  //               data: myGeoJSONData,
  //               cluster: true,
  //               clusterRadius: 50,
  //               clusterMaxZoom: 6,
  //             });
  //           }
  //           const filterLayerId = config.sourceProps[i].sourceId + "_filter";
  //           if (map.getSource(filterLayerId)) {
  //             map.getSource(filterLayerId).setData(myGeoJSONData);
  //           } else {
  //             map.addSource(filterLayerId, {
  //               type: config.sourceProps[i].sourceType,
  //               data: myGeoJSONData,
  //             });
  //           }
  //         } else {
  //           if (map.getSource(config.sourceProps[i].sourceId)) {
  //             map
  //               .getSource(config.sourceProps[i].sourceId)
  //               .setData(myGeoJSONData);
  //           } else {
  //             map.addSource(config.sourceProps[i].sourceId, {
  //               type: config.sourceProps[i].sourceType,
  //               data: myGeoJSONData,
  //               promoteId: "id",
  //             });
  //           }
  //         }

  //         // -> add layer
  //         // eslint-disable-next-line eqeqeq
  //         if (config.layerProps[i].layerType == "symbol") {
  //           map.addLayer({
  //             id: config.layerProps[i].layerId,
  //             type: config.layerProps[i].layerType,
  //             source: config.sourceProps[i].sourceId,
  //             layout: config.layerProps[i].symbolProps,
  //           });
  //         } else {
  //           map.addLayer({
  //             id: config.layerProps[i].layerId,
  //             type: config.layerProps[i].layerType,
  //             source: config.sourceProps[i].sourceId,
  //             paint: config.layerProps[i].paintProps,
  //           });
  //         }

  //         map.setLayoutProperty(
  //           config.layerProps[i].layerId,
  //           "visibility",
  //           "none"
  //         );

  //         // -> add cluster layer

  //         if (
  //           config &&
  //           config.layerProps &&
  //           config.layerProps[i].clusterProps
  //         ) {
  //           var clusterVar = config.layerProps[i].layerId + "-clusters";
  //           var clusterLabelBar =
  //             config.layerProps[i].layerId + "-clusters-counts";

  //           map.addLayer({
  //             id: clusterLabelBar,
  //             type: "symbol",
  //             source: config.sourceProps[i].sourceId,
  //             filter: ["has", "point_count"],
  //             layout: config.layerProps[i].clusterProps.clusterSymbolProps,
  //           });
  //           map.setLayoutProperty(clusterLabelBar, "visibility", "none");
  //           if (beforelayer) {
  //             map.moveLayer(clusterLabelBar, beforelayer);
  //           }
  //           beforelayer = clusterLabelBar;

  //           map.addLayer({
  //             id: clusterVar,
  //             type: config.layerProps[i].layerType,
  //             source: config.sourceProps[i].sourceId,
  //             filter: ["has", "point_count"],
  //             paint: config.layerProps[i].clusterProps.clusterPaintProps,
  //           });
  //           map.setLayoutProperty(clusterVar, "visibility", "none");
  //           if (beforelayer) {
  //             map.moveLayer(clusterVar, beforelayer);
  //           }
  //           beforelayer = clusterVar;
  //         }

  //         if (beforelayer) {
  //           map.moveLayer(config.layerProps[i].layerId, beforelayer);
  //         }
  //         beforelayer = config.layerProps[i].layerId;
  //       }
  //     }
  //   }
  // };

  useEffect(() => {
    if (permitData && permitData.permits && permitData.permits.length > 0) {
      const nextOffset = permits.length + permitData.permits.length;
      setPermitData([...permits, ...permitData.permits]);

     // getPermits({
        // variables: {
        //   offset: nextOffset,
        //   amount: 500,
        // },
     // });
    }
  }, [permitData]);

  useEffect(() => {
    if (rigData && rigData.rigs && rigData.rigs.length > 0) {
      const nextOffset = rigs.length + rigData.rigs.length;
      setRigData([...rigs, ...rigData.rigs]);

      getRigs({
        variables: {
          offset: nextOffset,
          amount: 500,
        },
      });
    }
  }, [rigData]);

  useEffect(() => {
    console.log("useEffect 10");

    if (dataWellsForOwnerWellTrackLayer) {
      if (
        dataWellsForOwnerWellTrackLayer.wells &&
        dataWellsForOwnerWellTrackLayer.wells.results &&
        dataWellsForOwnerWellTrackLayer.wells.results.length > 0
      ) {
        setStateApp((state) => ({
          ...state,
          trackedOwnerWells: dataWellsForOwnerWellTrackLayer.wells.results,
        }));
      } else {
        setStateApp((state) => ({
          ...state,
          trackedOwnerWells: null,
        }));
      }
    }
  }, [dataWellsForOwnerWellTrackLayer]);

  useEffect(() => {
    console.log("useEffect 12");

    const wellLineClick = (currentFeature) => {
      console.log("clicked well lines", currentFeature);

      setStateApp((state) => ({
        ...state,
        popupOpen: false,
        selectedUserDefinedLayer: undefined,
      }));
      setStateApp((state) => ({
        ...state,
        selectedWell: currentFeature.properties,
        selectedWellId: currentFeature.properties.id,
        wellSelectedCoordinates: [
          currentFeature.properties.longitude,
          currentFeature.properties.latitude,
        ],
      }));

      createPopUp(currentFeature.properties);
    };

    const wellPointClick = (feature) => {
      console.log("feature", feature);

      if (feature && feature.properties) {
        const objFiledsToLowerCase = (feature) => {
          let newObj = {};
          for (let key in feature)
            newObj[key.charAt(0).toLowerCase() + key.slice(1)] = feature[key];

          return newObj;
        };
        let properties = objFiledsToLowerCase(feature.properties);

        console.log("properties", JSON.stringify(properties));

        setStateApp((state) => ({
          ...state,
          popupOpen: false,
          selectedUserDefinedLayer: null,
          selectedParcel: null,
        }));
        setStateApp((state) => ({
          ...state,
          selectedWell:
            properties.wellName && properties.operator ? properties : null,
          selectedWellId: properties.id ? properties.id.toLowerCase() : null,
          wellSelectedCoordinates: [properties.longitude, properties.latitude],
        }));

        if (properties.wellName && properties.operator) {
          createPopUp(properties);
          map.resize();
        }
      }
    };

    const layerClickHander = (feature) => {
      let zVal;
      if (map && map.getZoom() && map.getZoom() > 12) zVal = map.getZoom();

      setStateApp((state) => ({
        ...state,
        popupOpen: false,
        selectedUserDefinedLayer: undefined,
        selectedWell: null,
        selectedWellId: feature.properties.id
          ? feature.properties.id.toLowerCase()
          : null,
        flyTo: zVal
          ? { ...feature.properties, zoom: zVal }
          : feature.properties,
      }));
    };

    const udLayerClickHandler = (feature) => {
      console.log("Current Parcel Layer", feature);
      setStateApp((state) => ({
        ...state,
        popupOpen: false,
      }));

      if (feature.source === "parcels_source") {
        setStateApp((state) => ({
          ...state,
          selectedUserDefinedLayer: null,
          selectedParcel: feature.properties,
        }));
      }
      if (feature.source === "interests_source") {
        setStateApp((state) => ({
          ...state,
          selectedUserDefinedLayer: feature,
          selectedParcel: null,
        }));
      }

      // setStateApp({...stateApp, currentFeature: feature});
      createUDPopUp(feature.properties);
      map.resize();
    };

    const udLayerHighlightHandler = (feature) => {
      const id = feature.id;
      if (hoverUdIds.indexOf(id) > -1) {
        console.log("remove Hover");
        map.setFeatureState(
          { source: feature.source, id: feature.id },
          { hover: false }
        );
      } else {
        console.log("set Hover");
        map.setFeatureState(
          { source: feature.source, id: feature.id },
          { hover: true }
        );
      }
      setHoverUdIds(id);
    };

    const clusterClickHandler = (feature, map) => {
      if (feature && feature.properties && feature.properties.cluster_id) {
        var clusterId = feature.properties.cluster_id;
        map
          .getSource(feature.source)
          .getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err) return;

            map.easeTo({
              center: feature.geometry.coordinates,
              zoom: zoom,
            });
          });
      }
    };

    const isCtrlKeyPressed = () => {
      if (window.event.ctrlKey) return true;
      if (window.event.metaKey) return true;
      return false;
    };

    const mapClickHandler = (e) => {
      const map = e.target;
      let layers = [];
      let clusterUDLayers = [];
      let udLayers = [];
      let clusterLayers = [];

      stateApp.layers.forEach((layer) => {
        const interaction =
          layer.layerSettings.interaction.interactionAble &&
          layer.layerSettings.interaction.interactionDetail.click;
        const visible =
          layer.layerSettings.showable &&
          layer.layerSettings.visiable !== false;
        if (interaction && visible) {
          if (layer.layerCategory == "UD layer") {
            layer.layerPaintProps.forEach((paintProps) => {
              const layerId = paintProps.id;
              if (paintProps.clusterProps) {
                if (map.getLayer(`${layerId}-clusters`)) {
                  clusterUDLayers.push(`${layerId}-clusters`);
                  layers.push(`${layerId}-clusters`);
                }
                if (map.getLayer(`${layerId}-clusters-counts`)) {
                  clusterUDLayers.push(`${layerId}-clusters-counts`);
                  layers.push(`${layerId}-clusters-counts`);
                }
              }
              if (map.getLayer(layerId)) {
                if (
                  layer.layerName == "Parcels" ||
                  layer.layerName == "Area of Interest" ||
                  layer.layerName == "Tracked Wells" ||
                  layer.layerName == "Tracked Owners" ||
                  layer.layerName == "Tagged Wells/Owners" ||
                  layer.layerName == "Search"
                )
                  layers.push(layerId);

                if (
                  layer.layerName == "Parcels" ||
                  layer.layerName == "Area of Interest"
                )
                  udLayers.push(layerId);
              }
            });
          } else {
            if (layer.layerPaintProps.ids) {
              layer.layerPaintProps.ids.forEach((id) => {
                layers.push(id);
              });
            } else {
              layer.layerPaintProps.forEach((paintProps) => {
                const layerId = paintProps.id;
                if (paintProps.clusterProps) {
                  if (map.getLayer(`${layerId}-clusters`)) {
                    clusterLayers.push(`${layerId}-clusters`);
                    layers.push(`${layerId}-clusters`);
                  }
                  if (map.getLayer(`${layerId}-clusters-counts`)) {
                    clusterLayers.push(`${layerId}-clusters-counts`);
                    layers.push(`${layerId}-clusters-counts`);
                  }
                }
                if (map.getLayer(layerId)) {
                  layers.push(layerId);
                }
              });
            }
          }
        }
      });

      var bbox = [
        [e.point.x - 10, e.point.y - 10],
        [e.point.x + 10, e.point.y + 10],
      ];

      console.log("checking layers", layers);

      let features = map.queryRenderedFeatures(bbox, {
        layers: [...layers],
      });

      if (
        !(window.event.ctrlKey && window.event.metaKey) &&
        hoverUdIds.length > 0
      ) {
        for (let i = 0; i < hoverUdIds.length; i++) {
          map.setFeatureState(
            { source: "parcels_source", id: hoverUdIds[i] },
            { hover: false }
          );
          HoverUdIds([]);
        }
      }

      const isNormalClick = !isCtrlKeyPressed();

      if (isNormalClick && features && features.length > 0) {
        const feature = features[0];
        const layerId = feature.layer.id;

        switch (true) {
          case clusterUDLayers.indexOf(layerId) > -1:
            clusterClickHandler(feature, map);
            break;
          case clusterLayers.indexOf(layerId) > -1:
            clusterClickHandler(feature, map);
            break;
          case udLayers.indexOf(layerId) > -1:
            udLayerClickHandler(feature);
            break;
          case layerId === "wellpoints" ||
            layerId === "Parcels" ||
            layerId === "Area of Interest" ||
            layerId === "Tracked Wells" ||
            layerId === "Tracked Owners" ||
            layerId === "Tags Filter" ||
            layerId === "Search" ||
            layerId === "permits":
            wellPointClick(feature);
            break;
          case layerId === "welllines":
            wellLineClick(feature);
            break;
          default:
            break;
        }
      }
    };
    if (map) {
      console.log(mapClick);
      if (mapClick && mapClick.mapClickHandler) {
        console.log("off click action");
        map.off("click", mapClick.mapClickHandler);
      }
      console.log("on click action");
      map.on("click", mapClickHandler);
      setMapClick({ mapClickHandler });
    }
  }, [
    map,
    stateApp.layers,
    // stateApp.checkedUserDefinedLayersInteraction,
    // stateApp.checkedLayers,
    // stateApp.checkedUserDefinedLayers,
    // hoverUdIds,
  ]);

  useEffect(() => {
    let beforeLayer = null;
    console.log("stateApp check ", stateApp.layers);

    if (stateApp.layers && stateApp.layers.length > 0 && map) {
      for (let i = 0; i < stateApp.layers.length; i++) {
        const layer = stateApp.layers[i];
        if (layer.layerType == "vector layer") {
          const props = layer.layerPaintProps;
          const visible =
            layer.layerSettings.showable &&
            layer.layerSettings.visiable !== false;
          const ids = props.ids;
          ids.forEach((id) => {
            if (map.getLayer(id)) {
              map.setLayoutProperty(
                id,
                "visibility",
                visible ? "visible" : "none"
              );
              if (beforeLayer) {
                map.moveLayer(id, beforeLayer);
              }
              beforeLayer = id;

              if (id == "basinLayer" || id == "GLOUnits" || id == "GLOLeases")
                dispatch(
                  setMainMapState({
                    [`${id}Color`]: map.getPaintProperty(id, "fill-color"),
                  })
                );
            }
            if (layer.layerSettings.interaction.interactionAble) {
              map.off("mousemove", id, mouseMoveHandler);
              map.off("mouseleave", id, mouseLeaveHandler);
              if (layer.layerSettings.interaction.interactionDetail.hover) {
                map.on("mousemove", id, mouseMoveHandler);
                map.on("mouseleave", id, mouseLeaveHandler);
                console.log("set move hover and leave action");
              }
            }
          });
        } else if (layer.layerType == "data layer") {
          let data = null;
          if (layer.layerPaintProps.length > 0) {
            switch (layer.layerName) {
              case "Tracked Wells":
                data = stateApp.trackedwells;
                break;
              case "Tracked Owners":
                data = stateApp.trackedOwnerWells;
                break;
              case "Rig Activity":
                data = rigs;
                break;
              case "Permits":
                data = permits;
                break;
              case "Search":
                data = stateApp.wellListFromSearch;
                break;
              case "Tagged Wells/Owners":
                data = stateApp.wellListFromTagsFilter;
                break;
              default:
                data = stateApp.customLayers;
            }
            if (data) {
              beforeLayer = setLayer(data, layer.layerName, map, beforeLayer);
            }
          }
        } else if (layer.layerType == "file layer" && layer.fileContent) {
          let data = layer.fileContent;
          if (data) {
            beforeLayer = setLayer(data, layer.layerName, map, beforeLayer);
          }
        }
      }

      console.log("after set data", map);

      ////temporary comented to test
      // setStateApp((state) => ({
      //   ...state,
      //   popupOpen: false,
      //   selectedUserDefinedLayer: undefined,
      // }));
    }
  }, [
    stateApp.layers,
    stateApp.trackedOwnerWells,
    stateApp.trackedwells,
    stateApp.wellListFromTagsFilter,
    stateApp.wellListFromSearch,
    stateApp.customLayers,
    permits,
    rigs,
    map,
  ]);

  //// remove the layer and it's source from the map after it's deleted
  const removeLayer = (layer) => {
    const paintProps = layer.layerPaintProps;
    for (let i = paintProps.length - 1; i >= 0; i--) {
      const prop = paintProps[i];

      // -> remove layer
      const layerId = prop.id;
      if (map.getLayer(layerId)) map.removeLayer(layerId);

      if (prop.clusterProps) {
        if (map.getLayer(layerId + "-clusters-counts"))
          map.removeLayer(layerId + "-clusters-counts");

        if (map.getLayer(layerId + "-clusters"))
          map.removeLayer(layerId + "-clusters");
      }

      // -> remove source
      const sourceId = prop.sourceProps;
      if (map.getSource(sourceId)) map.removeSource(sourceId);

      if (map.getSource(`${sourceId}_filter`))
        map.removeSource(`${sourceId}_filter`);
    }
  };

  useEffect(() => {
    if (removeLayerFromMap && map) {
      removeLayer(removeLayerFromMap);
      dispatch(setMainMapState({ removeLayerFromMap: null }));
    }
  }, [removeLayerFromMap]);

  // useEffect(() => {
  //   console.log("useEffect 14");

  //   // USE EFFECT FOR M1 LAYER HANDLES
  //   console.log("layer ue start");

  //   setStateApp((state) => ({
  //     ...state,
  //     popupOpen: false,
  //     selectedUserDefinedLayer: undefined,
  //   }));

  //   if (stateApp.styleLayers.length > 0 && map) {
  //     stateApp.styleLayers.forEach((l) => {
  //       l.id.forEach((k) => {
  //         if (map.getLayer(k)) {
  //           map.setLayoutProperty(k, "visibility", "none");
  //         }
  //         if (l.layerProps && l.layerProps.clusterProps) {
  //           if (map.getLayer(k + "-clusters-counts")) {
  //             map.setLayoutProperty(
  //               k + "-clusters-counts",
  //               "visibility",
  //               "none"
  //             );
  //           }
  //           if (map.getLayer(k + "-clusters")) {
  //             map.setLayoutProperty(k + "-clusters", "visibility", "none");
  //           }
  //         }
  //       });
  //     });

  //     const checkedLayers = stateApp.checkedLayers.slice(0);
  //     if (stateApp.tempCheckedLayer) {
  //       checkedLayers.push(stateApp.tempCheckedLayer);
  //     }

  //     if (checkedLayers.length > 0) {
  //       let layers = checkedLayers;
  //       layers.sort(function (a, b) {
  //         return b - a;
  //       });
  //       if (layers.length > 0) {
  //         let belowlayer = null;
  //         for (let k = layers.length - 1; k >= 0; k--) {
  //           let i = layers[k];
  //           let layerConfig = stateApp.styleLayers[i];
  //           let currentLayerArray = stateApp.styleLayers[i].id;
  //           // eslint-disable-next-line no-loop-func
  //           currentLayerArray.forEach((j) => {
  //             let mapLayer = map.getLayer(j);
  //             if (
  //               mapLayer &&
  //               layerConfig.layerProps &&
  //               layerConfig.layerProps.clusterProps &&
  //               !mapLayer.source.includes("_filter")
  //             ) {
  //               map.setLayoutProperty(
  //                 j + "-clusters-counts",
  //                 "visibility",
  //                 "visible"
  //               );
  //               if (belowlayer != null) {
  //                 map.moveLayer(j + "-clusters-counts", belowlayer);
  //               }
  //               belowlayer = j + "-clusters-counts";
  //               map.setLayoutProperty(j + "-clusters", "visibility", "visible");
  //               map.moveLayer(j + "-clusters", belowlayer);
  //               belowlayer = j + "-clusters";
  //             }
  //             if (typeof mapLayer !== "undefined") {
  //               if (map.getLayer(j)) {
  //                 map.setLayoutProperty(j, "visibility", "visible");
  //                 if (belowlayer != null) {
  //                   map.moveLayer(j, belowlayer);
  //                 }
  //                 belowlayer = j;
  //               }
  //             } else {
  //             }
  //           });
  //         }
  //       }
  //     }
  //   }
  // }, [
  //   map,
  //   stateApp.checkedLayers,
  //   stateApp.tempCheckedLayer,
  //   stateApp.styleLayers,
  // ]);

  useEffect(() => {
    console.log("useEffect 15");

    // USE EFFECT FOR BASEMAP LAYER HANDLING
    console.log("basemap layer ue start");
    if (stateApp.baseMapLayers.length > 0 && map) {
      stateApp.baseMapLayers.forEach((l) => {
        l.id.forEach((k) => {
          if (map.getLayer(k)) {
            map.setLayoutProperty(k, "visibility", "none");
          }
        });
      });

      if (stateApp.checkedBaseLayers.length > 0) {
        let layers = stateApp.checkedBaseLayers.slice(0);
        layers.sort(function (a, b) {
          return b - a;
        });
        if (layers.length > 0) {
          let belowlayer = null;
          for (let k = layers.length - 1; k >= 0; k--) {
            let i = layers[k];
            let currentLayerArray = stateApp.baseMapLayers[i].id;
            // eslint-disable-next-line no-loop-func
            currentLayerArray.forEach((j) => {
              var mapLayer = map.getLayer(j);
              if (typeof mapLayer !== "undefined") {
                if (map.getLayer(j)) {
                  map.setLayoutProperty(j, "visibility", "visible");
                  if (belowlayer != null) {
                    map.moveLayer(j, belowlayer);
                  }
                  belowlayer = j;
                }
              }
            });
          }
        }
      }
    }
  }, [map, stateApp.checkedBaseLayers, stateApp.baseMapLayers]);

  useEffect(() => {
    console.log("useEffect 16");

    // USE EFFECT FOR HEATMAP LAYER HANDLES
    console.log("heatmap layer ue start");
    if (stateApp.heatLayers.length > 0 && map) {
      stateApp.heatLayers.forEach((l) => {
        l.id.forEach((k) => {
          if (map.getLayer(k)) {
            map.setLayoutProperty(k, "visibility", "none");
          }
        });
      });

      if (stateApp.checkedHeats.length > 0) {
        let layers = stateApp.checkedHeats.slice(0);
        layers.sort(function (a, b) {
          return b - a;
        });
        if (layers.length > 0) {
          let belowlayer = null;
          for (let k = layers.length - 1; k >= 0; k--) {
            let i = layers[k];
            let currentLayerArray = stateApp.heatLayers[i].id;
            // eslint-disable-next-line no-loop-func
            currentLayerArray.forEach((j) => {
              var mapLayer = map.getLayer(j);
              if (typeof mapLayer !== "undefined") {
                if (map.getLayer(j)) {
                  map.setLayoutProperty(j, "visibility", "visible");
                  if (belowlayer != null) {
                    map.moveLayer(j, belowlayer);
                  }
                  belowlayer = j;
                }
              }
            });
          }
        }
      }
    }
  }, [map, stateApp.checkedHeats, stateApp.heatLayers]);

  // useEffect(() => {
  //   console.log("useEffect 17");

  //   ///////////////// EFFECT FOR SHOWING TRACKED WELLS /////////////////

  //   if (map && stateApp.trackFilterOn && stateApp.trackedWellArray) {
  //     console.log("array ", stateApp.trackedWellArray);

  //     const makeGeoJSON = (data) => {
  //       return {
  //         type: "FeatureCollection",
  //         features: data.map((feature) => {
  //           return {
  //             type: "Feature",
  //             properties: {
  //               api: feature.api,
  //               id: feature.id,
  //               latitude: feature.latitude,
  //               longitude: feature.longitude,
  //               operator: feature.operator,
  //               WellName: feature.wellName,
  //             },
  //             geometry: {
  //               type: "Point",
  //               coordinates: [feature.longitude, feature.latitude],
  //             },
  //           };
  //         }),
  //       };
  //     };

  //     const myGeoJSONData = makeGeoJSON(
  //       stateApp.trackedWellArray.wells.results
  //     );

  //     map.addSource("track_well_points_source", {
  //       type: "geojson",
  //       data: myGeoJSONData,
  //     });

  //     map.addLayer({
  //       id: "track_well_points_layer",
  //       type: "circle",
  //       source: "track_well_points_source",
  //       paint: {
  //         "circle-radius": 5,
  //         "circle-color": "yellow",
  //       },
  //     });

  //     // const latArray = stateApp.trackedWellArray.wells.results.map(
  //     //   (item) => item.latitude
  //     // );
  //     // const longArray = stateApp.trackedWellArray.wells.results.map(
  //     //   (item) => item.longitude
  //     // );

  //     map.on("click", "track_well_points_layer", function (e) {
  //       var bbox = [
  //         [e.point.x - 10, e.point.y - 10],
  //         [e.point.x + 10, e.point.y + 10],
  //       ];

  //       let features = map.queryRenderedFeatures(bbox, {
  //         layers: ["track_well_points_layer"],
  //       });

  //       setStateApp((state) => ({ ...state, flyTo: features[0].properties }));
  //     });

  //     map.on("mousemove", "track_well_points_layer", (e) => {
  //       map.getCanvas().style.cursor = "pointer";
  //     });

  //     map.on("mouseleave", "track_well_points_layer", function () {
  //       map.getCanvas().style.cursor = "";
  //     });

  //     // var bbox = [
  //     //   [Math.min(...longArray), Math.min(...latArray)],
  //     //   [Math.max(...longArray), Math.max(...latArray)],
  //     // ];

  //     // map.fitBounds(bbox, {
  //     //   padding: { top: 50, bottom: 50, left: 50, right: 50 },
  //     // });
  //   }
  // }, [stateApp.trackFilterOn]);

  // useEffect(() => {
  //   console.log("useEffect 18");

  //   // USE EFFECT FOR USER DEFINED DATA LAYER HANDLE
  //   // setStateApp((state) => ({
  //   //   ...state,
  //   //   popupOpen: false,
  //   //   selectedUserDefinedLayer: undefined,
  //   // }));

  //   if (stateApp.userDefinedLayers.length > 0 && map) {
  //     stateApp.userDefinedLayers.forEach((l) => {
  //       l.id.forEach((k, i) => {
  //         let clusterLabelBar = k + "-clusters-counts";
  //         if (map.getLayer(clusterLabelBar)) {
  //           // map.removeLayer(clusterLabelBar);
  //           // map.removeSource(l.sourceProps[i].sourceId);
  //           map.setLayoutProperty(clusterLabelBar, "visibility", "none");
  //         }

  //         let clusterVar = k + "-clusters";
  //         if (map.getLayer(clusterVar)) {
  //           // map.removeLayer(clusterVar);
  //           // map.removeSource(l.sourceProps[i].sourceId);
  //           map.setLayoutProperty(clusterVar, "visibility", "none");
  //         }

  //         if (map.getLayer(k)) {
  //           // map.removeLayer(k);
  //           // map.removeSource(l.sourceProps[i].sourceId);
  //           map.setLayoutProperty(k, "visibility", "none");
  //         }
  //       });
  //     });
  //   }

  //   // this section adds the updated list of layers
  //   const tmpCheckedLayer = stateApp.tempCheckedUserDefinedLayer;
  //   const tmpCheckedAOILayer = stateApp.tempCheckedAOILayer;
  //   const tmpCheckedParcelLayer = stateApp.tempCheckedParcleLayer;

  //   const checkedLayers = stateApp.checkedUserDefinedLayers.slice(0);
  //   if (
  //     tmpCheckedLayer != null &&
  //     stateApp.checkedUserDefinedLayers.indexOf(tmpCheckedLayer) === -1
  //   ) {
  //     checkedLayers.push(tmpCheckedLayer);
  //   }

  //   if (
  //     tmpCheckedAOILayer != null &&
  //     stateApp.checkedUserDefinedLayers.indexOf(tmpCheckedAOILayer) === -1
  //   ) {
  //     checkedLayers.push(tmpCheckedAOILayer);
  //   }

  //   if (
  //     tmpCheckedParcelLayer != null &&
  //     stateApp.checkedUserDefinedLayers.indexOf(tmpCheckedParcelLayer) === -1
  //   ) {
  //     checkedLayers.push(tmpCheckedParcelLayer);
  //   }

  //   if (map && checkedLayers.length > 0) {
  //     let layers = checkedLayers;
  //     layers.sort(function (a, b) {
  //       return b - a;
  //     });
  //     const layerList = stateApp.userDefinedLayers.slice(0);
  //     let beforelayer = null;
  //     let fitBounds = null;

  //     for (let k = layers.length - 1; k >= 0; k--) {
  //       const l = layers[k];

  //       const selectLayerProps = { ...layerList[l] };

  //       if (selectLayerProps.type === "data layer") {
  //         for (let i = 0; i < selectLayerProps.id.length; i++) {
  //           // -> fetch data
  //           let layerData = [];
  //           if (selectLayerProps.dataProps[i].dataId == "trackedWellsWells") {
  //             layerData = stateApp.trackedwells;
  //           } else if (
  //             selectLayerProps.dataProps[i].dataId == "trackedOwnersWells"
  //           ) {
  //             layerData = stateApp.trackedOwnerWells;
  //           } else if (
  //             selectLayerProps.dataProps[i].dataId == "wellsFromSearch"
  //           ) {
  //             layerData = stateApp.wellListFromSearch;
  //           } else if (
  //             selectLayerProps.dataProps[i].dataId == "wellsFromTagsFilter"
  //           ) {
  //             layerData = stateApp.wellListFromTagsFilter;
  //           } else {
  //             const dataId = selectLayerProps.dataProps[i].dataId;

  //             const groupBy = (arr, property) => {
  //               return arr.reduce((memo, x) => {
  //                 if (!memo[x[property]]) {
  //                   memo[x[property]] = [];
  //                 }
  //                 memo[x[property]].push(x);
  //                 return memo;
  //               }, {});
  //             };

  //             layerData = groupBy(stateApp.customLayers, "layer")[dataId];
  //           }

  //           if (layerData && layerData.length !== 0) {
  //             // -> make GEOJSON

  //             const makeGeoJSON = (data) => {
  //               return {
  //                 type: "FeatureCollection",
  //                 features: data.map((feature) => {
  //                   if (selectLayerProps.dataProps[i].dataTypeId == "Point") {
  //                     return {
  //                       type: "Feature",
  //                       properties: feature,
  //                       geometry: {
  //                         type: selectLayerProps.dataProps[i].dataTypeId,
  //                         coordinates: [feature.longitude, feature.latitude],
  //                       },
  //                     };
  //                   } else {
  //                     return JSON.parse(feature.shape);
  //                   }
  //                 }),
  //               };
  //             };

  //             const myGeoJSONData = makeGeoJSON(layerData);

  //             const layerId = selectLayerProps.layerProps[i].layerId;
  //             if (map.getLayer(layerId)) {
  //               map.setLayoutProperty(layerId, "visibility", "visible");
  //               if (map.getSource(selectLayerProps.sourceProps[i].sourceId)) {
  //                 map
  //                   .getSource(selectLayerProps.sourceProps[i].sourceId)
  //                   .setData(myGeoJSONData);
  //               }
  //               if (
  //                 map.getSource(
  //                   selectLayerProps.sourceProps[i].sourceId + "_filter"
  //                 )
  //               ) {
  //                 map
  //                   .getSource(
  //                     selectLayerProps.sourceProps[i].sourceId + "_filter"
  //                   )
  //                   .setData(myGeoJSONData);
  //               }
  //               const layer = map.getLayer(layerId);
  //               if (!layer.source.includes("_filter")) {
  //                 let clusterLabelBar = layerId + "-clusters-counts";
  //                 if (map.getLayer(clusterLabelBar)) {
  //                   map.setLayoutProperty(
  //                     clusterLabelBar,
  //                     "visibility",
  //                     "visible"
  //                   );
  //                   if (beforelayer) {
  //                     map.moveLayer(clusterLabelBar, beforelayer);
  //                   }
  //                   beforelayer = clusterLabelBar;
  //                 }

  //                 let clusterVar = layerId + "-clusters";
  //                 if (map.getLayer(clusterVar)) {
  //                   map.setLayoutProperty(clusterVar, "visibility", "visible");
  //                   if (beforelayer) {
  //                     map.moveLayer(clusterVar, beforelayer);
  //                   }
  //                   beforelayer = clusterVar;
  //                 }
  //               }
  //             } else {
  //               // -> add source
  //               if (selectLayerProps.dataProps[i].dataTypeId == "Point") {
  //                 if (map.getSource(selectLayerProps.sourceProps[i].sourceId)) {
  //                   map.getSource(selectLayerProps.sourceProps[i].sourceId).setData(myGeoJSONData);
  //                 } else {
  //                   map.addSource(selectLayerProps.sourceProps[i].sourceId, {
  //                     type: selectLayerProps.sourceProps[i].sourceType,
  //                     data: myGeoJSONData,
  //                     cluster: true,
  //                     clusterRadius: 50,
  //                     clusterMaxZoom: 6,
  //                   });
  //                 }
  //                 const filterLayerId = selectLayerProps.sourceProps[i].sourceId + "_filter";
  //                 if (map.getSource(filterLayerId)) {
  //                   map.getSource(filterLayerId).setData(myGeoJSONData);
  //                 } else {
  //                   map.addSource(filterLayerId, {
  //                     type: selectLayerProps.sourceProps[i].sourceType,
  //                     data: myGeoJSONData,
  //                   });
  //                 }
  //               } else {
  //                 if (map.getSource(selectLayerProps.sourceProps[i].sourceId)) {
  //                   map.getSource(selectLayerProps.sourceProps[i].sourceId).setData(myGeoJSONData);
  //                 } else {
  //                   map.addSource(selectLayerProps.sourceProps[i].sourceId, {
  //                     type: selectLayerProps.sourceProps[i].sourceType,
  //                     data: myGeoJSONData,
  //                     promoteId: "id",
  //                   });
  //                 }
  //               }

  //               // -> add layer
  //               // eslint-disable-next-line eqeqeq
  //               if (selectLayerProps.layerProps[i].layerType == "symbol") {
  //                 map.addLayer({
  //                   id: selectLayerProps.layerProps[i].layerId,
  //                   type: selectLayerProps.layerProps[i].layerType,
  //                   source: selectLayerProps.sourceProps[i].sourceId,
  //                   layout: selectLayerProps.layerProps[i].symbolProps,
  //                 });
  //               } else {
  //                 map.addLayer({
  //                   id: selectLayerProps.layerProps[i].layerId,
  //                   type: selectLayerProps.layerProps[i].layerType,
  //                   source: selectLayerProps.sourceProps[i].sourceId,
  //                   paint: selectLayerProps.layerProps[i].paintProps,
  //                 });
  //               }

  //               // -> add cluster layer

  //               if (
  //                 selectLayerProps &&
  //                 selectLayerProps.layerProps &&
  //                 selectLayerProps.layerProps[i].clusterProps
  //               ) {
  //                 var clusterVar =
  //                   selectLayerProps.layerProps[i].layerId + "-clusters";
  //                 var clusterLabelBar =
  //                   selectLayerProps.layerProps[i].layerId + "-clusters-counts";

  //                 map.addLayer({
  //                   id: clusterLabelBar,
  //                   type: "symbol",
  //                   source: selectLayerProps.sourceProps[i].sourceId,
  //                   filter: ["has", "point_count"],
  //                   layout:
  //                     selectLayerProps.layerProps[i].clusterProps
  //                       .clusterSymbolProps,
  //                 });
  //                 if (beforelayer) {
  //                   map.moveLayer(clusterLabelBar, beforelayer);
  //                 }
  //                 beforelayer = clusterLabelBar;

  //                 map.addLayer({
  //                   id: clusterVar,
  //                   type: selectLayerProps.layerProps[i].layerType,
  //                   source: selectLayerProps.sourceProps[i].sourceId,
  //                   filter: ["has", "point_count"],
  //                   paint:
  //                     selectLayerProps.layerProps[i].clusterProps
  //                       .clusterPaintProps,
  //                 });

  //                 if (beforelayer) {
  //                   map.moveLayer(clusterVar, beforelayer);
  //                 }
  //                 beforelayer = clusterVar;
  //               }
  //             }

  //             // -> add interaction (note to change later w/ interaction panel)
  //             if (selectLayerProps && selectLayerProps.interactionProps) {
  //               const availableInteraction =
  //                 stateApp.checkedUserDefinedLayersInteraction.indexOf(l) !==
  //                 -1;
  //               if (
  //                 selectLayerProps &&
  //                 selectLayerProps.interactionProps &&
  //                 selectLayerProps.interactionProps.hoverActions
  //               ) {
  //                 var clusterVar =
  //                   selectLayerProps.layerProps[i].layerId + "-clusters";

  //                 if (
  //                   selectLayerProps.interactionProps.hoverActions.mouseMove
  //                 ) {
  //                   const mouseMoveHandler = () => {
  //                     map.getCanvas().style.cursor =
  //                       selectLayerProps.interactionProps.hoverActions.mouseMove.cursor;
  //                   };
  //                   if (
  //                     selectLayerProps.interactionProps.hoverActions
  //                       .mouseMoveHandler
  //                   ) {
  //                     const oldHander =
  //                       selectLayerProps.interactionProps.hoverActions
  //                         .mouseMoveHandler;
  //                     map.off(
  //                       "mousemove",
  //                       selectLayerProps.layerProps[i].layerId,
  //                       oldHander
  //                     );
  //                     if (selectLayerProps.layerProps[i].clusterProps) {
  //                       map.off("mousemove", clusterVar, oldHander);
  //                     }
  //                   }
  //                   if (availableInteraction) {
  //                     let handler = null;
  //                     if (
  //                       selectLayerProps.interactionProps.hoverActions
  //                         .mouseMoveHandler
  //                     ) {
  //                       handler =
  //                         selectLayerProps.interactionProps.hoverActions
  //                           .mouseMoveHandler;
  //                     } else {
  //                       handler = mouseMoveHandler;
  //                     }

  //                     map.on(
  //                       "mousemove",
  //                       selectLayerProps.layerProps[i].layerId,
  //                       handler
  //                     );
  //                     if (selectLayerProps.layerProps[i].clusterProps) {
  //                       map.on("mousemove", clusterVar, handler);
  //                     }
  //                     selectLayerProps.interactionProps.hoverActions.mouseMoveHandler = handler;
  //                   }
  //                 }

  //                 if (
  //                   selectLayerProps.interactionProps.hoverActions.mouseLeave
  //                 ) {
  //                   const mouseLeaveHandler = () => {
  //                     map.getCanvas().style.cursor =
  //                       selectLayerProps.interactionProps.hoverActions.mouseLeave.cursor;
  //                   };
  //                   if (
  //                     selectLayerProps.interactionProps.hoverActions
  //                       .mouseLeaveHandler
  //                   ) {
  //                     const oldHander =
  //                       selectLayerProps.interactionProps.hoverActions
  //                         .mouseLeaveHandler;
  //                     map.off(
  //                       "mouseleave",
  //                       selectLayerProps.layerProps[i].layerId,
  //                       oldHander
  //                     );
  //                     if (selectLayerProps.layerProps[i].clusterProps) {
  //                       map.off("mouseleave", clusterVar, oldHander);
  //                     }
  //                   }
  //                   if (availableInteraction) {
  //                     let handler = null;
  //                     if (
  //                       selectLayerProps.interactionProps.hoverActions
  //                         .mouseLeaveHandler
  //                     ) {
  //                       handler =
  //                         selectLayerProps.interactionProps.hoverActions
  //                           .mouseLeaveHandler;
  //                     } else {
  //                       handler = mouseLeaveHandler;
  //                     }
  //                     map.on(
  //                       "mouseleave",
  //                       selectLayerProps.layerProps[i].layerId,
  //                       mouseLeaveHandler
  //                     );
  //                     if (selectLayerProps.layerProps[i].clusterProps) {
  //                       map.on("mouseleave", clusterVar, mouseLeaveHandler);
  //                     }
  //                     selectLayerProps.interactionProps.hoverActions.mouseLeaveHandler = mouseLeaveHandler;
  //                   }
  //                 }
  //               }

  //               layerList[l] = selectLayerProps;
  //             }

  //             if (beforelayer) {
  //               map.moveLayer(
  //                 selectLayerProps.layerProps[i].layerId,
  //                 beforelayer
  //               );
  //             }
  //             beforelayer = selectLayerProps.layerProps[i].layerId;

  //             //// finding and fitting bounds
  //             // eslint-disable-next-line no-loop-func
  //             const findBounds = (wells) => {
  //               let latArray = wells.map((item) => item.latitude);
  //               let longArray = wells.map((item) => item.longitude);

  //               latArray = latArray.filter((item) => item !== 0);
  //               longArray = longArray.filter((item) => item !== 0);

  //               let maxLat = Math.max(...latArray);
  //               let minLat = Math.min(...latArray);
  //               let maxLong = Math.max(...longArray);
  //               let minLong = Math.min(...longArray);

  //               if (fitBounds) {
  //                 const {
  //                   maxLat: maxLatSApp,
  //                   minLat: minLatSApp,
  //                   maxLong: maxLongSApp,
  //                   minLong: minLongSApp,
  //                 } = fitBounds;

  //                 return {
  //                   maxLat: maxLatSApp < maxLat ? maxLat : maxLatSApp,
  //                   minLat: minLatSApp > minLat ? minLat : minLatSApp,
  //                   maxLong: maxLongSApp < maxLong ? maxLong : maxLongSApp,
  //                   minLong: minLongSApp > minLong ? minLong : minLongSApp,
  //                 };
  //               }

  //               return { maxLat, minLat, maxLong, minLong };
  //             };

  //             fitBounds = layerData ? findBounds(layerData) : null;
  //           }
  //         }
  //       }
  //     }
  //     if (fitBounds) {
  //       const fitOverBounds = ({ maxLat, minLat, maxLong, minLong }) => {
  //         const latDif = maxLat - minLat;
  //         const longDif = maxLong - minLong;

  //         if (latDif === 0) {
  //           maxLat = maxLat + 0.005 > 90 ? 90 : maxLat + 0.005;
  //           minLat = minLat - 0.005 < -90 ? -90 : minLat - 0.005;
  //         } else {
  //           maxLat = maxLat + latDif * 0.08 > 90 ? 90 : maxLat + latDif * 0.08;
  //           minLat =
  //             minLat - latDif * 0.08 < -90 ? -90 : minLat - latDif * 0.08;
  //         }

  //         if (longDif === 0) {
  //           maxLong = maxLong + 0.005 > 180 ? 180 : maxLong + 0.005;
  //           minLong = minLong - 0.005 < -180 ? -180 : minLong - 0.005;
  //         } else {
  //           maxLong =
  //             maxLong + longDif * 0.08 > 180 ? 180 : maxLong + latDif * 0.08;
  //           maxLong =
  //             maxLong - longDif * 0.08 < -180 ? -180 : maxLong - latDif * 0.08;
  //         }

  //         return {
  //           maxLat,
  //           minLat,
  //           maxLong,
  //           minLong,
  //         };
  //       };

  //       let bounds = fitOverBounds(fitBounds);

  //       if (
  //         bounds &&
  //         bounds.minLong &&
  //         bounds.maxLong &&
  //         bounds.minLat &&
  //         bounds.maxLat &&
  //         !stateApp.fitBounds
  //       ) {
  //         map.fitBounds([
  //           [bounds.minLong, bounds.minLat],
  //           [bounds.maxLong, bounds.maxLat],
  //         ]);
  //       }
  //     }

  //     setStateApp((stateApp) => ({
  //       ...stateApp,
  //       userDefinedLayers: layerList,
  //       fitBounds: { ...stateApp.fitBounds },
  //     }));
  //   }
  // }, [
  //   map,
  //   stateApp.checkedUserDefinedLayers,
  //   stateApp.checkedUserDefinedLayersInteraction,
  //   stateApp.tempCheckedUserDefinedLayer,
  //   stateApp.tempCheckedAOILayer,
  //   stateApp.tempCheckedParcleLayer,
  //   stateApp.customLayers,
  //   stateApp.trackedwells,
  //   stateApp.trackedOwnerWells,
  //   stateApp.wellListFromSearch,
  //   stateApp.wellListFromTagsFilter,
  // ]);

  useEffect(() => {
    console.log("useEffect 19");

    if (showExpandableCard) {
      setTransform("transform: none");
    } else {
      setTransform("transform: inherit");
    }
  }, [showExpandableCard]);

  useEffect(() => {
    console.log("useEffect 20");

    if (stateNav.m1neralDefaultsOnOff) {
      setDefaultsCheckOnOff((defaultsCheckOnOff) => !defaultsCheckOnOff);
    }
    if (stateNav.m1neralCehckOnOff) {
      setM1neralCheckOnOff((m1neralCheckOnOff) => !m1neralCheckOnOff);
    }
  }, [stateNav.m1neralCehckOnOff, stateNav.m1neralDefaultsOnOff]);

  useEffect(() => {
    console.log("useEffect 21");

    console.log("filter ue start");
    //applies filter when one of the filters change
    if (map) {
      let isFilterSet = false;

      let wellFilterCount = 0;
      let ownershipFilterCount = 0;
      let productionFilterCount = 0;
      let geographyFilterCount = 0;
      let valuationFilterCount = 0;
      let aiFilterCount = 0;
      let totalCount = 0;
      let tagFilterCount = 0;
      let filterArray = [];
      let filterCustomArray = {};

      let defaultOverride = true;

      if (
        defaultOverride == true &&
        stateNav.defaultOn &&
        !stateNav.filterWellStatus &&
        !stateNav.filterWellType &&
        filterArray.length === 0
      ) {
        // let defaultTypeName = ["typeName", ["GAS", "OIL", "OIL AND GAS", "PERMITTED", "UNKNOWN"]];
        // let defaultStatusName = ["statusName",
        // [
        //   "ACTIVE",
        //   "ACTIVE - DRILLING",
        //   "COMPLETED - NOT ACTIVE",
        //   "DRILLED UNCOMPLETED (DUC)",
        //   "PERMIT",
        //   "PERMIT - EXISTING WELL",
        //   "PERMIT - NEW DRILL",
        // ],];

        let defaultTypeName = ["typeName", []];
        let defaultStatusName = ["statusName", []];

        let defaultFiltersWellStatus = [
          "filterWellStatus",
          ["match", ["get", "wellStatus"], defaultStatusName[1], true, false],
        ];
        let defaultFiltersWellType = [
          "filterWellType",
          ["match", ["get", "wellType"], defaultTypeName[1], true, false],
        ];
        const m1neralDefaults = [
          {
            name: "M1neral Default Filters",
            filters: [defaultFiltersWellStatus, defaultFiltersWellType],
            types: [defaultTypeName, defaultStatusName],
            on: m1neralCheckOnOff,
            default: defaultsCheckOnOff,
          },
        ];

        let wellTypeFilter = null;
        let wellStatusFilter = null;

        // console.log('***********',defaultTypeName[1])
        // console.log('***********',defaultStatusName[1].length)

        if (defaultTypeName[1].length > 0) {
          wellTypeFilter = defaultFiltersWellType[1];
        }
        if (defaultStatusName[1].length > 0) {
          wellStatusFilter = defaultFiltersWellStatus[1];
        }

        setStateNav((stateNav) => ({
          ...stateNav,
          defaultOn: false,
          statusName: defaultStatusName[1],
          typeName: defaultTypeName[1],
          m1neralDefaultFilters: m1neralDefaults,
          filterWellStatus: wellStatusFilter,
          filterWellType: wellTypeFilter,
        }));
      }
      if (stateNav.filterWellProfile && stateNav.filterWellProfile.length > 0) {
        let total = stateNav.filterWellProfile[2].length;
        filterArray.push(stateNav.filterWellProfile);
        isFilterSet = true;

        wellFilterCount += total;
        totalCount += total;
      }
      if (stateNav.filterWellType && stateNav.filterWellType.length > 0) {
        let total = stateNav.filterWellType[2].length;
        filterArray.push(stateNav.filterWellType);
        isFilterSet = true;
        wellFilterCount += total;
        totalCount += total;
      }
      if (stateNav.filterOwnerCount && stateNav.filterOwnerCount.length > 0) {
        filterArray.push(stateNav.filterOwnerCount);
        isFilterSet = true;
        ownershipFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterOwnerConfidence &&
        stateNav.filterOwnerConfidence.length > 0
      ) {
        filterArray.push(stateNav.filterOwnerConfidence);
        isFilterSet = true;
        aiFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterNoOwnerCount &&
        stateNav.filterNoOwnerCount.length > 0
      ) {
        filterArray.push(stateNav.filterNoOwnerCount);
        isFilterSet = true;
        ownershipFilterCount += 1;
        totalCount += 1;
      }

      if (
        stateNav.filterHasOwnerCount &&
        stateNav.filterHasOwnerCount.length > 0
      ) {
        filterArray.push(stateNav.filterHasOwnerCount);
        isFilterSet = true;
        ownershipFilterCount += 1;
        totalCount += 1;
      }
      if (stateNav.filterHasOwners && stateNav.filterHasOwners.length > 0) {
        filterArray.push(stateNav.filterHasOwners);
        isFilterSet = true;
        ownershipFilterCount += 1;
        totalCount += 1;
      }
      if (stateNav.filterWellStatus && stateNav.filterWellStatus.length > 0) {
        let total = stateNav.filterWellStatus[2].length;
        filterArray.push(stateNav.filterWellStatus);
        isFilterSet = true;
        wellFilterCount += total;
        totalCount += total;
      }
      if (stateNav.filterOperator && stateNav.filterOperator.length > 0) {
        let total = stateNav.filterOperator[2].length;
        filterArray.push(stateNav.filterOperator);
        isFilterSet = true;
        wellFilterCount += total;
        totalCount += total;
      }
      if (
        stateNav.filterWellAppraisal &&
        stateNav.filterWellAppraisal.length > 0
      ) {
        filterArray.push(stateNav.filterWellAppraisal);
        isFilterSet = true;
        valuationFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterCumulativeOil &&
        stateNav.filterCumulativeOil.length > 0
      ) {
        filterArray.push(stateNav.filterCumulativeOil);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterCumulativeGas &&
        stateNav.filterCumulativeGas.length > 0
      ) {
        filterArray.push(stateNav.filterCumulativeGas);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterCumulativeWater &&
        stateNav.filterCumulativeWater.length > 0
      ) {
        filterArray.push(stateNav.filterCumulativeWater);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterFirstMonthWater &&
        stateNav.filterFirstMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterFirstMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterFirstThreeMonthWater &&
        stateNav.filterFirstThreeMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterFirstThreeMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterFirstSixMonthWater &&
        stateNav.filterFirstSixMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterFirstSixMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterFirstTwelveMonthWater &&
        stateNav.filterFirstTwelveMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterFirstTwelveMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterLastMonthWater &&
        stateNav.filterLastMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterLastMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterLastThreeMonthWater &&
        stateNav.filterLastThreeMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterLastThreeMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterLastSixMonthWater &&
        stateNav.filterLastSixMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterLastSixMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterLastTwelveMonthWater &&
        stateNav.filterLastTwelveMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterLastTwelveMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterFirstMonthGas &&
        stateNav.filterFirstMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterFirstMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterFirstThreeMonthGas &&
        stateNav.filterFirstThreeMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterFirstThreeMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterFirstSixMonthGas &&
        stateNav.filterFirstSixMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterFirstSixMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterFirstTwelveMonthGas &&
        stateNav.filterFirstTwelveMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterFirstTwelveMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterLastMonthGas &&
        stateNav.filterLastMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterLastMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterLastThreeMonthGas &&
        stateNav.filterLastThreeMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterLastThreeMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterLastSixMonthGas &&
        stateNav.filterLastSixMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterLastSixMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterLastTwelveMonthGas &&
        stateNav.filterLastTwelveMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterLastTwelveMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterFirstMonthOil &&
        stateNav.filterFirstMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterFirstMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterFirstThreeMonthOil &&
        stateNav.filterFirstThreeMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterFirstThreeMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterFirstSixMonthOil &&
        stateNav.filterFirstSixMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterFirstSixMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterFirstTwelveMonthOil &&
        stateNav.filterFirstTwelveMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterFirstTwelveMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterLastMonthOil &&
        stateNav.filterLastMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterLastMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterLastThreeMonthOil &&
        stateNav.filterLastThreeMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterLastThreeMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterLastSixMonthOil &&
        stateNav.filterLastSixMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterLastSixMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterLastTwelveMonthOil &&
        stateNav.filterLastTwelveMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterLastTwelveMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterAllInterestTypes &&
        stateNav.filterAllInterestTypes.length > 0
      ) {
        let removeAny = 1;
        let numberFiltes = stateNav.filterAllInterestTypes.length;
        let total = numberFiltes - removeAny;
        filterArray.push(stateNav.filterAllInterestTypes);
        isFilterSet = true;
        ownershipFilterCount += total;
        totalCount += total;
      }
      if (
        stateNav.filterAllOwnershipTypes &&
        stateNav.filterAllOwnershipTypes.length > 0
      ) {
        let removeAny = 1;
        let numberFiltes = stateNav.filterAllOwnershipTypes.length;
        let total = numberFiltes - removeAny;
        filterArray.push(stateNav.filterAllOwnershipTypes);
        isFilterSet = true;
        ownershipFilterCount += total;
        totalCount += total;
      }

      if (
        stateNav.filterOwnerAppraisals &&
        stateNav.filterOwnerAppraisals.length > 0
      ) {
        let removeAny = 1;
        let numberFiltes = stateNav.filterOwnerAppraisals.length;
        let total = numberFiltes - removeAny;
        filterArray.push(stateNav.filterOwnerAppraisals);
        isFilterSet = true;
        valuationFilterCount += total;
        totalCount += total;
      }

      let fitBounds = null;

      const findBounds = (shapes) => {
        let bound = null;
        if (
          fitBounds &&
          fitBounds.maxLat &&
          fitBounds.minLat &&
          fitBounds.maxLong &&
          fitBounds.minLong
        ) {
          bound = fitBounds;
        }
        if (shapes && shapes.length > 0) {
          shapes.forEach((shape) => {
            if (gjv.valid(shape)) {
              const bbox = turf.bbox(shape);

              if (bound) {
                bound.minLong =
                  bound.minLong > bbox[0] ? bbox[0] : bound.minLong;
                bound.minLat = bound.minLat > bbox[1] ? bbox[1] : bound.minLat;
                bound.maxLong =
                  bound.maxLong < bbox[2] ? bbox[2] : bound.maxLong;
                bound.maxLat = bound.maxLat < bbox[3] ? bbox[3] : bound.maxLat;
              } else {
                bound = {
                  minLong: bbox[0],
                  minLat: bbox[1],
                  maxLong: bbox[2],
                  maxLat: bbox[3],
                };
              }
            }
          });
        }
        return { ...bound };
      };

      const formatIt = (mdata) => {
        return [
          {
            type: "FeatureCollection",
            features: mdata
              .filter(
                (feature) =>
                  (feature.latitude && feature.longitude) ||
                  (feature.Latitude && feature.Longitude)
              )
              .map((feature) => {
                if (feature.latitude && feature.longitude) {
                  return {
                    type: "Feature",
                    properties: feature,
                    geometry: {
                      type: "Point",
                      coordinates: [feature.longitude, feature.latitude],
                    },
                  };
                } else {
                  return {
                    type: "Feature",
                    properties: feature,
                    geometry: {
                      type: "Point",
                      coordinates: [feature.Longitude, feature.Latitude],
                    },
                  };
                }
              }),
          },
        ];
      };

      if (stateNav.filterTrackedWells) {
        // filterArray.push(stateNav.filterTrackedWells);
        // isFilterSet = true;
        tagFilterCount += 1;
        totalCount += 1;
        if (stateApp.trackedwells && stateApp.trackedwells.length > 0)
          fitBounds = findBounds(formatIt(stateApp.trackedwells));
      }
      if (stateNav.filterTrackedOwners) {
        // filterArray.push(stateNav.filterTrackedWells);
        // isFilterSet = true;
        tagFilterCount += 1;
        totalCount += 1;
        if (stateApp.trackedOwnerWells && stateApp.trackedOwnerWells.length > 0)
          fitBounds = findBounds(formatIt(stateApp.trackedOwnerWells));
      }

      if (stateNav.filterTags && stateNav.filterTags.length > 0) {
        filterArray.push(stateNav.filterTags);
        isFilterSet = true;
        totalCount += stateNav.selectedTags ? stateNav.selectedTags.length : 0;
        tagFilterCount += stateNav.selectedTags
          ? stateNav.selectedTags.length
          : 0;

        if (
          stateApp.wellListFromTagsFilter &&
          stateApp.wellListFromTagsFilter.length > 0
        )
          fitBounds = findBounds(formatIt(stateApp.wellListFromTagsFilter));
      }

      const setLayerSource = (layerId, source, sourceLayer = null) => {
        const oldLayers = map.getStyle().layers;
        const cluster_layer = `${layerId}-clusters`;
        const cluster_counts_layer = `${layerId}-clusters-counts`;
        const layer = map.getLayer(layerId);
        if (source.includes("_filter")) {
          if (map.getLayer(cluster_layer)) {
            map.setLayoutProperty(cluster_layer, "visibility", "none");
          }

          if (map.getLayer(cluster_counts_layer)) {
            map.setLayoutProperty(cluster_counts_layer, "visibility", "none");
          }
        } else {
          if (layer.visibility == "visible") {
            if (map.getLayer(cluster_layer)) {
              map.setLayoutProperty(cluster_layer, "visibility", "visible");
            }

            if (map.getLayer(cluster_counts_layer)) {
              map.setLayoutProperty(
                cluster_counts_layer,
                "visibility",
                "visible"
              );
            }
          }
        }
        const layerIndex = oldLayers.findIndex((l) => l.id === layerId);
        const layerDef = oldLayers[layerIndex];
        const before =
          oldLayers[layerIndex + 1] && oldLayers[layerIndex + 1].id;
        layerDef.source = source;
        if (sourceLayer) {
          layerDef["source-layer"] = sourceLayer;
        }
        map.removeLayer(layerId);
        map.addLayer(layerDef, before);
      };

      const filterShapeAction = (shapeList, filterLayers) => {
        filterLayers.forEach((filterLayer) => {
          let layer = map.getLayer(filterLayer);
          if (layer) {
            if (layer.type == "circle" && layer.id != "wellpoints") {
              if (!layer.source.includes("_filter")) {
                const filterSource = layer.source + "_filter";
                setLayerSource(layer.id, filterSource);
                layer = map.getLayer(filterLayer);
              }
            }
            let featuresList = [];
            if (layer.source === "composite") {
              // console.log(map.getSource(layer.source));
              featuresList = map.querySourceFeatures("composite", {
                sourceLayer: layer.sourceLayer,
              });
            } else {
              // console.log(map.getSource(layer.source));
              // featuresList = map.querySourceFeatures(layer.source);
              featuresList = map.getSource(layer.source)._data.features;
            }
            if (featuresList && featuresList.length > 0) {
              const result = featuresList.filter((feature) => {
                if (
                  feature &&
                  feature.geometry &&
                  feature.geometry.type === "MultiPolygon"
                ) {
                  for (
                    let i = 0;
                    i < feature.geometry.coordinates.length;
                    i++
                  ) {
                    const coordinates = feature.geometry.coordinates[i];
                    const geometry = {
                      type: "Polygon",
                      coordinates: coordinates,
                    };
                    let flag = 0;
                    for (let k = 0; k < shapeList.length; k++) {
                      if (shapeList[k].type === "MultiPolygon") {
                        let flagM = 0;
                        for (
                          let j = 0;
                          j < shapeList[k].coordinates.length;
                          j++
                        ) {
                          let filterCoordinates = shapeList[k].coordinates[j];
                          if (
                            filterCoordinates[0] &&
                            filterCoordinates[0].length > 2
                          ) {
                            filterCoordinates = filterCoordinates[0];
                          }
                          const filterGeometry = {
                            type: "Polygon",
                            coordinates: filterCoordinates,
                          };
                          if (!turf.booleanContains(filterGeometry, geometry)) {
                            flagM++;
                          }
                        }
                        if (flagM == shapeList[k].coordinates.length) {
                          flag++;
                        }
                      } else {
                        if (!turf.booleanContains(shapeList[k], geometry)) {
                          flag++;
                        }
                      }
                    }
                    if (flag === shapeList.length) {
                      return false;
                    }
                  }
                  return true;
                } else {
                  for (let i = 0; i < shapeList.length; i++) {
                    if (shapeList[i] && shapeList[i].type === "MultiPolygon") {
                      for (
                        let j = 0;
                        j < shapeList[i].coordinates.length;
                        j++
                      ) {
                        let filterCoordinates = shapeList[i].coordinates[j];
                        if (
                          filterCoordinates[0] &&
                          filterCoordinates[0].length > 2
                        ) {
                          filterCoordinates = filterCoordinates[0];
                        }
                        const filterGeometry = {
                          type: "Polygon",
                          coordinates: filterCoordinates,
                        };
                        if (
                          feature.geometry &&
                          feature.geometry.coordinates[0] &&
                          turf.booleanContains(filterGeometry, feature)
                        ) {
                          return true;
                        }
                      }
                    } else {
                      if (
                        feature.geometry &&
                        feature.geometry.coordinates[0] &&
                        turf.booleanContains(shapeList[i], feature)
                      ) {
                        return true;
                      }
                    }
                  }
                  return false;
                }
              });

              let ids = result.map(function (feature) {
                if (
                  [
                    "wellpoints",
                    "welllines",
                    "Tracked Wells",
                    "Tracked Owners",
                    "Tags Filter",
                  ].indexOf(filterLayer) > -1
                ) {
                  return feature.properties.id;
                } else if (["permits", "rigs"].indexOf(filterLayer) > -1) {
                  return feature.properties.Id;
                } else if (["interest", "parcel"].indexOf(filterLayer) > -1) {
                  return feature.properties.shapeLabel;
                }
                return feature.properties.VIEWID;
              });

              const onlyUnique = (value, index, self) => {
                return (
                  self.indexOf(value) === index &&
                  (typeof value === "number" || typeof value === "string")
                );
              };

              ids = ids.filter(onlyUnique);

              if (ids.length > 0) {
                if (!filterCustomArray[filterLayer]) {
                  filterCustomArray[filterLayer] = [];
                }
                filterCustomArray[filterLayer].push(ids);
              }
            }
          }
        });
      };

      if (stateNav.filterBasin && stateNav.filterBasin.length > 0) {
        stateApp.toggleLayersActivity("Basins", true);

        const filterLayers = [
          "GLOLeases",
          "GLOLeaseLabels",
          "GLOUnits",
          "GLOUnitLabels",
          "wellpoints",
          "welllines",
          "Tracked Wells",
          "Tracked Owners",
          "Tags Filter",
          "permits",
          "rigs",
          "interest",
          "parcel",
        ];

        const basinShapes = stateNav.filterBasin;

        fitBounds = findBounds(basinShapes);
        filterShapeAction(basinShapes, filterLayers);

        isFilterSet = true;
        if (stateNav.basinName) {
          filterCustomArray["basin"] = [
            "match",
            ["get", "NAME"],
            stateNav.basinName,
            true,
            false,
          ];

          if (stateNav.basinName.length) {
            geographyFilterCount += stateNav.basinName.length;
            totalCount += stateNav.basinName.length;
          }
        }
      }

      if (stateNav.filterAOI && stateNav.filterAOI.length > 0) {
        stateApp.toggleLayersActivity("Area of Interest", true);

        let aoiName = stateNav.aoiName;
        if (aoiName) {
          if (!filterCustomArray["interest"]) {
            filterCustomArray["interest"] = [];
          }
          filterCustomArray["interest"].push(aoiName);
        }
        const filterLayers = [
          "GLOLeases",
          "GLOLeaseLabels",
          "GLOUnits",
          "GLOUnitLabels",
          "wellpoints",
          "welllines",
          "Tracked Wells",
          "Tracked Owners",
          "Tags Filter",
          "permits",
          "rigs",
          "parcel",
        ];

        const aoiShapes = stateNav.filterAOI;
        fitBounds = findBounds(aoiShapes);

        filterShapeAction(aoiShapes, filterLayers);

        isFilterSet = true;
        geographyFilterCount += stateNav.aoiName.length;
        totalCount += stateNav.aoiName.length;
      }

      if (stateNav.filterParcel && stateNav.filterParcel.length > 0) {
        stateApp.toggleLayersActivity("Parcels", true);

        let parcelName = stateNav.parcelName;
        if (parcelName) {
          if (!filterCustomArray["parcel"]) {
            filterCustomArray["parcel"] = [];
          }
          filterCustomArray["parcel"].push(parcelName);
        }
        const filterLayers = [
          "GLOLeases",
          "GLOLeaseLabels",
          "GLOUnits",
          "GLOUnitLabels",
          "wellpoints",
          "welllines",
          "Tracked Wells",
          "Tracked Owners",
          "Tags Filter",
          "permits",
          "rigs",
          "interest",
        ];

        const parcelShapes = stateNav.filterParcel;
        fitBounds = findBounds(parcelShapes);

        filterShapeAction(parcelShapes, filterLayers);

        isFilterSet = true;
        geographyFilterCount += stateNav.parcelName.length;
        totalCount += stateNav.parcelName.length;
      }

      if (fitBounds) {
        setStateApp((stateApp) => ({
          ...stateApp,
          fitBounds: { ...fitBounds },
        }));
      }

      if (stateNav.filterPlay && stateNav.filterPlay.length > 0) {
        let total = stateNav.filterPlay[2].length;
        filterArray.push(stateNav.filterPlay);
        isFilterSet = true;
        geographyFilterCount += total;
        totalCount += total;
      }

      if (
        stateNav.filterPermitDateRange &&
        stateNav.filterPermitDateRange.length > 0
      ) {
        filterArray.push(stateNav.filterPermitDateRange);
        isFilterSet = true;
        totalCount += 1;
        wellFilterCount += 1;
      }
      if (
        stateNav.filterSpudDateRange &&
        stateNav.filterSpudDateRange.length > 0
      ) {
        filterArray.push(stateNav.filterSpudDateRange);
        isFilterSet = true;
        totalCount += 1;
        wellFilterCount += 1;
      }
      if (
        stateNav.filterCompletetionDateRange &&
        stateNav.filterCompletetionDateRange.length > 0
      ) {
        filterArray.push(stateNav.filterCompletetionDateRange);
        isFilterSet = true;
        totalCount += 1;
        wellFilterCount += 1;
      }
      if (
        stateNav.filterFirstProdDateRange &&
        stateNav.filterFirstProdDateRange.length > 0
      ) {
        filterArray.push(stateNav.filterFirstProdDateRange);
        isFilterSet = true;
        totalCount += 1;
        wellFilterCount += 1;
      }
      if (stateNav.filterGeography && stateNav.filterGeography.length > 0) {
        filterArray.push(stateNav.filterGeography);
        isFilterSet = true;
        totalCount += 1;
        geographyFilterCount += stateNav.filterGeography.length - 1;
      }

      if (
        stateNav.filterOwnerWellInterestSum &&
        stateNav.filterOwnerWellInterestSum.length > 0
      ) {
        filterArray.push(stateNav.filterOwnerWellInterestSum);
        isFilterSet = true;
        totalCount += 1;
        ownershipFilterCount += 1;
      }

      if (stateNav.filterDrawing && stateNav.filterDrawing.length > 0) {
        isFilterSet = true;
        totalCount += 1;
        geographyFilterCount += 1;

        const filterLayers = [
          "GLOLeases",
          "GLOLeaseLabels",
          "GLOUnits",
          "GLOUnitLabels",
          "wellpoints",
          "welllines",
          "Tracked Wells",
          "Tracked Owners",
          "Tags Filter",
          "permits",
          "rigs",
          "interest",
          "parcel",
        ];
        const filterFeature = stateNav.filterDrawing[1];
        filterShapeAction([filterFeature], filterLayers);
      }

      setStateNav((state) => ({
        ...state,
        productionFilterCount: productionFilterCount,
        geographyFilterCount: geographyFilterCount,
        ownershipFilterCount: ownershipFilterCount,
        wellFilterCount: wellFilterCount,
        totalFilterCount: totalCount,
        valuationFilterCount: valuationFilterCount,
        tagFilterCount: tagFilterCount,
        aiFilterCount: aiFilterCount,
      }));

      if (isFilterSet) {
        const mergeArrays = (arrays) => {
          let jointArray = [];

          arrays.forEach((array) => {
            jointArray = [...jointArray, ...array];
          });
          return Array.from(new Set([...jointArray]));
        };
        filterArray.unshift("all");
        if (filterCustomArray["wellpoints"]) {
          map.setFilter("wellpoints", [
            ...filterArray,
            [
              "match",
              ["get", "id"],
              mergeArrays(filterCustomArray["wellpoints"]),
              true,
              false,
            ],
          ]);
        } else if (Object.keys(filterCustomArray).length > 0) {
          map.setFilter("wellpoints", [
            "match",
            ["get", "id"],
            "-1",
            true,
            false,
          ]);
        } else {
          map.setFilter("wellpoints", filterArray);
        }
        if (filterCustomArray["welllines"]) {
          map.setFilter("welllines", [
            ...filterArray,
            [
              "match",
              ["get", "id"],
              mergeArrays(filterCustomArray["welllines"]),
              true,
              false,
            ],
          ]);
        } else if (Object.keys(filterCustomArray).length > 0) {
          map.setFilter("welllines", [
            "match",
            ["get", "id"],
            "-1",
            true,
            false,
          ]);
        } else {
          map.setFilter("welllines", filterArray);
        }
        map.setFilter("wellsHeatmapBoe", [">", ["get", "boeTotal"], 0]);
        map.setFilter("wellsHeatmapLast12", [
          ">",
          ["get", "lastTwelveMonthBOE"],
          0,
        ]);
        map.setFilter("wellsHeatmapIP90Oil", [">", ["get", "ipOil"], 0]);
        map.setFilter("wellsHeatmapIP90Gas", [">", ["get", "ipGas"], 0]);
        map.setFilter("wellsHeatmapRecentlyDrilled", [
          ">",
          ["get", "daysSinceDrilled"],
          0,
        ]);
        map.setFilter("wellsHeatmapRecentlyCompleted", [
          ">",
          ["get", "daysSinceCompletion"],
          0,
        ]);

        const filterLayers = [
          "GLOLeaseLabels",
          "GLOUnitLabels",
          "Tracked Wells",
          "Tracked Owners",
          "Tags Filter",
          "interest",
          "parcel",
          "permits",
          "rigs",
        ];
        filterLayers.forEach((filterLayer) => {
          if (filterCustomArray[filterLayer]) {
            if (
              ["Tracked Wells", "Tracked Owners", "Tags Filter"].indexOf(
                filterLayer
              ) > -1
            ) {
              map.setFilter(filterLayer, [
                "match",
                ["get", "id"],
                mergeArrays(filterCustomArray[filterLayer]),
                true,
                false,
              ]);
            } else if (["permits", "rigs"].indexOf(filterLayer) > -1) {
              map.setFilter(filterLayer, [
                "match",
                ["get", "Id"],
                mergeArrays(filterCustomArray[filterLayer]),
                true,
                false,
              ]);
            } else if (["interest", "parcel"].indexOf(filterLayer) > -1) {
              map.setFilter(filterLayer, [
                "match",
                ["get", "shapeLabel"],
                mergeArrays(filterCustomArray[filterLayer]),
                true,
                false,
              ]);
              map.setFilter(filterLayer + "_labels", [
                "match",
                ["get", "shapeLabel"],
                mergeArrays(filterCustomArray[filterLayer]),
                true,
                false,
              ]);
            } else {
              const baseLayer = filterLayer.replace("Labels", "s");
              if (filterCustomArray[baseLayer]) {
                map.setFilter(filterLayer, [
                  "match",
                  ["get", "VIEWID"],
                  mergeArrays(filterCustomArray[baseLayer]),
                  true,
                  false,
                ]);
                map.setFilter(baseLayer, [
                  "match",
                  ["get", "VIEWID"],
                  mergeArrays(filterCustomArray[baseLayer]),
                  true,
                  false,
                ]);
              } else {
                map.setFilter(filterLayer, [
                  "match",
                  ["get", "VIEWID"],
                  mergeArrays(filterCustomArray[filterLayer]),
                  true,
                  false,
                ]);
                map.setFilter(baseLayer, [
                  "match",
                  ["get", "VIEWID"],
                  mergeArrays(filterCustomArray[filterLayer]),
                  true,
                  false,
                ]);
              }
            }
          } else {
            const layer = map.getLayer(filterLayer);
            if (Object.keys(filterCustomArray).length > 0) {
              if (layer) {
                if (
                  ["Tracked Wells", "Tracked Owners", "Tags Filter"].indexOf(
                    filterLayer
                  ) > -1
                ) {
                  map.setFilter(filterLayer, [
                    "match",
                    ["get", "id"],
                    "-1",
                    true,
                    false,
                  ]);
                } else if (["permits", "rigs"].indexOf(filterLayer) > -1) {
                  map.setFilter(filterLayer, [
                    "match",
                    ["get", "Id"],
                    "-1",
                    true,
                    false,
                  ]);
                } else if (["interest", "parcel"].indexOf(filterLayer) > -1) {
                  map.setFilter(filterLayer, [
                    "match",
                    ["get", "shapeLabel"],
                    "-1",
                    true,
                    false,
                  ]);
                  map.setFilter(filterLayer + "_labels", [
                    "match",
                    ["get", "shapeLabel"],
                    "-1",
                    true,
                    false,
                  ]);
                } else {
                  const baseLayer = filterLayer.replace("Labels", "s");
                  map.setFilter(filterLayer, [
                    "match",
                    ["get", "VIEWID"],
                    -1,
                    true,
                    false,
                  ]);
                  map.setFilter(baseLayer, [
                    "match",
                    ["get", "VIEWID"],
                    -1,
                    true,
                    false,
                  ]);
                }
              }
            } else {
              const layer = map.getLayer(filterLayer);
              if (layer) {
                map.setFilter(filterLayer, null);
                if (map.getLayer(filterLayer + "_labels")) {
                  map.setFilter(filterLayer + "_labels", null);
                }
                if (map.getLayer(filterLayer.replace("Labels", "s"))) {
                  map.setFilter(filterLayer.replace("Labels", "s"), null);
                }
                if (layer.type == "circle" && layer.id != "wellpoints") {
                  if (layer.source.includes("_filter")) {
                    const clusterSource = layer.source.replace("_filter", "");
                    setLayerSource(layer.id, clusterSource);
                  }
                }
              }
            }
          }
        });
        if (filterCustomArray["basin"]) {
          if (filterCustomArray["basin"].length == 1) {
            map.setFilter("basinLayer", filterCustomArray["basin"][0]);
            map.setFilter("basinLabels", filterCustomArray["basin"][0]);
          } else {
            map.setFilter("basinLayer", filterCustomArray["basin"]);
            map.setFilter("basinLabels", filterCustomArray["basin"]);
          }
        } else {
          map.setFilter("basinLayer", null);
          map.setFilter("basinLabels", null);
        }
      } else {
        map.setFilter("wellpoints", null);
        map.setFilter("welllines", null);
        map.setFilter("GLOLeases", null);
        map.setFilter("GLOLeaseLabels", null);
        map.setFilter("GLOUnits", null);
        map.setFilter("GLOUnitLabels", null);
        map.setFilter("basinLayer", null);
        map.setFilter("basinLabels", null);
        map.setFilter("interest", null);
        map.setFilter("parcel", null);
        map.setFilter("wellsHeatmapBoe", [">", ["get", "boeTotal"], 0]);
        map.setFilter("wellsHeatmapLast12", [
          ">",
          ["get", "lastTwelveMonthBOE"],
          0,
        ]);
        map.setFilter("wellsHeatmapIP90Oil", [">", ["get", "ipOil"], 0]);
        map.setFilter("wellsHeatmapIP90Gas", [">", ["get", "ipGas"], 0]);
        map.setFilter("wellsHeatmapRecentlyDrilled", [
          ">",
          ["get", "daysSinceDrilled"],
          0,
        ]);
        map.setFilter("wellsHeatmapRecentlyCompleted", [
          ">",
          ["get", "daysSinceCompletion"],
          0,
        ]);

        const filterLayers = [
          "Tracked Wells",
          "Tracked Owners",
          "Tags Filter",
          "permits",
          "rigs",
        ];
        filterLayers.forEach((filterLayer) => {
          const layer = map.getLayer(filterLayer);
          if (layer) {
            map.setFilter(filterLayer, null);
            if (layer.type == "circle") {
              if (layer.source.includes("_filter")) {
                const clusterSource = layer.source.replace("_filter", "");
                setLayerSource(layer.id, clusterSource);
              }
            }
          }
        });
      }
    }
    console.log("filters applied");
  }, [
    map,
    setStateNav,
    stateNav.defaultOn,
    stateNav.filterAllInterestTypes,
    stateNav.filterAllOwnershipTypes,
    stateNav.filterBasin,
    stateNav.filterAOI,
    stateNav.filterParcel,
    stateNav.filterCompletetionDateRange,
    stateNav.filterCumulativeGas,
    stateNav.filterCumulativeOil,
    stateNav.filterCumulativeWater,
    stateNav.filterFirstMonthGas,
    stateNav.filterFirstMonthOil,
    stateNav.filterFirstMonthWater,
    stateNav.filterFirstProdDateRange,
    stateNav.filterFirstSixMonthGas,
    stateNav.filterFirstSixMonthOil,
    stateNav.filterFirstSixMonthWater,
    stateNav.filterFirstThreeMonthGas,
    stateNav.filterFirstThreeMonthOil,
    stateNav.filterFirstThreeMonthWater,
    stateNav.filterFirstTwelveMonthGas,
    stateNav.filterFirstTwelveMonthOil,
    stateNav.filterFirstTwelveMonthWater,
    stateNav.filterGeography,
    stateNav.filterLastMonthGas,
    stateNav.filterLastMonthOil,
    stateNav.filterLastMonthWater,
    stateNav.filterLastSixMonthGas,
    stateNav.filterLastSixMonthOil,
    stateNav.filterLastSixMonthWater,
    stateNav.filterLastThreeMonthGas,
    stateNav.filterLastThreeMonthOil,
    stateNav.filterLastThreeMonthWater,
    stateNav.filterLastTwelveMonthGas,
    stateNav.filterLastTwelveMonthOil,
    stateNav.filterLastTwelveMonthWater,
    stateNav.filterOperator,
    stateNav.filterOwnerCount,
    stateNav.filterPermitDateRange,
    stateNav.filterPlay,
    stateNav.filterSpudDateRange,
    stateNav.filterWellProfile,
    stateNav.filterWellStatus,
    stateNav.filterWellType,
    stateNav.filterNoOwnerCount,
    stateNav.filterHasOwners,
    stateNav.filterHasOwnerCount,
    stateNav.filterTrackedWells,
    stateNav.filterTrackedOwners,
    stateNav.filterOwnerConfidence,
    stateNav.filterOwnerWellInterestSum,
    stateNav.filterWellAppraisal,
    stateNav.filterOwnerAppraisals,
    stateNav.filterDrawing,
    stateNav.filterTags,
    stateNav.selectedTags,
    stateApp.trackedOwnerWells,
    stateApp.trackedwells,
    stateApp.customLayers,
    stateApp.wellListFromTagsFilter,
  ]);

  useEffect(() => {
    console.log("useEffect 22");

    //sets style of map when changed in Map Controls
    if (stateApp.selectedLayerId && map) {
      if (stateApp.selectedLayerId) {
        map.setStyle(stateApp.selectedLayerId);
      }
    }
  }, [map, stateApp.selectedLayerId]);

  const createPopUp = useCallback(
    (currentFeature) => {
      let coordinates = [currentFeature.longitude, currentFeature.latitude];
      let popUps = document.getElementsByClassName("mapboxgl-popup");
      if (popUps[0]) popUps[0].remove();

      let popup = new mapboxgl.Popup({ offset: 0, closeOnClick: false })
        .setLngLat(coordinates)
        .setMaxWidth("none")
        .setHTML(`<div id="popupContainer"></div>`)
        .addTo(map);

      // //show wellcard in popup Portal
      setStateApp((state) => ({ ...state, popupOpen: true }));
      //setStateApp((state) => ({ ...state, wellSelected: true }));
      //setStateApp((state) => ({ ...state, wellSelectedCoordinates: [currentFeature.longitude, currentFeature.latitude] }));
      handleOpenExpandableCard();
    },
    [map, setStateApp]
  );

  const createFilterPopup = useCallback(
    (filterFeature) => {
      const { geometry } = filterFeature;
      const coordinates = geometry.coordinates;
      let popUps = document.getElementsByClassName("mapboxgl-popup");
      if (popUps[0]) popUps[0].remove();
      if (coordinates.length > 0) {
        const minLatitude = coordinates.reduce((a, b) =>
          a[0] < b[0] ? a : b
        )[0][0];
        const maxLongitude = coordinates.reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0][1];

        let popupCoordinate = [minLatitude, maxLongitude];
        console.log(popupCoordinate);

        let popup = new mapboxgl.Popup({ offset: 0, closeOnClick: false })
          .setLngLat(popupCoordinate)
          .setMaxWidth("none")
          .setHTML(`<div id="filterPopupContainer"></div>`)
          .addTo(map);

        setStateApp((state) => ({
          ...state,
          popupOpen: true,
          filterFeature: filterFeature,
        }));
      }
    },
    [map, setStateApp]
  );

  const createSelectedAbstractPopup = useCallback(
    (currentFeature) => {
      let popUps = document.getElementsByClassName("mapboxgl-popup");
      if (popUps[0]) popUps[0].remove();

      if (!currentFeature) return;

      const latLng = map.getCenter();
      latLng.lat = latLng.lat;

      new mapboxgl.Popup({
        offset: 10,
        closeOnClick: false,
        closeButton: false,
        className: "abstractPopup",
      })
        .setLngLat(latLng)
        .setMaxWidth("none")
        .setHTML(`<div id="popupContainer"></div>`)
        .addTo(map);

      setStateApp((state) => ({
        ...state,
        popupOpen: true,
      }));
    },
    [map, setStateApp]
  );

  const createUDPopUp = useCallback(
    (currentFeature) => {
      let coordinates = currentFeature.shapeCenter;
      if (typeof currentFeature.shapeCenter === "string") {
        coordinates = JSON.parse(currentFeature.shapeCenter);
      }
      let popUps = document.getElementsByClassName("mapboxgl-popup");
      if (popUps[0]) popUps[0].remove();

      let popup = new mapboxgl.Popup({ offset: 0, closeOnClick: false })
        .setLngLat(coordinates)
        .setMaxWidth("none")
        .setHTML(`<div id="popupContainer"></div>`)
        .addTo(map);

      setStateApp((state) => ({ ...state, popupOpen: true }));

      handleOpenExpandableCard();
    },
    [map, setStateApp]
  );

  useEffect(() => {
    console.log("useEffect 23");

    console.log("wellSelected", stateApp.wellSelected);
    console.log("wellSelectedCoordinates", stateApp.wellSelectedCoordinates);

    // if( map
    //     && stateApp.wellSelected === false
    //     ){
    //       map.removeLayer('well-point');
    //       map.removeSource('well-select-point')
    //     }

    if (map && stateApp.wellSelectedCoordinates) {
      if (map.getLayer("well-point")) {
        map.removeLayer("well-point");
        map.removeSource("well-select-point");
      }

      if (stateApp.wellSelectedCoordinates.length > 0) {
        map.addSource("well-select-point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: stateApp.wellSelectedCoordinates,
                },
              },
            ],
          },
        });

        map.addLayer({
          id: "well-point",
          type: "circle",
          source: "well-select-point",
          paint: {
            "circle-radius": 5,
            "circle-color": "yellow",
          },
        });
      }
    }
  }, [stateApp.wellSelectedCoordinates]);

  useEffect(() => {
    (async () => {
      console.log("useEffect 24");

      console.log("selectedWell", stateApp.selectedWell);
      console.log("selectedWellId", stateApp.selectedWellId);
      console.log("wellSelectedCoordinates", stateApp.wellSelectedCoordinates);
      if (
        map &&
        stateApp.selectedWellId &&
        stateApp.wellSelectedCoordinates &&
        stateApp.wellSelectedCoordinates.length > 0 &&
        !stateApp.selectedWell
      ) {
        let point = map.project(stateApp.wellSelectedCoordinates);

        var bbox = [
          [point.x - 10, point.y - 10],
          [point.x + 10, point.y + 10],
        ];
        let features = map.queryRenderedFeatures(bbox, {
          layers: ["wellpoints"],
        });
        let currentFeature = features.find(
          (element) =>
            element.properties.id.toLowerCase() == stateApp.selectedWellId
        );
        console.log("current feature", currentFeature);

        if (!currentFeature) {
          features = map.querySourceFeatures("composite", {
            sourceLayer: "wellPoints",
            filter: ["in", "id", stateApp.selectedWellId],
          });
          currentFeature = features.find(
            (element) =>
              element.properties.id.toLowerCase() == stateApp.selectedWellId
          );
        }

        if (!currentFeature) {
          const endpoint = `https://api.mapbox.com/v4/${wellsTileset}/tilequery/${stateApp.wellSelectedCoordinates.join()}.json?radius=1&limit=5&dedupe&layers=wellPoints&access_token=${
            stateApp.mapboxglAccessToken
          }`;

          const headers = new Headers();
          headers.append("Content-Type", "application/json");
          headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

          const options = {
            method: "GET",
            headers: headers,
          };

          console.log(
            "request made to lod2019-index search at: " + new Date().toString()
          );

          await fetch(endpoint, options)
            .then((response) => response.json())
            .then((response) => {
              console.log(response);
              features = response.features;
              currentFeature = features.find(
                (element) =>
                  element.properties.id.toLowerCase() == stateApp.selectedWellId
              );
            })
            .catch((error) => {
              console.log(error);
            });

          console.log("current feature", currentFeature);
        }

        if (currentFeature) {
          let popUps = document.getElementsByClassName("mapboxgl-popup");
          if (popUps[0]) popUps[0].remove();
          setStateApp((state) => ({
            ...state,
            selectedWell: currentFeature.properties,
          }));

          // map.fire('click', { lngLat: stateApp.wellSelectedCoordinates, point: point, originalEvent: {} })
          createPopUp(currentFeature.properties);
          map.resize();
        }
      }
    })();
  }, [stateApp.wellSelectedCoordinates]);

  useEffect(() => {
    console.log("useEffect 25");

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

    getPermits({
      variables: {
        offset: 0,
        amount: 500,
      },
    });
    getRigs({
      variables: {
        offset: 0,
        amount: 500,
      },
    });

    fetch(req, { signal: signal })
      .then((results) => results.json())
      .then((data) => {
        setMapStyles(data.slice(0, 5));
      });

    setStateApp((state) => ({
      ...state,
      popupOpen: false,
      expandedCard: false,
      selectedUserDefinedLayer: undefined,
    }));

    //clean up
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    console.log("useEffect 26");

    if (map) {
      setStateApp((stateApp) => ({
        ...stateApp,
        mapVars: {
          ...stateApp.mapVars,
          zoom: map.getZoom(),
          center: map.getCenter(),
          pitch: map.getPitch(),
          bearing: map.getBearing(),
        },
      }));

      setMap(null);
    }
  }, [stateApp.mapVars.styleId]);

  useEffect(() => {
    if (
      abstractData &&
      abstractData.abstractGeo &&
      abstractData.abstractGeo.length > 0
    ) {
      const data = abstractData.abstractGeo;
      const makeGeoJSON = (data) => {
        return {
          type: "FeatureCollection",
          features: data.map((feature) => {
            return JSON.parse(feature.geo_json);
          }),
        };
      };

      const geoJson = makeGeoJSON(data);

      map.getSource("abstract_geo_source").setData(geoJson);
    }
  }, [abstractData]);

  useEffect(() => {
    if (
      abstractContainsData &&
      abstractContainsData.abstractGeoContains &&
      abstractContainsData.abstractGeoContains.length > 0
    ) {
      const data = abstractContainsData.abstractGeoContains;
      const makeGeoJSON = (data) => {
        return {
          type: "FeatureCollection",
          features: data.map((feature) => {
            return JSON.parse(feature.geo_json);
          }),
        };
      };

      const geoJson = makeGeoJSON(data);

      map.getSource("abstract_geo_source").setData(geoJson);
    }
  }, [abstractContainsData]);

  useEffect(() => {
    if (map) {
      const featuresList = map.getSource("abstract_geo_source")._data.features;
      for (let i = 0; i < featuresList.length; i++) {
        const id = featuresList[i].properties.Id;
        map.setFeatureState(
          { source: "abstract_geo_source", id: id },
          { click: stateApp.filterSelectAllAbstract }
        );
      }
    }
  }, [stateApp.filterSelectAllAbstract, map]);

  useLayoutEffect(() => {
    if (stateApp.popupOpen === false) {
      let popUps = document.getElementsByClassName("mapboxgl-popup");
      if (popUps[0]) popUps[0].remove();

      setStateApp((state) => ({
        ...state,
        wellSelectedCoordinates: [],
        selectedWell: null,
      }));
    }
  }, [stateApp.popupOpen]);

  function getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  }

  const mouseMoveHandler = (e) => {
    map.getCanvas().style.cursor = "pointer";
  };

  const mouseLeaveHandler = (e) => {
    map.getCanvas().style.cursor = "";
  };

  const mapMouseMove = (e) => {
    // e.lngLat is the longitude, latitude geographical position of the event
    let coordinates = e.lngLat.wrap();
    setLng(coordinates.lng);
    setLat(coordinates.lat);
  };

  const mapZoom = (e) => {
    let zooms = map.getZoom();
    console.log("zoomz", zooms);
    setZoom(zooms);
  };

  const onAbstactLayerClick = function (feature, action) {
    setStateApp((state) => ({
      ...state,
      popupOpen: false,
    }));
    if (!feature) {
      setStateApp((state) => ({
        ...state,
        selectedAbstracts: [],
      }));
      return;
    }
    if (action === "add") {
      setStateApp((state) => ({
        ...state,
        selectedAbstracts: [...state.selectedAbstracts, feature],
      }));
    }
    if (action === "remove") {
      setStateApp((state) => ({
        ...state,
        selectedAbstracts: state.selectedAbstracts.filter(
          (abstract) => abstract.id !== feature.id
        ),
      }));
    }
    createSelectedAbstractPopup(feature);
    map.resize();
  };

  useEffect(() => {
    if (map) {
      map.on("click", "abstract_geo_fill_layer", function (e) {
        if (!e.features.length) {
          return;
        }
        const currentFeature = e.features[0];
        const featureState = map.getFeatureState({
          source: "abstract_geo_source",
          id: currentFeature.id,
        });
        const featuresList = map.getSource("abstract_geo_source")._data
          .features;

        if (window.event.ctrlKey || window.event.metaKey) {
          if (featureState && featureState.click) {
            // Unselect feature
            map.setFeatureState(
              { source: "abstract_geo_source", id: currentFeature.id },
              { click: false }
            );
            onAbstactLayerClick(currentFeature, "remove");
          } else {
            // Select feature
            map.setFeatureState(
              { source: "abstract_geo_source", id: e.features[0].id },
              { click: true }
            );
            onAbstactLayerClick(currentFeature, "add");
          }
        } else {
          // Clear all selected features
          for (let i = 0; i < featuresList.length; i++) {
            const id = featuresList[i].properties.Id;
            map.setFeatureState(
              { source: "abstract_geo_source", id: id },
              { click: false }
            );
          }
          onAbstactLayerClick(null, "remove");
        }
      });

      map.on("mousemove", "abstract_geo_fill_layer", function (e) {
        if (e.features.length > 0) {
          if (hoveredAbstractId) {
            map.setFeatureState(
              { source: "abstract_geo_source", id: hoveredAbstractId },
              { hover: false }
            );
          }
          hoveredAbstractId = e.features[0].id;
          map.setFeatureState(
            { source: "abstract_geo_source", id: hoveredAbstractId },
            { hover: true }
          );
        }
      });

      map.on("mouseleave", "abstract_geo_fill_layer", function (e) {
        if (hoveredAbstractId) {
          map.setFeatureState(
            { source: "abstract_geo_source", id: hoveredAbstractId },
            { hover: false }
          );
        }
        hoveredAbstractId = null;
      });
    }
  }, [map]);

  useEffect(() => {
    console.log("useEffect 27");

    console.log("map ue start");
    if (mapStyles.length > 0) {
      // const SET_INITIAL_MAP_STYLE = "Satellite";

      const initializeMap = ({ setMap, mapEl, setStateApp, setDraw }) => {
        let id = mapEl.current.id;

        var index = getIndex(stateApp.mapVars.styleId, mapStyles, "name");

        console.log("tileset api loaded - style selected", stateApp.mapStyle);
        console.log(stateApp.mapVars);
        console.log(mapStyles[index]);
        console.log(mapStyles);

        const newMap = new mapboxgl.Map({
          container: `${id}`,
          style: "mapbox://styles/m1neral/" + mapStyles[index].id,
          center: stateApp.mapVars.center,
          zoom: stateApp.mapVars.zoom,
          pitch: stateApp.mapVars.pitch,
          bearing: stateApp.mapVars.bearing,
        });

        console.log(
          `Setting wellsTileset: ${mapStyles[index].sources.composite.url
            .split(",")
            .find((element) => element.indexOf("m1neral.wells") > -1)
            .replace("mapbox://", "")}`
        );
        setWellsTileset(
          mapStyles[index].sources.composite.url
            .split(",")
            .find((element) => element.indexOf("m1neral.wells") > -1)
            .replace("mapbox://", "")
        );

        console.log("new map generated");

        /// optimized interactions w/ map
        newMap.scrollZoom.enable();
        newMap.dragPan.enable();
        newMap.dragRotate.enable();
        newMap.keyboard.enable();
        newMap.doubleClickZoom.disable();
        newMap.boxZoom.enable();
        newMap.touchZoomRotate.enable();

        newMap.addControl(
          new mapboxgl.ScaleControl({
            maxWidth: 80,
            unit: "imperial",
          }),
          "bottom-right"
        );

        newMap.addControl(new mapboxgl.NavigationControl(), "bottom-right");

        newMap.addControl(new mapboxgl.FullscreenControl(), "bottom-right");

        var geoLocate = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          fitBoundsOptions: {
            maxZoom: 24,
          },
          trackUserLocation: false,
          showAccuracyCircle: true,
          showUserLocation: true,
        });
        newMap.addControl(geoLocate, "bottom-right");
        geoLocate.on("geolocate", function (e) {
          newMap.flyTo({
            center: [e.coords.longitude, e.coords.latitude],
            zoom: 14,
            pitch: 80,
            bearing: 20,
            speed: 0.4,
          });
        });

        // var customData = {
        //     features: [
        //         {
        //             type: "Feature",
        //             properties: {
        //                 title: 'Well: Hancock "A"7',
        //             },
        //             geometry: {
        //                 coordinates: [-98.453338, 33.71002],
        //                 type: "Point",
        //             },
        //         },
        //         {
        //             type: "Feature",
        //             properties: {
        //                 title: "M1NERAL",
        //                 description: "A lakefront park on Chicago's south side",
        //             },
        //             geometry: {
        //                 coordinates: [-95.363557, 29.759138],
        //                 type: "Point",
        //             },
        //         },
        //         {
        //             type: "Feature",
        //             properties: {
        //                 title: "Jacob Avery",
        //                 description: "A large park in Chicago's Austin neighborhood",
        //             },
        //             geometry: {
        //                 coordinates: [-95.096123, 29.537716],
        //                 type: "Point",
        //             },
        //         },
        //     ],
        //     type: "FeatureCollection",
        // };

        // function forwardGeocoder(query) {
        //   return new Promise ((resolve, reject) => {

        //       const endpoint = 'https://m1search.search.windows.net/indexes/wellheader-index/docs?api-version=2019-05-06&$count=true&searchFields=WellName,ApiNumber&$top=5&search=' + query;

        //       const headers = new Headers();
        //       headers.append('Content-Type', 'application/json')
        //       headers.append('api-key', '1AE3C6346B38CEB007191D51CFDDFF65');

        //       const options = {
        //         method: 'GET',
        //         headers: headers
        //       };

        //       console.log("request made to cognitive search at: " + new Date().toString());

        //       fetch(endpoint, options)
        //           .then((response) => response.json())
        //           .then((response) => {
        //             console.log(response);
        //             resolve(response.value);
        //           })
        //           .catch((error) => {
        //             console.log(error)
        //             resolve();
        //           })

        //       // for (var i = 0; i < customData.features.length; i++) {
        //       //   var feature = customData.features[i];
        //       //   // handle queries with different capitalization than the source data by calling toLowerCase()
        //       //   if (
        //       //     feature.properties.title
        //       //       .toLowerCase()
        //       //       .search(query.toLowerCase()) !== -1
        //       //   ) {
        //       //     // add a tree emoji as a prefix for custom data results
        //       //     // using carmen geojson format: https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
        //       //     feature["place_name"] = "🌲 " + feature.properties.title;
        //       //     feature["center"] = feature.geometry.coordinates;
        //       //     feature["place_type"] = ["park"];
        //       //     matchingFeatures.push(feature);
        //       //   }
        //       // }
        //       // return matchingFeatures;

        //   })
        // }

        // var geocoder = new MapboxGeocoder({
        //   accessToken: mapboxgl.accessToken,
        //   mapboxgl: mapboxgl,
        //   localGeocoder: forwardGeocoder,
        //   //types: 'poi',
        //   //placeholder: 'Enter Search'
        //   zoom: 18,
        // });

        // if (
        //     document.getElementById("searchBar") &&
        //     document.getElementById("searchBar").childNodes.length === 0
        // ) {
        //     document
        //         .getElementById("searchBar")
        //         .appendChild(Search);
        //     setSearch(Search);
        // }

        let Draw = new MapboxDraw({
          displayControlsDefault: false,
          userProperties: true,
          modes: {
            ...MapboxDraw.modes,
            draw_circle: CircleMode,
            drag_circle: DragCircleMode,
            direct_select: DirectMode,
            simple_select: SimpleSelectMode,
            draw_rectangle: DrawRectangle,
          },
        });
        newMap.addControl(Draw);

        const abstractControl = (e) => {
          const map = e.target;
          if (map.getZoom() >= 12) {
            const bounds = map.getBounds();
            const bbox = [
              bounds.getWest(),
              bounds.getSouth(),
              bounds.getEast(),
              bounds.getNorth(),
            ];
            const bboxPolygon = turf.bboxPolygon(bbox);
            let polygonString = "POLYGON((";
            bboxPolygon.geometry.coordinates[0].forEach((coordinate, index) => {
              polygonString += coordinate[0] + " " + coordinate[1];
              if (index < bboxPolygon.geometry.coordinates[0].length - 1) {
                polygonString += ", ";
              }
            });
            polygonString += "))";

            getAbstractGeo({
              variables: {
                polygon: polygonString,
              },
            });
          }
        };

        newMap.on("zoomend", function (e) {
          abstractControl(e);
        });
        newMap.on("moveend", function (e) {
          abstractControl(e);
        });

        const mapFilterPolyOnRight = (e) => {
          console.log("right click on the map");
          let id = "draw_polygon" + Date.now();
          setStateNav((stateNav) => ({
            ...stateNav,
            drawingMode: "draw_polygon",
            filterFeatureId: id,
          }));
        };

        // Buggy Code, temporarily disabling it
        // newMap.on("contextmenu", mapFilterPolyOnRight);

        setStateApp({ ...stateApp, map: newMap, draw: Draw });

        newMap.on("load", function (e) {
          newMap.loadImage(MarkerIcon, function (error, image) {
            if (error) throw error;
            // add image to the active style and make it SDF-enabled
            newMap.addImage("marker-icon", image, { sdf: true });
          });

          newMap.addSource("abstract_geo_source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
            promoteId: "Id",
          });

          newMap.addLayer({
            id: "abstract_geo_fill_layer",
            type: "fill",
            minzoom: 12,
            source: "abstract_geo_source",
            paint: {
              "fill-color": "#888",
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.5,
                ["boolean", ["feature-state", "click"], false],
                0.5,
                0,
              ],
            },
          });

          newMap.addLayer({
            id: "abstract_geo_layer",
            type: "line",
            minzoom: 12,
            source: "abstract_geo_source",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#888",
              "line-width": 2,
            },
          });

          newMap.addLayer({
            id: "abstract_geo_label_layer",
            type: "symbol",
            minzoom: 12,
            source: "abstract_geo_source",
            layout: {
              "text-field": "{AbstractName}",
              "text-anchor": "center",
            },
            paint: {
              "text-color": "#888",
            },
          });

          setDraw(Draw);
          setMap(newMap);
          console.log("set new map complete", newMap.loaded());
        });
      };

      if (!map) {
        console.log("initialize map start");
        initializeMap({ setMap, mapEl, setStateApp, setDraw });
        console.log("initialize map finish");
      } else {
        console.log("map extra components start");

        // additional map interactions
        // for some reason these do not work when initializing but do here
        // map.boxZoom.enable();
        // map.touchZoomRotate.enable();

        // const selectedLayerIntereactions = stateApp.checkedLayersInteraction.slice(
        //   0
        // );
        // const styleLayers = stateApp.styleLayers.slice(0);
        // styleLayers.forEach((config, layerIndex) => {
        //   // const config = stateApp.styleLayers[layerIndex];
        //   if (config.mouseMoveHandler) {
        //     if (config.layerProps) {
        //       map.off("mousemove", config.id[0], config.mouseMoveHandler);
        //       map.off(
        //         "mousemove",
        //         config.id[0] + "-clusters",
        //         config.mouseMoveHandler
        //       );
        //       map.off(
        //         "mousemove",
        //         config.id[0] + "-clusters-counts",
        //         config.mouseMoveHandler
        //       );
        //     } else {
        //       map.off("mousemove", "wellpoints", config.mouseMoveHandler);
        //       map.off("mousemove", "welllines", config.mouseMoveHandler);
        //     }
        //   }
        //   if (config.mouseLeaveHandler) {
        //     if (config.layerProps) {
        //       map.off("mouseleave", config.id[0], config.mouseLeaveHandler);
        //       map.off(
        //         "mouseleave",
        //         config.id[0] + "-clusters",
        //         config.mouseLeaveHandler
        //       );
        //       map.off(
        //         "mouseleave",
        //         config.id[0] + "-clusters-counts",
        //         config.mouseLeaveHandler
        //       );
        //     } else {
        //       map.off("mouseleave", "wellpoints", config.mouseLeaveHandler);
        //       map.off("mouseleave", "welllines", config.mouseLeaveHandler);
        //     }
        //   }

        //   if (
        //     selectedLayerIntereactions.length > 0 &&
        //     selectedLayerIntereactions.indexOf(layerIndex) > -1
        //   ) {
        //     if (config.layerProps) {
        //       map.on("mousemove", config.id[0], mouseMoveHandler);
        //       map.on("mousemove", config.id[0] + "-clusters", mouseMoveHandler);
        //       map.on(
        //         "mousemove",
        //         config.id[0] + "-clusters-counts",
        //         mouseMoveHandler
        //       );
        //       map.on("mouseleave", config.id[0], mouseLeaveHandler);
        //       map.on(
        //         "mouseleave",
        //         config.id[0] + "-clusters",
        //         mouseLeaveHandler
        //       );
        //       map.on(
        //         "mouseleave",
        //         config.id[0] + "-clusters-counts",
        //         mouseLeaveHandler
        //       );
        //     } else {
        //       map.on("mousemove", "wellpoints", mouseMoveHandler);
        //       map.on("mouseleave", "wellpoints", mouseLeaveHandler);
        //       map.on("mousemove", "welllines", mouseMoveHandler);
        //       map.on("mouseleave", "welllines", mouseLeaveHandler);
        //     }

        //     const configcp = { ...config };
        //     configcp.mouseMoveHandler = mouseMoveHandler;
        //     configcp.mouseLeaveHandler = mouseLeaveHandler;

        //     styleLayers[layerIndex] = configcp;
        //   }
        // });

        // setStateApp({
        //   ...stateApp,
        //   styleLayers,
        // });

        // map.off("mousemove", mapMouseMove);

        map.on("mousemove", mapMouseMove);
        map.on("zoom", mapZoom);

        console.log("map extra components complete");
      }
    }
  }, [
    map,
    setStateApp,
    setStateMapControls,
    mapStyles,
    // stateApp.checkedLayersInteraction,
  ]);

  // Use effect for removing shape filter
  useEffect(() => {
    console.log("useEffect 28");

    if (stateNav.filterDrawing && stateNav.filterDrawing.length === 0) {
      if (draw) draw.delete(drawingFilterFeatureId);
      setStateNav((stateNav) => ({
        ...stateNav,
        drawingMode: null,
        filterDrawing: stateNav.filterDrawing,
        filterFeatureId: null,
      }));
      setDrawingFilterFeatureId(null);
      setStateApp((state) => ({
        ...state,
        popupOpen: false,
      }));
    }
  }, [stateNav.filterDrawing]);

  // Use effect for adding shape filter
  useEffect(() => {
    console.log("useEffect 29");

    function drawCreateListener(e) {
      if (stateNav.drawingMode !== null) {
        let feature = e.features[0];

        let polygonString = "POLYGON((";
        feature.geometry.coordinates[0].forEach((coordinate, index) => {
          polygonString += coordinate[0] + " " + coordinate[1];
          if (index < feature.geometry.coordinates[0].length - 1) {
            polygonString += ", ";
          }
        });
        polygonString += "))";

        getAbstractGeoContains({
          variables: {
            polygon: polygonString,
          },
        });

        setFilterAbstract(true);

        //delete feature, and create a copy with custom id
        draw.delete(feature.id);
        feature.id = stateNav.filterFeatureId;
        draw.add(feature);

        createFilterPopup(feature, map);

        setStateNav((stateNav) => ({
          ...stateNav,
          drawingMode: null,
          filterDrawing: ["within", feature],
        }));
        map.off("draw.create", drawCreateListener);
      }
    }

    function drawUpdateListener(e) {
      if (
        e.features[0].id.includes("draw_polygon") ||
        e.features[0].id.includes("drag_circle") ||
        e.features[0].id.includes("draw_rectangle")
      ) {
        let feature = e.features[0];

        let polygonString = "POLYGON((";
        feature.geometry.coordinates[0].forEach((coordinate, index) => {
          polygonString += coordinate[0] + " " + coordinate[1];
          if (index < feature.geometry.coordinates[0].length - 1) {
            polygonString += ", ";
          }
        });
        polygonString += "))";

        getAbstractGeoContains({
          variables: {
            polygon: polygonString,
          },
        });

        setFilterAbstract(true);

        createFilterPopup(feature, map);

        setStateNav((stateNav) => ({
          ...stateNav,
          filterDrawing: ["within", feature],
        }));
      }
    }

    if (stateNav.drawingMode) {
      // delete previous filter feature
      stateApp.draw.delete(drawingFilterFeatureId);

      setDrawingFilterFeatureId(stateNav.filterFeatureId);
      stateApp.draw.changeMode(stateNav.drawingMode);
      if (map) {
        map.on("draw.create", drawCreateListener);
        map.on("draw.update", drawUpdateListener);
      }
    }
  }, [stateNav.filterFeatureId]);

  useEffect(() => {
    console.log("useEffect 30");

    if (draw && stateNav.filterDrawing && stateNav.filterDrawing.length == 2) {
      console.log("initialize filter draw");
      const feature = stateNav.filterDrawing[1];
      setDrawingFilterFeatureId(feature.id);
      draw.delete(feature.id);
      draw.add(feature);
    }
  }, [draw]);

  useEffect(() => {
    console.log("useEffect 31");

    if (map) {
      return () => {
        var list = document.getElementById("searchBar");
        if (list && list.childNodes && list.childNodes.length > 0) {
          list.removeChild(list.childNodes[0]);
        }
        var zoom = map.getZoom();
        var center = map.getCenter();
        var pitch = map.getPitch();
        var bearing = map.getBearing();

        console.log(stateApp.mapVars);

        setStateApp((stateApp) => ({
          ...stateApp,
          mapVars: {
            ...stateApp.mapVars,
            zoom: zoom,
            center: center,
            pitch: pitch,
            bearing: bearing,
          },
        }));

        console.log("save map state variables");
        console.log(stateApp.mapVars);

        var mapList = document.getElementById("map");
        console.log(mapList.childNodes);
        if (mapList.childNodes.length > 1) {
          mapList.removeChild(mapList.childNodes[1]);
          mapList.removeChild(mapList.childNodes[1]);
          mapList.removeChild(mapList.childNodes[1]);
        }
        console.log(mapList.childNodes);
        console.log("end map unmount");
      };
    }
  }, [map]);

  useEffect(() => {
    console.log("useEffect 32");

    ////// USE EFFECT TO MANAGE THE FLY TO FEATURE

    if (map && stateApp.flyTo) {
      var zVal = 12;

      setStateApp((stateApp) => ({
        ...stateApp,
        wellSelectedCoordinates: [
          stateApp.flyTo.longitude,
          stateApp.flyTo.latitude,
        ],
      }));

      map.flyTo({
        center: [stateApp.flyTo.longitude, stateApp.flyTo.latitude],
        zoom: stateApp.flyTo.zoom ? stateApp.flyTo.zoom : zVal,
        speed: 0.5,
      });
    }
  }, [createPopUp, map, stateApp.flyTo]);

  useEffect(() => {
    console.log("useEffect 33");

    ////// USE EFFECT TO MANAGE THE FIT BOUNDS TO FEATURE

    if (
      map &&
      stateApp.fitBounds &&
      stateApp.fitBounds.maxLat &&
      stateApp.fitBounds.minLat &&
      stateApp.fitBounds.maxLong &&
      stateApp.fitBounds.minLong
    ) {
      const fitOverBounds = () => {
        let { maxLat, minLat, maxLong, minLong } = stateApp.fitBounds;

        const latDif = maxLat - minLat;
        const longDif = maxLong - minLong;

        if (latDif === 0) {
          maxLat = maxLat + 0.005 > 90 ? 89.995 : maxLat + 0.005;
          minLat = minLat - 0.005 < -90 ? -89.995 : minLat - 0.005;
        } else {
          maxLat =
            maxLat + latDif * 0.08 > 90 ? 89.995 : maxLat + latDif * 0.08;
          minLat =
            minLat - latDif * 0.08 < -90 ? -89.995 : minLat - latDif * 0.08;
        }

        if (longDif === 0) {
          maxLong = maxLong + 0.005 > 180 ? 179.995 : maxLong + 0.005;
          minLong = minLong - 0.005 < -180 ? -179.995 : minLong - 0.005;
        } else {
          maxLong =
            maxLong + longDif * 0.08 > 180 ? 179.995 : maxLong + latDif * 0.08;
          maxLong =
            maxLong - longDif * 0.08 < -180
              ? -179.995
              : maxLong - latDif * 0.08;
        }

        return {
          maxLat,
          minLat,
          maxLong,
          minLong,
        };
      };

      let bounds = fitOverBounds();

      map.fitBounds([
        [bounds.minLong, bounds.minLat],
        [bounds.maxLong, bounds.maxLat],
      ]);
    }
  }, [map, stateApp.fitBounds]);

  useEffect(() => {
    if (
      map &&
      stateApp.wellListFromSearch &&
      stateApp.wellListFromSearch.length > 0
    ) {
      if (stateApp.wellListFromSearch.length > 1) {
        const findBounds = (shape) => {
          if (gjv.valid(shape)) {
            const bbox = turf.bbox(shape);
            return {
              minLong: bbox[0],
              minLat: bbox[1],
              maxLong: bbox[2],
              maxLat: bbox[3],
            };
          }
        };

        const formatIt = (mdata) => {
          return {
            type: "FeatureCollection",
            features: mdata
              .filter(
                (feature) =>
                  (feature.latitude && feature.longitude) ||
                  (feature.Latitude && feature.Longitude)
              )
              .map((feature) => {
                if (feature.latitude && feature.longitude) {
                  return {
                    type: "Feature",
                    properties: feature,
                    geometry: {
                      type: "Point",
                      coordinates: [feature.longitude, feature.latitude],
                    },
                  };
                } else {
                  return {
                    type: "Feature",
                    properties: feature,
                    geometry: {
                      type: "Point",
                      coordinates: [feature.Longitude, feature.Latitude],
                    },
                  };
                }
              }),
          };
        };

        setStateApp((state) => ({
          ...state,
          fitBounds: findBounds(formatIt(stateApp.wellListFromSearch)),
        }));
      } else {
        if (
          stateApp.wellListFromSearch[0] &&
          stateApp.wellListFromSearch[0].latitude &&
          stateApp.wellListFromSearch[0].longitude
        )
          map.flyTo({
            center: {
              lng: stateApp.wellListFromSearch[0].longitude,
              lat: stateApp.wellListFromSearch[0].latitude,
            },
            zoom: 12,
          });
      }
    }
  }, [map, stateApp.wellListFromSearch]);

  useEffect(() => {
    console.log("useEffect 35");

    if (map && stateApp.toggleZoomOut) {
      if (stateApp.toggleZoomOut === true) {
        map.flyTo({
          center: stateApp.mapVars.center,
          zoom: stateApp.mapVars.zoom,
          pitch: stateApp.mapVars.pitch,
          bearing: stateApp.mapVars.bearing,
          speed: 0.5,
        });

        let flying = null;

        map.on("flystart", function () {
          flying = true;
        });

        map.on("flyend", function () {
          flying = false;
        });

        map.on("moveend", function (e) {
          if (flying) {
            setStateApp((stateApp) => ({
              ...stateApp,
              mapVars: {
                ...stateApp.mapVars,
                zoom: map.getZoom(),
                center: map.getCenter(),
                pitch: map.getPitch(),
                bearing: map.getBearing(),
              },
            }));
            map.fire("flyend");
          }
        });

        setStateApp((stateApp) => ({ ...stateApp, toggleZoomOut: null }));
      }
    }
  }, [stateApp.toggleZoomOut]);

  useEffect(() => {
    console.log("useEffect 36");

    if (map && stateApp.toggle3d) {
      if (stateApp.toggle3d === true) {
        if (map.getPitch() == 0 && map.getBearing() == 0) {
          map.setPitch(70);
          map.setBearing(20);
        } else {
          map.setPitch(0);
          map.setBearing(0);
        }

        setStateApp((stateApp) => ({
          ...stateApp,
          mapVars: {
            ...stateApp.mapVars,
            zoom: map.getZoom(),
            center: map.getCenter(),
            pitch: map.getPitch(),
            bearing: map.getBearing(),
          },
        }));
        setStateApp((stateApp) => ({ ...stateApp, toggle3d: null }));
      }
    }
  }, [stateApp.toggle3d]);

  useEffect(() => {
    console.log("useEffect 38");

    console.log(
      "Drawing status check",
      stateApp.editDraw,
      stateNav.drawingMode
    );
    if (stateApp.editDraw === true || stateNav.drawingMode) {
      setDrawStatus(true);
      if (mapClick && mapClick.mapClickHandler != null) {
        map.off("click", mapClick.mapClickHandler);
      }
    } else {
      setDrawStatus(false);
      if (mapClick && mapClick.mapClickHandler != null) {
        setTimeout(() => {
          map.on("click", mapClick.mapClickHandler);
        }, 500);
      }
    }
  }, [stateApp.editDraw, stateNav.drawingMode]);

  const handleOpenExpandableCard = (e) => {
    setAnchorElPoPOver(container.current);
    setShowExpandableCard(true);
  };

  const handleAnchorElPopOver = () => {
    setAnchorElPoPOver(container.current);
  };

  const handleCloseExpandableCard = () => {
    setShowExpandableCard(false);
    setAnchorElPoPOver(null);
    setStateApp((state) => ({ ...state, expandedCard: false }));
  };

  const handleCloseSpatialDataCard = (complete = true) => {
    console.log("close card on map here");
    setStateApp((state) => ({
      ...state,
      popupOpen: false,
      selectedUserDefinedLayer: undefined,
    }));
    if (complete == true) {
      setStateApp((state) => ({
        ...state,
        selectedUserDefinedLayer: undefined,
      }));
    }
  };

  const handleCloseSpatialDataCardEdit = () => {
    console.log("close card on map here");
    setStateApp((state) => ({
      ...state,
      popupOpen: false,
      editLayer: false,
      selectedUserDefinedLayer: undefined,
    }));
  };

  const handleSaveSpatialDataToShape = (spatialData, dataType) => {
    // save data onto geoJSON properties fields

    const { selectedUserDefinedLayer } = stateApp;

    spatialDataAttributes.forEach((attribute) => {
      if (
        spatialData[attribute] != null ||
        typeof spatialData[attribute] !== "undefined"
      ) {
        console.log("set attribute", spatialData[attribute], attribute);
        selectedUserDefinedLayer.properties[attribute] = spatialData[attribute];
      }
    });
    selectedUserDefinedLayer.id = selectedUserDefinedLayer.properties.id;

    let update_layer = selectedUserDefinedLayer;

    let draw_id = selectedUserDefinedLayer.id;
    if (!draw_id.includes("edit_polygon")) {
      draw_id = `edit_polygon_${draw_id}`;
    }

    let current_feature = stateApp.draw.get(draw_id);
    if (current_feature) {
      addCustomShapeProperties(current_feature, stateApp.draw);
      current_feature = stateApp.draw.get(draw_id);
      spatialDataAttributes.forEach((attribute) => {
        if (
          spatialData[attribute] != null ||
          typeof spatialData[attribute] !== "undefined"
        ) {
          console.log("set attribute", spatialData[attribute], attribute);
          current_feature.properties[attribute] = spatialData[attribute];
        }
      });
      current_feature.id = current_feature.properties.id;
      update_layer = current_feature;
    }

    // //////cleaning the selected title opinion and redirecting to title opinion page//
    if (stateApp.user.mongoId !== "") {
      const id = update_layer.properties.id;
      let update_layers = stateApp.editingUserDefinedLayers.filter((layer) => {
        const shape_properties = JSON.parse(layer.shape).properties;
        return shape_properties.id && shape_properties.id.includes(id);
      });
      if (update_layers.length === 0) {
        update_layers = stateApp.customLayers.filter((layer) => {
          const shape_properties = JSON.parse(layer.shape).properties;
          return shape_properties.id && shape_properties.id.includes(id);
        });
        handleCloseSpatialDataCard();
      } else {
        stateApp.draw.delete(`edit_polygon_${id}`);
        const updated_layers = stateApp.editingUserDefinedLayers.filter(
          (layer) => {
            const shape_properties = JSON.parse(layer.shape).properties;
            return !shape_properties.id || !shape_properties.id.includes(id);
          }
        );
        setStateApp({
          ...stateApp,
          selectedUserDefinedLayer: null,
          editingUserDefinedLayers: updated_layers,
        });
        handleCloseSpatialDataCardEdit();
      }
      const customLayerId = update_layers[0]._id;

      const customLayerData = {
        shape: JSON.stringify(update_layer),
        layer: dataType,
        name: spatialData.shapeLabel,
        user: stateApp.user.mongoId,
      };

      updateCustomLayer({
        variables: {
          customLayerId: customLayerId,
          customLayer: customLayerData,
        },
      });

      getCustomLayers({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
    }
  };

  const handleDeleteSpatialDataAndShape = () => {
    const {
      selectedUserDefinedLayer,
      editingUserDefinedLayers,
      customLayers,
    } = stateApp;
    if (selectedUserDefinedLayer) {
      let id = selectedUserDefinedLayer.properties.id;
      if (id.includes("edit_polygon")) {
        id = id.replace("edit_polygon_", "");
      }
      if (editingUserDefinedLayers.length > 0) {
        const delete_layers = editingUserDefinedLayers.filter((layer) => {
          const shape_properties = JSON.parse(layer.shape).properties;
          return shape_properties.id && shape_properties.id.includes(id);
        });
        if (delete_layers.length > 0) {
          for (let i = 0; i < delete_layers.length; i++) {
            const delete_layer = delete_layers[i];
            removeCustomLayer({
              variables: {
                customLayerId: delete_layer._id,
              },
            });
          }
          const updated_layers = editingUserDefinedLayers.filter((layer) => {
            const shape_properties = JSON.parse(layer.shape).properties;
            return !shape_properties.id || !shape_properties.id.includes(id);
          });
          stateApp.draw.delete(`edit_polygon_${id}`);
          setStateApp({
            ...stateApp,
            editingUserDefinedLayers: updated_layers,
          });
          handleCloseSpatialDataCardEdit();
        } else if (customLayers.length > 0) {
          const delete_layers = customLayers.filter((layer) => {
            const shape_properties = JSON.parse(layer.shape).properties;
            return shape_properties.id && shape_properties.id.includes(id);
          });
          if (delete_layers.length > 0) {
            for (let i = 0; i < delete_layers.length; i++) {
              const delete_layer = delete_layers[i];
              removeCustomLayer({
                variables: {
                  customLayerId: delete_layer._id,
                },
              });
            }
            const updated_layers = customLayers.filter((layer) => {
              const shape_properties = JSON.parse(layer.shape).properties;
              return !shape_properties.id || !shape_properties.id.includes(id);
            });
            setStateApp({
              ...stateApp,
              customLayers: updated_layers,
            });
          }
          handleCloseSpatialDataCard();
        }
      } else {
        if (customLayers.length > 0) {
          const delete_layers = customLayers.filter((layer) => {
            const shape_properties = JSON.parse(layer.shape).properties;
            return shape_properties.id && shape_properties.id.includes(id);
          });
          if (delete_layers.length > 0) {
            for (let i = 0; i < delete_layers.length; i++) {
              const delete_layer = delete_layers[i];
              removeCustomLayer({
                variables: {
                  customLayerId: delete_layer._id,
                },
              });
            }
            const updated_layers = customLayers.filter((layer) => {
              const shape_properties = JSON.parse(layer.shape).properties;
              return !shape_properties.id || !shape_properties.id.includes(id);
            });
            setStateApp({
              ...stateApp,
              customLayers: updated_layers,
            });
          }
          handleCloseSpatialDataCard();
        }
      }
    }
  };

  useEffect(() => {
    console.log("useEffect 40");

    if (stateApp.userSnap === true) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "//api.usersnap.com/load/64ab8ea7-9417-41a0-b565-eb7ad69da871.js";
      script.async = true;
      script.setAttribute("id", "feedback-script");

      var x = document.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(script, x);

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else if (stateApp.userSnap === false) {
      const feedbackScript = document.querySelector("#feedback-script");
      feedbackScript && feedbackScript.remove();
      const element = document.getElementsByName("us-entrypoint-button");
      element && element[0] && element[0].remove();
    }
  }, [stateApp.userSnap]);

  useEffect(() => {
    console.log("useEffect 41");

    if (stateApp.editingUserDefinedLayers.length > 0) {
      const { map } = stateApp;

      map.on("draw.selectionchange", ({ features }) => {
        const [feature] = features;
        if (feature && feature.id.includes("edit_polygon")) {
          setStateApp({
            ...stateApp,
            selectedUserDefinedLayer: feature,
            editLayer: true,
          });
        } else {
          setStateApp({
            ...stateApp,
            popupOpen: false,
            selectedUserDefinedLayer: undefined,
            editLayer: false,
          });
        }
      });
    }
  }, [stateApp.editingUserDefinedLayers]);

  return (
    <div className={classes.mapWrapper}>
      <div className={classes.map} ref={mapEl} id="map">
        {map ? <DefaultFiltersTest /> : null}
        <div className={classes.footerLeftLogo}>
          <img src="icons/M1LogoWhiteTransparent.png" alt="logo" width="150" />
        </div>
      </div>
      <MapControlsProvider />
      {/* <DrawStatus drawingStatus={drawStatus} /> */}
      {/* <TrackAbstract showAbstractPopup={stateApp.showAbstractPopup} /> */}
      <ZoomFault zoomFaultStatus={stateApp.zoomFault} />
      <HugeRequest hugeRequestStatus={stateApp.hugeRequest} />
      <Coordinates long={lng} lat={lat} zoom={zoom} />
      {stateApp.selectedUserDefinedLayer &&
        !stateApp.popupOpen &&
        stateApp.editLayer && (
          <SpatialDataCard
            selectedFeature={stateApp.selectedUserDefinedLayer}
            saveSpatialData={handleSaveSpatialDataToShape}
            closeSpatialDataCard={handleCloseSpatialDataCardEdit}
            deleteSpatialDataAndShape={handleDeleteSpatialDataAndShape}
          />
        )}
      {mapGridCardActivated && (
        <MapGridCard mapGridCardActivated={mapGridCardActivated} />
      )}
      <div id="tempPopupHolder" className={classes.portal} ref={container} />
      <Portal container={container.current}>
        {stateApp.popupOpen ? (
          <div>
            {stateApp.selectedWell && (
              <PortalD id="popupContainer">
                {showExpandableCard && !stateApp.expandedCard ? (
                  <ExpandableCardProvider
                    expanded={false}
                    handleCloseExpandableCard={handleCloseExpandableCard}
                    component={<WellCardProvider></WellCardProvider>}
                    title={stateApp.selectedWell.wellName}
                    subTitle={stateApp.selectedWell.operator}
                    parent="map"
                    mouseX={0}
                    mouseY={0}
                    position="relative"
                    cardLeft={20}
                    cardTop={70}
                    zIndex={99}
                    cardWidth="350px"
                    // cardHeight="350px"
                    cardWidthExpanded="95vw"
                    cardHeightExpanded="90vh"
                    targetSourceId={stateApp.selectedWell.id}
                    targetLabel="well"
                  ></ExpandableCardProvider>
                ) : (
                  <Popover
                    open={stateApp.expandedCard}
                    anchorEl={anchorElPoPOver}
                    anchorReference="anchorEl"
                    style={{ width: "100%" }} //right:30, left: "-30px"}}
                    BackdropProps={{ invisible: false }}
                    anchorOrigin={{
                      vertical: "center",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "center",
                    }}
                  >
                    <ExpandableCardProvider
                      expanded={true}
                      handleCloseExpandableCard={handleCloseExpandableCard}
                      component={<WellCardProvider></WellCardProvider>}
                      title={stateApp.selectedWell.wellName}
                      subTitle={stateApp.selectedWell.operator}
                      parent="map"
                      mouseX={0}
                      mouseY={0}
                      position="relative"
                      // cardLeft={"0px"}
                      // cardTop={"0px"}
                      zIndex={99}
                      // cardWidth="380px"
                      // cardHeight="380px"
                      cardWidthExpanded="95vw"
                      cardHeightExpanded="95vh"
                      targetSourceId={stateApp.selectedWell.id}
                      targetLabel="well"
                    ></ExpandableCardProvider>
                  </Popover>
                )}
              </PortalD>
            )}
            {stateApp.selectedParcel && (
              <PortalD id="popupContainer">
                {showExpandableCard && !stateApp.expandedCard ? (
                  <ExpandableCardProvider
                    expanded={false}
                    handleCloseExpandableCard={handleCloseExpandableCard}
                    component={<ParcelCardProvider></ParcelCardProvider>}
                    title={stateApp.selectedParcel.shapeLabel}
                    subTitle=""
                    parent="map"
                    mouseX={0}
                    mouseY={0}
                    position="relative"
                    cardLeft={20}
                    cardTop={70}
                    zIndex={99}
                    cardWidth="350px"
                    // cardHeight="350px"
                    cardWidthExpanded="95vw"
                    cardHeightExpanded="90vh"
                    targetSourceId={stateApp.selectedParcel.id}
                    targetLabel="parcel"
                  ></ExpandableCardProvider>
                ) : (
                  <Popover
                    open={stateApp.expandedCard}
                    anchorEl={anchorElPoPOver}
                    anchorReference="anchorEl"
                    style={{ width: "100%" }} //right:30, left: "-30px"}}
                    BackdropProps={{ invisible: false }}
                    anchorOrigin={{
                      vertical: "center",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "center",
                    }}
                  >
                    <ExpandableCardProvider
                      expanded={true}
                      handleCloseExpandableCard={handleCloseExpandableCard}
                      component={<ParcelCardProvider></ParcelCardProvider>}
                      title={stateApp.selectedParcel.shapeLabel}
                      subTitle=""
                      parent="map"
                      mouseX={0}
                      mouseY={0}
                      position="relative"
                      // cardLeft={"0px"}
                      // cardTop={"0px"}
                      zIndex={99}
                      // cardWidth="380px"
                      // cardHeight="380px"
                      cardWidthExpanded="95vw"
                      cardHeightExpanded="95vh"
                      targetSourceId={stateApp.selectedParcel.id}
                      targetLabel="parcel"
                    ></ExpandableCardProvider>
                  </Popover>
                )}
              </PortalD>
            )}
            {stateApp.selectedUserDefinedLayer && (
              <PortalD id="popupContainer">
                <SpatialDataCardEdit
                  selectedFeature={stateApp.selectedUserDefinedLayer}
                  saveSpatialData={handleSaveSpatialDataToShape}
                  closeSpatialDataCard={handleCloseSpatialDataCard}
                  deleteSpatialDataAndShape={handleDeleteSpatialDataAndShape}
                  cardClass={"cardPopup"}
                />
              </PortalD>
            )}
            {stateApp.filterFeature && (
              <PortalD id="filterPopupContainer">
                <FilterControl filterFeature={stateApp.filterFeature} />
              </PortalD>
            )}
            {stateApp.selectedAbstracts.length > 0 && (
              <PortalD id="popupContainer">
                <AbstractSelectionPopup
                  abstracts={stateApp.selectedAbstracts}
                  map={map}
                  onClickExpand={handleAnchorElPopOver}
                />
              </PortalD>
            )}
          </div>
        ) : null}
      </Portal>
    </div>
  );
}
