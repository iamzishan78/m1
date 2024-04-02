import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { globalStateController } from 'hookstate/globalStateController';
import { msalConfig, tenantsCredentials } from 'components/_Login/AADAuthConfig';
import * as msal from '@azure/msal-browser';
import { USER_MAP_SETTINGS } from 'graphQL/useQueryUserMapSettings';
import { setApolloHeaders } from 'AppContext';
import { BYPASS_LOGIN_MUTATION } from 'graphQL/useMutationBypassLogin';
import { apolloClientEndpointDev, isDev } from 'utils/helper';
import { mapStateController } from 'hookstate/mapStateController';
import { setUserAction } from 'store/actions/appActions';
import { currentUserGridViewSettingsAction } from 'store/actions/sessionActions';
import { saveUserSession } from 'utils/user';
import { useDispatch } from 'react-redux';

const Login = props => {
  const dispatch = useDispatch();

  const { isAuthenticated, isLoading, getIdTokenClaims, loginWithRedirect } = useAuth0();

  const { globalStateValues } = globalStateController.useState(
    ['bypassLogin', 'apolloClientEndpoint'],
    'globalStateValues'
  );

  const handleLogin = (
    loginResp,
    userMapSettings,
    authGraphQLResponse,
    authGraphQLToken
  ) => {
    let mongoUser, sessionData;

    let { mapVars, defaultMapVars } = mapStateController.getValues([
      'mapVars',
      'defaultMapVars',
    ]);
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
    if (globalStateValues.bypassLogin)
      authTokenExpires = sessionData.authenticationToken.expiresOn;
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
      authToken: globalStateValues.bypassLogin
        ? sessionData.token
        : authGraphQLResponse.authenticationToken,
      accessToken: globalStateValues.bypassLogin
        ? sessionData.token
        : authGraphQLToken.idToken,
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

    window.setStateApp(state => ({
      ...state,
      user,
      mapVars,
      defaultMapVars: defaultMapVars,
    }));
    dispatch(setUserAction(user));
    dispatch(currentUserGridViewSettingsAction.STARTED(user._id));
    saveUserSession(user);
    window.setStateNav(stateNav => ({ ...stateNav, defaultOn: true }));

    // setLoadingSigInButton(false);

    props.history.replace({
      parhname: window.location.pathname,
      search: window.location?.search,
    });
  };

  async function loginUser(email, authToken, idToken) {
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: BYPASS_LOGIN_MUTATION.loc.source.body,
        variables: { email },
      }),
    };
    let endpoint = globalStateValues.apolloClientEndpoint;
    console.log("🚀 ~ loginUser ~ endpoint:", endpoint, globalStateController.getValue('apolloClientEndpoint'))
    options = setApolloHeaders(options, authToken, idToken);
    return await fetch(endpoint, options)
      .then(response => response.json())
      .then(response => {
        return response?.data?.bypassLogin?.success
          ? {
            user: response.data.bypassLogin.user,
            sessionData: response.data.bypassLogin.sessionData,
          }
          : null;
      })
      .catch(error => console.log(error));
  }

  async function userSettings(userId, token, type) {
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: USER_MAP_SETTINGS.loc.source.body,
        variables: { user: userId, type },
      }),
    };
    let endpoint = globalStateValues.apolloClientEndpoint;
    options = setApolloHeaders(options, token, token);
    return await fetch(endpoint, options)
      .then(response => response.json())
      .then(response => {
        return response?.data?.userMapSettings?.settings
          ? response.data.userMapSettings.settings.settings
          : null;
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();

      return;
    }

    let myMSALObj = globalStateController.getValue('myMSALObj');

    if (!myMSALObj) {
      const tenantName = window.sessionStorage.getItem('tenantName');
      let tenant = tenantsCredentials(tenantName);

      myMSALObj = new msal.PublicClientApplication(msalConfig(tenant));

      globalStateController.updateState({
        myMSALObj,
        apolloClientEndpoint:
          isDev && tenantName === 'localhost'
            ? apolloClientEndpointDev
            : tenant.apolloClientEndpoint,
      });
      window.setStateApp(stateApp => ({
        ...stateApp,
        myMSALObj,
        apolloClientEndpoint: tenant.apolloClientEndpoint,
        graphqlScope: tenant.graphqlScope,
      }));
    }

    (async () => {
      const id = await getIdTokenClaims();
      if (!id) return;

      const loginRes = await loginUser(id.email, id.__raw);
      if (!loginRes.user) return;

      const userMapSettings = await userSettings(
        loginRes.user._id,
        loginRes.sessionData.token
      );

      handleLogin(loginRes, userMapSettings);
    })();
  }, [isAuthenticated]);

  return null;
};

export default Login;
