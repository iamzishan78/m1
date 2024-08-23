import mapboxgl from 'mapbox-gl';
import { hookStateController } from 'hookstate/hookStateController';
import { findBoundsMap } from 'components/MapControls/commonHelper';
import {
	drawBoundary,
	drawWellBoundary,
} from 'components/MapControls/components/DrawShapes/drawShapesHelpers';
import { layerController } from './layerStateController';
import { popupInitialState, popupState } from './initialStates';

const popupStateControllerHandler = state => ({
	createPopUp: (currentFeature, paramId) => {
		if (!window.mapRef || !currentFeature?.longitude || !currentFeature?.latitude) return;

		const coordinates = [currentFeature.longitude, currentFeature.latitude];

		const popUps = document.getElementsByClassName('mapboxgl-popup');

		if (popUps[0]) {
			popUps[0].remove();
		}
		new mapboxgl.Popup({ offset: 0, closeOnClick: false })
			.setLngLat(coordinates)
			.setMaxWidth('none')
			.setHTML(`<div id="popupContainer"></div>`)
			.addTo(window.mapRef);

		// eslint-disable-next-line no-use-before-define
		popupController.updateState({
			expandedCard: !!(currentFeature.id && currentFeature.id === paramId),
		});
	},
	createUDPopUp: currentFeature => {
		if (!window.mapRef) return;

		let coordinates = currentFeature.shapeCenter;
		if (typeof currentFeature.shapeCenter === 'string') {
			coordinates = JSON.parse(currentFeature.shapeCenter);
		}
		const popUps = document.getElementsByClassName('mapboxgl-popup');
		if (popUps[0]) {
			popUps[0].remove();
		}
		if (coordinates)
			new mapboxgl.Popup({ offset: 0, closeOnClick: false })
				.setLngLat(coordinates)
				.setMaxWidth('none')
				.setHTML(`<div id="popupContainer"></div>`)
				.addTo(window.mapRef);
	},
	fitParcelBounds: () =>
		findBoundsMap(
			[popupState?.selectedParcel?.get({ noproxy: true })?.feature],
			window.mapRef
		),
	fitWellBounds: (wellFeature) => {
		const selectedWell = wellFeature || popupState?.selectedWell?.get({ noproxy: true });

		// mathematical formula for screen fit
		const alpha = 0.01;
		if (typeof selectedWell?.longitude !== 'undefined') {
			const bbox = [
				[selectedWell.longitude - 1.5 * alpha, selectedWell.latitude],
				[selectedWell.longitude + 0.5 * alpha, selectedWell.latitude],
			];

			// map may be null when wellDetailCard is launched from somewhere else
			try {
				window.mapRef?.fitBounds(bbox, {
					easing: () => 1,
				});
			} catch (e) {
				//
			}
		}
	},
	reset: () => {
		state.set({ ...popupInitialState });
		drawBoundary();
		drawWellBoundary();
		layerController.updateState({ clickedFeature: null })
	}, // reset whole state back to initial state
});

export const popupController = {
	...hookStateController(popupState, popupInitialState),
	...popupStateControllerHandler(popupState),
};
