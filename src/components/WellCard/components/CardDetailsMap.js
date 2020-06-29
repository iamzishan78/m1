import React, { useContext, useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import mapboxgl from "mapbox-gl";
import { AppContext } from "../../../AppContext";
import uid from "uid";

const useStyles = makeStyles((theme) => ({
  MSWrapper: {
    width: "100%",
    minHeight: "419.556px !important",
    overflow: "hidden !important",
  },
  map: {
    width: "100%",
    height: "100%",
    overflow: "hidden !important",
    "& canvas": {
      height: "100% !important",
    },
    "& .mapboxgl-canvas-container": {
      width: "100% !important",
      height: "100% !important",
    },
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
}));

export default function CardDetailsMap() {
  const [stateApp] = useContext(AppContext);
  const [map, setMap] = useState(null);
  const [mapStyles, setMapStyles] = useState([]);
  const mapEl = useRef(null);
  const [flyVar1, setFlyVar1] = useState([null]);
  mapboxgl.accessToken = stateApp.mapboxglAccessToken;

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
    if (flyVar1 && flyVar1 === true) {
      map.flyTo({
        center: [
          stateApp.selectedWell.longitude,
          stateApp.selectedWell.latitude,
        ],
        zoom: 16,
        speed: 0.4,
        bearing: -10,
        //duration: 10000,
        easing: function (t) {
          return Math.sin((t * Math.PI) / 2);
        },
      });

      setFlyVar1(false);

      map.on("moveend", function (e) {
        if (
          map.getBearing() === -10 &&
          map.getZoom() === 16
          // && map.getCenter()===[
          //                       stateApp.selectedWell.longitude,
          //                       stateApp.selectedWell.latitude,
          //                     ]
        ) {
          map.flyTo({
            center: [
              stateApp.selectedWell.longitude,
              stateApp.selectedWell.latitude,
            ],
            zoom: 16,
            //speed: 0.4,
            bearing: 540,
            duration: 100000,
            easing: function (t) {
              return Math.sin((t * Math.PI) / 2);
            },
          });
        }
      });
    }
  }, [flyVar1]);

  useEffect(() => {
    if (mapStyles.length > 0) {
      const SET_INITIAL_MAP_STYLE = "Satellite";
      var index = getIndex(SET_INITIAL_MAP_STYLE, mapStyles, "name");

      const initializeMap = ({ setMap, mapEl, setStateApp }) => {
        let id = mapEl.current.id;

        const newMap = new mapboxgl.Map({
          container: `${id}`,
          style: "mapbox://styles/m1neral/" + mapStyles[index].id,
          center: [
            stateApp.selectedWell.longitude,
            stateApp.selectedWell.latitude,
          ],
          zoom: 5,
          pitch: 70,
          bearing: 20,
        });

        var el = document.createElement("div");
        el.style.backgroundImage = "url(icons/favicon-inverted.png)";
        el.style.width = "28px";
        el.style.height = "64px";

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

        new mapboxgl.Marker(el)
          .setLngLat([
            stateApp.selectedWell.longitude,
            stateApp.selectedWell.latitude,
          ])
          .addTo(newMap);

        newMap.on("load", function (e) {
          setMap(newMap);
        });
      };

      if (!map) {
        initializeMap({ setMap, mapEl });
      } else {
        map.setLayoutProperty("wellpoints", "visibility", "visible");
        map.setLayoutProperty("welllines", "visibility", "visible");

        map.on("moveend", ({ originalEvent }) => {
          if (originalEvent) {
            map.fire("usermoveend");
          } else {
            map.fire("flyend");
          }
        });

        setFlyVar1(true);

        // map.flyTo({
        //     center: [
        //       stateApp.selectedWell.longitude,
        //       stateApp.selectedWell.latitude,
        //     ],
        //     // zoom: 16,
        //     // speed: 0.4,
        //     bearing: 540,
        //     duration: 10000,
        //   });

        // map.on("click", function (e) {
        //   map.rotateTo.disable()
        // });

        //   map.on("flyend", function (e) {
        //     // map.flyTo({
        //     //   center: [
        //     //     stateApp.selectedWell.longitude,
        //     //     stateApp.selectedWell.latitude,
        //     //   ],
        //     //   //zoom: 16,
        //     //   //speed: 0.0001,
        //     //   bearing: 180,
        //     //   screenSpeed: 0.001,
        //     // });
        //     map.flyTo({
        //       // center: [
        //       //   stateApp.selectedWell.longitude,
        //       //   stateApp.selectedWell.latitude,
        //       // ],
        //       // //zoom: 16,
        //       // //speed: 0.0001,
        //       bearing: 540,
        //       //duration: 10000,
        //       //essential: false,
        //       // screenSpeed: 0.001,
        //     });
        // });
      }
    }
  }, [map, mapStyles]);

  let classes = useStyles();

  return (
    <div className={classes.MSWrapper}>
      <div className={classes.map} ref={mapEl} id={`cardDetailsMap${uid()}`}>
        <div className={classes.footerLeftLogo}>
          <img src="icons/M1LogoWhiteTransparent.png" alt="logo" width="75" />
        </div>
      </div>
    </div>
  );
}
