

// react imports 
import React, {
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";

// contexts 
import { AppContext } from "../../AppContext";
import { NavigationContext } from "../Navigation/NavigationContext";
import { MapControlsContext } from "../MapControls/MapControlsContext";

// custom components 
import MapControlsProvider from "../MapControls/MapControlsProvider";
import WellCardProvider from "../WellCard/WellCardProvider";
import ExpandableCardProvider from "../ExpandableCard/ExpandableCardProvider";
import PortalD from "./components/Portal";
import Coordinates from "./components/Coordinates";
import ZoomFault from "./components/ZoomFault";
import HugeRequest from "./components/HugeRequest";
import SpatialDataCardEdit from "../MapControls/components/spatialDataCardEdit";
import SpatialDataCard from "../MapControls/components/spatialDataCard";
import "./popup.css";
import { spatialDataAttributes } from "../MapControls/components/DrawShapes/constants";
import { addCustomShapeProperties } from "../MapControls/components/DrawShapes/drawShapesHelpers";
import MapGridCardProvider from "../MapGridCard/MapGridProvider";
import MarkerIcon from "./sprites/marker-icon.png";
import DefaultFiltersTest from "./filtersDefaultTest";
import FilterControl from "./components/FilterControl";
import AbstractSelectionPopup from "./components/popup/AbstractSelectionPopup";
import ParcelCardProvider from "../ParcelsDetailCard/ParcelCardProvider";
import { deepEqual, deepEqualObjects } from "../Shared/functions";
import gjv from "geojson-validation";
import { setMainMapState, showErrorMessage } from "../../actions";

// 3rd party packages 
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode,
} from "mapbox-gl-draw-circle";
import DrawRectangle from "mapbox-gl-draw-rectangle-mode";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import debounce from "lodash/debounce";

// material-ui
import { makeStyles } from "@material-ui/core/styles";
import Portal from "@material-ui/core/Portal";

// queries 
import { useLazyQuery, useMutation } from "@apollo/client";
import { WELLSQUERY } from "../../graphQL/useQueryWells";
import { TRACKSBYOBJECTTYPE } from "../../graphQL/useQueryTracksByObjectType";
import { OWNERSWELLSQUERY } from "../../graphQL/useQueryOwnersWells";
import { CUSTOMLAYERSQUERY } from "../../graphQL/useQueryCustomLayers";
import { PERMITSQUERY } from "../../graphQL/useQueryPermits";
import { RECENT_SUBMITTED_PERMITS_QUERY } from "../../graphQL/useQueryRecentSubmittedPermits";
import { RIGSQUERY } from "../../graphQL/useQueryRigs";
import { ABSTRACTGEOQUERY } from "../../graphQL/useQueryAbstractGeo";
import { ABSTRACTWELLGEOQUERY } from "../../graphQL/useQueryAbstractWellGeo";
import { PLSSSECONDDIVISIONGEO } from "../../graphQL/useQueryPLSSSecondDivisionGeo";
import { VIEWFILEQUERY } from "../../graphQL/useQueryViewFile";
import { OWNERSQUERY } from "../../graphQL/useQueryOwners";
import { ALLLAYERSETTINGSBYUSER } from "../../graphQL/useQueryAllLayerSettingsByUser";
import { ABSTRACTGEOCONTAINSQUERY } from "../../graphQL/useQueryAbstractGeoContains";

// mutations 
import { REMOVECUSTOMLAYER } from "../../graphQL/useMutationRemoveCustomLayer";
import { UPDATECUSTOMLAYER } from "../../graphQL/useMutationUpdateCustomLayer";




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
    "& .mapboxgl-canvas-container > canvas": {
      cursor: ({ drawingCircle }) => (drawingCircle ? "crosshair" : "inherit"),
    },
    "& .mapboxgl-popup-close-button": { display: "none" },
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

