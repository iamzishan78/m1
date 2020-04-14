import React, { useState, createContext } from "react";

const AppContext = createContext([{}, () => {}]);

const AppProvider = (props) => {
  const [stateApp, setStateApp] = useState({
    selectedRoute: "/",
    apolloClientEndpoint:
      "https://m1graphql.azurewebsites.net/api/m1neral?code=kNAzP9HYSsEwdWhlLa55AIGeKj2iiFFOpXaTMRh9IuTODWpNobIX3g==",
    user: null,
    wellCount: 500,
    wells: null,
    selectedWell: null,
    selectedWellId: null,
    editDraw: false,
    selectedOwner: null,
    owners: null,
    popupOpen: false, //map used in flyto
    expandedCard: false,
    flyTo: null, //map used in flyto
    selectedTitleOpinionId: null,
    featureOrMapShape: {},
    selectedContact: null,
  });
  return (
    <AppContext.Provider value={[stateApp, setStateApp]}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
