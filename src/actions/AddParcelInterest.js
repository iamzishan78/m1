import { SET_ADD_PARCEL_INTEREST_STATE } from "../constants/ActionTypes";

export const setAddParcelInterestState = (payload) => {
  return {
    type: SET_ADD_PARCEL_INTEREST_STATE,
    payload,
  };
};
