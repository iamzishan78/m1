import {
  SHOW_INFO_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
  SHOW_wARNING_MESSAGE,
  SHOW_ERROR_MESSAGE,
  HIDE_INFO_MESSAGE,
  HIDE_SUCCESS_MESSAGE,
  HIDE_wARNING_MESSAGE,
  HIDE_ERROR_MESSAGE,
} from "../constants/ActionTypes";

const INIT_STATE = {
  infoMessage: "",
  successMessage: "",
  warningMessage: "",
  errorMessage: "",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SHOW_INFO_MESSAGE: {
      return { ...state, infoMessage: action.payload };
    }
    case SHOW_SUCCESS_MESSAGE: {
      return { ...state, successMessage: action.payload };
    }
    case SHOW_wARNING_MESSAGE: {
      return { ...state, warningMessage: action.payload };
    }
    case SHOW_ERROR_MESSAGE: {
      return { ...state, errorMessage: action.payload };
    }

    case HIDE_INFO_MESSAGE: {
      return { ...state, infoMessage: "" };
    }
    case HIDE_SUCCESS_MESSAGE: {
      return { ...state, successMessage: "" };
    }
    case HIDE_wARNING_MESSAGE: {
      return { ...state, warningMessage: "" };
    }
    case HIDE_ERROR_MESSAGE: {
      return { ...state, errorMessage: "" };
    }
    default:
      return state;
  }
};
