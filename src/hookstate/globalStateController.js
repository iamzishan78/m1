import { hookstate } from '@hookstate/core';
import { copy } from 'components/Shared/functions';
import { hookStateController } from 'hookstate/hookStateController';
import { bypassTenants, simpleAuthBypass } from 'utils/data';

const initialState = {
	layers: [],
	panelItems: [],
	emptyGroups: [],
	universalLoader: false,
	layerLoading: {},
	user: null,
	apolloClientEndpoint: null,
	x_zumo_auth: null,
	cypress: null,
	testCase: null,
	bypassLogin: simpleAuthBypass || false,
	bypassType: '',
	tenant: null
};

export const globalState = hookstate(copy(initialState));

const globalStateControllerHandler = () => ({
	setLayerLoading: (type, value) => {
		if (value !== globalState.layerLoading.get()[type])
			globalState.layerLoading.set({
				...globalState.layerLoading.get(),
				[type]: value,
			});
	},
	setBypassLogin: tenant => {
		const bypass = simpleAuthBypass ? { bypassLogin: true, bypassType: 'SimpleBypass' } : { bypassLogin: bypassTenants.includes(tenant.name), bypassType: 'Auth0Bypass' }
		if (bypass.bypassLogin) {
			globalStateController.updateState({ ...bypass, tenant })
		}
	},
	isAuth0Bypass: () => globalStateController.getValue('bypassType') === 'Auth0Bypass',
	isBypassTenant: tenant => bypassTenants.map(t => t.toLowerCase()).includes(tenant.toLowerCase()),
	handleMyWellTestCase: (globalWellId, mongoWellId) => {
		if (globalStateController.getValue('cypress'))
			globalStateController.updateState({
				testCase: {
					name: 'MyWellsNameUpdate',
					globalWellId,
					mongoWellId
				},
			});
	}
});

export const globalStateController = {
	...globalStateControllerHandler(globalState),
	...hookStateController(globalState, initialState),
};
