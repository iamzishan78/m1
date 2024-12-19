import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
//components
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Auth0Login from './components/Auth0Login';
import AzureLogin from './components/AzureLogin';
import SignUpCard from './components/AzureLogin/SignUpCard';
import ForgotPassword from './components/AzureLogin/ForgotPassword';
import NavigationProvider from './components/Navigation/NavigationProvider';
import MapProvider from './components/Map/MapProvider';
import TrackProvider from './components/Track/TrackProvider';
import TransactProvider from './components/Transact/TransactProvider';
import DocumentProvider from './components/Document/DocumentProvider';
import TitleOpinionProvider from './components/TitleOpinion/TitleOpinionProvider';
import ContactsProvider from './components/Contacts/ContactsProvider';
import ContactDetailsProvider from './components/ContactDetailCard/ContactDetailsProvider';
// import ContactDealsProvider from "./components/DealsDetailCard/ContactDealsProvider";
import ContactParcelsInterestProvider from './components/ParcelsDetailCard/ContactParcelsInterestProvider';
import ContactParcelsInterestDetailsProvider from './components/ParcelsDetailCard/ContactParcelsInterestDetailsProvider';
import ContactUnitsInterestDetailsProvider from './components/ShapeDetailCard/Unit/ContactUnitsInterestDetailsProvider';
import ContactDocumentsProvider from './components/ViewDocuments/ContactDocumentsProvider';
import ContactDetailedInfoProvider from './components/ContactDetailedInfo/ContactDetailedInfoProvider';
import ContactRecentActivitiesProvider from './components/RecentActivities/ContactRecentActivitiesProvider';
import AlertsProvider from './components/Alerts/AlertsProvider';
import DashboardProvider from './components/Dashboard/DashboardProvider';
import StudioProvider from './components/Studio/StudioProvider';
import BulkUpload from './components/BulkUpload/BulkUpload';
import ActivitiesProvider from './components/Activities/ActivitiesProvider';
import RevenueProvider from 'components/Revenue/RevenueProvider';
import Land from 'components/Land';
import AgreementProvider from './components/Land/components/Agreements/AgreementProvider';
// pick a date util library

//graphQL - queries in ./graphQL example usage in ./components/Maps.js
import { useApolloClient } from '@apollo/client';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store';
import AnalyticsProvider from 'components/Analytics/AnalyticsProvider';
import AdminProvider from 'components/Admin/AdminProvider';
import { globalStateController } from 'hookstate/globalStateController';
import Providers from 'Providers';
import { useAuth0 } from '@auth0/auth0-react';

const PrivateRoute = ({ component, ...options }) => {
	const user = globalStateController.getValue('user');
	globalStateController.useState(['bypassLogin', 'bypassType']);
	const { isAuthenticated } = useAuth0();

	const userSessionIsLoaded = useSelector(({ session }) => session.isLoaded);
	const apolloClient = useApolloClient();

	if (user && Date.parse(user.authTokenExpires) < Date.now()) {
		sessionStorage.clear();
		window.location.replace(window.location.origin);
		// setStateApp((stateApp) => ({ ...stateApp, user: null }));
		// setStateNav((stateNav) => ({ ...stateNav, defaultOn: false }));
	}

	const finalComponent =
		user &&
		(Date.parse(user.authTokenExpires) > Date.now() || (globalStateController.isAuth0Bypass() && isAuthenticated)) &&
		apolloClient &&
		userSessionIsLoaded
			? component
			: globalStateController.isAuth0Bypass()
				? Auth0Login
				: AzureLogin;

	return (
		<div>
			<Route {...options} render={props => React.createElement(finalComponent, { ...options, ...props })} />
		</div>
	);
};

function App() {
	return (
		<Providers>
			<ConnectedRouter history={history}>
				<DndProvider backend={HTML5Backend}>
					<Switch>
						<NavigationProvider>
							<PrivateRoute
								title="Map"
								exact
								path={['/', '/map/:type/:paramId', '/map/:type/:paramId/:lati/:longi']}
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
							<PrivateRoute title="Admin" path={['/admin', '/admin/bulk-editing/:jobId']} component={AdminProvider} />
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
							<PrivateRoute
								exact
								path="/contact/details/:contactId/parcels"
								component={ContactParcelsInterestProvider}
							/>
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
							<PrivateRoute
								title="Bulk Upload"
								exact
								path={['/bulkupload', '/bulkupload/:type']}
								component={BulkUpload}
							/>
							<PrivateRoute exact path="/agreement" component={AgreementProvider} />
							<PrivateRoute title="Statements" path="/revenue" component={RevenueProvider} />
							<PrivateRoute title="Land Management" path="/land" component={Land} />
							<PrivateRoute exact path="/agreements" component={AgreementProvider} />
							{/* <Route component={NotFoundRedirect} /> */}
						</NavigationProvider>
					</Switch>
				</DndProvider>
			</ConnectedRouter>
		</Providers>
	);
}

export default App;
