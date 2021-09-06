import { spatialDataAttributes } from "./constants";
import { area, convertArea, length } from "@turf/turf";
import polylabel from "polylabel";

export const addCustomShapeProperties = (feature, Draw) => {
  try {
    spatialDataAttributes.forEach(attribute => {
      let data = feature.properties[attribute] || "";
      switch (attribute) {
        case "shapeArea":
          data = calculateLandArea(feature);
          break;
        case "shapeCenter":
          data = calculateShapeCenter(feature.geometry.coordinates);
          break;
        default:
      }
      Draw.setFeatureProperty(feature.id, attribute, data);
    });
  } catch (e) {
    console.log(e);
  }
};

const calculateLandArea = feature => {
  if (feature.geometry.type === "Polygon") {
    const areaInSqMeters = area(feature);
    const areaInAcres = convertArea(areaInSqMeters, "meters", "acres");
    return `${Math.round(areaInAcres * 100) / 100}`;
  }
  if (feature.geometry.type === "LineString") {
    const distanceInMiles = length(feature, { units: "miles" });
    return `${Math.round(distanceInMiles * 100) / 100} miles`;
  }
};
const calculateShapeCenter = shapeCoordinates => {
  return polylabel(shapeCoordinates);
};

export const createShapeLabelLayer = feature => {
  // new mapboxgl.Marker(<div className='labelClass'></div>).setLngLat().addTo(map)\
  return {
    id: feature.id + "_label",
    type: "symbol",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: feature.geometry.coordinates[0][0]
            },
            properties: {
              id: feature.id
            }
          }
        ]
      }
    },
    layout: {
      "text-field": [
        "format",
        feature.properties.projectName || feature.geometry.type,
        { "text-color": "white" },
        "\n",
        feature.properties.shapeArea,
        { "text-color": "white" }
      ],
      // "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-offset": [1, 1],
      "text-anchor": "left",
      visibility: "none"
    }
  };
};

export const drawBoundary = (map, selectedUserDefinedLayer) => {
  // let mapSourceData = map.getSource(source)._data;
  // const idx = mapSourceData.features.findIndex(feature => feature.id === featureId)
  if (selectedUserDefinedLayer?.geometry) {
    const type = selectedUserDefinedLayer.geometry.type
    const geoJson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: type === 'Point' ? 'Point' : "LineString",
        coordinates: type === 'Point' ? selectedUserDefinedLayer.geometry.coordinates : selectedUserDefinedLayer.geometry.coordinates[0],
      },
    };

    if (map.getSource('boundary-line-source')) {
      map.getSource('boundary-line-source').setData(geoJson);
      if (map.getLayer('boundary-line')) {
        map.removeLayer('boundary-line')
      }
    } else {
      map.addSource("boundary-line-source", {
        type: "geojson",
        data: geoJson
      });
    }

    if (map.getSource('boundary-point-source')) {
      map.getSource('boundary-point-source').setData(geoJson);
      if (map.getLayer('boundary-point')) {
        map.removeLayer('boundary-point')
      }
    } else {
      map.addSource("boundary-point-source", {
        type: "geojson",
        data: geoJson
      });
    }

    if (type === 'Point') {
      map.addLayer({
        id: "boundary-point",
        type: "circle",
        source: "boundary-point-source",
        paint: {
          "circle-radius": 5,
          "circle-color": "yellow",
        },
      });
    } else {
      map.addLayer({
        id: "boundary-line",
        type: "line",
        source: "boundary-line-source",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#FFFF00",
          "line-width": 8,
        },
      });
    }

  } else {
    if (map.getLayer('boundary-line')) {
      map.removeLayer('boundary-line')
    }
    if (map.getLayer('boundary-point')) {
      map.removeLayer('boundary-point')
    }
  }
}
