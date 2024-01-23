import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
//components
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// pick a date util library

//graphQL - queries in ./graphQL example usage in ./components/Maps.js
import { useApolloClient } from "@apollo/client";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./store";

import { globalStateController } from "hookstate/globalStateController";
import Providers from "Providers";
import { CircularProgress } from "@material-ui/core";

const Login = React.lazy(() => import('./components/Login/Login'));
const SignUpCard = React.lazy(() => import('./components/Login/SignUpCard'));
const ForgotPassword = React.lazy(() => import('./components/Login/ForgotPassword'));
const NavigationProvider = React.lazy(() => import('./components/Navigation/NavigationProvider'));
const MapProvider = React.lazy(() => import('./components/Map/MapProvider'));
const TrackProvider = React.lazy(() => import('./components/Track/TrackProvider'));
const TransactProvider = React.lazy(() => import('./components/Transact/TransactProvider'));
const DocumentProvider = React.lazy(() => import('./components/Document/DocumentProvider'));
const TitleOpinionProvider = React.lazy(() => import('./components/TitleOpinion/TitleOpinionProvider'));
const ContactsProvider = React.lazy(() => import('./components/Contacts/ContactsProvider'));
const ContactDetailsProvider = React.lazy(() => import('./components/ContactDetailCard/ContactDetailsProvider'));
// const ContactDealsProvider = React.lazy(() => import('./components/DealsDetailCard/ContactDealsProvider'));
const ContactParcelsInterestProvider = React.lazy(() => import('./components/ParcelsDetailCard/ContactParcelsInterestProvider'));
const ContactParcelsInterestDetailsProvider = React.lazy(() => import('./components/ParcelsDetailCard/ContactParcelsInterestDetailsProvider'));
const ContactUnitsInterestDetailsProvider = React.lazy(() => import('./components/ShapeDetailCard/Unit/ContactUnitsInterestDetailsProvider'));
const ContactWellInterestProvider = React.lazy(() => import('./components/ContactDetailCard/components/ContactsWellInterestsParcelInterests/ContactWellInterestProvider'));
const ContactDocumentsProvider = React.lazy(() => import('./components/ViewDocuments/ContactDocumentsProvider'));
const ContactDetailedInfoProvider = React.lazy(() => import('./components/ContactDetailedInfo/ContactDetailedInfoProvider'));
const ContactRecentActivitiesProvider = React.lazy(() => import('./components/RecentActivities/ContactRecentActivitiesProvider'));
const AlertsProvider = React.lazy(() => import('./components/Alerts/AlertsProvider'));
const DashboardProvider = React.lazy(() => import('./components/Dashboard/DashboardProvider'));
const StudioProvider = React.lazy(() => import('./components/Studio/StudioProvider'));
const BulkUpload = React.lazy(() => import('./components/BulkUpload/BulkUpload'));
const ActivitiesProvider = React.lazy(() => import('./components/Activities/ActivitiesProvider'));
const RevenueProvider = React.lazy(() => import('./components/Revenue/RevenueProvider'));
const Land = React.lazy(() => import('./components/Land'));
const AgreementProvider = React.lazy(() => import('./components/Land/components/Agreements/AgreementProvider'));
const AnalyticsProvider = React.lazy(() => import('components/Analytics/AnalyticsProvider'));
const AdminProvider = React.lazy(() => import('components/Admin/AdminProvider'));

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
  return (
    <Providers>
      <Suspense fallback={
        <div style={{ marginTop: "20%", marginLeft: "47%" }}>
          <CircularProgress size={80} disableShrink color="secondary" />
        </div>
      }>
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
      </Suspense>
    </Providers>
  );
}

export default App;
