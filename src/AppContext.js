import React, { useState, createContext } from "react";

const AppContext = createContext([{}, () => {}]);



const AppProvider = props => {
  const [stateApp, setStateApp] = useState({
    selectedRoute: "/",
    apolloClientEndpoint:'https://m1graph.azurewebsites.net/api/m1graphql?code=0mQgwjKYS3TOX7DvDmJUNbUpCqnP4OQragGaaZVqkFdQVvkz8hRbVQ==',
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
    selectedTitleOpinionId: null,
    featureOrMapShape: {},
    selectedContact: null
  });
  return (
    <AppContext.Provider value={[stateApp, setStateApp]}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
