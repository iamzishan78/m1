import React, { useState, createContext } from "react";

const MapControlsContext = createContext([{}, () => {}]);


const layers = [
  { name: "Basins", value: "basinLayer" },
  { name: "Pipelines", value: "pipelineLayer" },
  { name: "Surveys", value: "surveyLayer" },
];


const MapControlsContextProvider = props => {
  const [stateMapControls, setStateMapControls] = useState({
    selectedControl: null,
    openSpeedDial: true,
    anchorEl: null,
    layers: layers,
    userData:null,
    heatmaps: null,
    selectedBaseMap: "",
    editDraw: false,
    map: null,
    Draw: null,
    mapStyleList: [],
  });
  return (
    <MapControlsContext.Provider
      value={[stateMapControls, setStateMapControls]}
    >
      {props.children}
    </MapControlsContext.Provider>
  );
};

export { MapControlsContext, MapControlsContextProvider };





