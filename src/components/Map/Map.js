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
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { WELLSQUERY } from "../../graphQL/useQueryWells";
import { TRACKSBYUSERANDOBJECTTYPE } from "../../graphQL/useQueryTracksByUserAndObjectType";
import { OWNERSWELLSQUERY } from "../../graphQL/useQueryOwnersWells";
import { CUSTOMLAYERSQUERY } from "../../graphQL/useQueryCustomLayers";
import { REMOVECUSTOMLAYER } from "../../graphQL/useMutationRemoveCustomLayer";
import { UPDATECUSTOMLAYER } from "../../graphQL/useMutationUpdateCustomLayer";
import { PERMITSQUERY } from "../../graphQL/useQueryPermits";
import { RIGSQUERY } from "../../graphQL/useQueryRigs";
import { spatialDataAttributes } from "../MapControls/components/DrawShapes/constants";
import { addCustomShapeProperties } from "../MapControls/components/DrawShapes/drawShapesHelpers";
import MapGridCard from "../MapGridCard/MapGridCard";

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

export default function Map() {
  let classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [filtersDefault, setFiltersDefault] = useState(
    stateApp.user.defaultFilters ? stateApp.user.defaultFilters : []
  );
  const [lng, setLng] = useState();
  const [lat, setLat] = useState();
  const [transform, setTransform] = useState("transform: inherit");
  const container = useRef(null);
  const [showExpandableCard, setShowExpandableCard] = useState(false);
  const [mapStyles, setMapStyles] = useState([]);
  const [wellsTileset, setwellsTileset] = useState();
  const [defaultsCheckOnOff, setDefaultsCheckOnOff] = useState(true);
  const [m1neralCheckOnOff, setM1neralCheckOnOff] = useState(true);
  const [map, setMap] = useState(null);
  const [mapClick, setMapClick] = useState(null);
  const [draw, setDraw] = useState(null);
  const [drawStatus, setDrawStatus] = useState(false);
  const [rigs, setRigData] = useState([]);
  const [drawingFilterFeatureId, setDrawingFilterFeatureId] = useState(null);
  // const [geocoder, setGeocoder] = useState(null);
  const [anchorElPoPOver, setAnchorElPoPOver] = useState(null);
  const mapEl = useRef(null);

  mapboxgl.accessToken = stateApp.mapboxglAccessToken;

  //////////// TEMP UNTIL PROVIDER IS MADE //////////

  //////begin////////temporary

  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);
  const [tracksByUserAndObjectType, { data: dataTracks }] = useLazyQuery(
    TRACKSBYUSERANDOBJECTTYPE
  );
  const [
    tracksByUserAndObjectTypeOwner,
    { data: dataTracksOwner },
  ] = useLazyQuery(TRACKSBYUSERANDOBJECTTYPE);

  const [getOwnersWells, { data: dataOwnersWells }] = useLazyQuery(
    OWNERSWELLSQUERY
  );

  const [
    getCustomLayers,
    { data: customLayerData },
  ] = useLazyQuery(CUSTOMLAYERSQUERY, { fetchPolicy: "network-only" });

  const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);

  const [removeCustomLayer] = useMutation(REMOVECUSTOMLAYER);

  const [
    getWellsForLayer,
    { data: dataWellsForOwnerWellTrackLayer },
  ] = useLazyQuery(WELLSQUERY);

  const [getPermits, { data: permitData }] = useLazyQuery(PERMITSQUERY);

  const [getRigs, { data: rigData }] = useLazyQuery(RIGSQUERY);

  /////end/////////temporary

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
      setLoading(true);

      tracksByUserAndObjectType({
        variables: {
          userId: stateApp.user.mongoId,
          objectType: "well",
        },
      });

      tracksByUserAndObjectTypeOwner({
        variables: {
          userId: stateApp.user.mongoId,
          objectType: "owner",
        },
      });

      getCustomLayers({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [stateApp.user]);

  useEffect(() => {
    if (dataTracks && dataTracks.tracksByUserAndObjectType) {
      if (dataTracks.tracksByUserAndObjectType.length !== 0) {
        const tracksIdArray = dataTracks.tracksByUserAndObjectType.map(
          (track) => track.trackOn
        );

        // setStateApp((stateApp) => ({
        //   ...stateApp,
        //   trackedwells: dataTracks.tracksByUserAndObjectType,
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
    if (dataTracksOwner && dataTracksOwner.tracksByUserAndObjectType) {
      if (dataTracksOwner.tracksByUserAndObjectType.length !== 0) {
        var objectsIdsArray = dataTracksOwner.tracksByUserAndObjectType.map(
          (item) => item.trackOn
        );

        getOwnersWells({
          variables: {
            ownersIds: objectsIdsArray,
          },
        });
      }
    }
  }, [dataTracksOwner]);

  useEffect(() => {
    if (customLayerData && customLayerData.customLayers) {
      console.log("Custom Layer data", customLayerData.customLayers);
      setStateApp((state) => ({
        ...state,
        customLayers: customLayerData.customLayers,
        selectedUserDefinedLayer: null,
        editLayer: false,
        popupOpen: false,
      }));
    }
  }, [customLayerData]);

  useEffect(() => {
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
    if (dataWells) {
      if (
        dataWells.wells &&
        dataWells.wells.results &&
        dataWells.wells.results.length > 0
      )
        setStateApp((state) => ({
          ...state,
          trackedwells: dataWells.wells.results,
        }));
      else
        setStateApp((state) => ({
          ...state,
          trackedwells: null,
        }));
    }
  }, [dataWells]);

  const setLayer = (data, layerName, map) => {
    const makeGeoJSON = (data) => {
      return {
        type: "FeatureCollection",
        features: data.map((feature) => {
          return {
            type: "Feature",
            properties: feature,
            geometry: {
              type: "Point",
              coordinates: [feature.Longitude, feature.Latitude],
            },
          };
        }),
      };
    };

    const geoJson = makeGeoJSON(data);

    const configIndex = stateApp.styleLayers.findIndex(
      (value) => value.name === layerName
    );
    const config = stateApp.styleLayers[configIndex];
    const checkedPosition = stateApp.checkedLayers.indexOf(configIndex);
    console.log(config);

    // -> add source
    if (config) {
      map.addSource(config.sourceProps[0], {
        type: "geojson",
        data: geoJson,
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 6,
      });

      map.addSource(`${config.sourceProps[0]}_filter`, {
        type: "geojson",
        data: geoJson,
      });

      // -> add layer

      if(config.layerProps.layerId[0] =='rigs'){
        map.addLayer({
          id: config.layerProps.layerId[0],
          type: config.layerProps.layerType[0],
          source: `${config.sourceProps[0]}_filter`,
          paint: config.layerProps.paintProps,
          layout: config.layerProps.layoutProps, 
        });
      } else {
        map.addLayer({
          id: config.layerProps.layerId[0],
          type: config.layerProps.layerType[0],
          source: config.sourceProps[0],
          paint: config.layerProps.paintProps,
          layout: {
            visibility: checkedPosition > -1 ? "visible" : "none",
          },
        });
      }

      const clusterVar = config.layerProps.layerId[0] + "-clusters";
      const clusterLabelBar = config.layerProps.layerId[0] + "-clusters-counts";

      map.addLayer({
        id: clusterLabelBar,
        type: "symbol",
        source: config.sourceProps[0],
        filter: ["has", "point_count"],
        layout: config.layerProps.clusterProps.clusterSymbolProps,
      });

      map.addLayer({
        id: clusterVar,
        type: config.layerProps.layerType[0],
        source: config.sourceProps[0],
        filter: ["has", "point_count"],
        paint: config.layerProps.clusterProps.clusterPaintProps,
      });

      map.setLayoutProperty(
        clusterVar,
        "visibility",
        checkedPosition > -1 ? "visible" : "none"
      );
      map.setLayoutProperty(
        clusterLabelBar,
        "visibility",
        checkedPosition > -1 ? "visible" : "none"
      );
    }
  };

  useEffect(() => {
    if (
      permitData &&
      permitData.permits &&
      permitData.permits.length > 0 &&
      map
    ) {
      setLayer(permitData.permits, "Permits", map);
    }
  }, [permitData, map]);

  useEffect(() => {
    if (rigData && rigData.rigs && rigData.rigs.length > 0) {
      const nextOffset = rigs.length + rigData.rigs.length;
      setRigData([...rigs, ...rigData.rigs]);

      getRigs({
        variables: {
          offset: nextOffset,
          amount: 5000,
        },
      });
    }
  }, [rigData]);

  useEffect(() => {
    if (rigs.length > 0 && map) {
      setLayer(rigs, "Rig Activity", map);
    }
  }, [rigs, map]);

  useEffect(() => {
    if (dataWellsForOwnerWellTrackLayer) {
      if (
        dataWellsForOwnerWellTrackLayer.wells &&
        dataWellsForOwnerWellTrackLayer.wells.results &&
        dataWellsForOwnerWellTrackLayer.wells.results.length > 0
      )
        setStateApp((state) => ({
          ...state,
          trackedOwnerWells: dataWellsForOwnerWellTrackLayer.wells.results,
        }));
      else
        setStateApp((state) => ({
          ...state,
          trackedOwnerWells: null,
        }));
    }
  }, [dataWellsForOwnerWellTrackLayer]);

  useEffect(() => {
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

    const wellPointClick = (currentFeature) => {
      console.log("current feature", currentFeature);

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
      map.resize();
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
      console.log("current feature", feature);

      setStateApp((state) => ({
        ...state,
        popupOpen: false,
      }));
      setStateApp((state) => ({
        ...state,
        selectedUserDefinedLayer: feature,
      }));

      // setStateApp({...stateApp, currentFeature: feature});
      createUDPopUp(feature.properties);
      map.resize();
    };

    const clusterClickHandler = (feature, map) => {
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
    };

    const mapClickHandler = (e) => {
      const map = e.target;
      let layers = [];
      const checkedUDLayersInteraction =
        stateApp.checkedUserDefinedLayersInteraction;
      const checkedUDLayers = stateApp.checkedUserDefinedLayers;
      const definedLayers = stateApp.userDefinedLayers;
      const clusterUDLayers = [];
      const udLayers = [];
      const clusterLayers = [];

      checkedUDLayers.forEach((l) => {
        if (checkedUDLayersInteraction.indexOf(l) > -1) {
          const definedLayer = definedLayers[l];
          const layerProps = definedLayer.layerProps;
          if (layerProps) {
            for (let i = 0; i < layerProps.length; i++) {
              const layerProp = layerProps[i];
              if (
                definedLayer.name === "Area of Interest" ||
                definedLayer.name === "Parcels"
              ) {
                if (map.getLayer(layerProp.layerId)) {
                  udLayers.push(layerProp.layerId);
                }
              }
              if (layerProp.clusterProps) {
                const clusterLayerId = layerProp.layerId + "-clusters";
                if (map.getLayer(clusterLayerId)) {
                  layers.push(clusterLayerId);
                  clusterUDLayers.push(clusterLayerId);
                  clusterLayers.push(layerProp.layerId);
                }
              }
              if (map.getLayer(layerProp.layerId)) {
                layers.push(layerProp.layerId);
              }
            }
          }
        }
      });
      const checkedSLayersInteraction = stateApp.checkedLayersInteraction;
      const checkedSLayers = stateApp.checkedLayers;
      const styleLayers = stateApp.styleLayers;
      // let sLayers = [];
      checkedSLayers.forEach((l) => {
        if (checkedSLayersInteraction.indexOf(l) > -1) {
          const styleLayer = styleLayers[l];
          if (!styleLayer.layerProps) {
            styleLayer.id.forEach((styleId) => {
              if (map.getLayer(styleId)) {
                layers.push(styleId);
              }
            });
          }
          // sLayers = [...sLayers, ...styleLayer.id];
          if (styleLayer.layerProps && styleLayer.layerProps.clusterProps) {
            if (map.getLayer(styleLayer.id[1])) {
              layers.push(styleLayer.id[1]);
            }
            if (map.getLayer(styleLayer.id[2])) {
              layers.push(styleLayer.id[2]);
            }
            const clusterLayerId = styleLayer.id[1];
            if (map.getLayer(clusterLayerId)) {
              clusterUDLayers.push(clusterLayerId);
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
        layers: layers,
      });

      if (features && features.length > 0) {
        const feature = features[0];
        console.log("stacked layers click info", features);
        const layerId = feature.layer.id;
        switch (true) {
          case clusterUDLayers.indexOf(layerId) > -1:
            clusterClickHandler(feature, map);
            break;
          case clusterLayers.indexOf(layerId) > -1:
            layerClickHander(feature);
            break;
          case udLayers.indexOf(layerId) > -1:
            udLayerClickHandler(feature);
            break;
          case layerId === "wellpoints":
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
    stateApp.checkedLayersInteraction,
    stateApp.checkedUserDefinedLayersInteraction,
    stateApp.checkedLayers,
    stateApp.checkedUserDefinedLayers,
  ]);

  useEffect(() => {
    // USE EFFECT FOR M1 LAYER HANDLES
    console.log("layer ue start");

    setStateApp((state) => ({
      ...state,
      popupOpen: false,
      selectedUserDefinedLayer: undefined,
    }));

    if (stateApp.styleLayers.length > 0 && map) {
      stateApp.styleLayers.forEach((l) => {
        l.id.forEach((k) => {
          if (map.getLayer(k)) {
            map.setLayoutProperty(k, "visibility", "none");
          }
          if (l.layerProps && l.layerProps.clusterProps) {
            if (map.getLayer(k + "-clusters-counts")) {
              map.setLayoutProperty(
                k + "-clusters-counts",
                "visibility",
                "none"
              );
            }
            if (map.getLayer(k + "-clusters")) {
              map.setLayoutProperty(k + "-clusters", "visibility", "none");
            }
          }
        });
      });

      const checkedLayers = stateApp.checkedLayers.slice(0);
      if (stateApp.tempCheckedLayer) {
        checkedLayers.push(stateApp.tempCheckedLayer);
      }

      if (checkedLayers.length > 0) {
        let layers = checkedLayers;
        layers.sort(function (a, b) {
          return b - a;
        });
        if (layers.length > 0) {
          let belowlayer = null;
          for (let k = layers.length - 1; k >= 0; k--) {
            let i = layers[k];
            let layerConfig = stateApp.styleLayers[i];
            let currentLayerArray = stateApp.styleLayers[i].id;
            // eslint-disable-next-line no-loop-func
            currentLayerArray.forEach((j) => {
              let mapLayer = map.getLayer(j);
              if (
                mapLayer &&
                layerConfig.layerProps &&
                layerConfig.layerProps.clusterProps &&
                !mapLayer.source.includes("_filter")
              ) {
                map.setLayoutProperty(
                  j + "-clusters-counts",
                  "visibility",
                  "visible"
                );
                if (belowlayer != null) {
                  map.moveLayer(j + "-clusters-counts", belowlayer);
                }
                belowlayer = j + "-clusters-counts";
                map.setLayoutProperty(j + "-clusters", "visibility", "visible");
                map.moveLayer(j + "-clusters", belowlayer);
                belowlayer = j + "-clusters";
              }
              if (typeof mapLayer !== "undefined") {
                if (map.getLayer(j)) {
                  map.setLayoutProperty(j, "visibility", "visible");
                  if (belowlayer != null) {
                    map.moveLayer(j, belowlayer);
                  }
                  belowlayer = j;
                }
              } else {
              }
            });
          }
        }
      }
    }
  }, [
    map,
    stateApp.checkedLayers,
    stateApp.tempCheckedLayer,
    stateApp.styleLayers,
  ]);

  useEffect(() => {
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

  useEffect(() => {
    ///////////////// EFFECT FOR SHOWING TRACKED WELLS /////////////////

    if (map && stateApp.trackFilterOn && stateApp.trackedWellArray) {
      console.log("array ", stateApp.trackedWellArray);

      const makeGeoJSON = (data) => {
        return {
          type: "FeatureCollection",
          features: data.map((feature) => {
            return {
              type: "Feature",
              properties: {
                api: feature.api,
                id: feature.id,
                latitude: feature.latitude,
                longitude: feature.longitude,
                operator: feature.operator,
                WellName: feature.wellName,
              },
              geometry: {
                type: "Point",
                coordinates: [feature.longitude, feature.latitude],
              },
            };
          }),
        };
      };

      const myGeoJSONData = makeGeoJSON(
        stateApp.trackedWellArray.wells.results
      );

      map.addSource("track_well_points_source", {
        type: "geojson",
        data: myGeoJSONData,
      });

      map.addLayer({
        id: "track_well_points_layer",
        type: "circle",
        source: "track_well_points_source",
        paint: {
          "circle-radius": 5,
          "circle-color": "yellow",
        },
      });

      // const latArray = stateApp.trackedWellArray.wells.results.map(
      //   (item) => item.latitude
      // );
      // const longArray = stateApp.trackedWellArray.wells.results.map(
      //   (item) => item.longitude
      // );

      map.on("click", "track_well_points_layer", function (e) {
        var bbox = [
          [e.point.x - 10, e.point.y - 10],
          [e.point.x + 10, e.point.y + 10],
        ];

        let features = map.queryRenderedFeatures(bbox, {
          layers: ["track_well_points_layer"],
        });

        setStateApp((state) => ({ ...state, flyTo: features[0].properties }));
      });

      map.on("mousemove", "track_well_points_layer", (e) => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "track_well_points_layer", function () {
        map.getCanvas().style.cursor = "";
      });

      // var bbox = [
      //   [Math.min(...longArray), Math.min(...latArray)],
      //   [Math.max(...longArray), Math.max(...latArray)],
      // ];

      // map.fitBounds(bbox, {
      //   padding: { top: 50, bottom: 50, left: 50, right: 50 },
      // });
    }
  }, [stateApp.trackFilterOn]);

  useEffect(() => {
    // USE EFFECT FOR USER DEFINED DATA LAYER HANDLE
    setStateApp((state) => ({
      ...state,
      popupOpen: false,
      selectedUserDefinedLayer: undefined,
    }));

    if (stateApp.userDefinedLayers.length > 0 && map) {
      stateApp.userDefinedLayers.forEach((l) => {
        l.id.forEach((k, i) => {
          let clusterLabelBar = k + "-clusters-counts";
          if (map.getLayer(clusterLabelBar)) {
            // map.removeLayer(clusterLabelBar);
            // map.removeSource(l.sourceProps[i].sourceId);
            map.setLayoutProperty(clusterLabelBar, "visibility", "none");
          }

          let clusterVar = k + "-clusters";
          if (map.getLayer(clusterVar)) {
            // map.removeLayer(clusterVar);
            // map.removeSource(l.sourceProps[i].sourceId);
            map.setLayoutProperty(clusterVar, "visibility", "none");
          }

          if (map.getLayer(k)) {
            // map.removeLayer(k);
            // map.removeSource(l.sourceProps[i].sourceId);
            map.setLayoutProperty(k, "visibility", "none");
          }
        });
      });
    }

    // this section adds the updated list of layers
    const tmpCheckedLayer = stateApp.tempCheckedUserDefinedLayers;
    const checkedLayers = stateApp.checkedUserDefinedLayers.slice(0);
    if (
      tmpCheckedLayer != null &&
      stateApp.checkedUserDefinedLayers.indexOf(tmpCheckedLayer) === -1
    ) {
      checkedLayers.push(tmpCheckedLayer);
    }

    if (map && checkedLayers.length > 0) {
      let layers = checkedLayers;
      layers.sort(function (a, b) {
        return b - a;
      });
      const layerList = stateApp.userDefinedLayers.slice(0);
      let beforelayer = null;
      let fitBounds = null;

      for (let k = layers.length - 1; k >= 0; k--) {
        const l = layers[k];

        const selectLayerProps = { ...layerList[l] };

        if (selectLayerProps.type === "data layer") {
          for (let i = 0; i < selectLayerProps.id.length; i++) {
            // -> fetch data
            let layerData = [];
            if (selectLayerProps.dataProps[i].dataId == "trackedWellsWells") {
              layerData = stateApp.trackedwells;
            } else if (
              selectLayerProps.dataProps[i].dataId == "trackedOwnersWells"
            ) {
              layerData = stateApp.trackedOwnerWells;
            } else if (
              selectLayerProps.dataProps[i].dataId == "wellsFromSearch"
            ) {
              layerData = stateApp.wellListFromSearch;
            } else if (
              selectLayerProps.dataProps[i].dataId == "wellsFromTagsFilter"
            ) {
              layerData = stateApp.wellListFromTagsFilter;
            } else {
              const dataId = selectLayerProps.dataProps[i].dataId;

              const groupBy = (arr, property) => {
                return arr.reduce((memo, x) => {
                  if (!memo[x[property]]) {
                    memo[x[property]] = [];
                  }
                  memo[x[property]].push(x);
                  return memo;
                }, {});
              };

              layerData = groupBy(stateApp.customLayers, "layer")[dataId];
            }

            if (layerData && layerData.length !== 0) {
              // -> make GEOJSON

              const makeGeoJSON = (data) => {
                return {
                  type: "FeatureCollection",
                  features: data.map((feature) => {
                    if (selectLayerProps.dataProps[i].dataTypeId == "Point") {
                      return {
                        type: "Feature",
                        properties: feature,
                        geometry: {
                          type: selectLayerProps.dataProps[i].dataTypeId,
                          coordinates: [feature.longitude, feature.latitude],
                        },
                      };
                    } else {
                      return JSON.parse(feature.shape);
                    }
                  }),
                };
              };

              const myGeoJSONData = makeGeoJSON(layerData);

              const layerId = selectLayerProps.layerProps[i].layerId;
              console.log("layerId: " + layerId);
              if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, "visibility", "visible");
                map
                  .getSource(selectLayerProps.sourceProps[i].sourceId)
                  .setData(myGeoJSONData);
                let clusterLabelBar = layerId + "-clusters-counts";
                if (map.getLayer(clusterLabelBar)) {
                  map.setLayoutProperty(
                    clusterLabelBar,
                    "visibility",
                    "visible"
                  );
                  if (beforelayer) {
                    map.moveLayer(clusterLabelBar, beforelayer);
                  }
                  beforelayer = clusterLabelBar;
                }

                let clusterVar = layerId + "-clusters";
                if (map.getLayer(clusterVar)) {
                  map.setLayoutProperty(clusterVar, "visibility", "visible");
                  if (beforelayer) {
                    map.moveLayer(clusterVar, beforelayer);
                  }
                  beforelayer = clusterVar;
                }
              } else {
                // -> add source
                if (selectLayerProps.dataProps[i].dataTypeId == "Point") {
                  map.addSource(selectLayerProps.sourceProps[i].sourceId, {
                    type: selectLayerProps.sourceProps[i].sourceType,
                    data: myGeoJSONData,
                    cluster: true,
                    clusterRadius: 50,
                    clusterMaxZoom: 6,
                  });
                  const filterLayerId =
                    selectLayerProps.sourceProps[i].sourceId + "_filter";
                  console.log(filterLayerId);
                  map.addSource(filterLayerId, {
                    type: selectLayerProps.sourceProps[i].sourceType,
                    data: myGeoJSONData,
                  });
                } else {
                  map.addSource(selectLayerProps.sourceProps[i].sourceId, {
                    type: selectLayerProps.sourceProps[i].sourceType,
                    data: myGeoJSONData,
                    promoteId: { original: "id" },
                  });
                }

                // -> add layer
                // eslint-disable-next-line eqeqeq
                if (selectLayerProps.layerProps[i].layerType == "symbol") {
                  map.addLayer({
                    id: selectLayerProps.layerProps[i].layerId,
                    type: selectLayerProps.layerProps[i].layerType,
                    source: selectLayerProps.sourceProps[i].sourceId,
                    layout: selectLayerProps.layerProps[i].symbolProps,
                  });
                } else {
                  map.addLayer({
                    id: selectLayerProps.layerProps[i].layerId,
                    type: selectLayerProps.layerProps[i].layerType,
                    source: selectLayerProps.sourceProps[i].sourceId,
                    paint: selectLayerProps.layerProps[i].paintProps,
                  });
                }

                // -> add cluster layer

                if (
                  selectLayerProps &&
                  selectLayerProps.layerProps &&
                  selectLayerProps.layerProps[i].clusterProps
                ) {
                  var clusterVar =
                    selectLayerProps.layerProps[i].layerId + "-clusters";
                  var clusterLabelBar =
                    selectLayerProps.layerProps[i].layerId + "-clusters-counts";

                  map.addLayer({
                    id: clusterLabelBar,
                    type: "symbol",
                    source: selectLayerProps.sourceProps[i].sourceId,
                    filter: ["has", "point_count"],
                    layout:
                      selectLayerProps.layerProps[i].clusterProps
                        .clusterSymbolProps,
                  });
                  if (beforelayer) {
                    map.moveLayer(clusterLabelBar, beforelayer);
                  }
                  beforelayer = clusterLabelBar;

                  map.addLayer({
                    id: clusterVar,
                    type: selectLayerProps.layerProps[i].layerType,
                    source: selectLayerProps.sourceProps[i].sourceId,
                    filter: ["has", "point_count"],
                    paint:
                      selectLayerProps.layerProps[i].clusterProps
                        .clusterPaintProps,
                  });

                  if (beforelayer) {
                    map.moveLayer(clusterVar, beforelayer);
                  }
                  beforelayer = clusterVar;
                }
                // -> add interaction (note to change later w/ interaction panel)
                if (selectLayerProps && selectLayerProps.interactionProps) {
                  const availableInteraction =
                    stateApp.checkedUserDefinedLayersInteraction.indexOf(l) !==
                    -1;
                  if (selectLayerProps.interactionProps.mouseClick) {
                    var clusterVar =
                      selectLayerProps.layerProps[i].layerId + "-clusters";
                  }

                  if (
                    selectLayerProps &&
                    selectLayerProps.interactionProps &&
                    selectLayerProps.interactionProps.hoverActions
                  ) {
                    var clusterVar =
                      selectLayerProps.layerProps[i].layerId + "-clusters";

                    if (
                      selectLayerProps.interactionProps.hoverActions.mouseMove
                    ) {
                      const mouseMoveHandler = () => {
                        map.getCanvas().style.cursor =
                          selectLayerProps.interactionProps.hoverActions.mouseMove.cursor;
                      };
                      if (
                        selectLayerProps.interactionProps.hoverActions
                          .mouseMoveHandler
                      ) {
                        const oldHander =
                          selectLayerProps.interactionProps.hoverActions
                            .mouseMoveHandler;
                        map.off(
                          "mousemove",
                          selectLayerProps.layerProps[i].layerId,
                          oldHander
                        );
                        map.off("mousemove", clusterVar, oldHander);
                      }
                      if (availableInteraction) {
                        map.on(
                          "mousemove",
                          selectLayerProps.layerProps[i].layerId,
                          mouseMoveHandler
                        );
                        map.on("mousemove", clusterVar, mouseMoveHandler);
                        selectLayerProps.interactionProps.hoverActions.mouseMoveHandler = mouseMoveHandler;
                      }
                    }

                    if (
                      selectLayerProps.interactionProps.hoverActions.mouseLeave
                    ) {
                      const mouseLeaveHandler = () => {
                        map.getCanvas().style.cursor =
                          selectLayerProps.interactionProps.hoverActions.mouseLeave.cursor;
                      };
                      if (
                        selectLayerProps.interactionProps.hoverActions
                          .mouseLeaveHandler
                      ) {
                        const oldHander =
                          selectLayerProps.interactionProps.hoverActions
                            .mouseMoveHandler;
                        map.off(
                          "mouseleave",
                          selectLayerProps.layerProps[i].layerId,
                          oldHander
                        );
                        map.off("mouseleave", clusterVar, oldHander);
                      }
                      if (availableInteraction) {
                        map.on(
                          "mouseleave",
                          selectLayerProps.layerProps[i].layerId,
                          mouseLeaveHandler
                        );
                        map.on("mouseleave", clusterVar, mouseLeaveHandler);
                        selectLayerProps.interactionProps.hoverActions.mouseLeaveHandler = mouseLeaveHandler;
                      }
                    }
                  }

                  layerList[l] = selectLayerProps;
                }
              }

              if (beforelayer) {
                map.moveLayer(
                  selectLayerProps.layerProps[i].layerId,
                  beforelayer
                );
              }
              beforelayer = selectLayerProps.layerProps[i].layerId;

              //// finding and fitting bounds
              // eslint-disable-next-line no-loop-func
              const findBounds = (wells) => {
                let latArray = wells.map((item) => item.latitude);
                let longArray = wells.map((item) => item.longitude);

                latArray = latArray.filter((item) => item !== 0);
                longArray = longArray.filter((item) => item !== 0);

                let maxLat = Math.max(...latArray);
                let minLat = Math.min(...latArray);
                let maxLong = Math.max(...longArray);
                let minLong = Math.min(...longArray);

                if (fitBounds) {
                  const {
                    maxLat: maxLatSApp,
                    minLat: minLatSApp,
                    maxLong: maxLongSApp,
                    minLong: minLongSApp,
                  } = fitBounds;

                  return {
                    maxLat: maxLatSApp < maxLat ? maxLat : maxLatSApp,
                    minLat: minLatSApp > minLat ? minLat : minLatSApp,
                    maxLong: maxLongSApp < maxLong ? maxLong : maxLongSApp,
                    minLong: minLongSApp > minLong ? minLong : minLongSApp,
                  };
                }

                return { maxLat, minLat, maxLong, minLong };
              };

              fitBounds = layerData ? findBounds(layerData) : null;
            }
          }
        }
      }
      if (fitBounds) {
        const fitOverBounds = ({ maxLat, minLat, maxLong, minLong }) => {
          const latDif = maxLat - minLat;
          const longDif = maxLong - minLong;

          if (latDif === 0) {
            maxLat = maxLat + 0.005 > 90 ? 90 : maxLat + 0.005;
            minLat = minLat - 0.005 < -90 ? -90 : minLat - 0.005;
          } else {
            maxLat = maxLat + latDif * 0.08 > 90 ? 90 : maxLat + latDif * 0.08;
            minLat =
              minLat - latDif * 0.08 < -90 ? -90 : minLat - latDif * 0.08;
          }

          if (longDif === 0) {
            maxLong = maxLong + 0.005 > 180 ? 180 : maxLong + 0.005;
            minLong = minLong - 0.005 < -180 ? -180 : minLong - 0.005;
          } else {
            maxLong =
              maxLong + longDif * 0.08 > 180 ? 180 : maxLong + latDif * 0.08;
            maxLong =
              maxLong - longDif * 0.08 < -180 ? -180 : maxLong - latDif * 0.08;
          }

          return {
            maxLat,
            minLat,
            maxLong,
            minLong,
          };
        };

        let bounds = fitOverBounds(fitBounds);

        if (
          bounds &&
          bounds.minLong &&
          bounds.maxLong &&
          bounds.minLat &&
          bounds.maxLat &&
          !stateApp.fitBounds
        ) {
          map.fitBounds([
            [bounds.minLong, bounds.minLat],
            [bounds.maxLong, bounds.maxLat],
          ]);
        }
      }

      setStateApp((stateApp) => ({
        ...stateApp,
        userDefinedLayers: layerList,
        fitBounds: { ...stateApp.fitBounds },
      }));
    }
  }, [
    map,
    stateApp.checkedUserDefinedLayers,
    stateApp.checkedUserDefinedLayersInteraction,
    stateApp.tempCheckedUserDefinedLayers,
    stateApp.customLayers,
    stateApp.trackedwells,
    stateApp.trackedOwnerWells,
    stateApp.wellListFromSearch,
    stateApp.wellListFromTagsFilter,
  ]);

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
      if (stateNav.filterTrackedWells) {
        // filterArray.push(stateNav.filterTrackedWells);
        // isFilterSet = true;
        tagFilterCount += 1;
        totalCount += 1;
      }
      if (stateNav.filterTrackedOwners) {
        // filterArray.push(stateNav.filterTrackedWells);
        // isFilterSet = true;
        tagFilterCount += 1;
        totalCount += 1;
      }

      if (stateNav.filterTags && stateNav.filterTags.length > 0) {
        filterArray.push(stateNav.filterTags);
        isFilterSet = true;
        totalCount += stateNav.selectedTags ? stateNav.selectedTags.length : 0;
        tagFilterCount += stateNav.selectedTags
          ? stateNav.selectedTags.length
          : 0;
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
            const bbox = turf.bbox(shape);
            if (bound) {
              bound.minLong = bound.minLong > bbox[0] ? bbox[0] : bound.minLong;
              bound.minLat = bound.minLat > bbox[1] ? bbox[1] : bound.minLat;
              bound.maxLong = bound.maxLong < bbox[2] ? bbox[2] : bound.maxLong;
              bound.maxLat = bound.maxLat < bbox[3] ? bbox[3] : bound.maxLat;
            } else {
              bound = {
                minLong: bbox[0],
                minLat: bbox[1],
                maxLong: bbox[2],
                maxLat: bbox[3],
              };
            }
          });
        }
        return bound;
      };

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
            // console.log(filterLayer, featuresList);
            if (featuresList && featuresList.length > 0) {
              const result = featuresList.filter((feature) => {
                if (feature.geometry.type === "MultiPolygon") {
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
                          if (filterCoordinates[0].length > 2) {
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
                    if (shapeList[i].type === "MultiPolygon") {
                      for (
                        let j = 0;
                        j < shapeList[i].coordinates.length;
                        j++
                      ) {
                        let filterCoordinates = shapeList[i].coordinates[j];
                        if (filterCoordinates[0].length > 2) {
                          filterCoordinates = filterCoordinates[0];
                        }
                        const filterGeometry = {
                          type: "Polygon",
                          coordinates: filterCoordinates,
                        };
                        if (
                          feature.geometry.coordinates[0] &&
                          turf.booleanContains(filterGeometry, feature)
                        ) {
                          return true;
                        }
                      }
                    } else {
                      if (
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
        // let total = stateNav.filterBasin[2].length;
        // filterArray.push(stateNav.filterBasin);
        const { styleLayers, checkedLayers } = stateApp;
        const basinIndex = styleLayers.findIndex(
          (styleLayer) => styleLayer.name === "Basins"
        );

        if (checkedLayers.indexOf(basinIndex) === -1) {
          setStateApp((stateApp) => ({
            ...stateApp,
            tempCheckedLayer: basinIndex,
          }));
        }
        let basinNames = stateNav.basinName;
        if (basinNames) {
          filterCustomArray["basin"] = [
            "match",
            ["get", "NAME"],
            basinNames,
            true,
            false,
          ];
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
          "parcel",
        ];
        if (stateNav.filterBasin && stateNav.filterBasin.length > 0) {
          const basinShapes = stateNav.filterBasin;
          fitBounds = findBounds(basinShapes);
          filterShapeAction(basinShapes, filterLayers);
        }
        isFilterSet = true;
        geographyFilterCount += stateNav.basinName.length;
        totalCount += stateNav.basinName.length;
      } else {
        setStateApp((stateApp) => ({
          ...stateApp,
          tempCheckedLayer: null,
        }));
      }

      if (stateNav.filterAOI && stateNav.filterAOI.length > 0) {
        const { userDefinedLayers, checkedUserDefinedLayers } = stateApp;
        const aoiIndex = userDefinedLayers.findIndex(
          (userDefinedLayer) => userDefinedLayer.name === "Area of Interest"
        );

        if (checkedUserDefinedLayers.indexOf(aoiIndex) === -1) {
          setStateApp((stateApp) => ({
            ...stateApp,
            tempCheckedUserDefinedLayer: aoiIndex,
          }));
        }
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
        if (stateNav.filterAOI && stateNav.filterAOI.length > 0) {
          const aoiShapes = stateNav.filterAOI;
          fitBounds = findBounds(aoiShapes);
          filterShapeAction(aoiShapes, filterLayers);
        }
        isFilterSet = true;
        geographyFilterCount += stateNav.aoiName.length;
        totalCount += stateNav.aoiName.length;
      } else {
        setStateApp((stateApp) => ({
          ...stateApp,
          tempCheckedUserDefinedLayer: null,
        }));
      }

      if (stateNav.filterParcel && stateNav.filterParcel.length > 0) {
        const { userDefinedLayers, checkedUserDefinedLayers } = stateApp;
        const parcelIndex = userDefinedLayers.findIndex(
          (userDefinedLayer) => userDefinedLayer.name === "Parcels"
        );

        if (checkedUserDefinedLayers.indexOf(parcelIndex) === -1) {
          setStateApp((stateApp) => ({
            ...stateApp,
            tempCheckedUserDefinedLayer: parcelIndex,
          }));
        }
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
        if (stateNav.filterParcel && stateNav.filterParcel.length > 0) {
          const parcelShapes = stateNav.filterParcel;
          fitBounds = findBounds(parcelShapes);
          filterShapeAction(parcelShapes, filterLayers);
        }
        isFilterSet = true;
        geographyFilterCount += stateNav.parcelName.length;
        totalCount += stateNav.parcelName.length;
      } else {
        setStateApp((stateApp) => ({
          ...stateApp,
          tempCheckedUserDefinedLayer: null,
        }));
      }

      if (fitBounds) {
        // console.log(fitBounds);
        setStateApp((stateApp) => ({
          ...stateApp,
          fitBounds,
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
              console.log(filterLayer, filterCustomArray);
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
        map.setFilter("interest_labels", null);
        map.setFilter("parcel", null);
        map.setFilter("parcel_labels", null);
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
      if (popUps[0]) popUps[0].remove();
      //console.log(popUps);

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

  const createUDPopUp = useCallback(
    (currentFeature) => {
      console.log(currentFeature.shapeCenter);
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
    },
    [map, setStateApp]
  );

  useEffect(() => {
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
          const endpoint = `https://api.mapbox.com/v4/${wellsTileset}/tilequery/${stateApp.wellSelectedCoordinates.join()}.json?radius=1&limit=5&dedupe&layers=wellPoints&access_token=pk.eyJ1IjoibTFuZXJhbCIsImEiOiJjanYycGJxbG8yN3JsM3lsYTdnMXZoeHh1In0.tTNECYKDPtcrzivWTiZcIQ`;

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

    getPermits();
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

  const wellMouseMove = (e) => {
    map.getCanvas().style.cursor = "pointer";
  };

  const wellMouseLeave = (e) => {
    map.getCanvas().style.cursor = "";
  };

  const mapMouseMove = (e) => {
    // e.lngLat is the longitude, latitude geographical position of the event
    let coordinates = e.lngLat.wrap();
    setLng(coordinates.lng);
    setLat(coordinates.lat);
  };

  useEffect(() => {
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
        setwellsTileset(
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
        setStateApp({ ...stateApp, map: newMap, draw: Draw });

        newMap.on("load", function (e) {
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

        const selectedLayerIntereaction = stateApp.checkedLayersInteraction.slice(
          0
        );
        const wellIndex = stateApp.styleLayers.findIndex(
          (layer) => layer.name === "Wells"
        );

        const well = stateApp.styleLayers[wellIndex];

        if (well.wellMouseMove) {
          map.off("mousemove", "wellpoints", well.wellMouseMove);
          map.off("mousemove", "welllines", well.wellMouseMove);
        }

        if (well.wellMouseLeave) {
          map.off("mouseleave", "wellpoints", well.wellMouseLeave);
          map.off("mouseleave", "welllines", well.wellMouseLeave);
        }

        if (
          stateApp.checkedLayersInteraction.length > 0 &&
          selectedLayerIntereaction.indexOf(wellIndex) > -1
        ) {
          map.on("mousemove", "wellpoints", wellMouseMove);

          map.on("mouseleave", "wellpoints", wellMouseLeave);

          map.on("mousemove", "welllines", wellMouseMove);

          map.on("mouseleave", "welllines", wellMouseLeave);

          const wellcp = { ...well };
          wellcp.wellMouseLeave = wellMouseLeave;
          wellcp.wellMouseMove = wellMouseMove;

          const styleLayers = stateApp.styleLayers.slice(0);
          styleLayers[wellIndex] = wellcp;

          setStateApp({
            ...stateApp,
            styleLayers,
          });
        }
        map.off("mousemove", mapMouseMove);

        map.on("mousemove", mapMouseMove);

        console.log("map extra components complete");
      }
    }
  }, [
    map,
    setStateApp,
    setStateMapControls,
    mapStyles,
    stateApp.checkedLayersInteraction,
  ]);

  // Use effect for removing shape filter
  useEffect(() => {
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
    function drawCreateListener(e) {
      if (stateNav.drawingMode !== null) {
        let feature = e.features[0];

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
      console.log("initialize filter draw");
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
    if (map && stateApp.toggleZoomOut) {
      if (stateApp.toggleZoomOut === true) {
        map.flyTo({
          center: { lng: -98.8, lat: 38 },
          zoom: 4.88,
          pitch: 0,
          bearing: 0,
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

    let position = null;

    if (typeof update_layer.properties.shapeCenter == "string") {
      position = JSON.parse(update_layer.properties.shapeCenter);
    } else {
      position = update_layer.properties.shapeCenter;
    }

    const symbolFeature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: position,
      },
      properties: {
        ...update_layer.properties,
        id: `${update_layer.properties.id}_label`,
        label: spatialData.shapeLabel,
      },
    };

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
      const customLayerLabelId = update_layers[1]._id;

      const customLayerData = {
        shape: JSON.stringify(update_layer),
        layer: dataType,
        name: spatialData.shapeLabel,
        user: stateApp.user.mongoId,
      };
      const customLayerSymbolData = {
        shape: JSON.stringify(symbolFeature),
        layer: `${dataType}_labels`,
        name: spatialData.shapeLabel,
        user: stateApp.user.mongoId,
      };

      updateCustomLayer({
        variables: {
          customLayerId: customLayerId,
          customLayer: customLayerData,
        },
      });
      updateCustomLayer({
        variables: {
          customLayerId: customLayerLabelId,
          customLayer: customLayerSymbolData,
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

  // useEffect(() => {
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
  //       document.body.removeChild(script);
  //     };
  //   } else if (stateApp.userSnap === false){
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
      <DrawStatus drawingStatus={drawStatus} />
      <Coordinates long={lng} lat={lat} />
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
      {stateApp.mapGridCardActivated && <MapGridCard />}
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
