import { TOGGLE_BULK_UPLOAD } from "store/type";

const INIT_STATE = {
  bulkUpload: false
};

const commonReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case TOGGLE_BULK_UPLOAD: {
      return { ...state, bulkUpload: action.payload };
    }

    default:
      return state;
  }
};

export default commonReducer;
