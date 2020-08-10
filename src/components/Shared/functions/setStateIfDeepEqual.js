import { deepEqual } from "./deepEqual";

export const setStateIfDeepEqual = (setState, newState) => {
  setState((state) => {
    if (!deepEqual(state, newState)) return newState;
    return state;
  });
};
