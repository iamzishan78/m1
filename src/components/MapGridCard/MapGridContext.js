import React, { useState, createContext } from "react";

const MapGridContext = createContext([{}, () => {}]);

const MapGridContextProvider = (props) => {
  const [stateGrid, setStateGrid] = useState({
    gridSearchTarget: null,
  });

  return (
    <MapGridContext.Provider value={[stateGrid, setStateGrid]}>
      {props.children}
    </MapGridContext.Provider>
  );
};

export { MapGridContext, MapGridContextProvider };
