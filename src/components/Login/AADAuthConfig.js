// Config object to be passed to Msal on creation
export const msalConfig = {
    auth: {
        clientId: "a11778cb-bab1-4789-8084-66d34467fb8c",
        authority: "https://login.microsoftonline.com/09c16dc5-3124-4ec6-a31a-125b325f5de2"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
};  

export const loginRequest = {
    scopes: [],
};

export const readProfileRequest = {
    scopes: ["https://graph.microsoft.com/User.Read"]
};

export const authGraphQLRequest = {
    scopes: ["https://management.azure.com/user_impersonation"]
};

// Add here the endpoints for MS Graph API services you would like to use.
const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages"
};

// Add here scopes for access token to be used at MS Graph API endpoints.
const tokenRequest = {
    scopes: ["Mail.Read"],
    forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};