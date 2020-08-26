import * as msal2 from "@azure/msal";

const REACT_APP_TENANS_B2C_CREDENTIALS = [
  {
    name: "mineralb2c",
    tenantId: "8a5745e7-9ec5-4815-a505-795b18826191",
    clientId: "ecdc741a-6b2c-4158-93d3-b5bccc2d7e76",
    apolloClientEndpoint: "https://m1c3graphql.azurewebsites.net/api/m1graph?code=cpWTIzbdIQtWuHfW1qGQQh6PwwqJaIftGrjq6ZZBOKlklCWQ/EKBYg==",
  },
];
const REACT_APP_SUPPORTED_TENANTS = [
  { adTenant: "M1neral", adB2CTenant: "mineralb2c" },
];
export const B2CTenant = (tenant) => {
  const tenantB2CName = REACT_APP_SUPPORTED_TENANTS.reduce((_, e) => {
    if (e.adTenant === tenant) return e.adB2CTenant;
  }, null);

  if (!tenantB2CName) return null;

  return REACT_APP_TENANS_B2C_CREDENTIALS.reduce((_, e) => {
    if (e.name === tenantB2CName) return e;
  }, null);
};

export const B2CTenantToLogin = (tenantB2CName) => {
  return REACT_APP_TENANS_B2C_CREDENTIALS.reduce((_, e) => {
    if (e.name === tenantB2CName) return e;
  }, null);
};

const B2CPolicies = {
  names: {
    signUpSignIn: "b2c_1_susi",
    forgotPassword: "b2c_1_reset",
    signUpSignInCommon: "B2C_1A_SignUpOrSignInCommon",
  },
  authorities: {
    signUpSignIn: {
      authority:
        "https://mineralb2c.b2clogin.com/mineralb2c.onmicrosoft.com/B2C_1_susi",
    },
    forgotPassword: {
      authority:
        "https://mineralb2c.b2clogin.com/mineralb2c.onmicrosoft.com/b2c_1_reset",
    },
    signUpSignInCommon: {
      authority:
        "https://mineralb2c.b2clogin.com/mineralb2c.onmicrosoft.com/B2C_1A_SignUpOrSignInCommon",
    },
  },
};

// Config object to be passed to Msal on creation
export const msalB2CConfig = (tenantId, clientId) => {
  console.log(`tenantId: ${tenantId}, clientId: ${clientId}`);
  const path = `${window.location.protocol}//${window.location.host}`;

  return {
    auth: {
      clientId: clientId,
      authority: B2CPolicies.authorities.signUpSignIn.authority,
      validateAuthority: false,
      redirectUri: `${path}/`,
    },
    cache: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  };
};

export const MSALB2CObj = (tenantId, clientId) =>
  new msal2.UserAgentApplication(msalB2CConfig(tenantId, clientId));

export const loginRequestB2C = {
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
  scopes: ["https://graph.microsoft.com/User.Read"]
};

export const authGraphQLRequestB2C = {
  scopes: ["https://mineralb2c.onmicrosoft.com/api/user_impersonation"]
};
