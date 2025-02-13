import * as turf from '@turf/turf';
import gjv from 'geojson-validation';

import { drawController } from 'hookstate/drawStateController';
import { popupController } from 'hookstate/popupStateController';

import { layerRefs } from 'hookstate';

export const clearMapAndCloseShapeActionsPopup = () => {
	const currentFeature = drawController.getValue('currentFeature');
	drawShapeLayerToggle('visible');

	if (currentFeature?.id) {
		setFeatureProperty(window.drawRef, currentFeature.id, 'shapeEdit', true);
		window.drawRef?.delete(currentFeature?.id);
	}
	window.drawRef?.deleteAll();

	window.drawRef?.changeMode('simple_select');

	popupController.reset();
	drawController.reset();

	const sourceId = layerRefs.abstract_geo?.get({ noproxy: true })?.sourceId;

	if (!sourceId) {
		return;
	}

	// unselecting the grids
	const featuresList = window.mapRef?.getSource(sourceId)._data.features;
	for (let i = 0; i < featuresList.length; i++) {
		const id = featuresList[i].properties.Id;
		window.mapRef?.setFeatureState({ source: sourceId, id: id }, { click: false });
	}
};

export const setFeatureProperty = (draw, drawFeatureID, field, value) => {
	if (drawFeatureID !== '' && typeof draw === 'object' && draw?.setFeatureProperty) {
		var feat = draw.get(drawFeatureID);
		if (feat) {
			draw.setFeatureProperty(drawFeatureID, field, value);
			feat = draw.get(drawFeatureID);
			draw.add(feat);
		}
	}
};

export const drawShapeLayerToggle = value => {
	const layers = [
		'gl-draw-polygon-and-line-vertex-scale-icon',
		'gl-draw-polygon-rotate-point-icon',
		'gl-draw-polygon-fill-inactive',
		'gl-draw-polygon-fill-active',
		'gl-draw-polygon-midpoint',
		'gl-draw-polygon-stroke-active',
		'gl-draw-polygon-and-line-vertex-inactive',
		'gl-draw-polygon-and-line-vertex-stroke-inactive',
	];

	layers.forEach(layer => {
		window.mapRef?.moveLayer(layer + '.cold');
		window.mapRef?.moveLayer(layer + '.hot');
	});

	// window.mapRef?.moveLayer('gl-draw-polygon-and-line-vertex-scale-icon.cold');
	// window.mapRef?.moveLayer('gl-draw-polygon-and-line-vertex-scale-icon.hot');

	// window.mapRef?.moveLayer('gl-draw-polygon-midpoint.cold');
	// window.mapRef?.moveLayer('gl-draw-polygon-midpoint.hot');
	// window.mapRef?.moveLayer('gl-draw-polygon-stroke-active.hot');
	// window.mapRef?.moveLayer('gl-draw-polygon-stroke-active.cold');

	// window.mapRef?.moveLayer('gl-draw-polygon-and-line-vertex-inactive.cold');
	// window.mapRef?.moveLayer('gl-draw-polygon-and-line-vertex-inactive.hot');
	// window.mapRef?.moveLayer('gl-draw-polygon-and-line-vertex-stroke-inactive.cold');
	// window.mapRef?.moveLayer('gl-draw-polygon-and-line-vertex-stroke-inactive.hot');

	window.mapRef?.setLayoutProperty('gl-draw-polygon-midpoint.cold', 'visibility', value);
	window.mapRef?.setLayoutProperty('gl-draw-polygon-midpoint.hot', 'visibility', value);
	window.mapRef?.setLayoutProperty('gl-draw-polygon-and-line-vertex-inactive.cold', 'visibility', value);
	window.mapRef?.setLayoutProperty('gl-draw-polygon-and-line-vertex-stroke-inactive.cold', 'visibility', value);
	window.mapRef?.setLayoutProperty('gl-draw-polygon-and-line-vertex-inactive.hot', 'visibility', value);
	window.mapRef?.setLayoutProperty('gl-draw-polygon-and-line-vertex-stroke-inactive.hot', 'visibility', value);
};

export const findBoundsMap = (shapes, map, padding, onlySendBounds = false) => {
	let bound = null;
	if (shapes && shapes.length > 0) {
		shapes.forEach(shape => {
			if (gjv.valid(shape)) {
				const bbox = turf.bbox(shape);

				if (bound) {
					bound.minLong = bound.minLong > bbox[0] ? bbox[0] : bound.minLong;
					bound.minLat = bound.minLat > bbox[1] ? bbox[1] : bound.minLat;
					bound.maxLong = bound.maxLong < bbox[2] ? bbox[2] : bound.maxLong;
					bound.maxLat = bound.maxLat < bbox[3] ? bbox[3] : bound.maxLat;
				} else {
					bound = {
						minLong: bbox[0],
						minLat: bbox[1],
						maxLong: bbox[2],
						maxLat: bbox[3],
					};
				}
			}
		});
	}
	if (bound && !onlySendBounds) {
		try {
			map?.fitBounds(
				[
					[bound.minLong, bound.minLat],
					[bound.maxLong, bound.maxLat],
				],
				{
					easing: () => 1,
					padding: padding
						? padding
						: {
								top: 200,
								bottom: 200,
								left: 1200,
								right: 0,
							},
				}
			);
		} catch (err) {
			// Removing padding for smaller screens
			try {
				if (bound.minLong && bound.minLat && bound.maxLong && bound.maxLat) {
					map?.fitBounds(
						[
							[bound.minLong, bound.minLat],
							[bound.maxLong, bound.maxLat],
						],
						{
							easing: () => 1,
						}
					);
				}
			} catch (err) {
				console.log('🚀 ~ findBoundsMap ~ err:', err.message);
			}
		}
	}
	return { ...bound };
};

