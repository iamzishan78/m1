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
import { MapContext } from "./MapContext";
import mapboxgl from "mapbox-gl";
import { makeStyles } from "@material-ui/core/styles";
import MapControlsProvider from "../MapControls/MapControlsProvider";
import WellCardProvider from "../WellCard/WellCardProvider";
import ExpandableCardProvider from "../ExpandableCard/ExpandableCardProvider";
import Portal from "@material-ui/core/Portal";
import PortalD from "./components/Portal";
import Coordinates from "./components/Coordinates";
import DrawStatus from "./components/DrawStatus";
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

import { useLazyQuery } from "@apollo/react-hooks";
import { WELLSQUERY } from "../../graphQL/useQueryWells";
import { TRACKSBYUSERANDOBJECTTYPE } from "../../graphQL/useQueryTracksByUserAndObjectType";
import { USERBYEMAIL } from "../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed
import { OWNERSWELLSQUERY } from "../../graphQL/useQueryOwnersWells";

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
  const [stateMap, setStateMap] = useContext(MapContext);
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
  const [defaultsCheckOnOff, setDefaultsCheckOnOff] = useState(true);
  const [m1neralCheckOnOff, setM1neralCheckOnOff] = useState(true);
  const [map, setMap] = useState(null);
  const [draw, setDraw] = useState(null);
  const [drawingFilterFeatureId, setDrawingFilterFeatureId] = useState(null);
  // const [geocoder, setGeocoder] = useState(null);
  const [anchorElPoPOver, setAnchorElPoPOver] = useState(null);
  const mapEl = useRef(null);

  mapboxgl.accessToken =
    "pk.eyJ1IjoibTFuZXJhbCIsImEiOiJjanYycGJxbG8yN3JsM3lsYTdnMXZoeHh1In0.tTNECYKDPtcrzivWTiZcIQ";

  //////////// TEMP UNTIL PROVIDER IS MADE //////////

  //////begin////////temporary  while signed user fixed

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
    getWellsForLayer,
    { data: dataWellsForOwnerWellTrackLayer },
  ] = useLazyQuery(WELLSQUERY);

  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);
  const [user, setUser] = useState({ _id: "" });
  const [tracks, setTracks] = useState(false);
  const [idArray, setIdArray] = useState(null);

  useEffect(() => {
    if (stateApp && stateApp.user && stateApp.user.email) {
      getUserByEmail({
        variables: {
          userEmail: stateApp.user.email,
        },
      });
    }
  }, [stateApp.user.email]);

  useEffect(() => {
    if (dataUser && dataUser.userByEmail) {
      setUser(dataUser.userByEmail);
    }
  }, [dataUser]);

  /////end/////////temporary while signed user fixed

  useEffect(() => {
    //////stateApp.user._id////////temporary while signed user fixed
    if (user._id !== "") {
      setLoading(true);

      tracksByUserAndObjectType({
        variables: {
          userId: user._id, //////stateApp.user._id////////temporary while signed user fixed
          objectType: "well",
        },
      });

      tracksByUserAndObjectTypeOwner({
        variables: {
          userId: user._id, //////stateApp.user._id////////temporary while signed user fixed
          objectType: "owner",
        },
      });
    }
  }, [user]); //////stateApp.user._id////////temporary while signed user fixed

  useEffect(() => {
    if (dataTracks && dataTracks.tracksByUserAndObjectType) {
      if (dataTracks.tracksByUserAndObjectType.length !== 0) {
        const tracksIdArray = dataTracks.tracksByUserAndObjectType.map(
          (track) => track.trackOn
        );

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
    if (dataOwnersWells && dataOwnersWells.length !== 0) {
      console.log(dataOwnersWells.ownersWells);
      var ownerObjectIds = dataOwnersWells.ownersWells.map(
        (item) => item.wells
      );

      var merged = [].concat.apply([], ownerObjectIds);

      var stripped = merged.map((item) => item.wellId);

      // console.log(ownerObjectIds)
      // console.log(merged)
      // console.log(stripped)

      getWellsForLayer({
        variables: {
          wellIdArray: stripped,
          authToken: stateApp.user.authToken,
        },
      });
    }
  }, [dataOwnersWells]);

  // useEffect(() => {
  //     if (dataWells) {
  //         if (
  //             dataWells.wells &&
  //             dataWells.wells.results &&
  //             dataWells.wells.results.length > 0
  //         ) {
  //             const idArray = dataWells.wells.results.map((item) => item.api);

  //             setIdArray(idArray);
  //         } else {
  //             setRows([]);
  //         }
  //         setLoading(false);
  //     }
  // }, [dataWells]);

  useEffect(() => {
    // USE EFFECT FOR M1 LAYER HANDLES
    console.log("layer ue start");
    if (stateMap.styleLayers.length > 0 && map) {
      stateMap.styleLayers.forEach((l) => {
        l.id.forEach((k) => {
          if (map.getLayer(k)) {
            map.setLayoutProperty(k, "visibility", "none");
          }
        });
      });

      if (stateMap.checkedLayers.length > 0) {
        let layers = stateMap.checkedLayers.slice(0);
        layers.sort(function (a, b) {
          return b - a;
        });
        if (layers.length > 0) {
          let belowlayer = null;
          for (let k = layers.length - 1; k >= 0; k--) {
            let i = layers[k];
            let currentLayerArray = stateMap.styleLayers[i].id;
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
  }, [map, stateMap.checkedLayers, stateMap.styleLayers]);

  useEffect(() => {
    // USE EFFECT FOR BASEMAP LAYER HANDLING
    console.log("basemap layer ue start");
    if (stateMap.baseMapLayers.length > 0 && map) {
      stateMap.baseMapLayers.forEach((l) => {
        l.id.forEach((k) => {
          if (map.getLayer(k)) {
            map.setLayoutProperty(k, "visibility", "none");
          }
        });
      });

      if (stateMap.checkedBaseLayers.length > 0) {
        let layers = stateMap.checkedBaseLayers.slice(0);
        layers.sort(function (a, b) {
          return b - a;
        });
        if (layers.length > 0) {
          let belowlayer = null;
          for (let k = layers.length - 1; k >= 0; k--) {
            let i = layers[k];
            let currentLayerArray = stateMap.baseMapLayers[i].id;
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
  }, [map, stateMap.checkedBaseLayers, stateMap.baseMapLayers]);

  useEffect(() => {
    // USE EFFECT FOR HEATMAP LAYER HANDLES
    console.log("heatmap layer ue start");
    if (stateMap.heatLayers.length > 0 && map) {
      stateMap.heatLayers.forEach((l) => {
        l.id.forEach((k) => {
          if (map.getLayer(k)) {
            map.setLayoutProperty(k, "visibility", "none");
          }
        });
      });

      if (stateMap.checkedHeats.length > 0) {
        let layers = stateMap.checkedHeats.slice(0);
        layers.sort(function (a, b) {
          return b - a;
        });
        if (layers.length > 0) {
          let belowlayer = null;
          for (let k = layers.length - 1; k >= 0; k--) {
            let i = layers[k];
            let currentLayerArray = stateMap.heatLayers[i].id;
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
  }, [map, stateMap.checkedHeats, stateMap.heatLayers]);

  // useEffect(() => {
  //   // USE EFFECT FOR HEATMAP LAYER HANDLES
  //   console.log("heatmap layer ue start");
  //   if (stateMap.heatLayers.length > 0 && map) {
  //     stateMap.heatLayers.forEach((l) => {
  //       l.id.forEach((k) => {
  //         if (map.getLayer(k)) {
  //           map.setLayoutProperty(k, "visibility", "none");
  //         }
  //       });
  //     });

  //     if (stateMap.checkedHeats.length > 0) {
  //       let layers = stateMap.checkedHeats;

  //       layers.forEach((i) => {
  //         let currentLayerArray = stateMap.heatLayers[i].id;
  //         currentLayerArray.forEach((j) => {
  //           if (map.getLayer(j)) {
  //             map.setLayoutProperty(j, "visibility", "visible");
  //           }
  //         });
  //       });
  //     }
  //   }
  // }, [map, stateMap.checkedHeats]);

  // useEffect(() => {
  //   // USE EFFECT FOR BASEMAP LAYER HANDLING
  //   console.log("basemap layer ue start");
  //   if (stateMap.baseMapLayers.length > 0 && map) {
  //     stateMap.baseMapLayers.forEach((l) => {
  //       l.id.forEach((k) => {
  //         if (map.getLayer(k)) {
  //           map.setLayoutProperty(k, "visibility", "none");
  //         }
  //       });
  //     });

  //     if (stateMap.checkedBaseLayers.length > 0) {
  //       let layers = stateMap.checkedBaseLayers;

  //       layers.forEach((i) => {
  //         let currentLayerArray = stateMap.baseMapLayers[i].id;
  //         currentLayerArray.forEach((j) => {
  //           if (map.getLayer(j)) {
  //             map.setLayoutProperty(j, "visibility", "visible");
  //           }
  //         });
  //       });
  //     }
  //   }
  // }, [map, stateMap.checkedBaseLayers]);

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

      const latArray = stateApp.trackedWellArray.wells.results.map(
        (item) => item.latitude
      );
      const longArray = stateApp.trackedWellArray.wells.results.map(
        (item) => item.longitude
      );

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

      var bbox = [
        [Math.min(...longArray), Math.min(...latArray)],
        [Math.max(...longArray), Math.max(...latArray)],
      ];

      map.fitBounds(bbox, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
      });
    }
  }, [stateApp.trackFilterOn]);

  useEffect(() => {
    // USE EFFECT FOR USER DEFINED DATA LAYER HANDLE

    if (stateMap.userDefinedLayers.length > 0 && map) {
      const layerList = stateMap.userDefinedLayers;
      console.log("cehck checked", stateMap.checkedUserDefinedLayers);
      stateMap.userDefinedLayers.forEach((l) => {
        const selectLayerProps = layerList[l];
        console.log("selected layer props", selectLayerProps);
        console.log(l);
        l.id.forEach((k) => {
          if (map.getLayer(k)) {
            console.log("get layer", k);
            map.removeLayer(k);
            map.removeSource(l.sourceProps.sourceId);
          }
        });
      });
    }

    // console.log('length', stateMap.checkedUserDefinedLayers.length)
    // console.log('checks', stateMap.checkedUserDefinedLayers)
    // console.log('dataTracks',dataTracks)
    // console.log('dataOwnersWells',dataOwnersWells)
    // console.log('dataWellsForOwnerWellTrackLayer',dataWellsForOwnerWellTrackLayer)

    if (map && stateMap.checkedUserDefinedLayers.length > 0) {
      console.log("user defined layers", stateMap.checkedUserDefinedLayers);
      console.log("length", stateMap.checkedUserDefinedLayers.length);
      const layerList = stateMap.userDefinedLayers;
      console.log("layerList", layerList);
      stateMap.checkedUserDefinedLayers.forEach((l) => {
        //console.log(l);
        const selectLayerProps = layerList[l];

        console.log("layer pros", selectLayerProps);

        if (selectLayerProps.type === "data layer") {
          // -> fetch data
          if (selectLayerProps.dataProps.dataId == "trackedWellsWells") {
            var layerData = dataWells.wells.results;
          } else if (
            selectLayerProps.dataProps.dataId == "trackedOwnersWells"
          ) {
            console.log("===========-", selectLayerProps);
            console.log(dataWellsForOwnerWellTrackLayer);
            var layerData = dataWellsForOwnerWellTrackLayer.wells.results;
          }

          if (layerData) {
            // -> make GEOJSON

            console.log(layerData);

            // const makeGeoJSON = (data) => {
            //     return {
            //         type: "FeatureCollection",
            //         features: data.map((feature) => {
            //             return {
            //                 type: "Feature",
            //                 properties: {
            //                     api: feature.api,
            //                     id: feature.id,
            //                     latitude: feature.latitude,
            //                     longitude: feature.longitude,
            //                     operator: feature.operator,
            //                     WellName: feature.wellName,
            //                 },
            //                 geometry: {
            //                     type: "Point",
            //                     coordinates: [feature.longitude, feature.latitude],
            //                 },
            //             };
            //         }),
            //     };
            // };

            const makeGeoJSON = (data) => {
              return {
                type: "FeatureCollection",
                features: data.map((feature) => {
                  if (selectLayerProps.dataProps.dataTypeId == "Point") {
                    return {
                      type: "Feature",
                      properties: feature,
                      geometry: {
                        type: selectLayerProps.dataProps.dataTypeId,
                        coordinates: [feature.longitude, feature.latitude],
                      },
                    };
                  }
                }),
              };
            };

            const myGeoJSONData = makeGeoJSON(layerData);

            console.log("geojson", myGeoJSONData);
            console.log("layerData", layerData);

            // -> add source
            map.addSource(selectLayerProps.sourceProps.sourceId, {
              type: selectLayerProps.sourceProps.sourceType,
              data: myGeoJSONData,
              cluster: true,
              clusterRadius: 50, 
              clusterMaxZoom: 6,
            });

            // -> add layer
            map.addLayer({
              id: selectLayerProps.layerProps.layerId,
              type: selectLayerProps.layerProps.layerType,
              source: selectLayerProps.sourceProps.sourceId,
              paint: selectLayerProps.layerProps.paintProps,

            });

            
            // -> add cluster layer 
            map.addLayer({
              id: 'clusters',
              type: 'circle',
              source: selectLayerProps.sourceProps.sourceId,
              filter: ['has', 'point_count'],
              paint: {
                  'circle-color': {
                      property: 'point_count',
                      type: 'interval',
                      stops: [
                          [0, '#41A337'],
                          [100, '#2D7026'],
                          [750, '#0B5703'],
                      ]
                  },
                  'circle-radius': {
                      property: 'point_count',
                      type: 'interval',
                      stops: [
                          [0, 20],
                          [100, 30],
                          [750, 40]
                      ]
                  }
              }
          });

          map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: selectLayerProps.sourceProps.sourceId,
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });
            // -> add interaction (note to change later w/ interaction panel)

            //console.log("is data layer");
            //console.log(selectLayerProps);
            //console.log(dataWells);
          }
        }

        // -> if vector layer do the normal thing
      });

      //   const makeGeoJSON = (data) => {
      //     return {
      //       type: "FeatureCollection",
      //       features: data.map((feature) => {
      //         return {
      //           type: "Feature",
      //           properties: {
      //             api: feature.api,
      //             id: feature.id,
      //             latitude: feature.latitude,
      //             longitude: feature.longitude,
      //             operator: feature.operator,
      //             WellName: feature.wellName,
      //           },
      //           geometry: {
      //             type: "Point",
      //             coordinates: [feature.longitude, feature.latitude],
      //           },
      //         };
      //       }),
      //     };
      //   };

      //   const myGeoJSONData = makeGeoJSON(
      //     stateApp.trackedWellArray.wells.results
      //   );

      //   map.addSource("track_well_points_source", {
      //     type: "geojson",
      //     data: myGeoJSONData,
      //   });

      //   map.addLayer({
      //     id: "track_well_points_layer",
      //     type: "circle",
      //     source: "track_well_points_source",
      //     paint: {
      //       "circle-radius": 5,
      //       "circle-color": "yellow",
      //     },
      //   });

      // const latArray = stateApp.trackedWellArray.wells.results.map(
      //   (item) => item.latitude
      // );
      // const longArray = stateApp.trackedWellArray.wells.results.map(
      //   (item) => item.longitude
      // );

      // map.on("click", "track_well_points_layer", function (e) {
      //   var bbox = [
      //     [e.point.x - 10, e.point.y - 10],
      //     [e.point.x + 10, e.point.y + 10],
      //   ];

      //   let features = map.queryRenderedFeatures(bbox, {
      //     layers: ["track_well_points_layer"],
      //   });

      //   setStateApp((state) => ({ ...state, flyTo: features[0].properties }));
      // });

      // map.on("mousemove", "track_well_points_layer", (e) => {
      //   map.getCanvas().style.cursor = "pointer";
      // });

      // map.on("mouseleave", "track_well_points_layer", function () {
      //   map.getCanvas().style.cursor = "";
      // });

      // var bbox = [
      //   [Math.min(...longArray), Math.min(...latArray)],
      //   [Math.max(...longArray), Math.max(...latArray)],
      // ];

      // map.fitBounds(bbox, {
      //   padding: { top: 50, bottom: 50, left: 50, right: 50 },
      // });
    }
  }, [map, stateMap.checkedUserDefinedLayers]);

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

      if (
        stateNav.defaultOn &&
        !stateNav.filterWellStatus &&
        !stateNav.filterWellType &&
        filterArray.length === 0
      ) {
        let defaultTypeName = ["typeName", ["GAS", "OIL AND GAS", "OIL"]];
        let defaultStatusName = ["statusName", ["ACTIVE", "PERMIT"]];
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
        setStateNav((stateNav) => ({
          ...stateNav,
          defaultOn: false,
          statusName: defaultStatusName[1],
          typeName: defaultTypeName[1],
          m1neralDefaultFilters: m1neralDefaults,
          filterWellStatus: defaultFiltersWellStatus[1],
          filterWellType: defaultFiltersWellType[1],
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
        stateNav.filterTrackedWells &&
        stateNav.filterTrackedWells.length > 0
      ) {
        filterArray.push(stateNav.filterTrackedWells);
        isFilterSet = true;
        tagFilterCount += 1;
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

      if (stateNav.filterBasin && stateNav.filterBasin.length > 0) {
        let total = stateNav.filterBasin[2].length;
        filterArray.push(stateNav.filterBasin);
        isFilterSet = true;
        geographyFilterCount += total;
        totalCount += total;
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
        filterArray.push(stateNav.filterDrawing);
        isFilterSet = true;
        totalCount += 1;
        geographyFilterCount += 1;
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
        filterArray.unshift("all");
        map.setFilter("wellpoints", filterArray);
        map.setFilter("welllines", filterArray);
        map.setFilter("wellsHeatmapBoe", filterArray);
        map.setFilter("wellsHeatmapLast12", filterArray);
        map.setFilter("wellsHeatmapIP90Oil", filterArray);
        map.setFilter("wellsHeatmapIP90Gas", filterArray);
        map.setFilter("wellsHeatmapRecentlyDrilled", filterArray);
        map.setFilter("wellsHeatmapRecentlyCompleted", filterArray);
      } else {
        map.setFilter("wellpoints", null);
        map.setFilter("welllines", null);
        map.setFilter("wellsHeatmapBoe", null);
        map.setFilter("wellsHeatmapLast12", null);
        map.setFilter("wellsHeatmapIP90Oil", null);
        map.setFilter("wellsHeatmapIP90Gas", null);
        map.setFilter("wellsHeatmapRecentlyDrilled", null);
        map.setFilter("wellsHeatmapRecentlyCompleted", null);
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
    stateNav.filterOwnerConfidence,
    stateNav.filterOwnerWellInterestSum,
    stateNav.filterWellAppraisal,
    stateNav.filterOwnerAppraisals,
    stateNav.filterDrawing,
  ]);

  useEffect(() => {
    //sets style of map when changed in Map Controls
    if (stateMap.selectedLayerId && map) {
      if (stateMap.selectedLayerId) {
        map.setStyle(stateMap.selectedLayerId);
      }
    }
  }, [map, stateMap.selectedLayerId]);

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
    const req = new Request(
      "https://api.mapbox.com/styles/v1/m1neral?access_token=sk.eyJ1IjoibTFuZXJhbCIsImEiOiJjazdkbGg1YXAwMjVqM2VwanZzbm95Z2dvIn0.cdoQNZU42xxbybyGxlBNkw",
      {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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

    setStateApp((state) => ({
      ...state,
      popupOpen: false,
      expandedCard: false,
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
    if (stateApp.popupOpen === false) {
      setStateApp((state) => ({
        ...state,
        wellSelectedCoordinates: [],
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

  useEffect(() => {
    console.log("map ue start");
    if (mapStyles.length > 0) {
      // const SET_INITIAL_MAP_STYLE = "Satellite";

      const initializeMap = ({ setMap, mapEl, setStateMap, setDraw }) => {
        let id = mapEl.current.id;

        var index = getIndex(stateApp.mapVars.styleId, mapStyles, "name");

        console.log("tileset api loaded - style selected", stateMap.mapStyle);
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

        //       const endpoint = 'https://m1neral-search.search.windows.net/indexes/wellheader-index/docs?api-version=2019-05-06&$count=true&searchFields=WellName,ApiNumber&$top=5&search=' + query;

        //       const headers = new Headers();
        //       headers.append('Content-Type', 'application/json')
        //       headers.append('api-key', 'C7D8ADB027CCBA30133479D51D669526');

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
        setStateMap({ ...stateMap, map: newMap, draw: Draw });

        newMap.on("load", function (e) {
          setDraw(Draw);
          setMap(newMap);
          console.log("set new map complete", newMap.loaded());
        });
      };

      if (!map) {
        console.log("initialize map start");
        initializeMap({ setMap, mapEl, setStateMap, setDraw });
        console.log("initialize map finish");
      } else {
        console.log("map extra components start");

        // additional map interactions
        // for some reason these do not work when initializing but do here
        // map.boxZoom.enable();
        // map.touchZoomRotate.enable();

        map.on("click", "wellpoints", function (e) {
          var bbox = [
            [e.point.x - 10, e.point.y - 10],
            [e.point.x + 10, e.point.y + 10],
          ];
          let features = map.queryRenderedFeatures(bbox, {
            layers: ["wellpoints"],
          });
          let currentFeature = features[0];
          console.log("current feature", currentFeature);

          setStateApp((state) => ({
            ...state,
            popupOpen: false,
          }));
          setStateApp((state) => ({
            ...state,
            selectedWell: currentFeature.properties,
            selectedWellId: currentFeature.properties.api,
            wellSelectedCoordinates: [
              currentFeature.properties.longitude,
              currentFeature.properties.latitude,
            ],
          }));

          createPopUp(currentFeature.properties);
          map.resize();
        });

        map.on("mousemove", "wellpoints", (e) => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "wellpoints", function () {
          map.getCanvas().style.cursor = "";
        });

        map.on("mousemove", (e) => {
          // e.lngLat is the longitude, latitude geographical position of the event
          let coordinates = e.lngLat.wrap();
          setLng(coordinates.lng);
          setLat(coordinates.lat);
        });

        map.on("mousemove", "welllines", (e) => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "welllines", function () {
          map.getCanvas().style.cursor = "";
        });

        map.on("click", "welllines", function (e) {
          var bbox = [
            [e.point.x - 10, e.point.y - 10],
            [e.point.x + 10, e.point.y + 10],
          ];
          let features = map.queryRenderedFeatures(bbox, {
            layers: ["welllines"],
          });

          let currentFeature = features[0];

          console.log("clicked well lines", currentFeature);

          setStateApp((state) => ({
            ...state,
            popupOpen: false,
          }));
          setStateApp((state) => ({
            ...state,
            selectedWell: currentFeature.properties,
            selectedWellId: currentFeature.properties.api,
            wellSelectedCoordinates: [
              currentFeature.properties.longitude,
              currentFeature.properties.latitude,
            ],
          }));

          createPopUp(currentFeature.properties);
        });
        console.log("map extra components complete");
      }
    }
  }, [map, setStateMap, setStateMapControls, mapStyles]);

  // Use effect for removing shape filter
  useEffect(() => {
    if (stateNav.filterDrawing.length === 0) {
      if (draw) draw.delete(drawingFilterFeatureId);
      setStateNav((stateNav) => ({
        ...stateNav,
        drawingMode: null,
        filterDrawing: stateNav.filterDrawing,
        filterFeatureId: null,
      }));
      setDrawingFilterFeatureId(null);
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
        setStateNav((stateNav) => ({
          ...stateNav,
          filterDrawing: ["within", feature],
        }));
      }
    }

    if (stateNav.drawingMode) {
      // delete previous filter feature
      stateMap.draw.delete(drawingFilterFeatureId);

      setDrawingFilterFeatureId(stateNav.filterFeatureId);
      stateMap.draw.changeMode(stateNav.drawingMode);
      if (map) {
        map.on("draw.create", drawCreateListener);
        map.on("draw.update", drawUpdateListener);
      }
    }
  }, [stateNav.filterFeatureId]);

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
        console.log("**************************");

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
        zoom: zVal,
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
        console.log("fitBounds", maxLat, minLat, maxLong, minLong);

        const latDif = maxLat - minLat;
        const longDif = maxLong - minLong;

        if (latDif === 0) {
          maxLat = maxLat + 0.005;
          minLat = minLat - 0.005;
        } else {
          maxLat = maxLat + latDif * 0.03;
          minLat = minLat - latDif * 0.03;
        }

        if (longDif === 0) {
          maxLat = maxLat + 0.005;
          minLat = minLat - 0.005;
        } else {
          maxLat = maxLat + longDif * 0.03;
          minLat = minLat - longDif * 0.03;
        }

        return {
          maxLat,
          minLat,
          maxLong,
          minLong,
        };
      };

      map.fitBounds([
        [fitOverBounds().minLong, fitOverBounds().minLat],
        [fitOverBounds().maxLong, fitOverBounds().maxLat],
      ]);
    }
  }, [map, stateApp.fitBounds]);

  useEffect(() => {
    if (map && stateMap.toggleZoomOut) {
      if (stateMap.toggleZoomOut === true) {
        map.flyTo({
          center: { lng: -98.8, lat: 31.6 },
          zoom: 5.88,
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

        setStateMap((stateMap) => ({ ...stateMap, toggleZoomOut: null }));
      }
    }
  }, [stateMap.toggleZoomOut]);

  useEffect(() => {
    if (map && stateMap.toggle3d) {
      if (stateMap.toggle3d === true) {
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
        setStateMap((stateMap) => ({ ...stateMap, toggle3d: null }));
      }
    }
  }, [stateMap.toggle3d]);

  const handleOpenExpandableCard = (e) => {
    setAnchorElPoPOver(container.current);
    setShowExpandableCard(true);
  };

  const handleCloseExpandableCard = () => {
    setShowExpandableCard(false);
    setAnchorElPoPOver(null);
    setStateApp((state) => ({ ...state, expandedCard: false }));
  };

  useEffect(() => {
    if (stateApp.userSnap === true) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "//api.usersnap.com/load/64ab8ea7-9417-41a0-b565-eb7ad69da871.js";
      script.async = true;

      var x = document.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(script, x);

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [stateApp.userSnap]);

  return (
    <div className={classes.mapWrapper}>
      <div className={classes.map} ref={mapEl} id="map">
        {map ? <DefaultFiltersTest /> : null}
        <div className={classes.footerLeftLogo}>
          <img src="icons/M1LogoWhiteTransparent.png" alt="logo" width="150" />
        </div>
      </div>
      <MapControlsProvider />
      <DrawStatus drawingStatus={stateApp.editDraw} />
      <Coordinates long={lng} lat={lat} />
      <div id="tempPopupHolder" className={classes.portal} ref={container} />
      <Portal container={container.current}>
        {stateApp.popupOpen ? (
          <div>
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
          </div>
        ) : null}
      </Portal>
    </div>
  );
}
