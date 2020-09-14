import { SET_ADD_PARCEL_INTEREST_STATE } from "../constants/ActionTypes";

const INIT_STATE = {
  name: null,
  county: null,
  state: null,
  Grid1: null,
  Grid2: null,
  Grid3: null,
  Grid4: null,
  Grid5: null,
  qtrQtr: null,
  grossAcres: null,
  calcAcres: null,
  legalDescription: null,

  entity: "Unknown",
  type: "Unknown",
  depthFrom: null,
  depthTo: null,
  interest: null,
  nma: null,
  nra: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_ADD_PARCEL_INTEREST_STATE: {
      return { ...state, ...(action.payload ? action.payload : {}) };
    }

    default:
      return state;
  }
};
