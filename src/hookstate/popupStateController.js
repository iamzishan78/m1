import { hookstate, useHookstate } from '@hookstate/core';
import mapboxgl from 'mapbox-gl';
import { copy } from 'components/Shared/functions';
import { hookStateController } from 'hookstate/hookStateController';
import { findBoundsMap } from 'components/MapControls/commonHelper';

const initialState = {
	popupOpen: false,
	expandedCard: false,
	layerSelectionPopup: false,
	parcelDetailCardTabIndex: 0,
	selectedUserDefinedLayer: null,
	selectedShape: null,
	selectedShapeFile: null,
	selectedParcel: null,
	selectedWell: null,
	selectedWellId: null,
	wellSelectedCoordinates: null,
	selectedPermitId: null,
	permitSelectedCoordinates: null,
	selectionLayers: [],
};

export const popupState = hookstate(copy(initialState));
export const usePopoupState = () => useHookstate(popupState);

const popupStateControllerHandler = () => ({
	createPopUp: (currentFeature, paramId) => {
		if (!window.mapRef) return;

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
	fitParcelBounds: () => findBoundsMap([popupState?.selectedParcel?.get({ noproxy: true })?.feature], window.mapRef),
	fitWellBounds: () => {
		const selectedWell = popupState?.selectedWell?.get({ noproxy: true });

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
});

export const popupController = {
	...popupStateControllerHandler(popupState),
	...hookStateController(popupState, initialState),
};
