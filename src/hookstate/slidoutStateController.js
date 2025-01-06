import { useHookstate } from '@hookstate/core';

import { hookStateController } from 'hookstate/hookStateController';

import { slidoutInitialState, slidoutState } from './initialStates';

export const useSlideoutState = () => useHookstate(slidoutState);
const slidoutStateControllerHandler = state => ({
	updateProps: newProps => {
		state.props.set(prevProps => ({ ...prevProps, ...newProps }));
	},
	updateActiveTabs: tab => {
		state.activeTabs[tab].set(value => !value);
	},
	updateTitle: newTitle => {
		state.title.set(newTitle);
	},
	showSlideout: () => {
		state.show.set(true);
	},
	hideSlideout: () => {
		state.show.set(false);
	},
	changeView: view => {
		state.view.set(view);
	},
	updateParent: newParent => {
		state.parentType.set(newParent);
	},
	updateNewEntity: newEntity => {
		state.newEntity.set(newEntity);
	},
	updateEntityLoading: isLoading => {
		state.isLoading.set(isLoading);
	},
});

export const slidoutStateController = {
	...slidoutStateControllerHandler(slidoutState),
	...hookStateController(slidoutState, slidoutInitialState),
};
