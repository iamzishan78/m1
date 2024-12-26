import { GET_CONTACT_CAMPAIGN, TOGGLE_CONTACT_ACTIONS_PANEL } from 'store/type';

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
		default:
			return state;
	}
};

export default contactReducer;
