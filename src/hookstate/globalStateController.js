import { hookstate } from '@hookstate/core';
import { copy } from 'components/Shared/functions';
import { hookStateController } from 'hookstate/hookStateController';
import { bypassTenants } from 'utils/data';

const initialState = {
	layers: [],
	universalLoader: false,
	layerLoading: {},
	user: null,
	bypassLogin: false,
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
	setBypassLogin: tenant =>
		globalState.bypassLogin.set(bypassTenants.includes(tenant?.toLowerCase?.())),
});

export const globalStateController = {
	...globalStateControllerHandler(globalState),
	...hookStateController(globalState, initialState),
};
