import { GET_CONTACT_CAMPAIGN, TOGGLE_CONTACT_ACTIONS_PANEL, SET_ACTIVE_MODULE_CONTACT } from 'store/type';

const INIT_STATE = {
	campaignList: [],
	activeModule: {},
	quickActionsPanelState: true,
};

const contactReducer = (state = INIT_STATE, action) => {
	switch (action.type) {
		case GET_CONTACT_CAMPAIGN.FULLFILLED:
			return { ...state, campaignList: action.payload };
		case TOGGLE_CONTACT_ACTIONS_PANEL:
			return { ...state, quickActionsPanelState: action.payload };
		case SET_ACTIVE_MODULE_CONTACT:
			return { ...state, activeModule: action.payload };
		default:
			return state;
	}
};

export default contactReducer;
