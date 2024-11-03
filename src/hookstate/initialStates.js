import { hookstate } from "@hookstate/core";
import { copy } from 'components/Shared/functions';
import { ROUTES } from 'components/Shared/FeatureFlag/common';

/* -------------------------------------------------------------------------- */
/*                              Global Controller                             */
/* -------------------------------------------------------------------------- */
export const globalInitialState = {
    layers: [],
    emptyGroups: [],
    universalLoader: false,
    layerLoading: {},
    user: null,
    reFetchedLayer: null, /* ? */
    mapReady: false,
    showFieldModal: false,
    apolloClientEndpoint: null,
    x_zumo_auth: null,
    cypress: null,
    testCase: null,
    bypassLogin: false,
};

export const globalState = hookstate(copy(globalInitialState));

/* -------------------------------------------------------------------------- */
/*                              Table Controller                              */
/* -------------------------------------------------------------------------- */

export const tableInitialState = {
    defaultFilters: [],
    customProps: [],
    filters: [],
    sorting: [],
    searchFields: [],
    groupedField: {},
    grouping: [],
    footerProps: [],
    ExternalFilter: [],
    defaultSort: {},
    columnOrdering: [],
    columnPinning: {
        left: [],
    },
}
export const tableESState = {};
export const tableGlobalState = hookstate({
    refetch: false,
    reInitialized: false,
});

/* -------------------------------------------------------------------------- */
/*                           Simple Table Controller                          */
/* -------------------------------------------------------------------------- */

export const simpleTableState = {};
export const simpleTableGlobalState = hookstate({
    refetch: false,
    refetchAdditionalQueries: false,
    tabKey: 0,
});


/* -------------------------------------------------------------------------- */
/*                           Layer State Controller                           */
/* -------------------------------------------------------------------------- */

export const layerStateInitialState = {
    client: null,
    history: null,
    boundingStates: null,
    bbox: null,
    zoom: 0,
    recalculate: false,

    wellListFromSearch: [], // Not Moved
    rigsData: [], // Not Moved
};

export const layerState = hookstate(copy(layerStateInitialState));

/* -------------------------------------------------------------------------- */
/*                            Draw State Controller                           */
/* -------------------------------------------------------------------------- */

export const drawInitialState = {
    showDataCard: false,
    isDrawing: false,
    editDraw: false,
    showShapeActionsPopup: false,
    showDrawShapesPopup: false,
    multiSelectLandGrids: false,
    selectedAbstracts: [],
    currentFeature: null,
    shapeEdit: false,
    shapeEditMode: '',
    showAddShapePopup: false,
    featureToEdit: null,
    featureOrMapShape: null,
    selectedAoi: null,
    selectedPolygonString: '',
    reDrawShape: false,
    shapeToExtend: null,
    lastSelectedDrawMode: 'none',
    shapeActionsFilterSelected: false,
    selectedAction: '',
    addShape: false,
};

export const drawState = hookstate(copy(drawInitialState));


/* -------------------------------------------------------------------------- */
/*                            Job State Controller                            */
/* -------------------------------------------------------------------------- */

export const jobInitialState = {
    activeStepNumber: 0,
    csvDataToSend: [],
    mappedHeadersFromCSV: [],
    m1neralHeaders: [],
    csvDataList: [],
    transferData: null,
    uploaderFormValues: {},
    selectedShapeLayerOption: null,
    bulkUpload: false,
    jobType: null,
    job: null,
};

export const jobState = hookstate(copy(jobInitialState));

/* -------------------------------------------------------------------------- */
/*                          Layer Filters Controller                          */
/* -------------------------------------------------------------------------- */

