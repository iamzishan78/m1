import {
  SET_MAP_GRID_CARD_STATE,
  TOGGLE_MAP_GRID_ACTIVATED,
} from "../constants/ActionTypes";

export const toggleMapGridCardAtived = () => {
  return {
    type: TOGGLE_MAP_GRID_ACTIVATED,
  };
};

export const setMapGridCardState = (payload) => {
  return {
    type: SET_MAP_GRID_CARD_STATE,
    payload,
  };
};
