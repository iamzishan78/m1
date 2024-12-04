import {
	CURRENT_USER_GRID_VIEW_SETTINGS,
	SET_CURRENT_USER_GRID_VIEW,
	UPDATE_USER_GRID_VIEW_SETTING,
	SET_USER_GRID_VIEW_FILTERS,
} from 'store/type';

const INIT_STATE = {
	isLoaded: null,
	userId: null,
	userGridViewSettings: {},
};

const sessionReducer = (state = INIT_STATE, action) => {
	switch (action.type) {
		case CURRENT_USER_GRID_VIEW_SETTINGS.FULLFILLED: {
			return { ...state, ...action.payload, isLoaded: true };
		}
		case SET_CURRENT_USER_GRID_VIEW.FULLFILLED: {
			return {
				...state,
				userGridViewSettings: {
					...state.userGridViewSettings,
					...action.payload,
				},
			};
		}
		case UPDATE_USER_GRID_VIEW_SETTING.FULLFILLED: {
			return {
				...state,
				userGridViewSettings: {
					...state.userGridViewSettings,
					...action.payload,
				},
			};
		}
		case SET_USER_GRID_VIEW_FILTERS: {
			return {
				...state,
				userGridViewSettings: {
					...state.userGridViewSettings,
					filters: action.payload,
				},
			};
		}

		default:
			return state;
	}
};

export default sessionReducer;
