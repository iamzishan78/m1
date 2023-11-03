import { hookstate } from '@hookstate/core';
import { copy } from 'components/Shared/functions';
import { hookStateController } from 'hookstate/hookStateController';

const initialState = {
	layers: [],
	universalLoader: false,
	layerLoading: {},
	user: null,
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
});

export const globalStateController = {
	...globalStateControllerHandler(globalState),
	...hookStateController(globalState, initialState),
};
