import React, { useState, createContext, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MSALObj, tenantsCredentials } from "./components/Login/AADAuthConfig";
import { MSALB2CObj, B2CTenantCredentials } from "./components/Login/AADB2CAuthConfig";
import {
  styleLayers,
  userDefinedLayers,
  heatLayers,
  baseMapLayers,
  layers,
  defaultLayers,
} from "./LayerConfig";
import { useDispatch } from "react-redux";
import { setMapGridCardState } from "./actions";

const AppContext = createContext([{}, () => {}]);

const AppProvider = (props) => {
  const [stateApp, setStateApp] = useState({
    myMSALObj: null,
    myMSALB2CObj: null,
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
    selectedAbstracts: [],
    selectedParcel: null,
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
    filterSelectAllAbstract: false,
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

    //Map State
    mapCircularLoaderAct: false,
    mapboxglAccessToken:
      "pk.eyJ1IjoibTFuZXJhbCIsImEiOiJja2V6MHd2bnQwYzRqMnlwaTV6ejU2cTMyIn0.ghyrh-G8uQtyg4N4VcfTOw",
    selectedWellApi: null,
    styleLayers: styleLayers,
    heatLayers: heatLayers,
    layers: null,
    defaultLayers: defaultLayers,
    baseMapLayers: baseMapLayers,
    userDefinedLayers: userDefinedLayers,
    searchLayerIndex: null,
    trackedOwnersLayerIndex: null,
    trackedWellsLayerIndex: null,
    tagsLayerIndex: null,
    tempCheckedLayer: null,
    checkedLayers: [2, 5],
    wellsLayerIndex: null,
    checkedHeats: [],
    checkedBaseLayers: [0, 1, 2, 3, 4, 5],
    checkedUserDefinedLayers: [],
    checkedFileLayers: [],
    tempCheckedUserDefinedLayer: null,
    tempCheckedAOILayer: null,
    tempCheckedParcleLayer: null,
    checkedUserDefinedLayersInteraction: [0, 1, 2, 3, 4, 5, 6],
    checkedFileLayersInteraction: [],
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
    zoomFault: null,
    hugeRequest: null,
    currentFeature: undefined,
    wellListFromSearch: [],
    wellListFromTagsFilter: [],
    m1neralHeaders: [],
    mappedHeadersFromCSV: [],
    toggleLayersActivity: (layerName, activityValue) => {
      if (layerName) {
        let res;
        setStateApp((stateApp) => {
          if (stateApp.layers && Array.isArray(stateApp.layers)) {
            const currentLayers = [...stateApp.layers];
            const index = currentLayers.findIndex(
              (l) => l.layerName == layerName
            );

            const updatedLayer = {
              ...currentLayers[index],
              layerSettings: {
                ...currentLayers[index].layerSettings,
                visiable:
                  activityValue !== undefined
                    ? activityValue
                    : !currentLayers[index].layerSettings.visiable,
              },
            };
            res = updatedLayer.layerSettings.visiable;

            //// saving to mongo
            // updateLayerSettings({
            //   variables: {
            //     settings: {
            //       _id: updatedLayer._id,
            //       layerSettings: updatedLayer.layerSettings,
            //     },
            //   },
            // });

            //// saving to stateApp
            currentLayers[index] = updatedLayer;

            return {
              ...stateApp,
              layers: [...currentLayers],
              popupOpen: false,
              selectedWell: null,
              mapCircularLoaderAct: false,
            };
          }
        });
        return res;
      }
    },
  });

  const dispatch = useDispatch();

  useEffect(() => {
    async function wait() {
      let tenantName = window.sessionStorage.getItem("tenantName");

      if (tenantName) {
        let tenant = tenantsCredentials(tenantName);
        let myMSALObjInt = MSALObj(tenant.tenantId, tenant.clientId);
        setStateApp((state, props) => {
          return {
            ...state,
            myMSALObj: myMSALObjInt,
            apolloClientEndpoint: tenant.apolloClientEndpoint,
          };
        });
      } else {
        setStateApp((state, props) => {
          return { ...state, myMSALObj: false };
        });
      }

      let B2CTenantName = window.sessionStorage.getItem("B2CTenantName");

      if (B2CTenantName) {
        let tenant = B2CTenantCredentials(B2CTenantName);
        if (tenant) {
          let myMSALB2CObjInt = MSALB2CObj(tenant.tenantId, tenant.clientId);
          setStateApp((state, props) => {
            return {
              ...state,
              myMSALB2CObj: myMSALB2CObjInt,
              apolloClientEndpoint: tenant.apolloClientEndpoint,
            };
          });
        }
      } else {
        setStateApp((state, props) => {
          return { ...state, myMSALB2CObj: false };
        });
      }
    }
    wait();
  }, []);

  useEffect(() => {
    dispatch(
      setMapGridCardState({
        trackedDataCount:
          (!stateApp.owners || !stateApp.owners.length
            ? 0
            : stateApp.owners.length) +
          (!stateApp.trackedwells || !stateApp.trackedwells.length
            ? 0
            : stateApp.trackedwells.length),
      })
    );
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
