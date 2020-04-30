import React, { useState, createContext } from "react";

const styleLayers = [
  {
    name: "Wells",
    id: ["wellpoints", "welllines"],
    idx: 0,
  },
  {
    name: "Basins",
    id: ["basinLayer"],
    idx: 2,
  },
  {
    name: "Pipelines",
    id: ["pipelineLayer"],
    idx: 3,
  },
  {
    name: "Land Grid",
    id: ["surveylabels", "surveyLayer"],
    idx: 4,
  },
  {
    name: "Permits",
    id: [],
    idx: 5,
  },
];


const userDefinedLayers = [
  {
    name: "Parcels",
    id: [],
    idx: 0,
  },
  {
    name: "Title",
    id: [],
    idx: 1,
  },
  {
    name: "Area of Interest",
    id: [],
    idx: 2,
  },
];

const heatLayers = [
  {
    name: "Cumulative BOE",
    id: ["wellsHeatmapBoe"],
    idx: 5,
  },
  {
    name: "Last 12mo BOE",
    id: ["wellsHeatmapLast12"],
    idx: 6,
  },
  {
    name: "IP90 Oil",
    id: ["wellsHeatmapIP90Oil"],
    idx: 7,
  },
  {
    name: "IP90 Gas",
    id: ["wellsHeatmapIP90Gas"],
    idx: 8,
  },
  {
    name: "Recently Drilled",
    id: ["wellsHeatmapRecentlyDrilled"],
    idx: 9,
  },
  {
    name: "Recently Completed",
    id: ["wellsHeatmapRecentlyCompleted"],
    idx: 10,
  },
];

const baseMapLayers = [
  {
    name: "Map Labels",
    id: [
      "country-label",
      "state-label",
      "settlement-major-label",
      "settlement-minor-label",
      "settlement-subdivision-label",
      "airport-label",
      "transit-label",
      "poi-label",
    ],
    //idx: 1,
  },

  {
    name: "Roads",
    id: [
      "ferry-aerialway-label",
      "road-exit-shield",
      "road-number-shield",
      "road-label",
      "aerialway",
      "bridge-oneway-arrow-white",
      "bridge-motorway-trunk-2",
      "bridge-major-link-2",
      "bridge-motorway-trunk-2-case",
      "bridge-major-link-2-case",
      "bridge-pedestrian",
      "bridge-steps",
      "bridge-path",
      "road-pedestrian",
      "road-steps",
      "road-path",
      "tunnel-pedestrian",
      "tunnel-steps",
      "tunnel-path",
      "bridge-motorway-trunk",
      "bridge-oneway-arrow-blue",
      "bridge-primary-secondary-tertiary",
      "bridge-street-minor",
      "bridge-major-link",
      "bridge-motorway-trunk-case",
      "bridge-major-link-case",
      "bridge-primary-secondary-tertiary-case",
      "bridge-street-minor-case",
      "bridge-street-minor-low",
      "road-oneway-arrow-white",
      "road-motorway-trunk",
      "road-oneway-arrow-blue",
      "road-primary",
      "road-secondary-tertiary",
      "road-street",
      "road-minor",
      "road-major-link",
      "road-motorway-trunk-case",
      "road-major-link-case",
      "road-primary-case",
      "road-secondary-tertiary-case",
      "road-street-case",
      "road-minor-case",
      "road-minor-low",
      "tunney-oneway-arrow-white",
      "tunnel-motorway-trunk",
      "tunnel-oneway-arrow-blue",
      "tunnel-primary-secondary-tertiary",
      "tunnel-street-minor",
      "tunnel-major-link",
      "tunnel-motorway-trunk-case",
      "tunnel-major-link-case",
      "tunnel-primary-secondary-tertiary-case",
      "tunnel-street-minor-case",
      "tunnel-street-minor-low",
    ],
    //idx: 2,
  },

  {
    name: "Borders",
    id: [
      "admin-0-boundary-disputed",
      "admin-0-boundary",
      "admin-1-boundary",
      "admin-0-boundary-bg",
      "admin-1-boundary-bg",
    ],
    idx: 3,
  },

  {
    name: "Buildings",
    id: ["building-extrusion"],
    //idx: 4,
  },

  {
    name: "Water",
    id: ["water-point-label", "water-line-label", "waterway-label", ,],
    //idx: 5,
  },

  {
    name: "Land",
    id: [
      "natural-point-label",
      "natural-line-label",
      "land-structure-line",
      "land-structure-polygon",
    ],
    //idx: 6,
  },
];

const MapContext = createContext([{}, () => {}]);

const MapContextProvider = (props) => {
  const [stateMap, setStateMap] = useState({
    selectedWellId: null,
    selectedWellApi: null,
    checkedHeats: null,
    selectedWell: null,
    styleLayers: styleLayers,
    heatLayers: heatLayers,
    baseMapLayers: baseMapLayers,
    userDefinedLayers: userDefinedLayers,
    checkedLayers: [0, 3],
    checkedHeats: [],
    checkedBaseLayers: [0, 1, 2, 3, 4, 5],
    checkedUserDefinedLayers: [],
    selectedLayerId: null,
    openWellDetails: false,
    sourceLoaded: false,
    toggle3d: null,
    toggleZoomOut: null,
    map: null,
    draw: null,
    currentFeature: undefined,
  });
  return (
    <MapContext.Provider value={[stateMap, setStateMap]}>
      {props.children}
    </MapContext.Provider>
  );
};

export { MapContext, MapContextProvider };
