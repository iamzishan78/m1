import { StateController } from './stateController'; // <-- Import your generic class-based controller

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
	shapeAssetGridCard: false,

	// From Redux MapGridCard
	mapGridCardActivated: false,
};

class MapControlsController extends StateController {
	constructor(initialState) {
		super(initialState, MapControlsController.name);
		this.autoBind(this);
	}

	/**
	 * Toggles the openSpeedDial boolean
	 */
	toggleSpeedDial() {
		const currentValue = this.getValue('openSpeedDial');
		this.updateState({ openSpeedDial: !currentValue });
	}

	/**
	 * Toggles the mapGridCardActivated boolean
	 */
	toggleMapGridCardAtived() {
		const currentValue = this.getValue('mapGridCardActivated');
		this.updateState({ mapGridCardActivated: !currentValue });
	}
}

// Export a singleton instance with the initial state
export const mapControlsController = new MapControlsController(mapControlsInitialState);
