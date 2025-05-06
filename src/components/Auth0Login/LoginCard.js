/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import queryString from 'query-string';

import { LOGIN_MUTATION, SIMPLE_BYPASS_LOGIN_MUTATION } from 'graphQL/useMutationLogin';
import { USER_MAP_SETTINGS } from 'graphQL/useQueryUserMapSettings';

import { globalStateController } from 'stateManagement/globalStateController';
import { mapStateController } from 'stateManagement/mapStateController';

import { setUserAction } from 'store/actions/appActions';
import { currentUserGridViewSettingsAction } from 'store/actions/sessionActions';

import { simpleAuthBypass } from 'utils/data';
import { apolloClientEndpointDev, isDev } from 'utils/helper';
import { UserSession } from 'utils/user';

import Api from 'api';

import BypassSignInCard from './BypassSignInCard';
import { tenantsCredentials } from './helpers';
import HexocetCanvas from './HexocetCanvas';
import SignInCard from './SignInCard';
import { AppContext, setApolloHeaders } from '../../AppContext';
import { NavigationContext } from '../Navigation/NavigationContext';

const localStyles = makeStyles(theme => ({
	myRoot: {
		display: 'inline',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	height_100: {
		height: '100vh',
	},
	footer: {
		backgroundColor: '#343d54',
	},
	headerWords: {
		color: '#011133',
		display: 'flex',
		justifyContent: 'center',
		marginTop: '30px',
		marginBottom: '20px',
		fontSize: '48px',
		fontWeight: '900',
		fontFamily: 'Tahoma, Geneva, sans-serif',
	},
	supportCard: {
		width: '375px',
		height: '425px',
		backgroundColor: '#e8eced',
		display: 'flex',
		flexDirection: 'column',
		fontFamily: theme.typography.fontFamily,
	},
	rootNewUser: {
		textAlign: 'center',
		display: 'flex',
		height: '100vh',
		flexDirection: 'column',
	},
	cardContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	termsAndPrivacy: {
		color: '#fff',
		'& a': {
			color: '#fff',
			textDecoration: 'none',
			'&:hover': {
				color: theme.palette.secondary.main,
			},
		},
	},
}));

function useWindowSize() {
	const [size, setSize] = useState([0]);
	useLayoutEffect(() => {
		function updateSize() {
			setSize([window.innerWidth]);
		}
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, []);
	return size;
}

const LoginCard = props => {
	const [width] = useWindowSize();
	const dispatch = useDispatch();
	const [stateApp, setStateApp] = useContext(AppContext);
	const [, setStateNav] = useContext(NavigationContext);

	const localClass = localStyles();
	const [signingIn, setSigningIn] = useState(false);
	const [loadingSigInButton, setLoadingSigInButton] = useState(false);
	const [loading, setLoading] = useState(false);

	let history = props.history;

	const handleLogin = (loginResp, userMapSettings, authGraphQLResponse, authGraphQLToken, authUser) => {
		let mongoUser,
			sessionData,
			mapVars = mapStateController.getValue('mapVars'),
			defaultMapVars = mapStateController.getValue('defaultMapVars');
		if (loginResp?.user) {
			mongoUser = loginResp.user;
			sessionData = loginResp.sessionData;
		}
		if (!mongoUser) {
			//do some error stuff
			return;
		}

		if (userMapSettings) {
			const { activeBaseMap, mapDefaultPosition } = userMapSettings;
			mapVars = { ...mapVars, ...mapDefaultPosition };
			defaultMapVars = { ...defaultMapVars, ...mapDefaultPosition };
			if (activeBaseMap) {
				mapVars.styleId = activeBaseMap;
				defaultMapVars.styleId = activeBaseMap;
			}
		}

		let authTokenExpires = sessionData.token?.expiresOn;
		if (!authTokenExpires && authGraphQLToken?.expiresOn) {
			authTokenExpires = new Date(authGraphQLToken.expiresOn.setDate(authGraphQLToken.expiresOn.getDate() + 14));
		}

		const user = {
			...mongoUser,
			id: mongoUser.adUserId,
			features: sessionData.features,
			tenantId: sessionData.tenantId,
			mongoId: mongoUser._id,
			roles: authUser?.roles || mongoUser.roles,
			accessToken: sessionData.token,
			authTokenExpires,
			tenant: {
				id: sessionData.tenantId,
				tenant: 'M1neral',
				graphQL: {
					endpoint:
						'https://m1graphql.azurewebsites.net/api/m1neral?code=kNAzP9HYSsEwdWhlLa55AIGeKj2iiFFOpXaTMRh9IuTODWpNobIX3g==',
				},
			},
		};

		setStateApp(state => ({
			...state,
			user,
		}));
		mapStateController.updateState({ mapVars, defaultMapVars });
		dispatch(setUserAction(user));
		dispatch(currentUserGridViewSettingsAction.STARTED(user._id));
		UserSession.saveUserSession(user);
		setStateNav(stateNav => ({ ...stateNav, defaultOn: true }));

		setLoadingSigInButton(false);

		history.replace({
			parhname: window.location.pathname,
			search: window.location?.search,
		});
	};

	useEffect(() => {
		if (!simpleAuthBypass) {
			setLoading(false);
			return;
		}

		if (stateApp.apolloClientEndpoint && !signingIn) {
			setTimeout(async () => {
				try {
					const {
						data: { login: loginResp },
					} = await Api.mutate(LOGIN_MUTATION);

					let mongoUser;
					if (loginResp?.user) {
						mongoUser = loginResp.user;
					}
					if (!mongoUser) {
						setSigningIn(false);
						setLoadingSigInButton(false);
						setLoading(false);
						return;
					}

					const { userMapSettings } = await Api.query(USER_MAP_SETTINGS, {
						user: mongoUser._id,
						type: 'baseMap',
					});

					handleLogin(loginResp, userMapSettings?.settings?.settings);
				} catch (err) {
					console.log('🚀 ~ file: Login.js:203 ~ setTimeout ~ err:', err);
				}
				setSigningIn(false);
				setLoadingSigInButton(false);
				setLoading(false);
			}, 1000);
		} else {
			setLoading(false);
		}
	}, [stateApp.apolloClientEndpoint, signingIn]);

	const handleBypassSignIn = async (tenantName, updateTenantFlags, email) => {
		let tenant = tenantsCredentials(tenantName);

		if (!tenant) {
			updateTenantFlags('Not a valid workspace or email');
			return;
		}

		setSigningIn(true);
		setLoadingSigInButton(true);
		setLoading(true);

		let endpoint = stateApp.apolloClientEndpoint;

		if (!stateApp.apolloClientEndpoint) {
			const apolloClientEndpoint =
				isDev && tenantName === 'localhost' ? apolloClientEndpointDev : tenant.apolloClientEndpoint;
			globalStateController.updateState({ apolloClientEndpoint });
			endpoint = apolloClientEndpoint;
			setStateApp({
				...stateApp,
				apolloClientEndpoint,
				graphqlScope: tenant.graphqlScope,
			});
		}

		UserSession.setStorageItem('tenantName', tenant.name);

		setTimeout(async () => {
			try {
				var options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ query: SIMPLE_BYPASS_LOGIN_MUTATION.loc.source.body, variables: { email } }),
				};
				options = setApolloHeaders(options);
				const loginResp = await fetch(endpoint, options)
					.then(response => response.json())
					.then(response => {
						return response?.data?.simpleBypassLogin?.success
							? { user: response.data.simpleBypassLogin.user, sessionData: response.data.simpleBypassLogin.sessionData }
							: null;
					})
					.catch(error => console.log(error));

				let mongoUser;
				if (loginResp?.user) {
					mongoUser = loginResp.user;
				}
				if (!mongoUser) {
					setSigningIn(false);
					setLoadingSigInButton(false);
					setLoading(false);
					return;
				}

				const { userMapSettings } = await Api.query(USER_MAP_SETTINGS, {
					user: mongoUser._id,
					type: 'baseMap',
				});

				handleLogin(loginResp, userMapSettings?.settings?.settings);
			} catch (err) {
				console.log('🚀 ~ file: Login.js:422 ~ setTimeout ~ err:', err);
				updateTenantFlags('Log in Failed');
			}
			setSigningIn(false);
			setLoadingSigInButton(false);
			setLoading(false);
		}, 1000);
	};

	const handleSignIn = async tenantName => {
		let tenant = tenantsCredentials(tenantName);

		UserSession.setStorageItem('tenantName', tenant.name);
		history.push(history.location.pathname);
		return;
	};

	const renderBody = (
		<>
			<div className={localClass.cardContainer}>
				{simpleAuthBypass ? (
					<BypassSignInCard
						ready={loadingSigInButton}
						handleSignIn={handleBypassSignIn}
						tenant={!stateApp.apolloClientEndpoint ? queryString.parse(props.location.search).tenant : undefined}
					/>
				) : (
					<SignInCard
						ready={loadingSigInButton}
						handleSignIn={handleSignIn}
						tenant={!stateApp.apolloClientEndpoint ? queryString.parse(props?.location?.search).tenant : undefined}
					/>
				)}
			</div>
		</>
	);

	return loading || stateApp.user ? (
		<div style={{ marginTop: '20%', marginLeft: '47%' }}>
			<CircularProgress size={80} disableShrink color="secondary" />
		</div>
	) : (
		<div className={width > 2050 ? `${localClass.height_100} ${localClass.myRoot}` : localClass.myRoot}>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 1,
				}}
			>
				<HexocetCanvas />
			</div>
			<div
				className={localClass.rootNewUser}
				style={{
					position: 'relative',
					zIndex: 2,
				}}
			>
				{renderBody}
			</div>
		</div>
	);
};

export default LoginCard;
