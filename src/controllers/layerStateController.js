import { NotificationManager } from 'react-notifications';

import { booleanWithin, difference, union, booleanIntersects, bboxPolygon } from '@turf/turf';
import update from 'immutability-helper';
import { debounce, sortBy, set } from 'lodash';
import { v4 as uuid } from 'uuid';

import getBoundsQuery from 'api/getBoundsQuery';

import {
	generateFileFilters,
	makeGeoJSON,
	getGeoJsonLayerProps,
	getGridLayerProps,
	getHeatMapLayerProps,
	getHexLayerProps,
} from 'components/Map/DeckGL/helpers/common';
import DeckGlLayer from 'components/Map/DeckGL/helpers/DeckGlLayer';
import { drawWellBoundary } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';
import { viewStateController } from 'components/MRTTable/Common/GridView/ViewController';
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

import { generateDataFunc, getLayerKey, getWellColor } from 'controllers/helpers';

import { UPDATE_MANY_LAYER } from 'graphQL/useMutationUpdateManyLayer';
import { UPDATEMANYLAYERSETTINGS } from 'graphQL/useMutationUpdateManyLayerSettings';
import { GET_PROJECTED_LAYERS, LAYERS_BY_ID } from 'graphQL/useQueryAllLayerSettingsByUser';

import { baseMapLayers, heatLayers } from 'LayerConfig';

import { drawController } from './drawStateController';
import { globalStateController } from './globalStateController';
import { layerFiltersController } from './layerFiltersController';
import { mapControlsController } from './mapControlsController';
import { navController } from './navStateController';
import { popupController } from './popupStateController';
import { StateController } from './stateController';

