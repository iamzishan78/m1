import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Common from "./Common";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    common: Common,
    //// .....
  });

export default createRootReducer;
