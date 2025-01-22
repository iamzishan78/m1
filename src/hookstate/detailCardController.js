
import { detailCardInitialState } from './initialStates';
import { StateController } from './stateController';

class DetailCardController extends StateController {
	constructor(initialState) {
		super(initialState);
	}

	initialize(stateToUpdate = {}) {
		this.updateState({
			...detailCardInitialState,
			...stateToUpdate,
		});
	}

	updateProps(props) {
		this.updateState({
			props: {
				...(this.getValue('props') || {}),
				...props,
			},
		});
	}

	togglePullout() {
		const shrinkRightColumn = !this.getValue('shrinkRightColumn');
		this.updateState({ shrinkRightColumn });
	}

	setBaseSelectedTab(tab) {
		if (tab !== this.getValue('baseTabKey')) {
			this.updateState({ baseTabKey: tab });
		}
	}

	setBottomSelectedTab(tab) {
		if (tab !== this.getValue('bottomTabKey')) {
			this.updateState({ bottomTabKey: tab });
		}
	}
}

export const detailCardController = new DetailCardController(detailCardInitialState);