export const layerFilterInitialState = {
    polygonFilter: null,
    polygonsFilter: [],
    Units: {
        layerName: 'Units',
        allowedTypes: ['Polygon', 'MultiPolygon'],
        variables: {
            index: 'shapes_flat',
            sort: {
                field: '_ts',
                order: 'desc',
            },
            pagination: {
                first: 10000,
                after: null,
            },
            filters: [
                {
                    field: 'layer.keyword',
                    value: 'unit',
                },
            ],
            search: {
                query: null,
                fields: [
                    'name',
                    'shapeJson.properties.uNumber',
                    'shapeJson.properties.originalProperties.State',
                    'shapeJson.properties.originalProperties.County',
                    'shapeJson.properties.originalProperties.Survey',
                    'shapeJson.properties.originalProperties.PrincipalMeridian',
                    'shapeJson.properties.originalProperties.Block',
                    'shapeJson.properties.originalProperties.Township',
                    'shapeJson.properties.originalProperties.Section',
                    'shapeJson.properties.originalProperties.Range',
                    'shapeJson.properties.originalProperties.AbstractName',
                    'shapeJson.properties.originalProperties.ShortName',
                    'shapeJson.properties.shapeArea',
                    'shapeJson.properties.uStatus',
                    'shapeJson.properties.uPrimaryOperator',
                    'shapeJson.properties.uUnitPricing',
                    'shapeJson.properties.campaignName',
                    'shapeJson.properties.qualifier.name',
                    'shapeJson.properties.reviewer.name',
                    'tags.tag',
                ],
            },
        },
    },
    Wells: {
        layerName: 'Wells',
        variables: {
            index: 'platformData:wells',
            pagination: {
                first: 10000,
                after: null,
            },
            filters: [],
        },
    },
    Parcels: {
        layerName: 'Parcels',
        allowedTypes: ['Polygon', 'MultiPolygon'],
        variables: {
            index: 'shapes_flat',
            sort: {
                field: '_ts',
                order: 'desc',
            },
            pagination: {
                first: 10000,
                after: null,
            },
            filters: [
                {
                    field: 'layer.keyword',
                    value: 'parcel',
                },
            ],
            search: {
                query: null,
                fields: [
                    'name',
                    'shapeJson.properties.originalProperties.State',
                    'shapeJson.properties.originalProperties.County',
                    'shapeJson.properties.originalProperties.Survey',
                    'shapeJson.properties.originalProperties.PrincipalMeridian',
                    'shapeJson.properties.originalProperties.Block',
                    'shapeJson.properties.originalProperties.Township',
                    'shapeJson.properties.originalProperties.Section',
                    'shapeJson.properties.originalProperties.Range',
                    'shapeJson.properties.originalProperties.AbstractName',
                    'shapeJson.properties.originalProperties.ShortName',
                    'shapeJson.properties.sdGrossAcres',
                    'shapeJson.properties.shapeArea',
                    'shapeJson.properties.department',
                    'tags.tag',
                    'name',
                    'shapeLabel',
                    'state',
                ],
            },
        },
    },
    'Area of Interest': {
        layerName: 'Area of Interest',
        variables: {
            index: 'shapes_flat',
            sort: {
                field: '_ts',
                order: 'desc',
            },
            pagination: {
                first: 10000,
                after: null,
            },
            filters: [
                {
                    field: 'layer.keyword',
                    value: 'interest',
                },
            ],
            search: {
                query: null,
                fields: ['name'],
            },
        },
    },
    Agreements: {
        layerName: 'Agreements',
        allowedTypes: ['Polygon', 'MultiPolygon'],
        variables: {
            index: 'shapes_flat',
            sort: {
                field: '_ts',
                order: 'desc',
            },
            pagination: {
                first: 10000,
                after: null,
            },
            filters: [
                {
                    field: 'shapeJson.properties.type.keyword',
                    value: 'agreement',
                },
            ],
            search: {
                query: null,
                fields: ['name'],
            },
        },
    },
    'My Wells': {
        layerName: 'My Wells',
        geoBoundingField: 'wellData.geoJSON',
        hasText: false,
        variables: {
            index: 'mywells_flat',
            sort: { field: 'lastUpdateAt', order: 'desc' },
            pagination: {
                first: 10000,
                after: null,
            },
            filters: [],
            search: {
                query: null,
                fields: [
                    'wellData.wellName',
                    'wellData.api',
                    'wellData.WellName',
                    'wellData.ApiNumber',
                ],
            },
        },
    },
    'Land Grid': {
        layerName: 'Land Grid',
        abstractZoom: 12,
        pllsZoom: 14,
    },
    Basins: {
        layerName: 'Basins',
    },
};

