import { hookstate } from '@hookstate/core';

import { ROUTES } from 'components/Shared/FeatureFlag/common';
import { copy } from 'components/Shared/functions';

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
	isIncludeInactive: false,
	gridView: {},
	showTypes: false,
	editedData: {},
	validationErrors: {},
	isCreateMode: false,
};
export const tableESState = {};
export const tableGlobalState = hookstate({
	refetch: false,
	refetchAdditionalQueries: false,
	reInitialized: false,
	tabKey: 0,
});

/* -------------------------------------------------------------------------- */
/*                           Layer State Controller                           */
/* -------------------------------------------------------------------------- */

export const layerStateInitialState = {
	projectedLayers: [],
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
/*                           Map Controls Controller                          */
/* -------------------------------------------------------------------------- */

export const mapControlsInitialState = {
	searchValue: '',
	fileUploadedContent: null,
	fileUploaded: null,
	selectedControl: 'layer',
	layerAddControl: null,
	selectedMapControl: null,
	openSpeedDial: true,
	anchorEl: null,
	layers: [
		{ name: 'Basins', value: 'basinLayer' },
		{ name: 'Pipelines', value: 'pipelineLayer' },
		{ name: 'Surveys', value: 'surveyLayer' },
	],
	userData: null,
	heatmaps: null,
	selectedBaseMap: '',
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
	moved: false,
};

export const mapStateInitialState = {
	// mapStyles: [],
	mapVars: defaultMapVars,
	defaultMapVars,
	isDefaultViewAllowed: true,
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
	coordinate: null,
};

export const popupState = hookstate(copy(popupInitialState));