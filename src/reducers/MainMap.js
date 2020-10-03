import { SET_MAIN_MAP_STATE } from "../constants/ActionTypes";

const INIT_STATE = {
  removeLayerFromMap: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_MAIN_MAP_STATE: {
      return { ...state, ...(action.payload ? action.payload : {}) };
    }

    default:
      return state;
  }
};
