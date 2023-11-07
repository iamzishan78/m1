import { useHookstate } from '@hookstate/core';

const statesHelper = (keys, keysVal, stateValuesKey = 'stateValues') => {
  const retObj = { [stateValuesKey]: {} };
  Object.keys(keysVal).forEach((k, index) => {
    retObj[stateValuesKey][[keys[index]]] = keysVal[k].get({ noproxy: true });
    retObj[[keys[index]]] = keysVal[k];
  });

  return retObj;
};

const hookStates = {
  1: function use1Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  2: function use2Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  3: function use3Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    keysVal[2] = useHookstate(state[keys[2]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  4: function use4Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    keysVal[2] = useHookstate(state[keys[2]]);
    keysVal[3] = useHookstate(state[keys[3]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  5: function use5Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    keysVal[2] = useHookstate(state[keys[2]]);
    keysVal[3] = useHookstate(state[keys[3]]);
    keysVal[4] = useHookstate(state[keys[4]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  6: function use5Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    keysVal[2] = useHookstate(state[keys[2]]);
    keysVal[3] = useHookstate(state[keys[3]]);
    keysVal[4] = useHookstate(state[keys[4]]);
    keysVal[5] = useHookstate(state[keys[5]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  7: function use5Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    keysVal[2] = useHookstate(state[keys[2]]);
    keysVal[3] = useHookstate(state[keys[3]]);
    keysVal[4] = useHookstate(state[keys[4]]);
    keysVal[5] = useHookstate(state[keys[5]]);
    keysVal[6] = useHookstate(state[keys[6]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  8: function use5Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    keysVal[2] = useHookstate(state[keys[2]]);
    keysVal[3] = useHookstate(state[keys[3]]);
    keysVal[4] = useHookstate(state[keys[4]]);
    keysVal[5] = useHookstate(state[keys[5]]);
    keysVal[6] = useHookstate(state[keys[6]]);
    keysVal[7] = useHookstate(state[keys[7]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  9: function use5Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    keysVal[2] = useHookstate(state[keys[2]]);
    keysVal[3] = useHookstate(state[keys[3]]);
    keysVal[4] = useHookstate(state[keys[4]]);
    keysVal[5] = useHookstate(state[keys[5]]);
    keysVal[6] = useHookstate(state[keys[6]]);
    keysVal[7] = useHookstate(state[keys[7]]);
    keysVal[8] = useHookstate(state[keys[8]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  10: function use5Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    keysVal[2] = useHookstate(state[keys[2]]);
    keysVal[3] = useHookstate(state[keys[3]]);
    keysVal[4] = useHookstate(state[keys[4]]);
    keysVal[5] = useHookstate(state[keys[5]]);
    keysVal[6] = useHookstate(state[keys[6]]);
    keysVal[7] = useHookstate(state[keys[7]]);
    keysVal[8] = useHookstate(state[keys[8]]);
    keysVal[9] = useHookstate(state[keys[9]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  11: function use5Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    keysVal[2] = useHookstate(state[keys[2]]);
    keysVal[3] = useHookstate(state[keys[3]]);
    keysVal[4] = useHookstate(state[keys[4]]);
    keysVal[5] = useHookstate(state[keys[5]]);
    keysVal[6] = useHookstate(state[keys[6]]);
    keysVal[7] = useHookstate(state[keys[7]]);
    keysVal[8] = useHookstate(state[keys[8]]);
    keysVal[9] = useHookstate(state[keys[9]]);
    keysVal[10] = useHookstate(state[keys[10]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  12: function use5Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    keysVal[2] = useHookstate(state[keys[2]]);
    keysVal[3] = useHookstate(state[keys[3]]);
    keysVal[4] = useHookstate(state[keys[4]]);
    keysVal[5] = useHookstate(state[keys[5]]);
    keysVal[6] = useHookstate(state[keys[6]]);
    keysVal[7] = useHookstate(state[keys[7]]);
    keysVal[8] = useHookstate(state[keys[8]]);
    keysVal[9] = useHookstate(state[keys[9]]);
    keysVal[10] = useHookstate(state[keys[10]]);
    keysVal[11] = useHookstate(state[keys[11]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  13: function use5Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    keysVal[2] = useHookstate(state[keys[2]]);
    keysVal[3] = useHookstate(state[keys[3]]);
    keysVal[4] = useHookstate(state[keys[4]]);
    keysVal[5] = useHookstate(state[keys[5]]);
    keysVal[6] = useHookstate(state[keys[6]]);
    keysVal[7] = useHookstate(state[keys[7]]);
    keysVal[8] = useHookstate(state[keys[8]]);
    keysVal[9] = useHookstate(state[keys[9]]);
    keysVal[10] = useHookstate(state[keys[10]]);
    keysVal[11] = useHookstate(state[keys[11]]);
    keysVal[12] = useHookstate(state[keys[12]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  14: function use5Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    keysVal[2] = useHookstate(state[keys[2]]);
    keysVal[3] = useHookstate(state[keys[3]]);
    keysVal[4] = useHookstate(state[keys[4]]);
    keysVal[5] = useHookstate(state[keys[5]]);
    keysVal[6] = useHookstate(state[keys[6]]);
    keysVal[7] = useHookstate(state[keys[7]]);
    keysVal[8] = useHookstate(state[keys[8]]);
    keysVal[9] = useHookstate(state[keys[9]]);
    keysVal[10] = useHookstate(state[keys[10]]);
    keysVal[11] = useHookstate(state[keys[11]]);
    keysVal[12] = useHookstate(state[keys[12]]);
    keysVal[13] = useHookstate(state[keys[13]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
  15: function use5Hooks(keys, state, stateValuesKey) {
    const keysVal = {};
    keysVal[0] = useHookstate(state[keys[0]]);
    keysVal[1] = useHookstate(state[keys[1]]);
    keysVal[2] = useHookstate(state[keys[2]]);
    keysVal[3] = useHookstate(state[keys[3]]);
    keysVal[4] = useHookstate(state[keys[4]]);
    keysVal[5] = useHookstate(state[keys[5]]);
    keysVal[6] = useHookstate(state[keys[6]]);
    keysVal[7] = useHookstate(state[keys[7]]);
    keysVal[8] = useHookstate(state[keys[8]]);
    keysVal[9] = useHookstate(state[keys[9]]);
    keysVal[10] = useHookstate(state[keys[10]]);
    keysVal[11] = useHookstate(state[keys[11]]);
    keysVal[12] = useHookstate(state[keys[12]]);
    keysVal[13] = useHookstate(state[keys[13]]);
    keysVal[14] = useHookstate(state[keys[14]]);
    return statesHelper(keys, keysVal, stateValuesKey);
  },
};

export const getHookStates = (keys, state) => hookStates[keys.length](keys, state);

export const hookStateController = (state, initialState) => ({
  setState: newState => state.set({ ...initialState, ...newState }), // This performs a reset and add new state to hookstate
  updateState: partialState => state.merge(partialState), // partially updates the state
  reset: () => state.set({ ...initialState }), // reset whole state back to initial state
  useState: (keys, stateValuesKey) =>
    hookStates[keys.length](keys, state, stateValuesKey), // used by components to get specified keys as hook ( it also return stateValues which include all values)
  useScopeState: state => useHookstate(state), // used by components to get scope state
  useCompleteState: () => useHookstate(state), // used by components to get scope state
  getValue: key => state[key].get({ noproxy: true }), // used by functions or any thing that don't require a re render to get a value from state
  getValues: keys => {
    // used by functions or any thing that don't require a re render to get a values from state
    const keysValue = {};
    keys.forEach(key => {
      keysValue[key] = state[key].get({ noproxy: true });
    });
    return keysValue;
  },
});
