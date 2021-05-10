import React, { useState, createContext, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MSALObj, tenantsCredentials } from "./components/Login/AADAuthConfig";
import {MSALB2CObj,B2CTenantCredentials } from "./components/Login/AADB2CAuthConfig";
import { useDispatch } from "react-redux";
import { setMapGridCardState } from "./actions";
import { heatLayers, baseMapLayers,} from "./LayerConfig";

const AppContext = createContext([{}, () => {}]);

const AppProvider = (props) => {
  const [stateApp, setStateApp] = useState({
    myMSALObj: null,
    myMSALB2CObj: null,

    baseMapLayers: baseMapLayers, // move to a map context -- will be changed with mepler anyways
    heatLayers: heatLayers, // move to a map context -- will be changed with mepler anyways 
    apolloClientEndpoint: "",
    graphqlScope: null, /// potentially login context? 
    user: null, /// potenitally login context or maybe a specific user context?? 
    signUpUserType: null,/// potenitally login context or maybe a specific user context?? 
    wellDetailCardOpen: null, // move to map data card context 
    wellDetailCardTabIndex:null,
    parcelDetailCardOpen: false, // move to map data card context 
    trackedwells: null, // move to a grid context or query context 
    trackedOwnerWells: null, // move to a grid context or query context 
    selectedWell: null, // move to a selected object context (maybe flyto)
    selectedWellId: null, // move to a selected object context (maybe flyto)
    selectedAbstracts: [], // move to a selected object context (maybe flyto)
    selectedParcel: null, // move to a selected object context (maybe flyto)
    
    customLayers: [],
    editDraw: false,
    editLayer: true,
    selectedOwner: null,
    owners: null,
    popupOpen: false, //map used in flyto
    expandedCard: false, // probably need in a map card context 
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
    trackedWellArray: [],
    userSnap: false,
    mapVars: {
      zoom: 4.88,
      center: { lng: -98.8, lat: 38 },
      pitch: 0,
      bearing: 0,
      styleId: "Outdoors",
    }, // move to a map context. check if this is somehow duplicated. 
    defaultMapVars: {
      zoom: 4.88,
      center: { lng: -98.8, lat: 38 },
      pitch: 0,
      bearing: 0,
      styleId: "Outdoors",
    }, // move to a map context 
    wellSelectedCoordinates: [],
    universalCircularLoaderAct: false, //// set it to true to show a loader in the center of the viewport

    //Map State
    mapCircularLoaderAct: false,
    mapboxglAccessToken:
      "pk.eyJ1IjoibTFuZXJhbCIsImEiOiJja2V6MHd2bnQwYzRqMnlwaTV6ejU2cTMyIn0.ghyrh-G8uQtyg4N4VcfTOw",
    selectedWellApi: null,
    layers: null,
    searchLayerIndex: null,
    trackedOwnersLayerIndex: null,
    trackedWellsLayerIndex: null,
    tagsLayerIndex: null,
    checkedLayers: [2, 5],
    wellsLayerIndex: null,
    checkedHeats: [],
    checkedBaseLayers: [0, 1, 2, 3, 4, 5],
    checkedUserDefinedLayers: [],
    checkedFileLayers: [],
    tempCheckedUserDefinedLayer: null,
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
    toggle3d: null,  // move to a map context
    toggleZoomOut: null, // move to a map context 
    map: null, // move to a map context
    draw: null, 
    zoomFault: null,
    hugeRequest: null,
    currentFeature: undefined,
    wellListFromSearch: [],
    wellListFromTagsFilter: [],
    m1neralHeaders: [],
    mappedHeadersFromCSV: [],
    viewportWells: null,
    minZoomToQueryViewport: 12.5,
    activateWellDetailsFromTable: false,
    contactUpdated: null,
    currentContatcAtivities: [],
    dealDisplayType: "board",
    activityDisplayType: "calendar",
    prevAOIVisible: false,
    prevParcelVisible: false,
    prevBasinVisible: false,    
    transactBarView: "",
    contactSearchQuery: "",
    isContactSearching: false,
    viewDoc:null,
    toggleLayersActivity: (identifier, activityValue) => {
      if (identifier) {
        let res;
        setStateApp((stateApp) => {
          if (stateApp.layers && Array.isArray(stateApp.layers)) {
            const currentLayers = [...stateApp.layers];
            const index = currentLayers.findIndex(
              (l) => l.identifier == identifier
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

            //// saving to stateApp
            currentLayers[index] = updatedLayer;

            return {
              ...stateApp,
              layers: [...currentLayers],
              // popupOpen: false,
              // selectedWell: null,
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
        let myMSALObjInt = MSALObj(tenant);
        setStateApp((state, props) => {
          return {
            ...state,
            myMSALObj: myMSALObjInt,
            apolloClientEndpoint: tenant.apolloClientEndpoint,
            graphqlScope: tenant.graphqlScope,
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
            zIndex: "10000000000",
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
