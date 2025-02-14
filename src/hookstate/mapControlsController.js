import { StateController } from './stateController'; // <-- Import your generic class-based controller

const mapControlsInitialState = {
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
	manageTransferData: false,
	// TODO: Remove conflicting selectedLayer states
	selectedLayerControl: null,
	selectedLayer: null,
	selectedDataset: null,
	layerGridCard: false,

	// From Redux MapGridCard
	mapGridCardActivated: false,
};
// Example class-based controller
class MapControlsController extends StateController {
	constructor(initialState) {
		super(initialState, MapControlsController.name);
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
