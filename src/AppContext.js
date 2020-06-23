import React, { useState, createContext, useEffect } from "react";

import { MSALObj, tenantsCredentials } from "./components/Login/AADAuthConfig";
import {
  styleLayers,
  userDefinedLayers,
  heatLayers,
  baseMapLayers,
} from "./LayerConfig";

const AppContext = createContext([{}, () => {}]);

const AppProvider = (props) => {
  const [stateApp, setStateApp] = useState({
    myMSALObj: null,
    selectedRoute: "/",
    apolloClientEndpoint:
      "https://m1graphql.azurewebsites.net/api/m1neral?code=kNAzP9HYSsEwdWhlLa55AIGeKj2iiFFOpXaTMRh9IuTODWpNobIX3g==",
    // "http://localhost:7071/api/m1graph",
    user: null,
    signUpUserType: null,
    wellCount: 500,
    wells: null,
    trackedwells: null,
    trackedOwnerWells: null,
    selectedWell: null,
    selectedWellId: null,
    customLayers: [],
    editDraw: false,
    editLayer: true,
    selectedOwner: null,
    owners: null,
    popupOpen: false, //map used in flyto
    expandedCard: false,
    flyTo: null, //map used in flyto
    fitBounds: null, //map used in fitBounds
    selectedTitleOpinionId: null,
    selectedUserDefinedLayer: null,
    featureOrMapShape: {},
    filters: [],
    filtersMockDb: null,
    filtersAdd: null,
    filtersOnOff: null,
    filtersDefaultOnoff: null,
    selectedContact: null,
    trackFilterOn: null,
    trackedWellArray: [],
    userSnap: false,
    mapVars: {
      zoom: 5.88,
      center: { lng: -98.8, lat: 31.6 },
      pitch: 0,
      bearing: 0,
      styleId: "Outdoors",
    },
    // layerData: {
    //   trackedWellsWells: null,
    //   trackedOwnerWells: null,
    //   taggedWells: null,
    // },
    wellSelectedCoordinates: [],

    //Map State
    selectedWellApi: null,
    styleLayers: styleLayers,
    heatLayers: heatLayers,
    baseMapLayers: baseMapLayers,
    userDefinedLayers: userDefinedLayers,
    checkedLayers: [0, 3],
    checkedHeats: [],
    checkedBaseLayers: [0, 1, 2, 3, 4, 5],
    checkedUserDefinedLayers: [],
    tempCheckedUserDefinedLayer: null,
    checkedUserDefinedLayersInteraction: [0, 1, 2, 3, 4, 5, 6],
    editingUserDefinedLayers: [],
    checkedLayersInteraction: [0],
    selectedLayerId: null,
    openWellDetails: false,
    sourceLoaded: false,
    toggle3d: null,
    toggleZoomOut: null,
    map: null,
    draw: null,
    currentFeature: undefined,
    wellListFromSearch: null,
    wellListFromTagsFilter: null,
    activateLayers: (layerContainerVarName, layerNumber) => {
      let added = false;
      setStateApp((stateApp) => {
        const currentIndex = stateApp[layerContainerVarName].indexOf(
          layerNumber
        );
        const newChecked = [...stateApp[layerContainerVarName]];
        if (currentIndex === -1) {
          newChecked.push(layerNumber);
          added = true;
        }
        return {
          ...stateApp,
          [layerContainerVarName]: newChecked,
          popupOpen: false,
          selectedWell: null,
        };
      });
      return added;
    },
    deactivateLayers: (layerContainerVarName, layerNumber) => {
      let deleted = false;
      setStateApp((stateApp) => {
        const currentIndex = stateApp[layerContainerVarName].indexOf(
          layerNumber
        );
        const newChecked = [...stateApp[layerContainerVarName]];
        if (currentIndex !== -1) {
          newChecked.splice(currentIndex, 1);
          deleted = true;
        }

        return {
          ...stateApp,
          [layerContainerVarName]: newChecked,
          popupOpen: false,
          selectedWell: null,
        };
      });
      return deleted;
    },
    activateUserDefinedLayers: (layerNumber) => {
      return stateApp.activateLayers("checkedUserDefinedLayers", layerNumber);
    },
    deactivateUserDefinedLayers: (layerNumber) => {
      return stateApp.deactivateLayers("checkedUserDefinedLayers", layerNumber);
    },
    activateWellLayer: () => {
      return stateApp.activateLayers("checkedLayers", 0);
    },
    deactivateWellLayer: () => {
      return stateApp.deactivateLayers("checkedLayers", 0);
    },
  });

  useEffect(() => {
    async function wait() {
      let tenantName = window.sessionStorage.getItem("tenantName");

      if (tenantName) {
        let tenant = tenantsCredentials(tenantName);
        let myMSALObjInt = MSALObj(tenant.tenantId, tenant.clientId);
        setStateApp({
          ...stateApp,
          myMSALObj: myMSALObjInt,
          apolloClientEndpoint: tenant.apolloClientEndpoint,
        });
      } else {
        setStateApp({ ...stateApp, myMSALObj: false });
      }
    }
    wait();
  }, []);

  useEffect(() => {
    if (
      stateApp.checkedUserDefinedLayers &&
      stateApp.checkedUserDefinedLayers.indexOf(5) === -1 &&
      stateApp.checkedUserDefinedLayers.indexOf(4) === -1 &&
      stateApp.checkedUserDefinedLayers.indexOf(3) === -1
    ) {
      stateApp.activateWellLayer();
    }
  }, [stateApp.checkedUserDefinedLayers]);

  return (
    <AppContext.Provider value={[stateApp, setStateApp]}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
