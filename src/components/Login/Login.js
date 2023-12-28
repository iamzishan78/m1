import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { AppContext, setApolloHeaders } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { NavigationContext } from "../Navigation/NavigationContext";
import SignInCard from "./SignInCard";
import styled from "styled-components";
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

// import rock from '../../DFJ.PNG'
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
    //overflowY: 'auto',
    // backgroundColor: 'red'
  },
  height_100: {
    height: "100vh",
  },
  footer: {
    // backgroundSize: "cover",
    // backgroundPosition: "center",
    backgroundColor: "#343d54",
    // // display: "flex",
    // flexDirection: "column",
    // alignItems: "center",
    // paddingBottom: "1%",
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
    // "&::-webkit-scrollbar": {
    //   width: "0 !important",
    // },
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

const M1neralLogoNavNoAuth = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11320 2490" className={props.className}>
    <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
      <path
        fill="#12ABE0"
        d="M1396 1823c-201 202-528 202-729 0-15-15-30-31-43-48l-366 366c14 16 29 31 44 47 403 402 1056 402 1459 0 356-356 397-908 124-1309l-379 378c80 188 43 413-110 566zm-839-163c-80-188-43-413 110-566 201-201 528-201 729 0 16 15 30 32 43 48l366-366c-14-16-29-31-44-47L1032 0 302 729c-356 356-397 908-124 1309l379-378zm292-384c101-100 264-100 365 0 101 101 101 264 0 365s-264 101-365 0c-100-101-100-264 0-365z"
      ></path>
      <g transform="translate(2687 379)">
        <path fill="#12ABE0" d="M2703 1686L2703 64 2703 0 2505 64 2072 202 2132 432 2422 351 2422 1686z"></path>
        <path fill="white" d="M8354 6L8354 1686 8633 1686 8633 6z"></path>
        <path
          fill="white"
          d="M1324 699c156 0 246 103 246 297v690h279V911c0-297-161-465-426-465-184 0-313 85-412 214-65-129-187-214-362-214-186 0-292 101-370 209V471H0v1215h279v-683c0-189 106-304 260-304s246 106 246 295v692h279v-686c0-195 108-301 260-301zM3099 471v1215h278v-686c0-188 113-301 274-301 166 0 260 108 260 297v690h279V913c0-283-159-467-433-467-189 0-301 99-380 214V471h-278zM5053 446c-347 0-594 285-594 633v4c0 376 272 631 624 631 223 0 382-90 497-228l-163-145c-97 95-194 145-329 145-180 0-320-110-350-308h893c2-28 5-53 5-79 0-349-196-653-583-653zm306 548h-624c26-189 145-320 316-320 184 0 290 140 308 320zM5916 471v1215h279v-462c0-323 170-481 414-481h16V448c-214-9-354 115-430 297V471h-279zM6759 1086c0 345 274 628 644 628 142 0 269-41 373-110v110h279V446h-279v107c-102-68-228-107-368-107-373 0-649 287-649 635v5zm649 386c-216 0-371-179-371-391v-5c0-211 143-386 366-386 219 0 373 177 373 391v5c0 209-142 386-368 386z"
        ></path>
      </g>
    </g>
  </svg>
);

const M1neralLogo2 = styled(M1neralLogoNavNoAuth)`
  width: 200px;
  padding-top: 50px;
  padding-bottom: 20px;
`;

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

  ///this is not a safe operation!
  // useEffect(() => {
  //   setStateApp({...stateApp, loading});
  // },[loading])

  let history = props.history;

  const handleLogin = (loginResp, userMapSettings) => {
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

    const user = {
      ...mongoUser,
      id: mongoUser.adUserId,
      features: sessionData.features,
      tenantId: sessionData.tenantId,
      mongoId: mongoUser._id,
      roles: mongoUser.roles,
      authToken: sessionData.authenticationToken,
      accessToken: sessionData.authenticationToken,
      authTokenExpires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      // authTokenExpires: new Date(authGraphQLToken.expiresOn.setDate(authGraphQLToken.expiresOn.getDate() + 14)),
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

    handleLogin(loginResp, userSettingsResp)
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
      {/* <div>
        <Typography variant="h4" className={localClass.headerWords}>
          Welcome back!
        </Typography>
      </div> */}

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

        {/* <div
  style={{
    color: "#fff",
  }}
>
  © 2021 M1neral, LLC. All Rights Reserved.
</div>

<div className={localClass.termsAndPrivacy}>
  <a href="https://m1neral.com/TOS.pdf" target="_blank" rel="noreferrer">
    Terms of Service
  </a>
  {" | "}
  <a href="https://m1neral.com/Privacy.pdf" target="_blank" rel="noreferrer">
    Privacy Policy
  </a>
</div>

<div
  style={{
    marginBottom: "50px",
  }}
>
</div> */}

        {/* <div>
          <Paper
            elevation={0}
            square={true}
            color="secondary"
            className={localClass.supportCard}
          >
            <div>
              <Typography
                style={{
                  marginTop: "75px",
                  fontSize: "24px",
                  fontWeight: "900",
                  fontFamily: "Tahoma, Geneva, sans-serif",
                  textAlign: "left",
                  paddingLeft: "65px",
                  paddingRight: "45px",
                  color: "#011133",
                }}
              >
                Have questions about your account? Need help signing up?
              </Typography>
            </div>
            <div>
              <Typography
                style={{
                  marginTop: "25px",
                  fontSize: "18px",
                  fontFamily: "Tahoma, Geneva, sans-serif",
                  textAlign: "left",
                  paddingLeft: "65px",
                  paddingRight: "45px",
                  color: "#011133",
                }}
              >
                Our support team is available and ready to help with any
                questions that you might have.
              </Typography>
            </div>
            <div>
              <a href={`mailto:support@m1neral.com`} target="_blank" rel="noreferrer">
                <Button
                  variant="contained"
                  disableElevation
                  type="submit"
                  style={{
                    "float": "left",
                    marginTop: "35px",
                    marginLeft: "65px",
                  }}
                  color="secondary"
                >
                  Contact Support
                </Button>
              </a>
            </div>
          </Paper> 
        </div>*/}
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
      // style={{ overflowY: "scroll !important"}}
      >
        {renderBody}
      </div>

      {/* <div className={localClass.rootNewUser}>
        <RenderSignUpControls />
      </div> */}
    </div>
  );
};

export default Login;
