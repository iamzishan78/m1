import { MapboxLayer } from '@deck.gl/mapbox';
import { GeoJsonLayer, ScatterplotLayer, LineLayer, PolygonLayer, TextLayer } from '@deck.gl/layers';
import { isEqual } from 'lodash';

const Layers = {
	ScatterplotLayer: {
		component: ScatterplotLayer,
		defaultProps: {
			radiusMinPixels: 4,
			lineWidthMinPixels: 0.5,
			radiusMaxPixels: 40,
			getLineColor: [0, 0, 255],
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
		component: GeoJsonLayer,
		defaultProps: {
			parameters: { depthTest: false },
		},
	},
};

export default class DeckGlLayer {
	constructor({ layerId, type, beforeLayer, props }) {
		const { component, defaultProps } = Layers[type] || {};

		if (!component) return;

		const layer = new MapboxLayer({
			...defaultProps,
			id: layerId,
			type: component,
			...props,
		});

		this.layerId = layerId;
		this.layer = layer;
		this.beforeLayer = beforeLayer;

		this.addLayer();

		DeckGlLayer.moveLayer(layerId, beforeLayer);
	}

	static moveLayer = (layerId, beforeLayer) => {
		setTimeout(() => {
			if (!window.mapRef?.getLayer(layerId)) return;

			if (beforeLayer) {
				if (window.mapRef?.getLayer(beforeLayer)) window.mapRef?.moveLayer(layerId, beforeLayer);
				return;
			}

			window.mapRef?.moveLayer(layerId);
		}, 0);
	};

	static moveLayerToTop = layerId => {
		setTimeout(() => {
			if (!window.mapRef?.getLayer(layerId)) return;

			window.mapRef?.moveLayer(layerId);
		}, 100);
	};

	addLayer = (layer = this.layer) => {
		setTimeout(() => {
			if (!layer || window.mapRef?.getLayer(this.layerId)) return;
			window.mapRef?.addLayer(layer);
		}, 0);
	};

	static removeLayer = layerId => {
		if (!window.mapRef?.getLayer(layerId)) return;

		window.mapRef?.removeLayer(layerId);
	};

	static updateLayer = (updatedProps, layer) => {
		if (!layer || !layer.setProps) return;

		const propsToUpdate = {};

		Object.entries(updatedProps).forEach(([key, value]) => {
			if (!isEqual(layer.props[key], value)) propsToUpdate[key] = value;
		});

		if (Object.keys(propsToUpdate).length > 0)
			layer.setProps({
				...propsToUpdate,
			});
	};
}
