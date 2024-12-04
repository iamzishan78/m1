import { hookStateController } from 'hookstate/hookStateController';
import { detailCardInitialState, detailCardState } from './initialStates';

const detailCardControllerHandler = state => ({
	initialize: (stateToUpdate = {}) => {
		state.set({
			...detailCardInitialState,
			...stateToUpdate,
		});
	},
	updateProps: props => {
		detailCardController.updateState({
			props: {
				...(detailCardController.getValue('props') || {}),
				...props,
			},
		});
	},

	togglePullout: () => {
		state.shrinkRightColumn.set(!detailCardState.shrinkRightColumn.get({ noproxy: true }));
	},

	setBaseSelectedTab: tab => {
		if (tab !== state.baseTabKey.get()) state.baseTabKey.set(tab);
	},
	setBottomSelectedTab: tab => {
		if (tab !== state.bottomTabKey.get()) state.bottomTabKey.set(tab);
	},
});

export const detailCardController = {
	...detailCardControllerHandler(detailCardState),
	...hookStateController(detailCardState, detailCardInitialState),
};
