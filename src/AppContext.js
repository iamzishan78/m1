import React, { useState, createContext, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
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
      zoom: 4.88,
      center: { lng: -98.8, lat: 38 },
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
    universalCircularLoaderAct: false, //// set it to true to show a loader in the center of the viewport
    mapGridCardActivated: false,
    searchResultData: [], //// mapGridCard Search Data
    searchloading: false, //// mapGridCard Search loading
    viewportData: [], //// mapGridCard Viewport Data
    trackedDataCount: 0, //// mapGridCard Viewport tracked count

    //Map State
    mapCircularLoaderAct: false,
    mapboxglAccessToken:
      "pk.eyJ1IjoibTFuZXJhbCIsImEiOiJjanYycGJxbG8yN3JsM3lsYTdnMXZoeHh1In0.tTNECYKDPtcrzivWTiZcIQ",
    selectedWellApi: null,
    styleLayers: styleLayers,
    heatLayers: heatLayers,
    baseMapLayers: baseMapLayers,
    userDefinedLayers: userDefinedLayers,
    tempCheckedLayer: null,
    checkedLayers: [2, 5],
    checkedHeats: [],
    checkedBaseLayers: [0, 1, 2, 3, 4, 5],
    checkedUserDefinedLayers: [0, 2],
    userFileLayers: [],
    tempCheckedUserDefinedLayer: null,
    checkedUserDefinedLayersInteraction: [0, 1, 2, 3, 4, 5, 6],
    editingUserDefinedLayers: [],
    csvContactsList: [],
    csvContactsListToSend: [],
    activeStepNumber: 0,
    checkedLayersInteraction: [0, 1, 2],
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
    m1neralHeaders: [],
    mappedHeadersFromCSV: [],

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
          mapCircularLoaderAct: false,
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
          mapCircularLoaderAct: false,
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
      return stateApp.activateLayers("checkedLayers", 2);
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
      stateApp.checkedUserDefinedLayers.indexOf(4) === -1 &&
      stateApp.checkedUserDefinedLayers.indexOf(3) === -1 &&
      stateApp.checkedLayers.indexOf(2) === -1
    ) {
      stateApp.activateWellLayer();
    }
  }, [stateApp.checkedUserDefinedLayers]);

  useEffect(() => {
    setStateApp((state) => ({
      ...state,
      trackedDataCount:
        (!stateApp.owners || !stateApp.owners.length
          ? 0
          : stateApp.owners.length) +
        (!stateApp.trackedwells || !stateApp.trackedwells.length
          ? 0
          : stateApp.trackedwells.length),
    }));
  }, [stateApp.owners, stateApp.trackedwells]);

  return (
    <AppContext.Provider value={[stateApp, setStateApp]}>
      {props.children}
      {stateApp.universalCircularLoaderAct && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            height: "100vh",
            width: "100vw",
            zIndex: "100000",
          }}
        >
          <CircularProgress
            style={{
              position: "fixed",
              top: "calc(50vh - 16px)",
              left: "calc(50vw - 40px)",
              color: "#12ABE0",
            }}
            size={80}
            disableShrink
          />
        </div>
      )}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
