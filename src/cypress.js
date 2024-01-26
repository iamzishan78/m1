import './wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from "./components/Login/Login";
import 'components/Common/MRTable/common.css'
import * as serviceWorker from './serviceWorker';
import 'react-toastify/dist/ReactToastify.min.css';
import Providers from 'Providers';
import { ConnectedRouter } from 'connected-react-router';
import { history } from 'store';

ReactDOM.render(<Providers> <ConnectedRouter history={history}> <Login history={history} /></ConnectedRouter></Providers>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
