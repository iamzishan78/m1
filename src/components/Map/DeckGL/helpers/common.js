import * as turf from '@turf/turf';
import hexRgb from 'hex-rgb';
import _, { isEqual } from 'lodash';
import mapboxgl from 'mapbox-gl';

import { colorBasedAttributes } from 'components/MapControls/components/Layer/LayerAttributes/ColorBasedAttributes';
import { copy, getPolygonString } from 'components/Shared/functions';
import {
	deckGlLandGridIdentifiers,
	ifDeckGlLandGridIdentifiers,
	ifDefaultLayers,
	ifPlatformLandGridIdentifiers,
} from 'components/Shared/functions/shapeLayer';

import { getLayerKey } from 'stateManagement/helpers';
import { layerController } from 'stateManagement/layerStateController';
import { popupController } from 'stateManagement/popupStateController';

const MAX_COLOR_VALUE_HEX = 0xfffff;
const COLOR_MULTIPLIER = 1000000;
const SIXTEEN = 16;
const SIX = 6;
const OPACITY = 0.9;
const WIDTH_FACTOR = 0.6;
const FORTY = 40;
const TWENTY = 20;
const THREE = 3;
const TWO = 2;
const FOUR = 4;
const FIVE = 5;
const MAX_COLOR_VALUE = 251;
const DEFAULT_COLOR_VALUE = 152;
const MAX_COLOR_COMPONENT_VALUE = 255;

const defaultColorPalette = [
	[255, 255, 178],
	[254, 217, 118],
	[254, 178, 76],
	[253, 141, 60],
	[240, 59, 32],
	[189, 0, 38],
];

const lineStyles = {
	dots: [2, 2],
	dashed: [10, 3],
	connected: [10, 0],
};

export const random_hex_color_code = () => {
	const n = (Math.random() * MAX_COLOR_VALUE_HEX * COLOR_MULTIPLIER).toString(SIXTEEN);
	return `#${n.slice(0, SIX)}`;
};

export const getPointSourceFromFeatures = features =>
	features.map(feature => {
		let output = feature;

		if (feature.geometry.type === 'Point') {
			output = feature;
		} else {
			output = {
				...turf.centroid(feature),
				properties: feature.properties,
			};
		}

		return output;
	});

export const getPointSourceFromGeoJson = geoJson => getPointSourceFromFeatures(geoJson?.features);

export const getLayerData = (identifier, dataId, data) => {
	let layerData;

	if (ifDefaultLayers(identifier)) {
		const groupBy = (arr, property) =>
			arr.reduce((memo, x) => {
				if (!memo[x[property]]) {
					memo[x[property]] = [];
				}
				memo[x[property]].push(x);
				return memo;
			}, {});
		layerData = groupBy(data, 'layer')[dataId];
		if (!layerData) {
			layerData = [];
		}
	} else {
		layerData = data;
	}

	return layerData;
};

export const getShapeLabelProps = (shape, labelProps) => {
	const label =
		shape.properties?.[labelProps?.symbolProps?.['text-field']?.match(/\{(.*?)\}/)?.[1] || 'shapeLabel'] ||
		shape.properties?.shapeLabel;

	const [minX, minY, maxX, maxY] = turf.bbox(shape);

	// Calculate distances in meters using turf.distance
	const bottomLeft = [minX, minY];
	const bottomRight = [maxX, minY];
	const topLeft = [minX, maxY];

	const bboxWidth = turf.distance(bottomLeft, bottomRight, { units: 'meters' });
	const bboxHeight = turf.distance(bottomLeft, topLeft, { units: 'meters' });

	// Estimate text dimensions based on length
	const textLength = label.length;
	const maxTextWidth = bboxWidth * OPACITY; // 90% of the bounding box width
	const maxTextHeight = bboxHeight * OPACITY; // 90% of the bounding box height

	// Assuming a base size of 100 meters, adjust size based on the bounding box
	const baseSize = 100;
	const adjustedWidth = baseSize * (maxTextWidth / (textLength * baseSize * WIDTH_FACTOR)); // 0.6 is an approximate width factor per character
	const adjustedHeight = baseSize * (maxTextHeight / baseSize);

	// Return the smaller of the two adjusted sizes
	const textSize = Math.min(adjustedWidth, adjustedHeight);

	return {
		...turf.centroid(shape),
		properties: {
			label: label,
			textSize,
		},
	};
};

