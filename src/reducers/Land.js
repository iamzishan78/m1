import { TOGGLE_QUICK_ACTIONS_PANEL, SET_ACTIVE_MODULE_LAND } from "constants/ActionTypes";

const INIT_STATE = {
  quickActionsPanelState: true,
  activeModule: {},
};

export default function LandReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case TOGGLE_QUICK_ACTIONS_PANEL:
      return { ...state, quickActionsPanelState: action.payload };
    case SET_ACTIVE_MODULE_LAND:
      return { ...state, activeModule: action.payload };
    default:
      return state;
  }
}
