import {
  TOGGLE_RIGHT_COLUMN,
  SET_CONTACT_DETAIL_CARD_STATE,
} from "../constants/ActionTypes";

export const toggleRightColumn = () => {
  return {
    type: TOGGLE_RIGHT_COLUMN,
  };
};

export const setContactDetailCardState = (payload) => {
  return {
    type: SET_CONTACT_DETAIL_CARD_STATE,
    payload,
  };
};
