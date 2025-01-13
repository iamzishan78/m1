import { SET_MAIN_MAP_STATE, MAP_LAYERS_FILTERS_PANEL_EXPANDED } from '../constants/ActionTypes';

const INIT_STATE = {
	removeLayerFromMap: null,
	basinLayerColor: null,
	GLOUnitsColor: null,
	GLOLeasesColor: null,
	clustersOff: false,
	mapLayersPanelExtended: false,
};

export default function MainMap(state = INIT_STATE, action) {
	switch (action.type) {
		case SET_MAIN_MAP_STATE: {
			return { ...state, ...(action.payload ? action.payload : {}) };
		}
		case MAP_LAYERS_FILTERS_PANEL_EXPANDED: {
			return { ...state, mapLayersPanelExtended: action.payload };
		}
		default:
			return state;
	}
}
