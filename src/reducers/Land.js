import { TOGGLE_QUICK_ACTIONS_PANEL } from "constants/ActionTypes";

const INIT_STATE = {
  quickActionsPanelState: true,
};

export default function LandReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case TOGGLE_QUICK_ACTIONS_PANEL:
      return { ...state, quickActionsPanelState: action.payload };
    default:
      return state;
  }
}
