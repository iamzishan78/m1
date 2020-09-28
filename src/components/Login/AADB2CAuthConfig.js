import * as msal2 from "@azure/msal";

const B2CTenants = JSON.parse(
  process.env.REACT_APP_TENANS_B2C_CREDENTIALS
);

export const B2CTenantCredentials = (B2CTenantName) => {
  let found;
  for (let i = 0; i < B2CTenants.length; i++) {
    if (B2CTenants[i].name.toUpperCase() === B2CTenantName.toUpperCase())
      found = B2CTenants[i];
  }
  return found;
};

export const B2CPolicies = {
  names: {
    signIn: "b2c_1a_signin",
    forgotPassword: "b2c_1a_passwordreset",
  },
  authorities: {
    signIn: {
      authority:
        "https://mineralb2c.b2clogin.com/mineralb2c.onmicrosoft.com/b2c_1a_signin",
    },
    forgotPassword: {
      authority:
        "https://mineralb2c.b2clogin.com/mineralb2c.onmicrosoft.com/b2c_1a_passwordreset",
    },
  },
};

// Config object to be passed to Msal on creation
export const msalB2CConfig = (tenantId, clientId) => {
  console.log(`tenantId: ${tenantId}, clientId: ${clientId}`);
  const path = `${window.location.origin}/loginb2c`;

  return {
    auth: {
      clientId: clientId,
      validateAuthority: false,
      redirectUri: path,
      postLogoutRedirectUri: path,
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  };
};

export const MSALB2CObj = (tenantId, clientId) =>
  new msal2.UserAgentApplication(msalB2CConfig(tenantId, clientId));

export const loginRequestB2C = {
  authority: B2CPolicies.authorities.signIn.authority,
  scopes: ["openid", "profile", "email", "offline_access"],
};

const apiConfig = {
  b2cScopes: ["https://mineralb2c.onmicrosoft.com/api/account.read"],
  webApi: "http://localhost:5000/hello",
};

const tokenRequest = {
  scopes: apiConfig.b2cScopes, // e.g. ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"]
};

export const readProfileRequestB2C = {
  scopes: ["https://graph.microsoft.com/User.Read"],
};

export const authGraphQLRequestB2C = {
  scopes: ["https://mineralb2c.onmicrosoft.com/api/user_impersonation"],
};