export const makeGeoJSON = (mdata, labelProps) => ({
	type: 'FeatureCollection',
	features: mdata
		.flatMap(feature => {
			if (Object.prototype.hasOwnProperty.call(feature, 'Geometry')) {
				return {
					type: 'Feature',
					properties: feature,
					geometry: JSON.parse(feature.Geometry),
				};
			}

			if (Object.prototype.hasOwnProperty.call(feature, 'geoJSON')) {
				return {
					type: 'Feature',
					properties: feature,
					geometry: feature.geoJSON,
				};
			}

			if (feature.latitude && feature.longitude) {
				return {
					type: 'Feature',
					properties: feature,
					geometry: {
						type: 'Point',
						coordinates: [Number(feature.longitude), Number(feature.latitude)],
					},
				};
			}

			if (feature.Latitude && feature.Longitude) {
				return {
					type: 'Feature',
					properties: feature,
					geometry: {
						type: 'Point',
						coordinates: [Number(feature.Longitude), Number(feature.Latitude)],
					},
				};
			}

			if (feature.shapeJson || feature.assetShape?.shapeJson) {
				let shape = {};
				if (feature.shapeJson) {
					shape = feature.shapeJson;
				} else if (feature.assetShape?.shapeJson) {
					const ignoreKeys = ['assetShape', 'sort', '_id'];
					const assetData = Object.fromEntries(Object.entries(feature).filter(([key]) => !ignoreKeys.includes(key)));
					shape = {
						...feature.assetShape?.shapeJson,
						properties: { ...feature.assetShape?.shapeJson?.properties, ...assetData },
					};
				} else {
					shape = JSON.parse(feature.shape);
				}

				// This is temporary solution to replace Mapbox.Draw library's autogenerated `id`
				// with mongondb id.
				const labels = [];
				if (feature._id) {
					shape.id = feature._id;
					shape.properties.id = feature._id;
					if (labelProps) {
						if (shape.geometry?.type === 'MultiPolygon') {
							const shapesCoordinates = copy(shape.geometry.coordinates);
							for (let i = 0; i < shapesCoordinates.length; i++) {
								const newShape = copy(shape);
								newShape.geometry.type = 'Polygon';
								newShape.geometry.coordinates = shapesCoordinates[i];
								labels.push(getShapeLabelProps(newShape, labelProps));
							}
						} else if (shape.geometry?.type === 'Point') {
							const { properties } = getShapeLabelProps(shape, labelProps);
							shape.properties = { ...shape.properties, ...properties };
						} else {
							labels.push(getShapeLabelProps(shape, labelProps));
						}
					}
				}
				return [shape, ...labels];
			}

			if (feature.wellData?.geoJSON?.geometries?.[0]) {
				return feature.wellData?.geoJSON?.geometries.map(geometry => ({
					type: 'Feature',
					properties: feature.wellData,
					geometry,
				}));
			}

			return feature;
		})
		.filter(feature => feature.geometry?.type),
});

export const filterUniqueFeatures = features => {
	features = features
		.map(feature => ({
			...feature,
			object: {
				...feature.object,
				id:
					feature?.object?._id ||
					feature?.object?.id ||
					feature?.object?.properties?.id ||
					feature?.object?.properties?.Id ||
					feature?.layer?.id,
			},
		}))
		.filter(f => f?.object?.id);
	features = _.uniqBy(features, 'object.id');

	return features;
};

export const pickDeckObjects = ({ x, y, radius, depth }) => {
	if (!window?.deckOverlay?._deck) {
		return null;
	}
	let deckFeatures = window?.deckOverlay?._deck?.pickMultipleObjects({
		x,
		y,
		radius,
		depth,
	});

	return filterUniqueFeatures(deckFeatures);
};

export const hexToRGB = hex => {
	// Remove the '#' symbol if present
	hex = hex.replace('#', '');

	// Expand the shorthand hexadecimal form if needed
	if (hex.length === THREE) {
		hex = hex
			.split('')
			.map(char => char + char)
			.join('');
	}

	// Convert the hexadecimal to decimal values for red, green, and blue components
	const r = parseInt(hex.substring(0, TWO), SIXTEEN);
	const g = parseInt(hex.substring(TWO, FOUR), SIXTEEN);
	const b = parseInt(hex.substring(FOUR, SIX), SIXTEEN);

	// Return the RGBA string
	return `rgba(${r},${g},${b})`;
};

