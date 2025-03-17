import mapboxgl from 'mapbox-gl';

import { popupController } from 'stateManagement/popupStateController';

import { getClickedFeature } from './common';

const onRightClick = ({ x, y, coordinate }) => {
	popupController.updateState({
		popupOpen: false,
		layerSelectionPopup: false,
	});

	const popUps = Array.from(document.getElementsByClassName('mapboxgl-popup'));
	if (popUps?.length > 0) {
		popUps.forEach(popUp => popUp.remove());
	}

	let { features } = getClickedFeature({ x, y, getLandGrid: false, radius: 20 });

	setTimeout(() => {
		new mapboxgl.Popup({ offset: 0, closeOnClick: false })
			.setLngLat(coordinate)
			.setMaxWidth('none')
			.setHTML('<div id="popupContainer"></div>')
			.addTo(window.mapRef);

		popupController.updateState({
			selectionLayers: features,
			layerSelectionPopup: true,
			popupOpen: true,
			coordinate: coordinate,
		});
	}, 0);
};

export default onRightClick;