export const drawShapeStyles = [
	// ACTIVE (being drawn)
	// line stroke
	{
		id: 'gl-draw-line',
		type: 'line',
		filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': '#ffff00',
			'line-dasharray': [0.3, 3],
			'line-width': 4,
		},
	},

	// polygon fill
	{
		id: 'gl-draw-polygon-fill-inactive',
		type: 'fill',
		filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
		paint: {
			'fill-color': '#3bb2d0',
			'fill-outline-color': '#3bb2d0',
			'fill-opacity': 0.1,
		},
	},
	{
		id: 'gl-draw-polygon-fill-active',
		type: 'fill',
		filter: [
			'all',
			['==', 'active', 'true'],
			['==', '$type', 'Polygon'],
			['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']],
		],
		paint: {
			'fill-color': '#FFFF00',
			'fill-outline-color': '#FFFF00',
			'fill-opacity': 0.1,
		},
	},
	{
		id: 'gl-draw-polygon-midpoint',
		type: 'circle',
		filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
		paint: {
			'circle-radius': 3,
			'circle-color': '#FFFF00',
		},
	},
	{
		id: 'gl-draw-polygon-stroke-inactive',
		type: 'line',
		filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': '#3bb2d0',
			'line-width': 2,
		},
	},
	{
		id: 'gl-draw-polygon-stroke-active',
		type: 'line',
		filter: [
			'all',
			['==', 'active', 'true'],
			['==', '$type', 'Polygon'],
			['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']],
		],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': ['case', ['has', 'user_isrotate'], '#3bb2d0', '#FFFF00'],
			'line-dasharray': [0.2, 2],
			'line-width': ['case', ['has', 'user_isrotate'], 3, 6],
		},
	},
	{
		id: 'gl-draw-line-inactive',
		type: 'line',
		filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'LineString'], ['!=', 'mode', 'static'], ['!=', 'user_meta', 'radiusLine']],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': '#3bb2d0',
			'line-width': 2,
		},
	},
	{
		id: 'gl-draw-line-inactive',
		type: 'line',
		filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'LineString'], ['!=', 'mode', 'static'], ['==', 'user_meta', 'radiusLine']],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': '#ffff00',
			'line-dasharray': [0.3, 3],
			'line-width': 4,
		},
	},
	{
		id: 'gl-draw-line-active',
		type: 'line',
		filter: [
			'all',
			['==', '$type', 'LineString'],
			['==', 'active', 'true'],
			['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']],
		],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': '#FFFF00',
			'line-dasharray': [0.2, 2],
			'line-width': 2,
		},
	},
	{
		id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
		type: 'circle',
		filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
		paint: {
			'circle-radius': ['case', ['has', 'user_isrotate'], 3, 5],
			'circle-color': ['case', ['has', 'user_isrotate'], '#3bb2d0', '#FFFF00'],
		},
	},
	{
		id: 'gl-draw-polygon-and-line-vertex-inactive',
		type: 'circle',
		filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
		paint: {
			'circle-radius': 3,
			'circle-color': '#FFFF00',
		},
	},
	{
		id: 'gl-draw-point-point-stroke-inactive',
		type: 'circle',
		filter: [
			'all',
			['==', 'active', 'false'],
			['==', '$type', 'Point'],
			['==', 'meta', 'feature'],
			['!=', 'mode', 'static'],
		],
		paint: {
			'circle-radius': 5,
			'circle-opacity': 1,
			'circle-color': '#fff',
		},
	},
	{
		id: 'gl-draw-point-inactive',
		type: 'circle',
		filter: [
			'all',
			['==', 'active', 'false'],
			['==', '$type', 'Point'],
			['==', 'meta', 'feature'],
			['!=', 'mode', 'static'],
		],
		paint: {
			'circle-radius': 3,
			'circle-color': '#3bb2d0',
		},
	},
	{
		id: 'gl-draw-point-stroke-active',
		type: 'circle',
		filter: [
			'all',
			['==', '$type', 'Point'],
			['==', 'active', 'true'],
			['!=', 'meta', 'midpoint'],
			['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']],
		],
		paint: {
			'circle-radius': 7,
			'circle-color': '#fff',
		},
	},
	{
		id: 'gl-draw-point-active',
		type: 'circle',
		filter: [
			'all',
			['==', '$type', 'Point'],
			['!=', 'meta', 'midpoint'],
			['==', 'active', 'true'],
			['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']],
		],
		paint: {
			'circle-radius': 5,
			'circle-color': '#FFFF00',
		},
	},
	{
		id: 'gl-draw-polygon-fill-static',
		type: 'fill',
		filter: [
			'all',
			['==', 'mode', 'static'],
			['==', '$type', 'Polygon'],
			['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']],
		],
		paint: {
			'fill-color': '#404040',
			'fill-outline-color': '#404040',
			'fill-opacity': 0.1,
		},
	},
	{
		id: 'gl-draw-polygon-stroke-static',
		type: 'line',
		filter: [
			'all',
			['==', 'mode', 'static'],
			['==', '$type', 'Polygon'],
			['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']],
		],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': '#404040',
			'line-width': 2,
		},
	},
	{
		id: 'gl-draw-line-static',
		type: 'line',
		filter: [
			'all',
			['==', 'mode', 'static'],
			['==', '$type', 'LineString'],
			['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']],
		],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': '#404040',
			'line-width': 2,
		},
	},
	{
		id: 'gl-draw-point-static',
		type: 'circle',
		filter: [
			'all',
			['==', 'mode', 'static'],
			['==', '$type', 'Point'],
			['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']],
		],
		paint: {
			'circle-radius': 5,
			'circle-color': '#404040',
		},
	},
	// new styles
	{
		id: 'gl-draw-polygon-shape-edit',
		type: 'fill',
		filter: ['all', ['==', '$type', 'Polygon'], ['==', 'user_shapeEdit', false]],
		paint: {
			'fill-color': '#3bb2d0',
			'fill-outline-color': '#3bb2d0',
			'fill-opacity': 0.1,
		},
	},
	{
		id: 'gl-draw-polygon-stroke-shape-edit',
		type: 'line',
		filter: [
			'all',
			['==', '$type', 'Polygon'],
			// ['!=', 'mode', 'static'],
			['==', 'user_shapeEdit', false],
		],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': '#3bb2d0',
			'line-width': 2,
		},
	},

	// Rotate

	{
		id: 'gl-draw-line-rotate-point',
		type: 'line',
		filter: [
			'all',
			['==', 'meta', 'midpoint'],
			['==', 'icon', 'rotate'],
			['==', '$type', 'LineString'],
			['!=', 'mode', 'static'],
			// ['==', 'active', 'true']
		],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': '#3bb2d0',
			'line-dasharray': [0.2, 2],
			'line-width': 2,
		},
	},
	{
		id: 'gl-draw-polygon-rotate-point-stroke',
		type: 'circle',
		filter: [
			'all',
			['==', 'meta', 'midpoint'],
			['==', 'icon', 'rotate'],
			['==', '$type', 'Point'],
			['!=', 'mode', 'static'],
		],
		paint: {
			'circle-radius': 4,
			'circle-color': '#fff',
		},
	},
	{
		id: 'gl-draw-polygon-rotate-point',
		type: 'circle',
		filter: [
			'all',
			['==', 'meta', 'midpoint'],
			['==', 'icon', 'rotate'],
			['==', '$type', 'Point'],
			['!=', 'mode', 'static'],
		],
		paint: {
			'circle-radius': 2,
			'circle-color': '#3bb2d0',
		},
	},

	{
		id: 'gl-draw-polygon-and-line-vertex-scale-icon',
		type: 'symbol',
		filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static'], ['has', 'heading']],
		layout: {
			'icon-image': 'scale',
			'icon-allow-overlap': true,
			'icon-ignore-placement': true,
			'icon-rotation-alignment': 'map',
			'icon-rotate': ['get', 'heading'],
		},
		paint: {
			'icon-opacity': 1.0,
			'icon-opacity-transition': {
				delay: 0,
				duration: 0,
			},
		},
	},
	{
		id: 'gl-draw-polygon-rotate-point-icon',
		type: 'symbol',
		filter: [
			'all',
			['==', 'meta', 'midpoint'],
			['==', 'icon', 'rotate'],
			['==', '$type', 'Point'],
			['!=', 'mode', 'static'],
		],
		layout: {
			'icon-image': 'rotate',
			'icon-allow-overlap': true,
			'icon-ignore-placement': true,
			'icon-rotation-alignment': 'map',
			'icon-rotate': ['get', 'heading'],
		},
		paint: {
			'icon-opacity': 1.0,
			'icon-opacity-transition': {
				delay: 0,
				duration: 0,
			},
		},
	},

	// radius label
	{
		id: 'gl-draw-radius-label',
		type: 'symbol',
		filter: ['==', 'user_meta', 'label'], // only features with meta property 'label'
		layout: {
			'text-field': ['get', 'user_labelText'], // use the labelText property
			'text-anchor': 'center',
			'text-offset': [0, -2],
			'text-size': 15,
		},
		paint: {
			'text-color': 'rgba(0, 0, 0, 1)',
			'text-halo-color': '#ffff00',
			'text-halo-width': 12, // Adjust width to create background effect
			'text-halo-height': 25, // Adjust width to create background effect
			'text-halo-blur': 3, // Soften the edges to mimic border-radius
		},
	},
];

// Utility for generating random color
export const generateRandomColor = () => {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};