export const getRGBA = (rgb, a) => {
	if (!rgb) {
		return [MAX_COLOR_VALUE, DEFAULT_COLOR_VALUE, FORTY, MAX_COLOR_COMPONENT_VALUE];
	}

	if (rgb.includes('#')) {
		rgb = hexToRGB(rgb);
	}

	// Determine alpha value
	let alpha = typeof a === 'number' ? a : undefined;

	const concatIndex = rgb.indexOf('rgba') === -1 ? FOUR : FIVE;

	let colorArray;
	if (rgb.indexOf('rgb') === -1) {
		// Parse hex color
		colorArray = hexRgb(rgb, { format: 'array', alpha });
	} else {
		// Parse rgb or rgba color string
		colorArray = [
			...rgb
				.substring(concatIndex, rgb.length - 1)
				.replace(/ /g, '')
				.split(',')
				.map(s => +s),
		];
	}

	// Convert alpha to 0-255 range if it's a fractional value
	if (colorArray[THREE] < 1) {
		colorArray[THREE] = Math.round((colorArray[THREE] || 1) * MAX_COLOR_COMPONENT_VALUE);
	}

	// Override alpha if explicitly provided
	if (alpha !== undefined) {
		colorArray[THREE] = Math.round(alpha * MAX_COLOR_COMPONENT_VALUE);
	}

	// Default to full opacity if alpha is undefined
	if (colorArray[THREE] === undefined) {
		colorArray[THREE] = MAX_COLOR_COMPONENT_VALUE;
	}

	return colorArray;
};

export const divideBoundingBox = bbox => {
	const isBBoxObj = bbox.top_left && bbox.bottom_right;
	if (isBBoxObj) {
		bbox = [bbox.top_left.lon, bbox.bottom_right.lat, bbox.bottom_right.lon, bbox.top_left.lat];
	}

	// Extract bbox coordinates
	const [minX, minY, maxX, maxY] = bbox;

	// Calculate center point
	const centerX = (minX + maxX) / TWO;
	const centerY = (minY + maxY) / TWO;

	// Create new bounding boxes
	const boxes = [
		[minX, centerY, centerX, maxY], // Top-left box
		[centerX, minY, maxX, centerY], // Bottom-right box
		[minX, minY, centerX, centerY], // Bottom-left box
		[centerX, centerY, maxX, maxY], // Top-right box
	];

	if (isBBoxObj) {
		return boxes.map(bbox => ({
			top_left: {
				lat: bbox[THREE],
				lon: bbox[0],
			},
			bottom_right: {
				lat: bbox[1],
				lon: bbox[TWO],
			},
		}));
	}

	return boxes;
};

export const dividePolygon = polygon => {
	// Calculate the centroid of the polygon
	// Calculate the bounding box (bbox) of the polygon
	const bbox = turf.bbox(polygon);
	const [minX, minY, maxX, maxY] = bbox;

	// Calculate the center point of the bounding box
	const centerX = (minX + maxX) / TWO;
	const centerY = (minY + maxY) / TWO;

	// Create polygons for each quadrant
	const topLeft = turf.polygon([
		[
			[minX, centerY],
			[centerX, centerY],
			[centerX, maxY],
			[minX, maxY],
			[minX, centerY],
		],
	]);

	const topRight = turf.polygon([
		[
			[centerX, centerY],
			[maxX, centerY],
			[maxX, maxY],
			[centerX, maxY],
			[centerX, centerY],
		],
	]);

	const bottomLeft = turf.polygon([
		[
			[minX, minY],
			[centerX, minY],
			[centerX, centerY],
			[minX, centerY],
			[minX, minY],
		],
	]);

	const bottomRight = turf.polygon([
		[
			[centerX, minY],
			[maxX, minY],
			[maxX, centerY],
			[centerX, centerY],
			[centerX, minY],
		],
	]);

	return [topLeft, topRight, bottomLeft, bottomRight];
};

export const getPolygonStringFromBBox = bbox => {
	const isBBoxObj = bbox.top_left && bbox.bottom_right;
	if (isBBoxObj) {
		bbox = [bbox.top_left.lon, bbox.bottom_right.lat, bbox.bottom_right.lon, bbox.top_left.lat];
	}

	const bboxPolygon = turf.bboxPolygon(bbox);

	return getPolygonString(bboxPolygon);
};

