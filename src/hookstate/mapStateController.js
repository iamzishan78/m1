import { hookStateController } from 'hookstate/hookStateController';
import { mapState, mapStateInitialState } from './initialStates';

const mapStateControllerHandler = state => ({
	moved: () => {
		state.moved.set(!state.moved.get({ noproxy: true }));
	},
});

export const mapStateController = {
	...mapStateControllerHandler(mapState),
	...hookStateController(mapState, mapStateInitialState),
};
