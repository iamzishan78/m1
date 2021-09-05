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
import { WellCardContext } from "../WellCard/WellCardContext";
import { ParcelCardContext } from "../ParcelsDetailCard/ParcelCardContext";


// custom components
import MapControlsProvider from "../MapControls/MapControlsProvider";
import WellCardProvider from "../WellCard/WellCardProvider";
import PermitCardProvider from "../PermitCard/PermitCardProvider";
import UdLayerCardProvider from '../UdLayerCard/UdLayerCardProvider';
import ExpandableCardProvider from "../ExpandableCard/ExpandableCardProvider";
import PortalD from "./components/Portal";
import Coordinates from "./components/Coordinates";
import ZoomFault from "./components/ZoomFault";
import HugeRequest from "./components/HugeRequest";
import SpatialDataCardEdit from "../MapControls/components/spatialDataCardEdit";
import SpatialDataCard from "../MapControls/components/spatialDataCard";
import "./popup.css";
import AbstractSelectionPopup from './components/popup/AbstractSelectionPopup';
import { spatialDataAttributes } from "../MapControls/components/DrawShapes/constants";
import { addCustomShapeProperties, drawBoundary } from "../MapControls/components/DrawShapes/drawShapesHelpers";
import MapGridCardProvider from "../MapGridCard/MapGridProvider";
import MarkerIcon from "./sprites/marker-icon.png";
import DefaultFiltersTest from "./filtersDefaultTest";
import FilterControl from "./components/FilterControl";
import ParcelCardProvider from "../ParcelsDetailCard/ParcelCardProvider";
import { deepEqual, deepEqualObjects } from "../Shared/functions";
import gjv from "geojson-validation";
import { setMainMapState, showErrorMessage } from "../../actions";

// 3rd party packages
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import polylabel from "polylabel";
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode,
} from "mapbox-gl-draw-circle";
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode';
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
//import { PERMITSQUERY } from "../../graphQL/useQueryPermits";
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

import { PERMITDETAILQUERY } from "../../graphQL/useQueryRecentPermitDetails";
import { drawShapeStyles } from "components/MapControls/commonHelper";
import _ from "lodash";

