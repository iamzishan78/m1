import * as msal from '@azure/msal-browser';

import { globalStateController } from 'controllers/globalStateController';

import { copy } from 'utils/helper';

const tenants = JSON.parse(process.env.REACT_APP_TENANS_CREDENTIALS);

export const tenantsCredentials = tenantName => {
	if (!tenantName) {
		return null;
	}

	let found;
	for (let i = 0; i < tenants.length; i++) {
		if (tenants[i].name.toUpperCase() === tenantName.toUpperCase()) {
			found = tenants[i];
		}
	}

	if (found?.name) {
		globalStateController.setBypassLogin(found);
	}

	return copy(found);
};

export const b2cPolicies = {
	signIn: 'B2C_1A_SignIn',
	forgotPassword: 'B2C_1A_PasswordReset',
};

// Config object to be passed to Msal on creation
export const msalConfig = tenant => {
	const path = window.location.origin;
	return {
		auth: {
			clientId: tenant ? tenant.clientId : undefined,
			authority: tenant ? tenant.authority : undefined,
			knownAuthorities: [tenant ? new URL(tenant.authority).host : undefined],
			// authority: 'https://mineralb2c.b2clogin.com/mineralb2c.onmicrosoft.com/b2c_1a_signin',
			// knownAuthorities: ['mineralb2c.b2clogin.com'],
			// authority: `https://login.microsoftonline.com/${
			//   tenantId ? tenantId : "common"
			// }`,
			redirectUri: path,
			postLogoutRedirectUri: path,
		},
		cache: {
			cacheLocation: 'localStorage', // This configures where your cache will be stored
			storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
		},
	};
};

export const MSALObj = tenant => new msal.PublicClientApplication(msalConfig(tenant));

export const loginRequest = graphqlScope => {
	return {
		scopes: ['openid'].concat(graphqlScope ? [graphqlScope] : []),
		prompt: 'login',
		// extraScopesToConsent: ["offline_access"],
		// forceRefresh: true
	};
};

export const readProfileRequest = {
	scopes: ['https://graph.microsoft.com/User.Read'],
};

export const authGraphQLRequest = graphqlScope => {
	return {
		scopes: ['openid', graphqlScope],
		extraScopesToConsent: ['offline_access'],
		// scopes: ["https://mineralb2c.onmicrosoft.com/api/user_impersonation", "openid", "offline_access"],
		// scopes: ["https://management.azure.com/user_impersonation", "openid", "offline_access"],
	};
};
