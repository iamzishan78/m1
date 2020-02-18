import React, { useState, createContext } from "react";

const AppContext = createContext([{}, () => {}]);

const AppProvider = props => {
  const [stateApp, setStateApp] = useState({
    selectedRoute: "/",
    user: null,
    wellCount: 500,
    wells: null,
    selectedWell: null,
    selectedWellId: null,
    editDraw: false,
    selectedOwner: null,
    owners: null,
    popupOpen: false, //map used in flyto
    flyTo: null, //map used in flyto
    selectedTitleOpinionId: null, ///////////////temporary
    featureOrMapShape: {}
  });
  return (
    <AppContext.Provider value={[stateApp, setStateApp]}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
