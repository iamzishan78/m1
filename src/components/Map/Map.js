import React, {
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback
} from "react";
import { AppContext } from "../../AppContext";
import { NavigationContext } from "../Navigation/NavigationContext";
import { MapControlsContext } from "../MapControls/MapControlsContext";

import { MapContext } from "./MapContext";
import mapboxgl from "mapbox-gl";
import { makeStyles } from "@material-ui/core/styles";
import MapControlsProvider from "../MapControls/MapControlsProvider";
import WellCardProvider from "../WellCard/WellCardProvider";
import ExpandableCardProvider from "../ExpandableCard/ExpandableCardProvider";
import WellsProvider from "../Wells/WellsProvider";
import Portal from '@material-ui/core/Portal';
import PortalD from "./components/Portal";
import Coordinates from "./components/Coordinates";
import "./popup.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode
} from "mapbox-gl-draw-circle";
import DrawRectangle from "mapbox-gl-draw-rectangle-mode";
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

const useStyles = makeStyles(theme => ({
  mapWrapper: {
    width: "100%"
  },
  map: {
    position: "absolute",
    top: "64px",
    bottom: "0",
    width: "100%",
    height: "calc(100% - 64px)",
    overflow: "hidden !important",
    "& a.mapboxgl-ctrl-logo, .mapboxgl-ctrl.mapboxgl-ctrl-attrib":{
      display:"none"
    }
  },
  footerLeftLogo: {
    position: "absolute",
    bottom: "5px",
    zIndex: "1",
    left: "10px",
    //textShadow: "1px 0 0 black, -1px 0 0 black, 0 1px 0 black, 0 -1px 0 black",
    // color: "#ffffff",
    // fontSize: "16px",
    // fontWeight: "bold",
    // opacity: "0.82",
    // "& img": {
    //   padding: "2px 2px 4px 2px",
    //   backgroundImage:
    //     "radial-gradient(#ffffff00,rgba(0, 0, 0, 0.671), #ffffff00,  #ffffff00)",
    //   position: "absolute",
    //   bottom: "-40px"
    //},
    // "& p": {
    //   position: "absolute",
    //   left: "23px"
    // }
  },
  portal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  }
}));

