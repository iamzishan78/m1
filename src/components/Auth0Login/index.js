import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useAuth0 } from '@auth0/auth0-react';
import * as msal from '@azure/msal-browser';

import { msalConfig, tenantsCredentials } from 'components/AzureLogin/AADAuthConfig';

import { BYPASS_LOGIN_MUTATION } from 'graphQL/useMutationBypassLogin';
import { USER_MAP_SETTINGS } from 'graphQL/useQueryUserMapSettings';

import { globalStateController } from 'hookstate/globalStateController';
import { mapStateController } from 'hookstate/mapStateController';

import { setUserAction } from 'store/actions/appActions';
import { currentUserGridViewSettingsAction } from 'store/actions/sessionActions';

import { apolloClientEndpointDev, isDev } from 'utils/helper';
import { saveUserSession } from 'utils/user';

import { setApolloHeaders } from 'AppContext';

const Auth0Login = props => {
	const dispatch = useDispatch();

	const { isAuthenticated, isLoading, getIdTokenClaims, loginWithRedirect } = useAuth0();

	const handleLogin = (loginResp, userMapSettings, authGraphQLResponse, authGraphQLToken) => {
		let mongoUser, sessionData;

		let { mapVars, defaultMapVars } = mapStateController.getValues(['mapVars', 'defaultMapVars']);
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

		const bypassLogin = globalStateController.getValue('bypassLogin');

		let authTokenExpires;
		if (bypassLogin) {
			authTokenExpires = sessionData.authenticationToken.expiresOn;
		} else if (authGraphQLToken?.expiresOn) {
			authTokenExpires = new Date(authGraphQLToken.expiresOn.setDate(authGraphQLToken.expiresOn.getDate() + 14));
		}

		const user = {
			...mongoUser,
			id: mongoUser.adUserId,
			features: sessionData.features,
			tenantId: sessionData.tenantId,
			mongoId: mongoUser._id,
			roles: mongoUser.roles,
			isAuth0: true,
			authToken: bypassLogin ? sessionData.auth0Token : authGraphQLResponse.authenticationToken,
			accessToken: bypassLogin ? sessionData.auth0Token : authGraphQLToken.idToken,
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
		mapStateController.updateState({ mapVars, defaultMapVars });
		globalStateController.updateState({ user });
		window.setStateApp(state => ({ ...state, user }));
		dispatch(setUserAction(user));
		dispatch(currentUserGridViewSettingsAction.STARTED(user._id));
		saveUserSession(user);
		window.setStateNav(stateNav => ({ ...stateNav, defaultOn: true }));

		// setLoadingSigInButton(false);
		props.history.push({
			parhname: window.location.pathname,
			search: window.location?.search,
		});
	};

	async function loginUser(email, authToken, idToken) {
		var options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: BYPASS_LOGIN_MUTATION.loc.source.body,
				variables: { email },
			}),
		};
		let endpoint = globalStateController.getValue('apolloClientEndpoint');
		options = setApolloHeaders(options, authToken, idToken);
		return await fetch(endpoint, options)
			.then(response => response.json())
			.then(response => {
				return response?.data?.bypassLogin?.success
					? {
							user: response.data.bypassLogin.user,
							sessionData: response.data.bypassLogin.sessionData,
						}
					: null;
			})
			.catch(error => console.log(error));
	}

	async function userSettings(userId, authToken, idToken, type) {
		var options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: USER_MAP_SETTINGS.loc.source.body,
				variables: { user: userId, type },
			}),
		};
		let endpoint = globalStateController.getValue('apolloClientEndpoint');
		options = setApolloHeaders(options, authToken, idToken);
		return await fetch(endpoint, options)
			.then(response => response.json())
			.then(response => {
				return response?.data?.userMapSettings?.settings ? response.data.userMapSettings.settings.settings : null;
			})
			.catch(error => {
				console.log(error);
			});
	}

	useEffect(() => {
		if (isLoading) {
			return;
		}

		if (!isAuthenticated) {
			const org_id = window.sessionStorage.getItem('tenantOrgId')
				? window.sessionStorage.getItem('tenantOrgId')
				: globalStateController.getValue('tenant').org_id;
			loginWithRedirect(org_id ? { authorizationParams: { organization: org_id } } : {});
			return;
		}

		let myMSALObj = globalStateController.getValue('myMSALObj');

		if (!myMSALObj) {
			const tenantName = window.sessionStorage.getItem('tenantName');
			let tenant = tenantsCredentials(tenantName);

			myMSALObj = new msal.PublicClientApplication(msalConfig(tenant));

			globalStateController.updateState({
				myMSALObj,
				apolloClientEndpoint:
					isDev && tenantName === 'localhost' ? apolloClientEndpointDev : tenant.apolloClientEndpoint,
			});
			window.setStateApp(stateApp => ({
				...stateApp,
				myMSALObj,
				apolloClientEndpoint: tenant.apolloClientEndpoint,
				graphqlScope: tenant.graphqlScope,
			}));
		}

		(async () => {
			const id = await getIdTokenClaims();
			if (!id) {
				sessionStorage.clear();
				window.location.replace(window.location.origin);
				return;
			}

			const loginRes = await loginUser(id.email, id.__raw, id.__raw);
			if (!loginRes?.user) {
				sessionStorage.clear();
				window.location.replace(window.location.origin);
				return;
			}
			window.sessionStorage.setItem('tenantOrgId', id.org_id);

			const userMapSettings = await userSettings(
				loginRes.user._id,
				loginRes.sessionData.auth0Token || loginRes.sessionData.token,
				id.__raw,
				'baseMap'
			);

			handleLogin(loginRes, userMapSettings);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isAuthenticated]);

	return null;
};

export default Auth0Login;
