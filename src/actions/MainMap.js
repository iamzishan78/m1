import { SET_MAIN_MAP_STATE } from "../constants/ActionTypes";

export const setMainMapState = (payload) => {
  return {
    type: SET_MAIN_MAP_STATE,
    payload,
  };
};