function Map() {

  // context states
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateMapControls, setStateMapControls] = useContext(MapControlsContext);

  // function states 
  const [flyVar1, setFlyVar1] = useState([null]);
  const [parcelBoundaryId, setParcelBoundaryId] = useState(null);

  // styles 
  let classes = useStyles({
    drawingCircle:
      stateApp.draw && stateApp.draw.getMode() == "drag_circle" ? true : false,
  });

  const dispatch = useDispatch();
  const { mapGridCardActivated, searchInputValue } = useSelector(
    ({ MapGridCard }) => MapGridCard
  );
  const removeLayerFromMap = useSelector(
    ({ MainMap }) => MainMap.removeLayerFromMap
  );
  const clustersOff = useSelector(({ MainMap }) => MainMap.clustersOff);

  const [filtersDefault, FiltersDefault] = useState(
    stateApp.user.defaultFilters ? stateApp.user.defaultFilters : []
  );
  const setFiltersDefault = (state) => {
    if (filtersDefault != state) {
      FiltersDefault(state);
    }
  };

  const [lng, Lng] = useState();
  const [lat, Lat] = useState();


  const setLng = (state) => {
    if (lng != state) {
      Lng(state);
    }
  };
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
  const modalContainer = useRef(null);
  const [showExpandableCard, ShowExpandableCard] = useState(false);

  const setShowExpandableCard = (state) => {
    ShowExpandableCard(state);
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
  const setRigData = (state) => { if (rigs != state) { RigData(state); } };

  const [permits, PermitData] = useState([]);
  const setPermitData = (state) => { if (permits != state) { PermitData(state); } };

  const [recent_submitted_permits, RecentSubmittedPermitData] = useState([]);
  const setRecentSubmittedPermitData = (state) => { if (recent_submitted_permits != state) { RecentSubmittedPermitData(state); } };

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


  mapboxgl.accessToken = stateApp.mapboxglAccessToken;


  const [rows, Rows] = React.useState([]);
  const [loading, Loading] = useState(true);



  const setRows = (state) => {
    if (rows != state) {
      Rows(state);
    }
  };
  const setLoading = (state) => {
    if (loading != state) {
      Loading(state);
    }
  };


  // queries 
  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);
  const [getOwners, { data: dataOwners }] = useLazyQuery(OWNERSQUERY);
  const [tracksByObjectType, { data: dataTracks }] = useLazyQuery(TRACKSBYOBJECTTYPE);
  const [tracksByObjectTypeOwner, { data: dataTracksOwner }] = useLazyQuery(TRACKSBYOBJECTTYPE);
  const [getOwnersWells, { data: dataOwnersWells }] = useLazyQuery(OWNERSWELLSQUERY);
  const [getCustomLayers, { data: customLayerData }] = useLazyQuery(CUSTOMLAYERSQUERY);
  const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, { fetchPolicy: "network-only", });
  const [getWellsForLayer, { data: dataWellsForOwnerWellTrackLayer }] = useLazyQuery(WELLSQUERY);
  const [getPermits, { data: permitData }] = useLazyQuery(PERMITSQUERY);
  const [getRecentSubmittedPermits, { data: permitRecentSubmittedData }] = useLazyQuery(RECENT_SUBMITTED_PERMITS_QUERY);
  const [getRigs, { data: rigData }] = useLazyQuery(RIGSQUERY);
  const [getAbstractGeo, { data: abstractData }] = useLazyQuery(ABSTRACTGEOQUERY);
  const [getAbstractWellGeo, { data: abstractWellData }] = useLazyQuery(ABSTRACTWELLGEOQUERY);
  const [getAbstractGeoContains, { data: abstractContainsData }] = useLazyQuery(ABSTRACTGEOCONTAINSQUERY);
  const [getPLSSSecondDivisionGeo, { data: plssSecondDivisionData }] = useLazyQuery(PLSSSECONDDIVISIONGEO);
  const [getAllLayerSettingsByUser, { data: layerStates }] = useLazyQuery(ALLLAYERSETTINGSBYUSER);


  // mutations 
  const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);
  const [removeCustomLayer] = useMutation(REMOVECUSTOMLAYER);



  /////end/////////temporary

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
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
        },
      });

      getCustomLayers();
    }
  }, [stateApp.user]);

  useEffect(() => {
    if (dataTracks && dataTracks.tracksByObjectType) {
      if (dataTracks.tracksByObjectType.length !== 0) {
        const tracksIdArray = dataTracks.tracksByObjectType.map(
          (track) => track.trackOn
        );

        getWells({
          variables: {
            wellIdArray: tracksIdArray,
          },
        });
      } else {
        setRows([]);
        setLoading(false);
      }
    }
  }, [dataTracks]);

  useEffect(() => {
    if (dataTracksOwner && dataTracksOwner.tracksByObjectType) {
      if (dataTracksOwner.tracksByObjectType.length !== 0) {
        var objectsIdsArray = dataTracksOwner.tracksByObjectType.map(
          (item) => item.trackOn
        );
        getOwners({
          variables: {
            ownerIdArray: objectsIdsArray,
          },
        });
      }
    }
  }, [dataTracksOwner]);

  useEffect(() => {
    if (dataOwners) {
      if (dataOwners.owners?.length >= 0)
        setStateApp((state) => ({
          ...state,
          owners: [...dataOwners.owners],
        }));
      else
        setStateApp((state) => ({
          ...state,
          owners: [],
        }));
    }
  }, [dataOwners]);

  useEffect(() => {
    if (customLayerData && customLayerData.allCustomLayers && customLayerData.allCustomLayers != stateApp.customLayers) {
      setStateApp((state) => ({
        ...state,
        customLayers: customLayerData.allCustomLayers,
        selectedUserDefinedLayer: null,
        editLayer: false,
      }));
    }
  }, [customLayerData]);

  useEffect(() => {
    if (layerStates && layerStates.allLayerSettingsByUser) {

      console.log('layer states', layerStates)

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
      // let response = await fetch(uri, {
      //   headers: {
      //     "Content-Type": "text/plain; charset=UTF-8",
      //     "X-Ms-Blob-Type": "BlockBlob",
      //     "X-Ms-Meta-Internalkey": internalKey,
      //     "X-Ms-Version": "2015-02-21",
      //   },
      //   method: "GET",
      // });
      // response = await response.json();

      let layers = layersData.slice(0);
      let currentLayer = { ...layers[layerIndex] };
      // currentLayer.fileContent = response;
      currentLayer.fileUrl = uri;
      layers[layerIndex] = currentLayer;
      setLayersData(layers);

      let nextLayerIndex;

      if (layerIndex < layersData.length - 1)
        for (let i = layerIndex + 1; i < layers.length; i++) {
          const fileFound = layers.find((l) => l.file === layers[i].file && l.fileUrl)
          if (fileFound) {
            let currentLayer = { ...layers[i] };
            // currentLayer.fileContent = fileFound.fileContent
            currentLayer.fileUrl = fileFound.fileUrl
            layers[i] = currentLayer;
            setLayersData(layers);
          }
          else if (layers[i].layerType == "file layer") {
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

    if (dataOwnersWells && dataOwnersWells.length !== 0) {
      var ownerObjectIds = dataOwnersWells.ownersWells.map(
        (item) => item.wells
      );

      var merged = [].concat.apply([], ownerObjectIds);

      var stripped = merged.map((item) => item.wellId);

      getWellsForLayer({
        variables: {
          wellIdArray: stripped,
        },
      });
    }
  }, [dataOwnersWells]);

  useEffect(() => {

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

  const setLayer = (data, identifier, map, bLayer = null) => {
    let beforelayer = bLayer;

    //// configIndex = actual layer index
    const configIndex = stateApp.layers.findIndex(
      (value) => value.identifier === identifier
    );
    //// config = actual layer
    const config = stateApp.layers[configIndex];
    const paintProps = config.layerPaintProps;
    const layerSettings = config.layerSettings;
    for (let i = (paintProps ? paintProps.length : 0) - 1; i >= 0; i--) {
      const prop = paintProps[i];
      let layerData = null;
      if (identifier == "Parcels" || identifier == "Area of Interest") {
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
        if (layerData?.features) {
          geoJson = {
            ...layerData,
            features: layerData?.features?.filter((feature) => !!feature?.geometry) || []
          }
        } else {
          geoJson = layerData
        }


        // geoJson = layerData;




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
                    coordinates: [Number(feature.longitude), Number(feature.latitude)],
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
                    coordinates: [Number(feature.Longitude), Number(feature.Latitude)],
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
            // promoteId: "id",
          });
        }
      }


      if (sourceId == "parcels_source" || sourceId == "interests_source") {

        let pointSource = geoJson.features.map(feature => {

          var output = feature

          if (feature.geometry.type == "Point") {
            output = feature
          } else {
            output = { ...turf.centroid(feature), properties: feature.properties }
          }

          return output
        })


        pointSource = { type: "FeatureCollection", features: [...pointSource] }

        if (map.getSource(`${sourceId}_point`)) {
          let pointSourceData = map.getSource(`${sourceId}_point`)._data;
          if (pointSourceData && !deepEqualObjects(pointSource, pointSourceData))
            map.getSource(`${sourceId}_point`).setData(pointSource);
        } else {
          map.addSource(`${sourceId}_point`, {
            type: "geojson",
            data: pointSource
          })
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
          // promoteId: "id",
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

        map.moveLayer(`${layerId}_point`);
        map.setLayoutProperty(
          layerId,
          "visibility",
          visible ? "visible" : "none"
        );
        map.setLayoutProperty(
          `${layerId}_point`,
          "visibility",
          visible ? "visible" : "none"
        )
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
        if (config.layerGeometry && data.featureTypes) layerConfig.filter = ['==', 'layerGeometry', config.layerGeometry]

        if (prop.minZoom) {
          layerConfig.minzoom = prop.minZoom;
        }

        map.addLayer(layerConfig);

        if (prop.labelProps) {
          let labelLayout = { visibility: visible ? "visible" : "none" };
          labelLayout = {
            ...labelLayout,
            ...prop.labelProps.symbolProps,
          };
          // map.addLayer({
          //   id: `${prop.id}_label`,
          //   type: prop.labelProps.paintType,
          //   source: sourceId,
          //   minzoom: prop.labelProps.minZoom,
          //   // layout: labelLayout,
          // });

          // override label properties for parcel and interest
          if (layerId === 'parcel') {
            labelLayout = {
              ...labelLayout,
              "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                12,
                15,
                28
              ]
            }
          } else if (layerId === 'interest') {
            labelLayout = {
              ...labelLayout,
              "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                9,
                16,
                11,
                32,
                15,
                54
              ]
            }
          }

          // add point
          map.addLayer({
            id: `${layerId}_point`,
            type: 'symbol',
            source: `${sourceId}_point`,
            minzoom: prop.labelProps.minZoom,
            layout: labelLayout,
          });
          map.moveLayer(`${layerId}_point`);
        }
      }

      if (prop.clusterProps) {
        const mLayer = map.getLayer(layerId);
        const clusterVisible =
          visible &&
          mLayer &&
          !mLayer.source.includes("_filter") &&
          !clustersOff;

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

  useEffect(() => {
    console.log('PERMIT DATA ====', permitData)
    if (permitData && permitData.permits && permitData.permits.length > 0) {
      const nextOffset = permits.length + permitData.permits.length;
      setPermitData([...permits, ...permitData.permits]);
    }
  }, [permitData]);

  useEffect(() => {
    console.log('RECENT PERMIT DATA ====', permitRecentSubmittedData)
    if (permitRecentSubmittedData && permitRecentSubmittedData.recent_submitted_permits && permitRecentSubmittedData.recent_submitted_permits.length > 0) {
      const nextOffset = recent_submitted_permits.length + permitRecentSubmittedData.recent_submitted_permits.length;
      setRecentSubmittedPermitData([...recent_submitted_permits, ...permitRecentSubmittedData.recent_submitted_permits]);
    }
  }, [permitRecentSubmittedData]);


  useEffect(() => {
    if (rigData && rigData.rigs && rigData.rigs.length > 0) {
      const nextOffset = rigs.length + rigData.rigs.length;
      setRigData([...rigs, ...rigData.rigs]);
    }
  }, [rigData]);

  useEffect(() => {

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

    const wellPointClick = (feature) => {

      // this function is intended to organize the data 
      // when a well point is clicked 
      // and initiate the mapbox popup 

      if (feature && feature.properties) {

        let properties = feature.properties;

        // tmp fix because it appears that the data coming back 
        // from contacts api is slightly different than other apis
        // need to setup in a standard format         
        if (!properties.id) { properties.id = properties.wellId }

        if (properties.id) {
          setStateApp((state) => ({
            ...state,
            popupOpen: false,
            selectedUserDefinedLayer: null,
            selectedParcel: null,
          }));
          setStateApp((state) => ({
            ...state,
            selectedWellId: properties.id.toLowerCase(),
            wellSelectedCoordinates: [properties.longitude, properties.latitude],
          }));

        }
      }

    };


    const udLayerClickHandler = (feature) => {
      setStateApp((state) => ({
        ...state,
        expandedCard: false,
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

      createUDPopUp(feature.properties);
      map.resize();
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
                  layer.identifier == "Parcels" ||
                  layer.identifier == "Area of Interest" ||
                  layer.identifier == "Tracked Wells" ||
                  layer.identifier == "Tracked Owners" ||
                  layer.identifier == "User Tags" ||
                  layer.identifier == "Search"
                )
                  layers.push(layerId);

                if (
                  layer.identifier == "Parcels" ||
                  layer.identifier == "Area of Interest"
                ) {
                  udLayers.push(layerId);
                }
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
            layerId === "welllines" ||
            layerId === "Parcels" ||
            layerId === "Area of Interest" ||
            layerId === "Tracked Wells" ||
            layerId === "Tracked Owners" ||
            layerId === "Tags Filter" ||
            layerId === "Search" ||
            layerId === "recent_submitted_permits" ||
            layerId === "permits":
            wellPointClick(feature);
            break;
          default:
            break;
        }
      }
    };
    if (map) {
      if (mapClick && mapClick.mapClickHandler) {
        map.off("click", mapClick.mapClickHandler);
      }
      map.on("click", mapClickHandler);
      setMapClick({ mapClickHandler });
    }
  }, [map, stateApp.layers]);

  useEffect(() => {
    let beforeLayer = null;
    if (stateApp.layers && stateApp.layers.length > 0 && map) {
      for (let i = 0; i < stateApp.layers.length; i++) {
        const layer = stateApp.layers[i];
        if (layer.layerType == "vector layer") {
          const props = layer.layerPaintProps;
          const visible =
            layer.layerSettings &&
            layer.layerSettings.showable &&
            layer.layerSettings.visiable !== false;
          const ids = props && props.ids ? props.ids : [];
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
              }
            }
          });
        } else if (layer.layerType == "data layer") {
          let data = null;
          if (layer.layerPaintProps && layer.layerPaintProps.length > 0) {
            switch (layer.identifier) {
              case "Tracked Wells":
                data = stateApp.trackedwells;
                break;
              case "Tracked Owners":
                data = stateApp.trackedOwnerWells;
                break;
              case "Rig Activity":
                data = rigs;
                break;
              case "Recent Permits":
                data = permits;
                break;
              case "Recent Submitted Permits":
                data = recent_submitted_permits;
                break;
              case "Search":
                data = stateApp.wellListFromSearch;
                break;
              case "User Tags":
                data = stateApp.wellListFromTagsFilter;
                break;
              default:
                data = stateApp.customLayers;
            }
            if (data) {
              beforeLayer = setLayer(data, layer.identifier, map, beforeLayer);
            }
          }
        } else if (layer.layerType == "file layer" && layersData[i].fileUrl) {
          let data = layersData[i].fileUrl;
          if (data) {
            beforeLayer = setLayer(data, layer.identifier, map, beforeLayer);
          }
        }
      }

    }
  }, [
    stateApp.layers,
    stateApp.trackedOwnerWells,
    stateApp.trackedwells,
    stateApp.wellListFromTagsFilter,
    stateApp.wellListFromSearch,
    stateApp.customLayers,
    permits,
    recent_submitted_permits,
    rigs,
    map,
    clustersOff,
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
      if (map.getSource(`${sourceId}_point`)) map.removeSource(`${sourceId}_point`);
      if (map.getSource(`${sourceId}_filter`)) map.removeSource(`${sourceId}_filter`);
    }
  };

  useEffect(() => {
    if (removeLayerFromMap && map) {
      removeLayer(removeLayerFromMap);
      dispatch(setMainMapState({ removeLayerFromMap: null }));
    }
  }, [removeLayerFromMap]);

  useEffect(() => {

    // USE EFFECT FOR BASEMAP LAYER HANDLING
    if (stateApp.baseMapLayers && stateApp.baseMapLayers.length > 0 && map) {
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

    // USE EFFECT FOR HEATMAP LAYER HANDLES
    if (stateApp.heatLayers && stateApp.heatLayers.length > 0 && map) {
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

  useEffect(() => {

    if (showExpandableCard) {
      setTransform("transform: none");
    } else {
      setTransform("transform: inherit");
    }
  }, [showExpandableCard]);

  useEffect(() => {

    if (stateNav.m1neralDefaultsOnOff) {
      setDefaultsCheckOnOff((defaultsCheckOnOff) => !defaultsCheckOnOff);
    }
    if (stateNav.m1neralCehckOnOff) {
      setM1neralCheckOnOff((m1neralCheckOnOff) => !m1neralCheckOnOff);
    }
  }, [stateNav.m1neralCehckOnOff, stateNav.m1neralDefaultsOnOff]);

  useEffect(() => {
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
      if (stateNav.filterTVD && stateNav.filterTVD.length > 0) {
        filterArray.push(stateNav.filterTVD);
        isFilterSet = true;
        wellFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterLateralLength &&
        stateNav.filterLateralLength.length > 0
      ) {
        filterArray.push(stateNav.filterLateralLength);
        isFilterSet = true;
        wellFilterCount += 1;
        totalCount += 1;
      }
      if (
        stateNav.filterMeasuredDistance &&
        stateNav.filterMeasuredDistance.length > 0
      ) {
        filterArray.push(stateNav.filterMeasuredDistance);
        isFilterSet = true;
        wellFilterCount += 1;
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

      if (stateNav.filterPlay && stateNav.filterPlay.length > 0) {
        let total = stateNav.filterPlay[2].length;
        filterArray.push(stateNav.filterPlay);
        isFilterSet = true;
        wellFilterCount += total;
        totalCount += total;
      }

      if (stateNav.filterField && stateNav.filterField.length > 0) {
        let total = stateNav.filterField[2].length;
        filterArray.push(stateNav.filterField);
        isFilterSet = true;
        wellFilterCount += total;
        totalCount += total;
      }

      if (
        stateNav.filterPrimaryFormation &&
        stateNav.filterPrimaryFormation.length > 0
      ) {
        let total = stateNav.filterPrimaryFormation[2].length;
        filterArray.push(stateNav.filterPrimaryFormation);
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
          if (
            [
              "wellpoints",
              "welllines",
              "Tracked Wells",
              "Tracked Owners",
              "Tags Filter",
              "permits",
              "recent_submitted_permits",
              "rigs",
            ].indexOf(filterLayer) > -1
          ) {
            if (shapeList.length > 0) {
              if (!filterCustomArray[filterLayer]) {
                filterCustomArray[filterLayer] = [];
              }
              filterCustomArray[filterLayer] = [
                ...filterCustomArray[filterLayer],
                ...shapeList,
              ];
            }

            return;
          }

          let layer = map.getLayer(filterLayer);

          if (layer) {
            let featuresList = [];
            if (layer.source === "composite") {
              featuresList = map.querySourceFeatures("composite", {
                sourceLayer: layer.sourceLayer,
              });
            } else {
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
                if (["interest", "parcel"].indexOf(filterLayer) > -1) {
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
              if (result.length > 0) {
                if (!filterCustomArray[filterLayer + "_Source"]) {
                  filterCustomArray[filterLayer + "_Source"] = [];
                }
                filterCustomArray[filterLayer + "_Source"].push(result);
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
          "recent_submitted_permits",
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
          "recent_submitted_permits",
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
          "recent_submitted_permits",
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
          "recent_submitted_permits",
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

      //// turn on clusters if no shape filter && it was off
      if (Object.keys(filterCustomArray).length == 0 && clustersOff)
        dispatch(
          setMainMapState({
            clustersOff: false,
          })
        );

      if (isFilterSet) {
        //// turn off clusters if shape filter on
        if (Object.keys(filterCustomArray).length > 0 && !clustersOff)
          dispatch(
            setMainMapState({
              clustersOff: true,
            })
          );

        const mergeArrays = (arrays) => {
          let jointArray = [];

          arrays.forEach((array) => {
            jointArray = [...jointArray, ...array];
          });
          return Array.from(new Set([...jointArray]));
        };
        const mergeIntoMultiPolygon = (d) => {
          const data = d.map((f) => {
            if (f.type == "Feature") return f;
            return turf.feature(f);
          });
          return turf.combine(turf.featureCollection(data));
        };

        filterArray.unshift("all");

        //// start filtering
        if (filterCustomArray["wellpoints"]) {
          map.setFilter("wellpoints", [
            ...filterArray,

            ["within", mergeIntoMultiPolygon(filterCustomArray["wellpoints"])],
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
            ["within", mergeIntoMultiPolygon(filterCustomArray["welllines"])],
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
          "recent_submitted_permits",
          "rigs",
        ];
        filterLayers.forEach((filterLayer) => {
          if (filterCustomArray[filterLayer]) {
            if (
              [
                "Tracked Wells",
                "Tracked Owners",
                "Tags Filter",
                "permits",
                "recent_submitted_permits",
                "rigs",
              ].indexOf(filterLayer) > -1
            ) {
              // const filterClusterLayer = filterLayer + "-clusters";
              // const filterClusterLayerLabel = filterLayer + "-clusters-counts";

              map.setFilter(filterLayer, [
                "within",
                mergeIntoMultiPolygon(filterCustomArray[filterLayer]),
              ]);
            } else if (["interest", "parcel"].indexOf(filterLayer) > -1) {
              map.setFilter(filterLayer, [
                "match",
                ["get", "shapeLabel"],
                mergeArrays(filterCustomArray[filterLayer]),
                true,
                false,
              ]);
              map.setFilter(filterLayer + "_point", [
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
                  [
                    "Tracked Wells",
                    "Tracked Owners",
                    "Tags Filter",
                    "permits",
                    "recent_submitted_permits",
                    "rigs",
                  ].indexOf(filterLayer) > -1
                ) {
                  map.setFilter(filterLayer, [
                    "match",
                    ["get", "id"],
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
                  map.setFilter(filterLayer + "_point", [
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
                if (map.getLayer(filterLayer + "_point")) {
                  map.setFilter(filterLayer + "_point", null);
                }
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
        map.setFilter("interest_point", null);
        map.setFilter("parcel", null);
        map.setFilter("parcel_point", null);
        map.setFilter("wellsHeatmapBoe", [">", ["get", "boeTotal"], 0]);
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

        map.setFilter("wellsHeatmapCumGas", [">", ["get", "cumulativeGas"], 0]);
        map.setFilter("wellsHeatmapCumOil", [">", ["get", "cumulativeOil"], 0]);

        map.setFilter("wellsHeatmapLast12", [
          ">",
          ["get", "lastTwelveMonthBOE"],
          0,
        ]);
        map.setFilter("wellsHeatmapLast12Oil", [
          ">",
          ["get", "lastTwelveMonthOil"],
          0,
        ]);
        map.setFilter("wellsHeatmapLast12Gas", [
          ">",
          ["get", "lastTwelveMonthGas"],
          0,
        ]);
        map.setFilter("wellsHeatmapTVD", [
          ">",
          ["get", "trueVerticalDepth"],
          0,
        ]);

        const filterLayers = [
          "Tracked Wells",
          "Tracked Owners",
          "Tags Filter",
          "permits",
          "recent_submitted_permits",
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
    stateNav.filterLateralLength,
    stateNav.filterMeasuredDistance,
    stateNav.filterPermitDateRange,
    stateNav.filterPlay,
    stateNav.filterSpudDateRange,
    stateNav.filterWellProfile,
    stateNav.filterWellStatus,
    stateNav.filterPlay,
    stateNav.filterPrimaryFormation,
    stateNav.filterField,
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
    stateNav.filterTVD,
    stateNav.selectedTags,
    stateApp.trackedOwnerWells,
    stateApp.trackedwells,
    stateApp.customLayers,
    stateApp.wellListFromTagsFilter,
  ]);

  useEffect(() => {

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
      if (popUps[0]) {
        popUps[0].remove();
      }
      new mapboxgl.Popup({ offset: 0, closeOnClick: false })
        .setLngLat(coordinates)
        .setMaxWidth("none")
        .setHTML(`<div id="popupContainer"></div>`)
        .addTo(map);
      setStateApp((state) => ({
        ...state,
        popupOpen: true,
        expandedCard: stateApp.activateWellDetailsFromTable ? true : false,
      }));
      handleOpenExpandableCard();
    },
    [map, stateApp]
  );

  const createFilterPopup = useCallback(
    (filterFeature) => {
      const { geometry } = filterFeature;
      const coordinates = geometry.coordinates;
      let popUps = document.getElementsByClassName("mapboxgl-popup");
      if (popUps[0]) {
        popUps[0].remove();
      }
      if (coordinates.length > 0) {
        const minLatitude = coordinates.reduce((a, b) =>
          a[0] < b[0] ? a : b
        )[0][0];
        const maxLongitude = coordinates.reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0][1];

        let popupCoordinate = [minLatitude, maxLongitude];

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
      if (popUps[0]) {
        popUps[0].remove();
      }

      if (!currentFeature) return;

      const latLng = map.getCenter();

      if (map.getZoom() < 12.5) {
        latLng.lat = latLng.lat - 0.0375;
      } else if (map.getZoom() > 12.5 && map.getZoom() < 13) {
        latLng.lat = latLng.lat - 0.025;
      } else if (map.getZoom() > 13 && map.getZoom() < 13.5) {
        latLng.lat = latLng.lat - 0.0175;
      } else {
        if (map.getZoom() > 13.5 && map.getZoom() < 14) {
          latLng.lat = latLng.lat - 0.0125;
        } else latLng.lat = latLng.lat - 0.005;
      }

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
      if (popUps[0]) {
        popUps[0].remove();
      }

      new mapboxgl.Popup({ offset: 0, closeOnClick: false })
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

    if (map && stateApp.wellSelectedCoordinates) {
      if (map.getLayer("well-point")) map.removeLayer("well-point");
      if (map.getSource("well-select-point")) map.removeSource("well-select-point");

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
  }, [loading, stateApp.wellSelectedCoordinates]);

  useEffect(() => {
    (async () => {

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
          const endpoint = `https://api.mapbox.com/v4/${wellsTileset}/tilequery/${stateApp.wellSelectedCoordinates.join()}.json?radius=1&limit=5&dedupe&layers=wellPoints&access_token=${stateApp.mapboxglAccessToken
            }`;

          const headers = new Headers();
          headers.append("Content-Type", "application/json");
          headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

          const options = {
            method: "GET",
            headers: headers,
          };

          await fetch(endpoint, options)
            .then((response) => response.json())
            .then((response) => {
              features = response.features;
              currentFeature = features.find(
                (element) =>
                  element.properties.id.toLowerCase() == stateApp.selectedWellId
              );
            })
            .catch((error) => {
              console.log(error);
            });
        }

        if (currentFeature) {
          let popUps = document.getElementsByClassName("mapboxgl-popup");
          setStateApp((state) => ({
            ...state,
            popupOpen: false,
            selectedUserDefinedLayer: null,
            selectedParcel: null,
          }));
          setStateApp((state) => ({
            ...state,
            selectedWell: currentFeature.properties,
          }));

          createPopUp(currentFeature.properties);
          map.resize();


        }
      }
    })();
  }, [loading, stateApp.wellSelectedCoordinates]);

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

    getPermits({});
    getRecentSubmittedPermits({});
    getRigs({});

    fetch(req, { signal: signal })
      .then((results) => results.json())
      .then((data) => {
        setMapStyles(data.slice(0, 5));
      });

    setStateApp((state) => ({
      ...state,
      popupOpen: stateApp.wellSelectedCoordinates?.length > 0 && searchInputValue ? true : false ,
      expandedCard: false,
      selectedUserDefinedLayer: undefined,
    }));

    //clean up
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {

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

      const makeLabelGeoJson = (data) => {
        return {
          type: "FeatureCollection",
          features: data.map((feature) => {
            const geoJSON = JSON.parse(feature.geo_json);
            if (
              geoJSON.geometry &&
              geoJSON.geometry.coordinates[0].length >= 4
            ) {
              const polygon = turf.polygon(geoJSON.geometry.coordinates);
              const centroid = turf.centroid(polygon);
              centroid.properties.AbstractName =
                geoJSON.properties.AbstractName;
              return centroid;
            }
          }),
        };
      };

      const geoJson = makeGeoJSON(data);
      const labelGeoJson = makeLabelGeoJson(data);

      map.getSource("abstract_geo_source").setData(geoJson);
      map.getSource("abstract_label_geo_source").setData(labelGeoJson);
    }
  }, [abstractData]);

  useEffect(() => {
    if (
      plssSecondDivisionData &&
      plssSecondDivisionData.plssSecondDivisionGeo &&
      plssSecondDivisionData.plssSecondDivisionGeo.length > 0
    ) {
      const data = plssSecondDivisionData.plssSecondDivisionGeo;
      const makeGeoJSON = (data) => {
        return {
          type: "FeatureCollection",
          features: data.map((feature) => {
            return JSON.parse(feature.geo_json);
          }),
        };
      };

      const makeLabelGeoJson = (data) => {
        return {
          type: "FeatureCollection",
          features: data.map((feature) => {
            const geoJSON = JSON.parse(feature.geo_json);
            if (
              geoJSON.geometry &&
              geoJSON.geometry.coordinates[0].length >= 4
            ) {
              const polygon = turf.polygon(geoJSON.geometry.coordinates);
              const centroid = turf.centroid(polygon);
              centroid.properties.ShortName =
                geoJSON.properties.ShortName;
              return centroid;
            }
          }),
        };
      };

      const geoJson = makeGeoJSON(data);
      const labelGeoJson = makeLabelGeoJson(data);

      map.getSource("plssseconddivision_geo_source").setData(geoJson);
      map.getSource("plssseconddivision_label_geo_source").setData(labelGeoJson);
    }
  }, [plssSecondDivisionData]);

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
      if (popUps[0]) {
        popUps[0].remove();
      }

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

  // const mapMouseMove = (e) => {
  //   // e.lngLat is the longitude, latitude geographical position of the event
  //   let coordinates = e.lngLat.wrap();
  //   setLng(coordinates.lng);
  //   setLat(coordinates.lat);
  // };

  // const mapZoom = (e) => {
  //   let zooms = map.getZoom();
  //   setZoom(zooms);
  // };

  const onAbstactLayerClick = function (feature, action) {
    console.log("featur--", feature)
    console.log("action", action)

    if (!feature) {
      setStateApp((state) => ({
        ...state,
        selectedAbstracts: [],
      }));
      return;
    }
    setStateApp((state) => ({
      ...state,
      popupOpen: false,
    }));
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
  };

  useEffect(() => {
    // HERE FOOL
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
            let isExisting = stateApp.customLayers.find(x => x.shape.includes(currentFeature.id));

            if (!isExisting) {
              map.setFeatureState(
                { source: "abstract_geo_source", id: e.features[0].id },
                { click: true }
              );
              onAbstactLayerClick(currentFeature, "add");
            }
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
      });
    }
  }, [map, stateApp.customLayers]);

  useEffect(() => {

    if (mapStyles.length > 0) {
      // const SET_INITIAL_MAP_STYLE = "Satellite";

      const initializeMap = ({ setMap, mapEl, setStateApp, setDraw }) => {
        let id = mapEl.current.id;

        var index = getIndex(stateApp.mapVars.styleId, mapStyles, "name");

        const newMap = new mapboxgl.Map({
          container: `${id}`,
          style: "mapbox://styles/m1neral/" + mapStyles[index].id,
          center: stateApp.mapVars.center,
          zoom: stateApp.mapVars.zoom,
          pitch: stateApp.mapVars.pitch,
          bearing: stateApp.mapVars.bearing,
        });

        setWellsTileset(
          mapStyles[index].sources.composite.url
            .split(",")
            .find((element) => element.indexOf("m1neral.wells") > -1)
            .replace("mapbox://", "")
        );

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

        //// selecting the rect after draw
        let CostumDrawRectangle = { ...DrawRectangle };
        CostumDrawRectangle.onClick = function onClick(state, e) {
          // if state.startPoint exist, means its second click
          //change to  simple_select mode
          if (
            state.startPoint &&
            state.startPoint[0] !== e.lngLat.lng &&
            state.startPoint[1] !== e.lngLat.lat
          ) {
            this.updateUIClasses({ mouse: "pointer" });
            state.endPoint = [e.lngLat.lng, e.lngLat.lat];
            this.changeMode("simple_select", {
              featuresId: state.rectangle.id,
            });
            this.setSelected(state.rectangle.id); //// selecting the rect after draw
          }
          // on first click, save clicked point coords as starting for  rectangle
          var startPoint = [e.lngLat.lng, e.lngLat.lat];
          state.startPoint = startPoint;
        };

        let Draw = new MapboxDraw({
          displayControlsDefault: false,
          userProperties: true,
          modes: {
            ...MapboxDraw.modes,
            draw_circle: CircleMode,
            drag_circle: DragCircleMode,
            direct_select: DirectMode,
            simple_select: SimpleSelectMode,
            draw_rectangle: CostumDrawRectangle,
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

            setStateApp((state) => ({
              ...state,
              selectedPolygonString: polygonString
            }));
          }

          if (map.getZoom() >= 14) {
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

            getPLSSSecondDivisionGeo({
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

          newMap.addSource("abstract_label_geo_source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
            promoteId: "Id",
          });

          newMap.addSource("plssseconddivision_geo_source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
            // promoteId: "Id",
          });

          newMap.addSource("plssseconddivision_label_geo_source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
            // promoteId: "Id",
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
                0.3,
                ["boolean", ["feature-state", "click"], false],
                0.3,
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
              "line-color": "#292424",
              "line-opacity": "0.5",
              "line-width": 3,
            },
          });

          newMap.addLayer({
            id: "abstract_geo_label_layer",
            type: "symbol",
            minzoom: 12,
            source: "abstract_label_geo_source",
            layout: {
              "text-field": "{AbstractName}",
              "text-anchor": "center",
            },
            paint: {
              "text-color": "#888",
            },
          });

          newMap.addLayer({
            id: "plssseconddivision_geo_layer",
            type: "fill",
            minzoom: 14,
            source: "plssseconddivision_geo_source",
            paint: {
              "fill-color": "rgba(0, 0, 0, 0)",
              "fill-outline-color": "rgba(0, 6, 15, 0.17)"
            },
          });

          newMap.addLayer({
            id: "plssseconddivision_geo_label_layer",
            type: "symbol",
            minzoom: 14,
            source: "plssseconddivision_label_geo_source",
            layout: {
              "text-font": ["Open Sans SemiBold", "Arial Unicode MS Regular"],
              "text-field": "{ShortName}",
              "text-anchor": "center",
            },
            paint: {
              "text-color": "hsla(0, 0%, 0%, 0.75)",
              "text-halo-color": "hsl(35, 16%, 100%)",
              "text-halo-width": 0.5,
              "text-halo-blur": 0.5
            },
          });

          setDraw(Draw);
          setMap(newMap);
          setLoading(false)
        });
      };

      if (!map) {
        initializeMap({ setMap, mapEl, setStateApp, setDraw });
      } else {

        // map.on("mousemove", mapMouseMove);
        // map.on("zoom", mapZoom);

      }
    }
  }, [
    map,
    setStateApp,
    setStateMapControls,
    mapStyles,
    // stateApp.checkedLayersInteraction,
  ]);

  // use effect to query the viewport
  useEffect(() => {
    if (stateApp.map) {
      const queryViewportHandler = debounce(() => {
        if (stateApp.map.getZoom() >= stateApp.minZoomToQueryViewport) {
          const points = stateApp.map.queryRenderedFeatures({
            layers: [
              "wellpoints",
              // "Tracked Wells",
              // "Tags Filter",
              // "Search",
            ],
          });

          const featuresArray = [];
          points.forEach((point) => {
            if (point && point.properties && point.properties.id) {
              featuresArray.push({
                ...point.properties,
                id: point.properties.id.toLowerCase(),
              });
            }
          });

          setStateApp((stateApp) => {
            if (!deepEqual(stateApp.viewportWells, featuresArray))
              return { ...stateApp, viewportWells: featuresArray };
            return stateApp;
          });
        } else
          setStateApp((stateApp) => {
            if (stateApp.viewportWells)
              return { ...stateApp, viewportWells: null };
            return stateApp;
          });
      }, 300);

      // stateApp.map.off("render", queryViewportHandler);
      stateApp.map.on("render", queryViewportHandler);
    }
  }, [stateApp.map]);

  // Use effect for removing shape filter
  useEffect(() => {

    if (!loading && stateNav.filterDrawing && stateNav.filterDrawing.length === 0) {
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
    if (draw && stateNav.filterDrawing && stateNav.filterDrawing.length == 2) {
      const feature = stateNav.filterDrawing[1];
      setDrawingFilterFeatureId(feature.id);
      draw.delete(feature.id);
      draw.add(feature);
    }
  }, [draw]);

  useEffect(() => {
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


        //Loading state is not being handled and causes undefined mapList Array
        //Added '?' to mapList, temp fix to avoid undefined errors.
        var mapList = document.getElementById("map");
        if (mapList?.childNodes?.length > 1) {
          mapList.removeChild(mapList.childNodes[1]);
          mapList.removeChild(mapList.childNodes[1]);
          mapList.removeChild(mapList.childNodes[1]);
        }
      };
    }
  }, [map]);


  useEffect(() => {

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

      !stateApp.activateWellDetailsFromTable &&
        map.flyTo({
          center: [stateApp.flyTo.longitude, stateApp.flyTo.latitude],
          zoom: stateApp.flyTo.zoom ? stateApp.flyTo.zoom : zVal,
          speed: 0.5,
        });
    }
  }, [map, stateApp.flyTo]); //createPopUp

  useEffect(() => {
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

    if (map && stateApp.toggleZoomOut) {
      if (stateApp.toggleZoomOut === true) {
        map.flyTo({
          center: stateApp.defaultMapVars.center,
          zoom: stateApp.defaultMapVars.zoom,
          pitch: stateApp.defaultMapVars.pitch,
          bearing: stateApp.defaultMapVars.bearing,
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
    // use effect to toggle the map into a 3d state 

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

  const handleToggleInteraction = (layerIdentifier, value) => {
    let layer;
    let index;
    stateApp.layers.forEach((l, i) => {
      if (l.identifier == layerIdentifier) {
        layer = l;
        index = i;
      }
    });
    if (
      index &&
      layer &&
      layer.layerSettings &&
      layer.layerSettings.interaction &&
      layer.layerSettings.interaction.interactionDetail &&
      layer.layerSettings.interaction.interactionDetail.click !== value
    ) {
      const currentLayers = [...stateApp.layers];
      const updatedLayer = {
        ...layer,
        layerSettings: {
          ...layer.layerSettings,
          interaction: {
            ...layer.layerSettings.interaction,
            // interactionAble: value,
            interactionDetail: {
              hover: value,
              click: value,
            },
          },
        },
      };

      //// saving to stateApp
      currentLayers[index] = updatedLayer;

      setStateApp((stateApp) => ({ ...stateApp, layers: [...currentLayers] }));
    }
  };

  useEffect(() => {

    if (stateApp.editDraw === true || stateNav.drawingMode) {
      setDrawStatus(true);
      if (mapClick && mapClick.mapClickHandler != null) {
        handleToggleInteraction("Wells", false);
      }
    } else {
      setDrawStatus(false);
      if (mapClick && mapClick.mapClickHandler != null) {
        setTimeout(() => {
          handleToggleInteraction("Wells", true);
        }, 500);
      }
    }
  }, [stateApp.editDraw, stateNav.drawingMode]);

  const handleOpenExpandableCard = () => {
    setAnchorElPoPOver(container.current);
    setShowExpandableCard(true);
  };

  const handleAnchorElPopOver = () => {
    setAnchorElPoPOver(container.current);
  };

  const handleCloseExpandableCard = () => {
    setShowExpandableCard(false);
    setAnchorElPoPOver(null);
    setStateApp((state) => ({
      ...state,
      expandedCard: false,
      activateWellDetailsFromTable: false,
    }));
    getCustomLayers()
  };

  const deleteParcel = () => {
    updateCustomLayer({
      variables: {
        customLayerId: stateApp.selectedParcel.id,
        customLayer: {
          IsDeleted: true,
        },
      },
      refetchQueries: ["getCustomLayers"],
      awaitRefetchQueries: true,
    });
  }

  const handleCloseSpatialDataCard = (complete = true) => {
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
          return layer._id && layer._id.includes(id);
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
        refetchQueries: ["getCustomLayers"],
        awaitRefetchQueries: true,
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


  // useEffect(() => {
  //   // use effect to add usersnap to the application 

  //   if (stateApp.userSnap === true) {
  //     var script = document.createElement("script");
  //     script.type = "text/javascript";
  //     script.src =
  //       "//api.usersnap.com/load/64ab8ea7-9417-41a0-b565-eb7ad69da871.js";
  //     script.async = true;
  //     script.setAttribute("id", "feedback-script");

  //     var x = document.getElementsByTagName("script")[0];
  //     x.parentNode.insertBefore(script, x);

  //     document.body.appendChild(script);

  //     return () => {
  //       //document.body.removeChild(script);
  //     };
  //   } else if (stateApp.userSnap === false) {
  //     const feedbackScript = document.querySelector("#feedback-script");
  //     feedbackScript && feedbackScript.remove();
  //     const element = document.getElementsByName("us-entrypoint-button");
  //     element && element[0] && element[0].remove();
  //   }
  // }, [stateApp.userSnap]);

  useEffect(() => {
    if (stateApp.editingUserDefinedLayers.length > 0) {
      const { map } = stateApp;

      map.on("draw.selectionchange", ({ features }) => {
        const [feature] = features;
        if (feature && feature.id.includes("edit_polygon")) {
          setStateApp({
            ...stateApp,
            selectedUserDefinedLayer: feature,
            editLayer: true,
            editDraw: true,
          });
        } else {
          setStateApp({
            ...stateApp,
            popupOpen: false,
            selectedUserDefinedLayer: undefined,
            editLayer: false,
            editDraw: false,
          });
        }
      });
    }
  }, [stateApp.editingUserDefinedLayers]);

  useEffect(() => {
    /////// USE EFFECT  to handle the map zoom /  for selected well elements

    if ((stateApp.wellDetailCardOpen && stateApp.wellDetailCardOpen === true)) {
      // set and remove map marker


      // mathematical formula for screen fit
      const alpha = 0.01;
      const bbox = [
        [
          stateApp.selectedWell.longitude - 1.5 * alpha,
          stateApp.selectedWell.latitude,
        ],
        [
          stateApp.selectedWell.longitude + 0.5 * alpha,
          stateApp.selectedWell.latitude,
        ],
      ];

      // map may be null when wellDetailCard is launched from somewhere else
      map?.fitBounds(bbox, {
        speed: 0.75,
        linear: true,
      });

      setStateApp({
        ...stateApp,
        wellDetailCardOpen: false,
      });

    }
  }, [stateApp.wellDetailCardOpen]);


  useEffect(() => {
    /////// USE EFFECT  to handle the map zoom /  for selected parcel elements

    if ((stateApp.parcelDetailCardOpen && stateApp.parcelDetailCardOpen === true)) {
      // set and remove map marker

      let coordinates = stateApp.selectedParcel.shapeCenter
      if (typeof stateApp.selectedParcel.shapeCenter === "string") {
        coordinates = JSON.parse(stateApp.selectedParcel.shapeCenter);
      }
      const longitude = coordinates[0]
      const latitude = coordinates[1]

      const mapBounds = map.getBounds()
      const screenLeftLng = mapBounds._sw.lng
      const screenRightLng = mapBounds._ne.lng
      const alpha = (screenRightLng - screenLeftLng) / 2

      const bbox = [
        [
          longitude - 1.5 * alpha,
          latitude,
        ],
        [
          longitude + 0.5 * alpha,
          latitude,
        ],
      ];

      map.fitBounds(bbox, {
        speed: 0.75,
        linear: true,
      });

      setStateApp({
        ...stateApp,
        parcelDetailCardOpen: false,
      });

    }
  }, [stateApp.parcelDetailCardOpen]);




  useEffect(() => {
    if (parcelBoundaryId && map) {
      let mapSourceData = map.getSource('parcels_source')._data;
      const idx = mapSourceData.features.findIndex(feature => feature.id === parcelBoundaryId)
      if (idx > -1) {
        const geoJson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: mapSourceData.features[idx].geometry.coordinates[0]
          }
        }

        if (map.getSource('parcelBoundarySource')) {
          map.getSource('parcelBoundarySource').setData(geoJson);
          if (map.getLayer('parcelBoundary')) {
            map.removeLayer('parcelBoundary')
          }
        } else {
          map.addSource('parcelBoundarySource', {
            type: "geojson",
            data: geoJson
          });
        }

        map.addLayer({
          id: 'parcelBoundary',
          type: 'line',
          source: 'parcelBoundarySource',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#FFFF00',
            'line-width': 8
          }
        });
      }
    }
  }, [parcelBoundaryId])

  useEffect(() => {
    if (map && stateApp.selectedParcel) {
      setParcelBoundaryId(stateApp.selectedParcel.id);
    } else if (map) {
      if (map.getLayer('parcelBoundary')) map.removeLayer('parcelBoundary');
      if (map.getSource('parcelBoundarySource')) map.removeSource('parcelBoundarySource');
      setParcelBoundaryId(null);
    }
  }, [stateApp.selectedParcel])

  return (
    <div className={classes.mapWrapper}>
      <div className={classes.map} ref={mapEl} id="map">
        {map ? <DefaultFiltersTest /> : null}
        <div className={classes.footerLeftLogo}>
          <img src="icons/M1LogoWhiteTransparent.png" alt="logo" width="150" />
        </div>
      </div>
      <MapControlsProvider />
      <ZoomFault zoomFaultStatus={stateApp.zoomFault} />
      <HugeRequest />
      {/* <Coordinates long={lng} lat={lat} zoom={zoom} /> */}
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
        <MapGridCardProvider mapGridCardActivated={mapGridCardActivated} />
      )}

      {stateApp.selectedWell !== null && showExpandableCard &&
        stateApp.expandedCard && (
          <div className={classes.draggable}>
            <ExpandableCardProvider
              expanded
              handleCloseExpandableCard={handleCloseExpandableCard}
              component={<WellCardProvider />}
              title={stateApp.selectedWell.wellName}
              subTitle={stateApp.selectedWell.api}
              parent="map"
              cardTop={20}
              cardLeft={20}
              position="relative"
              zIndex={99}
              cardWidthExpanded="50vw"
              cardHeightExpanded="90vh"
              targetSourceId={stateApp.selectedWell.id}
              targetLabel="well"
            />
          </div>
        )
      }

      {stateApp.selectedParcel !== null &&
        stateApp.expandedCard && (

          <div className={classes.draggable}>
            <ExpandableCardProvider
              expanded={true}
              handleCloseExpandableCard={handleCloseExpandableCard}
              component={<ParcelCardProvider></ParcelCardProvider>}
              title={stateApp.selectedParcel.shapeLabel}
              subTitle=""
              parent="map"
              position="relative"
              cardTop={20}
              cardLeft={20}
              zIndex={99}
              cardWidthExpanded="50vw"
              cardHeightExpanded="90vh"
              targetSourceId={stateApp.selectedParcel.id}
              targetLabel="parcel"
              deleteParcel={deleteParcel}
            ></ExpandableCardProvider>
          </div>
        )
      }

      <div id="modalHolder" ref={modalContainer} />
      <Portal container={modalContainer.current}>
        {stateApp.selectedAbstracts.length > 0 && (
          <AbstractSelectionPopup
            abstracts={stateApp.selectedAbstracts}
            map={map}
            onClickExpand={handleAnchorElPopOver}
          />
        )}
      </Portal>
      <Portal container={container.current}>
        {stateApp.popupOpen === true ? (
          <div>
            {stateApp.selectedWell !== null &&
              // && stateApp.popupOpen==true
              showExpandableCard && (
                <PortalD id="popupContainer">
                  {!stateApp.expandedCard && (
                    <ExpandableCardProvider
                      handleCloseExpandableCard={handleCloseExpandableCard}
                      component={<WellCardProvider />}
                      title={stateApp.selectedWell.wellName}
                      subTitle={stateApp.selectedWell.api}
                      parent="map"
                      mouseX={0}
                      mouseY={0}
                      position="relative"
                      cardLeft={0}
                      cardTop={0}
                      zIndex={3000}
                      cardWidth="350px"
                      cardWidthExpanded="50vw"
                      cardHeightExpanded="95vh"
                      targetSourceId={stateApp.selectedWell.id}
                      targetLabel="well"
                    ></ExpandableCardProvider>
                  )}
                </PortalD>
              )}
            {stateApp.selectedParcel && (
              <PortalD id="popupContainer">
                {!stateApp.expandedCard && (
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
                    cardWidthExpanded="50vw"
                    cardHeightExpanded="90vh"
                    targetSourceId={stateApp.selectedParcel.id}
                    targetLabel="parcel"
                    deleteParcel={deleteParcel}
                  ></ExpandableCardProvider>
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
          </div>
        ) : null}
      </Portal>
    </div>
  );
}

Map.whyDidYouRender = true

export default React.memo(Map);