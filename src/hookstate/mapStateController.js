import { StateController } from './stateController';

const defaultMapVars = {
	zoom: 4.88,
	center: { lng: -98.8, lat: 38 },
	pitch: 0,
	bearing: 0,
	styleId: 'Outdoors',
	moved: false,
};

export const mapStateInitialState = {
	mapVars: defaultMapVars,
	defaultMapVars,
	isDefaultViewAllowed: true,
	isMapRefreshing: false,
	toggleZoomOut: null,
	toggle3d: null,
	reintializeMap: false,
};

class MapStateController extends StateController {
	constructor(initialState) {
		super(initialState, MapStateController.name);
	}

	moved() {
		this.updateState({ moved: !this.getValue('moved') });
	}
}

export const mapStateController = new MapStateController(mapStateInitialState);
