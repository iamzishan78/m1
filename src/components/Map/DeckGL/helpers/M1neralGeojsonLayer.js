import { CompositeLayer } from '@deck.gl/core';
import { GeoJsonLayer, TextLayer } from '@deck.gl/layers';

const transformFields = input => {
	const mapping = {
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
	};

	const newObject = {};
	const remainingObject = { ...input };

	for (const [oldKey, newKey] of Object.entries(mapping)) {
		if (oldKey in input) {
			newObject[newKey] = input[oldKey];
			delete remainingObject[oldKey];
		}
	}

	return [remainingObject, newObject];
};

class M1neralGeojsonLayer extends CompositeLayer {
	renderLayers() {
		const [geojsonProps, textProps] = transformFields(this.props);

		// GeoJsonLayer
		const geoJsonLayer = new GeoJsonLayer({
			...geojsonProps,
			id: `${this.id}-geojson-layer`,
			data: this.props.data,
		});

		// TextLayer
		const textLayer = new TextLayer({
			...textProps,
			id: `${this.id}-text-layer`,
			data: this.props.data,
			getPosition: x => x.geometry.coordinates,
		});

		return [geoJsonLayer, textLayer];
	}
}

M1neralGeojsonLayer.layerName = 'M1neralGeojsonLayer';

export default M1neralGeojsonLayer;
