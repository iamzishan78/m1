import {
  TOGGLE_RIGHT_COLUMN,
  SET_CONTACT_DETAIL_CARD_STATE,
} from "../constants/ActionTypes";

const INIT_STATE = {
  shrinkRightColumn: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case TOGGLE_RIGHT_COLUMN: {
      return { ...state, shrinkRightColumn: !state.shrinkRightColumn };
    }
    case SET_CONTACT_DETAIL_CARD_STATE: {
      return { ...state, ...(action.payload ? action.payload : {}) };
    }

    default:
      return state;
  }
};
