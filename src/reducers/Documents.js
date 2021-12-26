import { SET_DOCUMENT_ID_AS_DESCRIPTOR, } from "../constants/ActionTypes";

const INIT_STATE = {
  descriptorId: ''
};

export default function DocumentsReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case SET_DOCUMENT_ID_AS_DESCRIPTOR: {
      return { ...state, descriptorId: action.payload };
    }

    default:
      return state;
  }
}
