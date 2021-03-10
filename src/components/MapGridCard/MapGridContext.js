import React, { useState, createContext } from "react";

const MapGridContext = createContext([{}, () => {}]);

const MapGridContextProvider = (props) => {
  const [stateGrid, setStateGrid] = useState({
    selectedMenuIndexFind: 0,
  });

  return (
    <MapGridContext.Provider value={[stateGrid, setStateGrid]}>
      {props.children}
    </MapGridContext.Provider>
  );
};

export { MapGridContext, MapGridContextProvider };
