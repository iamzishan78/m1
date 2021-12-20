import { GET_SHAPE_OWNERS_AND_COUNT, GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT } from 'store/type';

export const getShapeOwnersAndCountAction = {
    STARTED: (payload) => ({ type: GET_SHAPE_OWNERS_AND_COUNT.STARTED, payload }),
    FULLFILLED: (payload) => ({ type: GET_SHAPE_OWNERS_AND_COUNT.FULLFILLED, payload }),
    REJECTED: () => ({ type: GET_SHAPE_OWNERS_AND_COUNT.REJECTED })
  };
  
  export const getMapFilterShapeOwnersAndCountAction = {
    STARTED: (payload) => ({ type: GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT.STARTED, payload }),
    FULLFILLED: (payload) => ({ type: GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT.FULLFILLED, payload }),
    REJECTED: () => ({ type: GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT.REJECTED }),
  };
  