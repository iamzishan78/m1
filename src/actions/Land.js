import { TOGGLE_QUICK_ACTIONS_PANEL, SET_ACTIVE_MODULE_LAND, SET_LAND_REDUX_KEY } from "constants/ActionTypes";

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

export const setLandReduxKey = (key, value) => ({
  type: SET_LAND_REDUX_KEY,
  payload: { key, value }
})