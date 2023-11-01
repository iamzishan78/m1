import { hookstate } from '@hookstate/core';
import { hookStateController } from 'hookstate/hookStateController';
import { copy } from 'utils/helper';

const initialState = {
	show: false,
	views: [],
	parentId: '',
	view: {},
	props: {},
	activeTabs: { Grid: false, Map: false },
	title: '',
	formMode: '',
};

export const slidoutState = hookstate(copy(initialState));

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
});

export const slidoutStateController = {
	...slidoutStateControllerHandler(slidoutState),
	...hookStateController(slidoutState, initialState),
};
