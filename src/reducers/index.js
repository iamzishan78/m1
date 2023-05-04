import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Notifications from "./Notifications";
import ContactDetailCard from "./ContactDetailCard";
import MapGridCard from "./MapGridCard";
import AddParcelInterest from "./AddParcelInterest";
import MainMap from "./MainMap";
import Flow from "./Flow";
import Land from "./Land";
import Revenue from "./Revenue";
import owner from 'store/reducers/ownerReducer';
import contact from 'store/reducers/contactReducer';
import common from 'store/reducers/commonReducer';
import app from 'store/reducers/appReducer';
import entity from 'store/reducers/entityReducer';
import session from 'store/reducers/sessionReducer';
import pin from './PinToTop';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    Notifications,
    ContactDetailCard,
    MapGridCard,
    AddParcelInterest,
    MainMap,
    Flow,
    Land,
    Revenue,
    owner,
    contact,
    common,
    entity,
    app,
    session,
    pin
    
  });

export default createRootReducer;
