import { TOGGLE_ACTIONS_PANEL, SET_ACTIVE_MODULE } from "../constants/ActionTypes";

export const toggleActionsPanel = (payload) => {
  return {
    type: TOGGLE_ACTIONS_PANEL,
    payload,
  };
};

export const setActiveModule = (payload) => {
  return {
    type: SET_ACTIVE_MODULE,
    payload,
  };
};
