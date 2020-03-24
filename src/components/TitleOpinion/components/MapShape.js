import React, { useContext, useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import mapboxgl from "mapbox-gl";
import { TitleOpinionContext } from "../TitleOpinionContext";

const useStyles = makeStyles(theme => ({
  MSWrapper: {
    width: "100%",
    height: "100% !important",
    overflow: "hidden !important"
  },
  map: {
    width: "100%",
    height: "100%",
    overflow: "hidden !important",
    "& a.mapboxgl-ctrl-logo, .mapboxgl-ctrl.mapboxgl-ctrl-attrib": {
      display: "none"
    }
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

export default function MapShape() {
  const [stateTitleOpinion] = useContext(TitleOpinionContext);

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
        center: [-99.90181, 31.968599],
        zoom: 6
      });

      newMap.on("load", function() {
        // Add a source for the polygons.
        newMap.addSource("TOshape", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [stateTitleOpinion.TOData.feature]
          }
        });

        // Add a layer showing the polygons.
        newMap.addLayer({
          id: "TOshape-layer",
          type: "fill",
          source: "TOshape",
          paint: {
            "fill-color": "rgba(65, 174, 196, 0.4)",
            "fill-outline-color": "rgba(65, 174, 196, 1)"
          }
        });
      });

      //Fit a map to the shape bounds
      const boundsShape = () => {
        let coordinates =
          stateTitleOpinion.TOData.feature &&
          stateTitleOpinion.TOData.feature.geometry
            ? stateTitleOpinion.TOData.feature.geometry.coordinates[0]
            : [
                [-105.90181, 25.968599],
                [-91.90181, 36.968599]
              ];
        let bounds = {
          latMin: coordinates[0][0],
          latMax: coordinates[0][0],
          lonMin: coordinates[0][1],
          lonMax: coordinates[0][1]
        };

        for (let i = 1; i < coordinates.length; i++) {
          if (coordinates[i][0] < bounds.latMin) {
            bounds.latMin = coordinates[i][0];
          }
          if (coordinates[i][0] > bounds.latMax) {
            bounds.latMax = coordinates[i][0];
          }
          if (coordinates[i][1] < bounds.lonMin) {
            bounds.lonMin = coordinates[i][1];
          }
          if (coordinates[i][1] > bounds.lonMax) {
            bounds.lonMax = coordinates[i][1];
          }
        }

        return bounds;
      };
      const coord = boundsShape();
      newMap.fitBounds([
        [coord.latMin - 0.001, coord.lonMin - 0.001],
        [coord.latMax + 0.001, coord.lonMax + 0.001]
      ]);
    };

    if (!map) {
      initializeMap({ setMap, mapEl });
    }
  }, []);

  let classes = useStyles();

  return (
    <div className={classes.MSWrapper}>
      <div className={classes.map} ref={mapEl} id="TOmap">
        <div className={classes.footerLeftLogo}>
          <img src="icons/favicon-32x32.png" alt="logo" width="25" />
          <p>m1neral</p>
        </div>
      </div>
    </div>
  );
}
