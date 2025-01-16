import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { globalStateController } from 'hookstate/globalStateController';
import { tenantsCredentials } from 'components/AzureLogin/AADAuthConfig';
import { USER_MAP_SETTINGS } from 'graphQL/useQueryUserMapSettings';
import { setApolloHeaders } from 'AppContext';
import { BYPASS_LOGIN_MUTATION } from 'graphQL/useMutationBypassLogin';
import { apolloClientEndpointDev, isDev } from 'utils/helper';
import { mapStateController } from 'hookstate/mapStateController';
import { setUserAction } from 'store/actions/appActions';
import { currentUserGridViewSettingsAction } from 'store/actions/sessionActions';
import { deleteSession, saveUserSession } from 'utils/user';
import queryString from "query-string";
import { useDispatch } from 'react-redux';

const Auth0Login = props => {
	const dispatch = useDispatch();

	const { isAuthenticated, isLoading, getIdTokenClaims, loginWithRedirect } = useAuth0();

	const handleLogin = (loginResp, userMapSettings) => {
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

		const user = {
			...mongoUser,
			id: mongoUser.adUserId,
			features: sessionData.features,
			tenantId: sessionData.tenantId,
			mongoId: mongoUser._id,
			roles: mongoUser.roles,
			isAuth0: true,
			authToken: sessionData.auth0Token,
			accessToken: sessionData.auth0Token,
			authTokenExpires: sessionData.authenticationToken.expiresOn,
		};
		globalStateController.updateState({ user });
		window.setStateApp(state => ({
			...state,
			user,
			mapVars,
			defaultMapVars: defaultMapVars,
		}));
		dispatch(setUserAction(user));
		dispatch(currentUserGridViewSettingsAction.STARTED(user._id));
		saveUserSession(user);
		window.setStateNav(stateNav => ({ ...stateNav, defaultOn: true }));

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

	async function userSettings(userId, token, type) {
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
		options = setApolloHeaders(options, token, token);
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
		if (isLoading) return;

		if (!isAuthenticated) {
			const org_id = window.sessionStorage.getItem('tenantOrgId')
				? window.sessionStorage.getItem('tenantOrgId')
				: globalStateController.getValue('tenant').org_id;
			loginWithRedirect(org_id ? { authorizationParams: { organization: org_id } } : {});
			return;
		}

		let apolloClientEndpoint = globalStateController.getValue('apolloClientEndpoint');
		const tenantName = window.sessionStorage.getItem('tenantName') || queryString.parse(props.location.search)?.tenant;
		if (!apolloClientEndpoint) {
			let tenant = tenantsCredentials(tenantName);
			globalStateController.updateState({
				myMSALObj: null,
				apolloClientEndpoint:
					isDev && tenantName === 'localhost' ? apolloClientEndpointDev : tenant?.apolloClientEndpoint,
			});
			window.setStateApp(stateApp => ({
				...stateApp,
				myMSALObj: null,
				apolloClientEndpoint: tenant?.apolloClientEndpoint,
				graphqlScope: tenant?.graphqlScope,
			}));
		}

		(async () => {
			try {
				const id = await getIdTokenClaims();
				if (!id) {
					deleteSession();
					return;
				}

				const loginRes = await loginUser(id.email, id.__raw, id.__raw);
				if (!loginRes?.user) {
					deleteSession();
					return;
				}

				// Store tenant information in session storage
				const { org_id: tenantOrgId } = id;
				window.sessionStorage.setItem('tenantOrgId', tenantOrgId);
				window.sessionStorage.setItem('tenantName', tenantName);

				// Fetch user settings
				const authToken = loginRes.sessionData.auth0Token || loginRes.sessionData.token;
				const userMapSettings = await userSettings(loginRes.user._id, authToken, id.__raw);

				handleLogin(loginRes, userMapSettings);
			} catch (error) {
				console.error('An error occurred during the login process:', error);
				deleteSession();
			}
		})();
	}, [isLoading, isAuthenticated]);

	return null;
};

export default Auth0Login;