export const makeGeoJSONFromStrings = data => ({
	type: 'FeatureCollection',
	features: data.map(feature => JSON.parse(feature.geo_json)),
});

export const makeLabelGeoJsonFromStrings = data => ({
	type: 'FeatureCollection',
	features: data.map(feature => {
		const geoJSON = JSON.parse(feature.geo_json);
		if (geoJSON.geometry && geoJSON.geometry.coordinates[0].length >= FOUR) {
			const polygon = turf.polygon(geoJSON.geometry.coordinates);
			const centroid = turf.centroid(polygon);
			centroid.properties.AbstractName = geoJSON.properties.AbstractName;
			return centroid;
		}

		return null;
	}),
});

export const createFilterPopup = filterFeature => {
	const { geometry } = filterFeature;
	const { coordinates } = geometry;
	const popUps = document.getElementsByClassName('mapboxgl-popup');
	if (popUps[0]) {
		popUps[0].remove();
	}
	if (coordinates.length > 0) {
		const minLatitude = coordinates.reduce((a, b) => (a[0] < b[0] ? a : b))[0][0];
		const maxLongitude = coordinates.reduce((a, b) => (a[1] > b[1] ? a : b))[0][1];

		const popupCoordinate = [minLatitude, maxLongitude];

		new mapboxgl.Popup({ offset: 0, closeOnClick: false })
			.setLngLat(popupCoordinate)
			.setMaxWidth('none')
			.setHTML('<div id="filterPopupContainer"></div>')
			.addTo(window.mapRef);

		popupController.updateState({
			popupOpen: true,
		});

		window.setStateApp(state => ({
			...state,
			filterFeature,
		}));
	}
};

// Utility function to get advanced search query
export const getAdvancedSearch = (layerGeometry, mustQuery) => [
	{
		$and: [
			...(mustQuery?.length > 0 ? [{ $or: mustQuery }] : []),
			{
				$or:
					layerGeometry === 'Polygon'
						? [{ 'properties.layerGeometry': 'Polygon' }, { 'properties.layerGeometry': 'MultiPolygon' }]
						: [{ 'properties.layerGeometry': layerGeometry }],
			},
		],
	},
];

export const extractUniqueFilters = filters => {
	return filters.reduce((acc, filter) => {
		const index = acc.findIndex(existingFilter => existingFilter.field === filter.field);

		if (index !== -1) {
			// Overwrite the existing filter with the new one (higher precedence)
			acc[index] = filter;
		} else {
			// Add the filter if it doesn't exist
			acc.push(filter);
		}

		return acc;
	}, []);
};

// Query made generic to support in both TransferData Manager and layerStateController
export const generateFileFilters = ({
	fileLayer,
	pagination = { first: 10000, after: null, getAllData: true },
	extendFilters = { variables: {} },
}) => {
	let mustQuery = [];

	// Added fileAlternateName to support the case where the file name is different from the layer name
	const fileAlternateName = `${fileLayer?.fileName} - ${fileLayer.layerGeometry}`;
	// Altered query accordingly
	if (fileLayer.layerIdentifier) {
		mustQuery = [
			{ 'properties.layerIdentifier': fileAlternateName },
			{ 'properties.layerIdentifier': fileLayer.layerIdentifier },
			{ 'properties.layerShapeName': fileAlternateName },
			{ 'properties.layerShapeName': fileLayer.layerIdentifier },
		];
	}

	const advanceSearch = getAdvancedSearch(fileLayer.layerGeometry, mustQuery);

	const filters = [{ field: 'fileId', value: fileLayer.file }];

	return {
		variables: {
			index: 'shapefile_flat',
			pagination,
			...(extendFilters?.variables || {}),
			search: extendFilters?.variables?.search || {
				advanceSearch,
			},
			filters: extractUniqueFilters([...filters, ...(extendFilters?.variables?.filters || [])]),
		},
	};
};

export const filterValidFilters = filters => {
	if (filters) {
		return filters.filter(filter => {
			const value = filter.value;
			return !(
				value === null ||
				value === undefined ||
				(Array.isArray(value) && value.length === 0) ||
				(typeof value === 'object' && Object.keys(value).length === 0)
			);
		});
	} else {
		return [];
	}
};

