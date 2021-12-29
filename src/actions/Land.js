import { TOGGLE_QUICK_ACTIONS_PANEL, SET_ACTIVE_MODULE_LAND } from "constants/ActionTypes";

export const toggleLandActionsPanel = (state) => ({
  type: TOGGLE_QUICK_ACTIONS_PANEL,
  payload: state,
});

export const setActiveModuleLand = (payload) => {
  return {
    type: SET_ACTIVE_MODULE_LAND,
    payload,
  };
};