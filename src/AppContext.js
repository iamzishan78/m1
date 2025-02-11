import React, { useState, createContext, useEffect } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import PropTypes from 'prop-types';
import queryString from 'query-string';

import { globalStateController } from 'hookstate/globalStateController';
import { popupController } from 'hookstate/popupStateController';

import { apolloClientEndpointDev, isDev } from 'utils/helper';
import { UserSession } from 'utils/user';

import { MSALObj, tenantsCredentials } from './components/AzureLogin/AADAuthConfig';
import { MSALB2CObj, B2CTenantCredentials } from './components/AzureLogin/AADB2CAuthConfig';

const AppContext = createContext([{}, () => {}]);

const AppProvider = props => {
	const [stateApp, setStateApp] = useState({
		myMSALObj: null,
		myMSALB2CObj: null,

		apolloClientEndpoint: '',
		apolloClientFetchOptions: null,
		graphqlScope: null, /// potentially login context?
		user: globalStateController.getValue('user') || null, /// potenitally login context or maybe a specific user context??
		signUpUserType: null, /// potenitally login context or maybe a specific user context??
		wellDetailCardOpen: null, // move to map data card context
		wellDetailCardTabIndex: null,
		parcelDetailCardOpen: false, // move to map data card context
		trackedwells: null, // move to a grid context or query context
		trackedOwnerWells: null, // move to a grid context or query context
		selectedWell: null, // move to a selected object context (maybe flyto)
		selectedWellId: null, // move to a selected object context (maybe flyto)
		selectedAbstracts: [], // move to a selected object context (maybe flyto)

		// States for permits
		selectedPermit: null,
		selectedPermitDetails: null,
		selectedPermitId: null,
		permitSelectedCoordinates: [],

		selectedAoi: null,

		customLayers: [],

		// should be in a draw context
		editDraw: false,
		isDrawing: false,
		shapeEdit: false,
		showDrawShapesPopup: false,
		showShapeActionsPopup: false,

		openDrawShapesControl: false,

		editLayer: true,
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
		trackedWellArray: [],
		// userSnap: false,

		// MAP CONTEXT vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
		wellSelectedCoordinates: [],
		universalCircularLoaderAct: false, //// set it to true to show a loader in the center of the viewport

		//Map State
		mapCircularLoaderAct: false,
		mapboxglAccessToken: 'pk.eyJ1IjoibTFuZXJhbCIsImEiOiJja2V6MHd2bnQwYzRqMnlwaTV6ejU2cTMyIn0.ghyrh-G8uQtyg4N4VcfTOw',
		selectedWellApi: null,
		searchLayerIndex: null,
		trackedOwnersLayerIndex: null,
		trackedWellsLayerIndex: null,
		tagsLayerIndex: null,
		checkedLayers: [2, 5],
		wellsLayerIndex: null,
		checkedUserDefinedLayers: [],
		checkedFileLayers: [],
		tempCheckedUserDefinedLayer: null,
		checkedUserDefinedLayersInteraction: [0, 1, 2, 3, 4, 5, 6],
		checkedFileLayersInteraction: [],
		editingUserDefinedLayers: [],
		checkedLayersInteraction: [0, 1, 2],
		openWellDetails: false,
		sourceLoaded: false,
		map: null, // move to a map context
		draw: null,
		zoomFault: null,
		hugeRequest: null,
		currentFeature: undefined,
		landGridListFromSearch: [],
		wellListFromTagsFilter: [],
		viewportWells: null,
		minZoomToQueryViewport: 12.5,
		activateWellDetailsFromTable: false,
		contactUpdated: null,
		currentContatcAtivities: [],
		dealDisplayType: 'board',
		activityDisplayType: 'calendar',
		prevAOIVisible: false,
		prevParcelVisible: false,
		prevBasinVisible: false,
		DocumentDrawer: false,
		selectedDocument: {},
		transactBarView: 'Deal',
		multiSelectLandGrids: false,
		isAbstractedLayersPolygon: false,
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
			const isBypassTenant = globalStateController.isBypassTenant(tenantName);

			let tenant = tenantsCredentials(tenantName);
			if (tenant && !query.tenant) {
				UserSession.setStorageItem('tenantName', tenantName);

				tenant.apolloOriginalClientEndpoint = tenant.apolloClientEndpoint;
				tenant.apolloClientEndpoint =
					isDev && tenantName === 'localhost' ? apolloClientEndpointDev : tenant.apolloClientEndpoint;

				let myMSALObjInt = isBypassTenant ? null : MSALObj(tenant);
				globalStateController.updateState({ apolloClientEndpoint: tenant.apolloClientEndpoint });
				setStateApp(state => {
					return {
						...state,
						myMSALObj: myMSALObjInt,
						apolloOriginalClientEndpoint: tenant.apolloOriginalClientEndpoint,
						apolloClientEndpoint: tenant.apolloClientEndpoint,
						graphqlScope: tenant.graphqlScope,
					};
				});
			} else {
				setStateApp(state => {
					return { ...state, myMSALObj: false };
				});
			}

			let B2CTenantName = UserSession.getStorageItem('B2CTenantName');

			if (B2CTenantName) {
				let tenant = B2CTenantCredentials(B2CTenantName);
				if (tenant) {
					let myMSALB2CObjInt = MSALB2CObj(tenant.tenantId, tenant.clientId);
					setStateApp(state => {
						return {
							...state,
							myMSALB2CObj: myMSALB2CObjInt,
							apolloClientEndpoint: tenant.apolloClientEndpoint,
						};
					});
				}
			} else {
				setStateApp(state => {
					return { ...state, myMSALB2CObj: false };
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

const setApolloHeaders = (config, authToken, idToken) => {
	if (!config) {
		config = {};
	}
	if (!config.headers) {
		config.headers = {};
	}
	config.headers['X-ZUMO-AUTH'] = authToken;
	if (isDev || globalStateController.getValue('bypassLogin')) {
		config.headers['X-MS-TOKEN-AAD-ID-TOKEN'] = idToken;
	}
	return config;
};

AppProvider.propTypes = {
	children: PropTypes.node,
};

export { AppContext, AppProvider, setApolloHeaders, apolloClientEndpointDev };