// Utility for getting attribute based color
const getAttributeBasedColor = (attrFillColor, isColorEnabled) => {
	// If fill color is an object
	if (attrFillColor?.rgb) {
		let fColor =
			attrFillColor.rgb.length === THREE
				? 'rgb(' + attrFillColor.rgb.join() + ')'
				: 'rgba(' + attrFillColor.rgb.join() + ')';
		let fColorOp = attrFillColor.alpha;
		return isColorEnabled === false ? [0, 0, 0, 0] : getRGBA(fColor, fColorOp);
	}
	if (attrFillColor) {
		return isColorEnabled === false ? [0, 0, 0, 0] : getRGBA(attrFillColor, 1);
	}
	return [];
};

// Utility for getting layer stroke color
export const getLayerStrokeColor = (dbLayer, strokeColor) => {
	const layerInteraction = dbLayer.layerSettings?.interaction;
	const selectAttr = dbLayer.layerSettings?.selectedStrokeAttribute?.label;
	const attributeBasedStrokeColors = dbLayer.layerSettings.attributeBasedStrokeColors;

	return d => {
		if (selectAttr) {
			let path = colorBasedAttributes[getLayerKey(dbLayer?.identifier, colorBasedAttributes)]?.keys.find(
				key => key.label === selectAttr
			);
			if (!path) {
				path = dbLayer.layerSettings?.selectedStrokeAttribute;
			}

			let keys = path?.value.includes('.') ? path.value.split('.').slice(1, -1) : `properties.${path?.value}`;

			let orKeys = keys.slice(0, -1);
			if (path.orKey) {
				orKeys.push(path.orKey);
			}
			let value =
				_.get(d, keys) || (path.orKey ? _.get(d, orKeys) : null) || _.get(d, path?.value.replace('.keyword', ''));
			if (!value) {
				keys = path?.value.split('.').slice(1, -1);
				keys.unshift('properties');
				value = _.get(d, keys);
			}

			const attrFillColor = attributeBasedStrokeColors[selectAttr][value] || attributeBasedStrokeColors[selectAttr][''];
			if (attrFillColor) {
				return getAttributeBasedColor(attrFillColor, layerInteraction.interactionDetail?.enableStrokeColor);
			}
		}
		return layerInteraction.interactionDetail?.enableStrokeColor === false ? [0, 0, 0, 0] : getRGBA(strokeColor);
	};
};

// Utility for getting layer fill color
export const getLayerFillColor = (dbLayer, fillColor, fillOpacity) => {
	const layerInteraction = dbLayer.layerSettings?.interaction;
	const selectAttr = dbLayer.layerSettings?.selectedAttribute?.label;
	const attributeBasedColors = dbLayer.layerSettings?.attributeBasedColors;

	return d => {
		if (selectAttr) {
			let path = colorBasedAttributes[getLayerKey(dbLayer?.identifier, colorBasedAttributes)]?.keys.find(
				key => key.label === selectAttr
			);
			if (!path) {
				path = dbLayer.layerSettings?.selectedAttribute;
			}

			let keys = path?.value.includes('.') ? path.value.split('.').slice(1, -1) : `properties.${path?.value}`;
			let orKeys = keys.slice(0, -1);
			if (path.orKey) {
				orKeys.push(path.orKey);
			}
			let value =
				_.get(d, keys) || (path.orKey ? _.get(d, orKeys) : null) || _.get(d, path?.value.replace('.keyword', ''));
			if (!value) {
				keys = path?.value.split('.').slice(1, -1);
				keys.unshift('properties');
				value = _.get(d, keys);
			}
			// [selectAttr][''] used for representing null or empty values for the selectedattr(selected attribute)
			const attrFillColor = attributeBasedColors[selectAttr][value] || attributeBasedColors[selectAttr][''];
			if (attrFillColor) {
				return getAttributeBasedColor(attrFillColor, layerInteraction.interactionDetail?.enablefillColor);
			}
		}
		return layerInteraction.interactionDetail?.enablefillColor === false
			? [0, 0, 0, 0]
			: getRGBA(fillColor, fillOpacity);
	};
};

