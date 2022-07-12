import { SET_USER, SET_FREEZE_LOCATION } from "store/type";

const INIT_STATE = {
  user: {},
  freezNavigationOn: null // This is used for freezing navigation. When set on any path router will not change from that path
};

const appReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_USER: {
      return { ...state, user: action.payload };
    }

    case SET_FREEZE_LOCATION: {
      return { ...state, freezNavigationOn: action.payload };
    }

    default:
      return state;
  }
};

export default appReducer;
