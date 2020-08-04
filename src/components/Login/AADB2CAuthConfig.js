const tenants = JSON.parse(process.env.REACT_APP_TENANS_CREDENTIALS);
export const tenantB2C = JSON.parse(
  process.env.REACT_APP_TENANS_B2C_CREDENTIAL
);

export const tenantsCredentials = (tenantName) => {
  let found;
  for (let i = 0; i < tenants.length; i++) {
    if (tenants[i].name.toUpperCase() === tenantName.toUpperCase())
      found = tenants[i];
  }
  return found;
};

const b2cPolicies = {
  names: {
    signUpSignIn: "b2c_1_susi",
    forgotPassword: "b2c_1_reset",
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
  },
};
// Config object to be passed to Msal on creation
export const msalConfigB2C = (tenantId, clientId) => {
  console.log(`tenantId: ${tenantId}, clientId: ${clientId}`);
  const path = `${window.location.protocol}//${window.location.host}`;
  return {
    auth: {
      clientId: clientId,
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      validateAuthority: false,
    },
    cache: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  };
};

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
  scopes: ["https://graph.microsoft.com/User.Read"],
};

export const authGraphQLRequestB2C = {
  scopes: ["https://management.azure.com/user_impersonation"],
};
