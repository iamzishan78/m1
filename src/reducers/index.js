import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Notifications from "./Notifications";
import ContactDetailCard from "./ContactDetailCard";
import MapGridCard from "./MapGridCard";
import AddParcelInterest from "./AddParcelInterest";
import MainMap from "./MainMap";
import Flow from "./Flow";
import owner from 'store/reducers/ownerReducer';
import contact from 'store/reducers/contactReducer';
import common from 'store/reducers/commonReducer';
import app from 'store/reducers/appReducer';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    Notifications,
    ContactDetailCard,
    MapGridCard,
    AddParcelInterest,
    MainMap,
    Flow,
    owner,
    contact,
    common,
    app
  });

export default createRootReducer;
