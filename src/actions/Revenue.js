import { TOGGLE_ACTIONS_PANEL, SET_ACTIVE_MODULE, SET_REVENUE_KEY, SET_REVENUE_PROPERTIES_DATA } from "../constants/ActionTypes";

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

export const setRevenueKey = (key, value) => ({
  type: SET_REVENUE_KEY,
  payload: { key, value },
});
// for revenue Property Table Data
export const setRevenuePropertyData = (payload) => ({
  type: SET_REVENUE_PROPERTIES_DATA,
  payload,
});
