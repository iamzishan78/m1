import { intersect, area } from '@turf/turf';
import mapboxgl from 'mapbox-gl';

import { layerController } from 'stateManagement/layerStateController';
import { popupController } from 'stateManagement/popupStateController';

import { filterUniqueFeatures, getClickedFeature } from './common';

const onRightClick = ({ x, y, coordinate }) => {
	popupController.updateState({
		popupOpen: false,
		layerSelectionPopup: false,
	});

	const popUps = Array.from(document.getElementsByClassName('mapboxgl-popup'));
	if (popUps?.length > 0) {
		popUps.forEach(popUp => popUp.remove());
	}

	let { features, clickedFeature } = getClickedFeature({ x, y, getLandGrid: false });

	if (clickedFeature?.featureType === 'polygons') {
		let layersIntersecting = [];

		const layerIds = Object.keys(layerController.getValue('boundingStates') || {}).filter(
			layerId => !layerId.startsWith('AbstractGeo') && !layerId.startsWith('Pls')
		);

		const layers = window.mapRef?.__deck?.layerManager?.layers?.filter(l => layerIds.includes(l.props.id)) || [];

		layers.forEach(layer => {
			if (!layer?.props?.data) {
				return;
			}

			const featuresIntersecting = layer.props.data.filter(feature => {
				try {
					const intersection = intersect(feature, clickedFeature.object);
					if (intersection) {
						const intersectionArea = area(intersection);
						return intersectionArea > 100;
					}
					return false;
				} catch (err) {
					console.log('🚀 ~ file: onRightClick.js:53 ~ err:', err);
					return false;
				}
			});

			if (featuresIntersecting.length > 0) {
				layersIntersecting = [
					...layersIntersecting,
					...featuresIntersecting.map(f => ({
						layer,
						object: f,
					})),
				];
			}
		});

		if (layersIntersecting.length > 0) {
			features = filterUniqueFeatures(layersIntersecting);
		}
	}

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
