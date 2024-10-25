import { spatialDataAttributes } from "./constants";
import { area, convertArea, length } from "@turf/turf";
import * as turf from "@turf/turf";
import { SRCenter } from 'mapbox-gl-draw-scale-rotate-mode';
import { drawController } from "hookstate/drawStateController";
import DeckGlLayer from "components/Map/DeckGL/helpers/DeckGlLayer";

export const calculateShapeCenter = (geo) => {
  const center = turf.center(geo);
  return center.geometry.coordinates;
}

export const addCustomShapeProperties = (feature, Draw) => {
  try {
    spatialDataAttributes.forEach(attribute => {
      let data = feature.properties[attribute] || "";
      switch (attribute) {
        case "shapeArea":
          data = calculateLandArea(feature);
          break;
        case "shapeCenter":
          data = calculateShapeCenter(feature.geometry);
          break;
        default:
      }
      Draw?.setFeatureProperty(feature.id, attribute, data);
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

export const drawWellBoundary = coordinates => {
  if (!window.mapRef) return;

  const layerId = 'boundary-layer';

  if (window.mapRef.getLayer(layerId)) window.mapRef.removeLayer(layerId);

  if (coordinates && coordinates.length > 0 && coordinates[0]) {
    new DeckGlLayer({
      layerId,
      type: 'GeoJsonLayer',
      beforeLayer: 'top_deck_layer',
      props: {
        data: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: coordinates,
            },
          },
        ],
        getFillColor: [255, 255, 0],
        getLineColor: [255, 255, 0],
        pointRadiusMinPixels: 2.5,
        lineWidthMinPixels: 1.5,
        pointRadiusMaxPixels: 10,
        lineWidthMaxPixels: 8,
        getPointRadius: 50,
        getLineWidth: 20,
      },
    });
  }
};

export const drawPlaceBoundary = coordinates => { // Add separate fn for draw place highlight with larger dot
  if (!window.mapRef) return;

  const layerId = 'boundary-layer';

  if (window.mapRef.getLayer(layerId)) window.mapRef.removeLayer(layerId);

  if (coordinates && coordinates.length > 0 && coordinates[0]) {
    new DeckGlLayer({
      layerId,
      type: 'GeoJsonLayer',
      beforeLayer: 'top_deck_layer',
      props: {
        data: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: coordinates,
            },
          },
        ],
        getFillColor: [255, 255, 0],
        getLineColor: [255, 255, 0],
        pointRadiusMinPixels: 8, // Minimum pixel size for points
        pointRadiusMaxPixels: 8, // Maximum pixel size for points
        lineWidthMinPixels: 5,
        lineWidthMaxPixels: 5,
        getPointRadius: 8,
        getLineWidth: 5,
        parameters: {
          depthTest: false, // Disable depth testing to draw points on top
        },
      },
    });
  }
};

export const drawBoundary = (selectedUserDefinedLayer, layer_Id) => {
  if (!window.mapRef) return;

  const layerId = layer_Id || 'boundary-layer';

  if (window.mapRef.getLayer(layerId)) window.mapRef.removeLayer(layerId);

  if (selectedUserDefinedLayer?.geometry) {
    const type = selectedUserDefinedLayer.geometry.type;
    new DeckGlLayer({
      layerId,
      type: 'GeoJsonLayer',
      beforeLayer: 'top_deck_layer',
      props: {
        data: [
          {
            type: 'Feature',
            geometry: selectedUserDefinedLayer.geometry,
          },
        ],
        lineWidthUnits: "pixels",
        getFillColor: [0, 0, 0, 0],
        getLineColor: [255, 255, 0],
        getLineWidth: 6,
        ...(type === 'Point' && {
          lineWidthUnits: "meters",
          getLineWidth: 100,
          getFillColor: [255, 255, 0],
          getPointRadius: 50,
        }),
      },
    });
  }
};

// Function to draw boundaries for multiple shapes
export const drawBoundaries = (shapes) => {
  if (!window.mapRef || !Array.isArray(shapes) || shapes.length === 0) return; // Ensure mapRef exists and shapes is a valid array

  shapes.forEach((shape, index) => {
    const uniqueLayerId = `boundary-layer-${index}`; // Generate a unique layer ID for each shape
    drawBoundary(shape, uniqueLayerId); // Draw boundary for each shape with a unique layerId
  });
};

export const clearSelectedAbstracts = () => {
  if (window.mapRef?.getLayer("Land Grid_selection"))
    window.mapRef.removeLayer("Land Grid_selection");
  drawController.updateState({
    selectedAbstracts: [],
  });
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
      try {
        newShape = turf.union(quarterPolygons[selectedQuarter], newShape);
      } catch (e) {
        console.log(e)
      }
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

  draw?.add(multi)

  setTimeout(() => {
    changeModeToScaleRotate(draw)
  }, 1000)
}


export const changeModeToScaleRotate = (draw) => {
  if (!draw) return;
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
