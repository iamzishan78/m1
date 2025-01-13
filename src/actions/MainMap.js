import { SET_MAIN_MAP_STATE, MAP_LAYERS_FILTERS_PANEL_EXPANDED } from '../constants/ActionTypes';

export const setMainMapState = payload => {
	return {
		type: SET_MAIN_MAP_STATE,
		payload,
	};
};

export const toggleLayersFiltersPanel = state => ({
	type: MAP_LAYERS_FILTERS_PANEL_EXPANDED,
	payload: state,
});
