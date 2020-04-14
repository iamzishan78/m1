import React, { useContext, useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import mapboxgl from "mapbox-gl";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles(theme => ({
  MSWrapper: {
    width: "100%",
    height: "356px !important",
    overflow: "hidden !important"
  },
  map: {
    width: "100%",
    height: "100%",
    overflow: "hidden !important",
    "& canvas": {
      height: "100% !important"
    },
    "& .mapboxgl-canvas-container": {
      width: "100% !important",
      height: "100% !important"
    },
    "& a.mapboxgl-ctrl-logo, .mapboxgl-ctrl.mapboxgl-ctrl-attrib":{
      display:"none"},
    // "& a.mapboxgl-ctrl-logo, .mapboxgl-ctrl.mapboxgl-ctrl-attrib": {
    //   display: "none"
    // }
  },
  footerLeftLogo: {
    position: "absolute",
    bottom: "5px",
    zIndex: "1",
    left: "10px",
    // textShadow: "1px 0 0 black, -1px 0 0 black, 0 1px 0 black, 0 -1px 0 black",
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
    // },
    // "& p": {
    //   position: "absolute",
    //   left: "23px"
    // }
  }
}));

export default function CardDetailsMap() {
  const [stateApp] = useContext(AppContext);
  const [map, setMap] = useState(null);
  const [mapStyles, setMapStyles] = useState([]);
  const mapEl = useRef(null);



  
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
        
        /// optimized interactions w/ map
        newMap.scrollZoom.enable()
        newMap.dragPan.enable();
        newMap.dragRotate.enable();
        newMap.keyboard.enable();
        newMap.doubleClickZoom.disable();

        newMap.addControl(
          new mapboxgl.ScaleControl({
            maxWidth: 80,
            unit: 'imperial'
          }),"bottom-right");
      
      

          var el = document.createElement("div");
          el.style.backgroundImage = "url(icons/favicon-inverted.png)";
          el.style.width = "28px";
          el.style.height = "64px";
  
          new mapboxgl.Marker(el)
            .setLngLat([
              stateApp.selectedWell.longitude,
              stateApp.selectedWell.latitude
            ])
            .addTo(newMap);
  
          newMap.fitBounds([
            [
              stateApp.selectedWell.longitude - 0.005,
              stateApp.selectedWell.latitude - 0.005
            ],
            [
              stateApp.selectedWell.longitude + 0.005,
              stateApp.selectedWell.latitude + 0.005
            ]
          ]);
            



        newMap.on("load", function(e) {
          setMap(newMap);
        });





      };

      if (!map) {
        initializeMap({ setMap, mapEl });
      } else {


      //map.setLayoutProperty('wellpoints', 'visibility', 'visible');
      //map.setLayoutProperty('welllines', 'visibility', 'visible');


      // additional map interactions 
      // for some reason these do not work when initializing but do here 
      map.boxZoom.enable()
      map.touchZoomRotate.enable();



      }
    }
  }, [map, mapStyles]);





  let classes = useStyles();

  return (
    <div className={classes.MSWrapper}>
      <div className={classes.map} ref={mapEl} id="cardDetailsMap">
      <div className={classes.footerLeftLogo}>
          <img src="icons/M1LogoWhiteTransparent.png" alt="logo" width="75" />
        </div> 
      </div>
    </div>
  );
}
