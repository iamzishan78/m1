import { ScatterplotLayer, LineLayer, PolygonLayer, TextLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { isEqual, orderBy } from 'lodash';

import M1neralGeojsonLayer from './M1neralGeojsonLayer';

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
};

export default class DeckGlOverlay {
	static overlayInstance = null;
	static dataRef = {};

	static initializeOverlay = () => {
		if (!window.mapRef) {
			throw new Error('Map reference is not available.');
		}

		if (!window.deckOverlay) {
			window.deckOverlay = new MapboxOverlay({
				layers: [],
			});
			window.mapRef.addControl(window.deckOverlay);
		}
	};

	static setProps = layers => {
		let allLayers = [...layers];

		allLayers.forEach(layer => {
			layer.props.data = DeckGlOverlay.dataRef[layer.id];
		});
		window.deckOverlay.setProps({ layers: allLayers });
	};

	static getLayer = layerId => {
		if (!window.deckOverlay) {
			throw new Error('DeckOverlay is not initialized.');
		}

		const layers = window?.deckOverlay?._props?.layers || [];
		const foundLayer = layers.find(layer => layer.id === layerId);

		if (!foundLayer) {
			// console.warn(`Layer with id '${layerId}' not found.`);
		}

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
		if (currentLayers.find(layer => layer.id === layerId)) {
			return currentLayers.find(layer => layer.id === layerId);
		} else {
			currentLayers.push(newLayer);
			console.log('currentLayers', currentLayers);
			DeckGlOverlay.setProps(currentLayers);
			return newLayer;
		}

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

		window.deckOverlay.setProps({ layers });
	};

	static moveLayerToTop = layerId => {
		setTimeout(() => {
			const layers = window.deckOverlay._props.layers || [];
			const layerIndex = layers.findIndex(layer => layer.id === layerId);

			if (layerIndex === -1) {
				return;
			}

			const [layer] = layers.splice(layerIndex, 1);
			layers.push(layer);
			window.deckOverlay.setProps({ layers });
		}, 100);
	};

	static removeLayer = layerId => {
		const layers = window.deckOverlay._props.layers.filter(layer => layer.id !== layerId);
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
			DeckGlOverlay.setProps(layers);
		}
	};
}
