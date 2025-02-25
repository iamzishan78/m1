import { area, convertArea, length } from '@turf/turf';
import * as turf from '@turf/turf';

import { calculateShapeCenter } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';

import { drawController } from 'controllers/drawStateController';
import { popupController } from 'controllers/popupStateController';

export const showIfUserDefinedLayer = () => {
	const currentFeature = drawController.getValue('currentFeature');
	const selectedUserDefinedLayer = popupController.getValue('selectedUserDefinedLayer');

	return (
		!selectedUserDefinedLayer &&
		currentFeature?.source !== 'parcels_source' &&
		currentFeature?.source !== 'units_source' &&
		!['Area of Interest'].includes(currentFeature?.identifier) &&
		currentFeature?.source !== 'agreements_source' &&
		currentFeature?.source !== 'contracts_source' &&
		currentFeature?.source !== 'deeds_source' &&
		currentFeature?.source !== 'leases_source' &&
		currentFeature?.source !== 'surfaces_source'
	);
};

export const layersWithSelectedShapeKey = () => {
	const layers = ['units', 'agreements', 'contracts', 'deeds', 'leases', 'surfaces', 'parcels'];
	const keys = {};
	layers.forEach(key => {
		keys[key] = 'selectedShape';
	});
	return keys;
};

export const ifDefaultLayers = identifier => {
	return (
		identifier === 'Parcels' ||
		identifier === 'Area of Interest' ||
		identifier === 'Units' ||
		identifier === 'Agreements' ||
		identifier === 'Contracts' ||
		identifier === 'Deeds' ||
		identifier === 'Leases' ||
		identifier === 'Surfaces'
	);
};

export const ifDefaultSources = source => {
	return (
		source === 'parcels_source' ||
		['interests_source', 'area of interest_source'].includes(source) ||
		source === 'units_source' ||
		source === 'agreements_source' ||
		source === 'contracts_source' ||
		source === 'deeds_source' ||
		source === 'leases_source' ||
		source === 'surfaces_source'
	);
};

export const ifGenericShapeSource = source => {
	return (
		source === 'units_source' ||
		source === 'agreements_source' ||
		source === 'contracts_source' ||
		source === 'deeds_source' ||
		source === 'leases_source' ||
		source === 'surfaces_source'
	);
};

const genericShapeIdentifiers = ['Parcels', 'Units', 'Agreements', 'Contracts', 'Deeds', 'Leases', 'Surfaces'];
const defaultIdentifiers = [...genericShapeIdentifiers, 'Interests'];

export const ifGenericShapeIdentifier = identifier => genericShapeIdentifiers.includes(identifier);
export const ifDefaultIdentifier = identifier => defaultIdentifiers.includes(identifier);

export const ifFileShapeSource = source => {
	// Check if source is not in predefined sources and isn't a serach layer
	return (
		![
			'area of interest_source',
			'interests_source',
			'units_source',
			'agreements_source',
			'contracts_source',
			'deeds_source',
			'leases_source',
			'surfaces_source',
			'parcels_source',
		].includes(source) && !source.includes('_from_search_user_defined_source')
	);
};

export const setLayerLabelLayout = (layerId, labelLayout) => {
	if (layerId === 'parcel') {
		labelLayout = {
			...labelLayout,
			'text-size': ['interpolate', ['linear'], ['zoom'], 12, 12, 15, 28],
		};
	} else if (layerId === 'interest') {
		labelLayout = {
			...labelLayout,
			'text-size': ['interpolate', ['linear'], ['zoom'], 9, 16, 11, 32, 15, 54],
		};
	} else if (
		layerId === 'unit' ||
		layerId === 'agreement' ||
		layerId === 'contract' ||
		layerId === 'lease' ||
		layerId === 'deed' ||
		layerId === 'surface'
	) {
		labelLayout = {
			...labelLayout,
			'text-size': ['interpolate', ['linear'], ['zoom'], 12, 12, 15, 28],
		};
	}
	return labelLayout;
};

export const shapeTypeLayers = ['unit', 'agreement', 'contract', 'lease', 'deed', 'surface', 'parcel'];
export const defaultLayers = ['interest', 'parcel', 'unit', 'contract', 'lease', 'deed', 'surface'];
export const agreementLayers = ['agreement', 'contract', 'lease', 'deed', 'surface'];

export const aggregationLayers = ['hexagon layer', 'heatmap layer', 'grid layer'];

