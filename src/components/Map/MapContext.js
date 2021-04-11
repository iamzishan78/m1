import React, { useState, createContext } from "react";

const MapContext = createContext([{}, () => { }]);

const MapContextProvider = (props) => {
  const [stateMap, setStateMap] = useState({
    multiSelectLandGrids: false
  });

  return (
    <MapContext.Provider value={[stateMap, setStateMap]}>
      {props.children}
    </MapContext.Provider>
  );
};

export { MapContext, MapContextProvider };
