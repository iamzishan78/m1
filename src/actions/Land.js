import { TOGGLE_QUICK_ACTIONS_PANEL } from "constants/ActionTypes";

export const toggleLandActionsPanel = (state) => ({
  type: TOGGLE_QUICK_ACTIONS_PANEL,
  payload: state,
});
