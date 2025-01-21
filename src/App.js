import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { useApolloClient } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';

import AdminProvider from 'components/Admin/AdminProvider';
import AnalyticsProvider from 'components/Analytics/AnalyticsProvider';
import DataProvider from 'components/Data/DataProvider';
import Land from 'components/Land';
import RevenueProvider from 'components/Revenue/RevenueProvider';

import { globalStateController } from 'hookstate/globalStateController';

import { UserSession } from 'utils/user';

import Providers from 'Providers';

import ActivitiesProvider from './components/Activities/ActivitiesProvider';
import AlertsProvider from './components/Alerts/AlertsProvider';
import Auth0Login from './components/Auth0Login';
import AzureLogin from './components/AzureLogin';
import ForgotPassword from './components/AzureLogin/ForgotPassword';
import SignUpCard from './components/AzureLogin/SignUpCard';
import BulkUpload from './components/BulkUpload/BulkUpload';
import ContactDetailsProvider from './components/ContactDetailCard/ContactDetailsProvider';
import ContactDetailedInfoProvider from './components/ContactDetailedInfo/ContactDetailedInfoProvider';
import ContactsProvider from './components/Contacts/ContactsProvider';
import DashboardProvider from './components/Dashboard/DashboardProvider';
import DocumentProvider from './components/Document/DocumentProvider';
import AgreementProvider from './components/Land/components/Agreements/AgreementProvider';
import MapProvider from './components/Map/MapProvider';
import NavigationProvider from './components/Navigation/NavigationProvider';
import StudioProvider from './components/Studio/StudioProvider';
import TitleOpinionProvider from './components/TitleOpinion/TitleOpinionProvider';
import TransactProvider from './components/Transact/TransactProvider';
import ContactDocumentsProvider from './components/ViewDocuments/ContactDocumentsProvider';
import { history } from './store';

const PrivateRoute = ({ component, ...options }) => {
	const user = globalStateController.getValue('user');
	globalStateController.useState(['bypassLogin', 'bypassType']);
	const { isAuthenticated } = useAuth0();

	const userSessionIsLoaded = useSelector(({ session }) => session.isLoaded);
	const apolloClient = useApolloClient();

	if (user && Date.parse(user.authTokenExpires) < Date.now()) {
		UserSession.deleteSession();
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
							<PrivateRoute exact path="/contact/details/:contactId/documents" component={ContactDocumentsProvider} />
							<PrivateRoute title="Analytics" path="/analytics" component={AnalyticsProvider} />
							<PrivateRoute title="Data" path="/data" component={DataProvider} />
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

PrivateRoute.propTypes = {
	component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]).isRequired,
	options: PropTypes.object,
};