const layerStateInitialState = {
	layers: [],
	bins: [],
	datasets: null,
	deckLayer: null,
	layerSettingsLoading: false,
	projectedLayers: [],
	client: null,
	history: null,
	boundingStates: null,
	bbox: null,
	zoom: 0,
	recalculate: false,

	wellListFromSearch: [], // Not Moved

	baseMapLayers: baseMapLayers,
	checkedBaseLayers: [0, 1, 2, 3, 4],
	heatLayers: heatLayers,
	checkedHeats: [],
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
	'dynamic data layer': {
		defaultZoom: 1,
		geoField: 'assetShape.shapeJson.geometry',
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
	'file layer': {
		defaultZoom: 10,
		geoField: 'geometry',
		isFilterable: true,
		isFileDataSource: true,
		propsFunc: getGeoJsonLayerProps,
		props: {},
		layer: {
			id: 'geojson',
			type: 'GeoJsonLayer',
			filterFeatures: (features, dbLayer) =>
				features.filter(
					feature =>
						feature?.properties?.layerShapeName === dbLayer.layerIdentifier &&
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
	'hexagon layer': {
		defaultZoom: 10,
		geoField: 'geometry',
		isFilterable: true,
		isFileDataSource: true,
		propsFunc: getHexLayerProps,
		props: {},
		layer: {
			id: 'HexagonLayer',
			type: 'HexagonLayer',
			getProps: layerId => {
				return {
					data: deckLayers[layerId].getData([]),
					colorScaleType: 'quantize',
				};
			},
		},
	},
	'heatmap layer': {
		defaultZoom: 10,
		geoField: 'geometry',
		isFilterable: true,
		isFileDataSource: true,
		propsFunc: getHeatMapLayerProps,
		props: {},
		layer: {
			id: 'HeatmapLayer',
			type: 'HeatmapLayer',
			getProps: layerId => {
				return {
					data: deckLayers[layerId].getData([]),
				};
			},
		},
	},
	'grid layer': {
		defaultZoom: 10,
		geoField: 'geometry',
		isFilterable: true,
		isFileDataSource: true,
		props: {},
		propsFunc: getGridLayerProps,
		layer: {
			id: 'GridLayer',
			type: 'GridLayer',
			getProps: layerId => {
				return {
					data: deckLayers[layerId].getData([]),
					colorScaleType: 'quantize',
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
					highlightColor: [136, 136, 136, 77],
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
					highlightColor: [136, 136, 136, 77],
					autoHighlight: true,
					parameters: {
						depthTest: false, // Disable depth testing to draw points on top
					},
				};
			},
		},
	},
};

class LayerStateControllerHandler extends StateController {
	constructor(initialState) {
		super(initialState, LayerStateControllerHandler.name);
		this.autoBind(this);
	}

	showError(error) {
		NotificationManager.error(error, 'Error', 6000);
	}

	getShowableLayers() {
		let layers = this.getValue('layers');
		if (layers?.length === 0) {
			const deckLayer = this.getValue('deckLayer');
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

			const { isFileDataSource } = meta;
			const isDynamicLayer = dbLayer?.layerType === 'dynamic data layer';

			if (
				!isFileDataSource &&
				!isDynamicLayer &&
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
	}

	handleBounds(layerId, defaultZoom, visible, layerBBox, polygonFilter) {
		const { boundingStates, bbox, zoom } = this.getValues(['boundingStates', 'bbox', 'zoom']);

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

			this.updateState({
				boundingStates: {
					...boundingStates,
					[layerId]: boundingState,
				},
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
			const bboxIntersects = bbox && layerBBox?.length > 0 ? booleanIntersects(bbox, bboxPolygon(layerBBox)) : true;
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

			this.updateState({
				boundingStates: {
					...boundingStates,
					[layerId]: boundingState,
				},
			});

			return boundingState;
		} catch (err) {
			if (polygonFilter) {
				debounce(() => this.showError('Invalid Shape'), 1000)(); // Debounce at call site
			}
			console.log(`🚀 ~ file: layerStateController.js:285 ~ handleBounds ~ err:${layerId}`, err.message);
			return boundingStateVal;
		}
	}

	updateLayers(layerId, updatedState, type) {
		window?.deckOverlay?._deck?.layerManager?.layers?.forEach?.(layer => {
			if (!layer.id.includes(layerId)) {
				return;
			}

			if (type && !layer.id.includes(type)) {
				return;
			}

			DeckGlLayer.updateLayer(updatedState, layer.id);
		});
	}

	updateLayer(layer, updatedState) {
		const layerId = `${layer?.identifier}_${layer.layerId}`;
		DeckGlLayer.updateLayer(updatedState, layerId);
	}

	removeLayer(layer, recalculate = false) {
		if (!layer) {
			return;
		}

		const layerId = `${layer?.identifier}_${layer.layerId}`;
		DeckGlLayer.removeLayer(layerId);
		delete deckLayers[layerId];

		// Retrieve current boundingStates
		const boundingStates = this.getValue('boundingStates');

		// Update state properly
		this.updateState({
			boundingStates: {
				...boundingStates,
				[layerId]: {
					...boundingStates?.[layerId],
					previousBounds: undefined,
					callApi: false,
				},
			},
		});

		setTimeout(() => {
			if (recalculate) {
				// baseLayerController.recalculate();
			}
		}, 10);
	}

	removeLayers(timeout = true) {
		const showableLayers = this.getShowableLayers();
		showableLayers.forEach(layer => {
			if (timeout) {
				setTimeout(() => {
					this.removeLayer(layer);
				}, 50);
			} else {
				this.removeLayer(layer);
			}
		});
	}

	recalculate() {
		const currentValue = this.getValue('recalculate');
		this.updateState({ recalculate: !currentValue });
	}

	getLayerFromMongoId(layerId) {
		const layers = this.getShowableLayers();

		const layer = layers.find(layer => layer.layerId === layerId);

		return layer;
	}

	getBeforeLayerId(identifier) {
		const showableLayers = this.getShowableLayers();
		const layerIndex = showableLayers.findIndex(dbLayer => {
			return identifier === dbLayer?.identifier;
		});
		return layerIndex > 0
			? `${showableLayers[layerIndex - 1]?.identifier}_${showableLayers[layerIndex - 1].layerId}`
			: null;
	}

	handleMapBoxLayer(dbLayer) {
		const map = window.mapRef;
		const layerId = dbLayer.layerId;

		// Layer data and converting it to geojson
		let layerData = null;
		if (dbLayer.identifier === 'Search') {
			layerData = this.getValue('wellListFromSearch');
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
				'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
				'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
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
	}

	handleStaticMapBoxLayer(dbLayer) {
		const map = window.mapRef;
		const meta = LayerMeta[dbLayer?.identifier] || LayerMeta[dbLayer?.layerType];
		const visible = dbLayer?.layerSettings?.visiable;
		if (map.getLayer(meta?.id)) {
			map.setLayoutProperty(meta?.id, 'visibility', visible ? 'visible' : 'none');
		}
	}

	reinitializeLayer({ meta, layerId, beforeLayerId, labelProps, pickable, visible, position }) {
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
				},
			});

			deckLayers[layerId].deckLayer = deckLayer;
			deckLayers[layerId].beforeLayerId = beforeLayerId;
		}
	}

	handleDeckLayer(dbLayer, isUpdateTrigger) {
		const client = this.getValue('client');
		if (!client) {
			return null;
		}

		if (ifMapBoxGlLayerIdentifiers(dbLayer?.identifier)) {
			this.handleMapBoxLayer(dbLayer);
			return null;
		}

		if (ifStaticMapBoxGlLayerIdentifiers(dbLayer?.identifier)) {
			this.handleStaticMapBoxLayer(dbLayer);
			return null;
		}

		const meta = LayerMeta[dbLayer?.identifier] || LayerMeta[dbLayer?.layerType];

		if (!meta?.layer) {
			return null;
		}

		const layerId = `${dbLayer.identifier}_${dbLayer.layerId}`;
		const beforeLayerId = this.getBeforeLayerId(dbLayer.identifier);

		const { isFileDataSource } = meta;
		const isDynamicLayer = dbLayer?.layerType === 'dynamic data layer';

		const isAgreementLayer = agreementLayerIdentifiers.some(layer =>
			dbLayer?.identifier?.toLowerCase().includes(layer.toLowerCase())
		);
		const filterIdentifier = isAgreementLayer
			? 'Agreements'
			: isFileDataSource
				? dbLayer.layerIdentifier
				: dbLayer.identifier;

		const filterKey = isFileDataSource
			? `${dbLayer.file}_${dbLayer.layerShapeName}`
			: isDynamicLayer
				? 'DynamicAsset'
				: getLayerKey(filterIdentifier, layerFiltersController.getAllValues());

		let {
			[filterKey]: filters,
			polygonFilter,
			polygonsFilter,
		} = layerFiltersController.getValues([filterKey, 'polygonFilter', 'polygonsFilter']);

		const boundingState = this.handleBounds(
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
		const { isDrawing, editDraw } = drawController.getValues(['isDrawing', 'editDraw']);

		let updatedProps = {
			pickable,
			visible,
			showable: dbLayer.layerSettings.showable,
			opacity: isDrawing || editDraw ? 0.1 : 1,
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

		this.reinitializeLayer({ meta, layerId, beforeLayerId, labelProps, pickable, visible, position: dbLayer.position });

		if (isUpdateTrigger) {
			const newId = uuid();
			updatedProps.updateTriggers = {
				getFillColor: newId,
				getLineColor: newId,
				getLineWidth: newId,
				defaultColor: newId,
				getPointRadius: newId,
				fillPatternEnabled: newId,
				getDashArray: newId,
				getFillPattern: newId,
				opacity: newId,
			};
		}
		if (!boundingState.show?.current) {
			this.updateLayer(dbLayer, {
				pickable,
				...updatedProps,
				visible: boundingState.show?.current,
			});
			return null;
		}

		if (!boundingState.callApi) {
			this.updateLayer(dbLayer, {
				pickable,
				...updatedProps,
				visible: boundingState.show?.current,
			});
			return null;
		}

		this.updateLayer(dbLayer, updatedProps);

		const getFilters = () => {
			if (isFileDataSource) {
				return generateFileFilters({ fileLayer: dbLayer, extendFilters: filters });
			}

			if (isDynamicLayer) {
				filters.variables.index = dbLayer.layerPaintProps[0].id;
				return filters;
			}

			return filters;
		};

		getBoundsQuery({
			multiQuery: meta.multiQuery,
			layerId,
			identifier: dbLayer.identifier,
			layerSettings: dbLayer.layerSettings,
			boundingState,
			geoField: meta.geoField,
			isFileLayer: isFileDataSource,
			polygonFilter,
			polygonsFilter,
			filters: getFilters(),
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
	}

	toggleLayersActivity(identifier, value) {
		let layers = this.getValue();
		const layer = layers.find(layer => layer.identifier.startsWith(identifier));

		this.handleDeckLayer({ ...layer, layerSettings: { ...layer.layerSettings, visiable: value } });
	}

	resetBounds(identifier, updateTriggers = false) {
		if (typeof identifier !== 'string') {
			return;
		}
		if (identifier === 'Agreements') {
			['Deeds', 'Leases', 'Contracts', 'Surfaces'].forEach(type => {
				this.resetBounds(type);
			});
			return;
		}
		const boundingStates = this.getValue('boundingStates');

		let layerId = Object.keys(boundingStates || {}).find(
			key => key && key.toLowerCase().startsWith(identifier.toLowerCase())
		);

		// If layerId is not found, then find layerId by layerIdentifier
		if (!layerId && identifier != 'all') {
			// Find layer by layerIdentifier
			const requiredLayers = this.getValue('layers').filter(
				layer => `${layer.file}_${layer.layerIdentifier}` === identifier
			);

			requiredLayers.forEach(requiredLayer => {
				// If layer is not found, then return
				if (requiredLayer?.layerType === 'file layer') {
					// Updating identifier with requiredLayer identifier
					identifier = requiredLayer.identifier;
					layerId = Object.keys(boundingStates || {}).find(
						key => key && key.toLowerCase().startsWith(identifier.toLowerCase())
					);
					if (layerId) {
						const showableLayers = this.getShowableLayers();
						showableLayers.forEach(dbLayer => {
							if (dbLayer.identifier.toLowerCase().startsWith(identifier.toLowerCase())) {
								this.removeLayer(dbLayer, true);
							}
						});
					}
				}
			});
			return;
		}

		const showableLayers = this.getShowableLayers();
		showableLayers.forEach(dbLayer => {
			if (dbLayer.identifier.toLowerCase().startsWith(identifier.toLowerCase()) || identifier === 'all') {
				this.removeLayer(dbLayer, true);
			}
		});

		// Refresh all layers when the map is synchronized
		if (identifier === 'all') {
			// Retrieve all layers from the global state
			this.getValue('layers').forEach(layer => {
				// Handle each layer using the layer controller
				this.handleDeckLayer(layer);
			});
		}

		const layer = this.getValue('layers').find(l => l.identifier === identifier);
		if (updateTriggers) {
			this.handleDeckLayer(layer, true);
		}
	}

	resetMapStates(mapReady = false) {
		const client = this.getValue('client');
		this.removeLayers(false);
		popupController.reset();
		drawController.reset();
		layerFiltersController.reset();
		const mapViewFilters = viewStateController('MapView').getValue('selectedView')?.filters || [];
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

		this.setState({
			...this.getValues([
				'layers',
				'datasets',
				'projectedLayers',
				'baseMapLayers',
				'checkedBaseLayers',
				'heatLayers',
				'checkedHeats',
			]),

			client,
		});
		navController.reset();
		mapControlsController.setState({
			selectedControl: mapControlsController.getValue('selectedControl'),
		});
		globalStateController.updateState({ mapReady });
	}

	resetMap() {
		this.resetMapStates();
		window.mapRef?.remove();
		window.mapRef = null;
		window.drawRef = null;
	}

	init(client, history) {
		this.updateState({ client, history });
	}

	handleChange() {
		const showableLayers = this.getShowableLayers();

		showableLayers.reverse().forEach(dbLayer => {
			this.handleDeckLayer(dbLayer);
		});
	}

	changeLayerPosition(currentLayer, beforeLayer) {
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
	}

	generateUpdateFn(layers, value, currentLayers, field) {
		const updatefn = {};
		layers.forEach(layer => {
			if (layer.type === 'group') {
				layer.layers.forEach(l => {
					const layerIndex = currentLayers.findIndex(clayer => clayer.identifier === l.identifier);
					if (layerIndex !== -1) {
						if (field === 'showable') {
							updatefn[layerIndex] = {
								layerSettings: { [field]: { $set: value === 'clear' ? false : !l?.layerSettings?.showable } },
							};
						} else {
							updatefn[layerIndex] = { [field]: { $set: value === 'clear' ? false : value } };
						}
					}
				});
			} else {
				const layerIndex = currentLayers.findIndex(clayer => clayer.identifier === layer.identifier);
				if (layerIndex !== -1) {
					if (field === 'showable') {
						updatefn[layerIndex] = { layerSettings: { [field]: { $set: value === 'clear' ? false : value } } };
					} else {
						updatefn[layerIndex] = { [field]: { $set: value === 'clear' ? false : value } };
					}
				}
			}
		});
		return updatefn;
	}

	async getProjectedLayers() {
		const client = this.getValue('client');
		const user = globalStateController.getValue('user');
		const resp = await client.query({
			query: GET_PROJECTED_LAYERS,
			variables: {
				userId: user._id,
				project: {
					dataset: 1,
					file: 1,
					layerId: 1,
					layerType: 1,
					layerName: 1,
					groupName: 1,
					groupId: 1,
					position: 1,
					layerSettings: 1,
					identifier: 1,
					layerCategory: 1,
				},
			},
		});
		this.updateState({ projectedLayers: copy(resp.data.allLayerSettingsByUser) });
	}

	updateProjectedLayers({ layer, value, field }) {
		const projectedLayers = this.getValue('projectedLayers');
		const updatefn = this.generateUpdateFn(layer, value, projectedLayers, field);
		this.updateState({ projectedLayers: update(projectedLayers, updatefn) });
	}

	async handleLayerChange(layer, field, value) {
		const client = this.getValue('client');

		const layersToChange = Array.isArray(layer.layers) ? layer.layers : [layer];
		const fetchUserLayers = [];
		const layersSettingsToUpdate = [];
		const layersToUpdate = [];
		const user = globalStateController.getValue('user');
		const { layers, projectedLayers } = this.getValues(['layers', 'projectedLayers']);

		projectedLayers.forEach(layer => {
			const layerToUpdate = layersToChange.find(l => l._id === layer._id);
			if (layerToUpdate) {
				set(layer, field, value);
				if (field !== 'layerSettings.showable') {
					layersToUpdate.push({
						_id: layer.layerId,
						[field]: value,
						oldGroupName: field === 'groupName' ? layer.groupName : null,
					});
				}

				const layerFound = layers.find(l => l._id === layer._id);
				if (layerFound) {
					set(layerFound, field, value);
					if (field == 'layerSettings.showable') {
						this.handleDeckLayer({ ...layerFound });
						layersSettingsToUpdate.push({
							_id: layerFound._id,
							layerSettings: layerFound.layerSettings,
						});
					}
				} else {
					if (field === 'layerSettings.showable') {
						fetchUserLayers.push(layerToUpdate.layerId);
					}
				}
			}
		});
		this.updateState({ projectedLayers: [...projectedLayers] });

		if (fetchUserLayers.length > 0) {
			const userLayers = await client.query({
				query: LAYERS_BY_ID,
				variables: {
					layerIds: fetchUserLayers,
					userId: user._id,
				},
			});
			const layersToAdd = copy(userLayers.data.layersById);
			layersToAdd.forEach(layer => {
				set(layer, field, value);

				layersSettingsToUpdate.push({
					_id: layer._id,
					layerSettings: layer.layerSettings,
				});
			});

			this.updateState({ layers: sortBy([...layers, ...layersToAdd], 'position') });
		} else {
			this.updateState({ layers: [...layers] });
		}

		if (layersSettingsToUpdate.length > 0) {
			await client.mutate({
				mutation: UPDATEMANYLAYERSETTINGS,
				variables: {
					manySettings: layersSettingsToUpdate,
				},
			});
		}

		if (layersToUpdate.length > 0) {
			await client.mutate({
				mutation: UPDATE_MANY_LAYER,
				variables: {
					layers: layersToUpdate,
				},
			});
		}
	}
}

export const layerController = new LayerStateControllerHandler(layerStateInitialState);
