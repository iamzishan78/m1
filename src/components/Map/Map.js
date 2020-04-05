import React, {
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useEffect
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
import Portal from "./components/Portal";
import "./popup.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode
} from "mapbox-gl-draw-circle";
import DrawRectangle from "mapbox-gl-draw-rectangle-mode";
//import { getConstantValue } from "typescript";
//import mapStylesTemp from "./components/Utils/MapStyles";

const useStyles = makeStyles(theme => ({
  mapWrapper: {
    width: "100%"
  },
  map: {
    position: "absolute",
    top: "0",
    bottom: "0",
    width: "100%",
    height: "100%",
    overflow: "hidden !important"
    // "& a.mapboxgl-ctrl-logo, .mapboxgl-ctrl.mapboxgl-ctrl-attrib":{
    //   display:"none"
    // }
  },
  footerLeftLogo: {
    position: "absolute",
    bottom: "45px",
    zIndex: "1",
    left: "7px",
    textShadow: "1px 0 0 black, -1px 0 0 black, 0 1px 0 black, 0 -1px 0 black",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    opacity: "0.82",
    "& img": {
      padding: "2px 2px 4px 2px",
      backgroundImage:
        "radial-gradient(#ffffff00,rgba(0, 0, 0, 0.671), #ffffff00,  #ffffff00)",
      position: "absolute",
      bottom: "-40px"
    },
    "& p": {
      position: "absolute",
      left: "23px"
    }
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
  }, [map, stateMap.checkedLayers]);

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

      if (stateNav.filterWellProfile && stateNav.filterWellProfile.length > 0) {
        filterArray.push(stateNav.filterWellProfile);
        isFilterSet = true;

        wellFilterCount += 1;
      }
      if (stateNav.filterWellType && stateNav.filterWellType.length > 0) {
        filterArray.push(stateNav.filterWellType);
        isFilterSet = true;
        wellFilterCount += 1;
      }
      if (stateNav.filterWellStatus && stateNav.filterWellStatus.length > 0) {
        filterArray.push(stateNav.filterWellStatus);
        isFilterSet = true;
        wellFilterCount += 1;
      }
      if (stateNav.filterOperator && stateNav.filterOperator.length > 0) {
        filterArray.push(stateNav.filterOperator);
        isFilterSet = true;
        wellFilterCount += 1;
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
        stateNav.filterOwnershipTypeReligiousInstitutions &&
        stateNav.filterOwnershipTypeReligiousInstitutions.length > 0
      ) {
        filterArray.push(stateNav.filterOwnershipTypeReligiousInstitutions);
        isFilterSet = true;
        ownershipFilterCount += 1;
      }
      if (
        stateNav.filterOwnershipTypeGovernmentalBodies &&
        stateNav.filterOwnershipTypeGovernmentalBodies.length > 0
      ) {
        filterArray.push(stateNav.filterOwnershipTypeGovernmentalBodies);
        isFilterSet = true;
        ownershipFilterCount += 1;
      }
      if (
        stateNav.filterOwnershipTypeNonProfits &&
        stateNav.filterOwnershipTypeNonProfits.length > 0
      ) {
        filterArray.push(stateNav.filterOwnershipTypeNonProfits);
        isFilterSet = true;
        ownershipFilterCount += 1;
      }
      if (
        stateNav.filterOwnershipTypeTrusts &&
        stateNav.filterOwnershipTypeTrusts.length > 0
      ) {
        filterArray.push(stateNav.filterOwnershipTypeTrusts);
        isFilterSet = true;
        ownershipFilterCount += 1;
      }
      if (
        stateNav.filterOwnershipTypeCorporations &&
        stateNav.filterOwnershipTypeCorporations.length > 0
      ) {
        filterArray.push(stateNav.filterOwnershipTypeCorporations);
        isFilterSet = true;
        ownershipFilterCount += 1;
      }
      if (
        stateNav.filterOwnershipTypeEducationalInstitutions &&
        stateNav.filterOwnershipTypeEducationalInstitutions.length > 0
      ) {
        filterArray.push(stateNav.filterOwnershipTypeEducationalInstitutions);
        isFilterSet = true;
      }
      if (
        stateNav.filterOwnershipTypeIndividuals &&
        stateNav.filterOwnershipTypeIndividuals.length > 0
      ) {
        filterArray.push(stateNav.filterOwnershipTypeIndividuals);
        isFilterSet = true;
        ownershipFilterCount += 1;
      }
      if (
        stateNav.filterOwnershipTypeUnknown &&
        stateNav.filterOwnershipTypeUnknown.length > 0
      ) {
        filterArray.push(stateNav.filterOwnershipTypeUnknown);
        isFilterSet = true;
        ownershipFilterCount += 1;
      }
      if (
        stateNav.filterInterestTypeRoyaltyInterest &&
        stateNav.filterInterestTypeRoyaltyInterest.length > 0
      ) {
        filterArray.push(stateNav.filterInterestTypeRoyaltyInterest);
        isFilterSet = true;
        ownershipFilterCount += 1;
      }
      if (
        stateNav.filterInterestTypeOverrideRoyalty &&
        stateNav.filterInterestTypeOverrideRoyalty.length > 0
      ) {
        filterArray.push(stateNav.filterInterestTypeOverrideRoyalty);
        isFilterSet = true;
        ownershipFilterCount += 1;
      }
      if (
        stateNav.filterInterestTypeWorkingInterest &&
        stateNav.filterInterestTypeWorkingInterest.length > 0
      ) {
        filterArray.push(stateNav.filterInterestTypeWorkingInterest);
        isFilterSet = true;
        ownershipFilterCount += 1;
      }
      if (
        stateNav.filterInterestTypeProductionPayment &&
        stateNav.filterInterestTypeProductionPayment.length > 0
      ) {
        filterArray.push(stateNav.filterInterestTypeProductionPayment);
        isFilterSet = true;
        ownershipFilterCount += 1;
      }

      if (stateNav.filterBasin && stateNav.filterBasin.length > 0) {
        filterArray.push(stateNav.filterBasin);
        isFilterSet = true;
        geographyFilterCount += 1;
      }

      if (stateNav.filterPlay && stateNav.filterPlay.length > 0) {
        filterArray.push(stateNav.filterPlay);
        isFilterSet = true;
        geographyFilterCount += 1;
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
  }, [
    map,
    setStateNav,
    stateNav.asbtractName,
    stateNav.countyName,
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
    stateNav.filterGeographyAbstract,
    stateNav.filterGeographyCounty,
    stateNav.filterGeographyState,
    stateNav.filterGeographySurvey,

    stateNav.filterInterestTypeOverrideRoyalty,
    stateNav.filterInterestTypeProductionPayment,
    stateNav.filterInterestTypeRoyaltyInterest,
    stateNav.filterInterestTypeWorkingInterest,

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
    stateNav.filterOwnershipTypeCorporations,
    stateNav.filterOwnershipTypeEducationalInstitutions,
    stateNav.filterOwnershipTypeGovernmentalBodies,
    stateNav.filterOwnershipTypeIndividuals,
    stateNav.filterOwnershipTypeNonProfits,
    stateNav.filterOwnershipTypeReligiousInstitutions,
    stateNav.filterOwnershipTypeTrusts,
    stateNav.filterOwnershipTypeUnknown,
    stateNav.filterPermitDateRange,
    stateNav.filterSpudDateRange,
    stateNav.filterWellProfile,
    stateNav.filterWellStatus,
    stateNav.filterWellType,

    stateNav.filterBasin,
    stateNav.filterPlay,

    stateNav.stateName,
    stateNav.surveyName
  ]);

  useEffect(() => {
    //sets style of map when changed in Map Controls
    if (stateMap.selectedLayerId && map) {
      if (stateMap.selectedLayerId) {
        map.setStyle(stateMap.selectedLayerId);
      }
    }
  }, [map, stateMap.selectedLayerId]);

  const createPopUp = currentFeature => {
    let coordinates = [currentFeature.longitude, currentFeature.latitude];
    let popUps = document.getElementsByClassName("mapboxgl-popup");

    if (popUps[0]) popUps[0].remove();

    let popup = new mapboxgl.Popup({ offset: 0, closeOnClick: false })
      .setLngLat(coordinates)
      .setHTML(`<div id="popupContainer"></div>`)
      .addTo(map);
    //show wellcard in popup Portal
    setStateApp(state => ({ ...state, popupOpen: true }));
    handleOpenExpandableCard();
  };



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
          pitch: mapStyles[index].pitch,
          bearing: mapStyles[index].bearing
        });
        let zoomControl = new mapboxgl.NavigationControl();
        newMap.addControl(zoomControl, "bottom-right");

        newMap.addControl(new mapboxgl.FullscreenControl(), "bottom-right");

        // Add geolocate control to the map.
        newMap.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true
          }),
          "bottom-right"
        );

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
        // console.log(mapStyles)
        // setStateMapControls({ ...stateMapControls, mapStyles: mapStyles });
        // console.log(stateMapControls.mapStyles)
        // console.log("====================")

        /* let Draw = new MapboxDraw();
  newMap.addControl(Draw, 'top-left'); */

        newMap.on("load", function(e) {
          setMap(newMap);
        });
      };

      if (!map) {
        initializeMap({ setMap, mapEl, setStateMap });
      } else {
        map.on("click", "wellpoints", function(e) {
          //console.log('click event', e)
          var bbox = [
            [e.point.x - 10, e.point.y - 10],
            [e.point.x + 10, e.point.y + 10]
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
          setStateApp(state => ({
            ...state,
            selectedWellId: currentFeature.properties.api
          }));

          createPopUp(currentFeature.properties);
        });

        map.on("mousemove", "wellpoints", e => {
          map.getCanvas().style.cursor = "pointer";

          // // Set variables equal to the current feature's magnitude, location, and time
          // var quakeMagnitude = e.features[0].properties.mag;
          // var quakeLocation = e.features[0].properties.place;
          // var quakeDate = new Date(e.features[0].properties.time);

          // // Check whether features exist
          // if (e.features.length > 0) {
          //   // Display the magnitude, location, and time in the sidebar
          //   magDisplay.textContent = quakeMagnitude;
          //   locDisplay.textContent = quakeLocation;
          //   dateDisplay.textContent = quakeDate;

          //   // If quakeID for the hovered feature is not null,
          //   // use removeFeatureState to reset to the default behavior
          //   if (quakeID) {
          //     map.removeFeatureState({
          //       source: "earthquakes",
          //       id: quakeID
          //     });
          //   }

          //   quakeID = e.features[0].id;

          //   // When the mouse moves over the earthquakes-viz layer, update the
          //   // feature state for the feature under the mouse
          //   map.setFeatureState({
          //     source: 'earthquakes',
          //     id: quakeID,
          //   }, {
          //     hover: true
          //   });

          //}
        });

        map.on("mouseleave", "wellpoints", function() {
          // if (quakeID) {
          //   map.setFeatureState({
          //     source: 'earthquakes',
          //     id: quakeID
          //   }, {
          //     hover: false
          //   });
          // }

          // quakeID = null;
          // // Remove the information from the previously hovered feature from the sidebar
          // magDisplay.textContent = '';
          // locDisplay.textContent = '';
          // dateDisplay.textContent = '';
          // // Reset the cursor style
          map.getCanvas().style.cursor = "";
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

        /* 
  //this extracts the data from the tileset and adds it to WellList.   
  //when map is loaded.  some functions can't work until map is loaded
  
   map.on('styledata', () => {
   //extracts features from tileset. this doesn't work well due to performance problems getting data out of the layer
   
    let features = map.queryRenderedFeatures({ layers: ['wellpoints'] });
     console.log('features',features.length)
    if (features.length > 0) {
    
     setStateNav(state => ({ ...state, uniqueWellFeatures:features }))
       
    }
  
  })  
  */
      }
    }
  }, [map, setStateMap, setStateMapControls, mapStyles]);

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
  }, [map, stateApp.flyTo]);

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
      <div className={classes.map} ref={mapEl} id="map">
        {/* <div className={classes.footerLeftLogo}>
          <img src="icons/favicon-32x32.png" alt="logo" width="25" />
          <p>m1neral</p>
        </div> */}
      </div>
      <MapControlsProvider />

      {stateMap.openTrack == true ? (
        <div className={classes.trackLists}>
          {<WellsProvider showList={true} parent="track" />}
        </div>
      ) : null}

      {stateApp.popupOpen ? (
        <div>
          <div
            id="tempPopupHolder"
            style={{ position: "absolute", top: "0px", left: "20px" }}
          ></div>
          <Portal id="popupContainer">
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
          </Portal>
        </div>
      ) : null}
    </div>
  );
}
