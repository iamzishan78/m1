import React from 'react';
import ReactDOM from 'react-dom';

import { Auth0Provider } from '@auth0/auth0-react';

import { JotaiProvider } from 'JotaiProvider';

import './index.css';
import App from './App';
import 'components/MRTTable/Common/common.css';
import * as serviceWorker from './serviceWorker';

import 'react-toastify/dist/ReactToastify.min.css';

ReactDOM.render(
	<JotaiProvider>
		<Auth0Provider
			domain={process.env.REACT_APP_AUTH0_DOMAIN}
			clientId={process.env.REACT_APP_AUTH0_ID}
			authorizationParams={{
				redirect_uri: window.location.origin,
			}}
		>
			<App />
		</Auth0Provider>
	</JotaiProvider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
