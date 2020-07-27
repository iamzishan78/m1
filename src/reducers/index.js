import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Notifications from "./Notifications";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    notifications: Notifications,
    //// .....
  });

export default createRootReducer;