export const getLayerFillStyle = dbLayer => {
	// const layerInteraction = dbLayer.layerSettings?.interaction;
	const selectedFillStyle = dbLayer.layerSettings?.selectedFillStyle;
	const selectAttrLabel = dbLayer.layerSettings?.selectedFillStyle?.label;
	const attributeBasedStyles = dbLayer.layerSettings?.attributeBasedStyles;

	return d => {
		if (selectAttrLabel) {
			let path = selectedFillStyle.value;
			let keys = path.includes('.') ? path.split('.').slice(1, -1) : `properties.${path}`;
			let value = _.get(d, keys) || _.get(d, path?.replace('.keyword', ''));
			if (!value) {
				keys = path?.split('.').slice(1, -1);
				keys.unshift('properties');
				value = _.get(d, keys);
			}
			const attrFillStyle = attributeBasedStyles[selectAttrLabel][value] || attributeBasedStyles[selectAttrLabel][''];
			if (attrFillStyle) {
				return attrFillStyle || dbLayer.layerSettings?.fillStyle;
			}
		}
		return dbLayer.layerSettings?.fillStyle;
	};
};

export const getLayerDashStyle = dbLayer => {
	// const layerInteraction = dbLayer.layerSettings?.interaction;
	const selectedLineStyle = dbLayer.layerSettings?.selectedLineStyle;
	const selectAttrLabel = dbLayer.layerSettings?.selectedLineStyle?.label;
	const attributeBasedLineStyles = dbLayer.layerSettings?.attributeBasedLineStyles;

	return d => {
		if (selectAttrLabel) {
			let path = selectedLineStyle.value;
			let keys = path.includes('.') ? path.split('.').slice(1, -1) : `properties.${path}`;
			let value = _.get(d, keys) || _.get(d, path?.replace('.keyword', ''));
			if (!value) {
				keys = path?.split('.').slice(1, -1);
				keys.unshift('properties');
				value = _.get(d, keys);
			}
			const attrLineStyle =
				attributeBasedLineStyles[selectAttrLabel][value] || attributeBasedLineStyles[selectAttrLabel][''];
			if (attrLineStyle) {
				return lineStyles[attrLineStyle] || lineStyles[dbLayer.layerSettings?.lineStyle] || lineStyles.connected;
			}
		}
		return lineStyles[dbLayer.layerSettings?.lineStyle] || lineStyles.connected;
	};
};

