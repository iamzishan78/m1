import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import { AppProvider, AppContext, setApolloHeaders } from "./AppContext";
import GlobalApolloClientProvider from "./GlobalApolloClientProvider";
import { Switch, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
//components
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Login from "./components/Login/Login";
import SignUpCard from "./components/Login/SignUpCard";
import ForgotPassword from "./components/Login/ForgotPassword";
import NavigationProvider from "./components/Navigation/NavigationProvider";
import MapProvider from "./components/Map/MapProvider";
import TrackProvider from "./components/Track/TrackProvider";
import TransactProvider from "./components/Transact/TransactProvider";
import DocumentProvider from "./components/Document/DocumentProvider";
import TitleOpinionProvider from "./components/TitleOpinion/TitleOpinionProvider";
import ContactsProvider from "./components/Contacts/ContactsProvider";
import ContactDetailsProvider from "./components/ContactDetailCard/ContactDetailsProvider";
// import ContactDealsProvider from "./components/DealsDetailCard/ContactDealsProvider";
import ContactParcelsInterestProvider from "./components/ParcelsDetailCard/ContactParcelsInterestProvider";
import ContactParcelsInterestDetailsProvider from "./components/ParcelsDetailCard/ContactParcelsInterestDetailsProvider";
import ContactUnitsInterestDetailsProvider from "./components/ShapeDetailCard/Unit/ContactUnitsInterestDetailsProvider";
import ContactWellInterestProvider from "./components/ContactDetailCard/components/ContactsWellInterestsParcelInterests/ContactWellInterestProvider";
import ContactDocumentsProvider from "./components/ViewDocuments/ContactDocumentsProvider";
import ContactDetailedInfoProvider from "./components/ContactDetailedInfo/ContactDetailedInfoProvider";
import ContactRecentActivitiesProvider from "./components/RecentActivities/ContactRecentActivitiesProvider";
import AlertsProvider from "./components/Alerts/AlertsProvider";
import DashboardProvider from "./components/Dashboard/DashboardProvider";
import StudioProvider from "./components/Studio/StudioProvider";
import BulkUpload from "./components/BulkUpload/BulkUpload";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import ActivitiesProvider from "./components/Activities/ActivitiesProvider";
import ContactBulkProgress from "./components/BulkUpload/ContactBulkProgress";
import RevenueProvider from "components/Revenue/RevenueProvider";
import Land from "components/Land";
import AgreementProvider from "./components/Land/components/Agreements/AgreementProvider";
// pick a date util library
import MomentUtils from "@date-io/moment";
import { CircularProgress } from "@material-ui/core";
import { UsersnapProvider } from "./UsersnapContext";

import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { FEATURES } from "components/Shared/FeatureFlag/common";

//graphQL - queries in ./graphQL example usage in ./components/Maps.js
import { ApolloProvider, ApolloClient, InMemoryCache, useApolloClient } from "@apollo/client";
import { HttpLink } from "apollo-link-http";
import { BatchHttpLink } from "apollo-link-batch-http";
import { split } from "apollo-link";
import { relayStylePagination } from "./graphQL/apolloPaginationSchemes.js";
// import ProfileProvider from "./components/Profile/ProfileProvider";
// import ProfileDetailsProvider from "./components/Profile/ProfileDetailsProvider";
// import { UserManagementContextProvider } from "./components/UserManagement/UserManagementContext";
// import UserManagementContainer from "./components/UserManagement/Container";
import Notifications from "./components/Notifications/Notifications";
//redux
import { Provider as ReduxProvider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import configureStore, { history } from "./store";
import AnalyticsProvider from "components/Analytics/AnalyticsProvider";
import AdminProvider from "components/Admin/AdminProvider";
import { globalStateController } from "hookstate/globalStateController";
// user management
const store = configureStore(/ provide initial state if any /);
//app theme overrides to the default material-ui theme found here https://material-ui.com/customization/default-theme/#explore
const theme = createTheme({
  palette: {
    type: "light",
    common: { black: "#000", white: "#fff" },
    background: { paper: "#fff", default: "#fff" },
    primary: {
      light: "rgba(75, 97, 143, 1)",
      main: "rgba(1, 17, 51, 1)",
      dark: "rgba(38, 52, 81, 1)",
      contrastText: "rgba(255, 255, 255, 1)",
    },
    secondary: {
      light: "rgba(75, 97, 143, 1)",
      main: "rgba(23, 170, 221, 1)",
      dark: "rgba(38, 52, 81, 1)",
      contrastText: "#fff",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "rgba(255, 255, 255, 1)",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
    action: {
      active: "rgba(0, 0, 0, 0.54)",
      hover: "rgba(0, 0, 0, 0.08)",
      hoverOpacity: 0.08,
      selected: "rgba(0, 0, 0, 0.14)",
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
    },
  },
  typography: {
    fontFamily: "Poppins",
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          height: "0.4em",
          width: "0.4em",
        },
        "*:hover::-webkit-scrollbar": {
          height: "0.8em",
          width: "0.6em",
        },
        "*::-webkit-scrollbar-track": {
          "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "#929292",
          borderRadius: 5,
        },
      },
    },
  },
});