export default function Map() {
  let classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateMap, setStateMap] = useContext(MapContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [filtersDefault , setFiltersDefault] = useState(
    stateApp.user.defaultFilters ? stateApp.user.defaultFilters: []
  );
  const [lng , setLng] = useState();
  const [lat, setLat] = useState();
  // const [pageX, setPageX] =useState();
  // const [pageY, setPageY] =useState();
  const container = useRef(null);
  const [showExpandableCard, setShowExpandableCard] = useState(false);
  const [mapStyles, setMapStyles] = useState([]);
  const [map, setMap] = useState(null);
  const mapEl = useRef(null);
  mapboxgl.accessToken =
    "pk.eyJ1IjoibTFuZXJhbCIsImEiOiJjanYycGJxbG8yN3JsM3lsYTdnMXZoeHh1In0.tTNECYKDPtcrzivWTiZcIQ";

  useEffect(() => {
    if (stateMap.checkedLayers && map) {
      stateMap.styleLayers.forEach(l => {
        l.id.forEach(k => {
          map.setLayoutProperty(k, "visibility", "none");
        });
      });

      if (stateMap.checkedLayers.length > 0) {
        let layers = stateMap.checkedLayers;

        layers.forEach(i => {
          let currentLayerArray = stateMap.styleLayers[i].id;
          currentLayerArray.forEach(j => {
            map.setLayoutProperty(j, "visibility", "visible");
          });
        });
      }
    }
  }, [map, stateMap.checkedLayers, stateMap.styleLayers]);
  
  useEffect(() => {
    if (stateMap.checkedHeats && map) {
      stateMap.heatLayers.forEach(l => {
        l.id.forEach(k => {
          map.setLayoutProperty(k, "visibility", "none");
        });
      });

      if (stateMap.checkedHeats.length > 0) {
        let layers = stateMap.checkedHeats;

        layers.forEach(i => {
          let currentLayerArray = stateMap.heatLayers[i].id;
          currentLayerArray.forEach(j => {
            map.setLayoutProperty(j, "visibility", "visible");
          });
        });
      }
    }
  }, [map, stateMap.checkedHeats]);

  useEffect(() => {
    //applies filter when one of the filters change
    if (map) {
      let isFilterSet = false;

      let wellFilterCount = 0;
      let ownershipFilterCount = 0;
      let productionFilterCount = 0;
      let geographyFilterCount = 0;
      let filterArray = [];

      if (stateNav.defaultOn && !stateNav.filterWellStatus && !stateNav.filterWellType  && filterArray.length === 0) {
        let defaultTypeName = ["GAS","OIL AND GAS" ,"OIL"];
        let defaultStatusName = ["ACTIVE", "PERMIT"];
        let defaultFiltersWellStatus = ['match', ['get', 'wellStatus'] , defaultStatusName , true, false];
        let defaultFiltersWellType =   ['match', ['get', 'wellType'],defaultTypeName  , true, false];
        setStateNav(stateNav => ({ ...stateNav, defaultOn: false ,statusName: defaultStatusName  ,typeName: defaultTypeName  ,filterWellStatus: defaultFiltersWellStatus, filterWellType: defaultFiltersWellType }))
      }
      if (stateNav.filterWellProfile && stateNav.filterWellProfile.length > 0) {
        let total = stateNav.filterWellProfile[2].length
        filterArray.push(stateNav.filterWellProfile);
        isFilterSet = true;

        wellFilterCount += total;
      }
      if (stateNav.filterWellType && stateNav.filterWellType.length > 0) {
        let total = stateNav.filterWellType[2].length
        filterArray.push(stateNav.filterWellType);
        isFilterSet = true;
        wellFilterCount += total;
      }
      if (stateNav.filterWellStatus && stateNav.filterWellStatus.length > 0) {
        let total = stateNav.filterWellStatus[2].length
        filterArray.push(stateNav.filterWellStatus);
        isFilterSet = true;
        wellFilterCount += total;
      }
      if (stateNav.filterOperator && stateNav.filterOperator.length > 0) {
        let total = stateNav.filterOperator[2].length
        filterArray.push(stateNav.filterOperator);
        isFilterSet = true;
        wellFilterCount += total;
      }
      if (
        stateNav.filterCumulativeOil &&
        stateNav.filterCumulativeOil.length > 0
      ) {
        filterArray.push(stateNav.filterCumulativeOil);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterCumulativeGas &&
        stateNav.filterCumulativeGas.length > 0
      ) {
        filterArray.push(stateNav.filterCumulativeGas);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterCumulativeWater &&
        stateNav.filterCumulativeWater.length > 0
      ) {
        filterArray.push(stateNav.filterCumulativeWater);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterFirstMonthWater &&
        stateNav.filterFirstMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterFirstMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterFirstThreeMonthWater &&
        stateNav.filterFirstThreeMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterFirstThreeMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterFirstSixMonthWater &&
        stateNav.filterFirstSixMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterFirstSixMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterFirstTwelveMonthWater &&
        stateNav.filterFirstTwelveMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterFirstTwelveMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterLastMonthWater &&
        stateNav.filterLastMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterLastMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterLastThreeMonthWater &&
        stateNav.filterLastThreeMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterLastThreeMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterLastSixMonthWater &&
        stateNav.filterLastSixMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterLastSixMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterLastTwelveMonthWater &&
        stateNav.filterLastTwelveMonthWater.length > 0
      ) {
        filterArray.push(stateNav.filterLastTwelveMonthWater);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterFirstMonthGas &&
        stateNav.filterFirstMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterFirstMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterFirstThreeMonthGas &&
        stateNav.filterFirstThreeMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterFirstThreeMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterFirstSixMonthGas &&
        stateNav.filterFirstSixMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterFirstSixMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterFirstTwelveMonthGas &&
        stateNav.filterFirstTwelveMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterFirstTwelveMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterLastMonthGas &&
        stateNav.filterLastMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterLastMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterLastThreeMonthGas &&
        stateNav.filterLastThreeMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterLastThreeMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterLastSixMonthGas &&
        stateNav.filterLastSixMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterLastSixMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterLastTwelveMonthGas &&
        stateNav.filterLastTwelveMonthGas.length > 0
      ) {
        filterArray.push(stateNav.filterLastTwelveMonthGas);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterFirstMonthOil &&
        stateNav.filterFirstMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterFirstMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterFirstThreeMonthOil &&
        stateNav.filterFirstThreeMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterFirstThreeMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterFirstSixMonthOil &&
        stateNav.filterFirstSixMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterFirstSixMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterFirstTwelveMonthOil &&
        stateNav.filterFirstTwelveMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterFirstTwelveMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterLastMonthOil &&
        stateNav.filterLastMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterLastMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterLastThreeMonthOil &&
        stateNav.filterLastThreeMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterLastThreeMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterLastSixMonthOil &&
        stateNav.filterLastSixMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterLastSixMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterLastTwelveMonthOil &&
        stateNav.filterLastTwelveMonthOil.length > 0
      ) {
        filterArray.push(stateNav.filterLastTwelveMonthOil);
        isFilterSet = true;
        productionFilterCount += 1;
      }
      if (
        stateNav.filterAllInterestTypes &&
        stateNav.filterAllInterestTypes.length > 0
      ) {
        let removeAny = 1;
        let numberFiltes = stateNav.filterAllInterestTypes.length
        let total = numberFiltes - removeAny;
        filterArray.push(stateNav.filterAllInterestTypes);
        isFilterSet = true;
        ownershipFilterCount += total;
      }
      if (
        stateNav.filterAllOwnershipTypes &&
        stateNav.filterAllOwnershipTypes.length > 0
      ) {
        let removeAny = 1;
        let numberFiltes = stateNav.filterAllOwnershipTypes.length
        let total = numberFiltes - removeAny;
        filterArray.push(stateNav.filterAllOwnershipTypes);
        isFilterSet = true;
        ownershipFilterCount += total;
      }
      if (stateNav.filterBasin && stateNav.filterBasin.length > 0) {
        let total = stateNav.filterBasin[2].length
        filterArray.push(stateNav.filterBasin);
        isFilterSet = true;
        geographyFilterCount += total;
      }

      if (stateNav.filterPlay && stateNav.filterPlay.length > 0) {
        let total = stateNav.filterPlay[2].length
        filterArray.push(stateNav.filterPlay);
        isFilterSet = true;
        geographyFilterCount += total;
      }

      if (
        stateNav.filterPermitDateRange &&
        stateNav.filterPermitDateRange.length > 0
      ) {
        filterArray.push(stateNav.filterPermitDateRange);
        isFilterSet = true;

        wellFilterCount += 1;
      }
      if (
        stateNav.filterSpudDateRange &&
        stateNav.filterSpudDateRange.length > 0
      ) {
        filterArray.push(stateNav.filterSpudDateRange);
        isFilterSet = true;

        wellFilterCount += 1;
      }
      if (
        stateNav.filterCompletetionDateRange &&
        stateNav.filterCompletetionDateRange.length > 0
      ) {
        filterArray.push(stateNav.filterCompletetionDateRange);
        isFilterSet = true;

        wellFilterCount += 1;
      }
      if (
        stateNav.filterFirstProdDateRange &&
        stateNav.filterFirstProdDateRange.length > 0
      ) {
        filterArray.push(stateNav.filterFirstProdDateRange);
        isFilterSet = true;

        wellFilterCount += 1;
      }
      if (stateNav.filterGeography && stateNav.filterGeography.length > 0) {
        filterArray.push(stateNav.filterGeography);
        isFilterSet = true;

        geographyFilterCount += 1;
      }

      setStateNav(state => ({ ...state, wellFilterCount: wellFilterCount }));
      setStateNav(state => ({
        ...state,
        ownershipFilterCount: ownershipFilterCount
      }));
      setStateNav(state => ({
        ...state,
        productionFilterCount: productionFilterCount
      }));
      setStateNav(state => ({
        ...state,
        geographyFilterCount: geographyFilterCount
      }));

      if (isFilterSet) {
        // if (filterArray && filterArray.length > 0 ) {
        //   filterArray.unshift("all");
        // } else {
        //   defaultFilterArray.unshift("all");
        // }
        filterArray.unshift("all");

        console.log("all current filters", filterArray);

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
  }, [map, setStateNav, stateNav.defaultOn, stateNav.filterAllInterestTypes, stateNav.filterAllOwnershipTypes, stateNav.filterBasin, stateNav.filterCompletetionDateRange, stateNav.filterCumulativeGas, stateNav.filterCumulativeOil, stateNav.filterCumulativeWater, stateNav.filterFirstMonthGas, stateNav.filterFirstMonthOil, stateNav.filterFirstMonthWater, stateNav.filterFirstProdDateRange, stateNav.filterFirstSixMonthGas, stateNav.filterFirstSixMonthOil, stateNav.filterFirstSixMonthWater, stateNav.filterFirstThreeMonthGas, stateNav.filterFirstThreeMonthOil, stateNav.filterFirstThreeMonthWater, stateNav.filterFirstTwelveMonthGas, stateNav.filterFirstTwelveMonthOil, stateNav.filterFirstTwelveMonthWater, stateNav.filterGeography, stateNav.filterLastMonthGas, stateNav.filterLastMonthOil, stateNav.filterLastMonthWater, stateNav.filterLastSixMonthGas, stateNav.filterLastSixMonthOil, stateNav.filterLastSixMonthWater, stateNav.filterLastThreeMonthGas, stateNav.filterLastThreeMonthOil, stateNav.filterLastThreeMonthWater, stateNav.filterLastTwelveMonthGas, stateNav.filterLastTwelveMonthOil, stateNav.filterLastTwelveMonthWater, stateNav.filterOperator, stateNav.filterPermitDateRange, stateNav.filterPlay, stateNav.filterSpudDateRange, stateNav.filterWellProfile, stateNav.filterWellStatus, stateNav.filterWellType]);

  useEffect(() => {
    //sets style of map when changed in Map Controls
    if (stateMap.selectedLayerId && map) {
      if (stateMap.selectedLayerId) {
        map.setStyle(stateMap.selectedLayerId);
      }
    }
  }, [map, stateMap.selectedLayerId]);

  // const createPopUp = currentFeature => {
    
  // };

  const createPopUp = useCallback((currentFeature) => {
    let coordinates = [currentFeature.longitude, currentFeature.latitude];
    let popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();
    // create DOM element for the marker;
    let popup = new mapboxgl.Popup({ offset: 0, closeOnClick: false })
    .setLngLat(coordinates)
    .setHTML(`<div id="popupContainer"></div>`)
    .addTo(map);
    
    // //show wellcard in popup Portal
    setStateApp(state => ({ ...state, popupOpen: true }));
    handleOpenExpandableCard();
  },[map, setStateApp]) 

  useEffect(() => {
    const req = new Request(
      "https://api.mapbox.com/styles/v1/m1neral?access_token=sk.eyJ1IjoibTFuZXJhbCIsImEiOiJjazdkbGg1YXAwMjVqM2VwanZzbm95Z2dvIn0.cdoQNZU42xxbybyGxlBNkw",
      {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(req, { signal: signal })
      .then(results => results.json())
      .then(data => {
        setMapStyles(data.slice(0, 4));
      });

    //clean up
    return function cleanup() {
      abortController.abort();
    };
  }, []);




  // useEffect(() => {
  //   console.log("XXXXXXXXXXXXX", Date.now(), mapStyles); //////temporary///////////////////
  // }, [mapStyles]);



  function getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  }


  
  useEffect(() => {
    if (mapStyles.length > 0) {
      const SET_INITIAL_MAP_STYLE = "Satellite";
      var index = getIndex(SET_INITIAL_MAP_STYLE, mapStyles, "name");

      const initializeMap = ({ setMap, mapEl, setStateMap }) => {
        let id = mapEl.current.id;

        const newMap = new mapboxgl.Map({
          container: `${id}`,
          style: "mapbox://styles/m1neral/" + mapStyles[index].id,
          center: mapStyles[index].center,
          zoom: mapStyles[index].zoom,
          //pitch: mapStyles[index].pitch,
          //bearing: mapStyles[index].bearing
        });
        

        newMap.addControl(
          new mapboxgl.ScaleControl({
            maxWidth: 80,
            unit: 'imperial'
          }),"bottom-right");
      
        newMap.addControl(
          new mapboxgl.NavigationControl()
          , "bottom-right");

        newMap.addControl(
          new mapboxgl.FullscreenControl()
          , "bottom-right");
        
      
        newMap.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showAccuracyCircle: true
          }),
          "bottom-right"
        );

        newMap.addControl(
          new MapboxGeocoder({
          //accessToken: "sk.eyJ1IjoibTFuZXJhbCIsImEiOiJjazdkbGg1YXAwMjVqM2VwanZzbm95Z2dvIn0.cdoQNZU42xxbybyGxlBNkw",
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl
        })
          ,"top-left");



        let Draw = new MapboxDraw({
          displayControlsDefault: false,
          userProperties: true,
          modes: {
            ...MapboxDraw.modes,
            draw_circle: CircleMode,
            drag_circle: DragCircleMode,
            direct_select: DirectMode,
            simple_select: SimpleSelectMode,
            draw_rectangle: DrawRectangle
          }
        });
        newMap.addControl(Draw);
        setStateMap({ ...stateMap, map: newMap, draw: Draw });


        newMap.on("load", function(e) {
          setMap(newMap);
        });


      };

      if (!map) {
        initializeMap({ setMap, mapEl, setStateMap });
      } else {


        console.log('threed state', stateMap.toggle3d)



      if (stateMap.toggle3d === true) {
          map.setPitch(70)
          map.setBearing(20)
        }
      else{
          map.setPitch(0)
          map.setBearing(0)          
        }



        map.on("click", "wellpoints", function(e) {
          //console.log('click event', e)
          var bbox = [
            [e.point.x - 1, e.point.y - 10],
            [e.point.x + 10, e.point.y + 1]
          ];
          let features = map.queryRenderedFeatures(bbox, {
            layers: ["wellpoints"]
          });
          let currentFeature = features[0];

          if (!currentFeature.properties.isTracked) {
            //add temp until it is in tileset. required for tracking well
            currentFeature.properties.isTracked = false;
          }

          console.log("clicked well point", currentFeature);
          setStateApp(state => ({ ...state, popupOpen: false }));
          setStateApp(state => ({
            ...state,
            selectedWell: currentFeature.properties
          }));
          setStateApp(state => ({
            ...state,
            selectedWellId: currentFeature.properties.api
          }));
          // setStateApp(state => ({
          //   ...state,
          //   selectedWellId: currentFeature.properties.api
          // }));

          createPopUp(currentFeature.properties);
        });

        map.on("mousemove", "wellpoints", e => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "wellpoints", function() {
          map.getCanvas().style.cursor = "";
        });

        map.on("mousemove",  e => {
          // e.lngLat is the longitude, latitude geographical position of the event
          let coordinates =  e.lngLat.wrap()
          setLng(coordinates.lng)
          setLat(coordinates.lat)
        });
        
        map.on("mousemove", "welllines", e => {
          map.getCanvas().style.cursor = "pointer";
        });
        
        map.on("mouseleave", "welllines", function() {
          map.getCanvas().style.cursor = "";
        });


          
        map.on("click", "welllines", function(e) {
          var bbox = [
            [e.point.x - 10, e.point.y - 10],
            [e.point.x + 10, e.point.y + 10]
          ];
          let features = map.queryRenderedFeatures(bbox, {
            layers: ["welllines"]
          });

          let currentFeature = features[0];

          if (!currentFeature.properties.isTracked) {
            //add temp until it is in tileset. required for tracking well
            currentFeature.properties.isTracked = false;
          }

          console.log("clicked well lines", currentFeature);
          setStateApp(state => ({ ...state, popupOpen: false }));

          setStateApp(state => ({
            ...state,
            selectedWell: currentFeature.properties
          }));
          setStateApp(state => ({
            ...state,
            selectedWellId: currentFeature.properties.api
          }));
          createPopUp(currentFeature.properties);
        });
      }
    }
  }, [map, setStateMap, setStateMapControls, mapStyles,stateMap.toggle3d]);

  useEffect(() => {
    if (map && stateApp.flyTo) {
      //console.log('fly')
      createPopUp(stateApp.flyTo);

      map.flyTo({
        center: [stateApp.flyTo.longitude, stateApp.flyTo.latitude],
        zoom: 15,
        speed: 0.9
      });
    }
  }, [createPopUp, map, stateApp.flyTo]);

  // console.log("---")
  // console.log(stateMap.flyTo)
  const handleOpenExpandableCard = e => {
    //setStateApp(state => ({...state,showExpandableCard:true}))
    //console.log(e.nativeEvent)
    //setMouseX(e.nativeEvent.clientX)
    // setMouseY(e.nativeEvent.clientY-70)

    //setStateApp(state => ({...state,selectedWell:row}))
    setShowExpandableCard(true);
  };
  const handleCloseExpandableCard = () => {
    setShowExpandableCard(false);
    // setStateApp(state => ({...state,showExpandableCard:true}))
  };

  return (
    <div className={classes.mapWrapper}>
      <div className={classes.map}  ref={mapEl} id="map">
        <div className={classes.footerLeftLogo}>
          <img src="icons/M1LogoWhiteTransparent.png" alt="logo" width="150" />
        </div> 
      </div>
      <MapControlsProvider />
      <Coordinates long={lng} lat={lat} />
      <div  className={classes.portal} ref={container} />
      {stateMap.openTrack == true ? (
        <div className={classes.trackLists}>
          {<WellsProvider showList={true} parent="track" />}
        </div>
      ) : null}
      <Portal container={container.current}>
      {stateApp.popupOpen ? (
        <div>
          <div
            id="tempPopupHolder"
            style={{ position: "absolute", top: "0px", left: "20px" }}
          ></div>
          <PortalD id="popupContainer" >
            {showExpandableCard ? (
              <ExpandableCardProvider
                expanded={false}
                handleCloseExpandableCard={handleCloseExpandableCard}
                component={<WellCardProvider></WellCardProvider>}
                title={stateApp.selectedWell.wellName}
                subTitle={stateApp.selectedWell.operator}
                Api={stateApp.selectedWell.api}
                parent="map"
                mouseX={0}
                mouseY={0}
                position="relative"
                cardLeft={20}
                cardTop={70}
                zIndex={99}
                cardWidth="380px"
                cardHeight="380px"
                cardWidthExpanded="95vw"
                cardHeightExpanded="90vh"
                source={stateApp.user}
                sourceSourceId={stateApp.user.id}
                sourceName={stateApp.user.name}
                sourceLabel="user"
                target={stateApp.selectedWell}
                targetSourceId={stateApp.selectedWell.id}
                targetName={stateApp.selectedWell.wellName}
                targetLabel="well"
              ></ExpandableCardProvider>
            ) : null}
            {/* {stateApp.selectedWell ? <WellCardProvider /> : null} */}
          </PortalD>
        </div>
      ) : null}
      </Portal>
    </div>
  );
}
