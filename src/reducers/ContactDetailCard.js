import { TOGGLE_RIGHT_COLUMN } from "../constants/ActionTypes";

const INIT_STATE = {
  shrinkRightColumn: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case TOGGLE_RIGHT_COLUMN: {
      return { ...state, shrinkRightColumn: !state.shrinkRightColumn };
    }

    default:
      return state;
  }
};
