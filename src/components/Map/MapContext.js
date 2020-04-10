import React, { useState, createContext } from "react";

const styleLayers = [
  {
    name: "Wells",
    id: ["wellpoints", "welllines"],
    idx: 0
  },
  {
    name: "Basins",
    id: ["basinLayer"],
    idx: 2
  },
  {
    name: "Pipelines",
    id: ["pipelineLayer"],
    idx: 3
  },
  {
    name: "Land Grid",
    id: ["surveylabels", "surveyLayer"],
    idx: 4
  },
];

const heatLayers = [
  {
    name: "Cumulative BOE",
    id: ["wellsHeatmapBoe"],
    idx: 5
  },
  {
    name: "Last 12mo BOE",
    id: ["wellsHeatmapLast12"],
    idx: 6
  },
  {
    name: "IP90 Oil",
    id: ["wellsHeatmapIP90Oil"],
    idx: 7
  },
  {
    name: "IP90 Gas",
    id: ["wellsHeatmapIP90Gas"],
    idx: 8
  },
  {
    name: "Recently Drilled",
    id: ["wellsHeatmapRecentlyDrilled"],
    idx: 9
  },
  {
    name: "Recently Completed",
    id: ["wellsHeatmapRecentlyCompleted"],
    idx: 10
  }
];

const MapContext = createContext([{}, () => {}]);

const MapContextProvider = props => {
  const [stateMap, setStateMap] = useState({
    selectedWellId: null,
    selectedWellApi: null,
    checkedHeats: null,
    selectedWell: null,
    styleLayers: styleLayers,
    heatLayers: heatLayers,
    checkedLayers: [0, 3],
    checkedHeats: [],
    selectedLayerId: null,
    openWellDetails: false,
    sourceLoaded: false,
    openTrack: false,
    toggle3d: false,
    map: null,
    draw: null,
    currentFeature: undefined
  });
  return (
    <MapContext.Provider value={[stateMap, setStateMap]}>
      {props.children}
    </MapContext.Provider>
  );
};

export { MapContext, MapContextProvider };
