/* eslint-disable no-use-before-define */
import { NotificationManager } from 'react-notifications';

import { booleanWithin, difference, union, booleanIntersects, bboxPolygon } from '@turf/turf';
import update from 'immutability-helper';
import { debounce } from 'lodash';
import { v4 as uuid } from 'uuid';

import getBoundsQuery from 'api/getBoundsQuery';

import { generateFileFilters, makeGeoJSON, getGeoJsonLayerProps } from 'components/Map/DeckGL/helpers/common';
import DeckGlLayer from 'components/Map/DeckGL/helpers/DeckGlLayer';
import { drawWellBoundary } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';
import { copy } from 'components/Shared/functions';
import {
	deckGlLayerIdentifiers,
	deckGlLandGridIdentifiers,
	agreementLayerIdentifiers,
	ifMapBoxGlLayerIdentifiers,
	ifStaticMapBoxGlLayerIdentifiers,
	mapBoxLayerIdentifiers,
	staticMapBoxLayerIdentifiers,
	isCustomLayerCopy,
} from 'components/Shared/functions/shapeLayer';
import { getFormattedFilterBasedOnType } from 'components/Shared/SidePanel/compoennts/Filters/UserMapFilter';

import { getLayerKey } from 'hookstate/helpers';
import { hookStateController } from 'hookstate/hookStateController';

import { drawController } from './drawStateController';
import { globalStateController } from './globalStateController';
import { layerFilters, layerState, layerStateInitialState } from './initialStates';
import { layerFiltersController } from './layerFiltersController';
import { mapControlsController } from './mapControlsController';
import { navController } from './navStateController';
import { popupController } from './popupStateController';

const TWO = 2;
const FIFTEEN = 15;
const TWENTY = 20;
const THIRTY = 30;
const FORTY = 40;
const FIFTY = 50;
const FIFTY_THREE = 53;
const FIFTY_EIGHT = 58;
const SEVENTY_FOUR = 74;
const SEVENTY_SEVEN = 77;
const ONE_HUNDRED = 100;
const ONE_THREE_SIX = 136;
const ONE_FIVE_TWO = 152;
const TWO_O_SEVEN = 207;
const TWO_ELEVEN = 211;
const TWO_THIRTY = 230;
const TWO_FORTY_TWO = 242;
const TWO_FIFTY_ONE = 251;
const SEVEN_FIFTY = 750;
const SIX_THOUSAND = 6000;

const getWellColor = w => {
	// Check if the well status is of Permit type
	const isWellPermitStatus = ['PERMIT', 'PERMIT - NEW DRILL', 'PERMIT - EXISTING WELL'].includes(
		w?.properties?.wellStatus
	);

	// Switch on whether wellStatus or wellType
	const switchType = isWellPermitStatus ? w.properties.wellStatus : w.properties.wellType;
	switch (switchType) {
		// rgb(2, 207, 53)
		case 'OIL':
		case 'OIL AND GAS':
			return [TWO, TWO_O_SEVEN, FIFTY_THREE]; // green

		// rgb(230, 15, 15)
		case 'GAS':
			return [TWO_THIRTY, FIFTEEN, FIFTEEN]; // red

		// rgb(74, 211, 242)
		case 'WATER':
			return [SEVENTY_FOUR, TWO_ELEVEN, TWO_FORTY_TWO]; // blue

		// rgb(251, 152, 40)
		case 'PERMIT':
		case 'PERMIT - NEW DRILL':
		case 'PERMIT - EXISTING WELL':
			return [TWO_FIFTY_ONE, ONE_FIVE_TWO, FORTY]; // orange

		// rgba(30, 26, 26, 0.55)
		case 'PERMITTED':
			return [TWO_FIFTY_ONE, ONE_FIVE_TWO, FORTY]; // orange

		// rgb(192, 0, 0)
		default:
			return [FIFTY_EIGHT, FIFTY_EIGHT, FIFTY_EIGHT]; // default dark for permitted
	}
};

const generateDataFunc = () => {
	async function* getData(initalData) {
		let data = initalData;
		let pausePromise;
		// Expose a function to externally pause the generator

		while (true) {
			if (pausePromise) {
				// Pause until the external promise is resolved
				// eslint-disable-next-line no-await-in-loop
				await pausePromise;
			}
			if (data) {
				let dataToReturn = data;
				data = null;
				yield dataToReturn;
			} else {
				// No new data, pause until the external promise is resolved

				pausePromise = new Promise(resolve => {
					// Expose a function to externally pause the generator
					getData.feedData = d => {
						data = d;
						pausePromise = null; // Reset the promise after resolving
						resolve();
					};
				});
				// eslint-disable-next-line no-await-in-loop
				await pausePromise;
			}
		}
	}

	return getData;
};

