import { CompositeLayer } from '@deck.gl/core';
import { CollisionFilterExtension, FillStyleExtension, PathStyleExtension } from '@deck.gl/extensions';
import { GeoJsonLayer, TextLayer } from '@deck.gl/layers';
import * as turf from '@turf/turf';

const transformFields = input => {
	const commonMapping = {
		visible: 'visible',
	};

	const geojsonProps = { ...input };

	const getKeysByMapping = mapping => {
		const props = {};
		for (const [oldKey, newKey] of Object.entries(mapping)) {
			if (oldKey in input) {
				props[newKey] = input[oldKey];
				delete geojsonProps[oldKey];
			}
		}
		Object.keys(commonMapping).forEach(key => {
			props[key] = input[key];
		});
		return props;
	};
	const textLayerMapping = {
		getText: 'getText',
		getTextColor: 'getColor',
		getTextAngle: 'getAngle',
		getTextSize: 'getSize',
		getTextAnchor: 'getTextAnchor',
		getTextAlignmentBaseline: 'getAlignmentBaseline',
		getTextPixelOffset: 'getPixelOffset',
		getTextBackgroundColor: 'getBackgroundColor',
		getTextBorderColor: 'getBorderColor',
		getTextBorderWidth: 'getBorderWidth',
		textSizeUnits: 'sizeUnits',
		textSizeScale: 'sizeScale',
		textSizeMinPixels: 'sizeMinPixels',
		textSizeMaxPixels: 'sizeMaxPixels',
		textCharacterSet: 'characterSet',
		textFontFamily: 'fontFamily',
		textFontWeight: 'fontWeight',
		textLineHeight: 'lineHeight',
		textMaxWidth: 'maxWidth',
		textWordBreak: 'wordBreak',
		textBackground: 'background',
		textBackgroundPadding: 'backgroundPadding',
		textOutlineColor: 'outlineColor',
		textOutlineWidth: 'outlineWidth',
		textBillboard: 'billboard',
		textFontSettings: 'fontSettings',
		textCollisionEnabled: 'collisionEnabled',
		textExtensions: 'extensions',
	};

	const textProps = getKeysByMapping(textLayerMapping);

	return {
		geojsonProps,
		textProps,
	};
};

class M1neralGeojsonLayer extends CompositeLayer {
	renderLayers() {
		const { geojsonProps, textProps } = transformFields(this.props);
		// GeoJsonLayer
		const geoJsonLayer = new GeoJsonLayer({
			...geojsonProps,
			id: `${this.id}-geojson-layer`,
			data: this.props.data,

			// props added by FillStyleExtension
			extensions: [new FillStyleExtension({ pattern: true }), new PathStyleExtension({ dash: true })],
		});

		// TextLayer
		const textLayer = new TextLayer({
			...textProps,
			id: `${this.id}-text-layer`,
			data: this.props.data,
			getPosition: x => {
				const centroid = turf.centroid(x);
				return centroid.geometry.coordinates;
			},
			collisionEnabled: true,
			extensions: [new CollisionFilterExtension()],
		});

		return [geoJsonLayer, textLayer];
	}
}

M1neralGeojsonLayer.layerName = 'M1neralGeojsonLayer';

export default M1neralGeojsonLayer;
