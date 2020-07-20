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

// Config object to be passed to Msal on creation
export const msalConfig = (tenantId, clientId) => {
  const path = `${window.location.protocol}//${window.location.host}`;
  return {
    auth: {
      clientId: clientId,
      // authority: 'https://m1neralb2ctenant1.b2clogin.com/m1neralb2ctenant1.onmicrosoft.com/oauth2/v2.0/authorize?p=b2c_1_sign_in_v2_preview',
      // knownAuthorities: ['m1neralb2ctenant1.b2clogin.com'],
      // validateAuthority: false,
      authority: `https://login.microsoftonline.com/${
        tenantId ? tenantId : "common"
      }`,
      redirectUri: `${path}/`,
      postLogoutRedirectUri: `${path}/`,
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  };
};

export const MSALObj = (tenantId, clientId) =>
  new msal.PublicClientApplication(msalConfig(tenantId, clientId));

export const loginRequest = {
  scopes: [],
};

export const readProfileRequest = {
  scopes: ["https://graph.microsoft.com/User.Read"],
};

export const authGraphQLRequest = {
  scopes: ["https://management.azure.com/user_impersonation"],
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
