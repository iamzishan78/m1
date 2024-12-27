import React, { useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

import { CircularProgress } from '@material-ui/core';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import MomentUtils from '@date-io/moment';
import { split } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { HttpLink } from 'apollo-link-http';
import PropTypes from 'prop-types';

import { globalStateController } from 'hookstate/globalStateController';

import { getSession } from 'utils/user';

import { AppProvider, setApolloHeaders } from './AppContext';
import ContactBulkProgress from './components/BulkUpload/ContactBulkProgress';
import Notifications from './components/Notifications/Notifications';
import GlobalApolloClientProvider from './GlobalApolloClientProvider';
import { relayStylePagination } from './graphQL/apolloPaginationSchemes.js';
import configureStore from './store';

// user management
const store = configureStore(/ provide initial state if any /);
//app theme overrides to the default material-ui theme found here https://material-ui.com/customization/default-theme/#explore
const theme = createTheme({
	palette: {
		type: 'light',
		common: { black: '#000', white: '#fff' },
		background: { paper: '#fff', default: '#fff' },
		primary: {
			light: 'rgba(75, 97, 143, 1)',
			main: 'rgba(1, 17, 51, 1)',
			dark: 'rgba(38, 52, 81, 1)',
			contrastText: 'rgba(255, 255, 255, 1)',
		},
		secondary: {
			light: 'rgba(75, 97, 143, 1)',
			main: 'rgba(23, 170, 221, 1)',
			dark: 'rgba(38, 52, 81, 1)',
			contrastText: '#fff',
		},
		error: {
			light: '#e57373',
			main: '#f44336',
			dark: '#d32f2f',
			contrastText: 'rgba(255, 255, 255, 1)',
		},
		text: {
			primary: 'rgba(0, 0, 0, 0.87)',
			secondary: 'rgba(0, 0, 0, 0.54)',
			disabled: 'rgba(0, 0, 0, 0.38)',
			hint: 'rgba(0, 0, 0, 0.38)',
		},
		action: {
			active: 'rgba(0, 0, 0, 0.54)',
			hover: 'rgba(0, 0, 0, 0.08)',
			hoverOpacity: 0.08,
			selected: 'rgba(0, 0, 0, 0.14)',
			disabled: 'rgba(0, 0, 0, 0.26)',
			disabledBackground: 'rgba(0, 0, 0, 0.12)',
		},
	},
	typography: {
		fontFamily: 'Poppins',
	},
	overrides: {
		MuiCssBaseline: {
			'@global': {
				'*::-webkit-scrollbar': {
					height: '0.4em',
					width: '0.4em',
				},
				'*:hover::-webkit-scrollbar': {
					height: '0.8em',
					width: '0.6em',
				},
				'*::-webkit-scrollbar-track': {
					'-webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
				},
				'*::-webkit-scrollbar-thumb': {
					backgroundColor: '#929292',
					borderRadius: 5,
				},
			},
		},
	},
});

function Providers({ children }) {
	const [apolloClient, setApolloClient] = useState(null);
	useEffect(() => {
		// eslint-disable-next-line no-new
		new GlobalApolloClientProvider(apolloClient);
	}, [apolloClient]);

	const { stateValues } = globalStateController.useState(['apolloClientEndpoint', 'user', 'cypress']);

	const updateApolloClient = (endpoint, token, idToken) => {
		const session = getSession();

		if (globalStateController.getValue('bypassLogin') && session && !token) {
			idToken = session.accessToken;
			token = session.accessToken;
		}

		let fetchOptions = { headers: [] };
		if (token) {
			fetchOptions.headers['X-ZUMO-AUTH'] = token;
		}
		if (idToken) {
			fetchOptions.headers['X-MS-TOKEN-AAD-ID-TOKEN'] = idToken;
		}
		const cypress = globalStateController.getValue('cypress');
		if (cypress) {
			fetchOptions.headers['CYPRESS'] = 'true';
			fetchOptions.headers['SPEC'] = cypress.spec || '';
		}
		if (apolloClient && token) {
			fetchOptions = setApolloHeaders(apolloClient.link.options, token, idToken);
			fetchOptions.headers.batch = 'true';
		}

		if (!apolloClient) {
			const httpLink = new HttpLink({ uri: endpoint, headers: {}, ...fetchOptions });
			const httpBatchLink = new BatchHttpLink({
				uri: endpoint,
				...fetchOptions,
			});

			let client = new ApolloClient({
				link: split(operation => operation.getContext().batch !== true, httpLink, httpBatchLink),
				cache: new InMemoryCache({
					typePolicies: {
						Query: {
							fields: {
								paginatedContacts: relayStylePagination(),
							},
						},
					},
				}),
				defaultOptions: {
					watchQuery: {
						fetchPolicy: 'cache-and-network',
					},
				},
			});

			setApolloClient(() => {
				return client;
			});
		}

		if (apolloClient && endpoint) {
			setApolloClient(state => {
				const httpLink = new HttpLink({ uri: endpoint, headers: {}, ...fetchOptions });
				const httpBatchLink = new BatchHttpLink({
					uri: endpoint,
					...fetchOptions,
				});

				return new ApolloClient({
					link: split(operation => operation.getContext().batch !== true, httpLink, httpBatchLink),
					cache: state.cache,
					defaultOptions: state.defaultOptions,
				});
			});
		}
	};

	useEffect(() => {
		if (stateValues.apolloClientEndpoint) {
			const authToken = globalStateController.getValue('x_zumo_auth') || stateValues?.user?.authToken;
			const accessToken = globalStateController.getValue('access_token') || stateValues?.user?.accessToken;
			updateApolloClient(stateValues.apolloClientEndpoint, authToken, accessToken);
		} else {
			updateApolloClient();
		}
	}, [stateValues.apolloClientEndpoint, stateValues?.user]);

	return (
		<ReduxProvider store={store}>
			<Notifications />
			<ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
			<AppProvider>
				{apolloClient ? (
					<ApolloProvider client={apolloClient}>
						{/* <FeatureFlag feature={FEATURES.USERSNAP}>
              <UsersnapProvider />
            </FeatureFlag> */}
						<MuiThemeProvider theme={theme}>
							<MuiPickersUtilsProvider utils={MomentUtils}>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									{!stateValues?.cypress?.disableContactBulkProgress && <ContactBulkProgress />}
									{children}
								</LocalizationProvider>
							</MuiPickersUtilsProvider>
						</MuiThemeProvider>
					</ApolloProvider>
				) : (
					<CircularProgress></CircularProgress>
				)}
			</AppProvider>
		</ReduxProvider>
	);
}

Providers.propTypes = {
	children: PropTypes.node.isRequired, // Ensures `children` is a valid React node and required
};

export default Providers;
