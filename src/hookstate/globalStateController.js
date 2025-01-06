import { bypassTenants, simpleAuthBypass } from 'utils/data';

import { globalInitialState } from './initialStates';
import { StateController } from './stateController'; // Import your StateController class

class GlobalStateController extends StateController {
	constructor(initialState) {
		super(initialState);
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
