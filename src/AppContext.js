import React, { useState, createContext, useEffect } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import PropTypes from 'prop-types';
import queryString from 'query-string';

import { tenantsCredentials } from 'components/Auth0Login/helpers';

import { globalStateController } from 'stateManagement/globalStateController';
import { popupController } from 'stateManagement/popupStateController';

import { apolloClientEndpointDev, isDev } from 'utils/helper';
import { UserSession } from 'utils/user';

const AppContext = createContext([{}, () => {}]);

const AppProvider = props => {
	const [stateApp, setStateApp] = useState({
		apolloClientEndpoint: '',
		graphqlScope: null, /// potentially login context?
		user: globalStateController.getValue('user') || null, /// potenitally login context or maybe a specific user context??
		signUpUserType: null, /// potenitally login context or maybe a specific user context??
		wellDetailCardTabIndex: null,
		selectedWell: null, // move to a selected object context (maybe flyto)
		selectedWellId: null, // move to a selected object context (maybe flyto)
		selectedAbstracts: [], // move to a selected object context (maybe flyto)

		// States for permits
		selectedPermit: null,
		selectedPermitId: null,
		permitSelectedCoordinates: [],

		selectedAoi: null,

		// should be in a draw context
		editDraw: false,
		isDrawing: false,
		shapeEdit: false,
		showDrawShapesPopup: false,
		showShapeActionsPopup: false,

		owners: null,
		popupOpen: false, //map used in flyto
		expandedCard: false, // probably need in a map card context
		flyTo: null, //map used in flyto
		fitBounds: null, //map used in fitBounds
		selectedTitleOpinionId: null,
		selectedUserDefinedLayer: null,
		featureOrMapShape: {},
		filters: [], // map filter context
		filtersMockDb: null,
		filtersAdd: null,
		filtersOnOff: null,
		filtersDefaultOnoff: null,
		filterSelectAllAbstract: false,
		selectedContact: null,

		// MAP CONTEXT vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
		wellSelectedCoordinates: [],
		universalCircularLoaderAct: false, //// set it to true to show a loader in the center of the viewport

		//Map State
		mapCircularLoaderAct: false,
		mapboxglAccessToken: 'pk.eyJ1IjoibTFuZXJhbCIsImEiOiJja2V6MHd2bnQwYzRqMnlwaTV6ejU2cTMyIn0.ghyrh-G8uQtyg4N4VcfTOw',
		selectedWellApi: null,
		openWellDetails: false,
		map: null, // move to a map context
		draw: null,
		zoomFault: null,
		hugeRequest: null,
		currentFeature: undefined,
		landGridListFromSearch: [],
		wellListFromTagsFilter: [],
		viewportWells: null,
		contactUpdated: null,
		currentContatcAtivities: [],
		dealDisplayType: 'board',
		activityDisplayType: 'calendar',
		DocumentDrawer: false,
		selectedDocument: {},
		transactBarView: 'Deal',
		multiSelectLandGrids: false,
		contactSearchQuery: '',
		activitySearchQuery: '',
		documentSearchQuery: '',
		isContactSearching: false,
		landSearchQuery: '',
		isLandSearching: false,
		viewDoc: null,
		pdfView: null,
		selectedAgreement: null,
		selectedView: null,
		revenueSearchQuery: '',
		filtersData: [],
		shapeEditMode: '',
		landSearchFilters: {
			provisions: [],
			customData: [],
			relatedWells: [],
			relatedAgreements: [],
			relatedDocuments: [],
		},

		selectedShape: popupController.getValue('selectedShape'),
	});

	window.setStateApp = setStateApp;

	useEffect(() => {
		async function wait() {
			const query = queryString.parse(window.location.search);

			let tenantName = query.tenant || UserSession.getStorageItem('tenantName') || '';

			let tenant = tenantsCredentials(tenantName);
			if (tenant && !query.tenant) {
				UserSession.setStorageItem('tenantName', tenantName);

				tenant.apolloOriginalClientEndpoint = tenant.apolloClientEndpoint;
				tenant.apolloClientEndpoint =
					isDev && tenantName === 'localhost' ? apolloClientEndpointDev : tenant.apolloClientEndpoint;

				globalStateController.updateState({ apolloClientEndpoint: tenant.apolloClientEndpoint });
				setStateApp(state => {
					return {
						...state,
						apolloOriginalClientEndpoint: tenant.apolloOriginalClientEndpoint,
						apolloClientEndpoint: tenant.apolloClientEndpoint,
						graphqlScope: tenant.graphqlScope,
					};
				});
			}
		}
		wait();
	}, []);

	useEffect(() => {
		globalStateController.updateState({ user: stateApp.user });
	}, [stateApp.user]);

	const { globalState } = globalStateController.useState(['universalLoader'], 'globalState');

	return (
		<AppContext.Provider value={[stateApp, setStateApp]}>
			{props.children}
			{(stateApp.universalCircularLoaderAct || globalState.universalLoader) && (
				<div
					style={{
						position: 'fixed',
						top: '0',
						left: '0',
						height: '100vh',
						width: '100vw',
						zIndex: '10000000000',
					}}
				>
					<>
						<CircularProgress
							style={{
								position: 'fixed',
								top: 'calc(50vh - 16px)',
								left: 'calc(50vw - 40px)',
								color: '#12ABE0',
							}}
							size={80}
							disableShrink
						/>

						{globalState.universalLoader.text && (
							<h3
								style={{
									position: 'fixed',
									top: 'calc(50vh + 64px)',
									left: 'calc(50vw - 64px)',
									...globalState.universalLoader.textStyles,
								}}
							>
								{globalState.universalLoader.text}
							</h3>
						)}
					</>
				</div>
			)}
		</AppContext.Provider>
	);
};

const setApolloHeaders = (config, idToken) => {
	if (!config) {
		config = {};
	}
	if (!config.headers) {
		config.headers = {};
	}
	config.headers['ID-TOKEN'] = idToken;
	return config;
};

AppProvider.propTypes = {
	children: PropTypes.node,
};

export { AppContext, AppProvider, setApolloHeaders, apolloClientEndpointDev };
