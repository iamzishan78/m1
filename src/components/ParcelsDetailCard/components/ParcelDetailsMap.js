import React, { useContext, useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import mapboxgl from "mapbox-gl";
import uid from "uid";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles((theme) => ({
  MSWrapper: {
    width: "100%",
    minHeight: "454px !important",
    overflow: "hidden !important",
    padding: "10px",
  },
  map: {
    width: "100%",
    height: "454px !important",
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

export default function ParcelDetailsMap(props) {
  const [stateApp] = useContext(AppContext);
  const [map, setMap] = useState(null);
  const [mapStyles, setMapStyles] = useState([]);
  const mapEl = useRef(null);
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
    return -1; //to handle the case where the value doesn"t exist
  }

  useEffect(() => {
    if (mapStyles.length > 0) {
      const SET_INITIAL_MAP_STYLE = "Outdoors";
      var index = getIndex(SET_INITIAL_MAP_STYLE, mapStyles, "name");

      const initializeMap = ({ setMap, mapEl, setStateApp }) => {
        let id = mapEl.current.id;

        const newMap = new mapboxgl.Map({
          container: `${id}`,
          style: "mapbox://styles/m1neral/" + mapStyles[index].id,
          center: props.parcelData.shape.properties.shapeCenter,
          zoom: 5,
        });

        newMap.on("load", function (e) {
          newMap.addSource("parcel_detail", {
            "type": "geojson",
            "data": props.parcelData.shape
          });
          newMap.addLayer({
            "id": "parcel_detail",
            "type": "fill",
            "source": "parcel_detail",
            "paint": {
              "fill-color": "#e07c71",
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.7,
                0.4,
              ],
              "fill-outline-color": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                "#fc5b49",
                "#e07c71",
              ],
            }
          });
          newMap.addLayer({
            id: "parcel_detail_label",
            type: "symbol",
            source: "parcel_detail",
            layout: {
              "text-field": "{shapeLabel}",
              "text-anchor": "center",
            },
            paint: {
              "text-color": "#888",
            },
          });
          const coordinates = props.parcelData.shape.geometry.coordinates[0];
          const bounds = coordinates.reduce(function (bounds, coord) {
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
          newMap.fitBounds(bounds, {
            padding: 50
          });
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
      }
    }
  }, [map, mapStyles]);

  let classes = useStyles();

  return (
    <div className={classes.MSWrapper}>
      <div className={classes.map} ref={mapEl} id={`parcelDetailsMap${uid()}`}>
        <div className={classes.footerLeftLogo}>
          <img src="icons/M1LogoWhiteTransparent.png" alt="logo" width="75" />
        </div>
      </div>
    </div>
  );
}
