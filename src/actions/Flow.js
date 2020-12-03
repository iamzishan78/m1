import { SET_FLOW_STATE } from "../constants/ActionTypes";

export const setFlowState = (payload) => {
  return {
    type: SET_FLOW_STATE,
    payload,
  };
};
