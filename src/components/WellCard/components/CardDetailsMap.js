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
    }
  }
}));

export default function CardDetailsMap() {
  const [stateApp] = useContext(AppContext);
  const [map, setMap] = useState(null);

  const mapEl = useRef(null);
  mapboxgl.accessToken =
    "pk.eyJ1IjoibTFuZXJhbCIsImEiOiJjanYycGJxbG8yN3JsM3lsYTdnMXZoeHh1In0.tTNECYKDPtcrzivWTiZcIQ";

  useEffect(() => {
    const initializeMap = ({ setMap, mapEl }) => {
      let id = mapEl.current.id;

      const newMap = new mapboxgl.Map({
        container: `${id}`,
        style: "mapbox://styles/m1neral/ck6pe50n80bfs1imr05f0hr82",
        center: [
          stateApp.selectedWell.longitude,
          stateApp.selectedWell.latitude
        ],
        zoom: 4
      });

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
    };

    if (!map) {
      initializeMap({ setMap, mapEl });
    }
  }, []);

  let classes = useStyles();

  return (
    <div className={classes.MSWrapper}>
      <div className={classes.map} ref={mapEl} id="cardDetailsMap"></div>
    </div>
  );
}
