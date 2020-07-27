import {
  FETCH_ERROR,
  HIDE_MESSAGE,
  SHOW_MESSAGE,
} from "../constants/ActionTypes";

export const fetchError = (error) => {
  return {
    type: FETCH_ERROR,
    payload: error,
  };
};

export const showMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message,
  };
};

export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE,
  };
};
