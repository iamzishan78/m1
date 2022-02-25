import {
  CURRENT_USER_GRID_VIEW_SETTINGS,
  SET_CURRENT_USER_GRID_VIEW
} from "store/type";
import { currentUserGridViewSettingsAction } from "store/actions/sessionActions"

const INIT_STATE = {
  userId: null,
  userGridViewSettings: {}
};

const sessionReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CURRENT_USER_GRID_VIEW_SETTINGS.FULLFILLED: {
      return { ...state, ...action.payload };
    }
    case SET_CURRENT_USER_GRID_VIEW.FULLFILLED: {
      return state;
    }

    default:
      return state;
  }
};

export default sessionReducer;
