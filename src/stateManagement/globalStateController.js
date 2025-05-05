import { StateController } from './stateController'; // Import your StateController class

export const globalInitialState = {
	panelItems: [],
	emptyGroups: [],
	globalSearch: '',
	universalLoader: false,
	layerLoading: {},
	user: null,
	reFetchedLayer: null /* ? */,
	mapReady: false,
	showFieldModal: false,
	apolloClientEndpoint: null,
	x_zumo_auth: null,
	cypress: null,
	testCase: null,
	tenant: null,
	selectedIconTpe: 'Chip',
	onMapLoad: null,
	editIconState: {},
	activeStatement: {},
};

class GlobalStateController extends StateController {
	constructor(initialState) {
		super(initialState, GlobalStateController.name);
		this.autoBind(this);
	}

	setLayerLoading(type, value) {
		const currentLayerLoading = this.getValue('layerLoading');
		if (value !== currentLayerLoading[type]) {
			this.updateState({
				layerLoading: {
					...currentLayerLoading,
					[type]: value,
				},
			});
		}
	}

	handleMyWellTestCase(globalWellId, mongoWellId) {
		if (this.getValue('cypress')) {
			this.updateState({
				testCase: {
					name: 'MyWellsNameUpdate',
					globalWellId,
					mongoWellId,
				},
			});
		}
	}
}

export const globalStateController = new GlobalStateController(globalInitialState);
