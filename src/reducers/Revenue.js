import { SET_ACTIVE_MODULE, TOGGLE_ACTIONS_PANEL, SET_REVENUE_KEY } from "../constants/ActionTypes";

const INIT_STATE = {
  activeModule: {},
  actionsPanelState: true,
};

export default function Revenue(state = INIT_STATE, action) {
  switch (action.type) {
    case SET_ACTIVE_MODULE: {
      return { ...state, activeModule: action.payload };
    }
    case TOGGLE_ACTIONS_PANEL: {
      return { ...state, actionsPanelState: action.payload };
    }
    case SET_REVENUE_KEY: {
      return { ...state, [action.payload.key]: action.payload.value };
    }
    default:
      return state;
  }
}
