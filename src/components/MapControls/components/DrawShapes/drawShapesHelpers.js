import { spatialDataAttributes } from "./constants";
import { area, convertArea, length } from "@turf/turf";
import polylabel from "polylabel";

export const addCustomShapeProperties = (feature, Draw) => {
  spatialDataAttributes.forEach(attribute => {
    let data = "";
    switch (attribute) {
      case "shapeArea":
        data = calculateLandArea(feature);
        break;
      case "shapeCenter":
        data = calculateShapeCenter(feature.geometry.coordinates);
        break;
    }
    Draw.setFeatureProperty(feature.id, attribute, data);
  });
};

const calculateLandArea = feature => {
  if (feature.geometry.type === "Polygon") {
    const areaInSqMeters = area(feature);
    const areaInAcres = convertArea(areaInSqMeters, "meters", "acres");
    return `${Math.round(areaInAcres * 100) / 100} acres`;
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
