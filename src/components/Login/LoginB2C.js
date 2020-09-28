import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import { NavigationContext } from "../Navigation/NavigationContext";
import SignInCardB2C from "./SignInCardB2C";
import { Button, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import RenderSignUpControls from "./RenderSignUpControls";
import queryString from "query-string";

import {
  B2CTenant,
  MSALB2CObj,
  msalB2CConfig,
  loginRequestB2C,
  authGraphQLRequestB2C,
} from "./AADB2CAuthConfig";

import * as msalB2C from "@azure/msal";

const localStyles = makeStyles((theme) => ({
  myRoot: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  footer: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#011133",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "1%",
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
    height: "100%",
    flexDirection: "column",
    "&::-webkit-scrollbar": {
      width: "0 !important",
    },
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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 11320 2490"
    className={props.className}
  >
    <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
      <path
        fill="#12ABE0"
        d="M1396 1823c-201 202-528 202-729 0-15-15-30-31-43-48l-366 366c14 16 29 31 44 47 403 402 1056 402 1459 0 356-356 397-908 124-1309l-379 378c80 188 43 413-110 566zm-839-163c-80-188-43-413 110-566 201-201 528-201 729 0 16 15 30 32 43 48l366-366c-14-16-29-31-44-47L1032 0 302 729c-356 356-397 908-124 1309l379-378zm292-384c101-100 264-100 365 0 101 101 101 264 0 365s-264 101-365 0c-100-101-100-264 0-365z"
      ></path>
      <g transform="translate(2687 379)">
        <path
          fill="#12ABE0"
          d="M2703 1686L2703 64 2703 0 2505 64 2072 202 2132 432 2422 351 2422 1686z"
        ></path>
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

const LoginB2C = (props) => {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [, setStateNav] = useContext(NavigationContext);

  const localClass = localStyles();
  const [signingIn, setSigningIn] = useState(false);
  const [loadingSigInButton, setLoadingSigInButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginErrorText, setLoginErrorText] = useState(null);

  let history = props.history;

  useEffect(() => {
    if (stateApp.myMSALB2CObj && !signingIn) {
      //setLoading(false);
      stateApp.myMSALB2CObj.handleRedirectCallback((error, loginResponse) => {
        // msal requires a redirect callback, even though can't use it to
        // get the result as it will redirect again after it has the result
        // and not provide the result of the call back on the second
        // redirect.
        if (error) {
          console.log(error);
          setLoginErrorText(error);
          setLoadingSigInButton(false);
          sessionStorage.clear();
        }
        if (!loginResponse) {
          //do some error stuff
          setLoginErrorText("Log in Failed");
          setLoadingSigInButton(false);
          sessionStorage.clear();
          return;
        }
      });

      if (stateApp.myMSALB2CObj.getAccount()) {
       console.log('hellz yeah!');

        console.log("id_token acquired at: " + new Date().toString());

        const accountObj = stateApp.myMSALB2CObj.account;
        console.log(accountObj);
        finishAADAuth(accountObj["idToken"]);
      }

    } else {
      if (stateApp.myMSALB2CObj === false) {
        setLoading(false);
      }
    }
  }, [stateApp.myMSALB2CObj, signingIn]);

  const handledAADB2CSignIn = async (tenant, updateTenantFlags) => {
    let tenantB2C = B2CTenant(tenant);
    if (!tenantB2C) {
      updateTenantFlags("The company is not supported yet.");
      setLoadingSigInButton(false);
      return;
    }

    setSigningIn(true);
    setLoadingSigInButton(true);
    setLoading(true);

    let myMSALB2CObj = stateApp.myMSALB2CObj;

    if (!myMSALB2CObj) {
      myMSALB2CObj = MSALB2CObj(tenantB2C.tenantId, tenantB2C.clientId);

      setStateApp({
        ...stateApp,
        myMSALB2CObj,
      });
    }

    window.sessionStorage.setItem("tenantB2CName", tenantB2C.name);

    const signInType = "loginRedirect";

    if (signInType === "loginPopup") {
      try {
        const loginResponse = await myMSALB2CObj
          .loginPopup(loginRequestB2C)
          .catch((error) => {
            //do some error stuff
            console.log(error);
            updateTenantFlags(error);
            setLoadingSigInButton(false);
          });
        if (!loginResponse) {
          //do some error stuff
          updateTenantFlags("Log in Failed");
          setLoadingSigInButton(false);

          return;
        }

        console.log("id_token acquired at: " + new Date().toString());
        const accountObj = loginResponse["account"];
        await finishAADAuth(accountObj);
      } catch {
        setLoadingSigInButton(false);
      }
    } else if (signInType === "loginRedirect") {
      if( queryString.parse(props.location.search).id_token_hint ) {
        loginRequestB2C.extraQueryParameters = { id_token_hint: queryString.parse(props.location.search).id_token_hint }
      }
      myMSALB2CObj.loginRedirect(loginRequestB2C);
    }
  };

  async function finishAADAuth(accountObj) {
    const request = {};
    request.account = accountObj;

    // // !!!cannot directly access MS services using delegated permissions!!!
    // request.scopes = readProfileRequestB2C.scopes;
    // request.loginHint = request.account.name;
    // const readProfileLoginResponse = await ssoSilent(request).catch((error) => {
    //   //do some error stuff
    //   console.log(error);
    // });
    // if (!readProfileLoginResponse) {
    //   //do some error stuff
    //   return;
    // }

    // const readProfileToken = await getTokenPopup(request).catch((error) => {
    //   //do some error stuff
    //   console.log(error);
    // });
    // if (!readProfileToken) {
    //   //do some error stuff
    //   return;
    // }

    // const readProfileResponse = await callMSGraph(
    //   "https://graph.microsoft.com/v1.0/me",
    //   readProfileToken.accessToken
    // ).catch((error) => {
    //   //do some error stuff
    //   console.log(error);
    // });
    // if (!readProfileResponse) {
    //   //do some error stuff
    //   return;
    // }

    request.scopes = authGraphQLRequestB2C.scopes;
    request.loginHint = request.account.displayName;
    const authGraphQLLoginResponse = await ssoSilent(request).catch((error) => {
      //do some error stuff
      console.log(error);
    });
    if (!authGraphQLLoginResponse) {
      //do some error stuff
      return;
    }

    // authGraphQLRequestB2C.account = request.account;
    // const authGraphQLToken = await getTokenPopup(authGraphQLRequestB2C).catch(
    //   (error) => {
    //     //do some error stuff
    //     console.log(error);
    //   }
    // );
    // if (!authGraphQLToken) {
    //   //do some error stuff
    //   return;
    // }

    const authGraphQLResponse = await callAuthGraphQL(
      `${new URL(stateApp.apolloClientEndpoint).origin}/.auth/login/aad`,
      authGraphQLLoginResponse.accessToken
    ).catch((error) => {
      //do some error stuff
      console.log(error);
    });
    if (!authGraphQLResponse) {
      //do some error stuff
      return;
    }

    const graphQLProfileResponse = await callProfileGraphQL(
      `${new URL(stateApp.apolloClientEndpoint).origin}/.auth/me`,
      authGraphQLResponse.authenticationToken
    ).catch((error) => {
      //do some error stuff
      console.log(error);
    });
    if (!graphQLProfileResponse) {
      //do some error stuff
      return;
    }

    // const graphQLRefreshResponse = await callProfileGraphQL("https://m1graphql.azurewebsites.net/.auth/refresh", authGraphQLResponse.authenticationToken).catch(error => {
    //   //do some error stuff
    //   console.log(error);
    // });
    // if (!graphQLRefreshResponse) {
    //   //do some error stuff
    //   return;
    // }

    // const graphQLProfileResponse2 = await callProfileGraphQL("https://m1graphql.azurewebsites.net/.auth/me", authGraphQLResponse.authenticationToken).catch(error => {
    //   //do some error stuff
    //   console.log(error);
    // });
    // if (!graphQLProfileResponse2) {
    //   //do some error stuff
    //   return;
    // }

    const mongoUser = await getMongoDBUser(
      {
        email:
          accountObj.emails && accountObj.emails.length > 0
            ? accountObj.emails[0]
            : accountObj.sub,
        name: accountObj.displayName,
      },
      authGraphQLResponse.authenticationToken
    ).catch((error) => {
      //do some error stuff
      console.log(error);
    });
    if (!mongoUser) {
      //do some error stuff
      return;
    }

    setStateApp((state) => ({
      ...state,
      user: {
        id: accountObj.sub,
        mongoId: mongoUser._id,
        email: mongoUser.email,
        name: mongoUser.name,
        authToken: authGraphQLResponse.authenticationToken,
        authTokenExpires: new Date(
          authGraphQLLoginResponse.expiresOn.setDate(
            authGraphQLLoginResponse.expiresOn.getDate() + 14
          )
        ),
        tenant: {
          id: request.tenantId,
          tenant: "M1neral",
          graphQL: {
            endpoint:
              "https://m1graphql.azurewebsites.net/api/m1neral?code=kNAzP9HYSsEwdWhlLa55AIGeKj2iiFFOpXaTMRh9IuTODWpNobIX3g==",
          },
        },
      },
    }));

    setStateNav((stateNav) => ({ ...stateNav, defaultOn: true }));

    setLoadingSigInButton(false);

    history.replace(
      window.location.pathname === "/loginb2c"
      ? "/"
      : window.location.pathname
    );

    // setLoading(false);
  }

  async function getMongoDBUser(user, accessToken) {
    const mutation = `
      mutation getFindOrCreateUser($user: UserInput) {
        findOrCreateUser(user: $user) {
          success
          message
          user {
            _id
            email
            name
            }
          }
        }
       `;

    var options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ZUMO-AUTH": accessToken,
      },
      body: JSON.stringify({ query: mutation, variables: { user } }),
    };

    return await fetch(stateApp.apolloClientEndpoint, options)
      .then((response) => response.json())
      .then((response) => {
        return response &&
          response.data &&
          response.data.findOrCreateUser &&
          response.data.findOrCreateUser.success
          ? response.data.findOrCreateUser.user
          : null;
      })
      .catch((error) => console.log(error));
  }

  async function signInPopup(request) {
    console.log("request made to signIn at: " + new Date().toString());
    console.log("scopes requested: " + request.scopes.toString());

    const loginResponse = await stateApp.myMSALObj
      .loginPopup(request)
      .catch(function (error) {
        console.log(error);
      });
    console.log(loginResponse);
    if (stateApp.myMSALObj.getAllAccounts()) {
      return loginResponse;
    }
  }
  
  async function ssoSilent(request) {
    console.log("request made to ssoSilent at: " + new Date().toString());
    console.log("scopes requested: " + request.scopes);

    stateApp.myMSALB2CObj.config.auth.redirectUri =
      msalB2CConfig().auth.redirectUri + "/auth.html";

    const loginResponse = await stateApp.myMSALB2CObj
      .ssoSilent(request)
      .catch(function (error) {
        console.log(error);
      });

    stateApp.myMSALB2CObj.config.auth.redirectUri = msalB2CConfig().auth.redirectUri;

    console.log("ssoSient response:");
    console.log(loginResponse);
    if (stateApp.myMSALB2CObj.getAllAccounts()) {
      return loginResponse;
    }
  }

  async function getTokenPopup(request) {
    console.log("request made to getTokenPopup at: " + new Date().toString());
    console.log("scopes requested: " + request.scopes);

    return await stateApp.myMSALB2CObj
      .acquireTokenSilent(request)
      .catch(async (error) => {
        console.log("silent token acquisition fails.");
        if (error instanceof msalB2C.InteractionRequiredAuthError) {
          console.log("acquiring token using popup");
          return stateApp.myMSALB2CObj
            .acquireTokenPopup(request)
            .catch((error) => {
              console.error(error);
            });
        } else {
          console.error(error);
        }
      });
  }

  async function callMSGraph(endpoint, accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
      method: "GET",
      headers: headers,
    };

    console.log("request made to Graph profile at: " + new Date().toString());

    return await fetch(endpoint, options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => console.log(error));
  }

  async function callAuthGraphQL(endpoint, accessToken) {
    const headers = new Headers();

    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ access_token: accessToken }),
    };

    console.log("request made to GraphQL login at: " + new Date().toString());

    return await fetch(endpoint, options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function callProfileGraphQL(endpoint, accessToken) {
    const headers = new Headers();

    headers.append("X-ZUMO-AUTH", accessToken);

    const options = {
      method: "GET",
      headers: headers,
    };

    console.log("request made to GraphQL profile at: " + new Date().toString());

    return await fetch(endpoint, options)
      .then((response) => response.json())
      .then((response) => response[0])
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => console.log(error));
  }

  const renderBody = (
    <>
      <div>
        <Typography variant="h4" className={localClass.headerWords}>
          Welcome back!
        </Typography>
      </div>

      <div className={localClass.cardContainer}> {
        <SignInCardB2C
          ready={loadingSigInButton}
          handleAADB2CSignIn={handledAADB2CSignIn}
          errorText={loginErrorText}
          tenant={queryString.parse(props.location.search).tenant}/>
        }

        <div>
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
              <a href={`mailto:support@m1neral.com`} target="_blank">
                <Button
                  variant="contained"
                  disableElevation
                  type="submit"
                  style={{
                    float: "left",
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
        </div>
      </div>
    </>
  );

  return loading ? (
    <CircularProgress size={80} disableShrink color="secondary" />
  ) : (
    <div className={localClass.myRoot}>
      <div className={localClass.rootNewUser}>{renderBody}</div>

      <div className={localClass.rootNewUser}>
        <RenderSignUpControls />
      </div>

      <div className={localClass.footer}>
        <div>
          <M1neralLogo2 />
        </div>

        <div
          style={{
            color: "#fff",
          }}
        >
          © 2020 M1neral, LLC. All Rights Reserved.
        </div>

        <div className={localClass.termsAndPrivacy}>
          <a href="https://m1neral.com/TOS.pdf" target="_blank">
            Terms of Service
          </a>
          {" | "}
          <a href="https://m1neral.com/Privacy.pdf" target="_blank">
            Privacy Policy
          </a>
        </div>

        <div
          style={{
            color: "#fff",
            marginBottom: "50px",
          }}
        >
          {/* Privacy Policy */}
        </div>
      </div>
    </div>
  );
};

export default LoginB2C;