import parseLinkHeader from 'parse-link-header';

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
  const [stateWellCard, setStateWellCard] = useContext(WellCardContext);

  // function states
  const [parcelBoundaryId, setParcelBoundaryId] = useState(null);

  // styles
  let classes = useStyles({
    drawingCircle:
      stateApp.draw && stateApp.draw.getMode() === "drag_circle" ? true : false,
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

  const [lng, Lng] = useState();
  const [lat, Lat] = useState();

  const setLng = (state) => {
    if (lng !== state) {
      Lng(state);
    }
  };
  const setLat = (state) => {
    if (lat !== state) {
      Lat(state);
    }
  };
  const [zoom, Zoom] = useState(stateApp.mapVars.zoom);
  const setZoom = (state) => {
    if (zoom !== state) {
      Zoom(state);
    }
  };

  const [transform, Transform] = useState("transform: inherit");
  const setTransform = (state) => {
    if (transform !== state) {
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
    if (mapStyles !== state) {
      MapStyles(state);
    }
  };
  const [wellsTileset, WellsTileset] = useState();
  const setWellsTileset = (state) => {
    if (wellsTileset !== state) {
      WellsTileset(state);
    }
  };
  const [defaultsCheckOnOff, DefaultsCheckOnOff] = useState(true);
  const setDefaultsCheckOnOff = (state) => {
    if (defaultsCheckOnOff !== state) {
      DefaultsCheckOnOff(state);
    }
  };
  const [m1neralCheckOnOff, M1neralCheckOnOff] = useState(true);
  const setM1neralCheckOnOff = (state) => {
    if (m1neralCheckOnOff !== state) {
      M1neralCheckOnOff(state);
    }
  };
  const [map, Map] = useState(null);
  const setMap = (state) => {
    if (map !== state) {
      Map(state);
    }
  };
  const [mapClick, MapClick] = useState(null);
  const setMapClick = (state) => {
    if (mapClick !== state) {
      MapClick(state);
    }
  };
  const [draw, Draw] = useState(null);
  const setDraw = (state) => {
    if (draw !== state) {
      Draw(state);
    }
  };
  const [drawStatus, DrawStatus] = useState(false);
  const setDrawStatus = (state) => {
    if (drawStatus !== state) {
      DrawStatus(state);
    }
  };
  const [rigs, RigData] = useState([]);
  const setRigData = (state) => { if (rigs != state) { RigData(state); } };

  // const [permits, PermitData] = useState([]);
  // const setPermitData = (state) => { if (permits != state) { PermitData(state); } };

  const [recent_submitted_permits, RecentSubmittedPermitData] = useState([]);
  const setRecentSubmittedPermitData = (state) => { if (recent_submitted_permits != state) { RecentSubmittedPermitData(state); } };

  const [layersData, setLayersData] = useState([]);

  const [drawingFilterFeatureId, DrawingFilterFeatureId] = useState(null);
  const setDrawingFilterFeatureId = (state) => {
    if (drawingFilterFeatureId !== state) {
      DrawingFilterFeatureId(state);
    }
  };

  // const [geocoder, setGeocoder] = useState(null);
  const [anchorElPoPOver, AnchorElPoPOver] = useState(null);
  const setAnchorElPoPOver = (state) => {
    if (anchorElPoPOver !== state) {
      AnchorElPoPOver(state);
    }
  };
  const mapEl = useRef(null);

  // hacky but having to use a ref for valid state during map on event callback
  const stateNavRef = useRef();
  stateNavRef.current = stateNav;

  const [hoverUdIds, HoverUdIds] = useState([]);
  const setHoverUdIds = (id) => {
    const ids = hoverUdIds.slice(0);
    if (ids.indexOf(id) > -1) {
      const tmpIds = ids.filter((item) => item !== id);
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
  //const [getPermits, { data: permitData }] = useLazyQuery(PERMITSQUERY);
  const [
    getRecentSubmittedPermits,
    { data: permitRecentSubmittedData },
  ] = useLazyQuery(RECENT_SUBMITTED_PERMITS_QUERY);
  const [getRigs, { data: rigData }] = useLazyQuery(RIGSQUERY);
  const [getAbstractGeo, { data: abstractData }] = useLazyQuery(
    ABSTRACTGEOQUERY
  );
  const [getAbstractWellGeo, { data: abstractWellData }] = useLazyQuery(
    ABSTRACTWELLGEOQUERY
  );
  const [getAbstractGeoContains, { data: abstractContainsData }] = useLazyQuery(
    ABSTRACTGEOCONTAINSQUERY
  );
  const [
    getPLSSSecondDivisionGeo,
    { data: plssSecondDivisionData },
  ] = useLazyQuery(PLSSSECONDDIVISIONGEO);
  const [getAllLayerSettingsByUser, { data: layerStates }] = useLazyQuery(
    ALLLAYERSETTINGSBYUSER
  );

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
    if (
      customLayerData &&
      customLayerData.allCustomLayers &&
      customLayerData.allCustomLayers !== stateApp.customLayers
    ) {
      setStateApp((state) => ({
        ...state,
        customLayers: customLayerData.allCustomLayers,
        selectedUserDefinedLayer: null,
        editLayer: false,
      }));
    }
  }, [customLayerData]);

  const [
    getRecentPermitDetail,
    { loading: loadingPermitSummary, data: dataPermitSummary },
  ] = useLazyQuery(PERMITDETAILQUERY, { fetchPolicy: "network-only", });


  useEffect(() => {
    if (stateApp.selectedPermit !== null && !stateApp.selectedPermit.hasOwnProperty('Lease')) {
      getRecentPermitDetail({
        variables: { id: stateApp.selectedPermit.PermitId }
      });
    }
  }, [stateApp.selectedPermit]);

  useEffect(() => {
    if (dataPermitSummary) {
      setStateApp((state) => ({
        ...state,
        selectedPermit: { ...stateApp.selectedPermit, ...dataPermitSummary.recentPermitDetail[0] }
      }));
    }
  }, [dataPermitSummary])


  useEffect(() => {
    if (layerStates && layerStates.allLayerSettingsByUser) {

      setStateApp((state) => ({
        ...state,
        layers: [...layerStates.allLayerSettingsByUser],
      }));

      if (layerStates.allLayerSettingsByUser.length > 0) {
        setLayersData(layerStates.allLayerSettingsByUser);
        for (let i = 0; i < layerStates.allLayerSettingsByUser.length; i++) {
          const layer = layerStates.allLayerSettingsByUser[i];
          if (layer.layerType === "file layer") {
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
      layers.forEach((layer, index) => {
        if (layer.file === currentLayer.file) {
          layers[index] = { ...layers[index], fileUrl: uri }
        }
      })
      setLayersData([...layers]);

      let nextLayerIndex;

      if (layerIndex < layersData.length - 1)
        for (let i = layerIndex + 1; i < layers.length; i++) {
          if (layers[i].layerType == "file layer" && !layers[i].fileUrl) {
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
          (layer) => layer.file === fileId
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
      if (identifier === "Parcels" || identifier === "Area of Interest") {
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
              if (feature.hasOwnProperty('Geometry')) {
                return {
                  type: "Feature",
                  properties: feature,
                  geometry: JSON.parse(feature.Geometry)
                };
              } else if (feature.latitude && feature.longitude) {
                return {
                  type: "Feature",
                  properties: feature,
                  geometry: {
                    type: "Point",
                    coordinates: [
                      Number(feature.longitude),
                      Number(feature.latitude),
                    ],
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
                    coordinates: [
                      Number(feature.Longitude),
                      Number(feature.Latitude),
                    ],
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
      } else if (sourceId == "recentsub_permits_source") {
        // need to avoid auto clustering
        map.addSource(sourceId, {
          type: "geojson",
          data: geoJson
        });
      } else if (paintType === "circle" || paintType === "symbol") {
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


      if (sourceId === "parcels_source" || sourceId === "interests_source") {

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
          if (
            pointSourceData &&
            !deepEqualObjects(pointSource, pointSourceData)
          )
            map.getSource(`${sourceId}_point`).setData(pointSource);
        } else {
          map.addSource(`${sourceId}_point`, {
            type: "geojson",
            data: pointSource,
          });
        }
      }



      // if (map.getSource(`${sourceId}_filter`)) {
      //   let mapSourceFilterData = map.getSource(`${sourceId}_filter`)._data;
      //   if (
      //     mapSourceFilterData &&
      //     !deepEqualObjects(geoJson, mapSourceFilterData)
      //   )
      //     map.getSource(`${sourceId}_filter`).setData(geoJson);
      // } else {
      //   map.addSource(`${sourceId}_filter`, {
      //     type: "geojson",
      //     data: geoJson,
      //     // promoteId: "id",
      //   });
      // }

      // -> add layer
      const layerId = config.layerType === "file layer" ? config.identifier : prop.id;
      const visible = layerSettings.showable && layerSettings.visiable !== false;

      if (prop.paintProps) {
        Object.keys(prop.paintProps).forEach((key) => {
          if (prop.paintProps[key] === "#undefined") {
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
        if (map.getLayer(`${layerId}_point`)) {
          map.moveLayer(`${layerId}_point`);
          map.setLayoutProperty(
            `${layerId}_point`,
            "visibility",
            visible ? "visible" : "none"
          );
        }
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
        if (prop.filter) layerConfig.filter = prop.filter;
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

  // useEffect(() => {
  //   if (permitData && permitData.permits && permitData.permits.length > 0) {
  //     const nextOffset = permits.length + permitData.permits.length;
  //     setPermitData([...permits, ...permitData.permits]);
  //   }
  // }, [permitData]);

  useEffect(() => {
    if (
      permitRecentSubmittedData &&
      permitRecentSubmittedData.recent_submitted_permits &&
      permitRecentSubmittedData.recent_submitted_permits.length > 0
    ) {
      const nextOffset =
        recent_submitted_permits.length +
        permitRecentSubmittedData.recent_submitted_permits.length;
      setRecentSubmittedPermitData([
        ...recent_submitted_permits,
        ...permitRecentSubmittedData.recent_submitted_permits,
      ]);
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

    // WELL POINT CLICK FUNCTION 
    const wellPointClick = (feature) => {
      // this function is intended to organize the data 
      // when a well point is clicked 
      // and initiate the mapbox popup

      handleCloseExpandableCard()

      setStateApp((state) => ({
        ...state,
        selectedPermit: null,
        // popupOpen: false,
        // selectedUserDefinedLayer: null,
        // selectedParcel: null,
        // expandedCard: false,
      }));


      if (feature && feature.properties) {

        let properties = feature.properties;

        // tmp fix because it appears that the data coming back 
        // from contacts api is slightly different than other apis
        // need to setup in a standard format


        if (properties.id &&
          feature.layer.id !== "recent_submitted_permits" &&
          feature.layer.id !== "recent_submitted_permit_laterals"
        ) {

          setStateApp((state) => ({
            ...state,
            popupOpen: false,
            selectedUserDefinedLayer: null,
            selectedParcel: null,
            expandedCard: false,

          }));

          setStateApp((state) => ({
            ...state,
            selectedWellId: properties.id.toLowerCase(),
            wellSelectedCoordinates: [properties.longitude, properties.latitude],
          }));
        }
        else if (properties.Id &&
          (feature.layer.id === "recent_submitted_permits" ||
            feature.layer.id === "recent_submitted_permit_laterals")) {
          setStateApp((state) => ({
            ...state,
            popupOpen: false,
            selectedUserDefinedLayer: null,
            selectedParcel: null,
            expandedCard: false,
          }));
          setStateApp((state) => ({
            ...state,
            selectedPermitId: properties.Id.toLowerCase(),
            permitSelectedCoordinates: [properties.longitude, properties.latitude],
            expandedCard: false,
          }));
        }
      }
    };

    // AOI/Parcel Click Handler
    const udLayerClickHandler = (feature) => {
      const drawMode = stateApp.draw.getMode();
      if (drawMode.includes('draw') || drawMode.includes('drag')) {
        map.resize();
        return
      }
      setStateApp((state) => ({
        ...state,
        expandedCard: false,
        popupOpen: false,
      }));
      const filteredLayer = customLayerData?.allCustomLayers?.find(cl => cl._id === feature.properties.id);
      let selectedUserDefinedLayer;
      if (filteredLayer)
        selectedUserDefinedLayer = {
          ...feature,
          ...JSON.parse(filteredLayer.shape),
          id: filteredLayer._id,
        }

      if (feature.source === "parcels_source") {
        setStateApp((state) => {
          if (state.isDrawing) return state
          return {
            ...state,
            selectedUserDefinedLayer: null,
            selectedParcel: { ...feature.properties, feature: selectedUserDefinedLayer },
          }
        });
      }
      else if (feature.source === "interests_source" && !drawMode.includes('draw') && !drawMode.includes('drag')) {
        setStateApp((state) => {
          if (state.isDrawing) return state
          state = {
            ...state,
            showShapeActionsPopup: true,
            selectedUserDefinedLayer,
            selectedParcel: null,
            openDrawShapesControl: true,
          }
          drawBoundary(map, selectedUserDefinedLayer)
          if (!state.editDraw) {
            state = {
              ...state,
              showDrawShapesPopup: !state.showDrawShapesPopup,
              editDraw: true,
            }
          } else {
            state = {
              ...state,
              editDraw: false,
              currentFeature: undefined,
              isAbstractedLayersPolygon: false,
              multiSelectLandGrids: false,
              selectedAbstracts: [],
              showShapeActionsPopup: false,
              showDrawShapesPopup: false,
            }
          }
          return state
        });
      } else {
        // For user defined layers details popup
        let shapeCenter,
          featureLayer = { ...feature.layer, ...stateApp.layers.find(l => l.identifier === feature.layer.id) };
        if (
          (featureLayer.layerGeometry === 'LineString' && feature.geometry.type === 'LineString')
          || (featureLayer.layerGeometry === 'MultiLineString' && feature.geometry.type === 'LineString')
        ) {
          const lineLength = turf.length(feature.geometry, { units: 'miles' });
          const lineCenterGeometry = turf.along(feature.geometry, lineLength / 2, { units: 'miles' })
          shapeCenter = lineCenterGeometry.geometry.coordinates;
        } else if (
          (featureLayer.layerGeometry === 'Circle' && feature.geometry.type === 'MultiPolygon')
          || (featureLayer.layerGeometry === 'Point' && feature.geometry.coordinates.length === 2)
        ) {
          shapeCenter = feature.geometry.coordinates;
        } else {
          shapeCenter = polylabel(feature.geometry.coordinates);
        }
        selectedUserDefinedLayer = {
          ...feature,
          properties: {
            ...feature.properties,
            shapeCenter
          },
          layer: featureLayer,
          geometry: feature.geometry || feature._geometry
        }
        feature = selectedUserDefinedLayer;
        setStateApp((state) => {
          if (state.showDrawShapesPopup) return state
          state = {
            ...state,
            selectedUserDefinedLayer,
            selectedParcel: null
          }
          return state
        })
      }
      setStateApp((state) => {
        if (!state.showDrawShapesPopup || feature.source === "parcels_source" || feature.source === "interests_source")
          createUDPopUp(feature.properties);
        return state
      })
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

    /// FUNCTION FOR CTRL KEY PRESSED
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

      stateApp.layers?.forEach((layer) => {
        const interaction =
          layer.layerSettings.interaction.interactionAble &&
          layer.layerSettings.interaction.interactionDetail.click;
        const visible =
          layer.layerSettings.showable &&
          layer.layerSettings.visiable !== false;
        if ((interaction && visible) || (interaction && layer.layerType === 'file layer')) {
          if (layer.layerCategory === "UD layer") {
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
                  layer.identifier === "Parcels" ||
                  layer.identifier === "Area of Interest" ||
                  layer.identifier === "Tracked Wells" ||
                  layer.identifier === "Tracked Owners" ||
                  layer.identifier === "User Tags" ||
                  layer.identifier === "Search"
                )
                  layers.push(layerId);

                if (
                  layer.identifier === "Parcels" ||
                  layer.identifier === "Area of Interest"
                ) {
                  udLayers.push(layerId);
                }
              }
              if (map.getLayer(layer.identifier) && layer.layerType === 'file layer') {
                layers.push(layer.identifier);
                udLayers.push(layer.identifier);
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
            layerId === "wellpermitlines" ||
            layerId === "Parcels" ||
            layerId === "Area of Interest" ||
            layerId === "Tracked Wells" ||
            layerId === "Tracked Owners" ||
            layerId === "Tags Filter" ||
            layerId === "Search" ||
            layerId === "recent_submitted_permits" ||
            layerId === "recent_submitted_permit_laterals":
            // layerId === "permits":

            console.log('LAYER', layerId);
            wellPointClick(feature);
            break;
          default:
            break;
        }
      } else if (isNormalClick && features && features.length === 0) {
        switch (true) {
          case stateApp.selectedUserDefinedLayer !== null:
            setStateApp(stateApp => ({
              ...stateApp,
              selectedUserDefinedLayer: null
            }));
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
  }, [map, stateApp.layers, customLayerData, stateApp.selectedUserDefinedLayer]);

  useEffect(() => {
    let beforeLayer = null;
    if (stateApp.layers && stateApp.layers.length > 0 && map) {
      for (let i = 0; i < stateApp.layers.length; i++) {
        const layer = stateApp.layers[i];
        if (layer.layerType === "vector layer") {
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

              if (id === "basinLayer" || id === "GLOUnits" || id === "GLOLeases")
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
        } else if (layer.layerType === "data layer") {
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
              //this is permit layer based on WellDB data - hiding for now while we test RRC permit data layer
              // case "Recent Permits":
              //   data = permits;
              //   break;
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
        } else if (layer.layerType == "file layer") {
          let layerData = layersData.find((l) => l.file === layer.file);
          if (layerData.fileUrl) {
            if (layerData.layerPaintProps[0].sourceProps) {
              if (!map.getSource(layerData.layerPaintProps[0].sourceProps)) {
                map.addSource(layerData.layerPaintProps[0].sourceProps, {
                  type: "geojson",
                  data: layerData.fileUrl,
                });
              }
            }
            beforeLayer = setLayer(layerData.fileUrl, layer.identifier, map, beforeLayer);
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
    //permits,
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
      const layerId = layer.layerType == "file layer" ? layer.identifier : prop.id;
      if (map.getLayer(layerId)) map.removeLayer(layerId);

      if (prop.clusterProps) {
        if (map.getLayer(layerId + "-clusters-counts"))
          map.removeLayer(layerId + "-clusters-counts");

        if (map.getLayer(layerId + "-clusters"))
          map.removeLayer(layerId + "-clusters");
      }

      const layers = map.getStyle().layers
      // -> remove source
      const sourceId = prop.sourceProps;
      const sourceLayers = layers.filter((layer) => layer.source === sourceId)
      if (map.getSource(sourceId) && sourceLayers.length === 0) map.removeSource(sourceId);
      if (map.getSource(`${sourceId}_point`))
        map.removeSource(`${sourceId}_point`);
      if (map.getSource(`${sourceId}_filter`))
        map.removeSource(`${sourceId}_filter`);
    }
  };

  useEffect(() => {
    if (removeLayerFromMap && map) {
      removeLayerFromMap.forEach((layer) => {
        removeLayer(layer);
      })
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
        defaultOverride === true &&
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

      const getLayerBaseFilters = (filterLayer) => {
        let baseFilter;
        stateApp?.layers?.find(layer =>
          baseFilter = Array.isArray(layer?.layerPaintProps) && layer?.layerPaintProps?.find(layerPaintProp => layerPaintProp?.id === filterLayer)?.filter
        )
        return baseFilter || [];
      }

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
        ) {
          fitBounds = findBounds(formatIt(stateApp.wellListFromTagsFilter));
        }
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
          if (layer.visibility === "visible") {
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
              "wellpermitlines",
              "Tracked Wells",
              "Tracked Owners",
              "Tags Filter",
              //"permits",
              "recent_submitted_permits",
              "recent_submitted_permit_laterals",
              "rigs",
            ].indexOf(filterLayer) > -1
          ) {
            if (shapeList.length > 0) {
              const baseFilter = getLayerBaseFilters(filterLayer);

              if (!filterCustomArray[filterLayer]) {
                filterCustomArray[filterLayer] = baseFilter;
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
                      if (shapeList[k].type === "MultiPolygon" || shapeList[k].geometry.type === "MultiPolygon") {
                        let flagM = 0;
                        for (
                          let j = 0;
                          j < shapeList[k].geometry.coordinates.length;
                          j++
                        ) {
                          let filterCoordinates = shapeList[k].geometry.coordinates[j];
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
                        if (flagM === shapeList[k].geometry.coordinates.length) {
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
                    if (shapeList[i] && (shapeList[i].type === "MultiPolygon" || shapeList[i].geometry.type === "MultiPolygon")) {
                      for (
                        let j = 0;
                        j < shapeList[i].geometry.coordinates.length;
                        j++
                      ) {
                        let filterCoordinates = shapeList[i].geometry.coordinates[j];
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
          "wellpermitlines",
          "Tracked Wells",
          "Tracked Owners",
          "Tags Filter",
          //"permits",
          "recent_submitted_permits",
          "recent_submitted_permit_laterals",
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
          "wellpermitlines",
          "Tracked Wells",
          "Tracked Owners",
          "Tags Filter",
          //"permits",
          "recent_submitted_permits",
          "recent_submitted_permit_laterals",
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
          "wellpermitlines",
          "Tracked Wells",
          "Tracked Owners",
          "Tags Filter",
          //"permits",
          "recent_submitted_permits",
          "recent_submitted_permit_laterals",
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

      if (!deepEqualObjects(stateApp.fitBounds, fitBounds)) {
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
          "wellpermitlines",
          "Tracked Wells",
          "Tracked Owners",
          "Tags Filter",
          //"permits",
          "recent_submitted_permits",
          "recent_submitted_permit_laterals",
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
      if (Object.keys(filterCustomArray).length === 0 && clustersOff)
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
            if (f.type === "Feature") return f;
            return turf.feature(f);
          });
          return turf.combine(turf.featureCollection(data));
        };

        filterArray.unshift("all");

        //// start filtering

        var intersectingWellLinesFilter
        if (filterCustomArray["welllines"]) {
          var boundingMultiPoly = mergeIntoMultiPolygon(filterCustomArray["welllines"])
          var features = stateNav.filterIntersectingWellLines;

          // console.time(`booleanIntersects`);
          intersectingWellLinesFilter = features.reduce(
            function (memo, feature) {
              boundingMultiPoly?.features?.forEach(boundingPoly => {
                if (turf.booleanIntersects(feature.geometry, boundingPoly.geometry) &&
                  feature.properties.id) {
                  memo[2][1].push(feature.properties.id);
                }
              })
              return memo;
            },
            ['in', ["get", "id"], ["literal", []]]
          );
          // console.timeEnd(`booleanIntersects`);
        }

        var intersectingPermitLinesFilter
        if (filterCustomArray["recent_submitted_permit_laterals"]) {
          var boundingMultiPoly = mergeIntoMultiPolygon(filterCustomArray["recent_submitted_permit_laterals"])
          var features = stateNav.filterIntersectingWellLines;

          intersectingPermitLinesFilter = features.reduce(
            function (memo, feature) {
              boundingMultiPoly?.features?.forEach(boundingPoly => {
                if (turf.booleanIntersects(feature.geometry, boundingPoly.geometry) &&
                  feature.properties.Id) {
                  memo.push(feature.properties.Id);
                }
              })
              return memo;
            },
            ['in', "Id"]
          );
        }

        if (filterCustomArray["wellpoints"]) {
          map.setFilter("wellpoints", [
            ...filterArray,
            ["any",
              ["within", mergeIntoMultiPolygon(filterCustomArray["wellpoints"])],
              intersectingWellLinesFilter
            ]
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
            ["any",
              ["within", mergeIntoMultiPolygon(filterCustomArray["welllines"])],
              intersectingWellLinesFilter
            ]
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
          //"permits",
          "recent_submitted_permits",
          "recent_submitted_permit_laterals",
          "rigs",
        ];
        filterLayers.forEach((filterLayer) => {
          const baseFilter = getLayerBaseFilters(filterLayer);

          if (filterCustomArray[filterLayer]) {
            if (
              [
                "Tracked Wells",
                "Tracked Owners",
                "Tags Filter",
                //"permits",
                "rigs",
              ].indexOf(filterLayer) > -1
            ) {
              // const filterClusterLayer = filterLayer + "-clusters";
              // const filterClusterLayerLabel = filterLayer + "-clusters-counts";

              map.setFilter(filterLayer, ["all", baseFilter, [
                "within",
                mergeIntoMultiPolygon(filterCustomArray[filterLayer]),
              ]]);
            } else if (["recent_submitted_permits", "recent_submitted_permit_laterals"].indexOf(filterLayer) > -1) {
              map.setFilter(filterLayer, [
                "all",
                baseFilter,
                [
                  "any",
                  ["within", mergeIntoMultiPolygon(filterCustomArray[filterLayer])],
                  intersectingPermitLinesFilter
                ]
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
                    //"permits",
                    "recent_submitted_permits",
                    "recent_submitted_permit_laterals",
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
                map.setFilter(filterLayer, baseFilter);
                if (map.getLayer(filterLayer + "_point")) {
                  map.setFilter(filterLayer + "_point", null);
                }
                if (map.getLayer(filterLayer + "_labels")) {
                  map.setFilter(filterLayer + "_labels", null);
                }
                if (map.getLayer(filterLayer.replace("Labels", "s"))) {
                  map.setFilter(filterLayer.replace("Labels", "s"), baseFilter);
                }
                if (layer.type === "circle" && layer.id != "wellpoints") {
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
          if (filterCustomArray["basin"].length === 1) {
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
        map.setFilter("wellpoints", [
          "all",
          [
            "match",
            ["geometry-type"],
            ["Point"],
            true,
            false
          ]
        ]);

        map.setFilter("welllines",

          ["all", ["match", ["geometry-type"], ["LineString"], true, false],
            [
              "==",
              ["get", "isPermit"],
              false
            ],
            ["match", ["get", "id"], ["C253B19A-CA83-483B-978C-C1363D6C03A4"], false, true],
            ["match", ["get", "id"], ["D0CC0B42-8790-483E-91D7-230BE725D6BA"], false, true],
            ["match", ["get", "id"], ["876F6D08-65DB-4378-BA08-4C1EE41900E4"], false, true],
            ["match", ["get", "id"], ["5792E529-4786-4646-A44F-92251C7D246D"], false, true],
            ["match", ["get", "id"], ["47B20E91-85D1-45ED-9C91-6ACFCE230AF2"], false, true],
            ["match", ["get", "id"], ["B1DEB7C8-08FB-4677-A954-20BEEAC23EA2"], false, true],
            ["match", ["get", "id"], ["70401692-2BA5-44EF-9BDF-603F0BDB1B24"], false, true],
            ["match", ["get", "id"], ["512EA26E-64A7-4379-92CB-555C91DA6C59"], false, true],
            ["match", ["get", "id"], ["F566FCCB-44A4-492C-B2E2-A03DAD4B9B38"], false, true],
            ["match", ["get", "id"], ["86C906F1-B476-46FD-BEFA-D0D7F79AC138"], false, true],
            ["match", ["get", "id"], ["C8021CB9-D6D4-4536-97BE-6A0F741A3B27"], false, true],
            ["match", ["get", "id"], ["B1EE63A4-FB7F-488E-834A-C376EF3394EB"], false, true],
            ["match", ["get", "id"], ["443BDBEA-91E6-476F-B094-01750CA35143"], false, true],
            ["match", ["get", "id"], ["C23D6E43-55AF-4ADF-95A0-C70867452B75"], false, true],
            ["match", ["get", "id"], ["CDF47AC1-D065-42F5-AC02-60010BFDD038"], false, true],
            ["match", ["get", "id"], ["08F0369F-E7A8-4A2A-9F86-760C4B4C1DCA"], false, true],
            ["match", ["get", "id"], ["6C649EA6-D33C-45A9-BA0D-E12C0ADBF874"], false, true],
            ["match", ["get", "id"], ["63E0412E-48A2-4F58-A946-B4B7AB2893A9"], false, true],
            ["match", ["get", "id"], ["0EB4175B-2537-40DB-B1CE-50587146B470"], false, true],
            ["match", ["get", "id"], ["BA5D071F-C6E1-4D4B-BA40-B03B772892EC"], false, true],
            ["match", ["get", "id"], ["FA1A9281-9CAC-408D-9F8C-4FECDC802AE4"], false, true],
            ["match", ["get", "id"], ["23EFC62A-D19A-4658-BA04-AAC17787672D"], false, true],
            ["match", ["get", "id"], ["DB348CBD-F934-4A0D-BB00-1A9AAD1C3983"], false, true],
            ["match", ["get", "id"], ["7A96AD80-CF3D-4A41-832B-B0431309940C"], false, true],
            ["match", ["get", "id"], ["DC922D7F-DE5E-4F8C-8347-9D6977DA6858"], false, true],
            ["match", ["get", "id"], ["5768ED90-5CCE-4DCE-ABDB-6327B3E908A1"], false, true],
            ["match", ["get", "id"], ["397F6467-59F9-400F-9159-F29C91816D86"], false, true],
            ["match", ["get", "id"], ["50CA0097-3135-4025-AC56-A4671B4374FD"], false, true],
            ["match", ["get", "id"], ["0B26DADA-432D-4E27-8041-20646D13519D"], false, true],
            ["match", ["get", "id"], ["D29E31A1-F131-4861-BDC8-7A2485FC159D"], false, true],
            ["match", ["get", "id"], ["306A26DB-9ED6-4B02-9F3C-893B70133A6B"], false, true],
            ["match", ["get", "id"], ["D1C5CA5C-E038-49EF-BD41-958D707774C2"], false, true],
            ["match", ["get", "id"], ["EAF82C55-989D-4274-AF5A-E6EDEEFC3704"], false, true],
            ["match", ["get", "id"], ["C288EAAD-6CBF-4CDA-8848-C073F66E2EC0"], false, true],
            ["match", ["get", "id"], ["AC018673-4AD3-49CA-982A-6B333332038A"], false, true],
            ["match", ["get", "id"], ["46936EBA-07F4-4035-BD0C-6D858F9F1916"], false, true],
            ["match", ["get", "id"], ["0DD8CE30-F729-401C-9880-E4F3712CF7AC"], false, true],
            ["match", ["get", "id"], ["9BB66950-F8C6-4429-ACF3-3023876A9B0E"], false, true],
            ["match", ["get", "id"], ["C9076136-5D3B-4881-9F4C-C0DDCEBFBFAC"], false, true],
            ["match", ["get", "id"], ["84A33352-E9CF-4609-93A9-24C3488DD1B0"], false, true],
            ["match", ["get", "id"], ["EA165705-97D0-424C-8A10-985DD4035D67"], false, true],
            ["match", ["get", "id"], ["C633FEA5-747F-4286-965A-335B94D97B1D"], false, true],
            ["match", ["get", "id"], ["F2B626E0-DF49-4019-87B2-34596C900677"], false, true],
            ["match", ["get", "id"], ["EEC5CF89-8699-4567-8BE8-68C3033637EA"], false, true],
            ["match", ["get", "id"], ["40928C6C-5BD5-4AEC-BB35-9705160F1B04"], false, true],
            ["match", ["get", "id"], ["18ECD151-5E95-48A2-828E-D46C1F47B0DB"], false, true],
            ["match", ["get", "id"], ["BBE09BDB-802A-4EE0-80AF-FEADA620B7B3"], false, true],
            ["match", ["get", "id"], ["2E465812-15ED-4155-BE13-94DFE47733DF"], false, true],
            ["match", ["get", "id"], ["577BCCA1-BF4D-41E5-AAA8-35F045355430"], false, true],
            ["match", ["get", "id"], ["E92AF324-8E31-4AA5-8825-DA56724C1633"], false, true],
            ["match", ["get", "id"], ["23BC9CEF-B2DE-4FD4-BAC0-AB63BD14E557"], false, true],
            ["match", ["get", "id"], ["02A8BCD5-8C99-4295-AA31-8F386E1DC0CE"], false, true],
            ["match", ["get", "id"], ["87523186-BA21-4BAD-BC4B-5302036B2516"], false, true],
            ["match", ["get", "id"], ["B0397D95-7A5F-4C81-B04D-E1EFE2449829"], false, true],
            ["match", ["get", "id"], ["8CAF7172-15B7-4820-BF8F-F5F4C3587B9F"], false, true],
            ["match", ["get", "id"], ["E2F86C93-EBAF-4CB9-8E63-32D99B2C58B8"], false, true],
            ["match", ["get", "id"], ["69559B75-9B54-45E3-914D-C01A7B551163"], false, true],
            ["match", ["get", "id"], ["079B06C7-CDDA-4C9F-8296-096F009C470E"], false, true],
            ["match", ["get", "id"], ["AF3ED9A4-8EC8-4D3C-AF99-1730EDB7C7B4"], false, true],
            ["match", ["get", "id"], ["A4EF19CD-B1C6-4DFE-B091-99A14E766E0A"], false, true],
            ["match", ["get", "id"], ["A72FA644-0D66-417B-A7B1-6E82C9632941"], false, true],
            ["match", ["get", "id"], ["0A7674CD-F5EC-4D96-BCBC-7CC670F68A30"], false, true],
            ["match", ["get", "id"], ["A69893F1-645C-46DC-8AE2-373EB2B51FF2"], false, true],
            ["match", ["get", "id"], ["3B789EE4-DFEB-4313-8D50-B2CF37614460"], false, true],
            ["match", ["get", "id"], ["80A62E1E-4803-4D58-9FC6-1BE341B61971"], false, true],
            ["match", ["get", "id"], ["F44BCDA5-864B-4AD6-B44D-478CBB3E6063"], false, true],
            ["match", ["get", "id"], ["671B4343-F894-4643-8FAB-A5804248BA70"], false, true],
            ["match", ["get", "id"], ["B723FDEF-620D-4AD2-A0B6-B3FA070BF1F4"], false, true],
            ["match", ["get", "id"], ["4F7E1311-3709-4387-A436-FCB60E5DC7AB"], false, true],
            ["match", ["get", "id"], ["B63ED099-89B1-4473-B064-12175CB37BE3"], false, true],
            ["match", ["get", "id"], ["0AA70D05-BB5E-462F-BC4A-37AA67961E13"], false, true],
            ["match", ["get", "id"], ["0662E488-29E6-4BE3-849C-1EEACB168F93"], false, true],
            ["match", ["get", "id"], ["6A0B9223-60CC-421D-915F-27AE3B981977"], false, true],
            ["match", ["get", "id"], ["6B023AD5-CB6E-4D5E-962E-8B1DB1FE3301"], false, true],
            ["match", ["get", "id"], ["C415346E-A349-4B8C-B539-77991486AE0D"], false, true],
            ["match", ["get", "id"], ["BBA46756-3184-456A-8B93-DE739E106013"], false, true],
            ["match", ["get", "id"], ["C143C6B5-59D3-401C-8DF4-ECD062A8CF46"], false, true],
            ["match", ["get", "id"], ["E4811774-806D-4091-998A-4544F2FAD6D3"], false, true],
            ["match", ["get", "id"], ["94CAD835-06B7-4E18-B28A-34932267F592"], false, true],
            ["match", ["get", "id"], ["6A533E02-1620-449D-B30E-1EF193679BA6"], false, true],
            ["match", ["get", "id"], ["64E19B26-3FDD-425D-AF0D-BABCC65E8BB9"], false, true],
            ["match", ["get", "id"], ["658AAB7C-32F9-41C8-AE70-C2C8BBC7A18B"], false, true],
            ["match", ["get", "id"], ["1D75DBEB-8B20-4BE7-B470-08653830DC6F"], false, true],
            ["match", ["get", "id"], ["6C8B6552-79AC-4E6B-857E-EB6B4B427970"], false, true],
            ["match", ["get", "id"], ["A5259869-6782-4F9A-B83B-2474584C2DEC"], false, true],
            ["match", ["get", "id"], ["AFDAEFB2-6BAB-4FC8-8750-3BDAE8C7142D"], false, true],
            ["match", ["get", "id"], ["BE535FAE-E5C8-4827-A0F1-CCE0BB4B2265"], false, true],
            ["match", ["get", "id"], ["DFE4B47F-EE49-42EA-AE7F-6B89EAF9EF08"], false, true],
            ["match", ["get", "id"], ["51451D9C-31A1-4C5C-AF53-732F089A3B88"], false, true],
            ["match", ["get", "id"], ["935BA85B-5CD7-44FA-8AE3-EBC746CEAC2F"], false, true],
            ["match", ["get", "id"], ["51C7A5C5-F64B-4E80-A4D6-11A24D3A0E2D"], false, true],
            ["match", ["get", "id"], ["39F074BA-6D1D-49B8-9B6F-35AFF49EBD0D"], false, true],
            ["match", ["get", "id"], ["DFCFAA04-804F-4DEC-94C1-0238194065AA"], false, true],
            ["match", ["get", "id"], ["8BFF654B-05D9-4127-8CB3-125C9468D825"], false, true],
            ["match", ["get", "id"], ["00C15654-93A1-4745-9046-5F598CB33453"], false, true],
            ["match", ["get", "id"], ["E662B388-415D-41BA-B6A0-00344887191B"], false, true],
            ["match", ["get", "id"], ["13D49226-76F8-4152-BF70-F80153A002B3"], false, true],
            ["match", ["get", "id"], ["69BC09BD-46CC-4D00-89A3-2E8177BECF33"], false, true],
            ["match", ["get", "id"], ["B9F36B30-F79B-43FD-A787-DAA9273E232E"], false, true],
            ["match", ["get", "id"], ["53A4430B-C239-4397-9C32-274ADB6647D4"], false, true],
            ["match", ["get", "id"], ["0812E9D0-2C73-4D2E-AA6A-87E825F4A336"], false, true],
            ["match", ["get", "id"], ["75FC6B99-4439-4109-8026-767F75688990"], false, true],
            ["match", ["get", "id"], ["B5C45DD6-FDB9-4871-8E49-3327718CADB1"], false, true],
            ["match", ["get", "id"], ["5A6A3866-EE02-41E1-B1FC-AE4CC66154A9"], false, true],
            ["match", ["get", "id"], ["7F7F5E31-4CD0-48F1-9DB4-328411F9E953"], false, true],
            ["match", ["get", "id"], ["C59A5E66-3F4B-4D5F-96C2-B2951492C589"], false, true],
            ["match", ["get", "id"], ["1AE6148A-1643-4A86-B706-CD10A11E2FA1"], false, true],
            ["match", ["get", "id"], ["C2D0C3B4-8C90-451E-977F-EC6A18BAB510"], false, true],
            ["match", ["get", "id"], ["0C79EDFF-4D50-40D7-B464-32E5B70E3F7E"], false, true],
            ["match", ["get", "id"], ["B65E110E-88D0-4100-8089-92D6C2987EB7"], false, true],
            ["match", ["get", "id"], ["F36CC4A1-D516-402D-843F-5A0D37B8DCF4"], false, true],
            ["match", ["get", "id"], ["236CDD41-0CCF-4DBF-8321-7F7968B4A47A"], false, true],
            ["match", ["get", "id"], ["62ED58DE-D8F1-46DC-B404-E3D88ABD2047"], false, true],
            ["match", ["get", "id"], ["BF32190E-9E43-473D-BD36-3C4F5F12A5C0"], false, true],
            ["match", ["get", "id"], ["9CDABF08-B818-4455-B4E7-0B940F8E8617"], false, true],
            ["match", ["get", "id"], ["E9E5F60D-74D4-428B-8584-2EE7C08E0DD2"], false, true],
            ["match", ["get", "id"], ["2A4B1979-2DBA-415B-95C3-F993B15F5D20"], false, true],
            ["match", ["get", "id"], ["2B26E8C6-4285-498C-B782-495FC1FBE803"], false, true],
            ["match", ["get", "id"], ["2649E31A-BCED-4B73-9D9F-E96744B7BDB8"], false, true],
            ["match", ["get", "id"], ["F3CBC636-7553-4537-AAF8-9EB70EC2C0FF"], false, true],
            ["match", ["get", "id"], ["7104B0AB-5325-4549-BA93-D86E261949CE"], false, true],
            ["match", ["get", "id"], ["11028C0A-9FA0-490F-B088-55B52C9EA358"], false, true],
            ["match", ["get", "id"], ["C4BA0D12-66E9-48CA-B21B-3D195F500353"], false, true],
            ["match", ["get", "id"], ["6D81E902-27DE-4E57-B75B-6FDD786004BA"], false, true],
            ["match", ["get", "id"], ["E3742328-E112-49A7-9330-62C97F6F005A"], false, true],
            ["match", ["get", "id"], ["586FF467-6DFC-43DA-B422-4951B072DCD7"], false, true],
            ["match", ["get", "id"], ["930002D5-A4F7-49C7-948E-5A0651EE9B13"], false, true],
            ["match", ["get", "id"], ["120BEFB6-30CE-4606-B3B8-C52C38F93B1A"], false, true],
            ["match", ["get", "id"], ["CEA74AC7-1E5F-40B4-90FB-1D11A77BC918"], false, true],
            ["match", ["get", "id"], ["7A824975-43F3-4262-867F-9C0656BDFC19"], false, true],
            ["match", ["get", "id"], ["B2FE6A64-503D-42D6-A5B4-9E9B441D6610"], false, true],
            ["match", ["get", "id"], ["09CE43F9-F78D-4DC1-822D-D57FD79ACEA9"], false, true],
            ["match", ["get", "id"], ["58443A7E-6504-495F-846C-96A10EFC0F01"], false, true],
            ["match", ["get", "id"], ["E5955413-2ECE-4342-ACEC-92A6E74E7C68"], false, true],
            ["match", ["get", "id"], ["AC03525F-A6F9-45F2-83A7-4B32D43F080C"], false, true],
            ["match", ["get", "id"], ["D5C7C236-C5B7-40D0-BE0B-4E4B8BCE5715"], false, true],
            ["match", ["get", "id"], ["B4186ECC-8149-413B-923B-3E1A083AA3B4"], false, true],
            ["match", ["get", "id"], ["F5FE7A48-6DB7-4E19-A632-6A82217027B1"], false, true],
            ["match", ["get", "id"], ["AD5D29FF-A6DB-443B-9F50-384B83EF50F7"], false, true],
            ["match", ["get", "id"], ["43961AEF-BA12-438C-9C92-6C3CEB2BA456"], false, true],
            ["match", ["get", "id"], ["D5D042C9-DDE8-48E4-82DD-5F91C22F2F6D"], false, true],
            ["match", ["get", "id"], ["080C0A23-E0EC-42DB-B797-EDD300A67B77"], false, true],
            ["match", ["get", "id"], ["20B7B70B-2C60-4D85-99EC-981FDF31FCF7"], false, true],
            ["match", ["get", "id"], ["D8BC871E-24D2-4E46-8EC1-44D575B84E72"], false, true],
            ["match", ["get", "id"], ["F5A60A11-521D-46C0-81CF-3086AE961588"], false, true],
            ["match", ["get", "id"], ["FA0030D3-F1D9-40D5-B13F-7E5BEE983461"], false, true],
            ["match", ["get", "id"], ["9E927CA9-BFF3-4C89-9FAB-6FD455A3424C"], false, true],
            ["match", ["get", "id"], ["83FDBD86-8DF5-431C-985C-DAFFC32DB8CE"], false, true],
            ["match", ["get", "id"], ["855AFB03-85CA-490E-A2E0-EB74AD1E1437"], false, true],
            ["match", ["get", "id"], ["C7F954E1-95B3-48BE-A3E1-280A2C77B2E1"], false, true],
            ["match", ["get", "id"], ["65509D58-0926-4440-A693-EAC664361C4B"], false, true],
            ["match", ["get", "id"], ["2E11E1C2-06AD-41E7-BC93-279AB31E5BC2"], false, true],
            ["match", ["get", "id"], ["42200166-644A-4BD2-9AE3-B553AD7CF384"], false, true],
            ["match", ["get", "id"], ["0BD2EAE6-705E-4241-802F-5D7749B287D7"], false, true],
            ["match", ["get", "id"], ["ED8301A6-51FD-4FE7-826A-0E3A75AE3741"], false, true],
            ["match", ["get", "id"], ["9128C39A-414F-472B-B090-4E1694E74DC0"], false, true],
            ["match", ["get", "id"], ["A573E78B-BBCC-4E33-8590-7E1E4243C3EE"], false, true],
            ["match", ["get", "id"], ["FC5CA6B7-4F1D-4D92-A7F8-C818AB026F4E"], false, true],
            ["match", ["get", "id"], ["232413F2-9EC5-48B8-BE8B-4971FB87DA4D"], false, true],
            ["match", ["get", "id"], ["65FA804F-AC14-4E3C-BE94-6B7E40AFCF06"], false, true],
            ["match", ["get", "id"], ["0D513307-8538-40D5-A6C6-DC320B753F98"], false, true],
            ["match", ["get", "id"], ["BA35AA13-B521-45BA-BFC2-8E04CFA73FDE"], false, true],
            ["match", ["get", "id"], ["9207FE2F-68F6-4EAD-B667-54CCCDB4995E"], false, true],
            ["match", ["get", "id"], ["A6F89F31-1E80-45D7-BC0C-1A489E98B3BE"], false, true],
            ["match", ["get", "id"], ["37CC19B5-E7C0-41D5-8D66-A0B4F647C30F"], false, true],
            ["match", ["get", "id"], ["B6B912EB-EA34-45B1-B967-A5DC5A8975AF"], false, true],
            ["match", ["get", "id"], ["22BB69DD-CF0E-461A-9E55-63596CC6E292"], false, true],
            ["match", ["get", "id"], ["84920FEB-079E-460C-8D79-201D08B95B2F"], false, true],
            ["match", ["get", "id"], ["E5B17303-395A-4A14-B0A4-340B030D4AD6"], false, true],
            ["match", ["get", "id"], ["C9941347-56DC-4619-8978-63C1DFA71348"], false, true],
            ["match", ["get", "id"], ["20BEFAED-0617-42D1-9683-84A3AD95FBF9"], false, true],
            ["match", ["get", "id"], ["4977171D-82D1-46AF-BC6E-D87B675B99E6"], false, true],
            ["match", ["get", "id"], ["D0292F2F-2DFA-47DA-ABE1-C3C233AA45FC"], false, true],
            ["match", ["get", "id"], ["6435D533-8835-462F-8DBB-3016CF41719D"], false, true],
            ["match", ["get", "id"], ["56C53E53-F620-43AD-8FCB-C9A37C42DDC4"], false, true],
            ["match", ["get", "id"], ["10437258-EE2B-48D8-9C3C-36D4D4CAE247"], false, true],
            ["match", ["get", "id"], ["0DDD27B8-BA7C-4C76-AECD-B625E1A65C65"], false, true],
            ["match", ["get", "id"], ["B03E4FDC-42B6-495A-BE0E-B1CAEFB58D14"], false, true],
            ["match", ["get", "id"], ["2005EB9B-FC09-439B-A701-983C77534150"], false, true],
            ["match", ["get", "id"], ["69F63FEC-E7FB-4409-A01E-A37695A3A13C"], false, true],
            ["match", ["get", "id"], ["4F7217A3-44DC-4DEE-B70A-91459189736D"], false, true],
            ["match", ["get", "id"], ["29BEA715-D42B-45F7-A358-8E2369BA02C9"], false, true],
            ["match", ["get", "id"], ["62E8AB4E-AE0E-49F8-A684-C4767564F081"], false, true],
            ["match", ["get", "id"], ["ABD30623-669E-4E8E-B540-D3CB98AE332B"], false, true],
            ["match", ["get", "id"], ["7BFE2093-2378-44CE-A110-FB9379AF0FA9"], false, true],
            ["match", ["get", "id"], ["9C8C26F8-C11F-4EE8-9E7F-1D95D5AC0D96"], false, true],
            ["match", ["get", "id"], ["11107FCB-FEE0-44B6-8E86-2DABC263C1C2"], false, true],
            ["match", ["get", "id"], ["56865607-FBCB-4D17-B0A8-7E31BC60D618"], false, true],
            ["match", ["get", "id"], ["D1EB3570-2B77-48D5-95EF-EC13F0C28F9B"], false, true],
            ["match", ["get", "id"], ["D96F1A31-D9E0-4E2A-AA79-2666DCB000C7"], false, true],
            ["match", ["get", "id"], ["004192A8-F14C-4125-B9FC-006BBE37BC19"], false, true],
            ["match", ["get", "id"], ["EA9B6F6D-4421-4546-B0BD-E40AB6C4C991"], false, true],
            ["match", ["get", "id"], ["DE18E236-B0C7-4968-BE73-BB3CF728D1EB"], false, true],
            ["match", ["get", "id"], ["CB6485F9-2153-4CC2-BF0E-602E3F57DAC9"], false, true],
            ["match", ["get", "id"], ["64821BE3-2F85-4F7E-897D-8159FAB0A3B6"], false, true],
            ["match", ["get", "id"], ["59C005BE-17E0-4273-B53F-ECFFA6445374"], false, true],
            ["match", ["get", "id"], ["B7AA394F-4603-44EC-BB22-9D464FE229B8"], false, true],
            ["match", ["get", "id"], ["89E1B503-79F5-4412-BECC-B42221A50BE8"], false, true],
            ["match", ["get", "id"], ["202606FA-73DE-4695-935B-C4284197EEB1"], false, true],
            ["match", ["get", "id"], ["AFAA909B-08B8-4F19-AFF2-C55B5731BB25"], false, true],
            ["match", ["get", "id"], ["89751030-4971-4A17-8370-DB048A603A0C"], false, true],
            ["match", ["get", "id"], ["0F164CD1-5C4B-416F-A611-EA09F3E1989A"], false, true],
            ["match", ["get", "id"], ["812F2D00-319E-45AB-81F7-4479C507A57D"], false, true],
            ["match", ["get", "id"], ["99D6B8F8-5DB0-4FCF-BABE-AADCCD6C59B4"], false, true],
            ["match", ["get", "id"], ["88765D1F-A80F-4CF7-B2F1-605273976D2B"], false, true],
            ["match", ["get", "id"], ["775B3A74-F4DB-454A-820C-50A3279E86A5"], false, true],
            ["match", ["get", "id"], ["3D402CD2-0324-47D3-8240-65011D91B407"], false, true],
            ["match", ["get", "id"], ["F439CD1C-533A-437D-B991-F4B5EC2FA3AD"], false, true],
            ["match", ["get", "id"], ["7E6EEA00-A035-41D0-BDB8-79EB9EFE3806"], false, true],
            ["match", ["get", "id"], ["A11D95D3-EDC7-4FB1-976A-3B3488904EC7"], false, true],
            ["match", ["get", "id"], ["61C880F7-0E68-45B2-BBF8-F4A98D256C80"], false, true],
            ["match", ["get", "id"], ["21E84E06-C67B-4EF0-B591-75300D6D3B77"], false, true],
            ["match", ["get", "id"], ["588CF2BA-4EAE-487E-9F05-998DB0F2EA04"], false, true],
            ["match", ["get", "id"], ["E4D14C93-81D2-4376-874E-1C98F45F3F64"], false, true],
            ["match", ["get", "id"], ["3C75D34F-2FC2-4AC1-B81F-F969CEC9CB03"], false, true],
            ["match", ["get", "id"], ["DAFF2229-F3EB-44FE-A5B3-AAFDD443103A"], false, true],
            ["match", ["get", "id"], ["9BB0B5C8-F854-4BC1-B58A-499B24BBBCBE"], false, true],
            ["match", ["get", "id"], ["681CD168-6333-4BE3-8D9F-ECB5A8A0B739"], false, true],
            ["match", ["get", "id"], ["32355EC5-2D6F-408C-8875-4D2DD2BA3117"], false, true],
            ["match", ["get", "id"], ["C425F616-16B7-4CF0-B628-F52DD886D7E0"], false, true],
            ["match", ["get", "id"], ["BF1EB387-4AEE-4B7C-92BA-4BAAD365B7F2"], false, true],
            ["match", ["get", "id"], ["07420A20-6E2D-4E58-BD99-34244988AD58"], false, true],
            ["match", ["get", "id"], ["64323EA2-BFFB-4F97-83F2-EDD9C48CFBFF"], false, true],
            ["match", ["get", "id"], ["2C4B7874-0C28-49CE-AB5D-E5BF8FA5927D"], false, true],
            ["match", ["get", "id"], ["8B8EECB1-0D38-46D3-BAC5-0CEFD4046ACE"], false, true],
            ["match", ["get", "id"], ["E61A87B3-F093-4EC7-ACE0-15E05DD05E72"], false, true],
            ["match", ["get", "id"], ["51AD3728-344C-4398-A534-9EF80D40A146"], false, true],
            ["match", ["get", "id"], ["B7776A14-1C7D-430A-AC5E-C7D91BECA3FE"], false, true],
            ["match", ["get", "id"], ["773903F4-2E51-420D-85AE-7F7E3014525C"], false, true],
            ["match", ["get", "id"], ["6DAFF8C4-D4E9-4D0C-88F1-1A5EE30D2502"], false, true],
            ["match", ["get", "id"], ["597DFC24-B25C-46E8-99B7-458ACE57D8B2"], false, true],
            ["match", ["get", "id"], ["351CA621-4551-485C-B2BB-6133013740F9"], false, true],
            ["match", ["get", "id"], ["082F7FB3-2DAA-4050-B9D3-D1A8EF5377F8"], false, true],
            ["match", ["get", "id"], ["0C7DC1C3-B6EA-4156-A7BB-1AAB1FD345BB"], false, true],
            ["match", ["get", "id"], ["8B9BA390-FA35-404D-BC70-09CFF0D33715"], false, true],
            ["match", ["get", "id"], ["6FEF9382-6DD7-4901-A324-C02D589D1C8A"], false, true],
            ["match", ["get", "id"], ["00141118-E62C-4A92-BBDE-4B1FE762B9A5"], false, true],
            ["match", ["get", "id"], ["AAC2A191-370B-4A4D-9F87-1A59DEC6CCED"], false, true],
            ["match", ["get", "id"], ["A8EA00EB-F9CC-41FF-9179-3FBDF64733DE"], false, true],
            ["match", ["get", "id"], ["111E0579-B62E-43A0-AB11-5C80311BDF1E"], false, true],
            ["match", ["get", "id"], ["CAEFF155-0DE3-4DA9-BFF8-1041789143E9"], false, true],
            ["match", ["get", "id"], ["BABD7237-EC40-4071-B28B-6AF769A6265A"], false, true],
            ["match", ["get", "id"], ["FB4E8486-D27B-44C3-AC40-9708089618C2"], false, true],
            ["match", ["get", "id"], ["F25AF62B-8D78-4759-A539-8E7FD0ECA46C"], false, true],
            ["match", ["get", "id"], ["65677510-F179-4428-9BE7-A5C07D1CE20E"], false, true],
            ["match", ["get", "id"], ["3CCE0D3A-02BE-4F0B-9FF5-FB49280F85D6"], false, true],
            ["match", ["get", "id"], ["8D230361-5D6A-4AAA-B5F4-408C877CD1B1"], false, true],
            ["match", ["get", "id"], ["E8AC0310-9C61-4F24-B8D1-7AA311E5FEC1"], false, true],
            ["match", ["get", "id"], ["ED34EEC7-13EC-4834-ACA1-6FD130B83032"], false, true],
            ["match", ["get", "id"], ["ADFCE316-DEDC-41B4-8CEE-43C4BF96A74C"], false, true],
            ["match", ["get", "id"], ["98AC2147-33F1-474F-A06F-047D372B7DDE"], false, true],
            ["match", ["get", "id"], ["B3F8F490-FB33-40AA-B0C1-317E7CA2B6F2"], false, true],
            ["match", ["get", "id"], ["E98B1056-58CD-46D4-9233-FDC01073E1B7"], false, true],
            ["match", ["get", "id"], ["3C300D2F-BC1C-4513-A7EA-CDED8137ED8B"], false, true],
            ["match", ["get", "id"], ["8CEF6D8E-1AD4-4615-9EB6-A0D040B10FBF"], false, true],
            ["match", ["get", "id"], ["3C7005D0-B8F1-48FB-BEDE-B1383F26E91D"], false, true],
            ["match", ["get", "id"], ["C6B5F66A-E7F1-4A48-BE72-6D1E04905CCF"], false, true],
            ["match", ["get", "id"], ["6EEE92B2-4728-4BDA-B8DB-30D05A489345"], false, true],
            ["match", ["get", "id"], ["E589D934-DCC1-4B8A-A815-3CFF2F2E5B05"], false, true],
            ["match", ["get", "id"], ["44872E3C-0BC3-4E08-95E6-9ACA3C2561C6"], false, true],
            ["match", ["get", "id"], ["E64CA650-A43E-4264-858C-298DC7871C39"], false, true],
            ["match", ["get", "id"], ["D6B29ACD-3164-4B45-96FC-C2E94851F74E"], false, true],
            ["match", ["get", "id"], ["2ABE8143-AD1C-49EC-ABC2-8C74DA1B6690"], false, true],
            ["match", ["get", "id"], ["63C0EA36-9DEA-4221-93DD-194E2B649477"], false, true],
            ["match", ["get", "id"], ["1795BAC1-BE8C-4823-AB97-703CC62B027B"], false, true],
            ["match", ["get", "id"], ["282A0A2A-B108-4340-8A80-EEDAFB0717A6"], false, true],
            ["match", ["get", "id"], ["8B67F0B3-AB1C-4DB4-8DFB-8C474DD90834"], false, true],
            ["match", ["get", "id"], ["7FB4CC39-F904-4C65-A6D3-B26690BC6CBB"], false, true],
            ["match", ["get", "id"], ["5A1F23CF-4E7A-4434-A5F1-5423668745F8"], false, true],
            ["match", ["get", "id"], ["024EE593-C3C1-4B3B-93D7-E2E883F8F37A"], false, true],
            ["match", ["get", "id"], ["3039D89F-813F-46ED-90CB-A85D236491A6"], false, true],
            ["match", ["get", "id"], ["059A4E04-AF35-4997-A8F7-59AD776016F3"], false, true],
            ["match", ["get", "id"], ["41E02AE3-BB19-44A0-994E-382AE1B36950"], false, true],
            ["match", ["get", "id"], ["416188FD-37D2-4653-8873-1BBDB4F300C1"], false, true],
            ["match", ["get", "id"], ["308BCAB2-138B-42E3-A979-98AB76D32FCB"], false, true],
            ["match", ["get", "id"], ["BE1BD9AE-172E-4D49-96CF-80B1D5B6B454"], false, true],
            ["match", ["get", "id"], ["D45584DF-78BE-4F55-B1BE-375A3218C205"], false, true],
            ["match", ["get", "id"], ["90904A00-FC5D-4EA6-948F-72143DC95C48"], false, true],
            ["match", ["get", "id"], ["F97D6D2D-37AE-4928-A9BF-9DA9D760329D"], false, true],
            ["match", ["get", "id"], ["4393045C-3E32-4919-BAEE-29BA1D0B4C5E"], false, true],
            ["match", ["get", "id"], ["F3F65C44-2A80-4E06-AAFB-690BB9682137"], false, true],
            ["match", ["get", "id"], ["528438CE-9561-43F5-BD9E-F5951121173F"], false, true],
            ["match", ["get", "id"], ["B03B7139-A706-4A1F-A52F-A8934E8E9EA3"], false, true],
            ["match", ["get", "id"], ["1D9BEDEE-2B14-4BE5-ACA1-3F12D1256AAB"], false, true],
            ["match", ["get", "id"], ["7D525447-3731-4FAE-B4FF-9DADB61DDC39"], false, true],
            ["match", ["get", "id"], ["D72B1980-1B29-4734-8C64-2EB277C48667"], false, true],
            ["match", ["get", "id"], ["3166CF27-1F17-4921-9D0A-ADAD0F5ADAAC"], false, true],
            ["match", ["get", "id"], ["F34DF418-51F4-4831-906B-1A3195A26BF3"], false, true],
            ["match", ["get", "id"], ["4294565A-8BD3-40C2-8A86-AF12BF781480"], false, true],
            ["match", ["get", "id"], ["5988A3D0-CDA3-4D48-8E38-CD039114A142"], false, true],
            ["match", ["get", "id"], ["839432D0-7E2F-4E9B-9109-6F5B3118B569"], false, true],
            ["match", ["get", "id"], ["451BE18D-9884-4635-8947-D0C8D9D6A92D"], false, true],
            ["match", ["get", "id"], ["D57E2E52-1004-470E-9440-6D9E1D348B35"], false, true],
            ["match", ["get", "id"], ["B30E40EE-0E41-4578-8383-FF7D420F7907"], false, true],
            ["match", ["get", "id"], ["68FE3832-A68F-4512-A598-ACBDD59F3F8B"], false, true],
            ["match", ["get", "id"], ["96E15C03-2F66-4E5D-8145-27A96D738630"], false, true],
            ["match", ["get", "id"], ["BD3EBE06-C9F8-4199-A2B3-D10C4CEC2C8F"], false, true],
            ["match", ["get", "id"], ["C35081AE-4688-4F0A-9A53-52CDEF7815D1"], false, true],
            ["match", ["get", "id"], ["F8852200-D4F1-45C6-ACA9-200BE44A6DFF"], false, true],
            ["match", ["get", "id"], ["7E238BD4-8411-4A42-96FD-6BB28AAB343D"], false, true],
            ["match", ["get", "id"], ["F2FD69AD-E7CB-45AC-B26F-B9770905ADC1"], false, true],
            ["match", ["get", "id"], ["6ECB446F-3EAD-4E27-A4F5-3EE28A5032C1"], false, true],
            ["match", ["get", "id"], ["6F3422B5-339C-478F-96A5-04D73811C533"], false, true],
            ["match", ["get", "id"], ["CABFB2C8-7D59-48EA-9655-212CE55A3B64"], false, true],
            ["match", ["get", "id"], ["FD4E00E6-7CDF-4480-B422-EEE0F82074E9"], false, true],
            ["match", ["get", "id"], ["8C74618C-0182-4152-A50B-6D7CBF43A7C3"], false, true],
            ["match", ["get", "id"], ["23435F14-C4E3-409F-94BD-4E3CED2E24F7"], false, true],
            ["match", ["get", "id"], ["5BE7757C-DD86-4301-86D5-236D236A3EC1"], false, true],
            ["match", ["get", "id"], ["4D81DCE0-BD26-402D-9715-74EBB43F314B"], false, true],
            ["match", ["get", "id"], ["979E9B43-E0F2-4A92-8245-B683EEF3AFBF"], false, true],
            ["match", ["get", "id"], ["8480B7BD-42F0-45AD-9892-00B9120DC339"], false, true],
            ["match", ["get", "id"], ["DDB89762-AE40-451F-B051-4C34EFEC58DC"], false, true],
            ["match", ["get", "id"], ["8C82E46E-2A1F-46BA-80D7-5FAEF62D28D3"], false, true],
            ["match", ["get", "id"], ["2BFDD184-D5A0-46C1-A724-F41BEE2E730B"], false, true],
            ["match", ["get", "id"], ["F594397A-1087-4801-8480-BEAA4702C536"], false, true],
            ["match", ["get", "id"], ["A50300F8-A823-49E3-BFBE-16420B8366C9"], false, true],
            ["match", ["get", "id"], ["554E7F49-5C55-4FA6-9931-80155EF78F01"], false, true],
            ["match", ["get", "id"], ["238BDF06-D086-4A05-8E63-0911F61CE72F"], false, true],
            ["match", ["get", "id"], ["1154DD25-F332-4DFC-9D70-8F205EFF2E5A"], false, true],
            ["match", ["get", "id"], ["FFA46387-FFCF-4CE5-9763-4D68C3EA97AB"], false, true],
            ["match", ["get", "id"], ["1B178A31-AE49-42CA-A4DE-61F4581F5553"], false, true],
            ["match", ["get", "id"], ["7B790196-56E9-4914-8AED-794A9AE71FD0"], false, true],
            ["match", ["get", "id"], ["1E96B167-39EA-4FBC-91E0-02DC01810680"], false, true],
            ["match", ["get", "id"], ["D156F107-A1BF-45A6-931F-74D88F5D8991"], false, true],
            ["match", ["get", "id"], ["E5455DDA-9C44-4B2F-8BEB-07296634A0E7"], false, true],
            ["match", ["get", "id"], ["DD0877D6-639A-4956-A55F-907740D5C3F7"], false, true],
            ["match", ["get", "id"], ["37368176-49DA-4221-92F0-ED69F8486603"], false, true],
            ["match", ["get", "id"], ["CCD6B5CF-7AAC-4841-B673-5D170A2BF090"], false, true],
            ["match", ["get", "id"], ["C16C21F9-9248-47F8-BF68-997EE32805BD"], false, true],
            ["match", ["get", "id"], ["623A84C3-B809-44E9-BB86-64DB99C1C661"], false, true],
            ["match", ["get", "id"], ["6FD4620B-347B-4ED4-9A2E-88DCE027E2E2"], false, true],
            ["match", ["get", "id"], ["515E8F10-7E10-4107-91B1-8AD6CBE77983"], false, true],
            ["match", ["get", "id"], ["EC445AA1-750A-42D9-A72B-67AB530E6C21"], false, true],
            ["match", ["get", "id"], ["0E0E671E-8C43-4A62-BB4C-D7605A9CB4D6"], false, true],
            ["match", ["get", "id"], ["CB347A2D-669D-4275-ADFA-B28D7A9065C8"], false, true],
            ["match", ["get", "id"], ["EC56B4D7-4215-4D6F-AF19-1EA4F480E1FF"], false, true],
            ["match", ["get", "id"], ["170AF6A7-6A11-4C71-ACCF-758977000C79"], false, true],
            ["match", ["get", "id"], ["353BBB42-29DD-458D-821A-883A3B962993"], false, true],
            ["match", ["get", "id"], ["E5047FF5-A56A-4105-8B6E-7F70424B5615"], false, true],
            ["match", ["get", "id"], ["B66068A3-D108-4546-BD3F-446F79891ED9"], false, true],
            ["match", ["get", "id"], ["B627E2C0-E8AA-4FF6-9361-EAE726881165"], false, true],
            ["match", ["get", "id"], ["521C58BA-50B0-46B9-A75C-5DD065677348"], false, true],
            ["match", ["get", "id"], ["E49C7C48-C967-4DEE-B9C8-DA13400830E1"], false, true],
            ["match", ["get", "id"], ["40970887-1923-4E5F-8FE6-EA8B9F34E1EA"], false, true],
            ["match", ["get", "id"], ["3191019B-E882-4AEA-A2A6-22B1D11673AA"], false, true],
            ["match", ["get", "id"], ["6A6792C6-6FE7-467E-A0F5-6204F8AEA4B1"], false, true],
            ["match", ["get", "id"], ["939CA667-1F38-4CBC-8A10-68862F52BE7B"], false, true],
            ["match", ["get", "id"], ["5FA03AA9-F24F-4DB8-9EED-7FA67E917945"], false, true],
            ["match", ["get", "id"], ["F118DFA6-5FCF-426C-B4C1-15BBBBEC8631"], false, true],
            ["match", ["get", "id"], ["31B8C3A9-7FF4-4454-9D97-6D9B62D503A7"], false, true],
            ["match", ["get", "id"], ["42707B20-DFEF-48D3-B978-95921145CA80"], false, true],
            ["match", ["get", "id"], ["846488A4-5C74-4E38-9C5C-A7AA83BB4C83"], false, true],
            ["match", ["get", "id"], ["692DDC4B-669C-4E6D-AA7E-2F04AB4C78AF"], false, true],
            ["match", ["get", "id"], ["5C11E84F-5557-473C-8B5B-805D66E48373"], false, true],
            ["match", ["get", "id"], ["6B3133CC-4C27-41BA-A5E1-E553D342E36D"], false, true],
            ["match", ["get", "id"], ["29D8DAE1-074F-4FA1-9632-19B0075780AC"], false, true],
            ["match", ["get", "id"], ["F84FABE0-2375-45BC-8A2B-7EB4F5DA819F"], false, true],
            ["match", ["get", "id"], ["E3C621B1-0C21-4ADC-8DFA-E05605661652"], false, true],
            ["match", ["get", "id"], ["864DDA9E-C8F1-43DC-8EB2-AB49D03A01F4"], false, true],
            ["match", ["get", "id"], ["1B5DDF47-3D98-45F4-81E2-45668CC3A26B"], false, true],
            ["match", ["get", "id"], ["3B632B88-256D-4222-B82E-F14BAB8F3C5F"], false, true],
            ["match", ["get", "id"], ["5D45F3EA-979C-447B-9424-861D8586D561"], false, true],
            ["match", ["get", "id"], ["57D8A98E-E635-47FD-9863-2C0C1865CEA0"], false, true],
            ["match", ["get", "id"], ["7A9BAC5B-9D93-4CB3-901C-05B9CA010139"], false, true],
            ["match", ["get", "id"], ["6CFD5DDE-3EED-4A14-870E-18F389F9ED77"], false, true],
            ["match", ["get", "id"], ["E2C9EECB-1711-4B4A-A20C-46A1E62167D5"], false, true],
            ["match", ["get", "id"], ["AF55F0F2-BA90-4D7B-A940-1EC23E2B19A5"], false, true],
            ["match", ["get", "id"], ["EEE74656-3820-45DA-A136-7BBDC2CE8CE8"], false, true],
            ["match", ["get", "id"], ["ECF5694F-0288-40D4-917E-F74FA22D65FB"], false, true],
            ["match", ["get", "id"], ["4511A4B7-D94A-44B0-BD4C-1E43A08E16CB"], false, true],
            ["match", ["get", "id"], ["DD513522-D82E-43E8-932E-BE7EC351D086"], false, true],
            ["match", ["get", "id"], ["12B176FF-65C4-423B-9C6A-B51ED5BE4848"], false, true],
            ["match", ["get", "id"], ["464FEE5E-8050-4EB4-9ABA-79C59CBD05FA"], false, true],
            ["match", ["get", "id"], ["4F6FF59C-7BDC-47E9-A08B-B0782232BB78"], false, true],
            ["match", ["get", "id"], ["1D108FC9-A689-4402-8170-79340B61B47A"], false, true],
            ["match", ["get", "id"], ["AA828F1A-D7BF-491F-A765-04EBE6ADE9C9"], false, true],
            ["match", ["get", "id"], ["776B3BC8-0E1B-44DA-BCD1-50DD55EEA03B"], false, true],
            ["match", ["get", "id"], ["79734F43-E3C5-4A65-9452-DD7B712C2227"], false, true],
            ["match", ["get", "id"], ["94BDB760-123D-4FCF-8DA0-C68D717060DE"], false, true],
            ["match", ["get", "id"], ["AE584DD3-F280-4E64-87BE-028704961305"], false, true],
            ["match", ["get", "id"], ["777B8B48-CAF6-4012-98A2-AA7F1C3A910D"], false, true],
            ["match", ["get", "id"], ["721DCEAF-EB8B-48C2-B208-B72373192F99"], false, true],
            ["match", ["get", "id"], ["41A032CC-2E4C-4838-8314-582B9FF4B9EF"], false, true],
            ["match", ["get", "id"], ["C437A8B5-3E9A-4D25-897F-9C3397433B43"], false, true],
            ["match", ["get", "id"], ["77A73412-B8E8-4A14-BF39-7F84B6B76C28"], false, true],
            ["match", ["get", "id"], ["2B291305-8222-49DA-B688-7236E92D4556"], false, true],
            ["match", ["get", "id"], ["4CA2F91C-3002-4C2D-9409-F5D0DB133649"], false, true],
            ["match", ["get", "id"], ["C52376CA-8C89-45F3-B39B-46D374113166"], false, true],
            ["match", ["get", "id"], ["DE32F22F-BEFC-4A74-BFE8-0089085DB718"], false, true],
            ["match", ["get", "id"], ["9D372BC8-A60A-4AF3-995D-7C6E474E1EB3"], false, true],
            ["match", ["get", "id"], ["D9883838-3C75-4CB0-A558-6ADF1D2B7D66"], false, true],
            ["match", ["get", "id"], ["B85FE086-BD01-476C-A958-E0C82FAF2E43"], false, true],
            ["match", ["get", "id"], ["7E6FDAD7-FAE6-44C7-B667-E37BA1BEB8D0"], false, true],
            ["match", ["get", "id"], ["0293B39E-29AC-4582-BCA3-7A291761CD9E"], false, true],
            ["match", ["get", "id"], ["1D1E7466-9185-46B3-B0D1-1A864EE34F3F"], false, true],
            ["match", ["get", "id"], ["C8B1F754-85DC-4134-98D0-4E5E2F573B1C"], false, true],
            ["match", ["get", "id"], ["6FB266D2-10D6-4D7C-A80F-9C78EAA80CC4"], false, true],
            ["match", ["get", "id"], ["FBAA4D14-0988-48B1-9B51-B0E622D4378A"], false, true],
            ["match", ["get", "id"], ["FD4A087A-C8BF-43AC-B4D5-48EEFB59F62C"], false, true],
            ["match", ["get", "id"], ["A05998AA-D9CC-4AA9-A141-7A6B1607B001"], false, true],
            ["match", ["get", "id"], ["BEFE0438-06BE-4413-9A5F-4B2B969D99BD"], false, true],
            ["match", ["get", "id"], ["D2D826EE-6FE7-44E3-AFB8-9BB3DDE7249C"], false, true],
            ["match", ["get", "id"], ["432820F7-E888-41C7-92B0-DA4AFB2B4684"], false, true],
            ["match", ["get", "id"], ["625EF671-095D-441C-BEF1-57CB87ECBB01"], false, true],
            ["match", ["get", "id"], ["2CC59BE7-FB45-404A-887C-65BE42504284"], false, true],
            ["match", ["get", "id"], ["F1F54931-B2AD-44F0-91D9-FA2392AC4A74"], false, true],
            ["match", ["get", "id"], ["8F58C24F-A4A1-4FCF-A326-6B49A3EC1709"], false, true],
            ["match", ["get", "id"], ["E91C0FAA-8E1B-4064-9264-804905F8474A"], false, true],
            ["match", ["get", "id"], ["E53A8354-C3F0-474B-9A3C-6AACAC5468C0"], false, true],
            ["match", ["get", "id"], ["0DD4E610-76D2-4876-A319-7A71F277B474"], false, true],
            ["match", ["get", "id"], ["A6E7A6CD-6C32-4A37-82BD-A9980FC422F1"], false, true],
            ["match", ["get", "id"], ["F6B3F445-66EB-467E-9E4D-20A440BABD67"], false, true],
            ["match", ["get", "id"], ["B29C8A82-D715-4641-BAF1-586D5AFF7B25"], false, true],
            ["match", ["get", "id"], ["0AC17192-BB59-4C15-B59D-DC2FD44F4D31"], false, true],
            ["match", ["get", "id"], ["CE8A7C39-FC11-428B-9DC8-FFE6DD8A0130"], false, true],
            ["match", ["get", "id"], ["79BE7785-6DBE-4CC2-B8E0-9E3BE541F6B8"], false, true],
            ["match", ["get", "id"], ["4FC9369E-79C0-4668-B959-FF35772AF975"], false, true],
            ["match", ["get", "id"], ["666A48AA-3AEA-4265-9CCF-0C9F72E182AF"], false, true],
            ["match", ["get", "id"], ["9EF651DB-BA0A-4D2D-B28C-47D9850F8738"], false, true],
            ["match", ["get", "id"], ["59C510A0-ABE2-4095-9E07-F86F78A0B1D1"], false, true],
            ["match", ["get", "id"], ["FBA488F8-B622-4026-89C0-8B4F91017844"], false, true],
            ["match", ["get", "id"], ["90B3B206-6E3E-4768-B93B-087F8744E6A9"], false, true],
            ["match", ["get", "id"], ["9CC029FF-C088-40FD-B382-3DCB8BF4090C"], false, true],
            ["match", ["get", "id"], ["7B5698BC-404B-4670-9CA3-79C0D59FC8D7"], false, true],
            ["match", ["get", "id"], ["7407DCB5-CD57-48F1-865C-84EC0C19D454"], false, true],
            ["match", ["get", "id"], ["3398F70D-FBF3-4AB1-9D93-147E54037549"], false, true],
            ["match", ["get", "id"], ["633D8EDD-0B2C-4667-85A9-FB584924CF9F"], false, true],
            ["match", ["get", "id"], ["18A1D689-F4F0-4225-B482-974530C28258"], false, true],
            ["match", ["get", "id"], ["18B7AACE-3AA1-4925-8FDB-1576B2A8C27C"], false, true],
            ["match", ["get", "id"], ["9355C23F-B54F-49F0-986C-E873541F06FD"], false, true],
            ["match", ["get", "id"], ["4AFC15C8-15FE-4886-9196-21EC7DFB0FB5"], false, true],
            ["match", ["get", "id"], ["E588C2A3-B572-4B61-B73E-08496CBAE73B"], false, true],
            ["match", ["get", "id"], ["7D2B3EFF-D7AA-4CE9-9950-96CD147DCA64"], false, true],
            ["match", ["get", "id"], ["D4E85CCA-0351-4A51-8200-30C8CDE9ECC4"], false, true],
            ["match", ["get", "id"], ["8D3A6C72-55BC-448A-ABA2-DB5DAE805F37"], false, true],
            ["match", ["get", "id"], ["D265C298-965C-44C2-A40E-63179755191C"], false, true],
            ["match", ["get", "id"], ["60CEE6A7-AEFB-4CE4-A822-7309FCFC4DF3"], false, true],
            ["match", ["get", "id"], ["D4123D1D-5B84-4CE8-AA00-BF4C33CC45B7"], false, true],
            ["match", ["get", "id"], ["AF02C47C-78C0-4DB2-9058-D44347C5D2EE"], false, true],
            ["match", ["get", "id"], ["94FAE3DF-6FE2-4CC2-91D1-BB15C67D87C8"], false, true],
            ["match", ["get", "id"], ["5569E39C-211A-4949-9B3B-16A75EA5ED56"], false, true],
            ["match", ["get", "id"], ["4851000A-28A7-423F-8922-57EB579DB1F3"], false, true],
            ["match", ["get", "id"], ["DBFCCC5D-D5E4-4F04-85EF-7188822552E0"], false, true],
            ["match", ["get", "id"], ["8DBE8F2A-F692-40FC-8AAA-C002CF268B89"], false, true],
            ["match", ["get", "id"], ["5C8DCA27-D1B2-459A-B6E2-4F55122790E1"], false, true],
            ["match", ["get", "id"], ["8B30F3D3-FB02-4C49-95F0-97A20617EF75"], false, true],
            ["match", ["get", "id"], ["C94AD27C-C875-4913-8653-7EE3794F102D"], false, true],
            ["match", ["get", "id"], ["C6C958EB-19E0-484C-8A20-1DD9B39365C8"], false, true],
            ["match", ["get", "id"], ["1C95F05C-6CEF-4B1D-99B8-EFE7C703D18B"], false, true],
            ["match", ["get", "id"], ["B7F2B868-D732-4454-AEE0-2657AB20B4E5"], false, true],
            ["match", ["get", "id"], ["5B3933B9-646F-4061-BC77-61D74E33C301"], false, true],
            ["match", ["get", "id"], ["A32B063B-253D-4E76-918C-D86D73517366"], false, true],
            ["match", ["get", "id"], ["29C2F793-36C6-4B98-BA5F-13DA7D4A2FBA"], false, true],
            ["match", ["get", "id"], ["2B17220D-A0D5-48BF-997A-D32FEF99CE2B"], false, true],
            ["match", ["get", "id"], ["8BF230C6-70B7-4889-9999-2FDDB3ECE9A7"], false, true],
            ["match", ["get", "id"], ["AE61476D-C1B7-44B8-AD1E-48FCB62DFAB4"], false, true],
            ["match", ["get", "id"], ["0FF37104-0809-4603-91EB-7AE8805D1181"], false, true],
            ["match", ["get", "id"], ["F2C81F01-4AFB-40F5-8C68-D303445872A1"], false, true],
            ["match", ["get", "id"], ["449A96F6-75D5-4B34-9CB6-659F11C2F93F"], false, true],
            ["match", ["get", "id"], ["340DB264-AD81-48B9-851F-0B6EF759516F"], false, true],
            ["match", ["get", "id"], ["CD4159BB-421F-4F2E-AC0E-77F67E733A1D"], false, true],
            ["match", ["get", "id"], ["5D4A5D10-812F-40B2-A43E-68F1507DC6A2"], false, true],
            ["match", ["get", "id"], ["CA5CE887-932C-4728-BD3B-41CE090E5FF6"], false, true],
            ["match", ["get", "id"], ["61234B2A-D464-44B8-8710-47C763C7628C"], false, true],
            ["match", ["get", "id"], ["5DEDB462-CB55-4B48-B620-E4875E687231"], false, true],
            ["match", ["get", "id"], ["164FE93E-1E62-49DF-B7D0-CDC2BD5DDD19"], false, true],
            ["match", ["get", "id"], ["1C3E1E6B-E928-4BF0-BEA3-FE4BDEB4B7A0"], false, true],
            ["match", ["get", "id"], ["211A2F48-C84C-42F0-BE04-AEA2AA3F0C70"], false, true],
            ["match", ["get", "id"], ["1558202B-36B1-48E4-ABCF-FD808740F26D"], false, true],
            ["match", ["get", "id"], ["FEF44FAA-C946-4DEB-81AA-50AFF5F1E397"], false, true],
            ["match", ["get", "id"], ["DB18352F-920E-4C7C-AC37-8BEA9F810A5B"], false, true],
            ["match", ["get", "id"], ["FA79899E-DB36-45BD-B3E8-68CC5F219568"], false, true],
            ["match", ["get", "id"], ["12C6FF9D-3793-4893-8C94-3CCF6F1012E0"], false, true],
            ["match", ["get", "id"], ["2089F45D-0F12-4DD7-848E-5B101497820F"], false, true],
            ["match", ["get", "id"], ["1E3144A2-1369-4D64-A030-455CD1764049"], false, true],
            ["match", ["get", "id"], ["62BE9FA1-DC0A-45C9-88CB-F07DAFA95622"], false, true],
            ["match", ["get", "id"], ["26840A3A-2D5E-4434-A173-655E8AF3BC86"], false, true],
            ["match", ["get", "id"], ["CCBD735F-546B-4CC4-AA92-E275F4A9BC6C"], false, true],
            ["match", ["get", "id"], ["A74127ED-F3FC-4373-8C4A-B99D4737ACC8"], false, true],
            ["match", ["get", "id"], ["6E3F0D48-C24D-4261-B75B-C937AFF0AC4C"], false, true],
            ["match", ["get", "id"], ["876A51FB-9974-45F6-815B-BEE488FD097F"], false, true],
            ["match", ["get", "id"], ["C5E6CAB2-1D9C-4C1F-8F1B-20C874E9FC6C"], false, true],
            ["match", ["get", "id"], ["FB60E171-5B97-401C-B081-2AEEE6691033"], false, true],
            ["match", ["get", "id"], ["49991A39-11A3-43CF-B8B4-B70537A9FAF8"], false, true],
            ["match", ["get", "id"], ["AE8FC750-0AC5-4996-BCB3-1FFBD44A1781"], false, true],
            ["match", ["get", "id"], ["FD5FC314-5DA2-44F6-BD39-5B401BCC7969"], false, true],
            ["match", ["get", "id"], ["1DDEAC42-8B92-46A6-8EF8-9DF6EF340A46"], false, true],
            ["match", ["get", "id"], ["FB3B9CB6-1FC4-4E33-AE1E-990C05AD36B5"], false, true],
            ["match", ["get", "id"], ["158D7B52-B193-4A77-BBC0-AB765853CC3B"], false, true],
            ["match", ["get", "id"], ["C93B07FB-2221-4031-AC76-E8D1430DB9F8"], false, true],
            ["match", ["get", "id"], ["9F4E00CE-A9F8-468E-A777-795CEED09087"], false, true],
            ["match", ["get", "id"], ["E343B3A7-0B80-4FD9-8BD3-6F9973131A0F"], false, true],
            ["match", ["get", "id"], ["2D273F0D-4278-49CE-BE37-807850265893"], false, true],
            ["match", ["get", "id"], ["B15DDBB2-C6DC-4D8B-8BC1-0CF820A28AA4"], false, true],
            ["match", ["get", "id"], ["78DF7394-2376-407C-A92E-59D5263100A4"], false, true],
            ["match", ["get", "id"], ["F68B95D2-08FC-46FB-9ECE-008548B8C550"], false, true],
            ["match", ["get", "id"], ["0E63D458-B730-43FE-B942-4B5F72DB0DD0"], false, true],
            ["match", ["get", "id"], ["CF2E59A7-6C03-4723-8EFC-4835ECD219F1"], false, true],
            ["match", ["get", "id"], ["4B9D6A20-D07F-4407-B63B-D0E7F10287DC"], false, true],
            ["match", ["get", "id"], ["8BA6A38E-F4C3-4F18-AF33-B8C1AA7DA175"], false, true],
            ["match", ["get", "id"], ["A9D536D1-B0AA-4823-9A0A-369C67899DBC"], false, true],
            ["match", ["get", "id"], ["8F116374-7AD5-4703-8C59-0F730C2ECCC3"], false, true],
            ["match", ["get", "id"], ["9D62BB4B-0427-4C3E-9A56-66311FD2E704"], false, true],
            ["match", ["get", "id"], ["005E093D-B07A-40FD-B55D-BFC6FD57D1BE"], false, true],
            ["match", ["get", "id"], ["C8495840-CF8A-4D62-85C7-F54AE03FD53E"], false, true],
            ["match", ["get", "id"], ["17D0F93B-7EB7-40C2-B09C-4CC72D65323E"], false, true],
            ["match", ["get", "id"], ["E9F2C8EA-5EE4-4336-8EEF-42BC73BDE65D"], false, true],
            ["match", ["get", "id"], ["B360FF42-40F1-443F-AFAF-9D4B3FF3A151"], false, true],
            ["match", ["get", "id"], ["D3A8A7F8-E395-4380-989F-267D63C0E745"], false, true],
            ["match", ["get", "id"], ["CA62B120-4515-49A6-8F03-EACE09798765"], false, true],
            ["match", ["get", "id"], ["447722E5-AB3B-4179-BE48-E1212EE8E1B0"], false, true],
            ["match", ["get", "id"], ["07A5AF1A-CAB3-4DE2-8C51-CD63855C292A"], false, true],
            ["match", ["get", "id"], ["34B8B5B7-B274-4D7C-A551-B8D7A81D87E3"], false, true],
            ["match", ["get", "id"], ["94A7A309-6EBB-49CA-B0F1-D9629C706A81"], false, true],
            ["match", ["get", "id"], ["4EC79B27-FC0F-4766-8FA6-CB1643A889DA"], false, true],
            ["match", ["get", "id"], ["60066C5E-CE81-4D08-87A8-403199F1C9DE"], false, true],
            ["match", ["get", "id"], ["0F2672C5-5B16-49FA-BBCB-AF8330E916CE"], false, true],
            ["match", ["get", "id"], ["D2728038-34E0-46BA-867D-F4446933B61E"], false, true],
            ["match", ["get", "id"], ["83EBE212-8CAA-4666-9991-E1D7AA96E15C"], false, true],
            ["match", ["get", "id"], ["EE42A7FA-D368-4327-8C90-D4DE34385D9E"], false, true],
            ["match", ["get", "id"], ["39A5C5BD-57F8-4777-A9DE-50413729CEC7"], false, true],
            ["match", ["get", "id"], ["4D6B1360-6B6B-459A-91A8-93CD9D134671"], false, true],
            ["match", ["get", "id"], ["3029F9C3-8917-4C1D-BA59-1A366C1B3448"], false, true],
            ["match", ["get", "id"], ["3D80CFF9-B147-45B1-9D37-224E34362AD6"], false, true],
            ["match", ["get", "id"], ["D5A2180B-1EE5-4CED-A474-EF402037F823"], false, true],
            ["match", ["get", "id"], ["919EC400-4786-441D-A068-6969C689C42D"], false, true],
            ["match", ["get", "id"], ["9AA40818-5CA5-4D2D-90F6-BB8CF55359C1"], false, true],
            ["match", ["get", "id"], ["CC2C15B2-903C-42F9-B389-73B7C3C77A5C"], false, true],
            ["match", ["get", "id"], ["1D630E1C-A6EA-4B6F-924F-00ABF8D3EF80"], false, true],
            ["match", ["get", "id"], ["9A675589-22D2-4015-83DA-73E3452431A1"], false, true],
            ["match", ["get", "id"], ["DA4C1803-B832-4CB9-A6CD-D884B6C35EC3"], false, true],
            ["match", ["get", "id"], ["0DAE9425-635D-4810-B5D5-1CB71C022524"], false, true],
            ["match", ["get", "id"], ["9C6C9FF6-37CA-46CB-A4DD-6197C2A39589"], false, true],
            ["match", ["get", "id"], ["79EF0A26-BE38-45C1-A46E-955D0C6297D5"], false, true],
            ["match", ["get", "id"], ["CF35968D-6485-4029-B9CC-3C0429E42415"], false, true],
            ["match", ["get", "id"], ["C017C8C4-0142-4637-BC47-97C36664F438"], false, true],
            ["match", ["get", "id"], ["23AB3748-8B88-47C3-A97B-724B9252C4D5"], false, true],
            ["match", ["get", "id"], ["79ABA005-734E-4C6F-8C9B-348AF5AD89A5"], false, true],
            ["match", ["get", "id"], ["589495FF-C7E9-4EF1-9981-4DFEC23AF5F5"], false, true],
            ["match", ["get", "id"], ["913D7122-9476-4BA2-B11F-E78F3F6B5944"], false, true],
            ["match", ["get", "id"], ["C353FA3D-679B-4069-A1BB-091368321B18"], false, true],
            ["match", ["get", "id"], ["BF9A0601-E56B-462F-8491-3CEC40C2E478"], false, true],
            ["match", ["get", "id"], ["17EBFFD2-28A6-49AE-B3AC-D8DBD6F43CC9"], false, true],
            ["match", ["get", "id"], ["3F47AE45-03DC-4E2F-95C6-28EA1B7AE14E"], false, true],
            ["match", ["get", "id"], ["CFAF34BF-A9F1-4E68-B01A-444F97DDE478"], false, true],
            ["match", ["get", "id"], ["B9E05856-BDF2-483F-BB6F-5B118E9A6DE5"], false, true],
            ["match", ["get", "id"], ["D33D9826-2433-43AE-B6F2-0B47481A0D76"], false, true],
            ["match", ["get", "id"], ["8E386ED0-9485-44BB-80E2-621E41343FD6"], false, true],
            ["match", ["get", "id"], ["69BA5D2D-F6BA-4B3D-9472-90033441D046"], false, true],
            ["match", ["get", "id"], ["5105A1AF-16A4-4D62-82FA-069BC1F8AB0F"], false, true],
            ["match", ["get", "id"], ["BBC45565-604E-4CFF-9296-783FAD53FB07"], false, true],
            ["match", ["get", "id"], ["465D509B-2275-4C3C-8F1E-8828CBBFAF89"], false, true],
            ["match", ["get", "id"], ["6B394D1D-1C3E-48D7-BA5E-5C8D53A75D0A"], false, true],
            ["match", ["get", "id"], ["02FD44CE-8A7D-439F-86E3-0C23540F18E7"], false, true],
            ["match", ["get", "id"], ["920E8687-8225-4DE6-98C2-98205FF1EC3C"], false, true],
            ["match", ["get", "id"], ["2CBA22F9-CBBA-46A4-A6C2-34FFA8B0ECB5"], false, true],
            ["match", ["get", "id"], ["264477B6-5794-4468-B47E-20EE2C5E97E7"], false, true],
            ["match", ["get", "id"], ["65492638-061B-41F6-BDCF-587EAB7E40CA"], false, true],
            ["match", ["get", "id"], ["B7041B18-4D16-40A5-988C-5A9AB6769FBF"], false, true],
            ["match", ["get", "id"], ["137104F2-399F-425B-B07E-9DD7B208A83B"], false, true],
            ["match", ["get", "id"], ["B391880A-B2E4-447F-8BDE-7F4A914C8BB9"], false, true],
            ["match", ["get", "id"], ["D7AFFEAF-5D5D-4BAD-B26A-9CC2B866D38F"], false, true],
            ["match", ["get", "id"], ["C6391191-38EF-4906-96D9-06CBF484E1BE"], false, true],
            ["match", ["get", "id"], ["F582CCD7-02D3-4D13-ADF1-2DE42204CE4B"], false, true],
            ["match", ["get", "id"], ["5358F72F-EDAA-4179-AD6A-2A7AD97B4E79"], false, true],
            ["match", ["get", "id"], ["72CD044E-4094-4900-B1C4-492F2D3A3A50"], false, true],
            ["match", ["get", "id"], ["DB41B8B7-BE33-446C-B99A-BDA23A8A4CEC"], false, true],
            ["match", ["get", "id"], ["78DFDE9F-47B8-4446-9CA6-E1028F78A1EE"], false, true],
            ["match", ["get", "id"], ["33096D75-DB38-4372-A7A3-BA233173915F"], false, true],
            ["match", ["get", "id"], ["0E098A4A-9EC3-41BD-A99A-59772B6B76CB"], false, true],
            ["match", ["get", "id"], ["10C844E3-96C6-4EC7-A0FA-E8A7E35B1875"], false, true],
            ["match", ["get", "id"], ["FEADCD5F-D8E0-4CA4-8CAE-D4B2C45300F6"], false, true],
            ["match", ["get", "id"], ["92635F77-D668-4E77-99A7-2537752CBC09"], false, true],
            ["match", ["get", "id"], ["D566AE8C-42BE-4474-8551-2090C49EF789"], false, true],
            ["match", ["get", "id"], ["702A0787-7128-4483-B3C1-42E8CCB12992"], false, true],
            ["match", ["get", "id"], ["E539CF28-D21D-47E4-817E-56068F748B68"], false, true],
            ["match", ["get", "id"], ["086E751A-7117-4736-ADE2-5CF1BA5C7CD1"], false, true],
            ["match", ["get", "id"], ["B1446119-AA5B-4D13-BCD0-902A4BE0E241"], false, true],
            ["match", ["get", "id"], ["52147965-C767-4D27-9C45-EA63C29007D4"], false, true],
            ["match", ["get", "id"], ["7E7A4F2A-3CD1-490D-AFF8-B80DA559815F"], false, true],
            ["match", ["get", "id"], ["E25485EF-2FFE-4938-9D04-C146E8A734AC"], false, true],
            ["match", ["get", "id"], ["0B873A02-3612-42D0-9A99-442390B955C1"], false, true],
            ["match", ["get", "id"], ["2D810D91-AF43-404E-9A0D-C6011238B3E0"], false, true],
            ["match", ["get", "id"], ["64550330-E65E-4F51-A9C6-7BB336896DED"], false, true],
            ["match", ["get", "id"], ["4258194E-D9FC-41F1-9150-6EDA3D1148AF"], false, true],
            ["match", ["get", "id"], ["37A326DF-1D19-4A03-AFCD-D97F599B24AB"], false, true],
            ["match", ["get", "id"], ["4156957B-7524-4DF4-A628-8BB1EC1C1BAC"], false, true],
            ["match", ["get", "id"], ["6F32242D-2E27-4D1F-829F-AF369320C6B3"], false, true],
            ["match", ["get", "id"], ["49F7D196-A268-464D-8552-4EAA98FA18AE"], false, true],
            ["match", ["get", "id"], ["4B2F9089-17F5-4448-B9B5-B82C10BB5DED"], false, true],
            ["match", ["get", "id"], ["CA6BE75F-5343-4967-A9AA-9C96DA952107"], false, true],
            ["match", ["get", "id"], ["BFC15389-FC4F-4E03-87AE-B00180A5DC69"], false, true],
            ["match", ["get", "id"], ["C42251F5-69D7-47D2-909E-C62E9C779E14"], false, true],
            ["match", ["get", "id"], ["25E6E0B2-53C9-4542-AE91-BAFEB23C9FFB"], false, true],
            ["match", ["get", "id"], ["C61DEB8C-51EA-4350-B7A3-D51506669708"], false, true],
            ["match", ["get", "id"], ["6FDD140D-2434-48A2-BF7E-1103E1FE6B75"], false, true],
            ["match", ["get", "id"], ["C578240D-AE82-4C74-94AC-A419C6885077"], false, true],
            ["match", ["get", "id"], ["BF1613D1-0C59-4862-BE15-B47E75B05EB9"], false, true],
            ["match", ["get", "id"], ["3C9B1BD6-38AC-4A1B-96FC-325A6BA5359C"], false, true],
            ["match", ["get", "id"], ["9B1ED2BA-8A27-4A62-B254-228E016F6312"], false, true],
            ["match", ["get", "id"], ["1C22BB60-BD40-4814-8D34-EA7D3F3C6D5A"], false, true],
            ["match", ["get", "id"], ["09845807-44AD-414C-8C31-4F2AB1E3E26E"], false, true],
            ["match", ["get", "id"], ["A1A4AD2F-6AE5-4583-87A8-A16D9867E2BC"], false, true],
            ["match", ["get", "id"], ["0CAEE58F-5DCB-4D44-A4C2-3E7AC393A5D2"], false, true],
            ["match", ["get", "id"], ["09AD28E4-73B8-4A9A-9B0C-3E0AD110FDAE"], false, true],
            ["match", ["get", "id"], ["84129D29-8276-4BA1-9C25-E41A42A9B057"], false, true],
            ["match", ["get", "id"], ["A39A83E2-BECE-445D-BD08-182EC91E4982"], false, true],
            ["match", ["get", "id"], ["BCDBCECD-13BE-45EA-AD86-D339DEDE20CA"], false, true],
            ["match", ["get", "id"], ["DC1AFC3C-FA87-4D34-A1DD-4FEC1E468F66"], false, true],
            ["match", ["get", "id"], ["AFD03D3E-E24C-4293-A87C-21AE021F34E0"], false, true],
            ["match", ["get", "id"], ["23A82ED5-A197-4B6E-8701-E66EFE11E5AA"], false, true],
            ["match", ["get", "id"], ["AAF59D00-AC7E-4F50-B664-85B33FE182EA"], false, true],
            ["match", ["get", "id"], ["5BCBE408-9A7E-4771-8AA3-079AEE5C2EB1"], false, true],
            ["match", ["get", "id"], ["DE968958-6262-4F3A-9E00-EB44E1A57310"], false, true],
            ["match", ["get", "id"], ["6145700C-64D6-46CB-B58D-F9B1D6E87B60"], false, true],
            ["match", ["get", "id"], ["9E817B81-6237-4C65-BCA8-35862DA6F470"], false, true],
            ["match", ["get", "id"], ["F9CA9BF7-0E20-4347-9C75-A3835350CD56"], false, true],
            ["match", ["get", "id"], ["739F8A21-5A44-4548-86F8-C07DD0B3C279"], false, true],
            ["match", ["get", "id"], ["35EA1BE7-96F7-42AF-BD3D-C3D3D9CE9115"], false, true],
            ["match", ["get", "id"], ["CEC4C9B8-EAAE-4153-A1B3-5255638ADB26"], false, true],
            ["match", ["get", "id"], ["35613A1B-C98C-485D-A65A-04A44586F796"], false, true],
            ["match", ["get", "id"], ["98D2048A-88A2-4F02-B8EE-2B38D1FB3896"], false, true],
            ["match", ["get", "id"], ["49D0E41E-6C39-449E-88B4-A4B7E16C0F7A"], false, true],
            ["match", ["get", "id"], ["05A7820B-D757-4994-83E2-E60DEE726C9F"], false, true],
            ["match", ["get", "id"], ["BA6A6435-420E-4D76-B133-2EBF21593A69"], false, true],
            ["match", ["get", "id"], ["96528260-213E-4DDF-84EF-8C08A3FB30A5"], false, true],
            ["match", ["get", "id"], ["7922B98B-E805-48BF-90CC-EFF61433B7F0"], false, true],
            ["match", ["get", "id"], ["E0E7780E-3933-4534-A7CD-6750BEEFAFBA"], false, true],
            ["match", ["get", "id"], ["35129D0E-20E5-4C01-8ADC-6C76F1CE5705"], false, true],
            ["match", ["get", "id"], ["89958FB6-DABE-456D-B954-5F8D9D880B60"], false, true],
            ["match", ["get", "id"], ["39DB7787-EF93-466C-BB9F-375FE35EB775"], false, true],
            ["match", ["get", "id"], ["C30E1D53-66DA-4592-BE98-0FEEC8B80E53"], false, true],
            ["match", ["get", "id"], ["DE90316C-CF77-4533-9834-996B29929EF6"], false, true],
            ["match", ["get", "id"], ["30DA64FB-4FD7-4DAB-9BFB-FC7F50A133F4"], false, true],
            ["match", ["get", "id"], ["CEC06957-99D9-432D-A0CD-D72F2930D91B"], false, true],
            ["match", ["get", "id"], ["0B226F60-903C-4EB1-A097-081A2A28C7C7"], false, true],
            ["match", ["get", "id"], ["FD8B447C-3694-4737-9D69-80AC68754956"], false, true],
            ["match", ["get", "id"], ["6B3442E5-1B39-44A2-A4FA-51CD3243CE63"], false, true],
            ["match", ["get", "id"], ["86A74A8D-02B7-4C8A-A339-7EF71C109160"], false, true],
            ["match", ["get", "id"], ["CB807108-B28F-4524-A45D-827240FF2511"], false, true],
            ["match", ["get", "id"], ["EC72FB30-DA3C-4803-A5E3-4267F3A2B7C7"], false, true],
            ["match", ["get", "id"], ["762987D8-0AC8-4622-B793-FBF7C71E969F"], false, true],
            ["match", ["get", "id"], ["0927954E-942A-4C16-AB34-2EB14B4A7961"], false, true],
            ["match", ["get", "id"], ["30C61CD4-D6D5-4D7C-9815-4625D9079B0B"], false, true],
            ["match", ["get", "id"], ["E0B7410E-1BB6-4386-A2C3-E736AFA961E1"], false, true],
            ["match", ["get", "id"], ["FED23E11-9788-44C8-916D-287C95D786FD"], false, true],
            ["match", ["get", "id"], ["C97213C3-023F-465B-BB6C-D0DBB30C8D5A"], false, true],
            ["match", ["get", "id"], ["05A45F5A-F4D6-4F8D-9BCF-84CEC3EEA2A3"], false, true],
            ["match", ["get", "id"], ["6D464802-3C5E-4F65-B132-B2D02D1984D6"], false, true],
            ["match", ["get", "id"], ["6027B258-20B4-4209-AF4C-AE189AF4267C"], false, true],
            ["match", ["get", "id"], ["D0CC50E9-6E4C-4220-8488-B030AC7679ED"], false, true],
            ["match", ["get", "id"], ["B096A2F3-46F5-43E2-88C9-58B51B9EA31A"], false, true],
            ["match", ["get", "id"], ["6C6AE37B-4CA6-4AE1-81F2-09732C3653B3"], false, true],
            ["match", ["get", "id"], ["20ECDEB2-B94B-4913-B354-DB38A992A29C"], false, true],
            ["match", ["get", "id"], ["BB437661-F145-44C5-85CD-2160AE3A72DC"], false, true],
            ["match", ["get", "id"], ["8CEA3280-0FE2-4AAC-9669-D15E43947EB2"], false, true],
            ["match", ["get", "id"], ["A6A89347-CF0A-4E17-995D-5BF4B502F1FB"], false, true],
            ["match", ["get", "id"], ["60274E89-9CDD-4C4B-915B-4BD11E6AEC5E"], false, true],
            ["match", ["get", "id"], ["ED508702-5B84-4222-B63E-35262F2984B4"], false, true],
            ["match", ["get", "id"], ["77807641-D8BD-45D5-9181-B0444C29AB6B"], false, true],
            ["match", ["get", "id"], ["130ADDC5-EAA1-4457-838B-95402B80C168"], false, true],
            ["match", ["get", "id"], ["53D76496-9915-4D3B-822C-8ADAF1A433BE"], false, true],
            ["match", ["get", "id"], ["BE87F153-023C-43F3-97A4-8DE48DFEA850"], false, true],
            ["match", ["get", "id"], ["F757792A-F482-41D4-BF18-F188569D99F8"], false, true],
            ["match", ["get", "id"], ["AC20A8A8-7270-45B9-95DE-C435E14ED009"], false, true],
            ["match", ["get", "id"], ["4262FF7D-79AA-4382-87E6-FF915D6B16A9"], false, true],
            ["match", ["get", "id"], ["3E363AD8-1FE1-4B19-BC86-9570A17DD6AA"], false, true],
            ["match", ["get", "id"], ["3474D84A-DBB4-4300-BE07-DE73A86B7E16"], false, true],
            ["match", ["get", "id"], ["3076B7DC-CA03-4D9B-BF2C-5822329887E8"], false, true],
            ["match", ["get", "id"], ["6D3E4C4E-09B5-475A-AD8E-C12D6862A2AB"], false, true],
            ["match", ["get", "id"], ["D92FF60B-0961-47F5-B18E-3A43B5727A92"], false, true],
            ["match", ["get", "id"], ["BA372F65-3138-4D00-85B4-B5D55451FA70"], false, true],
            ["match", ["get", "id"], ["3E178404-F32A-49B8-9BC2-725D56797137"], false, true],
            ["match", ["get", "id"], ["265C0539-E914-4085-896F-02A40AAF1FF8"], false, true],
            ["match", ["get", "id"], ["3AD53455-0AB3-4636-9B99-A50BE4BC211C"], false, true],
            ["match", ["get", "id"], ["F4B03194-FE9B-4346-8F59-92756123E606"], false, true],
            ["match", ["get", "id"], ["D0FA1183-45EC-45EC-A26A-8BB9A72899FE"], false, true],
            ["match", ["get", "id"], ["619C8F39-D348-4178-8873-D83B38112E37"], false, true],
            ["match", ["get", "id"], ["8F130923-1683-4BD2-B2AF-B83418D9BAB6"], false, true],
            ["match", ["get", "id"], ["BC62B997-54AA-4F06-9E5C-A946C20524AC"], false, true],
            ["match", ["get", "id"], ["D50BBFE6-8F0C-4C8D-8170-647AF011608A"], false, true],
            ["match", ["get", "id"], ["A32482FF-1704-4609-9F19-CC4862B966EE"], false, true],
            ["match", ["get", "id"], ["33A3BA6B-AD87-4674-A9CC-33EBE26CB178"], false, true],
            ["match", ["get", "id"], ["2C415907-6CED-4AF9-BC6B-FB02ECE7E81D"], false, true],
            ["match", ["get", "id"], ["41B6636D-B4C1-4F41-8379-E6B54A5AA549"], false, true],
            ["match", ["get", "id"], ["07F6E7E3-F744-407D-A002-CA06073E1D73"], false, true],
            ["match", ["get", "id"], ["F2C93A23-2867-4109-B1DB-D573D06A0ED4"], false, true],
            ["match", ["get", "id"], ["FAD16E47-BB3B-4804-A7C7-21D45C9ECB26"], false, true],
            ["match", ["get", "id"], ["825C41B7-74DB-4D23-9F9D-7640B0BF57C7"], false, true],
            ["match", ["get", "id"], ["2EC8D441-BC3E-4A56-B7AD-8667E09DD3C2"], false, true],
            ["match", ["get", "id"], ["6DF9C83A-B35F-4833-BFEC-EAE6214F5CF2"], false, true],
            ["match", ["get", "id"], ["D182CB24-319F-41B7-B61E-C1B19DB9C4E0"], false, true],
            ["match", ["get", "id"], ["B86C6596-22E5-4BE2-8E0D-5805566BD8DB"], false, true],
            ["match", ["get", "id"], ["F77F20F5-AD3F-473F-A65F-B83CC2F8967D"], false, true],
            ["match", ["get", "id"], ["E862BD37-7DB5-4CFE-9D7B-113404CD3C63"], false, true],
            ["match", ["get", "id"], ["56E035B0-7A48-4BA6-86F0-30FF96D93151"], false, true],
            ["match", ["get", "id"], ["5D41D0D7-32DB-483C-8081-1A7F9887C55A"], false, true],
            ["match", ["get", "id"], ["883CAEDE-353C-4212-9FA9-C306BADE1CF3"], false, true],
            ["match", ["get", "id"], ["C827259D-B16A-40E6-815C-69DE51255C5A"], false, true],
            ["match", ["get", "id"], ["FE296A04-2FCB-4158-A832-8D3095CA9994"], false, true],
            ["match", ["get", "id"], ["C9EB41E0-4B72-4B6D-863C-CC08544EE666"], false, true],
            ["match", ["get", "id"], ["3C7118A6-E2E8-42DB-9BB9-04128C64C7D2"], false, true],
            ["match", ["get", "id"], ["5EC68BCA-A21C-42AA-B137-B96161E1FE5A"], false, true],
            ["match", ["get", "id"], ["40D16D27-DBB7-4C19-8A8C-38C19DC07F88"], false, true],
            ["match", ["get", "id"], ["488DFC35-DC36-4B49-AF1F-E5329C7BCF50"], false, true],
            ["match", ["get", "id"], ["012E4451-AB9C-4681-BCA4-23C28386CAEB"], false, true],
            ["match", ["get", "id"], ["174AC9EC-0F5B-4EFB-9328-40BD23E0B267"], false, true],
            ["match", ["get", "id"], ["1EFFC3C2-81F1-4110-883D-293F859D716C"], false, true],
            ["match", ["get", "id"], ["9A0BA623-42F9-4A5E-AD29-AA6CB77EC2E3"], false, true],
            ["match", ["get", "id"], ["C5511D31-0915-4E8A-B1F5-C787AB56A1B6"], false, true],
            ["match", ["get", "id"], ["507FA050-0B48-4053-AFE8-5EFC33DEF4D7"], false, true],
            ["match", ["get", "id"], ["EBE9D4E3-A4E5-4712-8077-0141C4139E9B"], false, true],
            ["match", ["get", "id"], ["F94437D0-A609-4A3A-A76A-EBAA770B090E"], false, true],
            ["match", ["get", "id"], ["F4C5FA34-3E8D-4C57-9A75-4836CA820F9F"], false, true],
            ["match", ["get", "id"], ["5D44CC02-3980-4A90-A9C8-29AC8BD28E32"], false, true],
            ["match", ["get", "id"], ["DF1B0D5E-AE1F-4187-BD9E-DBE4C38EA1AF"], false, true],
            ["match", ["get", "id"], ["E82FAF24-BF5D-46E9-A368-B31ABBCA0A19"], false, true],
            ["match", ["get", "id"], ["0BC50A1F-23EE-4AE4-BD19-B1230F116201"], false, true],
            ["match", ["get", "id"], ["D0B54D63-29D5-4C87-98E0-DF12156F1111"], false, true],
            ["match", ["get", "id"], ["24B74778-8898-4EB7-8C53-05A7C585D98C"], false, true],
            ["match", ["get", "id"], ["FDF62596-125C-487B-BA4B-3FA51C482BBA"], false, true],
            ["match", ["get", "id"], ["7CF9AB76-B65E-4321-A2AA-A557E95E55E9"], false, true],
            ["match", ["get", "id"], ["37D71484-7D7C-49B2-985B-B8FCD167FDFB"], false, true],
            ["match", ["get", "id"], ["E82A9131-933A-4297-9E9F-EDB4F1D7B7D3"], false, true],
            ["match", ["get", "id"], ["1B60EC48-42BF-47DC-8F39-B3C6546AB39B"], false, true],
            ["match", ["get", "id"], ["608AF635-C5EE-4F5F-9C4D-4F7E6F0F2CCB"], false, true],
            ["match", ["get", "id"], ["3277BD99-E895-4F52-91C5-4FCBD8C9F9FE"], false, true],
            ["match", ["get", "id"], ["53A6E082-761B-43F8-9669-25C46F75BD81"], false, true],
            ["match", ["get", "id"], ["C635849E-2B62-4376-AA9E-0C5DF6BC441A"], false, true],
            ["match", ["get", "id"], ["ED4A95C5-1EA7-49AB-86DD-F4C61360001B"], false, true],
            ["match", ["get", "id"], ["B2849A29-FF8A-42E0-9BAA-08764A022A38"], false, true],
            ["match", ["get", "id"], ["61E82CE3-B4B8-4700-A06E-D1F713626319"], false, true],
            ["match", ["get", "id"], ["79E733BD-E30F-432D-8007-EC3A60A73FDA"], false, true],
            ["match", ["get", "id"], ["39E8BAB0-F8DA-402D-8913-1AC6A5DA0EE7"], false, true],
            ["match", ["get", "id"], ["F8776FE7-0A20-401F-A0A2-B75FC309D4E4"], false, true],
            ["match", ["get", "id"], ["99D56E6F-0F54-4DCB-936C-C3FE2FBD2492"], false, true],
            ["match", ["get", "id"], ["2C219099-1BDD-49FB-BFEF-9F1D076EAC99"], false, true],
            ["match", ["get", "id"], ["3DFF9F4B-EE74-478C-B8F9-8A157E5472B0"], false, true],
            ["match", ["get", "id"], ["0CDD690E-7022-403A-8C09-D7F940901FB8"], false, true],
            ["match", ["get", "id"], ["37D6E6F3-ED82-41A1-8A5E-7E15B86DBE41"], false, true],
            ["match", ["get", "id"], ["E7A63602-8A5C-4D07-A2B7-C2CA2B023F9C"], false, true],
            ["match", ["get", "id"], ["7B68FAE4-1C81-456B-B6FE-574BCBD7DF57"], false, true],
            ["match", ["get", "id"], ["F7E44D28-5589-423D-8AD3-F472231D1EBD"], false, true],
            ["match", ["get", "id"], ["109B9E56-771A-47B9-9F7A-CDECA3D05368"], false, true],
            ["match", ["get", "id"], ["C5EA9360-9861-484C-80A0-915443AF2B99"], false, true],
            ["match", ["get", "id"], ["FC0CDDFA-6FC2-4F74-9856-BD9134BAC613"], false, true],
            ["match", ["get", "id"], ["8D164EDB-0A92-4971-A5F7-1E02AEAD60C1"], false, true],
            ["match", ["get", "id"], ["E87FF4B3-27E1-4045-9436-9E42DC75770D"], false, true],
            ["match", ["get", "id"], ["0B1D77BC-2DE6-4B9A-8CAB-EE129D1D2057"], false, true],
            ["match", ["get", "id"], ["B7259CA9-72BD-4DA6-A270-EE682D1D73A1"], false, true],
            ["match", ["get", "id"], ["D4FD2AB6-9533-44FC-A71B-9956B4CED61A"], false, true],
            ["match", ["get", "id"], ["0637518B-0099-4D07-8C9D-C3C06019F9C7"], false, true],
            ["match", ["get", "id"], ["A71555F7-539F-40B2-BF33-9F4EF399A225"], false, true],
            ["match", ["get", "id"], ["7B58291E-C17C-4F12-A656-410B32D10C08"], false, true],
            ["match", ["get", "id"], ["F1D51FC3-1B93-45CB-8BE2-B465FC142B8E"], false, true],
            ["match", ["get", "id"], ["A6229D3D-F41D-4BB4-AFDA-C275C1F7BB11"], false, true],
            ["match", ["get", "id"], ["8CAC5D87-7644-4156-8C60-E4BF6AC9464B"], false, true],
            ["match", ["get", "id"], ["4C6A0522-CC17-4E6F-892B-586698896697"], false, true],
            ["match", ["get", "id"], ["9AAFBF5A-73ED-4C81-B26F-0B52CB93F996"], false, true],
            ["match", ["get", "id"], ["0EF09609-1CAD-4CA1-97EA-011EE2D19C4F"], false, true],
            ["match", ["get", "id"], ["20B769E5-E0A0-41BD-A873-D6055DFCA2A5"], false, true],
            ["match", ["get", "id"], ["45407AFC-6D50-49FD-BD7D-592DDA3D14D2"], false, true],
            ["match", ["get", "id"], ["9455A845-151E-4F14-B0F4-F52EF094B983"], false, true],
            ["match", ["get", "id"], ["EDE58A11-593F-4DA8-8997-844899EBC369"], false, true],
            ["match", ["get", "id"], ["049CDCD8-4709-4F3B-92C5-01506F262E62"], false, true],
            ["match", ["get", "id"], ["AB8BFBB2-92FA-4CF0-9009-D6BA75D07A11"], false, true],
            ["match", ["get", "id"], ["E9B5B3D2-75D6-4723-8944-E2210C482875"], false, true],
            ["match", ["get", "id"], ["C805E67E-BCBA-48CA-B87E-7517FF8789F3"], false, true],
            ["match", ["get", "id"], ["0D6524C3-4185-4EBA-A62B-8588A6D7EF39"], false, true],
            ["match", ["get", "id"], ["CAA5CD5A-03BC-432A-947B-B7B96C6D97F9"], false, true],
            ["match", ["get", "id"], ["44C32463-8856-46B2-9C0B-0F784735FCBB"], false, true],
            ["match", ["get", "id"], ["A62302C4-A544-45CF-B702-EDDDD39DF008"], false, true],
            ["match", ["get", "id"], ["DB5356F4-66DE-465A-8157-F2655678408E"], false, true],
            ["match", ["get", "id"], ["ACDE0F0B-51AE-43BD-A885-741C0AC1AE65"], false, true],
            ["match", ["get", "id"], ["C381B945-40FD-4726-93F3-C3294895DCA6"], false, true],
            ["match", ["get", "id"], ["E3E7ECC4-34B2-4411-8F5F-963408CE9375"], false, true],
            ["match", ["get", "id"], ["466BC327-662D-4C23-BE89-8C1561E95C95"], false, true],
            ["match", ["get", "id"], ["42DE1371-F5A4-4F33-A505-4BC13CB69E4D"], false, true],
            ["match", ["get", "id"], ["3FE77923-DA9A-40EA-AF50-9815FF99A441"], false, true],
            ["match", ["get", "id"], ["5D88084C-BB8A-47F7-A4B8-08A8109885C5"], false, true],
            ["match", ["get", "id"], ["93395F99-029B-4090-BCFD-45D5E6B014F5"], false, true],
            ["match", ["get", "id"], ["E8DD2D6D-778B-4305-AA50-9E1BF99EEE3C"], false, true],
            ["match", ["get", "id"], ["C49A388F-81A4-4DD2-9F84-3604E1DCE568"], false, true],
            ["match", ["get", "id"], ["39C8239F-BCD0-4BC4-A7B3-1A5183033058"], false, true],
            ["match", ["get", "id"], ["51473635-FEB8-46B3-9967-12F4BF3D83CA"], false, true],
            ["match", ["get", "id"], ["A56A5BD9-739E-4801-BF00-63041A851C87"], false, true],
            ["match", ["get", "id"], ["DA2FF75A-007B-4579-AF63-B3A6677FCE95"], false, true],
            ["match", ["get", "id"], ["F7A05331-29BF-4EDA-BFE6-EFCE2312C9E8"], false, true],
            ["match", ["get", "id"], ["31974536-21AB-4F20-A682-AF557F582E1E"], false, true],
            ["match", ["get", "id"], ["C48C8A82-395E-4D79-A8FB-D81E32CDFC45"], false, true],
            ["match", ["get", "id"], ["84F05869-23FC-4006-9E28-AAC1FFD34724"], false, true],
            ["match", ["get", "id"], ["20585373-8F6D-411D-9139-716A5F7FF8D8"], false, true],
            ["match", ["get", "id"], ["8EEE241B-B277-4E30-9101-A0330EEAD658"], false, true],
            ["match", ["get", "id"], ["99733DD6-E4AE-482B-9A0F-4C72976D76F0"], false, true],
            ["match", ["get", "id"], ["AAE33EFD-5944-4778-BAAE-A814F71EA607"], false, true],
            ["match", ["get", "id"], ["B0188B82-E343-48CD-8E56-08E14809395F"], false, true],
            ["match", ["get", "id"], ["38129A50-A692-4120-B7FA-C8D787CA1014"], false, true],
            ["match", ["get", "id"], ["074E0A26-0488-4909-8CAA-A11EFADC3D0D"], false, true],
            ["match", ["get", "id"], ["A8A006CF-A4BE-4F15-B83C-BF6F82B55574"], false, true],
            ["match", ["get", "id"], ["DBDC3BF7-E43C-44E4-B303-D8558E6ABCB4"], false, true],
            ["match", ["get", "id"], ["25BC7AB5-366B-4F18-B14C-2132ABC76F7F"], false, true],
            ["match", ["get", "id"], ["D3EA9EB1-9E0E-4B35-AFDC-D05BC8C85E5C"], false, true],
            ["match", ["get", "id"], ["E8218B2E-3A3F-420C-B9B3-54421D02E3E9"], false, true],
            ["match", ["get", "id"], ["1B915BAD-00FE-4D23-8613-44EAA3F5E5AB"], false, true],
            ["match", ["get", "id"], ["926DF728-0B0D-46E5-8633-B813728B56E7"], false, true],
            ["match", ["get", "id"], ["CFDD3667-EF26-4CB2-807E-9EBC8768B91F"], false, true],
            ["match", ["get", "id"], ["76A6A30E-833B-4A52-90BD-B5A89F2F67B5"], false, true],
            ["match", ["get", "id"], ["C6EDAB1A-194B-4B20-9803-6C03DE6B156F"], false, true],
            ["match", ["get", "id"], ["9656DA55-B9E5-462B-A70E-9BFF85A5A138"], false, true],
            ["match", ["get", "id"], ["F44213AD-8A4A-4FE7-8EE2-439005F4EF04"], false, true],
            ["match", ["get", "id"], ["1A7AE5EC-D9CC-4558-912D-687FD75A46C9"], false, true],
            ["match", ["get", "id"], ["F6FDCA49-DB1C-4E3F-A4AC-AE477697EC3B"], false, true],
            ["match", ["get", "id"], ["F33E51A7-609E-4EBB-84BA-03258249FD8E"], false, true],
            ["match", ["get", "id"], ["8C380961-7349-419F-8611-5B6ABA98E278"], false, true],
            ["match", ["get", "id"], ["3FDC2B0D-F5AE-466B-BBF3-D51B612077CD"], false, true],
            ["match", ["get", "id"], ["4DA48C4F-567B-4838-AC03-1DCAE3C7BDFE"], false, true],
            ["match", ["get", "id"], ["1F1745F6-D4CA-4CD3-AD6B-FE1F0F3EA4F6"], false, true],
            ["match", ["get", "id"], ["A9D09C26-8C9D-4DBD-9D48-92446E2BF7E5"], false, true],
            ["match", ["get", "id"], ["AB589C8D-B7F1-43C0-B26C-24E29D7E4B50"], false, true],
            ["match", ["get", "id"], ["BE1E820F-6EBB-4F4E-BBB9-543EBB6F51A8"], false, true],
            ["match", ["get", "id"], ["BEA6ACD1-24BF-425C-9A93-705B1DADE8DC"], false, true],
            ["match", ["get", "id"], ["325A71F1-4DAA-426C-8D00-796BEC6E1FF9"], false, true],
            ["match", ["get", "id"], ["EBD0A97E-EE38-4AD7-B3B4-393B1E461463"], false, true],
            ["match", ["get", "id"], ["340CD6AB-84DF-4070-A521-BD54B24E92A2"], false, true],
            ["match", ["get", "id"], ["F2113216-BB37-4106-A15F-26D2BD73CF86"], false, true],
            ["match", ["get", "id"], ["DB9CE42F-2509-4363-9E81-4276143DE337"], false, true],
            ["match", ["get", "id"], ["DCB20D0A-99E3-451A-BB6E-1AA286E4CC03"], false, true],
            ["match", ["get", "id"], ["6B1FC4A7-09B4-4DFF-ABF6-9443DC36795E"], false, true],
            ["match", ["get", "id"], ["AB57BF15-2489-4AB2-9460-66B69F724719"], false, true],
            ["match", ["get", "id"], ["A2DFCBA7-A718-4740-8737-02137541AAA0"], false, true],
            ["match", ["get", "id"], ["E8B6A721-9EB8-4FE1-9F1E-674F3BA782BC"], false, true],
            ["match", ["get", "id"], ["E1E7A822-EAB7-4B1C-A2D5-B53868F1B424"], false, true],
            ["match", ["get", "id"], ["228C1B58-15CE-4996-A022-15A128D3D5C8"], false, true],
            ["match", ["get", "id"], ["A21163D0-296D-4EF6-ABF7-9726328A588E"], false, true],
            ["match", ["get", "id"], ["B5FEEC64-043A-4858-B8E6-9CBFD33BA20E"], false, true],
            ["match", ["get", "id"], ["39556F1F-A00E-4F08-A5DA-A62E7E83488B"], false, true],
            ["match", ["get", "id"], ["4F7FD507-973D-4A8E-858A-67E3F59007BF"], false, true],
            ["match", ["get", "id"], ["050E7EC6-2255-4D67-A26C-96A0A3160037"], false, true],
            ["match", ["get", "id"], ["19840C03-8780-40D3-9D45-A42EE38960D5"], false, true],
            ["match", ["get", "id"], ["11C18B1E-7FC2-4EB5-8339-6E81979F3C30"], false, true],
            ["match", ["get", "id"], ["033E97D1-5655-4025-BAAC-A4A091F514AD"], false, true],
            ["match", ["get", "id"], ["93138454-0427-4755-90C5-1DBD152AB019"], false, true],
            ["match", ["get", "id"], ["A9BDD7C6-25C4-48C0-ABDB-6B03CFCC8242"], false, true],
            ["match", ["get", "id"], ["86AF149F-BD0F-46F5-9BEA-974CDF3D1A85"], false, true],
            ["match", ["get", "id"], ["5878D3CA-D39D-4FCA-936D-A8053A28C7C5"], false, true],
            ["match", ["get", "id"], ["FE6C557F-ADDA-49BC-8745-FDD3EFDF91A9"], false, true],
            ["match", ["get", "id"], ["43B5CF5F-24E7-4369-B177-A7B34E6C38CA"], false, true],
            ["match", ["get", "id"], ["BEDD643E-9EA3-4A07-A9D3-89895BAD34FD"], false, true],
            ["match", ["get", "id"], ["8CF804EE-B0C4-4173-8BF0-FD3E08EB8F94"], false, true],
            ["match", ["get", "id"], ["A636473A-B0C5-4DF4-91EF-99D3135FD340"], false, true],
            ["match", ["get", "id"], ["30C9399D-4270-47C0-8E2A-CD559B7C9455"], false, true],
            ["match", ["get", "id"], ["24A9EE46-B711-4E81-961C-BE4469C8C3DE"], false, true],
            ["match", ["get", "id"], ["DCE72720-2E4C-4D23-A3C6-1C9C2E73EA8F"], false, true],
            ["match", ["get", "id"], ["9D1D7F89-8774-4419-8642-FAFA9FE183E5"], false, true],
            ["match", ["get", "id"], ["BE7944A4-6154-4DE7-8F26-55093C73D438"], false, true],
            ["match", ["get", "id"], ["37992C8A-CA48-46A7-865B-D3937ED34E11"], false, true],
            ["match", ["get", "id"], ["99B4EB9A-BE1D-4041-85E9-79F2D24A8A65"], false, true],
            ["match", ["get", "id"], ["F6964C72-FAA4-4B9A-9BB9-86ECFFD8354C"], false, true],
            ["match", ["get", "id"], ["DDDFB4F3-C8DC-4789-8F35-3BAC45B12588"], false, true],
            ["match", ["get", "id"], ["42E1F438-B422-40DB-9DA0-6706AB500421"], false, true],
            ["match", ["get", "id"], ["92ED9051-6EAF-4B24-8CE6-36E978F87E67"], false, true],
            ["match", ["get", "id"], ["4D2CCD7E-C893-4E72-9857-2DD192DE4D76"], false, true],
            ["match", ["get", "id"], ["893C4C72-89FB-416D-A33D-D0AF1AA5B6BD"], false, true],
            ["match", ["get", "id"], ["4DAE10E2-2031-4535-9857-35ED5B621136"], false, true],
            ["match", ["get", "id"], ["8A2D13B8-A21F-44C7-B8B9-32278A3DD022"], false, true],
            ["match", ["get", "id"], ["4A74FDE9-130D-4578-AC83-E5355452506B"], false, true],
            ["match", ["get", "id"], ["A5148421-762B-47A8-8BC2-BEFAAF17BB3D"], false, true],
            ["match", ["get", "id"], ["663A1099-1103-4086-934D-4B1139C424B3"], false, true],
            ["match", ["get", "id"], ["02321E49-FD86-49BB-A437-83CDA644B53D"], false, true],
            ["match", ["get", "id"], ["083FEDC3-1299-41F1-9671-F80AB9579171"], false, true],
            ["match", ["get", "id"], ["276C5841-CDAD-4BD7-8F3F-7D4034B55D12"], false, true],
            ["match", ["get", "id"], ["0116B1F3-0879-4B0B-8245-568074AC03E4"], false, true],
            ["match", ["get", "id"], ["3392148C-8D9C-4757-B86E-9C850947FB2D"], false, true],
            ["match", ["get", "id"], ["591E8BEC-2519-4DE6-84A9-9456C4649D75"], false, true],
            ["match", ["get", "id"], ["2C5D0904-2EDE-4C44-A38B-DFE0CC55D157"], false, true],
            ["match", ["get", "id"], ["1B0E7C50-C7D5-47CF-9264-5C2CF08D742F"], false, true],
            ["match", ["get", "id"], ["2B59EA7F-D65C-4E84-A79D-C4EB2EB799AC"], false, true],
            ["match", ["get", "id"], ["AF74B7F4-D284-4161-BC47-5EE3226BB0ED"], false, true],
            ["match", ["get", "id"], ["7771A442-DA01-4BE7-A66E-3DF51F06EA2C"], false, true],
            ["match", ["get", "id"], ["D4E71B28-5021-4F3A-9FD1-7766E60B0C38"], false, true],
            ["match", ["get", "id"], ["2BC3E6A3-97BA-47CD-8CCA-77A80A22353B"], false, true],
            ["match", ["get", "id"], ["B5159817-B064-4D0F-AE83-D21BE30E1B17"], false, true],
            ["match", ["get", "id"], ["898878D3-002B-4483-9690-A278C6249AD5"], false, true],
            ["match", ["get", "id"], ["25B77CDF-F229-4A2E-A55B-881E45884AB0"], false, true],
            ["match", ["get", "id"], ["FF9AD926-110C-4EA3-9D3F-BBB8C09BAEC0"], false, true],
            ["match", ["get", "id"], ["3A70C893-AAAF-4867-8B6E-4B59509A41ED"], false, true],
            ["match", ["get", "id"], ["EF3262FA-5CBF-44CD-AE57-C9FD1D1EDA74"], false, true],
            ["match", ["get", "id"], ["5308A015-1D22-49CF-8367-3D299ECA5D7A"], false, true],
            ["match", ["get", "id"], ["7787161A-BA58-46EF-B045-40B648E38CFC"], false, true],
            ["match", ["get", "id"], ["DFA352B0-BA83-47C8-807B-EB242E4C6A54"], false, true],
            ["match", ["get", "id"], ["A851249C-C3A5-41C9-8CDD-1BAC7597C3B0"], false, true],
            ["match", ["get", "id"], ["D876EB26-DB45-480A-B123-830249FFCD50"], false, true],
            ["match", ["get", "id"], ["0C172C7D-ECFC-46FC-A104-7D2F24D23B2C"], false, true],
            ["match", ["get", "id"], ["BCFB803B-186D-48FF-A85F-8884D5BE2227"], false, true],
            ["match", ["get", "id"], ["22F272DB-90AA-47AF-970F-272002EB275D"], false, true],
            ["match", ["get", "id"], ["DD98761D-A8C4-4E1F-87F5-D4F65F080C5E"], false, true],
            ["match", ["get", "id"], ["083B9AD7-59C0-488B-9D2C-9CA3FB6EE588"], false, true],
            ["match", ["get", "id"], ["4F2771AF-20A5-4E36-B6A6-609E225489F8"], false, true],
            ["match", ["get", "id"], ["E3240AC3-B406-4342-A37B-14E06E83982B"], false, true],
            ["match", ["get", "id"], ["76B865F9-1B01-48E8-8D39-1F7E60DD0B40"], false, true],
            ["match", ["get", "id"], ["28019883-211C-437B-8390-E3F59613262C"], false, true],
            ["match", ["get", "id"], ["8CE5555A-AD2E-4767-9F31-BB467AAF1FA4"], false, true],
            ["match", ["get", "id"], ["FC786AE6-E901-4C8B-8AB5-783E0AA2D11F"], false, true],
            ["match", ["get", "id"], ["3FB5D6EB-1BA1-4A5C-80EE-C222B52DF341"], false, true],
            ["match", ["get", "id"], ["716F1580-7CC8-4D2A-B03A-6F9737709219"], false, true],
            ["match", ["get", "id"], ["85A772DD-DFAD-4550-81A8-D66C29798B7B"], false, true],
            ["match", ["get", "id"], ["A7B3D404-BB03-4485-8B98-3A91755BACFC"], false, true],
            ["match", ["get", "id"], ["6A40FA1C-58C0-4B02-835A-1E6CEA0C0A99"], false, true],
            ["match", ["get", "id"], ["C336B3E8-F132-4CAB-83B1-25055B011753"], false, true],
            ["match", ["get", "id"], ["962838A2-EBCC-4CAF-8CB6-56B2BBC7D513"], false, true],
            ["match", ["get", "id"], ["ACDAE9F5-542A-4739-9AFD-9258F127A0A3"], false, true],
            ["match", ["get", "id"], ["49C84A4A-CCC0-43EA-B921-51315BCA87BD"], false, true],
            ["match", ["get", "id"], ["110F5306-592C-4AA1-9CF0-95D3DE7C3B00"], false, true],
            ["match", ["get", "id"], ["79AD9879-96E0-4218-9329-0B64DB2A6E37"], false, true],
            ["match", ["get", "id"], ["0F9342C0-F30D-418C-A20C-4335DBF2A766"], false, true],
            ["match", ["get", "id"], ["C11D75A5-681F-45B6-B8C9-B9768BC6CB9C"], false, true],
            ["match", ["get", "id"], ["C4DEC98E-76E6-40B3-9802-D773C102AEF0"], false, true],
            ["match", ["get", "id"], ["082BF000-A6A1-4405-B336-BD3B99171784"], false, true],
            ["match", ["get", "id"], ["33D07964-0091-4CCD-9867-33E18C05EB4C"], false, true],
            ["match", ["get", "id"], ["A5AA03F3-888C-4E48-8349-F721E8BAB94C"], false, true],
            ["match", ["get", "id"], ["A1C244FD-D98A-4A5A-AEF6-A2A8B1927CB4"], false, true],
            ["match", ["get", "id"], ["6DC56D70-5319-4FD8-8EFD-811EFFEAF79F"], false, true],
            ["match", ["get", "id"], ["3A26AD91-9551-4663-8EA0-6C89D9E1C5AE"], false, true],
            ["match", ["get", "id"], ["80C26A81-E795-42C6-BF7B-BDB2B56B6906"], false, true],
            ["match", ["get", "id"], ["38F02A2E-8E42-4514-B8FF-52F8281B1BBF"], false, true],
            ["match", ["get", "id"], ["8ABEFFF7-0564-4D8F-93DF-FF178D06FB19"], false, true],
            ["match", ["get", "id"], ["B0F8E04A-D88B-47C6-8810-92F319BB2756"], false, true],
            ["match", ["get", "id"], ["7F3785DC-B755-48CA-B23C-2EE79AE8F0BE"], false, true],
            ["match", ["get", "id"], ["EF1EB109-8744-42A9-A642-CC117241E87B"], false, true],
            ["match", ["get", "id"], ["E7C9C22C-298C-42B9-93E8-39A87D8475D2"], false, true],
            ["match", ["get", "id"], ["66188196-DEB7-4475-A892-437595807972"], false, true],
            ["match", ["get", "id"], ["D59282BE-6ACC-4B2C-B793-6E7805A36767"], false, true],
            ["match", ["get", "id"], ["C15501D1-A052-4152-8836-E9F7255332BF"], false, true],
            ["match", ["get", "id"], ["AFBA00E5-5351-4C5B-A616-D16385BC5E3F"], false, true],
            ["match", ["get", "id"], ["E98E71C7-FDDF-4C7B-84E6-0B9E4CBDDD08"], false, true],
            ["match", ["get", "id"], ["AE9059D7-543F-41DB-B239-56EAFEF7351A"], false, true],
            ["match", ["get", "id"], ["1744A0D1-4861-4A37-8177-7FFAC055230A"], false, true],
            ["match", ["get", "id"], ["81625A90-3597-4537-92F2-42CBEE226288"], false, true],
            ["match", ["get", "id"], ["F895AAF8-8B4B-4812-9C54-42DB650AA63B"], false, true],
            ["match", ["get", "id"], ["286E3C6C-8D6A-4282-8736-AB2F65212DD7"], false, true],
            ["match", ["get", "id"], ["434B4350-D12B-40F8-9D4D-CFBF655D49AA"], false, true],
            ["match", ["get", "id"], ["D2A96DB7-B5E4-4CB6-9791-15B009233AB4"], false, true],
            ["match", ["get", "id"], ["D4ED9FFF-2F92-4827-B911-C53E7026D642"], false, true],
            ["match", ["get", "id"], ["B75F9A7D-B275-41CC-8499-9F2CFEA14272"], false, true],
            ["match", ["get", "id"], ["60C78A68-CD6D-4B58-B7B1-591A65956D71"], false, true],
            ["match", ["get", "id"], ["FC418B30-AFFA-4E50-9BDA-12505832785F"], false, true],
            ["match", ["get", "id"], ["242FFD21-0065-400B-BD27-3A4FAC5833B7"], false, true],
            ["match", ["get", "id"], ["4B775FD3-9B1C-4FEF-85EF-5DE6209CB190"], false, true],
            ["match", ["get", "id"], ["F049A04E-6FC0-463D-A8E7-CE1A4A0E6B80"], false, true],
            ["match", ["get", "id"], ["9BC46203-4954-4B2E-AADA-7439D7D3BB46"], false, true],
            ["match", ["get", "id"], ["AAC48A59-809B-4A90-BD04-E1A6BABEF759"], false, true],
            ["match", ["get", "id"], ["46E91569-5635-4A18-924E-C03C7C9D48FF"], false, true],
            ["match", ["get", "id"], ["D27D29CB-EA10-4526-A55B-F30A50D57DDE"], false, true],
            ["match", ["get", "id"], ["59D2B25C-DF8A-4F50-95EF-B76944324E95"], false, true],
            ["match", ["get", "id"], ["6A2E5844-8ECB-406A-A850-BD3670D3F853"], false, true],
            ["match", ["get", "id"], ["8FF11D10-62D7-4324-845D-46717ECE9B46"], false, true],
            ["match", ["get", "id"], ["4D33F1B7-EE31-40C4-9C45-D2EBF505FEF4"], false, true],
            ["match", ["get", "id"], ["E50C4B71-6A69-408B-B209-561FCF303A5B"], false, true],
            ["match", ["get", "id"], ["12967604-F633-40CA-9E3E-DD51A7D72592"], false, true],
            ["match", ["get", "id"], ["0A287116-E2A5-4CFE-989D-950AF1CD87DA"], false, true],
            ["match", ["get", "id"], ["B8DD5199-0DB7-48E3-B0F7-DF34934BBD6C"], false, true],
            ["match", ["get", "id"], ["C1531764-E093-4D09-B140-EC15314CF8D3"], false, true],
            ["match", ["get", "id"], ["EEBE71F7-FCB2-4963-AE0D-B41D7CFFE538"], false, true],
            ["match", ["get", "id"], ["CC0EC79F-6C5A-4952-AA43-B8AB1A8A081E"], false, true],
            ["match", ["get", "id"], ["69644645-6FF7-411E-AB21-EF0BBB002696"], false, true],
            ["match", ["get", "id"], ["02BAA0C9-4096-4019-BAC2-E10246F9B9F8"], false, true],
            ["match", ["get", "id"], ["C7895897-7C25-4C9B-B087-D79BF1AAA3D5"], false, true],
            ["match", ["get", "id"], ["42A636D7-D177-4DE1-B632-899C06E7AFE8"], false, true],
            ["match", ["get", "id"], ["5911D8D5-B70B-4094-BB3E-6179B9A3A62F"], false, true],
            ["match", ["get", "id"], ["20944D7E-F6A0-443C-9FF8-CDBD5DBE1F6E"], false, true],
            ["match", ["get", "id"], ["58563232-2F0C-46EB-8EC7-FCFEEF846BB0"], false, true],
            ["match", ["get", "id"], ["7D640C87-160F-4D7F-91CC-FF044A7EA77E"], false, true],
            ["match", ["get", "id"], ["21D25114-F4B2-4E35-B8DD-CCF14C595870"], false, true],
            ["match", ["get", "id"], ["99AD6932-212D-46D5-A317-3BE350B653A2"], false, true],
            ["match", ["get", "id"], ["73C621D5-8B28-4A1C-9328-A05C88CE86FA"], false, true],
            ["match", ["get", "id"], ["53E4742B-73F2-4115-A44F-9136D3998327"], false, true],
            ["match", ["get", "id"], ["451C11DF-28C0-474D-9816-4ED0FF702608"], false, true],
            ["match", ["get", "id"], ["834EAC93-E68C-4C26-8624-96F13A626B0D"], false, true],
            ["match", ["get", "id"], ["5ED6F1EA-F671-4099-8F8D-EC6F76BB4261"], false, true],
            ["match", ["get", "id"], ["52F645D7-A069-4E54-9F62-D0EDBCE50D55"], false, true],
            ["match", ["get", "id"], ["D4B8537C-5BA5-40D4-B114-664F1AE08073"], false, true],
            ["match", ["get", "id"], ["B6F3566D-6C23-4AE6-95A4-1A24FF93B49C"], false, true],
            ["match", ["get", "id"], ["EABEC78D-4703-47C5-8F17-FCFE00EB42D6"], false, true],
            ["match", ["get", "id"], ["52BBA844-F89F-44A0-A8B3-829CC84C68A6"], false, true],
            ["match", ["get", "id"], ["9F1DD2DA-F2EC-4778-B795-5BA94E1F1CE2"], false, true],
            ["match", ["get", "id"], ["F92B5F0B-AB38-4F85-AC9F-3D1395E633DF"], false, true],
            ["match", ["get", "id"], ["44020E46-A713-412E-B977-31C4DF66C028"], false, true],
            ["match", ["get", "id"], ["6B200CA2-72D5-4000-871E-B7D3DF5618EC"], false, true],
            ["match", ["get", "id"], ["52787F82-F726-4C96-8BDD-6BD787A4ACFC"], false, true],
            ["match", ["get", "id"], ["77C7B9CF-75EF-413E-AAFC-8367AE9CBDBA"], false, true],
            ["match", ["get", "id"], ["DDAE8E0C-5F37-4029-A920-DE9EC3FF6B14"], false, true],
            ["match", ["get", "id"], ["1DBD5B79-10C8-47C6-A521-0B08A20F0A46"], false, true],
            ["match", ["get", "id"], ["BD4DE04C-8ECF-486C-AD36-C4E8585C8C35"], false, true],
            ["match", ["get", "id"], ["A63573B1-34B5-4A68-8F47-E9A7C4670153"], false, true],
            ["match", ["get", "id"], ["DA1B7611-4804-436D-81F1-0631609789CC"], false, true],
            ["match", ["get", "id"], ["A8336EFD-7DE0-495E-B382-5E6BC03152E0"], false, true],
            ["match", ["get", "id"], ["BF086BBE-159D-4C88-BB12-7AB5B76C46A6"], false, true],
            ["match", ["get", "id"], ["8D03E069-FB19-494E-A03A-9C73A2A3B105"], false, true],
            ["match", ["get", "id"], ["4952A669-7F56-4A68-8014-19E0B014DC64"], false, true],
            ["match", ["get", "id"], ["0B80C569-C44D-4751-BDAB-89A8A5ACDE20"], false, true],
            ["match", ["get", "id"], ["A1C9A1EE-3F34-4A54-8F2C-011E17DCC156"], false, true],
            ["match", ["get", "id"], ["30BB3A94-3A74-4E6C-A072-012DDAFE4C56"], false, true],
            ["match", ["get", "id"], ["D35AD52D-DE18-4504-8335-04FECC8E52C9"], false, true],
            ["match", ["get", "id"], ["8E99647A-063B-49D7-AAD6-056DD45C80DB"], false, true],
            ["match", ["get", "id"], ["44EE56F4-9685-4B14-9BA1-05E54DE027EF"], false, true],
            ["match", ["get", "id"], ["48CD5342-41D5-49E6-9C36-07B25090FC6F"], false, true],
            ["match", ["get", "id"], ["8F7035CD-F76C-4A33-BFB7-080A3E86F301"], false, true],
            ["match", ["get", "id"], ["9DFFDE23-BC90-4528-BF53-083821AE78CD"], false, true],
            ["match", ["get", "id"], ["8E086633-154C-461E-9F50-097D27F5135F"], false, true],
            ["match", ["get", "id"], ["15EA5357-3391-40B3-BE93-09F111F495B2"], false, true],
            ["match", ["get", "id"], ["E9F416A6-B6D6-49D7-9C84-0A1C81864C37"], false, true],
            ["match", ["get", "id"], ["D7E279D2-FA1F-4E67-8C1C-0A42092FBE8B"], false, true],
            ["match", ["get", "id"], ["614CEB8B-0551-48A0-82B2-0AAD854DB3B9"], false, true],
            ["match", ["get", "id"], ["4C6604F7-E3DB-4314-B165-0BBF9684745C"], false, true],
            ["match", ["get", "id"], ["DD588C5E-AA3D-478B-980D-0C733E77A8D1"], false, true],
            ["match", ["get", "id"], ["6D7F6030-CC72-4FB7-A056-0C7DCF4BFF76"], false, true],
            ["match", ["get", "id"], ["7244B63D-5741-456A-A0EC-0D6C5F29F903"], false, true],
            ["match", ["get", "id"], ["96C11B02-D1FD-4DF3-B346-0DE2922E5742"], false, true],
            ["match", ["get", "id"], ["1CEEA56A-FCCB-4931-B623-0E4F0AE9095A"], false, true],
            ["match", ["get", "id"], ["FD124647-A6B2-4635-87E6-1137E26E61E2"], false, true],
            ["match", ["get", "id"], ["A0BA74FE-61F6-4A77-A172-1230733441BA"], false, true],
            ["match", ["get", "id"], ["31370B98-2D8F-4251-A038-15B2ACEA2054"], false, true],
            ["match", ["get", "id"], ["1EEA8B08-36DF-4C60-97FA-1658C33F78F2"], false, true],
            ["match", ["get", "id"], ["209B98CD-3DE5-4AB8-AF55-16DB922E2CD3"], false, true],
            ["match", ["get", "id"], ["BC0F407B-03D9-4903-87F8-186EC9201D9C"], false, true],
            ["match", ["get", "id"], ["24CA41B6-A931-4A8A-9B45-19F50B406EAA"], false, true],
            ["match", ["get", "id"], ["C7AC74F4-DA19-44DB-884C-1D474D00B061"], false, true],
            ["match", ["get", "id"], ["837033EB-8463-482D-9D7E-20832163B989"], false, true],
            ["match", ["get", "id"], ["14C2EA73-77B7-4284-8DED-22CFD4BAD0D8"], false, true],
            ["match", ["get", "id"], ["C568A321-F09B-4976-A8C1-236783447B8E"], false, true],
            ["match", ["get", "id"], ["CC5981FC-7E02-431C-9429-2410E59C8239"], false, true],
            ["match", ["get", "id"], ["1A0F006D-0FCE-40F2-8090-2414516CF686"], false, true],
            ["match", ["get", "id"], ["A3E05FED-AAB6-4505-AB25-25B222079F72"], false, true],
            ["match", ["get", "id"], ["48A6A492-A85B-4870-A8C2-2629E686F960"], false, true],
            ["match", ["get", "id"], ["EF032873-73DE-4A2D-A803-2660753C3C36"], false, true],
            ["match", ["get", "id"], ["E9E369FF-2ACE-46CF-9CC9-271455A8BD19"], false, true],
            ["match", ["get", "id"], ["804E8D53-4FA6-46E2-99E8-2A10FB002E1D"], false, true],
            ["match", ["get", "id"], ["3FD17302-7D3A-4885-99CE-2A3AFCE2C030"], false, true],
            ["match", ["get", "id"], ["B8ABD694-BB63-4DD1-8F52-2D047ECD9EB5"], false, true],
            ["match", ["get", "id"], ["D164CE7C-77EC-4125-ADF8-2D22B473B2E2"], false, true],
            ["match", ["get", "id"], ["8D32C610-AD48-4E42-A84A-2FAEA49CB7F5"], false, true],
            ["match", ["get", "id"], ["AD371B0C-7C8B-4891-B8B9-2FD1C9102B17"], false, true],
            ["match", ["get", "id"], ["E534EF8E-FD61-4686-BAE1-309CA6D998A0"], false, true],
            ["match", ["get", "id"], ["778DEC4A-0F49-474F-8693-31E0B947AD3C"], false, true],
            ["match", ["get", "id"], ["3A263BF5-E378-4540-8F3E-325354D3A4B5"], false, true],
            ["match", ["get", "id"], ["01B4313B-27C4-486D-9FDE-33460509CDF8"], false, true],
            ["match", ["get", "id"], ["38DF8F02-9B72-47E6-8BBF-3425802DDB41"], false, true],
            ["match", ["get", "id"], ["D57245EA-012E-47A9-965A-34A9F15DB669"], false, true],
            ["match", ["get", "id"], ["779E2414-F8EB-4625-BFC7-35BEE37AFB49"], false, true],
            ["match", ["get", "id"], ["A0842BBC-DA7E-4B4F-B342-36250B889A4E"], false, true],
            ["match", ["get", "id"], ["07DF0005-FA3B-4221-AA2B-375164E6E37A"], false, true],
            ["match", ["get", "id"], ["C18D5319-141A-45B4-B0A2-37A4556836A3"], false, true],
            ["match", ["get", "id"], ["5DE4DF77-6728-40B3-8CA6-38DA13EB35DD"], false, true],
            ["match", ["get", "id"], ["F63B4885-6DA7-4C33-BEA1-391BBD78E6E4"], false, true],
            ["match", ["get", "id"], ["09C6A385-52B1-42E9-B465-39D2820D81FE"], false, true],
            ["match", ["get", "id"], ["57EF333B-4566-43BE-93F0-3BD577C40AD9"], false, true],
            ["match", ["get", "id"], ["4E002E78-DE18-40A2-8A7A-3FE2EED63784"], false, true],
            ["match", ["get", "id"], ["B8A6594B-A3C6-49EA-A5C5-40357D90FFB5"], false, true],
            ["match", ["get", "id"], ["23D74457-7F6A-406C-832A-409AE432AD84"], false, true],
            ["match", ["get", "id"], ["920EEDB8-5ADE-450C-8963-4157181585DC"], false, true],
            ["match", ["get", "id"], ["7F26AAB9-C502-4AC2-B49C-41AFCB06DA6E"], false, true],
            ["match", ["get", "id"], ["CEAFE5AC-5B8F-4E7B-9A04-42409C1EDB0E"], false, true],
            ["match", ["get", "id"], ["C3487F19-E4F4-4469-9766-42F318466914"], false, true],
            ["match", ["get", "id"], ["89FCBDA2-08F1-4A19-B9A8-442B8C430AF3"], false, true],
            ["match", ["get", "id"], ["6B2A25FA-97FC-416A-818A-445EFDF252C6"], false, true],
            ["match", ["get", "id"], ["A25CB5D2-7AE7-4BEE-9954-45F03DCB15AF"], false, true],
            ["match", ["get", "id"], ["BEF05C09-DAD7-4093-8C65-464A339F47B9"], false, true],
            ["match", ["get", "id"], ["90CEECDA-B137-425B-A577-46DECD888C19"], false, true],
            ["match", ["get", "id"], ["9DA71EB0-4CA2-4DCE-803D-47AFE8C03D11"], false, true],
            ["match", ["get", "id"], ["68D46C48-6B06-43C9-A1C7-48E91DAF1A5A"], false, true],
            ["match", ["get", "id"], ["81696969-5E3F-4A04-9CD9-4B0DE702E6E0"], false, true],
            ["match", ["get", "id"], ["EC2E5337-72BD-4A64-8547-4B74D6453C4F"], false, true],
            ["match", ["get", "id"], ["E4E1EFF5-B7EE-4E6D-A20E-4C89719B2878"], false, true],
            ["match", ["get", "id"], ["E146FA9A-0041-4D94-A556-4E7D5822BC3C"], false, true],
            ["match", ["get", "id"], ["C12469D0-304C-4C27-9223-4EF3DEA34CE7"], false, true],
            ["match", ["get", "id"], ["B6527102-F92F-40D6-B232-505B516B6639"], false, true],
            ["match", ["get", "id"], ["16D5288A-A1C9-477F-B949-50D7028B4B4C"], false, true],
            ["match", ["get", "id"], ["B6ABE364-180F-4F89-9000-51A063115330"], false, true],
            ["match", ["get", "id"], ["7EB78C8E-8616-4240-84C6-52070DFDB10E"], false, true],
            ["match", ["get", "id"], ["B99FF0F4-0E5D-4F29-95B8-520FCFF859A4"], false, true],
            ["match", ["get", "id"], ["4C25C2DC-BDD9-4F22-A344-53D01791F239"], false, true],
            ["match", ["get", "id"], ["15747743-821A-4AC2-94B9-5468EC42DAF9"], false, true],
            ["match", ["get", "id"], ["8BB05C81-EF0B-433E-9886-54B7EB480247"], false, true],
            ["match", ["get", "id"], ["B0E18366-8B0A-4B02-A0EF-54DEEF3CA9FB"], false, true],
            ["match", ["get", "id"], ["DBA58A4D-BE97-46BE-B772-560E4DB2B0FD"], false, true],
            ["match", ["get", "id"], ["CD4B2C8F-AB4B-4232-BBB7-57A4C45ED8D0"], false, true],
            ["match", ["get", "id"], ["FD6CF52F-ED77-4DE6-B6F3-57B0B1AFDCD8"], false, true],
            ["match", ["get", "id"], ["B68F5980-3167-4D0F-ABD5-57D1D93C8A6D"], false, true],
            ["match", ["get", "id"], ["70D816FE-2A70-4E0F-8812-57E1DE643068"], false, true],
            ["match", ["get", "id"], ["9EF7F935-A210-4752-AAF6-597006072278"], false, true],
            ["match", ["get", "id"], ["80BE5A92-31C5-4BA5-9E94-5B9D4D6C3D77"], false, true],
            ["match", ["get", "id"], ["443154E2-F15D-4767-A750-5BD9B6D2369A"], false, true],
            ["match", ["get", "id"], ["8B6608E6-758E-48DA-94FC-5BE71E6BDAE6"], false, true],
            ["match", ["get", "id"], ["9E854AAF-5F28-48BC-B374-5DA9008C0A29"], false, true],
            ["match", ["get", "id"], ["BBDFEAD4-98E6-41F2-8BC7-5E9E7C87CA9C"], false, true],
            ["match", ["get", "id"], ["962C40B8-FE99-46D9-8FFA-5EFD29290F3A"], false, true],
            ["match", ["get", "id"], ["A3832E0D-820E-4B84-965F-60823A83D9F0"], false, true],
            ["match", ["get", "id"], ["54DE2C35-B952-4FC2-896A-60A97E7B3C61"], false, true],
            ["match", ["get", "id"], ["E7357EA9-E7AE-4F05-8B01-61278A7ED73D"], false, true],
            ["match", ["get", "id"], ["38E48E34-1582-4D8B-B876-61544BDE7918"], false, true],
            ["match", ["get", "id"], ["7142F896-6115-42C1-B0F9-621B01C16BA9"], false, true],
            ["match", ["get", "id"], ["0B339049-AB85-495F-8BA8-628785FB8966"], false, true],
            ["match", ["get", "id"], ["F2D7FDF1-BC30-4C6F-BC34-64DFDF795EDF"], false, true],
            ["match", ["get", "id"], ["235CAD03-84EE-4516-9322-64FAD74FDBD5"], false, true],
            ["match", ["get", "id"], ["3C49D8E7-DC5A-44B9-951F-65611AF1E15E"], false, true],
            ["match", ["get", "id"], ["D49E928C-6352-4725-8D72-664E62CB8DBF"], false, true],
            ["match", ["get", "id"], ["90027E5E-E95B-4324-946C-670490E2717D"], false, true],
            ["match", ["get", "id"], ["3412C2C9-49AA-476A-AD22-6918503EA8CD"], false, true],
            ["match", ["get", "id"], ["0561CE28-41B1-45E9-9031-692D0C84EE31"], false, true],
            ["match", ["get", "id"], ["9DD3CCE4-F427-4C7D-A244-6B22354EF16B"], false, true],
            ["match", ["get", "id"], ["0463F327-06B4-4959-A9D2-6C4CE9177778"], false, true],
            ["match", ["get", "id"], ["E8BC5859-7C05-4E32-B57B-6CDD1ADA1603"], false, true],
            ["match", ["get", "id"], ["4054C384-0EF2-494C-A853-6F0C8FE44E5D"], false, true],
            ["match", ["get", "id"], ["0DF1F434-FD11-469B-ACA2-731AE38E582D"], false, true],
            ["match", ["get", "id"], ["4D590E99-1A8D-4A40-B515-7719E69EE5DF"], false, true],
            ["match", ["get", "id"], ["B0B3B4FC-6523-4DC5-A491-788A7B34FDC7"], false, true],
            ["match", ["get", "id"], ["81B99EAB-CF4B-4CF7-A3E4-798412F4E095"], false, true],
            ["match", ["get", "id"], ["E609708E-55DE-4A7E-92ED-7B1D56CE852A"], false, true],
            ["match", ["get", "id"], ["279F157B-087D-4D83-AD0E-7B441C8184D0"], false, true],
            ["match", ["get", "id"], ["262AB1A0-CEA5-4F17-A620-7D422F1DC3EF"], false, true],
            ["match", ["get", "id"], ["99F422F8-7E6F-40F8-9045-7D674F39776B"], false, true],
            ["match", ["get", "id"], ["79C3E14E-1271-4339-A557-7E1BE9B2716C"], false, true],
            ["match", ["get", "id"], ["2FA3D05E-9D6F-4A1D-93CA-7E7E87D6D141"], false, true],
            ["match", ["get", "id"], ["826579CE-CB4E-4125-AC69-7E9E6B02E458"], false, true],
            ["match", ["get", "id"], ["2B49249B-8713-4FA5-B119-7F7FEA33E568"], false, true],
            ["match", ["get", "id"], ["5D1AE646-6BE6-4C14-A02A-80B5A8B5B4B1"], false, true],
            ["match", ["get", "id"], ["99970562-49E3-4A5F-99C7-83237A41A0D3"], false, true],
            ["match", ["get", "id"], ["CDDB8E23-4393-4CED-9122-8545712AEB6B"], false, true],
            ["match", ["get", "id"], ["2BC021F6-B85F-4E05-89CD-85746924205F"], false, true],
            ["match", ["get", "id"], ["A8F0B553-BA87-4694-B6E4-89170B610AA8"], false, true],
            ["match", ["get", "id"], ["DA06751F-84FE-4588-922B-8AA976CAAA50"], false, true],
            ["match", ["get", "id"], ["E7DA139F-05EC-4A8D-9DE5-8B9AFC4F9403"], false, true],
            ["match", ["get", "id"], ["0D9FF7ED-8554-4D6C-B45A-8BE227739D87"], false, true],
            ["match", ["get", "id"], ["9C278387-F147-43A9-9CFA-8BED4279E9E5"], false, true],
            ["match", ["get", "id"], ["30C43B2C-CC3F-48C7-B0BB-8C1CA157F372"], false, true],
            ["match", ["get", "id"], ["21474224-BD24-4993-9BAB-8C672C1B4294"], false, true],
            ["match", ["get", "id"], ["5D90229D-ECAE-4472-84EA-8CBEA0C19E68"], false, true],
            ["match", ["get", "id"], ["EC4197C7-722F-44DB-930C-8FC057E3C4AA"], false, true],
            ["match", ["get", "id"], ["A8162CE5-6DA4-414C-B08A-9158F4B52BB0"], false, true],
            ["match", ["get", "id"], ["9BDBE4EF-02D9-415D-A884-91A3ED673129"], false, true],
            ["match", ["get", "id"], ["E7387DCF-DD92-497F-BDB5-91D8B002479D"], false, true],
            ["match", ["get", "id"], ["C9B95715-E652-4F31-8218-9515F7F24EAD"], false, true],
            ["match", ["get", "id"], ["957B1448-E558-4A0B-8EE3-97D9DFD958FC"], false, true],
            ["match", ["get", "id"], ["7D1DEE51-92EB-4FFF-A636-980B1231BCC2"], false, true],
            ["match", ["get", "id"], ["DECE7FF3-E788-41A5-BBD9-985052322130"], false, true],
            ["match", ["get", "id"], ["99BDC5E5-A7A8-4139-AE51-998A88E08532"], false, true],
            ["match", ["get", "id"], ["6A3922F7-800D-4327-B8DB-9B7F2BE1006E"], false, true],
            ["match", ["get", "id"], ["9CE62F37-AF62-4489-9D4B-9C02BB7467F5"], false, true],
            ["match", ["get", "id"], ["2110FA15-8C81-42E2-A724-9C18177DEFFB"], false, true],
            ["match", ["get", "id"], ["AA867F40-A1E3-4422-AE49-9C988D02E107"], false, true],
            ["match", ["get", "id"], ["5EF10263-7820-4010-9564-9D529353F758"], false, true],
            ["match", ["get", "id"], ["BD8529AA-0872-40DE-9EE7-9E2D8183ECC2"], false, true],
            ["match", ["get", "id"], ["7BB3EBCC-2BE2-4B18-8611-9E8ED33A6F48"], false, true],
            ["match", ["get", "id"], ["3B84CD61-3385-422C-BFE1-A04F3CC5C584"], false, true],
            ["match", ["get", "id"], ["50DD9401-CA90-47AB-8E7A-A1E66B05051E"], false, true],
            ["match", ["get", "id"], ["B85907EE-A660-4885-AEE7-A42B946A3488"], false, true],
            ["match", ["get", "id"], ["7148FE14-A453-44B5-ABBE-A5963518D815"], false, true],
            ["match", ["get", "id"], ["A0B5E784-7BC0-4501-8092-A640F508EB3F"], false, true],
            ["match", ["get", "id"], ["45C0ED34-A281-41A2-BFC9-A6B4DAE6C18E"], false, true],
            ["match", ["get", "id"], ["565DAFB9-5329-42D8-A6D7-A6B81204449C"], false, true],
            ["match", ["get", "id"], ["F3A16146-C9E1-45A9-A015-A6DEFFC627CA"], false, true],
            ["match", ["get", "id"], ["3AD94E97-F8A1-4CBF-B76F-A727C405063F"], false, true],
            ["match", ["get", "id"], ["DD2D7A98-4D58-4E23-9B5B-A74B67B23796"], false, true],
            ["match", ["get", "id"], ["11A64668-9FDA-426A-874F-A7DF9780A25C"], false, true],
            ["match", ["get", "id"], ["38DC6C01-5FD9-479A-80BE-A9CA23E7C3E3"], false, true],
            ["match", ["get", "id"], ["06B31CBB-03F0-42B5-A044-AB93FA89A079"], false, true],
            ["match", ["get", "id"], ["0D07AD99-E5D7-4AA5-AD67-AD0E7063F4D2"], false, true],
            ["match", ["get", "id"], ["90E0CE1D-D78C-4B5B-84FE-AD127A0B958D"], false, true],
            ["match", ["get", "id"], ["A9926C75-A14D-48D8-B0F3-AD26FD0DD276"], false, true],
            ["match", ["get", "id"], ["C6687993-A578-459F-BC4F-AE94145242A5"], false, true],
            ["match", ["get", "id"], ["046D1FA3-2A67-4F8A-B2A8-B1704D8C15FC"], false, true],
            ["match", ["get", "id"], ["C355FB08-540A-4FAE-B950-B33B8E2F5DF0"], false, true],
            ["match", ["get", "id"], ["2A312887-FF93-4299-B7C6-B376BB7B825F"], false, true],
            ["match", ["get", "id"], ["17E6578E-FDF4-4BF9-BE03-B4157A1C2CF0"], false, true],
            ["match", ["get", "id"], ["4FB84624-C80D-42AC-AE66-B4786FAEF1E4"], false, true],
            ["match", ["get", "id"], ["8478A012-39C8-4F9A-B97A-B4AE59D54B66"], false, true],
            ["match", ["get", "id"], ["B9A3304D-0DD5-4A2F-8F17-B69FCD082959"], false, true],
            ["match", ["get", "id"], ["04FBB144-3DC2-4C12-97FD-B71D1C8CA31B"], false, true],
            ["match", ["get", "id"], ["1384F026-8695-46F2-B076-B7A449544883"], false, true],
            ["match", ["get", "id"], ["C3D5620B-5528-4065-BD79-B7D4EF3AD4C8"], false, true],
            ["match", ["get", "id"], ["88EB4562-DF7C-4E9F-B3C0-B897925BF394"], false, true],
            ["match", ["get", "id"], ["7C45E487-53D3-4A9A-A8E6-BA4A716C7769"], false, true],
            ["match", ["get", "id"], ["3E0DD696-28E0-46BE-911B-BACDAC30BF61"], false, true],
            ["match", ["get", "id"], ["C8A784A0-6464-4BA1-B7BE-BC367ADE1028"], false, true],
            ["match", ["get", "id"], ["92E9431A-08C9-49F8-A9BD-BD38D36EAF75"], false, true],
            ["match", ["get", "id"], ["370DD092-EF9A-4791-BCE9-BE187A55DC45"], false, true],
            ["match", ["get", "id"], ["DE1AEBFC-976E-4CED-ABE2-BF2F633D242C"], false, true],
            ["match", ["get", "id"], ["EE9142B4-5868-490B-AB4A-BF64BFFC27F2"], false, true],
            ["match", ["get", "id"], ["F0C940F3-9862-43D6-8088-BFAF7838C16C"], false, true],
            ["match", ["get", "id"], ["5656FE8A-838A-471E-9B57-BFDC2D7BF696"], false, true],
            ["match", ["get", "id"], ["BA7BF0C8-F519-48FF-8263-C00010D64B77"], false, true],
            ["match", ["get", "id"], ["4B38711F-098B-4978-A51E-C0C86E08C031"], false, true],
            ["match", ["get", "id"], ["119A0201-B206-4316-BC9B-C0CD9753582B"], false, true],
            ["match", ["get", "id"], ["3FC95C1C-C3D5-416D-A83D-C1E42C129DFA"], false, true],
            ["match", ["get", "id"], ["D496CC59-14A3-4B8B-A887-C254BD3015C4"], false, true],
            ["match", ["get", "id"], ["455DD337-ACEE-417E-9B9B-C28E1E7122A5"], false, true],
            ["match", ["get", "id"], ["6C959296-0BD4-40FE-9566-C2AB5B0C5DF4"], false, true],
            ["match", ["get", "id"], ["E8FE8026-61F8-4091-999E-C2D5CCC91833"], false, true],
            ["match", ["get", "id"], ["EDACE1A1-789E-4A03-93C0-C368F65CCBDB"], false, true],
            ["match", ["get", "id"], ["7832FD59-EE01-4D7D-A687-C45D0BE48F88"], false, true],
            ["match", ["get", "id"], ["DE71E198-C1DA-4B58-9AE5-C50B1E54CE5F"], false, true],
            ["match", ["get", "id"], ["B2CC61BF-C53A-42D4-809A-C55A826B6DBA"], false, true],
            ["match", ["get", "id"], ["78017ABE-77F8-476F-B82A-CA3E5526AE31"], false, true],
            ["match", ["get", "id"], ["66985086-57FA-4D22-AB3C-CB2E9A5AACEF"], false, true],
            ["match", ["get", "id"], ["4AAD55D3-57F5-4DDA-B3D1-CB92488B6A3E"], false, true],
            ["match", ["get", "id"], ["0EC3C5EE-4B05-438B-AFD8-CD57771F8BD7"], false, true],
            ["match", ["get", "id"], ["0C4D25E2-EF71-48EA-A5CD-CF6C1D988744"], false, true],
            ["match", ["get", "id"], ["0FDD5FFE-1AE1-46FF-9A93-CF710B368149"], false, true],
            ["match", ["get", "id"], ["A5B7E535-48E7-481B-9923-D234D06BAAE3"], false, true],
            ["match", ["get", "id"], ["67BAD35A-D755-439D-AEDC-D3BA3BFA1EF7"], false, true],
            ["match", ["get", "id"], ["4EC8177A-79C9-455E-A307-D44151C09969"], false, true],
            ["match", ["get", "id"], ["104347DE-E408-4686-A16B-D6FD20798170"], false, true],
            ["match", ["get", "id"], ["A335117E-F5FB-4BBE-9405-D8286F006753"], false, true],
            ["match", ["get", "id"], ["B3BDE0D8-70A3-4DAD-91AF-D882E6593D88"], false, true],
            ["match", ["get", "id"], ["D5C9778E-719A-43A3-8479-DA8E1F11ED03"], false, true],
            ["match", ["get", "id"], ["6727F290-E9D2-4715-909E-DDD52C4A1493"], false, true],
            ["match", ["get", "id"], ["B9E07BBB-0AAC-46BC-88F7-E0A132B327BA"], false, true],
            ["match", ["get", "id"], ["54A7693B-A9B5-42E4-86E8-E10D0B75384E"], false, true],
            ["match", ["get", "id"], ["E7051B26-9A48-4E7B-BD76-E1CAE2F0C25E"], false, true],
            ["match", ["get", "id"], ["C41E59E9-4DAF-43CD-B417-E21184461692"], false, true],
            ["match", ["get", "id"], ["96FE26A5-D377-4560-AF14-E434410EE248"], false, true],
            ["match", ["get", "id"], ["232D0C24-BBDA-48E6-99BE-E4BA8DF00B58"], false, true],
            ["match", ["get", "id"], ["73EC55C6-8319-4CDB-AB32-E6629AA5C171"], false, true],
            ["match", ["get", "id"], ["E0EF0123-D7FA-42F0-A0B7-E7DACC7C38D5"], false, true],
            ["match", ["get", "id"], ["4C05B426-2044-423A-A116-E8CAEF2A02AC"], false, true],
            ["match", ["get", "id"], ["2680AD38-F5CC-44A6-9A66-E99DE67E1EA0"], false, true],
            ["match", ["get", "id"], ["3E7D5EDA-58C2-4B61-A5F8-EDC56DBDDE66"], false, true],
            ["match", ["get", "id"], ["F1D873FC-4A83-417D-8043-EDECFD4F04C2"], false, true],
            ["match", ["get", "id"], ["C4AE1369-9C27-4E56-A374-EE4EE627CC61"], false, true],
            ["match", ["get", "id"], ["3D6C48B6-D305-403B-A263-EFBE7CAAC335"], false, true],
            ["match", ["get", "id"], ["4F28E974-6DDF-4E5A-A00C-F0A8661ED12F"], false, true],
            ["match", ["get", "id"], ["E241D589-B529-40AC-BCB9-F1584802811C"], false, true],
            ["match", ["get", "id"], ["D7A8B6D8-BA66-4D1D-9306-F2499A2B84E4"], false, true],
            ["match", ["get", "id"], ["8C27130E-D10D-4CD0-8526-F25FF987444F"], false, true],
            ["match", ["get", "id"], ["3D73071A-E85B-4920-9FCD-F30594D6D4B9"], false, true],
            ["match", ["get", "id"], ["034988E3-FA1B-4A90-AA61-F3B66F134239"], false, true],
            ["match", ["get", "id"], ["CEAF23EC-CEEB-4E5B-AA2D-F598F88295F0"], false, true],
            ["match", ["get", "id"], ["1C17FAFA-7AD3-4791-A4EA-F5C8059B9E67"], false, true],
            ["match", ["get", "id"], ["99CFD4A5-87A0-4CA3-AD0E-F6578DC68482"], false, true],
            ["match", ["get", "id"], ["AA23BF2F-B879-4219-94A7-F6F18F11683D"], false, true],
            ["match", ["get", "id"], ["C84A3CF1-A59A-412A-A468-F7572BA7B22B"], false, true],
            ["match", ["get", "id"], ["9CD9D463-562F-429A-B8D0-F80D425177E6"], false, true],
            ["match", ["get", "id"], ["4E062837-3346-40EF-89AB-F8BCD25902A2"], false, true],
            ["match", ["get", "id"], ["772062F3-6296-4773-8C30-F91FF0D391A4"], false, true],
            ["match", ["get", "id"], ["ED2FC0E7-A75A-4D71-BA6A-F980690F6F12"], false, true],
            ["match", ["get", "id"], ["54FB4D08-769F-4236-8542-FA922851CEB2"], false, true],
            ["match", ["get", "id"], ["4D7D67CF-487B-4945-A83E-FB01D214D6FF"], false, true],
            ["match", ["get", "id"], ["0D10DBB0-109E-4F30-99DA-FD27623083C0"], false, true],
            ["match", ["get", "id"], ["AA504DA0-31E3-4DAD-857F-FD769A945F9D"], false, true],
            ["match", ["get", "id"], ["C139E6CC-2424-4938-8510-FDD989055E11"], false, true],
            ["match", ["get", "id"], ["E02BFDD9-C880-4F19-9819-FECCD4F79346"], false, true],
            ["match", ["get", "id"], ["4107B1EE-B5B3-46B3-BCE0-FEE9F4441D18"], false, true],
            ["match", ["get", "id"], ["52A9EB90-9367-4C6C-86C3-FF0E65AABBCD"], false, true],
            ["match", ["get", "id"], ["105F120B-D4A5-44D8-A8C9-FF0F1765492F"], false, true],
            ["match", ["get", "id"], ["9CEFEB15-9D70-4389-8804-FFD7E8ADBA2E"], false, true]
          ]


        );

        map.setFilter('wellpermitlines',
          [
            "all",
            [
              "match",
              ["geometry-type"],
              ["LineString"],
              true,
              false
            ],
            [
              "==",
              ["get", "isPermit"],
              true
            ]
          ]
        )
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
          //"permits",
          "recent_submitted_permits",
          "recent_submitted_permit_laterals",
          "rigs",
        ];
        filterLayers.forEach((filterLayer) => {
          const baseFilter = getLayerBaseFilters(filterLayer);

          const layer = map.getLayer(filterLayer);
          if (layer) {
            map.setFilter(filterLayer, baseFilter);
            if (layer.type === "circle") {
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
    // stateNav.selectedTags,
    stateApp.trackedOwnerWells,
    stateApp.trackedwells,
    stateApp.customLayers,
    stateApp.wellListFromTagsFilter,
    stateNav.filterIntersectingWellLines,
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
      if (coordinates)
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
      if (map.getSource("well-select-point"))
        map.removeSource("well-select-point");

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

    if (map && stateApp.permitSelectedCoordinates) {
      if (map.getLayer("well-point")) map.removeLayer("well-point");
      if (map.getSource("well-select-point")) map.removeSource("well-select-point");

      if (stateApp.permitSelectedCoordinates.length > 0) {
        map.addSource("well-select-point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: stateApp.permitSelectedCoordinates,
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
  }, [loading, stateApp.permitSelectedCoordinates]);

  useEffect(() => {
    (async () => {

      if (
        map &&
        stateApp.selectedWellId &&
        stateApp.wellSelectedCoordinates &&
        stateApp.wellSelectedCoordinates.length > 0
        // && !stateApp.selectedWell
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
            element.properties.id.toLowerCase() === stateApp.selectedWellId
        );

        if (!currentFeature) {
          features = map.querySourceFeatures("composite", {
            sourceLayer: "wellPoints",
            filter: ["in", "id", stateApp.selectedWellId],
          });
          currentFeature = features.find(
            (element) =>
              element.properties.id.toLowerCase() === stateApp.selectedWellId
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
                  element.properties.id.toLowerCase() === stateApp.selectedWellId
              );
            })
            .catch((error) => {
              console.log(error);
            });
        }

        if (currentFeature) {
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


  // For recently submitted permits
  useEffect(() => {
    (async () => {
      if (
        map &&
        stateApp.selectedPermitId &&
        stateApp.permitSelectedCoordinates &&
        stateApp.permitSelectedCoordinates.length > 0
      ) {
        let point = map.project(stateApp.permitSelectedCoordinates);
        var bbox = [
          [point.x - 10, point.y - 10],
          [point.x + 10, point.y + 10],
        ];
        let features = map.queryRenderedFeatures(bbox, {
          layers: ["recent_submitted_permits", "recent_submitted_permit_laterals"],
        });

        let currentFeature = features.find(
          (element) =>
            element.properties.Id.toLowerCase() == stateApp.selectedPermitId
        );

        if (!currentFeature) {
          features = map.querySourceFeatures("composite", {
            sourceLayer: "recent_submitted_permits",
            filter: ["in", "id", stateApp.selectedPermitId],
          });
          currentFeature = features.find(
            (element) =>
              element.properties.Id.toLowerCase() == stateApp.selectedPermitId
          );
        }

        if (!currentFeature) {
          features = map.querySourceFeatures("composite", {
            sourceLayer: "recent_submitted_permit_laterals",
            filter: ["in", "id", stateApp.selectedPermitId],
          });
          currentFeature = features.find(
            (element) =>
              element.properties.Id.toLowerCase() == stateApp.selectedPermitId
          );
        }

        if (!currentFeature) {
          const endpoint = `https://api.mapbox.com/v4/${wellsTileset}/tilequery/${stateApp.permitSelectedCoordinates.join()}.json?radius=1&limit=5&dedupe&layers=wellPoints&access_token=${stateApp.mapboxglAccessToken}`;
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
                  element.properties.Id.toLowerCase() == stateApp.selectedPermitId
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
            selectedPermit: currentFeature.properties,
          }));
          createPopUp(currentFeature.properties);
          map.resize();
        }
      }
    })();
  }, [loading, stateApp.permitSelectedCoordinates]);

  const fetchStyles = async (abortController) => {
    const token = '&access_token=sk.eyJ1IjoibTFuZXJhbCIsImEiOiJjazdkbGg1YXAwMjVqM2VwanZzbm95Z2dvIn0.cdoQNZU42xxbybyGxlBNkw'
    let link = 'https://api.mapbox.com/styles/v1/m1neral?&sortby=modified'
    const reqOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "max-age=0",
      },
    };

    const signal = abortController.signal;

    const styleTypes = [
      'Satellite',
      'Basic',
      'Dark',
      'Light',
      'Outdoors',
    ]
    let recurseLimit = 5;

    let styles = (await styleTypes.reduce(
      async function reduceFunction(styles, styleType) {
        styles = (await styles)
        if (!styles.find(style => style.name === styleType) &&
          recurseLimit > 0) {
          return new Promise((resolve, reject) => {
            --recurseLimit;
            fetch(new Request(link + token, reqOptions), { signal: signal })
              .then((results) => {
                link = parseLinkHeader(results.headers.get('Link')).next.url;
                return results.json()
              })
              .then(async (data) => {
                styles.push(..._.uniqBy(data.filter(style => styleTypes.includes(style.name) && !styles.includes(style.name)), 'name'));
                await reduceFunction(styles, styleType)
                resolve(styles);
              })
              .catch((err) => reject(err))
          })
        } else return styles
      }, []
    ))

    setMapStyles(styles);
    setStateApp((state) => ({
      ...state,
      mapStyles: styles
    }));
  }

  useEffect(() => {
    const abortController = new AbortController();
    fetchStyles(abortController);

    //getPermits({});
    getRecentSubmittedPermits({});
    getRigs({});

    setStateApp((state) => ({
      ...state,
      popupOpen: stateApp.wellSelectedCoordinates?.length > 0 && searchInputValue ? true : false,
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
              centroid.properties.ShortName = geoJSON.properties.ShortName;
              return centroid;
            }
          }),
        };
      };

      const geoJson = makeGeoJSON(data);
      const labelGeoJson = makeLabelGeoJson(data);

      map.getSource("plssseconddivision_geo_source").setData(geoJson);
      map
        .getSource("plssseconddivision_label_geo_source")
        .setData(labelGeoJson);
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
      currentFeature: undefined,
      popupOpen: false,
    }));
    if (action === "add") {
      setStateApp((state) => {
        const isContinous = state.selectedAbstracts.find((shape) => {
          const intersect = turf.union(shape, feature);
          return intersect.geometry.type === "Polygon"
        })
        if (!isContinous && state.selectedAbstracts.length > 0)
          return state

        map.setFeatureState(
          { source: "abstract_geo_source", id: feature.id },
          { click: true }
        );
        return {
          ...state,
          selectedAbstracts: [...state.selectedAbstracts, feature],
          showDrawShapesPopup: true
        }
      });
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
    // UseEffect for Land Grids Selection
    if (map) {
      const LandClickListener = (e) => {
        if (!e.features.length) {
          return;
        }
        const drawMode = stateApp.draw.getMode();
        if (drawMode.includes('draw') || drawMode.includes('drag')) {
          return
        }

        const currentFeature = e.features[0];
        const featureState = map.getFeatureState({
          source: "abstract_geo_source",
          id: currentFeature.id,
        });
        const featuresList = map.getSource("abstract_geo_source")._data
          .features;

        const geoSourceFeature = featuresList.find((feature) => feature.properties.Id === currentFeature.id)
        if (geoSourceFeature) currentFeature.geometry = geoSourceFeature.geometry
        if (
          window.event.ctrlKey ||
          window.event.metaKey ||
          stateApp.multiSelectLandGrids
        ) {
          if (featureState && featureState.click) {
            // Unselect feature
            map.setFeatureState(
              { source: "abstract_geo_source", id: currentFeature.id },
              { click: false }
            );
            onAbstactLayerClick(currentFeature, "remove");
          } else {
            // let isExisting = stateApp.customLayers.find(x => x.shape.includes(currentFeature.id));
            // const shape = JSON.parse(isExisting.shape)
            // var point = turf.point([e.lngLat.lng, e.lngLat.lat]);
            // if (!isExisting || !turf.booleanContains(shape, point)) {
            onAbstactLayerClick(currentFeature, "add");
            // }
          }
        } else {
          // Clear all selected features when click off the shapes
          for (let i = 0; i < featuresList.length; i++) {
            const id = featuresList[i].properties.Id;
            map.setFeatureState(
              { source: "abstract_geo_source", id: id },
              { click: false }
            );
          }
          onAbstactLayerClick(null, "remove");
        }
      };

      map.on("click", "abstract_geo_fill_layer", LandClickListener);

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

      map.on("mouselecustomLayersave", "abstract_geo_fill_layer", function (e) {
        if (hoveredAbstractId) {
          map.setFeatureState(
            { source: "abstract_geo_source", id: hoveredAbstractId },
            { hover: false }
          );
        }
      });
      return () => {
        // Unsubscribing the provious event for updated states
        map.off("click", "abstract_geo_fill_layer", LandClickListener);
      };
    }
  }, [map, stateApp.customLayers, stateApp.multiSelectLandGrids]);

  // having to use a ref because callbacks are not guaranteed to get the correct version of context state!!!
  function shapeFilterControl(map) {
    if (stateNavRef.current?.filterBasin ||
      stateNavRef.current?.filterAOI ||
      stateNavRef.current?.filterParcel ||
      stateNavRef.current?.filterDrawing[1]) {

      // console.time(`querySourceFeatures`);
      let features = [];
      features = [
        ...features,
        ...map.querySourceFeatures("composite", { sourceLayer: "wellLines" })
      ];
      features = [
        ...features,
        ...map.querySourceFeatures("recentsub_permits_source")
      ];
      // console.timeEnd(`querySourceFeatures`);

      setStateNav((stateNav) => ({
        ...stateNav,
        filterIntersectingWellLines: features
      }));
    }
  };

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
            .find((element) => element.indexOf("m1neral.wells") > -1)?.replace("mapbox://", "")
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
          styles: drawShapeStyles,
          modes: {
            ...MapboxDraw.modes,
            static: StaticMode,
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
              selectedPolygonString: polygonString,
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
          // setting zoom level on every zoom
          setStateApp((state) => ({
            ...state,
            mapVars: { ...state.mapVars, zoom: map.getZoom() },
          }));
        };

        newMap.on("zoomend", function (e) {
          abstractControl(e);
          shapeFilterControl(e.target);
        });
        newMap.on("moveend", function (e) {
          abstractControl(e);
          shapeFilterControl(e.target);
        });

        // omg please use the updater pattern!
        setStateApp((state) => ({
          ...state,
          map: newMap, draw: Draw
        }));

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

          // FOR aoi_labels
          newMap.addSource('aoi_label_source', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': []
            }
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
              "fill-outline-color": "rgba(0, 6, 15, 0.17)",
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
              "text-halo-blur": 0.5,
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


  // VIEWPORT REMOVE
  // // use effect to query the viewport
  // useEffect(() => {
  //   if (stateApp.map) {
  //     const queryViewportHandler = debounce(() => {
  //       if (stateApp.map.getZoom() >= stateApp.minZoomToQueryViewport) {
  //         const points = stateApp.map.queryRenderedFeatures({
  //           layers: [
  //             "wellpoints",
  //             // "Tracked Wells",
  //             // "Tags Filter",
  //             // "Search",
  //           ],
  //         });

  //         const featuresArray = [];
  //         points.forEach((point) => {
  //           if (point && point.properties && point.properties.id) {
  //             featuresArray.push({
  //               ...point.properties,
  //               id: point.properties.id.toLowerCase(),
  //             });
  //           }
  //         });

  //         setStateApp((stateApp) => {
  //           if (!deepEqual(stateApp.viewportWells, featuresArray))
  //             return { ...stateApp, viewportWells: featuresArray };
  //           return stateApp;
  //         });
  //       } else
  //         setStateApp((stateApp) => {
  //           if (stateApp.viewportWells)
  //             return { ...stateApp, viewportWells: null };
  //           return stateApp;
  //         });
  //     }, 300);

  //     // stateApp.map.off("render", queryViewportHandler);
  //     stateApp.map.on("render", queryViewportHandler);
  //   }
  // }, [stateApp.map]);





  // Use effect for removing shape filter
  useEffect(() => {
    if (!loading) {
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

      shapeFilterControl(map)
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
    if (draw && stateNav.filterDrawing && stateNav.filterDrawing.length === 2) {
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
  }, [map, stateApp.flyTo]);

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
          searchLoader: false,
          fitBounds: findBounds(formatIt(stateApp.wellListFromSearch)),
        }));
      } else {
        if (
          stateApp.wellListFromSearch[0] &&
          stateApp.wellListFromSearch[0].latitude &&
          stateApp.wellListFromSearch[0].longitude
        ) {
          map.flyTo({
            center: {
              lng: stateApp.wellListFromSearch[0].longitude,
              lat: stateApp.wellListFromSearch[0].latitude,
            },
            zoom: 12,
          });
          setStateApp((state) => ({
            ...state,
            searchLoader: false,
          }));
        }

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
        if (map.getPitch() === 0 && map.getBearing() === 0) {
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
    stateApp.layers?.forEach((l, i) => {
      if (l.identifier === layerIdentifier) {
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
    getCustomLayers();
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
  };

  const handleCloseSpatialDataCard = (complete = true) => {
    setStateApp((state) => ({
      ...state,
      popupOpen: false,
      selectedUserDefinedLayer: undefined,
    }));
    if (complete === true) {
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
        setStateApp((state) => ({
          ...state,
          selectedUserDefinedLayer: null,
          editingUserDefinedLayers: updated_layers
        }));
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
          setStateApp((state) => ({
            ...state,
            editingUserDefinedLayers: updated_layers
          }));
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
            setStateApp((state) => ({
              ...state,
              customLayers: updated_layers
            }));
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
            setStateApp((state) => ({
              ...state,
              customLayers: updated_layers
            }));
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
          setStateApp((state) => ({
            ...state,
            selectedUserDefinedLayer: feature,
            editLayer: true,
            editDraw: true
          }));
        } else {
          setStateApp((state) => ({
            ...state,
            popupOpen: false,
            selectedUserDefinedLayer: undefined,
            editLayer: false,
            editDraw: false
          }));
        }
      });
    }
  }, [stateApp.editingUserDefinedLayers]);

  useEffect(() => {
    /////// USE EFFECT  to handle the map zoom /  for selected well elements

    if (stateApp.wellDetailCardOpen && stateApp.wellDetailCardOpen === true) {
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

      // setStateApp((state) => ({
      //   ...state,
      //   wellDetailCardOpen: false
      // }));
      // super fucked up because this depends on overwriting other context updates to work
      setStateApp({
        ...stateApp,
        wellDetailCardOpen: false,
      });
    }
  }, [stateApp.wellDetailCardOpen]);

  useEffect(() => {
    /////// USE EFFECT  to handle the map zoom /  for selected parcel elements

    if (
      stateApp.parcelDetailCardOpen &&
      stateApp.parcelDetailCardOpen === true &&
      map
    ) {
      // set and remove map marker




      let coordinates = stateApp.selectedParcel.shapeCenter;
      if (typeof stateApp.selectedParcel.shapeCenter === "string") {
        coordinates = JSON.parse(stateApp.selectedParcel.shapeCenter);
      }
      const longitude = coordinates[0];
      const latitude = coordinates[1];


      const mapBounds = map.getBounds();
      const screenLeftLng = mapBounds._sw.lng;
      const screenRightLng = mapBounds._ne.lng;
      const alpha = (screenRightLng - screenLeftLng) / 2;

      const bbox = [
        [longitude - 1.5 * alpha, latitude],
        [longitude + 0.5 * alpha, latitude],
      ];

      map.fitBounds(bbox, {
        speed: 0.75,
        linear: true,
      });

      setStateApp((state) => ({
        ...state,
        parcelDetailCardOpen: false
      }));
    }
  }, [stateApp.parcelDetailCardOpen]);

  useEffect(() => {
    if (parcelBoundaryId && map) {
      let mapSourceData = map.getSource('parcels_source')._data;
      const idx = mapSourceData.features.findIndex(feature => feature.id === parcelBoundaryId)
      if (idx > -1) {
        const geoJson = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: mapSourceData.features[idx].geometry.coordinates[0],
          },
        };



        if (map.getSource('parcelBoundarySource')) {
          map.getSource('parcelBoundarySource').setData(geoJson);
          if (map.getLayer('parcelBoundary')) {
            map.removeLayer('parcelBoundary')
          }
        } else {
          map.addSource("parcelBoundarySource", {
            type: "geojson",
            data: geoJson
          });
        }

        // setStateParcelCard({
        //   ...stateParcelCard,
        //   selectedParcelGeom: mapSourceData.features[idx].geometry.coordinates[0],
        // });


        map.addLayer({
          id: "parcelBoundary",
          type: "line",
          source: "parcelBoundarySource",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#FFFF00",
            "line-width": 8,
          },
        });
      }
    }
  }, [parcelBoundaryId]);

  useEffect(() => {
    if (map && stateApp.selectedParcel) {
      setParcelBoundaryId(stateApp.selectedParcel.id);
    } else if (map) {
      if (map.getLayer('parcelBoundary')) map.removeLayer('parcelBoundary');
      if (map.getSource('parcelBoundarySource')) map.removeSource('parcelBoundarySource');
      setParcelBoundaryId(null);
    }
  }, [stateApp.selectedParcel]);

  useEffect(() => {
    if (map && !stateApp.selectedUserDefinedLayer) {
      drawBoundary(map)
    }
  }, [stateApp.selectedUserDefinedLayer]);


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
              cardTop={0}
              cardLeft={0}
              position="relative"
              zIndex={99}
              cardWidthExpanded="50vw"
              cardHeightExpanded="calc(100vh - 64px)"
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
              cardTop={0}
              cardLeft={0}
              zIndex={99}
              cardWidthExpanded="50vw"
              cardHeightExpanded="calc(100vh - 64px)"
              targetSourceId={stateApp.selectedParcel.id}
              targetLabel="parcel"
              deleteParcel={deleteParcel}
            ></ExpandableCardProvider>
          </div>
        )
      }
      {stateApp.selectedPermit !== null && stateApp.selectedPermit.hasOwnProperty('Lease') &&
        // && stateApp.popupOpen==true
        showExpandableCard && (
          <PortalD id="popupContainer">

            {!stateApp.expandedCard && (
              <ExpandableCardProvider
                handleCloseExpandableCard={handleCloseExpandableCard}
                component={<PermitCardProvider />}
                title={stateApp.selectedPermit.Lease}
                subTitle={stateApp.selectedPermit.ApiNumber}
                parent="map"
                mouseX={0}
                mouseY={0}
                position="relative"
                cardLeft={0}
                cardTop={0}
                zIndex={3000}
                cardWidth="375px"
                cardWidthExpanded="50vw"
                cardHeightExpanded="calc(100vh - 64px)"
                targetSourceId={stateApp.selectedPermit.Id}
                targetLabel="recent_submitted_permits"
              ></ExpandableCardProvider>
            )}
          </PortalD>
        )}

      <div id="modalHolder" ref={modalContainer} />
      <Portal container={modalContainer.current}>

      </Portal>
      <Portal container={container.current}>
        {stateApp.popupOpen === true ? (
          <div>
            {stateApp.selectedWell !== null &&
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
                      cardHeightExpanded="calc(100vh - 64px)"
                      targetSourceId={stateApp.selectedWell.id}
                      targetLabel="well"
                    />
                  )}
                </PortalD>
              )}
            {stateApp.selectedUserDefinedLayer !== null &&
              stateApp.currentFeature?.source !== 'parcels_source' &&
              stateApp.currentFeature?.source !== 'interests_source' && (
                <PortalD id="popupContainer">
                  <UdLayerCardProvider
                    parent="map"
                    handleCloseExpandableCard={handleCloseExpandableCard}
                    selectedUserDefinedLayer={stateApp.selectedUserDefinedLayer}
                    zIndex={3000}
                    cardWidth="350px"
                    mouseX={0}
                    mouseY={0}
                    position="relative"
                  />
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
                    cardLeft={0}
                    cardTop={0}
                    zIndex={99}
                    cardWidth="350px"
                    cardWidthExpanded="50vw"
                    cardHeightExpanded="calc(100vh - 64px)"
                    targetSourceId={stateApp.selectedParcel.id}
                    targetLabel="parcel"
                    deleteParcel={deleteParcel}
                  ></ExpandableCardProvider>
                )}
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
    </div >
  );
}


export default React.memo(Map);
