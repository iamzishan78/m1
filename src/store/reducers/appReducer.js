import { SET_USER } from "store/type";

const INIT_STATE = {
  user: {}
};

const appReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_USER: {
      return { ...state, user: action.payload };
    }

    default:
      return state;
  }
};

export default appReducer;
