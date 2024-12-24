import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import app from 'store/reducers/appReducer';
import common from 'store/reducers/commonReducer';
import contact from 'store/reducers/contactReducer';
import entity from 'store/reducers/entityReducer';
import owner from 'store/reducers/ownerReducer';
import session from 'store/reducers/sessionReducer';

import AddParcelInterest from './AddParcelInterest';
import ContactDetailCard from './ContactDetailCard';
import Flow from './Flow';
import Land from './Land';
import MainMap from './MainMap';
import Notifications from './Notifications';
import pin from './PinToTop';
import Revenue from './Revenue';

const createRootReducer = history =>
	combineReducers({
		router: connectRouter(history),
		Notifications,
		ContactDetailCard,
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
		pin,
	});

export default createRootReducer;