export const layerFilters = hookstate(copy(layerFilterInitialState));


/* -------------------------------------------------------------------------- */
/*                           Map Controls Controller                          */
/* -------------------------------------------------------------------------- */

export const mapControlsInitialState = {
    fileUploadedContent: null,
    selectedControl: "layer",
    layerAddControl: null,
    selectedMapControl: null,
    openSpeedDial: true,
    anchorEl: null,
    layers: [
        { name: "Basins", value: "basinLayer" },
        { name: "Pipelines", value: "pipelineLayer" },
        { name: "Surveys", value: "surveyLayer" },
    ],
    userData: null,
    heatmaps: null,
    selectedBaseMap: "",
    addLayer: false,
    manageSourceLayer: false,
    manageLayer: false,
    editDraw: false,
    map: null,
    Draw: null,
    mapStyleList: [],
    expandedPanel: true,
    // TODO: Remove conflicting selectedLayer states
    selectedLayerControl: null,
    selectedLayer: null,
    selectedDataset: null,
    layerGridCard: false,

    // From Redux MapGridCard
    mapGridCardActivated: false,
};

export const mapControls = hookstate(copy(mapControlsInitialState));


/* -------------------------------------------------------------------------- */
/*                            Map State Controller                            */
/* -------------------------------------------------------------------------- */

const defaultMapVars = {
    zoom: 4.88,
    center: { lng: -98.8, lat: 38 },
    pitch: 0,
    bearing: 0,
    styleId: 'Outdoors',
    moved: false
};

export const mapStateInitialState = {
    // mapStyles: [],
    mapVars: defaultMapVars,
    defaultMapVars,
};

export const mapState = hookstate(copy(mapStateInitialState));

/* -------------------------------------------------------------------------- */
/*                            Nav State Controller                            */
/* -------------------------------------------------------------------------- */

export const navInitialState = {
    drawingMode: null,
    filterFeatureId: null,
    bulkUploadFromMap: false,
    bulkUploadShape: null,
    /////
    filterBasin: null,
    filterAOI: null,
    filterParcel: null,
    bulkUploadParcel: null,
    bulkUploadFromContacts: false,
    filterDrawing: [],
    selectedModule: ROUTES.MAP.module,
};

export const navState = hookstate(copy(navInitialState));

/* -------------------------------------------------------------------------- */
/*                           Popup State Controller                           */
/* -------------------------------------------------------------------------- */

export const popupInitialState = {
    popupOpen: false,
    expandedCard: false,
    layerSelectionPopup: false,
    selectedUserDefinedLayer: null,
    selectedShape: null,
    selectedParcel: null,
    selectedShapeFile: null,
    selectedWell: null,
    selectedWellId: null,
    wellSelectedCoordinates: null,
    selectedPlaces: null,
    wellDetailCardTabIndex: 0,
    selectedPermit: null,
    selectedPermitId: null,
    parcelDetailCardTabIndex: 0,
    permitSelectedCoordinates: null,
    selectionLayers: [],
    coordinate: null
};

export const popupState = hookstate(copy(popupInitialState));


/* -------------------------------------------------------------------------- */
/*                          Slidout State Controller                          */
/* -------------------------------------------------------------------------- */

export const slidoutInitialState = {
    show: false,
    views: [],
    parentId: '',
    view: {},
    props: {},
    activeTabs: { Grid: false, Map: false },
    title: '',
    formMode: '',
    newEntity: false,
};

export const slidoutState = hookstate(copy(slidoutInitialState));


/* -------------------------------------------------------------------------- */
/*                           Detail Card Controller                           */
/* -------------------------------------------------------------------------- */

export const detailCardInitialState = {
    shrinkRightColumn: false,
    baseTabKey: 0,
    bottomTabKey: 0,
    props: null,
};

export const detailCardState = hookstate(copy(detailCardInitialState));