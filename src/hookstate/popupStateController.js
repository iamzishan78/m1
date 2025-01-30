import mapboxgl from 'mapbox-gl';

import { findBoundsMap } from 'components/MapControls/commonHelper';
import {
	drawBoundary,
	drawWellBoundary,
	drawPlaceBoundary,
} from 'components/MapControls/components/DrawShapes/drawShapesHelpers';

import { layerController } from './layerStateController';
import { StateController } from './stateController'; // <-- Your generic class-based state controller

export const popupInitialState = {
	popupOpen: false,
	expandedCard: false,
	layerSelectionPopup: false,
	selectedUserDefinedLayer: null,
	selectedShape: null,
	selectedShapeFile: null,
	selectedWell: null,
	selectedWellId: null,
	wellSelectedCoordinates: null,
	selectedPlaces: null,
	wellDetailCardTabIndex: 0,
	selectedPermit: null,
	selectedPermitId: null,
	parcelDetailCardTabIndex: 0,
	permitSelectedCoordinates: null,
	selectionLayers: [],
	coordinate: null,
};

class PopupStateController extends StateController {
	constructor(initialState) {
		super(initialState);
	}

	/**
	 * createPopUp
	 *
	 * Opens a mapbox popup at the provided (lon/lat) coordinates.
	 * Also updates popup state to expand a card if `currentFeature.id` equals `paramId`.
	 */
	createPopUp(currentFeature, paramId) {
		// Validate we have the map, and valid coordinates
		if (!window.mapRef || !currentFeature?.longitude || !currentFeature?.latitude) {
			return;
		}

		const coordinates = [currentFeature.longitude, currentFeature.latitude];

		// Remove existing mapbox popups
		const popUps = document.getElementsByClassName('mapboxgl-popup');
		if (popUps[0]) {
			popUps[0].remove();
		}

		// Create new popup
		new mapboxgl.Popup({ offset: 0, closeOnClick: false })
			.setLngLat(coordinates)
			.setMaxWidth('none')
			.setHTML('<div id="popupContainer"></div>')
			.addTo(window.mapRef);

		// Update state (expandedCard)
		this.updateState({
			expandedCard: !!(currentFeature.id && currentFeature.id === paramId),
		});
	}

	/**
	 * createUDPopUp
	 *
	 * Opens a mapbox popup if `currentFeature.shapeCenter` is available.
	 */
	createUDPopUp(currentFeature) {
		if (!window.mapRef) {
			return;
		}

		let coordinates = currentFeature.shapeCenter;
		if (typeof coordinates === 'string') {
			coordinates = JSON.parse(coordinates);
		}

		// Remove existing popups
		const popUps = document.getElementsByClassName('mapboxgl-popup');
		if (popUps[0]) {
			popUps[0].remove();
		}

		// Create new popup if valid coordinates
		if (coordinates) {
			new mapboxgl.Popup({ offset: 0, closeOnClick: false })
				.setLngLat(coordinates)
				.setMaxWidth('none')
				.setHTML('<div id="popupContainer"></div>')
				.addTo(window.mapRef);
		}
	}

	/**
	 * fitParcelBounds
	 *
	 * Uses the `findBoundsMap` helper to adjust the map view
	 * so that the currently-selected shape is in view.
	 */
	fitParcelBounds() {
		// Example: selectedShape might be stored in popupState
		const selectedShape = this.getValue('selectedShape');
		if (!selectedShape) {
			return;
		}

		// findBoundsMap expects an array of features
		findBoundsMap([selectedShape.feature], window.mapRef);
	}

	/**
	 * fitWellBounds
	 *
	 * Tries to fit a well (either passed in as `wellFeature`
	 * or from this controller's `selectedWell` state).
	 */
	fitWellBounds(wellFeature) {
		const alpha = 0.01;
		const selectedWell = wellFeature || this.getValue('selectedWell');

		if (selectedWell && typeof selectedWell.longitude !== 'undefined') {
			// Example bounding box around the well coordinate
			const bbox = [
				[selectedWell.longitude - 1.5 * alpha, selectedWell.latitude],
				[selectedWell.longitude + 0.5 * alpha, selectedWell.latitude],
			];

			try {
				window.mapRef?.fitBounds(bbox, {
					easing: () => 1, // immediate
				});
			} catch (err) {
				// safe fallback
			}
		}
	}

	/**
	 * reset
	 *
	 * Resets the entire popup state to the initial defaults,
	 * then re-draws boundaries and updates the layerController.
	 */
	reset() {
		// Overwrite entire state with fresh initialState
		this.reset();

		// Re-draw shapes
		drawBoundary();
		drawWellBoundary();
		drawPlaceBoundary();

		// Also reset the layer controller's 'clickedFeature'
		layerController.updateState({ clickedFeature: null });
	}
}

// Create an exported, singleton instance using the initial state
export const popupController = new PopupStateController(popupInitialState);
