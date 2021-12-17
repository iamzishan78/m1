import { GET_SHAPE_OWNERS_AND_COUNT } from "store/type";

const INIT_STATE = {
  shapeOwners: [],
  shapeCount: 0
};

const ownerReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SHAPE_OWNERS_AND_COUNT.FULLFILLED: {
      return { ...state, shapeOwners: action.payload.shapeOwners, shapeCount: action.payload.shapeCount };
    }

    default:
      return state;
  }
};

export default ownerReducer;
