import { hookStateController } from 'stateManagement/hookStateController';

import { bypassTenants, simpleAuthBypass } from 'utils/data';

import { globalInitialState, globalState } from './initialStates';

const globalStateControllerHandler = state => ({
	setLayerLoading: (type, value) => {
		if (value !== globalState.layerLoading.get()[type]) {
			globalState.layerLoading.set({
				...globalState.layerLoading.get(),
				[type]: value,
			});
		}
	},
	setBypassLogin: tenant => {
		const bypass = simpleAuthBypass
			? { bypassLogin: true, bypassType: 'SimpleBypass' }
			: { bypassLogin: bypassTenants.includes(tenant.name), bypassType: 'Auth0Bypass' };
		if (bypass.bypassLogin) {
			globalStateController.updateState({ ...bypass, tenant });
		}
	},
	isAuth0Bypass: () => state.bypassType.get({ noproxy: true }) === 'Auth0Bypass',
	isBypassTenant: tenant => bypassTenants.map(t => t.toLowerCase()).includes(tenant.toLowerCase()),
	handleMyWellTestCase: (globalWellId, mongoWellId) => {
		if (globalStateController.getValue('cypress')) {
			globalStateController.updateState({
				testCase: {
					name: 'MyWellsNameUpdate',
					globalWellId,
					mongoWellId,
				},
			});
		}
	},
});

export const globalStateController = {
	...globalStateControllerHandler(globalState),
	...hookStateController(globalState, globalInitialState),
};
