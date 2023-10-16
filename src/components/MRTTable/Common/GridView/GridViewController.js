import { hookstate, useHookstate } from '@hookstate/core';

export const gridViewStates = hookstate({});

export const useGridViewStates = () => useHookstate(gridViewStates);

const gridViewStatesControllerHandler = state => ({
	initialize: ({ esIndex, selectedGridView }) => {
		state[esIndex].set({
			esIndex,
			showViewModal: false,
			showSaveAsNew: false,
			selectedGridView,
		});
	},

	updateState: (esIndex, _state) => {
		state[esIndex]?.merge(_state);
	},
});

export const gridViewStatesController = gridViewStatesControllerHandler(gridViewStates);