export function getHexLayerProps(dbLayer) {
	const basedOnField = dbLayer.layerSettings?.selectedAttribute?.value;
	const aggregation = dbLayer.layerSettings?.aggregation;
	const props = {};

	if (basedOnField) {
		props.getColorWeight = d => _.get(d, basedOnField);
		props.colorAggregation = aggregation;
	} else {
		props.getColorValue = points => points.length;
	}
	props.getPosition = d => {
		if (d?.properties?.WellName) {
			return d.geometry.geometries[0].coordinates;
		} else {
			return d.geometry.coordinates;
		}
	};
	props.getElevationValue = points => points.length;
	props.radius = dbLayer.layerSettings?.binsWidth * 10 || 200;
	props.elevationScale = dbLayer.layerSettings?.elevationScale || 4;
	props.colorScaleType = dbLayer.layerSettings?.colorScaleType || 'quantize';
	props.extruded = dbLayer.layerSettings?.isExtruded;

	// Ensure colorRange is always set with a default if not provided
	props.colorRange = dbLayer.layerSettings?.selectedPalette || defaultColorPalette;

	// // Add colorDomain to ensure proper color mapping
	// props.colorDomain = [0, 100]; // Default domain, will be updated by onSetColorDomain

	props.onSetColorDomain = domain => {
		const [min, max] = domain;
		if (min === Infinity || max === Infinity) {
			return;
		}

		// Check if min and max are valid numbers
		if (typeof min !== 'number' || typeof max !== 'number' || isNaN(min) || isNaN(max)) {
			return;
		}

		const numColors = props.colorRange.length;
		const binSize = (max - min) / numColors; // Auto bin size
		const autoBins = Array.from({ length: numColors + 1 }, (_, i) => min + i * binSize);
		const binLabels = autoBins.slice(0, -1).map((start, i) => `${start} - ${autoBins[i + 1]}`);
		layerController.updateState({
			bins: binLabels,
		});
	};

	return props;
}
export function getHeatMapLayerProps(dbLayer) {
	const aggregation = dbLayer.layerSettings?.aggregation;

	const props = {};
	props.aggregation = aggregation;
	props.getPosition = d => {
		if (d?.properties?.WellName) {
			return d.geometry.geometries[0].coordinates;
		} else {
			return d.geometry.coordinates;
		}
	};
	props.radiusPixels = dbLayer.layerSettings?.binsWidth * 10 || 50;

	props.colorRange = dbLayer.layerSettings?.selectedPalette || defaultColorPalette;

	// // Add required properties for heatmap
	// props.intensity = 1.0;
	// props.threshold = 0.05;
	// props.weightsTextureSize = 256;
	// props.getWeight = () => 1;
	// props.colorDomain = [0, 100]; // Default domain

	// // Add color scale type
	// props.colorScaleType = dbLayer.layerSettings?.colorScaleType || 'quantize';

	return props;
}
export function getGridLayerProps(dbLayer) {
	const basedOnField = dbLayer.layerSettings?.selectedAttribute?.value;
	const aggregation = dbLayer.layerSettings?.aggregation;

	const props = {};

	if (basedOnField) {
		props.getColorWeight = d => _.get(d, basedOnField);
		props.colorAggregation = aggregation;
	} else {
		props.getColorValue = points => points.length;
	}

	props.getPosition = d => {
		if (d?.properties?.WellName) {
			return d.geometry.geometries[0].coordinates;
		} else {
			return d.geometry.coordinates;
		}
	};
	props.getElevationValue = points => points.length;
	props.cellSize = dbLayer.layerSettings?.binsWidth * 10 || 200;
	props.elevationScale = dbLayer.layerSettings?.elevationScale || 4;
	props.colorScaleType = dbLayer.layerSettings?.colorScaleType || 'quantize';
	props.extruded = dbLayer.layerSettings?.isExtruded;

	// Ensure colorRange is always set with a default if not provided
	props.colorRange = dbLayer.layerSettings?.selectedPalette || defaultColorPalette;

	// // Add colorDomain to ensure proper color mapping
	// props.colorDomain = [0, 100]; // Default domain, will be updated by onSetColorDomain

	props.onSetColorDomain = domain => {
		const [min, max] = domain;
		// Check if min and max are valid numbers
		if (typeof min !== 'number' || typeof max !== 'number' || isNaN(min) || isNaN(max)) {
			return;
		}

		const numColors = props.colorRange.length;
		const binSize = (max - min) / numColors; // Auto bin size
		const autoBins = Array.from({ length: numColors + 1 }, (_, i) => min + i * binSize);
		const binLabels = autoBins.slice(0, -1).map((start, i) => `${start} - ${autoBins[i + 1]}`);
		layerController.updateState({
			bins: binLabels,
		});
	};

	return props;
}
export function getGeoJsonLayerProps(dbLayer, labelProps) {
	const props = {};
	// Getting layer interation settings
	const layerInteraction = dbLayer.layerSettings?.interaction;
	dbLayer.layerPaintProps?.forEach(prop => {
		const fillColor = prop.paintProps?.['fill-color'];
		const fillOpacity = prop.paintProps?.['fill-opacity'];
		const strokeWidth = prop.paintProps?.['strokeWidth'];
		const fillStroke = prop.paintProps?.['fill-outline-color'] || prop.paintProps?.['line-color'];

		const pointColor = prop.paintProps?.['circle-color'];
		const pointOpacity = prop.paintProps?.['circle-opacity'];
		const pointStroke = prop.paintProps?.['circle-stroke-color'] || prop.paintProps?.['line-color'];
		const pointRadius = prop.paintProps?.['circle-radius'] || 1;
		const pointWidth = prop.paintProps?.['circle-stroke-width'] || 1;

		const lineColor = prop.paintProps?.['line-color'];
		const lineOpaciity = prop.paintProps?.['line-opacity'];
		const lineWidth = prop.paintProps?.['line-width'] || 1;

		const getLineColor = getLayerFillColor(dbLayer, lineColor, lineOpaciity);
		switch (prop.paintType) {
			case 'fill':
				// Setting fill and line color using utility functions
				props.getFillColor = getLayerFillColor(dbLayer, fillColor, fillOpacity);
				props.defaultColor = getRGBA(fillColor, fillOpacity);
				props.getLineColor = getLayerStrokeColor(dbLayer, fillStroke);
				props.getLineWidth = feature => {
					// Calculate area of the shape
					const area = turf.area(feature);
					// If area is less than 10 sq meters, return 0
					if (area < 10) {
						return 0;
					}
					// If area is less than 1000 sq meters, return 1
					if (area < 1000) {
						return 1;
					}
					return strokeWidth || TWENTY;
				};

				break;

			case 'circle':
				// Setting fill and line color using utility functions
				props.getFillColor = getLayerFillColor(dbLayer, pointColor, pointOpacity);
				props.defaultColor = getRGBA(pointColor, pointOpacity);
				props.getLineColor = getLayerStrokeColor(dbLayer, pointStroke);

				props.getPointRadius = pointRadius * FORTY;
				props.getLineWidth = feature => {
					// Calculate area of the shape
					const area = turf.area(feature);
					// If area is less than 10 sq meters, return 0
					if (area < 10) {
						return 0;
					}
					// If area is less than 1000 sq meters, return 1
					if (area < 1000) {
						return 1;
					}
					return pointWidth * FORTY;
				};

				break;

			case 'line':
				props.getLineWidth = lineWidth * FORTY;

				// If fill color not enabled setting fill color to transparent
				props.getFillColor =
					layerInteraction.interactionDetail?.enablefillColor === false ? [0, 0, 0, 0] : props.getFillColor;

				if (!props.getLineColor || !isEqual(getLineColor, props.getFillColor)) {
					props.getLineColor =
						layerInteraction.interactionDetail?.enableStrokeColor === false
							? [0, 0, 0, 0]
							: getLayerFillColor(dbLayer, lineColor, lineOpaciity);
				}

				break;

			default:
				break;
		}
	});

	if (labelProps && labelProps.visibility !== 'none') {
		props.getTextSize = () => {
			return 20;
		};
		// props.textMaxWidth = 5;
		props.pointType = 'text';
		if (dbLayer.layerPaintProps?.[0]?.paintType === 'circle') {
			props.pointType = 'circle+text';
		}

		props.textFontFamily = 'Poppins';
		// props.textSizeUnits = 'meters';
	} else if (labelProps?.visibility) {
		// Adhoc Fix
		props.pointType = 'icon';
	}

	if (
		layerInteraction.interactionDetail?.enableStrokeStyle &&
		(dbLayer.layerSettings?.selectedLineStyle || dbLayer.layerSettings?.lineStyle)
	) {
		props.getDashArray = getLayerDashStyle(dbLayer);
		props.dashJustified = true;
		props.dashGapPickable = true;
	}

	if (
		(layerInteraction.interactionDetail?.enableColorStyle && dbLayer.layerSettings?.selectedFillStyle) ||
		dbLayer.layerSettings?.fillStyle
	) {
		// fill pattern props
		props.stroked = true;
		props.filled = true;
		props.lineWidthMinPixels = 2;
		props.fillPatternScale = 10;
		props.fillPatternEnabled = true;

		props.fillPatternMask = true;
		props.getFillPatternScale = 1;
		props.getFillPatternOffset = [0, 0];
		props.getFillPattern = getLayerFillStyle(dbLayer);
		props.fillPatternAtlas =
			'https://raw.githubusercontent.com/visgl/deck.gl/master/examples/layer-browser/data/pattern.png';
		props.fillPatternMapping =
			'https://raw.githubusercontent.com/visgl/deck.gl/master/examples/layer-browser/data/pattern.json';
	} else {
		props.fillPatternEnabled = false;
	}
	return props;
}

