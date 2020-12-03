import { SET_FLOW_STATE } from "../constants/ActionTypes";

const INIT_STATE = {
  selectedPipe: null,
  openPipeDialog: false,
  pipeToShow: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_FLOW_STATE: {
      return { ...state, ...(action.payload ? action.payload : {}) };
    }

    default:
      return state;
  }
};
