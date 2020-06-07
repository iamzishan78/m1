import React, { useContext } from "react";
import { MapControlsContextProvider } from "./MapControlsContext";

import MapControls from "./MapControls";

export default function MapControlsProvider(props) {
  const { changeBaseMap, changeLayers, changeHeatmaps } = props;

  return (
    <MapControlsContextProvider>
      <MapControls
        changeHeatmaps={changeHeatmaps}
        changeLayers={changeLayers}
        changeBaseMap={changeBaseMap}
      />
    </MapControlsContextProvider>
  );
}