export const getClickedFeature = ({ x, y, depth = Infinity, getLandGrid = true, radius, getMultiLandGrid }) => {
	let features = pickDeckObjects({ x, y, depth, radius });

	if (!getLandGrid && !getMultiLandGrid) {
		features = features.filter(f => !deckGlLandGridIdentifiers.some(prefix => f.layer.id.startsWith(prefix)));
	} else {
		if (getLandGrid) {
			features = features.filter(f => ifDeckGlLandGridIdentifiers(f.layer.id));
			return { clickedFeature: features[0], layer: { identifier: 'Land Grid' }, features };
		}

		features = features.filter(f => ifPlatformLandGridIdentifiers(f.layer.id));
	}

	let clickedFeature = null;
	let layer = null;

	const layers = layerController.getValue('layers');

	layers
		.filter(l => l.layerSettings?.showable && l.layerSettings?.visiable)
		.some(l => {
			clickedFeature = features.find(f => {
				if (l.identifier === 'Land Grid') {
					return deckGlLandGridIdentifiers.some(prefix => f.layer.id.startsWith(prefix));
				}
				return f.layer.id.startsWith(l.identifier);
			});
			if (clickedFeature) {
				layer = l;
			}
			return clickedFeature;
		});

	return { clickedFeature, layer, features };
};
