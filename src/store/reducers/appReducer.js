import { SET_USER, SET_WORKSPACE_SETTINGS } from 'store/type';

const INIT_STATE = {
	user: {},
	workspaceSettings: {},
};

const appReducer = (state = INIT_STATE, action) => {
	switch (action.type) {
		case SET_USER: {
			return { ...state, user: action.payload };
		}
		case SET_WORKSPACE_SETTINGS:
			return { ...state, workspaceSettings: action.payload };
		default:
			return state;
	}
};

export default appReducer;
