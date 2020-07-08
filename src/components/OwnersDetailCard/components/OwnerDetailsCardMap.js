import React, { useContext, useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import mapboxgl from "mapbox-gl";
import { AppContext } from "../../../AppContext";
import uid from "uid";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";
import { useLazyQuery } from "@apollo/react-hooks";

const useStyles = makeStyles(() => ({
  MSWrapper: {
    width: "100%",
    height: "300px !important",
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

export default function OwnerDetailsCardMap(props) {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [map, setMap] = useState(null);
  const [mapStyles, setMapStyles] = useState([]);
  const mapEl = useRef(null);
  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);
  mapboxgl.accessToken = stateApp.mapboxglAccessToken;

  useEffect(() => {
    if (props.wellsIdsArray) {
      getWells({
        variables: {
          wellIdArray: props.wellsIdsArray,
          authToken: stateApp.user.authToken,
        },
      });
    }
  }, [props.wellsIdsArray]);

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
    if (mapStyles.length > 0) {
      const SET_INITIAL_MAP_STYLE = "Satellite";
      var index = getIndex(SET_INITIAL_MAP_STYLE, mapStyles, "name");

      const initializeMap = ({ setMap, mapEl }) => {
        let id = mapEl.current.id;

        const newMap = new mapboxgl.Map({
          container: `${id}`,
          style: "mapbox://styles/m1neral/" + mapStyles[index].id,
          center: [-98.8, 31.6],
          zoom: 5,
          // pitch: 70,
          // bearing: 20,
        });

        // var el = document.createElement("div");
        // el.style.backgroundImage = "url(icons/favicon-inverted.png)";
        // el.style.width = "28px";
        // el.style.height = "64px";

        // new mapboxgl.Marker(el).setLngLat([-98.8, 31.6]).addTo(newMap);

        // newMap.on("load", function (e) {
        //   newMap.flyTo({
        //     center: [-98.8, 31.6],
        //     zoom: 16,
        //     speed: 0.4,
        //     bearing: 0,
        //   });
        // });

        // newMap.on("moveend", function (e) {
        //   newMap.rotateTo(540, { duration: 100000 });
        // });
        newMap.on("load", function (e) {
          setMap(newMap);
        });
      };

      if (!map) {
        initializeMap({ setMap, mapEl });
      } else {
      }
    }
  }, [map, mapStyles]);

  useEffect(() => {
    if (
      map &&
      dataWells &&
      dataWells.wells &&
      dataWells.wells.results &&
      dataWells.wells.results.length > 0
    ) {
      let layerData = dataWells.wells.results;
      const makeGeoJSON = (data) => {
        return {
          type: "FeatureCollection",
          features: data.map((feature) => {
            return {
              type: "Feature",
              properties: feature,
              geometry: {
                type: "Point",
                coordinates: [feature.longitude, feature.latitude],
              },
            };
          }),
        };
      };

      const myGeoJSONData = makeGeoJSON(layerData);

      // -> add source
      map.addSource("wells", {
        type: "geojson",
        data: myGeoJSONData,
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 6,
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "wells",
        paint: {
          "circle-radius": 5,
          "circle-color": "#11b4da",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "wells",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": {
            property: "point_count",
            type: "interval",
            stops: [
              [0, "#11b4da"],
              [100, "#11b4da"],
              [750, "#11b4da"],
            ],
          },

          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            5,
            25,
            10,
            30,
            20,
            35,
          ],

          "circle-stroke-width": 5,
          "circle-stroke-color": "#fff",
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "wells",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count}",
          "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      // inspect a cluster on click
      map.on("click", "clusters", function (e) {
        // var bbox = [
        //   [e.point.x - 10, e.point.y - 10],
        //   [e.point.x + 10, e.point.y + 10],
        // ];
        // let features = map.queryRenderedFeatures(bbox, {
        //   layers: ["clusters"],
        // });
        // map.flyTo({
        //   center: [
        //     features[0].properties.longitude,
        //     features[0].properties.latitude,
        //   ],
        //   zoom: 12,
        //   speed: 0.5,
        // });
      });

      map.on("mouseenter", "clusters", function () {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", function () {
        map.getCanvas().style.cursor = "";
      });
      map.on("mouseenter", "unclustered-point", function () {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "unclustered-point", function () {
        map.getCanvas().style.cursor = "";
      });

      var bbox = [
        [
          Math.min(...layerData.map((data) => data.longitude)),
          Math.min(...layerData.map((data) => data.latitude)),
        ],
        [
          Math.max(...layerData.map((data) => data.longitude)),
          Math.max(...layerData.map((data) => data.latitude)),
        ],
      ];

      map.fitBounds(bbox, {
        padding: 30,
        maxZoom: 15,
      });
    }
  }, [map, dataWells]);

  let classes = useStyles();

  return (
    <div className={classes.MSWrapper}>
      <div
        className={classes.map}
        ref={mapEl}
        id={`ownerDetailsCardMap${uid()}`}
      >
        <div className={classes.footerLeftLogo}>
          <img src="icons/M1LogoWhiteTransparent.png" alt="logo" width="75" />
        </div>
      </div>
    </div>
  );
}
