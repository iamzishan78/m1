import {
	CURRENT_USER_GRID_VIEW_SETTINGS,
	SET_CURRENT_USER_GRID_VIEW,
	UPDATE_USER_GRID_VIEW_SETTING,
	SET_USER_GRID_VIEW_FILTERS,
} from 'store/type';

export const currentUserGridViewSettingsAction = {
	STARTED: payload => ({ type: CURRENT_USER_GRID_VIEW_SETTINGS.STARTED, payload }),
	FULLFILLED: payload => ({
		type: CURRENT_USER_GRID_VIEW_SETTINGS.FULLFILLED,
		payload,
	}),
	REJECTED: () => ({ type: CURRENT_USER_GRID_VIEW_SETTINGS.REJECTED }),
};

export const setCurrentUserGridViewAction = {
	STARTED: payload => ({ type: SET_CURRENT_USER_GRID_VIEW.STARTED, payload }),
	FULLFILLED: payload => ({
		type: SET_CURRENT_USER_GRID_VIEW.FULLFILLED,
		payload,
	}),
	REJECTED: () => ({ type: SET_CURRENT_USER_GRID_VIEW.REJECTED }),
};

export const updateUserGridViewSettingAction = {
	STARTED: payload => ({ type: UPDATE_USER_GRID_VIEW_SETTING.STARTED, payload }),
	FULLFILLED: payload => ({
		type: UPDATE_USER_GRID_VIEW_SETTING.FULLFILLED,
		payload,
	}),
	REJECTED: () => ({ type: UPDATE_USER_GRID_VIEW_SETTING.REJECTED }),
};

export const updateUserGridViewFiltersAction = payload => ({
	type: SET_USER_GRID_VIEW_FILTERS,
	payload,
});