const PrivateRoute = ({ component, ...options }) => {
  const user = globalStateController.getValue('user')

  const userSessionIsLoaded = useSelector(({ session }) => session.isLoaded);
  const apolloClient = useApolloClient();

  if (user && Date.parse(user.authTokenExpires) < Date.now()) {
    sessionStorage.clear();
    window.location.replace(window.location.origin);
    // setStateApp((stateApp) => ({ ...stateApp, user: null }));
    // setStateNav((stateNav) => ({ ...stateNav, defaultOn: false }));
  }

  const finalComponent =
    user && Date.parse(user.authTokenExpires) > Date.now() && apolloClient && userSessionIsLoaded
      ? component
      : (() => {
        return Login;
      })();

  return (
    <div>
      <Route {...options} render={(props) => React.createElement(finalComponent, { ...options, ...props })} />
    </div>
  );
};

function App() {
  const [apolloClient, setApolloClient] = useState(null);
  useEffect(() => {
    new GlobalApolloClientProvider(apolloClient);
  }, [apolloClient]);

  const { stateValues } = globalStateController.useState(['apolloClientEndpoint', 'user'])

  useEffect(() => {
    if (stateValues.apolloClientEndpoint) {
      updateApolloClient(stateValues.apolloClientEndpoint, stateValues?.user?.authToken, stateValues?.user?.accessToken);
    } else {
      updateApolloClient()
    }
  }, [stateValues.apolloClientEndpoint, stateValues?.user]);

  // useEffect(() => {
  //   let draggableArea = document.getElementById("root");
  //   if (window.location.pathname === "/" || window.location.pathname.startsWith("/map/")) {
  //     draggableArea.style.overflow = "hidden";
  //   } else {
  //     draggableArea.style.overflow = "visible";
  //   }
  // }, [stateApp]);

  const updateApolloClient = (endpoint, token, idToken) => {
    let fetchOptions = { headers: {} };
    if (apolloClient && token) {
      fetchOptions = setApolloHeaders(apolloClient.link.options, token, idToken);
      fetchOptions.headers.batch = "true"
    }

    if (!apolloClient) {
      const httpLink = new HttpLink({ uri: endpoint, headers: {}, ...fetchOptions });
      const httpBatchLink = new BatchHttpLink({
        uri: endpoint,
        ...fetchOptions,
      });

      let client = new ApolloClient({
        link: split((operation) => operation.getContext().batch !== true, httpLink, httpBatchLink),
        cache: new InMemoryCache({
          typePolicies: {
            Query: {
              fields: {
                paginatedContacts: relayStylePagination(),
              },
            },
          },
        }),
        defaultOptions: {
          watchQuery: {
            fetchPolicy: "cache-and-network",
          },
        },
      });

      setApolloClient((state, props) => {
        return client;
      });
    }

    if (apolloClient && endpoint) {
      setApolloClient((state, props) => {
        const httpLink = new HttpLink({ uri: endpoint, headers: {}, ...fetchOptions });
        const httpBatchLink = new BatchHttpLink({
          uri: endpoint,
          ...fetchOptions,
        });

        return new ApolloClient({
          link: split((operation) => operation.getContext().batch !== true, httpLink, httpBatchLink),
          cache: state.cache,
          defaultOptions: state.defaultOptions,
        });
      });
    }
  };

  return (
    <ReduxProvider store={store}>
      <Notifications />
      <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
      <AppProvider>
        {apolloClient ? (
          <ApolloProvider client={apolloClient}>
            {/* <FeatureFlag feature={FEATURES.USERSNAP}>
              <UsersnapProvider />
            </FeatureFlag> */}
            <MuiThemeProvider theme={theme}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <ContactBulkProgress />
                <ConnectedRouter history={history}>
                  <DndProvider backend={HTML5Backend}>
                    <Switch>
                      <NavigationProvider>
                        <PrivateRoute
                          title="Map"
                          exact
                          path={["/", "/map/:type/:paramId", "/map/:type/:paramId/:lati/:longi"]}
                          component={MapProvider}
                        />
                        <Route exact path="/signup" component={SignUpCard} />
                        <Route exact path="/forgotpassword" component={ForgotPassword} />
                        <PrivateRoute exact path="/track" component={TrackProvider} />
                        <PrivateRoute path="/flow" component={TransactProvider} />
                        <PrivateRoute exact path="/documents" component={DocumentProvider} />
                        <PrivateRoute exact path="/documents/:documentId/view" component={DocumentProvider} />
                        <PrivateRoute path="/calendar" component={ActivitiesProvider} />
                        <PrivateRoute exact path="/title" component={TitleOpinionProvider} />
                        <PrivateRoute exact path="/alerts" component={AlertsProvider} />
                        <PrivateRoute exact path="/titleopinion" component={TitleOpinionProvider} />
                        <PrivateRoute title="Contacts" path="/contacts" component={ContactsProvider} />
                        <PrivateRoute title="Admin" path="/admin" component={AdminProvider} />
                        <PrivateRoute exact path="/contact/details/:contactId" component={ContactDetailsProvider} />
                        <PrivateRoute
                          exact
                          path="/contact/details/:contactId/detailedInformation"
                          component={ContactDetailedInfoProvider}
                        />
                        <PrivateRoute
                          exact
                          path="/contact/details/:contactId/recentActivites"
                          component={ContactRecentActivitiesProvider}
                        />
                        <PrivateRoute exact path="/contact/details/:contactId/documents" component={ContactDocumentsProvider} />
                        <PrivateRoute title="Analytics" path="/analytics" component={AnalyticsProvider} />
                        <PrivateRoute exact path="/contact/details/:contactId/wells" component={ContactWellInterestProvider} />
                        <PrivateRoute exact path="/contact/details/:contactId/parcels" component={ContactParcelsInterestProvider} />
                        <PrivateRoute
                          exact
                          path="/contact/details/:contactId/parcels/:parcelId"
                          component={ContactParcelsInterestDetailsProvider}
                        />
                        <PrivateRoute exact path="/contact/details/:contactId/units" component={ContactParcelsInterestProvider} />
                        {/* <PrivateRoute exact path="/contact/details/:contactId/units/:unitId" component={ContactParcelsInterestProvider} /> */}
                        <PrivateRoute
                          exact
                          path="/contact/details/:contactId/units/:unitId"
                          component={ContactUnitsInterestDetailsProvider}
                        />
                        {/* <PrivateRoute exact path="/contact/details/:contactId/deals" component={ContactDealsProvider} /> */}
                        <PrivateRoute exact path="/dashboard" component={DashboardProvider} />
                        <PrivateRoute exact path="/studio" component={StudioProvider} />
                        <PrivateRoute title="Bulk Upload" exact path={["/bulkupload", "/bulkupload/:type"]} component={BulkUpload} />
                        <PrivateRoute exact path="/agreement" component={AgreementProvider} />
                        <PrivateRoute title="Revenue Statements" path="/revenue" component={RevenueProvider} />
                        <PrivateRoute title="Land Management" path="/land" component={Land} />
                        <PrivateRoute exact path="/agreements" component={AgreementProvider} />
                        {/* <Route component={NotFoundRedirect} /> */}
                      </NavigationProvider>
                    </Switch>
                  </DndProvider>
                </ConnectedRouter>
              </MuiPickersUtilsProvider>
            </MuiThemeProvider>
          </ApolloProvider>
        ) : (
          <CircularProgress></CircularProgress>
        )}
      </AppProvider>
    </ReduxProvider>
  );
}

export default App;
