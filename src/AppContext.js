import React, { useState, createContext, useEffect } from "react";

import { MSALObj } from "./components/Login/AADAuthConfig";

const AppContext = createContext([{}, () => {}]);

const AppProvider = (props) => {
  const [stateApp, setStateApp] = useState({
    myMSALObj: null,
    selectedRoute: "/",
    apolloClientEndpoint:
      "https://m1graphql.azurewebsites.net/api/m1neral?code=kNAzP9HYSsEwdWhlLa55AIGeKj2iiFFOpXaTMRh9IuTODWpNobIX3g==",
    // "http://localhost:7071/api/m1graph",
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
    filters: [],
    filtersMockDb: null,
    filtersAdd: null,
    filtersOnOff: null,
    filtersDefaultOnoff: null,
    selectedContact: null,
    trackFilterOn: null,
    trackedWellArray: [],
    mapVars: {
      zoom: 5.88,
      center: { lng: -98.8, lat: 31.6 },
      pitch: 0,
      bearing: 0,
      styleId: "Outdoors",
    },
  });

  useEffect(() => {
    let tenantId = null;
    let myMSALObjInt = null;
    let myAccountInt = null;

    async function wait() {
      tenantId = window.sessionStorage.getItem("tenantId");

      if(tenantId) {
        myMSALObjInt = await MSALObj(tenantId);
      }

      if(myMSALObjInt) {
        myAccountInt = await myMSALObjInt.getAccount();
      }

      if (tenantId && myMSALObjInt && myAccountInt){
        setStateApp({ ...stateApp, myMSALObj: myMSALObjInt});
      }
    } wait();
  }, []);

  return (
    <AppContext.Provider value={[stateApp, setStateApp]}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
