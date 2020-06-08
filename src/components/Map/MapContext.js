import React, { useState, createContext } from "react";

const styleLayers = [
  {
    name: "Wells",
    id: ["wellpoints", "welllines"],
  },
  {
    name: "Basins",
    id: ["basinLabels","basinLayer"],
  },
  {
    name: "Pipelines",
    id: ["pipelineLayer"],
  },
  {
    name: "Land Grid",
    id: ["PLSSTownships", "PLSSTownshipLabels", "PLSSFirstDivision", "PLSSFirstDivisionLabels", "TexasLandSurvey", "TexasLandSurveyLabels"],
  },
  // {
  //   name: "Permits",
  //   id: [],
  // },
  {
    name: "Rig Activity",
    id: ["rigsbycounty"],
  },
  {
    name: "TX GLO Units",
    id: ["GLOUnits","GLOUnitsLabels"],
  },
  {
    name: "TX GLO Active Leases",
    id: ["GLOLeases","GLOLeaseLabels"],
  }, 
];


const userDefinedLayers = [
  
  {
    name: "Parcels",
    id: ["parcel", "parcel_labels"],
    idColor: "#e07c71",
    type: 'data layer',
    dataProps: [
      {
        dataId: 'parcel',
      }, {
        dataId: 'parcel_labels'
      }
    ],
    sourceProps: [
      {
        sourceId: "parcel_source",
        sourceType: "geojson",
      },
      {
        sourceId: "parcel_labels_source",
        sourceType: "geojson",
      },
    ],
    layerProps: [
      {
        layerType: "fill",
        layerId: "parcel",
        paintProps: {
          'fill-color': '#e07c71',
          'fill-opacity': 0.4,
          'fill-outline-color': '#e07c71',
        }
      }, {
        layerType: "symbol",
        layerId: "parcel_labels",
        symbolProps: {
          'text-allow-overlap': true,
          'text-anchor': "center",
          'text-field': '{label}',
        }
      }
    ],
  },
  {
    name: "Title",
    id: [],
    idColor: "#b6a0d3",
    type: 'data layer'
  },
  {
    name: "Area of Interest",
    id: ["interest", "interest_labels"],
    idColor: "#62a27f",
    type: 'data layer',
    dataProps: [
      {
        dataId: 'interest',
      }, {
        dataId: 'interest_labels'
      }
    ],
    sourceProps: [
      {
        sourceId: "interest_source",
        sourceType: "geojson",
      },
      {
        sourceId: "interest_labels_source",
        sourceType: "geojson",
      },
    ],
    layerProps: [
      {
        layerType: "fill",
        layerId: "interest",
        paintProps: {
          'fill-color': '#62a27f',
          'fill-opacity': 0.4,
          'fill-outline-color': '#62a27f',
        }
      }, {
        layerType: "symbol",
        layerId: "interest_labels",
        symbolProps: {
          'text-allow-overlap': true,
          'text-anchor': "center",
          'text-field': '{label}',
        }
      }
    ],
  },

  {
    name: "Tracked Wells",
    id: ['Tracked Wells'],
    idColor: "#e4a773",
    type: 'data layer',
    dataProps: [{
      dataId: 'trackedWellsWells',
      dataTypeId: 'Point',
    }],
    sourceProps:[{
      sourceId:"tracked_wells_user_defined_source",
      sourceType: "geojson",
    }],
    layerProps: [{
      layerId: "Tracked Wells",
      layerType: "circle",
      paintProps: {
        "circle-radius": 5,
        "circle-color": "#e4a773",
        "circle-stroke-width": 2,
        "circle-stroke-color": '#fff',
      },
      clusterProps: {
        clusterPaintProps: {
          'circle-color': {
              property: 'point_count',
              type: 'interval',
              stops: [
                  [0, '#e4a773'],
                  [100, '#e4a773'],
                  [750, '#e4a773'],
              ]
            },
          'circle-radius': {
              property: 'point_count',
              type: 'interval',
              stops: [
                  [0, 20],
                  [100, 30],
                  [750, 40]
              ]
            },
            "circle-stroke-width": 5,
            "circle-stroke-color": '#fff',
          },
        clusterSymbolProps: {
          'text-field': '{point_count}',
          'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
          'text-size': 12
          },
      },
    }],
    interactionProps:{
      hoverActions:{
        mouseMove: {
          cursor: 'pointer'
        },
        mouseLeave: {
          cursor: ''
        },
      },
      mouseClick: {
        clickInteraction: {
          boundTo: false, 
          flyTo: true,
          easeTo: false,
          popUp: false,
        },
        clusterClickInteraction: {
          boundTo: false, 
          flyTo: false,
          easeTo: true,
          popUp: false,
        },
      },
    },

  },

  {
    name: "Tracked Owners",
    id: ['Tracked Owners'],
    idColor: "#01fdfe",
    type: 'data layer',
    dataProps: [{
      dataId: 'trackedOwnersWells',
      dataTypeId: 'Point',
    }],
    sourceProps:[{
      sourceId:"tracked_owners_user_defined_source",
      sourceType: "geojson",
    }],
    layerProps: [{
      layerId: "Tracked Owners",
      layerType: "circle",
      paintProps: {
        "circle-radius": 5,
        "circle-color": "#01fdfe",
        "circle-stroke-width": 2,
        "circle-stroke-color": '#fff',
      },
      clusterProps: {
        cluster: true,
        clusterBaseId: "Tracked Owners Clusters",
        clusterCountId: "Tracked Owners Clusters Counts",
        clusterPaintProps: {
          'circle-color': {
              property: 'point_count',
              type: 'interval',
              stops: [
                  [0, '#01fdfe'],
                  [100, '#01fdfe'],
                  [750, '#01fdfe'],
              ]
            },
          'circle-radius': {
              property: 'point_count',
              type: 'interval',
              stops: [
                  [0, 20],
                  [100, 30],
                  [750, 40]
              ]
            },
            "circle-stroke-width": 5,
            "circle-stroke-color": '#fff',
          },
        clusterSymbolProps: {
          'text-field': '{point_count}',
          'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
          'text-size': 12
          },
      },
    }],
    interactionProps:{
      hoverActions:{
        mouseMove: {
          cursor: 'pointer'
        },
        mouseLeave: {
          cursor: ''
        },
      },
      mouseClick: {
        clickInteraction: {
          boundTo: false, 
          flyTo: true,
          easeTo: false,
          popUp: false,
        },
        clusterClickInteraction: {
          boundTo: false, 
          flyTo: false,
          easeTo: true,
          popUp: false,
        },
      },
    },
  },

  // TEMPORARY COMMENT OUT. FEATURE IN PROGRESS 
  // DO NOT DELETE 
  // {
  //   name: "Tracked Owners",
  //   id: [],
  //   type: 'data layer'
  // },
  // {
  //   name: "Tag Layer",
  //   id: [],
  //   type: 'data layer'

  // },

];


