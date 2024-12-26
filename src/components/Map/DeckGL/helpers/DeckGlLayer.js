// import { ScatterplotLayer, LineLayer, PolygonLayer, TextLayer } from '@deck.gl/layers';
// import { MapboxLayer } from '@deck.gl/mapbox';
// import { isEqual } from 'lodash';

// import M1neralGeojsonLayer from './M1neralGeojsonLayer';

// const MAX = 255;

// const Layers = {
// 	ScatterplotLayer: {
// 		component: ScatterplotLayer,
// 		defaultProps: {
// 			radiusMinPixels: 4,
// 			lineWidthMinPixels: 0.5,
// 			radiusMaxPixels: 40,
// 			getLineColor: [0, 0, MAX],
// 			stroked: true,
// 			parameters: { depthTest: false },
// 		},
// 	},
// 	LineLayer: {
// 		component: LineLayer,
// 		defaultProps: {
// 			getWidth: 2,
// 			parameters: { depthTest: false },
// 		},
// 	},
// 	PolygonLayer: {
// 		component: PolygonLayer,
// 		defaultProps: {
// 			parameters: { depthTest: false },
// 			getLineWidth: 10,
// 		},
// 	},
// 	TextLayer: {
// 		component: TextLayer,
// 		defaultProps: {
// 			fontFamily: 'CalibriCustom',
// 			fontWeight: 100,
// 			lineHeight: 1.2,
// 			maxWidth: 750,
// 			getSize: 14,
// 		},
// 	},
// 	GeoJsonLayer: {
// 		component: M1neralGeojsonLayer,
// 		defaultProps: {
// 			parameters: { depthTest: false },
// 		},
// 	},
// };

// export default class DeckGlLayer {
// 	constructor({ layerId, type, beforeLayer, props }) {
// 		const { component, defaultProps } = Layers[type] || {};

// 		if (!component) {
// 			return;
// 		}

// 		const layer = new MapboxLayer({
// 			...defaultProps,
// 			id: layerId,
// 			type: component,
// 			...props,
// 		});

// 		this.layerId = layerId;
// 		this.layer = layer;
// 		this.beforeLayer = beforeLayer;

// 		this.addLayer();

// 		DeckGlLayer.moveLayer(layerId, beforeLayer);
// 	}

// 	static moveLayer = (layerId, beforeLayer) => {
// 		setTimeout(() => {
// 			if (!window.mapRef?.getLayer(layerId)) {
// 				return;
// 			}

// 			if (beforeLayer) {
// 				if (window.mapRef?.getLayer(beforeLayer)) {
// 					window.mapRef?.moveLayer(layerId, beforeLayer);
// 				}
// 				return;
// 			}

// 			window.mapRef?.moveLayer(layerId);
// 		}, 0);
// 	};

// 	static moveLayerToTop = layerId => {
// 		setTimeout(() => {
// 			if (!window.mapRef?.getLayer(layerId)) {
// 				return;
// 			}

// 			window.mapRef?.moveLayer(layerId);
// 		}, 100);
// 	};

// 	addLayer = (layer = this.layer) => {
// 		setTimeout(() => {
// 			if (!layer || window.mapRef?.getLayer(this.layerId)) {
// 				return;
// 			}
// 			window.mapRef?.addLayer(layer);
// 		}, 0);
// 	};

// 	static removeLayer = layerId => {
// 		if (!window.mapRef?.getLayer(layerId)) {
// 			return;
// 		}

// 		window.mapRef?.removeLayer(layerId);
// 	};

// 	static updateLayer = (updatedProps, layer) => {
// 		if (!layer || !layer.setProps) {
// 			return;
// 		}

// 		const propsToUpdate = {};

// 		Object.entries(updatedProps).forEach(([key, value]) => {
// 			if (!isEqual(layer.props[key], value)) {
// 				propsToUpdate[key] = value;
// 			}
// 		});

// 		if (Object.keys(propsToUpdate).length > 0) {
// 			layer.setProps({
// 				...propsToUpdate,
// 			});
// 		}
// 	};
// }



import { ScatterplotLayer, LineLayer, PolygonLayer, TextLayer, GeoJsonLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { isEqual } from 'lodash';

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
	static dataRef = {}

	static initializeOverlay = () => {
		if (!window.mapRef) {
			throw new Error('Map reference is not available.');
		}

		if (!DeckGlOverlay.overlayInstance) {
			DeckGlOverlay.overlayInstance = new MapboxOverlay({ layers: [] });
			window.mapRef.addControl(DeckGlOverlay.overlayInstance);
		}
	};

	static setProps = layers => {
		const allLayers = [...layers]
		allLayers.sort((layerA, layerB) => layerA.props.position > layerB.props.position);
		allLayers.forEach(layer => {
			layer.props.data = DeckGlOverlay.dataRef[layer.id]
		})
		DeckGlOverlay.overlayInstance.setProps({ layers: allLayers });
	}

	static addLayer = ({ layerId, type, props, beforeLayer }) => {
		DeckGlOverlay.initializeOverlay();
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
		const currentLayers = DeckGlOverlay.overlayInstance?._props?.layers || [];
		currentLayers.push(newLayer);
		DeckGlOverlay.setProps(currentLayers);
	};

	static moveLayer = (layerId, beforeLayer) => {
		setTimeout(() => {
			DeckGlOverlay.initializeOverlay();
			const layers = DeckGlOverlay.overlayInstance?._props?.layers || [];
			const layerIndex = layers.findIndex(layer => layer.id === layerId);
			const beforeLayerIndex = layers.findIndex(layer => layer.id === beforeLayer);

			if (layerIndex === -1) {
				return;
			}

			const [layer] = layers.splice(layerIndex, 1);
			if (beforeLayerIndex !== -1) {
				layers.splice(beforeLayerIndex, 0, layer);
			} else {
				layers.push(layer);
			}

			DeckGlOverlay.overlayInstance.setProps({ layers });
		}, 0);
	};

	static moveLayerToTop = layerId => {
		setTimeout(() => {
			DeckGlOverlay.initializeOverlay();
			const layers = DeckGlOverlay.overlayInstance._props.layers || [];
			const layerIndex = layers.findIndex(layer => layer.id === layerId);

			if (layerIndex === -1) {
				return;
			}

			const [layer] = layers.splice(layerIndex, 1);
			layers.push(layer);
			DeckGlOverlay.overlayInstance.setProps({ layers });
		}, 100);
	};

	static removeLayer = layerId => {
		DeckGlOverlay.initializeOverlay();
		const layers = DeckGlOverlay.overlayInstance._props.layers.filter(layer => layer.id !== layerId);
		DeckGlOverlay.overlayInstance.setProps({ layers });
	};

	static updateLayer = (updatedProps, layerId) => {
		if (updatedProps.visiable === true || updatedProps.visiable === true) {
			updatedProps.visible = updatedProps.visiable
			delete updatedProps.visiable
		}
		DeckGlOverlay.initializeOverlay();
		const layers = DeckGlOverlay.overlayInstance._props.layers;
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
				data: DeckGlOverlay.dataRef[layerId] // Explicitly retain the generator function
			});
			layers[layerIndex] = updatedLayer;
			DeckGlOverlay.setProps(layers);
		}
	};
}