import { TOGGLE_BULK_UPLOAD, TOGGLE_QUICK_ACTIONS_PANEL, SET_ACTIVE_MODULE, SET_REDUX_KEY } from 'store/type';

const INIT_STATE = {
	bulkUpload: false,
	quickActionsPanelState: true,
	activeModule: {},
};

const commonReducer = (state = INIT_STATE, action) => {
	switch (action.type) {
		case TOGGLE_BULK_UPLOAD: {
			return { ...state, bulkUpload: action.payload };
		}
		case TOGGLE_QUICK_ACTIONS_PANEL:
			return { ...state, quickActionsPanelState: action.payload };
		case SET_ACTIVE_MODULE:
			return { ...state, activeModule: action.payload };
		case SET_REDUX_KEY:
			return {
				...state,
				[action.payload.key]: action.payload.value,
			};
		default:
			return state;
	}
};

export default commonReducer;
