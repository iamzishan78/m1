import * as msal from "@azure/msal-browser";

const tenants = JSON.parse(process.env.REACT_APP_TENANS_CREDENTIALS);

export const tenantsCredentials = (tenantName) => {
  let found;
  for (let i = 0; i < tenants.length; i++) {
    if (tenants[i].name.toUpperCase() === tenantName.toUpperCase())
    found = tenants[i];
  }
  return found;
};

export const b2cPolicies = {
  signIn: "B2C_1A_SignIn",
  forgotPassword: "B2C_1A_PasswordReset",
}

// Config object to be passed to Msal on creation
export const msalConfig = (tenant) => {
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
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  };
};

export const MSALObj = (tenant) =>
  new msal.PublicClientApplication(msalConfig(tenant));

export const loginRequest = {
  scopes: ["openid", "offline_access"],
};

export const readProfileRequest = {
  scopes: ["https://graph.microsoft.com/User.Read"],
};

export const authGraphQLRequest = (graphqlScope) => {
  return {
    scopes: [graphqlScope, "openid", "offline_access"],
  // scopes: ["https://mineralb2c.onmicrosoft.com/api/user_impersonation", "openid", "offline_access"],
  // scopes: ["https://management.azure.com/user_impersonation", "openid", "offline_access"],
  }
};

// Add here the endpoints for MS Graph API services you would like to use.
const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages",
};

// Add here scopes for access token to be used at MS Graph API endpoints.
const tokenRequest = {
  scopes: ["Mail.Read"],
  forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
};