export const agreementLayerIdentifiers = ['Deeds', 'Leases', 'Contracts', 'Surfaces'];
export const deckGlDataLayerIdentifiers = [
	...agreementLayerIdentifiers,
	'Units',
	'Parcels',
	'Area of Interest',
	'My Wells',
];
export const deckGlLandGridIdentifiers = ['AbstractGeo', 'Pls', 'Land Grid'];
export const deckGlLayerIdentifiers = [...deckGlDataLayerIdentifiers, 'Wells'];
export const isCustomLayerCopy = identifier =>
	deckGlLayerIdentifiers.some(layer => identifier.toLowerCase().includes(layer.toLowerCase()));
export const mapBoxLayerIdentifiers = ['Search'];
export const staticMapBoxLayerIdentifiers = ['Basins'];

export const ifDeckGlDataLayerIdentifiers = id =>
	deckGlDataLayerIdentifiers.some(identifier => id.startsWith(identifier));
export const ifDeckGlLayerIdentifiers = id => deckGlLayerIdentifiers.some(identifier => id.startsWith(identifier));
export const ifMapBoxGlLayerIdentifiers = id => mapBoxLayerIdentifiers.some(identifier => id.startsWith(identifier));
export const ifStaticMapBoxGlLayerIdentifiers = id =>
	staticMapBoxLayerIdentifiers.some(identifier => id.startsWith(identifier));

export const modifyExandableCardStyle = selectedShape => {
	let backgroundColor = '#112040';
	let headerIcons = {};
	let icons = {};
	let headerLabelColor = '#ababab';
	if (selectedShape) {
		backgroundColor = 'white';
		headerIcons = {
			'& .MuiIconButton-colorPrimary , & .MuiToggleButton-root, & .MuiSvgIcon-colorSecondary, & .MuiIconButton-label ':
				{
					// "&:hover": {
					//   backgroundColor: 'rgba(0, 0, 0, 0.08) !important'
					// },
					color: '#7f7f7f !important',
					svg: {
						fill: '#7f7f7f !important',
					},
				},
			'& .MuiIconButton-root, & .MuiButtonBase-root': {
				'&:hover': {
					backgroundColor: 'rgba(0, 0, 0, 0.08) !important',
				},
			},
			'& .MuiIconButton-label svg': {
				color: '#7f7f7f !important',
				fill: '#7f7f7f !important',
			},
		};
		icons = {
			'&:hover': {
				backgroundColor: 'rgba(0, 0, 0, 0.08) !important',
			},
		};
	}
	return { backgroundColor, headerIcons, icons, headerLabelColor };
};

const formatNumber = number => {
	return number.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

export const calculateLandArea = selectedFeature => {
	if (selectedFeature) {
		if (selectedFeature.geometry.type === 'Polygon' || selectedFeature.geometry.type === 'MultiPolygon') {
			const areaInSqMeters = area(selectedFeature);
			const areaInAcres = convertArea(areaInSqMeters, 'meters', 'acres');
			return `${formatNumber(Math.round(areaInAcres * 100) / 100)}`;
		}
		if (selectedFeature.geometry.type === 'LineString') {
			const distanceInMiles = length(selectedFeature, { units: 'miles' });
			return `${formatNumber(Math.round(distanceInMiles * 100) / 100)} miles`;
		}
	}
	return null;
};

export const parseUserDefinedLayerFeature = (feature, layer) => {
	let shapeCenter;
	if (
		(layer.layerGeometry === 'LineString' && feature.geometry.type === 'LineString') ||
		(layer.layerGeometry === 'MultiLineString' && feature.geometry.type === 'LineString')
	) {
		const lineLength = turf.length(feature.geometry, { units: 'miles' });
		const lineCenterGeometry = turf.along(feature.geometry, lineLength / 2, {
			units: 'miles',
		});
		shapeCenter = lineCenterGeometry.geometry.coordinates;
	} else if (
		(layer.layerGeometry === 'Circle' && feature.geometry.type === 'MultiPolygon') ||
		(layer.layerGeometry === 'Point' && feature.geometry.coordinates.length === 2)
	) {
		shapeCenter = feature.geometry.coordinates;
	} else if (layer.layerGeometry === 'Polygon' && feature.geometry.type === 'Polygon') {
		shapeCenter = calculateShapeCenter(feature.geometry);
	} else {
		shapeCenter = turf.centroid(feature.geometry)?.geometry?.coordinates;
	}
	return {
		...feature,
		properties: {
			...feature.properties,
			shapeCenter,
		},
		layer: layer,
		geometry: feature.geometry || feature._geometry,
	};
};
