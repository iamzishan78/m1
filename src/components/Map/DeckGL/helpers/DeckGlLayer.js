import { ScatterplotLayer, LineLayer, PolygonLayer, TextLayer, GeoJsonLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { GridLayer, HeatmapLayer, HexagonLayer } from 'deck.gl';
import { isEqual } from 'lodash';

import { drawBoundary, drawWellBoundary } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';

import { drawController } from 'stateManagement/drawStateController';
import { layerController } from 'stateManagement/layerStateController';
import { popupController } from 'stateManagement/popupStateController';

import { getClickedFeature } from './common';
import M1neralGeojsonLayer from './M1neralGeojsonLayer';
import onFeatureClick from './onFeatureClick';
import onRightClick from './onRightClick';

const MAX = 255;

const Layers = {
	ScatterplotLayer: {
		component: ScatterplotLayer,
		defaultProps: {
			radiusMinPixels: 4,
			lineWidthMinPixels: 0.5,
			radiusMaxPixels: 40,
			getLineColor: [0, 0, MAX],
			stroked: true,
			parameters: { depthTest: false },
		},
	},
	LineLayer: {
		component: LineLayer,
		defaultProps: {
			getWidth: 2,
			parameters: { depthTest: false },
		},
	},
	PolygonLayer: {
		component: PolygonLayer,
		defaultProps: {
			parameters: { depthTest: false },
			getLineWidth: 10,
		},
	},
	TextLayer: {
		component: TextLayer,
		defaultProps: {
			fontFamily: 'CalibriCustom',
			fontWeight: 100,
			lineHeight: 1.2,
			maxWidth: 750,
			getSize: 14,
		},
	},
	GeoJsonLayer: {
		component: M1neralGeojsonLayer,
		defaultProps: {
			parameters: { depthTest: false },
		},
	},
	SimpleGeoJsonLayer: {
		component: GeoJsonLayer,
		defaultProps: {
			parameters: { depthTest: false },
		},
	},
	HexagonLayer: {
		component: HexagonLayer,
		defaultProps: {
			pickable: true,
		},
	},
	HeatmapLayer: {
		component: HeatmapLayer,
		defaultProps: {},
	},
	GridLayer: {
		component: GridLayer,
		defaultProps: {
			pickable: true,
		},
	},
};

export default class DeckGlOverlay {
	static overlayInstance = null;
	static dataRef = {};

	static initializeOverlay = ({ transactBarView }) => {
		if (!window.mapRef) {
			throw new Error('Map reference is not available.');
		}

		if (!window?.deckOverlay?._deck) {
			window.deckOverlay = new MapboxOverlay({ layers: [] });
		}
		if (!window.mapRef._controls.find(control => control instanceof MapboxOverlay)) {
			window.mapRef.addControl(window.deckOverlay);
		}

		window.mapRef.on('contextmenu', event => {
			const drawMode = window.drawRef?.getMode();

			if (drawMode?.includes('draw') || drawMode?.includes('drag')) {
				window.mapRef?.resize();
				return;
			}
			onRightClick({ x: event.point.x, y: event.point.y, coordinate: [event.lngLat.lng, event.lngLat.lat] });
		});

		let isDragging = false;
		let isDrawing = false;
		if (window?.deckOverlay?._deck) {
			window.mapRef?.on('draw.actionable', () => {
				// console.log(window.drawRef?.getMode())
				isDrawing = !['direct_select', 'simple_select'].includes(window.drawRef?.getMode());
			});
			window.deckOverlay._deck?.setProps({
				onDragStart: () => {
					isDragging = true;
				},
				onDragEnd: () => {
					isDragging = false;
				},
				getCursor: ({ isHovering }) => {
					const value = isDrawing ? 'crosshair' : isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab';
					if (window?.mapRef?.getCanvas && window?.mapRef?.getCanvas?.()?.style?.cursor !== value) {
						window.mapRef.getCanvas().style.cursor = value;
					}
					return value;
				},
				onClick: ({ x, y }) => {
					const drawMode = window.drawRef?.getMode();

					if (drawMode?.includes('draw') || drawMode?.includes('drag')) {
						window.mapRef?.resize();
						return;
					}

					const getLandGrid =
						window.event.ctrlKey || window.event.metaKey || drawController.getValue('multiSelectLandGrids');

					const { clickedFeature, layer } = getClickedFeature({ x, y, getLandGrid });
					const previousClickedFeature = layerController.getValue('clickedFeature');
					const clickOnSameFeature =
						previousClickedFeature && previousClickedFeature?.object?.id === clickedFeature?.object?.id;
					if (!clickedFeature || clickOnSameFeature) {
						const selectedPlace = popupController.getValue('selectedPlaces');
						if (!selectedPlace) {
							// Reset the state when slected search is not places
							popupController.reset();
						}
						// If the path is not '/' or ' ' and the map is not rendered through deal dialog
						if (!['', '/'].includes(window.location.pathname) && transactBarView !== 'Map') {
							window.history.replaceState({}, '', '/');
						}
						return;
					}
					if (!getLandGrid) {
						if (clickedFeature?.object?.geometry?.type === 'Point') {
							drawWellBoundary(clickedFeature?.object?.geometry?.coordinates);
						} else {
							drawBoundary(clickedFeature.object);
						}
					}

					layerController.updateState({ clickedFeature });
					onFeatureClick(clickedFeature, layer);
				},
			});
		}
	};

	static getLayer = layerId => {
		if (!window.deckOverlay) {
			throw new Error('DeckOverlay is not initialized.');
		}

		const layers = window?.deckOverlay?._props?.layers || [];
		const foundLayer = layers.find(layer => layer.id === layerId);

		return foundLayer;
	};

	static addLayer = ({ layerId, type, props }) => {
		const { component, defaultProps } = Layers[type] || {};

		if (!component) {
			throw new Error(`Invalid layer type: ${type}`);
		}

		const newLayer = new component({
			...defaultProps,
			id: layerId,
			...props,
		});
		DeckGlOverlay.dataRef[layerId] = props.data;
		const currentLayers = window.deckOverlay?._props?.layers || [];
		if (DeckGlOverlay.getLayer(layerId)) {
			return DeckGlOverlay.getLayer(layerId);
		}

		currentLayers.push(newLayer);
		currentLayers.sort((a, b) => b.props.position - a.props.position);
		window.deckOverlay.setProps({ layers: currentLayers });
		return newLayer;
	};

	static moveLayer = (layerId, beforeLayer) => {
		const layers = window.deckOverlay?._props?.layers || [];

		// Find the indexes of `layerId` and `beforeLayerId`
		const layerIndex = layers.findIndex(layer => layer.id === layerId);
		const beforeLayerIndex = layers.findIndex(layer => layer.id === beforeLayer);

		if (layerIndex === -1) {
			return;
		}

		// Ensure `layerId` exists
		if (layerIndex !== -1) {
			// Remove the layer from its current position
			const [layer] = layers.splice(layerIndex, 1);

			if (!beforeLayer) {
				// Move the layer to the end if `beforeLayerId` is null
				layers.push(layer);
			} else if (beforeLayerIndex !== -1) {
				// Insert the layer at the correct position before `beforeLayerId`
				layers.splice(beforeLayerIndex - 1, 0, layer);
			} else {
				// If `beforeLayerId` is invalid, move the layer to the end
				layers.push(layer);
			}
		}

		// add layers in deck overlay
		window.deckOverlay.setProps({ layers });
	};

	static removeLayer = layerId => {
		const layers = window.deckOverlay._props.layers.filter(layer => layer.id !== layerId);
		// add layers in deck overlay
		window.deckOverlay.setProps({ layers });
	};

	static updateLayer = (updatedProps, layerId) => {
		if (updatedProps.visiable === true || updatedProps.visiable === true) {
			updatedProps.visible = updatedProps.visiable;
			delete updatedProps.visiable;
		}

		const layers = window.deckOverlay._props.layers;
		const layerIndex = layers.findIndex(layer => layer.id === layerId);

		if (layerIndex === -1) {
			return;
		}

		const layer = layers[layerIndex];
		const propsToUpdate = {};

		Object.entries(updatedProps).forEach(([key, value]) => {
			if (!isEqual(layer.props[key], value)) {
				propsToUpdate[key] = value;
			}
		});
		if (Object.keys(propsToUpdate).length > 0) {
			const updatedLayer = layer.clone({
				...propsToUpdate,
				data: DeckGlOverlay.dataRef[layerId], // Explicitly retain the generator function
			});
			layers[layerIndex] = updatedLayer;

			window.deckOverlay.setProps({ layers: [...layers] });
		}
	};
}
