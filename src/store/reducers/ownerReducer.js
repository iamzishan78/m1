import { GET_SHAPE_OWNERS_AND_COUNT, GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT } from "store/type";

const INIT_STATE = {
  shapeOwners: [],
  shapeCount: 0,
  fetching: false,
};

const ownerReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SHAPE_OWNERS_AND_COUNT.STARTED: {
      return { ...state, shapeOwners: [], fetching: true };
    }
    case GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT.STARTED: {
      return { ...state, shapeOwners: [], fetching: true };
    }
    case GET_SHAPE_OWNERS_AND_COUNT.FULLFILLED: {
      return { ...state, shapeOwners: action.payload.shapeOwners, shapeCount: action.payload.shapeCount, fetching: false  };
    }
    case GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT.FULLFILLED: {
      return { ...state, shapeOwners: action.payload.shapeOwners, shapeCount: action.payload.shapeCount, fetching: false  };
    }

    default:
      return state;
  }
};

export default ownerReducer;
