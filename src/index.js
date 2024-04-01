import './wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'components/Common/MRTable/common.css'
import * as serviceWorker from './serviceWorker';
import 'react-toastify/dist/ReactToastify.min.css';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <Auth0Provider
    domain="m1neral.auth0.com"
    clientId="hrYH1OQRciiITzdkiws7aGhyNX1tXb7h"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
