import { hookStateController } from 'hookstate/hookStateController';
import { mapControls, mapControlsInitialState } from './initialStates';



const mapControlsControllerHandler = (state) => ({
	toggleSpeedDial: () => {
		state.openSpeedDial.set(!state.openSpeedDial.get({ noproxy: true }))
	},
	toggleMapGridCardAtived: () => {
		state.mapGridCardActivated.set(!state.mapGridCardActivated.get({ noproxy: true }));
	},
});

export const mapControlsController = {
	...mapControlsControllerHandler(mapControls),
	...hookStateController(mapControls, mapControlsInitialState),
};
