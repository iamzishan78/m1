import { hookStateController } from 'hookstate/hookStateController';
import { bypassTenants, simpleAuthBypass } from 'utils/data';
import { globalInitialState, globalState } from './initialStates';
import update from 'immutability-helper';

const globalStateControllerHandler = state => ({
	setLayerLoading: (type, value) => {
		if (value !== globalState.layerLoading.get()[type])
			globalState.layerLoading.set({
				...globalState.layerLoading.get(),
				[type]: value,
			});
	},
	setBypassLogin: tenant => {
		const bypass = simpleAuthBypass
			? { bypassLogin: true, bypassType: 'SimpleBypass' }
			: { bypassLogin: bypassTenants.includes(tenant.name), bypassType: 'Auth0Bypass' };
		if (bypass.bypassLogin) {
			globalStateController.updateState({ ...bypass, tenant });
		}
	},

	generateUpdateFn: (layers, value, currentLayers, field) => {
		const updatefn = {};
		layers.forEach(layer => {
			if (layer.type === 'group') {
				layer.layers.forEach(l => {
					const layerIndex = currentLayers.findIndex(clayer => clayer.identifier === l.identifier);
					if (layerIndex !== -1) {
						if (field === 'showable') {
							updatefn[layerIndex] = { layerSettings: { [field]: { $set: value } } };
						} else {
							updatefn[layerIndex] = { [field]: { $set: value } };
						}
					}
				});
			} else {
				const layerIndex = currentLayers.findIndex(clayer => clayer.identifier === layer.identifier);
				if (layerIndex !== -1) {
					if (field === 'showable') {
						updatefn[layerIndex] = { layerSettings: { [field]: { $set: value } } };
					} else {
						updatefn[layerIndex] = { [field]: { $set: value } };
					}
				}
			}
		});
		return updatefn;
	},

	updateProjectedLayers: ({ layer, value, field }) => {
		const projectedLayers = globalState.projectedLayers.get({ noproxy: true });
		const updatefn = globalStateController.generateUpdateFn([layer], value, projectedLayers, field);

		globalStateController.updateState({ projectedLayers: update(projectedLayers, updatefn) });
	},

	isAuth0Bypass: () => state.bypassType.get({ noproxy: true }) === 'Auth0Bypass',
	isBypassTenant: tenant => bypassTenants.map(t => t.toLowerCase()).includes(tenant.toLowerCase()),
	handleMyWellTestCase: (globalWellId, mongoWellId) => {
		if (globalStateController.getValue('cypress'))
			globalStateController.updateState({
				testCase: {
					name: 'MyWellsNameUpdate',
					globalWellId,
					mongoWellId,
				},
			});
	},
});

export const globalStateController = {
	...globalStateControllerHandler(globalState),
	...hookStateController(globalState, globalInitialState),
};
