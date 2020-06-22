import React, { useState, createContext } from "react";

const MapContext = createContext([{}, () => {}]);

const MapContextProvider = (props) => {
  const [stateApp, setStateApp] = useState({});

  return (
    <MapContext.Provider value={[stateApp, setStateApp]}>
      {props.children}
    </MapContext.Provider>
  );
};

export { MapContext, MapContextProvider };
