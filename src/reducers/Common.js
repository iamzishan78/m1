import { FETCH_ERROR, HIDE_MESSAGE, SHOW_MESSAGE } from "../constants/ActionTypes";

const INIT_STATE = {
  error: "",
  loading: false,
  message: "",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SHOW_MESSAGE: {
      return { ...state, error: "", message: action.payload, loading: false };
    }
    case FETCH_ERROR: {
      return { ...state, loading: false, error: action.payload, message: "" };
    }
    case HIDE_MESSAGE: {
      return { ...state, loading: false, error: "", message: "" };
    }
    default:
      return state;
  }
};