const heatLayers = [
  {
    name: "Cumulative BOE",
    id: ["wellsHeatmapBoe"],
    idx: 5,
  },
  {
    name: "Last 12mo BOE",
    id: ["wellsHeatmapLast12"],
    idx: 6,
  },
  {
    name: "IP90 Oil",
    id: ["wellsHeatmapIP90Oil"],
    idx: 7,
  },
  {
    name: "IP90 Gas",
    id: ["wellsHeatmapIP90Gas"],
    idx: 8,
  },
  {
    name: "Recently Drilled",
    id: ["wellsHeatmapRecentlyDrilled"],
    idx: 9,
  },
  {
    name: "Recently Completed",
    id: ["wellsHeatmapRecentlyCompleted"],
    idx: 10,
  },
];

const baseMapLayers = [
  {
    name: "Map Labels",
    id: [
      "country-label",
      "state-label",
      "settlement-major-label",
      "settlement-minor-label",
      "settlement-subdivision-label",
      "airport-label",
      "transit-label",
      "poi-label",
    ],
  },

  {
    name: "Roads",
    id: [
      "ferry-aerialway-label",
      "road-exit-shield",
      "road-number-shield",
      "road-label",
      "aerialway",
      "bridge-oneway-arrow-white",
      "bridge-motorway-trunk-2",
      "bridge-major-link-2",
      "bridge-motorway-trunk-2-case",
      "bridge-major-link-2-case",
      "bridge-pedestrian",
      "bridge-steps",
      "bridge-path",
      "road-pedestrian",
      "road-steps",
      "road-path",
      "tunnel-pedestrian",
      "tunnel-steps",
      "tunnel-path",
      "bridge-motorway-trunk",
      "bridge-oneway-arrow-blue",
      "bridge-primary-secondary-tertiary",
      "bridge-street-minor",
      "bridge-major-link",
      "bridge-motorway-trunk-case",
      "bridge-major-link-case",
      "bridge-primary-secondary-tertiary-case",
      "bridge-street-minor-case",
      "bridge-street-minor-low",
      "road-oneway-arrow-white",
      "road-motorway-trunk",
      "road-oneway-arrow-blue",
      "road-primary",
      "road-secondary-tertiary",
      "road-street",
      "road-minor",
      "road-major-link",
      "road-motorway-trunk-case",
      "road-major-link-case",
      "road-primary-case",
      "road-secondary-tertiary-case",
      "road-street-case",
      "road-minor-case",
      "road-minor-low",
      "tunney-oneway-arrow-white",
      "tunnel-motorway-trunk",
      "tunnel-oneway-arrow-blue",
      "tunnel-primary-secondary-tertiary",
      "tunnel-street-minor",
      "tunnel-major-link",
      "tunnel-motorway-trunk-case",
      "tunnel-major-link-case",
      "tunnel-primary-secondary-tertiary-case",
      "tunnel-street-minor-case",
      "tunnel-street-minor-low",
    ],
  },

  {
    name: "Borders",
    id: [
      "admin-0-boundary-disputed",
      "admin-0-boundary",
      "admin-1-boundary",
      "admin-0-boundary-bg",
      "admin-1-boundary-bg",
    ],
  },

  {
    name: "Buildings",
    id: ["building-extrusion"],
  },

  {
    name: "Water",
    id: ["water-point-label", "water-line-label", "waterway-label", ,],
  },

  {
    name: "Land",
    id: [
      "natural-point-label",
      "natural-line-label",
      "land-structure-line",
      "land-structure-polygon",
    ],
  },
];

const MapContext = createContext([{}, () => {}]);

const MapContextProvider = (props) => {
  const [stateMap, setStateMap] = useState({
    selectedWellId: null,
    selectedWellApi: null,
    selectedWell: null,
    styleLayers: styleLayers,
    heatLayers: heatLayers,
    baseMapLayers: baseMapLayers,
    userDefinedLayers: userDefinedLayers,
    checkedLayers: [0, 3],
    checkedHeats: [],
    checkedBaseLayers: [0, 1, 2, 3, 4, 5],
    checkedUserDefinedLayers: [],
    checkedUserDefinedLayersInteraction: [0,1,2,3,4],
    checkedLayersInteraction: [0],
    selectedLayerId: null,
    openWellDetails: false,
    sourceLoaded: false,
    toggle3d: null,
    toggleZoomOut: null,
    map: null,
    draw: null,
    currentFeature: undefined,
  });
  return (
    <MapContext.Provider value={[stateMap, setStateMap]}>
      {props.children}
    </MapContext.Provider>
  );
};

export { MapContext, MapContextProvider };
