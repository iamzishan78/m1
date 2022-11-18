import { spatialDataAttributes } from "./constants";
import { area, convertArea, length } from "@turf/turf";
import polylabel from "polylabel";
import * as turf from "@turf/turf";
import { SRCenter } from 'mapbox-gl-draw-scale-rotate-mode';

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
  if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
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
export const drawWellBoundary = (map, coordinates) => {
  if (map.getLayer("well-point")) map.removeLayer("well-point");
  if (map?.getSource("well-select-point")) map.removeSource("well-select-point");
  if (coordinates.length > 0) {
    map.addSource("well-select-point", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: coordinates,
            },
          },
        ],
      },
    });
    map.addLayer({
      id: "well-point",
      type: "circle",
      source: "well-select-point",
      paint: {
        "circle-radius": 5,
        "circle-color": "yellow",
      },
    });
  }
}


export const drawBoundary = (map, selectedUserDefinedLayer) => {
  // let mapSourceData = map.getSource(source)._data;
  // const idx = mapSourceData.features.findIndex(feature => feature.id === featureId)

  if (selectedUserDefinedLayer?.geometry) {
    const type = selectedUserDefinedLayer.geometry.type
    const geoJson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: type,
        coordinates: selectedUserDefinedLayer.geometry.coordinates
      },
    };

    if (map?.getLayer("parcelBoundary")) {
      map.removeLayer("parcelBoundary");
    }

    if (map?.getSource('boundary-line-source')) {
      map.getSource('boundary-line-source').setData(geoJson);
      if (map.getLayer('boundary-line')) {
        map.removeLayer('boundary-line')
      }
    } else {
      map?.addSource("boundary-line-source", {
        type: "geojson",
        data: geoJson
      });
    }

    if (map?.getSource('boundary-point-source')) {
      map?.getSource('boundary-point-source').setData(geoJson);
      if (map?.getLayer('boundary-point')) {
        map.removeLayer('boundary-point')
      }
    } else {
      map?.addSource("boundary-point-source", {
        type: "geojson",
        data: geoJson
      });
    }

    if (type === 'Point') {
      map?.addLayer({
        id: "boundary-point",
        type: "circle",
        source: "boundary-point-source",
        paint: {
          "circle-radius": 5,
          "circle-color": "yellow",
        },
      });
    } else {
      map?.addLayer({
        id: "boundary-line",
        type: "line",
        source: "boundary-line-source",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#FFFF00",
          "line-width": 6,
        },
      });
    }

  } else {
    if (map?.getLayer('boundary-line')) {
      map.removeLayer('boundary-line')
    }
    if (map?.getLayer('boundary-point')) {
      map.removeLayer('boundary-point')
    }
  }
}


export const getNewShapeFromSelectedQuarters = (currentFeature, selectedQuarters) => {
  const quarters = ["SWSW", "NWSW", "SWNW", "NWNW", "SESW", "NESW", "SENW", "NENW", "SWSE", "NWSE", "SWNE", "NWNE", "SESE", "NESE", "SENE", "NENE"]
  const quarterPolygons = {}
  let quaterIndex = 0
  var bbox = turf.bbox(currentFeature);
  let minX = bbox[0];
  let maxX = bbox[2];

  let minY = bbox[1];
  let maxY = bbox[3];

  const incrementX = ((maxX - minX) / 4);

  const incrementY = ((maxY - minY) / 4);
  for (let i = 0; i < 4; i++) {
    bbox[2] = bbox[0] + incrementX
    for (let j = 0; j < 4; j++) {
      bbox[3] = bbox[1] + incrementY

      let m = turf.bboxClip(currentFeature, bbox);
      quarterPolygons[quarters[quaterIndex++]] = m

      bbox[1] = bbox[3]
    }
    bbox[0] = bbox[2]

    bbox[1] = minY
    bbox[3] = maxY
  }

  let newShape = {}
  selectedQuarters.forEach((selectedQuarter, index) => {
    if (index === 0) {
      newShape = quarterPolygons[selectedQuarter]
    } else {
      newShape = turf.union(quarterPolygons[selectedQuarter], newShape);
    }
  });

  newShape.id = currentFeature.id
  newShape.properties.id = currentFeature.id;

  return newShape
}

export const getDrawAdustedShape = (multiPolygon, selectedQuarters) => {
  const quarters = ["NWNW", "NWSW", "SWNW", "SWSW", "SESW", "NESW", "SENW", "NENW", "SWSE", "NWSE", "SWNE", "NWNE", "SESE", "NESE", "SENE", "NENE"];

  let newShape = {
    geometry: { type: "Polygon", coordinates: [] },
    properties: {},
    type: "Feature"
  }

  selectedQuarters.forEach((quarter) => {
    const index = quarters.findIndex(q => q === quarter)
    if (newShape.geometry.coordinates.length === 0) {
      newShape.geometry.coordinates = multiPolygon.geometry.coordinates[index];
    } else {
      newShape = turf.union(newShape, { ...newShape, geometry: { type: "Polygon", coordinates: multiPolygon.geometry.coordinates[index] } });
    }
  });

  newShape.id = multiPolygon.id
  newShape.properties.id = multiPolygon.id;
  return newShape
}

export const getRotateAbleShapeFromSelectedQuarters = (currentFeature, draw) => {
  let bbox = turf.bbox(currentFeature);
  currentFeature = turf.bboxPolygon(bbox);
  bbox = turf.bbox(currentFeature);
  let minX = bbox[0];
  let maxX = bbox[2];

  let minY = bbox[1];
  let maxY = bbox[3];

  const incrementX = ((maxX - minX) / 4);
  let polygons = []

  let m

  const incrementY = ((maxY - minY) / 4);
  for (let i = 0; i < 4; i++) {
    bbox[2] = bbox[0] + incrementX
    for (let j = 0; j < 4; j++) {
      bbox[3] = bbox[1] + incrementY

      m = turf.bboxClip(currentFeature, bbox);
      polygons.push(m)
      bbox[1] = bbox[3]
    }
    bbox[0] = bbox[2]

    bbox[1] = minY
    bbox[3] = maxY
  }

  const multi = {
    geometry: { type: "MultiPolygon", coordinates: [] },
    properties: { isrotate: 1 },
    type: "Feature"
  }

  let temp = polygons[3]
  polygons[3] = polygons[0]
  polygons[0] = temp

  polygons.forEach((polygon) => {
    multi.geometry.coordinates.push(polygon.geometry.coordinates)
  })

  draw.add(multi)

  setTimeout(() => {
    changeModeToScaleRotate(draw)
  }, 1000)
}


export const changeModeToScaleRotate = (draw) => {
  const all = draw.getAll()
  const feature = all.features.find((f) => f.properties.isrotate)
  if (feature) {
    // draw.changeMode("direct_select", { featureId: feature.id, });
    draw.changeMode('tx_poly', {
      // required
      featureId: feature.id,
      canScale: true,
      canRotate: true, // only rotation enabled
      canTrash: false, // disable feature delete

      rotatePivot: SRCenter.Center, // rotate around center
      scaleCenter: SRCenter.Opposite, // scale around opposite vertex

      singleRotationPoint: true, // only one rotation point
      rotationPointRadius: 1.1, // offset rotation point

      canSelectFeatures: true,
    });
  }
}
