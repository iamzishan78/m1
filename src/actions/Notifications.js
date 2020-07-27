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

export const showInfoMessage = (message) => {
  return {
    type: SHOW_INFO_MESSAGE,
    payload: message,
  };
};
export const showSuccessMessage = (message) => {
  return {
    type: SHOW_SUCCESS_MESSAGE,
    payload: message,
  };
};
export const showWarningMessage = (message) => {
  return {
    type: SHOW_wARNING_MESSAGE,
    payload: message,
  };
};
export const showErrorMessage = (message) => {
  return {
    type: SHOW_ERROR_MESSAGE,
    payload: message,
  };
};

export const hideInfoMessage = () => {
  return {
    type: HIDE_INFO_MESSAGE,
  };
};
export const hideSuccessMessage = () => {
  return {
    type: HIDE_SUCCESS_MESSAGE,
  };
};
export const hideWarningMessage = () => {
  return {
    type: HIDE_wARNING_MESSAGE,
  };
};
export const hideErrorMessage = () => {
  return {
    type: HIDE_ERROR_MESSAGE,
  };
};
