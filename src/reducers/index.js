import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Notifications from "./Notifications";
import ContactDetailCard from "./ContactDetailCard";
import MapGridCard from "./MapGridCard";
import AddParcelInterest from "./AddParcelInterest";
import MainMap from "./MainMap";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    Notifications,
    ContactDetailCard,
    MapGridCard,
    AddParcelInterest,
    MainMap,
    //// .....
  });

export default createRootReducer;
