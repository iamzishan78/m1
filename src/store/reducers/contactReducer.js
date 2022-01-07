import { GET_CONTACT_CAMPAIGN } from "store/type";

const INIT_STATE = {
  campaignList: []
};

const contactReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CONTACT_CAMPAIGN.FULLFILLED: {
      return { ...state, campaignList: action.payload };
    }

    default:
      return state;
  }
};

export default contactReducer;
