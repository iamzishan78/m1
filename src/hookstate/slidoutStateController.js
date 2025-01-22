import { StateController } from './stateController';

import { slidoutInitialState } from './initialStates';

class SlidoutStateController extends StateController {
	constructor(initialState) {
		super(initialState);
	}

	updateProps(newProps) {

		this.updateState({ props: { ...this.getValue('props'), ...newProps } });
	}

	updateActiveTabs(tab) {
		const activeTabs = this.getValue('activeTabs')
		activeTabs[tab] = !activeTabs[tab];
		this.updateState({ activeTabs });
	}

	updateTitle(newTitle) {
		this.updateState({ title: newTitle });
	}

	showSlideout() {
		this.updateState({ show: true });
	}

	hideSlideout() {
		this.updateState({ show: false });
	}

	changeView(view) {
		this.updateState({ view });
	}

	updateParent(newParent) {
		this.updateState({ parentType: newParent });
	}

	updateNewEntity(newEntity) {
		this.updateState({ newEntity });
	}

	updateEntityLoading(isLoading) {
		this.updateState({ isLoading });
	}
}

export const slidoutStateController = new SlidoutStateController(slidoutInitialState);