import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { AppContext, setApolloHeaders } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { NavigationContext } from "../Navigation/NavigationContext";
import SignInCard from "./SignInCard";
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";

import { tenantsCredentials, b2cPolicies, msalConfig, loginRequest, authGraphQLRequest } from "./AADAuthConfig";
import * as msal from "@azure/msal-browser";
import { GET_LOGGED_IN_USER } from "graphQL/useMutationLoggedInUser";
import { USER_MAP_SETTINGS } from "graphQL/useQueryUserMapSettings";
import { setUserAction } from "store/actions/appActions";
import { currentUserGridViewSettingsAction } from "store/actions/sessionActions"
import { saveUserSession } from "utils/user";
import Api from "api";

import rock from "../../rock.png";
import BypassSignInCard from "./BypassSignInCard";
import { BYPASS_LOGIN } from "utils/data";
import { BYPASS_LOGIN_MUTATION } from "graphQL/useMutationBypassLogin";
import { apolloClientEndpointDev } from "utils/helper";

const localStyles = makeStyles((theme) => ({
  myRoot: {
    display: "inline",
    flexDirection: "column",
    justifyContent: "center",
  },
  height_100: {
    height: "100vh",
  },
  footer: {
    backgroundColor: "#343d54",
  },
  headerWords: {
    color: "#011133",
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
    marginBottom: "20px",
    fontSize: "48px",
    fontWeight: "900",
    fontFamily: "Tahoma, Geneva, sans-serif",
  },
  supportCard: {
    width: "375px",
    height: "425px",
    backgroundColor: "#e8eced",
    display: "flex",
    flexDirection: "column",
    fontFamily: theme.typography.fontFamily,
  },
  rootNewUser: {
    textAlign: "center",
    display: "flex",
    height: "100vh",
    flexDirection: "column",
    backgroundColor: "#343d54",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  termsAndPrivacy: {
    color: "#fff",
    "& a": {
      color: "#fff",
      textDecoration: "none",
      "&:hover": {
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
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

const Login = (props) => {
  const [width] = useWindowSize();
  const dispatch = useDispatch();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [, setStateNav] = useContext(NavigationContext);

  const localClass = localStyles();
  const [signingIn, setSigningIn] = useState(false);
  const [loadingSigInButton, setLoadingSigInButton] = useState(false);
  const [loading, setLoading] = useState(true);

  let history = props.history;

  const handleLogin = (loginResp, userMapSettings, authGraphQLToken) => {
    let mongoUser,
      sessionData,
      mapVars = stateApp.mapVars,
      defaultMapVars = stateApp.defaultMapVars;
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

    let authTokenExpires;
    if (BYPASS_LOGIN) authTokenExpires = sessionData.authenticationToken.expiresOn;
    else if (authGraphQLToken?.expiresOn)
      authTokenExpires = new Date(
        authGraphQLToken.expiresOn.setDate(authGraphQLToken.expiresOn.getDate() + 14)
      );

    const user = {
      ...mongoUser,
      id: mongoUser.adUserId,
      features: sessionData.features,
      tenantId: sessionData.tenantId,
      mongoId: mongoUser._id,
      roles: mongoUser.roles,
      authToken: BYPASS_LOGIN ? sessionData.token : sessionData.authenticationToken,
      accessToken: BYPASS_LOGIN ? sessionData.token : sessionData.authenticationToken,
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
      mapVars,
      defaultMapVars: defaultMapVars,
    }));
    dispatch(setUserAction(user));
    dispatch(currentUserGridViewSettingsAction.STARTED(user._id));
    saveUserSession(user);
    setStateNav(stateNav => ({ ...stateNav, defaultOn: true }));

    setLoadingSigInButton(false);

    history.replace({
      parhname: window.location.pathname,
      search: window.location?.search,
    });
  };

  useEffect(() => {
    if (stateApp.myMSALObj && !signingIn && BYPASS_LOGIN) {
      setTimeout(async () => {
        try {
          const {
            data: { login: loginResp },
          } = await Api.mutate(GET_LOGGED_IN_USER);

          let mongoUser;
          if (loginResp?.user) {
            mongoUser = loginResp.user;
          }
          if (!mongoUser) {
            //do some error stuff
            return;
          }

          const { userMapSettings } = await Api.query(USER_MAP_SETTINGS, {
            user: mongoUser._id,
            type: 'baseMap',
          });

          handleLogin(loginResp, userMapSettings?.settings?.settings);
        } catch (err) {
          console.log('🚀 ~ file: Login.js:396 ~ setTimeout ~ err:', err);
        }
        setSigningIn(false);
        setLoadingSigInButton(false);
        setLoading(false);
      }, 1000);
    } else if (stateApp.myMSALObj && !signingIn) {
      stateApp.myMSALObj
        .handleRedirectPromise()
        .then((tokenResponse) => {
          const accountObj = tokenResponse
            ? tokenResponse.account
            : (() => {
              const currentAccounts = stateApp.myMSALObj.getAllAccounts();
              return currentAccounts && currentAccounts.length === 1
                ? currentAccounts[0]
                : (() => {
                  // hoose account code here
                  return;
                })();
            })();

          if (accountObj) {
            // We need to reject id tokens that were not issued with the default sign-in policy.
            // "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr")
            // To learn more about b2c tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
            if (tokenResponse && tokenResponse.idTokenClaims && tokenResponse.idTokenClaims.tfp === b2cPolicies.forgotPassword) {
              // stateApp.myMSALObj.clearCache();
              // stateApp.myMSALObj.account = null;
              const logoutRequest = {
                account: accountObj,
              };

              let request = loginRequest(stateApp.graphqlScope);

              if (queryString.parse(props.location.search).id_token_hint) {
                request.extraQueryParameters = { id_token_hint: queryString.parse(props.location.search).id_token_hint };
              }

              stateApp.myMSALObj.logout(logoutRequest);
              // // window.alert("Password has been reset successfully. \nPlease sign-in with your new password.");

              setSigningIn(true);
              setLoadingSigInButton(true);

              stateApp.myMSALObj.loginRedirect(request);

              return;
            }

            // Account object was retrieved, continue with app progress
            // Account object is now an array! what do we do if multiple users are signed in on the same browser?
            // Passing first account as default for now
            finishAADAuth(accountObj);
          } else {
            setLoading(false);
            sessionStorage.clear();
            window.location.replace(window.location.origin);
          }
        })
        .catch((error) => {
          if (error.errorMessage && error.errorMessage.includes("AADB2C90118")) {
            stateApp.myMSALObj.loginRedirect({
              authority: stateApp.myMSALObj.config.auth.authority.replace(b2cPolicies.signIn, b2cPolicies.forgotPassword),
            });

            return;
          }

          if (error.errorMessage && error.errorMessage.includes("AADB2C90085")) {
            let request = loginRequest();
            request.extraQueryParameters = { prompt: "login" };
            stateApp.myMSALObj.loginRedirect(request);

            return;
          }

          const currentAccounts = stateApp.myMSALObj.getAllAccounts();
          const currentAccount = currentAccounts && currentAccounts.length === 1 ? currentAccounts[0] : undefined;

          const logoutRequest = {
            account: currentAccount,
          };

          sessionStorage.clear();
          localStorage.clear();

          // Need to call this all the time on exception to clear msal cache
          // in particular when cancelling login to change workspaces
          stateApp.myMSALObj.logout(logoutRequest);

          // window.location.replace(window.location.origin);
          setLoading(false);
        });
    } else {
      if (stateApp.myMSALObj === false) setLoading(false);
    }
  }, [stateApp.myMSALObj, signingIn]);

  const handleAADSignIn = async (tenantName, updateTenantFlags) => {
    let tenant = tenantsCredentials(tenantName);
    if (tenant) {
      setSigningIn(true);
      setLoadingSigInButton(true);

      let myMSALObj = stateApp.myMSALObj;

      if (!stateApp.myMSALObj) {
        myMSALObj = new msal.PublicClientApplication(msalConfig(tenant));
        setStateApp({
          ...stateApp,
          myMSALObj,
          apolloClientEndpoint: tenant.apolloClientEndpoint,
          graphqlScope: tenant.graphqlScope,
        });
      }

      window.sessionStorage.setItem("tenantName", tenant.name);

      const signInType = "loginRedirect";

      if (signInType === "loginPopup") {
        stateApp.myMSALObj = myMSALObj; /////
        const loginResponse = await signInPopup(loginRequest(tenant.graphqlScope)).catch((error) => {
          //do some error stuff
          updateTenantFlags(error);
          setLoadingSigInButton(false);
        });
        if (!loginResponse) {
          //do some error stuff
          updateTenantFlags("Log in Failed");
          setLoadingSigInButton(false);

          return;
        }

        await finishAADAuth(loginResponse);
      } else if (signInType === "loginRedirect") {
        let request = loginRequest(tenant.graphqlScope);
        const accounts = myMSALObj.getAllAccounts();
        if (accounts.length > 0) {
          myMSALObj.setActiveAccount(accounts[0]);
        }
        myMSALObj.addEventCallback((event) => {
          if (event.eventType === msal.EventType.LOGIN_SUCCESS && event.payload.account) {
            const account = event.payload.account;
            myMSALObj.setActiveAccount(account);
          }
        }, error => {
          console.log('error', error);
        });
        myMSALObj.handleRedirectPromise().then(authResult => {
          const account = myMSALObj.getActiveAccount();
          if (!account) {
            myMSALObj.loginRedirect(request);
          }
        }).catch(err => {
          console.log(err);
        });
      }
    } else {
      updateTenantFlags("Not a valid workspace");
    }
  };

  const handleBypassAADSignIn = async (tenantName, updateTenantFlags, email) => {
    let tenant = tenantsCredentials(tenantName);

    if (!tenant) return updateTenantFlags('Not a valid workspace or email');

    setSigningIn(true);
    setLoadingSigInButton(true);
    setLoading(true);

    let myMSALObj = stateApp.myMSALObj;

    if (!stateApp.myMSALObj) {
      myMSALObj = new msal.PublicClientApplication(msalConfig(tenant));
      setStateApp({
        ...stateApp,
        myMSALObj,
        apolloClientEndpoint: tenantName === 'localhost' ? apolloClientEndpointDev : tenant.apolloClientEndpoint,
        graphqlScope: tenant.graphqlScope,
      });
    }

    window.sessionStorage.setItem("tenantName", tenant.name);

    setTimeout(async () => {
      try {
        const { data: { bypassLogin: loginResp } } = await Api.mutate(BYPASS_LOGIN_MUTATION, {
          email
        })

        let mongoUser;
        if (loginResp?.user) {
          mongoUser = loginResp.user;
        }
        if (!mongoUser) {
          //do some error stuff
          return;
        }

        const { userMapSettings } = await Api.query(USER_MAP_SETTINGS, {
          user: mongoUser._id,
          type: 'baseMap'
        })

        handleLogin(loginResp, userMapSettings?.settings?.settings)
      } catch (err) {
        console.log("🚀 ~ file: Login.js:396 ~ setTimeout ~ err:", err)
        updateTenantFlags("Log in Failed");
      }
      setSigningIn(false);
      setLoadingSigInButton(false);
      setLoading(false);
    }, 1000);
  };

  async function finishAADAuth(accountObj) {
    const request = authGraphQLRequest(stateApp.graphqlScope);
    request.account = accountObj;

    request.loginHint = request.account.username;

    authGraphQLRequest.account = request.account;
    const authGraphQLToken = await getTokenRedirect(request).catch((error) => {
      //do some error stuff
      console.log(error);
    });
    if (!authGraphQLToken) {
      //do some error stuff
      return;
    }

    const authGraphQLResponse = await callAuthGraphQL(
      `${new URL(stateApp.apolloOriginalClientEndpoint).origin}/.auth/login/aad`,
      authGraphQLToken.idToken,
      authGraphQLToken.accessToken
    ).catch((error) => {
      //do some error stuff
      console.log(error);
    });
    if (!authGraphQLResponse) {
      //do some error stuff
      return;
    }

    const graphQLProfileResponse = await callProfileGraphQL(
      `${new URL(stateApp.apolloOriginalClientEndpoint).origin}/.auth/me`,
      authGraphQLResponse.authenticationToken
    ).catch((error) => {
      //do some error stuff
      console.log(error);
    });
    if (!graphQLProfileResponse) {
      //do some error stuff
      return;
    }

    const authUser = {};
    authUser.issuerUserId = graphQLProfileResponse.user_claims.find(({ typ }) => {
      return typ === "http://schemas.microsoft.com/identity/claims/objectidentifier";
    });
    if (authUser.issuerUserId) {
      authUser.issuerUserId = authUser.issuerUserId.val;
    }
    authUser.issuerTenantId = graphQLProfileResponse.user_claims.find(({ typ }) => {
      return typ === "http://schemas.microsoft.com/identity/claims/tenantid";
    });
    if (authUser.issuerTenantId) {
      authUser.issuerTenantId = authUser.issuerTenantId.val;
    }
    authUser.b2cEmail = graphQLProfileResponse.user_claims.find(({ typ }) => {
      return typ === "emails";
    });
    if (authUser.b2cEmail) {
      authUser.b2cEmail = authUser.b2cEmail.val;
    }
    authUser.b2bEmail = graphQLProfileResponse.user_claims.find(({ typ }) => {
      return typ === "preferred_username";
    });
    if (authUser.b2bEmail) {
      authUser.b2bEmail = authUser.b2bEmail.val;
    }
    authUser.b2cName = graphQLProfileResponse.user_claims.find(({ typ }) => {
      return typ === "displayName";
    });
    if (authUser.b2cName) {
      authUser.b2cName = authUser.b2cName.val;
    }
    authUser.b2bName = graphQLProfileResponse.user_claims.find(({ typ }) => {
      return typ === "name";
    });
    if (authUser.b2bName) {
      authUser.b2bName = authUser.b2bName.val;
    }
    authUser.roles = graphQLProfileResponse.user_claims.filter(({ typ }) => {
      return typ === "roles";
    });
    if (authUser.roles) {
      authUser.roles = authUser.roles.map((role) => role.val);
    }

    const loginResp = await loginUser(
      {
        // issuerUserId: authUser.issuerUserId,
        // issuerTenantId: authUser.issuerTenantId,
        email: authUser.b2cEmail ?? authUser.b2bEmail,
        name: authUser.b2cName ?? authUser.b2bName,
      },
      authGraphQLResponse.authenticationToken,
      authGraphQLToken.idToken
    );
    let mongoUser;
    if (loginResp?.user) {
      mongoUser = loginResp.user;
    }
    if (!mongoUser) {
      //do some error stuff
      return;
    }
    const userSettingsResp = await userSettings(mongoUser._id, authGraphQLResponse.authenticationToken, authGraphQLToken.idToken, 'baseMap');

    handleLogin(loginResp, userSettingsResp, authGraphQLResponse);
  }

  async function loginUser(user, authToken, idToken) {
    var options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: GET_LOGGED_IN_USER, variables: { user } }),
    };
    let endpoint = stateApp.apolloClientEndpoint;
    options = setApolloHeaders(options, authToken, idToken);
    return await fetch(endpoint, options)
      .then((response) => response.json())
      .then((response) => {
        return response?.data?.login?.success ? { user: response.data.login.user, sessionData: response.data.login.sessionData } : null;
      })
      .catch((error) => console.log(error));
  }

  async function userSettings(userId, authToken, idToken, type) {
    var options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: USER_MAP_SETTINGS, variables: { user: userId, type } }),
    };
    let endpoint = stateApp.apolloClientEndpoint;
    options = setApolloHeaders(options, authToken, idToken);
    return await fetch(endpoint, options)
      .then((response) => response.json())
      .then((response) => {
        return response?.data?.userMapSettings?.settings ? response.data.userMapSettings.settings.settings : null;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function signInPopup(request) {
    const loginResponse = await stateApp.myMSALObj.loginPopup(request).catch(function (error) {
      console.log(error);
    });
    if (stateApp.myMSALObj.getAllAccounts()) {
      return loginResponse;
    }
  }

  async function getTokenRedirect(request) {
    return await stateApp.myMSALObj.acquireTokenSilent(request).catch(async (error) => {
      console.error(error);

      request.forceRefresh = true;

      return stateApp.myMSALObj.acquireTokenRedirect(request).catch((error) => {
        console.error(error);
      });
    });
  }

  async function callAuthGraphQL(endpoint, idToken, accessToken) {
    const headers = new Headers();

    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ id_token: idToken, access_token: accessToken }),
    };

    return await fetch(endpoint, options)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(response.headers.toString());
        }

        return response.json();
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
  }

  async function callProfileGraphQL(endpoint, accessToken) {
    const headers = new Headers();

    headers.append("X-ZUMO-AUTH", accessToken);

    const options = {
      method: "GET",
      headers: headers,
    };

    return await fetch(endpoint, options)
      .then((response) => response.json())
      .then((response) => response[0])
      .then((response) => {
        return response;
      })
      .catch((error) => console.log(error));
  }

  const renderBody = (
    <>
      <div className={localClass.cardContainer}>
        {BYPASS_LOGIN ?
          <BypassSignInCard
            ready={loadingSigInButton}
            handleAADSignIn={handleBypassAADSignIn}
            tenant={!stateApp.myMSALObj ? queryString.parse(props.location.search).tenant : undefined}
          /> :
          <SignInCard
            ready={loadingSigInButton}
            handleAADSignIn={handleAADSignIn}
            tenant={!stateApp.myMSALObj ? queryString.parse(props.location.search).tenant : undefined}
          />
        }
      </div>
    </>
  );

  return loading || stateApp.user ? (
    <div style={{ marginTop: "20%", marginLeft: "47%" }}>
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  ) : (
    <div
      className={width > 2050 ? `${localClass.height_100} ${localClass.myRoot}` : localClass.myRoot}
      style={{ backgroundImage: `url(${rock})` }}
    >
      <div
        className={localClass.rootNewUser}
        style={{
          backgroundImage: `url(${rock})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {renderBody}
      </div>
    </div>
  );
};

export default Login;