const deckLayers = {};

const LayerMeta = {
	Wells: {
		multiQuery: true,
		defaultZoom: 11,
		geoField: 'geoJSON',
		isFilterable: true,
		layer: {
			id: 'geojson',
			type: 'GeoJsonLayer',
			getProps: layerId => {
				return {
					data: deckLayers[layerId].getData([]),
					getFillColor: getWellColor,
					getLineColor: getWellColor,
					fillPatternEnabled: false,
					pointRadiusMinPixels: 2.5,
					lineWidthMinPixels: 1.5,
					pointRadiusMaxPixels: 10,
					lineWidthMaxPixels: 8,
					getPointRadius: 50,
					getLineWidth: 20,
					parameters: {
						depthTest: false, // Disable depth testing to draw points on top
					},
				};
			},
		},
	},
	'data layer': {
		defaultZoom: 9,
		geoField: 'shapeJson.geometry',
		hasText: true,
		isFilterable: true,
		propsFunc: getGeoJsonLayerProps,
		props: {},
		layer: {
			id: 'geojson',
			type: 'GeoJsonLayer',
			getProps: layerId => {
				return {
					data: deckLayers[layerId].getData([]),
					pointRadiusMinPixels: 5,
					pointRadiusMaxPixels: 15,
					parameters: {
						depthTest: false, // Disable depth testing to draw points on top
					},
				};
			},
		},
	},
	'Recent Submitted Permits': {
		defaultZoom: 0,
		propsFunc: getGeoJsonLayerProps,
		props: {},
		layer: {
			id: 'geojson',
			type: 'GeoJsonLayer',
			getProps: layerId => {
				return {
					data: deckLayers[layerId].getData([]),
					pointRadiusMinPixels: 5,
					lineWidthMinPixels: 2,
					pointRadiusMaxPixels: 15,
					lineWidthMaxPixels: 10,
					parameters: {
						depthTest: false, // Disable depth testing to draw points on top
					},
				};
			},
		},
	},
	Basins: {
		id: 'basinLayer',
	},
	Pipelines: {
		id: 'pipelineLayer',
	},
	'file layer': {
		defaultZoom: 10,
		geoField: 'geometry',
		isFilterable: true,
		propsFunc: getGeoJsonLayerProps,
		props: {},
		layer: {
			id: 'geojson',
			type: 'GeoJsonLayer',
			filterFeatures: (features, dbLayer) =>
				features.filter(
					feature =>
						feature?.properties?.layerShapeName === dbLayer.layerShapeName &&
						feature?.properties?.layerGeometry === dbLayer.layerGeometry
				),
			getProps: layerId => {
				return {
					data: deckLayers[layerId].getData([]),
					pointRadiusMinPixels: 5,
					lineWidthMinPixels: 2,
					pointRadiusMaxPixels: 15,
					lineWidthMaxPixels: 10,
					parameters: {
						depthTest: false, // Disable depth testing to draw points on top
					},
				};
			},
		},
	},
	AbstractGeo: {
		defaultZoom: 12,
		props: {},
		layer: {
			id: 'geojson',
			type: 'GeoJsonLayer',
			getProps: layerId => {
				return {
					data: deckLayers[layerId].getData([]),
					getFillColor: [0, 0, 0, 0],
					fillPatternEnabled: false,
					getLineColor: [0, 0, 0, 0],
					lineWidthMinPixels: 1.5,
					lineWidthMaxPixels: 8,
					highlightColor: [ONE_THREE_SIX, ONE_THREE_SIX, ONE_THREE_SIX, SEVENTY_SEVEN],
					autoHighlight: true,
					parameters: {
						depthTest: false, // Disable depth testing to draw points on top
					},
				};
			},
		},
	},
	Pls: {
		defaultZoom: 14,
		props: {},
		layer: {
			id: 'geojson',
			type: 'GeoJsonLayer',
			getProps: layerId => {
				return {
					data: deckLayers[layerId].getData([]),
					getFillColor: [0, 0, 0, 0],
					fillPatternEnabled: false,
					getLineColor: [0, 0, 0, 0],
					lineWidthMinPixels: 1.5,
					lineWidthMaxPixels: 8,
					highlightColor: [ONE_THREE_SIX, ONE_THREE_SIX, ONE_THREE_SIX, SEVENTY_SEVEN],
					autoHighlight: true,
					parameters: {
						depthTest: false, // Disable depth testing to draw points on top
					},
				};
			},
		},
	},
};

