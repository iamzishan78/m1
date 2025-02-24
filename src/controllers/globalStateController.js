import { bypassTenants, simpleAuthBypass } from 'utils/data';

import { StateController } from './stateController'; // Import your StateController class

export const globalInitialState = {
	panelItems: [],
	emptyGroups: [],
	globalSearch: '',
	universalLoader: false,
	layerLoading: {},
	user: null,
	reFetchedLayer: null /* ? */,
	mapReady: false,
	showFieldModal: false,
	apolloClientEndpoint: null,
	x_zumo_auth: null,
	cypress: null,
	testCase: null,
	bypassLogin: simpleAuthBypass || false,
	bypassType: '',
	tenant: null,
	selectedIconTpe: 'Chip',
	onMapLoad: null,
	editIconState: {},
};

class GlobalStateController extends StateController {
	constructor(initialState) {
		super(initialState, GlobalStateController.name);
		this.autoBind(this);
	}

	setLayerLoading(type, value) {
		const currentLayerLoading = this.getValue('layerLoading');
		if (value !== currentLayerLoading[type]) {
			this.updateState({
				layerLoading: {
					...currentLayerLoading,
					[type]: value,
				},
			});
		}
	}

	setBypassLogin(tenant) {
		const bypass = simpleAuthBypass
			? { bypassLogin: true, bypassType: 'SimpleBypass' }
			: {
					bypassLogin: bypassTenants.includes(tenant.name),
					bypassType: 'Auth0Bypass',
				};

		if (bypass.bypassLogin) {
			this.updateState({ ...bypass, tenant });
		}
	}

	isAuth0Bypass() {
		return this.getValue('bypassType') === 'Auth0Bypass';
	}

	isBypassTenant(tenant) {
		return bypassTenants.map(t => t.toLowerCase()).includes(tenant.toLowerCase());
	}

	handleMyWellTestCase(globalWellId, mongoWellId) {
		if (this.getValue('cypress')) {
			this.updateState({
				testCase: {
					name: 'MyWellsNameUpdate',
					globalWellId,
					mongoWellId,
				},
			});
		}
	}
}

export const globalStateController = new GlobalStateController(globalInitialState);
