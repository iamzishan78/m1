import { StateController } from './stateController';

const slidoutInitialState = {
	show: false,
	views: [],
	parentId: '',
	view: null,
	props: {},
	activeTabs: { Grid: false, Map: false },
	title: '',
	formMode: '',
	newEntity: false,
	selectedActivity: null,
	selectedActivityId: '',
	newComments: [],
	loader: false,
};

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