const baseLayerController = {
	...hookStateController(layerState, copy(layerStateInitialState)),
};

const layerStateControllerHandler = state => {
	const showError = debounce(error => {
		NotificationManager.error(error, 'Error', SIX_THOUSAND);
	}, 1000);

	const getShowableLayers = () => {
		let layers = globalStateController.getValue('layers');
		if (layers?.length === 0) {
			const deckLayer = globalStateController.getValue('deckLayer');
			if (deckLayer) {
				layers = [deckLayer];
			}
		}
		const landGridLayer = layers.find(layer => layer.identifier === 'Land Grid');
		const abstractLayerObject = { ...landGridLayer, identifier: 'AbstractGeo' };
		const plsLayerObject = { ...landGridLayer, identifier: 'Pls' };
		const formattedDbLayers = [
			...layers.filter(layer => layer.identifier !== 'Land Grid'),
			abstractLayerObject,
			plsLayerObject,
		];

		return formattedDbLayers.filter(dbLayer => {
			const meta = LayerMeta[dbLayer?.identifier] || LayerMeta[dbLayer?.layerType];

			if (!meta?.layer && !ifStaticMapBoxGlLayerIdentifiers(dbLayer?.identifier)) {
				return false;
			}

			const visible = dbLayer.layerSettings?.showable && dbLayer.layerSettings?.visiable !== false;

			if (!visible) {
				return false;
			}

			const isFileLayer = dbLayer?.layerType === 'file layer';

			if (
				!isFileLayer &&
				!deckGlLayerIdentifiers.includes(dbLayer?.identifier) &&
				!isCustomLayerCopy(dbLayer?.identifier) &&
				!deckGlLandGridIdentifiers.includes(dbLayer?.identifier) &&
				!mapBoxLayerIdentifiers.includes(dbLayer?.identifier) &&
				!staticMapBoxLayerIdentifiers.includes(dbLayer?.identifier)
			) {
				return false;
			}

			return true;
		});
	};

	const handleBounds = (layerId, defaultZoom, visible, layerBBox, polygonFilter) => {
		const { boundingStates, bbox, zoom } = state.get({
			noproxy: true,
		});

		const boundingStateVal = boundingStates?.[layerId] || {};
		let { previousBounds, ...rest } = boundingStateVal;

		if (!bbox) {
			return boundingStateVal;
		}

		if (defaultZoom === 0) {
			const handled = rest.callApi || rest.handled === true ? true : false;
			const boundingState = {
				...rest,
				handled,
				callApi: visible && !handled ? true : false,
				show: { current: visible, previous: !!boundingStates?.[layerId]?.show?.current },
			};

			state.boundingStates.merge({
				[layerId]: boundingState,
			});

			return boundingState;
		}

		try {
			let newPolygon = copy(bbox);

			if (polygonFilter) {
				newPolygon = copy({
					type: 'Feature',
					properties: {},
					geometry: polygonFilter,
				});
			}

			const isOutside = previousBounds ? !booleanWithin(newPolygon, previousBounds) : true;
			const bboxIntersects = bbox && layerBBox ? booleanIntersects(bbox, bboxPolygon(layerBBox)) : true;
			const show = visible && zoom > defaultZoom;

			const lastBounds = previousBounds;

			if (isOutside && bboxIntersects && show) {
				if (previousBounds) {
					newPolygon = difference(newPolygon, previousBounds);
					if (!newPolygon) {
						console.log('New Polygon not found', newPolygon);
					}
				}
				if (show) {
					if (previousBounds) {
						previousBounds = union(previousBounds, newPolygon);
					} else {
						previousBounds = newPolygon;
					}
				}
			}

			const boundingState = {
				...rest,
				lastBounds,
				previousBounds,
				polygon: newPolygon,
				callApi: isOutside && bboxIntersects && show,
				show: { current: show, previous: !!boundingStates?.[layerId]?.show?.current },
			};

			state.boundingStates.merge({
				[layerId]: boundingState,
			});

			return boundingState;
		} catch (err) {
			if (polygonFilter) {
				showError('Invalid Shape');
			}
			console.log('🚀 ~ file: layerStateController.js:285 ~ handleBounds ~ err:', err.message);
			return boundingStateVal;
		}
	};

	const updateLayers = (layerId, updatedState, type) => {
		window?.deckOverlay?._deck?.layerManager?.layers?.forEach?.(layer => {
			if (!layer.id.includes(layerId)) {
				return;
			}

			if (type && !layer.id.includes(type)) {
				return;
			}

			DeckGlLayer.updateLayer(updatedState, layer.id);
		});
	};

	const updateLayer = (layer, updatedState) => {
		const layerId = `${layer?.identifier}_${layer.layerId}`;
		DeckGlLayer.updateLayer(updatedState, layerId);
	};

	const removeLayer = (layer, recalculate = false) => {
		if (!layer) {
			return;
		}

		const layerId = `${layer?.identifier}_${layer.layerId}`;
		DeckGlLayer.removeLayer(layerId);
		delete deckLayers[layerId];

		const { boundingStates } = state.get({ noproxy: true });
		state.boundingStates.merge({
			[layerId]: {
				...boundingStates?.[layerId],
				previousBounds: undefined,
				callApi: false,
			},
		});

		setTimeout(() => {
			if (recalculate) {
				// baseLayerController.recalculate();
			}
		}, 10);
	};

	const removeLayers = (timeout = true) => {
		const showableLayers = getShowableLayers();
		showableLayers.forEach(layer => {
			if (timeout) {
				setTimeout(() => {
					removeLayer(layer);
				}, FIFTY);
			} else {
				removeLayer(layer);
			}
		});
	};

	const recalculate = () => {
		state.recalculate.set(!state.recalculate.get({ noproxy: true }));
	};

	const getLayerFromMongoId = layerId => {
		const layers = getShowableLayers();

		const layer = layers.find(layer => layer.layerId === layerId);

		return layer;
	};

	const getBeforeLayerId = identifier => {
		const showableLayers = getShowableLayers();
		const layerIndex = showableLayers.findIndex(dbLayer => {
			return identifier === dbLayer?.identifier;
		});
		return layerIndex > 0
			? `${showableLayers[layerIndex - 1]?.identifier}_${showableLayers[layerIndex - 1].layerId}`
			: null;
	};

	const handleMapBoxLayer = dbLayer => {
		const map = window.mapRef;
		const layerId = dbLayer.layerId;

		// Layer data and converting it to geojson
		let layerData = null;
		if (dbLayer.identifier === 'Search') {
			layerData = baseLayerController.getValue('wellListFromSearch');
		}
		if (dbLayer.identifier === 'Rig Activity') {
			layerData = baseLayerController.getValue('rigsData');
		}

		// Return if we not get any data
		if (!layerData) {
			return;
		}
		const labelProps = dbLayer.layerPaintProps?.find?.(prop => prop.labelProps)?.labelProps;
		let geoJson = makeGeoJSON(layerData, labelProps);
		// changing layer visibility
		const visible = dbLayer?.layerSettings?.visiable;
		if (
			map.getLayer(`${layerId}-clusters`) &&
			map.getLayer(`${layerId}-cluster-count`) &&
			map.getLayer(`${layerId}-unclustered-point`)
		) {
			map.setLayoutProperty(`${layerId}-clusters`, 'visibility', visible ? 'visible' : 'none');
			map.setLayoutProperty(`${layerId}-cluster-count`, 'visibility', visible ? 'visible' : 'none');
			map.setLayoutProperty(`${layerId}-unclustered-point`, 'visibility', visible ? 'visible' : 'none');
			// Updating data source
			if (map.getSource(`${layerId}-cluster`)) {
				map.getSource(`${layerId}-cluster`).setData(geoJson);
			}
			return;
		}

		if (!visible) {
			return;
		}

		// Adding data source
		map.addSource(`${layerId}-cluster`, {
			type: 'geojson',
			data: geoJson,
			cluster: true,
			clusterMaxZoom: 14, // Max zoom to cluster points on
			clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
		});
		map.addLayer({
			id: `${layerId}-clusters`,
			type: 'circle',
			source: `${layerId}-cluster`,
			filter: ['has', 'point_count'],
			paint: {
				'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', SEVEN_FIFTY, '#f28cb1'],
				'circle-radius': ['step', ['get', 'point_count'], TWENTY, ONE_HUNDRED, THIRTY, SEVEN_FIFTY, FORTY],
			},
		});
		map.addLayer({
			id: `${layerId}-cluster-count`,
			type: 'symbol',
			source: `${layerId}-cluster`,
			filter: ['has', 'point_count'],
			layout: {
				'text-field': ['get', 'point_count_abbreviated'],
				'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
				'text-size': 12,
			},
		});
		map.addLayer({
			id: `${layerId}-unclustered-point`,
			type: 'circle',
			source: `${layerId}-cluster`,
			filter: ['!', ['has', 'point_count']],
			paint: {
				'circle-color': '#11b4da',
				'circle-radius': 4,
				'circle-stroke-width': 1,
				'circle-stroke-color': '#fff',
			},
		});
		// inspect a cluster on click
		map.on('click', `${layerId}-clusters`, e => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: [`${layerId}-clusters`],
			});
			const clusterId = features[0].properties.cluster_id;
			map.getSource(`${layerId}-cluster`).getClusterExpansionZoom(clusterId, (err, zoom) => {
				if (err) {
					return;
				}

				map.easeTo({
					center: features[0].geometry.coordinates,
					zoom: zoom,
				});
			});
		});

		map.on('click', `${layerId}-unclustered-point`, e => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: [`${layerId}-unclustered-point`],
			});
			drawWellBoundary(features[0].geometry.coordinates);
			popupController.updateState({
				wellSelectedCoordinates: features[0].geometry.coordinates,
				selectedWellId: features[0].properties.id,
			});
		});
	};

	const handleStaticMapBoxLayer = dbLayer => {
		const map = window.mapRef;
		const meta = LayerMeta[dbLayer?.identifier] || LayerMeta[dbLayer?.layerType];
		const visible = dbLayer?.layerSettings?.visiable;
		if (map.getLayer(meta?.id)) {
			map.setLayoutProperty(meta?.id, 'visibility', visible ? 'visible' : 'none');
		}
	};

	const reinitializeLayer = ({ meta, layerId, beforeLayerId, labelProps, pickable, visible, position }) => {
		if (!deckLayers[layerId]) {
			deckLayers[layerId] = {
				getData: generateDataFunc(),
				beforeLayerId,
			};
			const metaLayer = meta.layer;
			const deckLayer = DeckGlLayer.addLayer({
				layerId: layerId,
				type: metaLayer.type,
				beforeLayer: beforeLayerId,
				props: {
					...metaLayer.getProps(layerId),
					...meta.props?.[layerId],
					...(labelProps && { getText: d => d.properties?.label }),
					pickable,
					visible,
					position,
					// zIndex: 9999999999,
				},
			});

			deckLayers[layerId].deckLayer = deckLayer;
			deckLayers[layerId].beforeLayerId = beforeLayerId;
		}

	};

	const handleDeckLayer = (dbLayer, isUpdateTrigger) => {
		const client = baseLayerController.getValue('client');
		if (!client) {
			return null;
		}

		if (ifMapBoxGlLayerIdentifiers(dbLayer?.identifier)) {
			handleMapBoxLayer(dbLayer);
			return;
		}

		if (ifStaticMapBoxGlLayerIdentifiers(dbLayer?.identifier)) {
			handleStaticMapBoxLayer(dbLayer);
			return;
		}

		const meta = LayerMeta[dbLayer?.identifier] || LayerMeta[dbLayer?.layerType];

		if (!meta?.layer) {
			return null;
		}

		const layerId = `${dbLayer.identifier}_${dbLayer.layerId}`;
		const beforeLayerId = getBeforeLayerId(dbLayer.identifier);

		const isFileLayer = dbLayer.layerType === 'file layer';

		const isAgreementLayer = agreementLayerIdentifiers.some(layer =>
			dbLayer?.identifier?.toLowerCase().includes(layer.toLowerCase())
		);
		const filterIdentifier = isAgreementLayer
			? 'Agreements'
			: isFileLayer
				? dbLayer.layerShapeName
				: dbLayer.identifier;

		const filterKey = isFileLayer
			? `${dbLayer.file}_${dbLayer.layerShapeName}`
			: getLayerKey(filterIdentifier, layerFilters);

		let {
			[filterKey]: filters,
			polygonFilter,
			polygonsFilter,
		} = layerFiltersController.getValues([filterKey, 'polygonFilter', 'polygonsFilter']);

		const boundingState = handleBounds(
			layerId,
			meta.defaultZoom,
			dbLayer.layerSettings?.showable && dbLayer.layerSettings?.visiable,
			dbLayer.defaultSettings?.bbox,
			polygonFilter
		);

		let pickable = dbLayer.layerSettings.interaction?.interactionDetail?.click;
		if (deckGlLandGridIdentifiers.includes(dbLayer?.identifier)) {
			pickable = true;
		}

		const visible = dbLayer.layerSettings.showable && dbLayer.layerSettings.visiable !== false;

		let updatedProps = {
			pickable,
			visible,
			showable: dbLayer.layerSettings.showable,
		};

		const labelProps =
			(filters?.hasText ?? meta.hasText) && dbLayer.layerPaintProps?.find?.(prop => prop.labelProps)?.labelProps;

		if (meta.propsFunc && meta.props) {
			meta.props[layerId] = meta.propsFunc?.(dbLayer, labelProps);
			updatedProps = {
				...updatedProps,
				...meta.props[layerId],
			};
		}

		reinitializeLayer({ meta, layerId, beforeLayerId, labelProps, pickable, visible, position: dbLayer.position });

		if (isUpdateTrigger) {
			const newId = uuid();
			updatedProps.updateTriggers = {
				getFillColor: newId,
				getLineColor: newId,
				getLineWidth: newId,
				defaultColor: newId,
				getPointRadius: newId,
				fillPatternEnabled: newId,
			};
		}
		if (!boundingState.show?.current) {
			updateLayer(dbLayer, {
				pickable,
				...updatedProps,
				visible: boundingState.show?.current,
			});
			return;
		}

		if (!boundingState.callApi) {
			updateLayer(dbLayer, {
				pickable,
				...updatedProps,
				visible: boundingState.show?.current,
			});
			return;
		}

		updateLayer(dbLayer, updatedProps);

		getBoundsQuery({
			multiQuery: meta.multiQuery,
			layerId,
			identifier: dbLayer.identifier,
			layerSettings: dbLayer.layerSettings,
			boundingState,
			geoField: meta.geoField,
			isFileLayer,
			polygonFilter,
			polygonsFilter,
			filters: isFileLayer ? generateFileFilters({ fileLayer: dbLayer, extendFilters: filters }) : filters,
			onData: data => {
				if (!Array.isArray(data)) {
					return null;
				}
				let geoJson = { features: [] };
				if (data?.length > 0) {
					if (filters?.allowedTypes?.length > 0) {
						data = data.filter(f => filters.allowedTypes.includes(f?.shapeJson?.geometry?.type));
					}
					const layerData = data;
					if (!Array.isArray(layerData)) {
						return null;
					}
					geoJson = makeGeoJSON(layerData, labelProps);
				}
				if (deckLayers[layerId]?.getData?.feedData) {
					deckLayers[layerId].getData.feedData(geoJson.features);
				}
				return null;
			},
		});
		return null;
	};

	const toggleLayersActivity = (identifier, value) => {
		let layers = globalStateController.getValue('layers');
		const layer = layers.find(layer => layer.identifier.startsWith(identifier));

		handleDeckLayer({ ...layer, layerSettings: { ...layer.layerSettings, visiable: value } });
	};

	const resetBounds = (identifier, updateTriggers = false) => {
		if (typeof identifier !== 'string') {
			return;
		}
		if (identifier === 'Agreements') {
			['Deeds', 'Leases', 'Contracts', 'Surfaces'].forEach(type => {
				resetBounds(type);
			});
			return;
		}
		const { boundingStates } = state.get({
			noproxy: true,
		});

		let layerId = Object.keys(boundingStates || {}).find(
			key => key && key.toLowerCase().startsWith(identifier.toLowerCase())
		);

		// If layerId is not found, then find layerId by layerShapeName
		if (!layerId) {
			// Find layer by layerShapeName
			const requiredLayers = globalStateController
				.getValue('layers')
				.filter(layer => `${layer.file}_${layer.layerShapeName}` === identifier);

			requiredLayers.forEach(requiredLayer => {
				// If layer is not found, then return
				if (requiredLayer?.layerType === 'file layer') {
					// Updating identifier with requiredLayer identifier
					identifier = requiredLayer.identifier;
					layerId = Object.keys(boundingStates || {}).find(
						key => key && key.toLowerCase().startsWith(identifier.toLowerCase())
					);
					if (layerId) {
						const showableLayers = getShowableLayers();
						showableLayers.forEach(dbLayer => {
							if (dbLayer.identifier.toLowerCase().startsWith(identifier.toLowerCase())) {
								removeLayer(dbLayer, true);
							}
						});
					}
				}
			});
			return;
		}

		const showableLayers = getShowableLayers();
		showableLayers.forEach(dbLayer => {
			if (dbLayer.identifier.toLowerCase().startsWith(identifier.toLowerCase())) {
				removeLayer(dbLayer, true);
			}
		});
		const layer = globalStateController.getValue('layers').find(l => l.identifier === identifier);
		if (updateTriggers) {
			layerController.handleDeckLayer(layer, true);
		}
	};

	const resetMapStates = (mapReady = false) => {
		const rigsData = baseLayerController.getValue('rigsData');
		const client = baseLayerController.getValue('client');
		removeLayers(false);
		popupController.reset();
		drawController.reset();
		layerFiltersController.reset();
		const mapViewFilters = globalStateController.getValue('mapView')?.selectedMapView?.filters || [];
		mapViewFilters.forEach(filter => {
			const dataSource = filter?.dataSourceName;

			const initialFilters = layerFiltersController.getValue([dataSource])?.variables?.filters || [];

			layerFiltersController.setVariables(dataSource, {
				filters: [
					getFormattedFilterBasedOnType(filter.filterType, filter.fieldName, filter.filterValues),
					...initialFilters,
				],
			});
		});

		baseLayerController.setState({ rigsData, client });
		navController.reset();
		mapControlsController.setState({
			selectedControl: mapControlsController.getValue('selectedControl'),
		});
		globalStateController.updateState({ mapReady });
	};

	return {
		init: (client, history) => {
			baseLayerController.updateState({ client, history });
		},
		resetBounds,
		updateLayers,
		updateLayer,
		recalculate,
		handleDeckLayer,
		handleMapBoxLayer,
		getLayerFromMongoId,
		removeLayer,
		removeLayers,
		toggleLayersActivity,
		handleChange: () => {
			const showableLayers = getShowableLayers();

			showableLayers.reverse().forEach(dbLayer => {
				handleDeckLayer(dbLayer);
			});
			if (window.mapRef.getLayer('boundary-layer')) {
				window.mapRef.moveLayer('boundary-layer');
			}
		},
		changeLayerPosition: (currentLayer, beforeLayer) => {
			if (!currentLayer) {
				return null;
			}

			if (currentLayer && !beforeLayer) {
				DeckGlLayer.moveLayer(`${currentLayer?.identifier}_${currentLayer.layerId}`);
			} else {
				DeckGlLayer.moveLayer(
					`${currentLayer?.identifier}_${currentLayer.layerId}`,
					`${beforeLayer?.identifier}_${beforeLayer.layerId}`
				);
			}
			return null;
		},
		resetMapStates,
		resetMap: () => {
			resetMapStates();
			window.mapRef?.remove();
			window.mapRef = null;
			window.drawRef = null;
		},
		generateUpdateFn: (layers, value, currentLayers, field) => {
			const updatefn = {};
			layers.forEach(layer => {
				if (layer.type === 'group') {
					layer.layers.forEach(l => {
						const layerIndex = currentLayers.findIndex(clayer => clayer.identifier === l.identifier);
						if (layerIndex !== -1) {
							if (field === 'showable') {
								updatefn[layerIndex] = { layerSettings: { [field]: { $set: value } } };
							} else {
								updatefn[layerIndex] = { [field]: { $set: value } };
							}
						}
					});
				} else {
					const layerIndex = currentLayers.findIndex(clayer => clayer.identifier === layer.identifier);
					if (layerIndex !== -1) {
						if (field === 'showable') {
							updatefn[layerIndex] = { layerSettings: { [field]: { $set: value } } };
						} else {
							updatefn[layerIndex] = { [field]: { $set: value } };
						}
					}
				}
			});
			return updatefn;
		},

		updateProjectedLayers: ({ layer, value, field }) => {
			const projectedLayers = layerState.projectedLayers.get({ noproxy: true });
			const updatefn = layerController.generateUpdateFn([layer], value, projectedLayers, field);

			layerController.updateState({ projectedLayers: update(projectedLayers, updatefn) });
		},
	};
};

export const layerController = {
	...baseLayerController,
	...layerStateControllerHandler(layerState),
};
