import {
  TOGGLE_MAP_GRID_ACTIVATED,
  SET_MAP_GRID_CARD_STATE,
} from "../constants/ActionTypes";

const INIT_STATE = {
  mapGridCardActivated: false,
  mapGridCardActiveTap: 0,
  searchResultData: [], //// mapGridCard Search Data
  searchloading: false, //// mapGridCard Search loading
  searchInputValue: "",
  viewportData: [], //// mapGridCard Viewport Data
  trackedDataCount: 0, //// mapGridCard Viewport tracked count
  objToPopulateSearchLayer: null, //// mapGridCard Viewport tracked count
  selectedOwner: null,
  selectedOwnerWellIntsSummary: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_MAP_GRID_CARD_STATE: {
      return { ...state, ...(action.payload ? action.payload : {}) };
    }
    case TOGGLE_MAP_GRID_ACTIVATED: {
      return {
        ...state,
        mapGridCardActivated: !state.mapGridCardActivated,
        selectedOwner: null,
        selectedOwnerWellIntsSummary: null,
      };
    }

    default:
      return state;
  }
};
