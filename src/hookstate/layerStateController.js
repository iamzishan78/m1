import { booleanWithin, difference, union, booleanIntersects, bboxPolygon } from '@turf/turf';
import { copy } from 'components/Shared/functions';
import { hookStateController } from 'hookstate/hookStateController';
import getBoundsQuery from 'api/getBoundsQuery';
import { generateFileFilters, makeGeoJSON, getGeoJsonLayerProps } from 'components/Map/DeckGL/helpers/common';
import DeckGlLayer from 'components/Map/DeckGL/helpers/DeckGlLayer';
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
import { globalStateController } from './globalStateController';
import { layerFiltersController } from './layerFiltersController';
import { getLayerKey } from 'hookstate/helpers';
import { popupController } from './popupStateController';
import { drawController } from './drawStateController';
import { navController } from './navStateController';
import { mapControlsController } from './mapControlsController';
import { NotificationManager } from 'react-notifications';
import { debounce } from 'lodash';
import { v4 as uuid } from 'uuid';
import { layerFilters, layerState, layerStateInitialState } from './initialStates';
import { drawWellBoundary } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';

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
			return [2, 207, 53]; // green

		// rgb(230, 15, 15)
		case 'GAS':
			return [230, 15, 15]; // red

		// rgb(74, 211, 242)
		case 'WATER':
			return [74, 211, 242]; // blue

		// rgb(251, 152, 40)
		case 'PERMIT':
		case 'PERMIT - NEW DRILL':
		case 'PERMIT - EXISTING WELL':
			return [251, 152, 40]; // orange

		// rgba(30, 26, 26, 0.55)
		case 'PERMITTED':
			return [251, 152, 40]; // orange

		// rgb(192, 0, 0)
		default:
			return [58, 58, 58]; // default dark for permitted
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
				await pausePromise;
			}
			if (data) {
				let dataToReturn = data;
				data = null;
				yield dataToReturn;
			} else {
				// No new data, pause until the external promise is resolved
				// eslint-disable-next-line no-loop-func
				pausePromise = new Promise(resolve => {
					// Expose a function to externally pause the generator
					getData.feedData = d => {
						data = d;
						pausePromise = null; // Reset the promise after resolving
						resolve();
					};
				});
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
					getLineColor: [0, 0, 0, 0],
					lineWidthMinPixels: 1.5,
					lineWidthMaxPixels: 8,
					highlightColor: [136, 136, 136, 77],
					autoHighlight: true,
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
					getLineColor: [0, 0, 0, 0],
					lineWidthMinPixels: 1.5,
					lineWidthMaxPixels: 8,
					highlightColor: [136, 136, 136, 77],
					autoHighlight: true,
				};
			},
		},
	},
};

const layerStateControllerHandler = state => {
	const showError = debounce(error => {
		NotificationManager.error(error, 'Error', 6000);
	}, 1000);
	const handleBounds = (layerId, defaultZoom, visible, layerBBox, polygonFilter) => {
		const { boundingStates, bbox, zoom } = state.get({
			noproxy: true,
		});

		const boundingStateVal = boundingStates?.[layerId] || {};
		let { previousBounds, ...rest } = boundingStateVal;

		if (!bbox) return boundingStateVal;

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
				}
				if (show) {
					if (previousBounds) previousBounds = union(previousBounds, newPolygon);
					else previousBounds = newPolygon;
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
			if (polygonFilter) showError('Invalid Shape');
			console.log('🚀 ~ file: layerStateController.js:285 ~ handleBounds ~ err:', err.message);
			return boundingStateVal;
		}
	};

	const updateLayers = (layerId, updatedState, type) => {
		window.mapRef?.__deck?.layerManager?.layers?.forEach?.(layer => {
			if (!layer.id.includes(layerId)) return;

			if (type && !layer.id.includes(type)) return;

			DeckGlLayer.updateLayer(updatedState, window.mapRef?.getLayer(layer.id)?.implementation);
		});
	};

	const updateLayer = (layer, updatedState) => {
		const layerId = `${layer?.identifier}_${layer._id}`;
		DeckGlLayer.updateLayer(updatedState, window.mapRef?.getLayer(layerId)?.implementation);
	};

	const removeLayer = (layer, recalculate = false) => {
		const layerId = `${layer?.identifier}_${layer._id}`;
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
			if (recalculate) layerController.recalculate();
		}, 10);
	};

	const removeLayers = (timeout = true) => {
		const showableLayers = getShowableLayers();
		showableLayers.forEach(layer => {
			if (timeout)
				setTimeout(() => {
					removeLayer(layer);
				}, 50);
			else removeLayer(layer);
		});
	};

	const recalculate = () => {
		state.recalculate.set(!state.recalculate.get({ noproxy: true }));
	};

	const getShowableLayers = () => {
		let layers = globalStateController.getValue('layers');
		if (layers?.length === 0) {
			const deckLayer = globalStateController.getValue('deckLayer');
			if (deckLayer) layers = [deckLayer];
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

			if (!meta?.layer && !ifStaticMapBoxGlLayerIdentifiers(dbLayer?.identifier)) return false;

			const visible = dbLayer.layerSettings?.showable && dbLayer.layerSettings?.visiable !== false;

			if (!visible) return false;

			const isFileLayer = dbLayer?.layerType === 'file layer';

			if (
				!isFileLayer &&
				!deckGlLayerIdentifiers.includes(dbLayer?.identifier) &&
				!isCustomLayerCopy(dbLayer?.identifier) &&
				!deckGlLandGridIdentifiers.includes(dbLayer?.identifier) &&
				!mapBoxLayerIdentifiers.includes(dbLayer?.identifier) &&
				!staticMapBoxLayerIdentifiers.includes(dbLayer?.identifier)
			)
				return false;

			return true;
		});
	};

	const getBeforeLayerId = identifier => {
		const showableLayers = getShowableLayers();
		const layerIndex = showableLayers.findIndex(dbLayer => {
			return identifier === dbLayer?.identifier;
		});
		return layerIndex > 0
			? `${showableLayers[layerIndex - 1]?.identifier}_${showableLayers[layerIndex - 1]._id}`
			: 'first_deck_layer';
	};

	const handleMapBoxLayer = dbLayer => {
		const map = window.mapRef;
		const layerId = dbLayer.layerId;

		// Layer data and converting it to geojson
		let layerData = null;
		if (dbLayer.identifier === 'Search') layerData = layerController.getValue('wellListFromSearch');
		if (dbLayer.identifier === 'Rig Activity') layerData = layerController.getValue('rigsData');

		// Return if we not get any data
		if (!layerData) return;
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
			if (map.getSource(`${layerId}-cluster`)) map.getSource(`${layerId}-cluster`).setData(geoJson);
			return;
		}

		if (!visible) return;

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
				if (err) return;

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
		if (map.getLayer(meta?.id)) map.setLayoutProperty(meta?.id, 'visibility', visible ? 'visible' : 'none');
	};

	const toggleLayersActivity = (identifier, value) => {
		let layers = globalStateController.getValue('layers');
		const layer = layers.find(layer => layer.identifier.startsWith(identifier));
		layerController.handleDeckLayer({ ...layer, layerSettings: { ...layer.layerSettings, visiable: value } });
	};

	const reinitializeLayer = ({ meta, layerId, beforeLayerId, labelProps, pickable, visible }) => {
		if (!deckLayers[layerId]) {
			deckLayers[layerId] = {
				getData: generateDataFunc(),
				beforeLayerId,
			};
			const metaLayer = meta.layer;
			new DeckGlLayer({
				layerId: layerId,
				type: metaLayer.type,
				beforeLayer: beforeLayerId,
				props: {
					...metaLayer.getProps(layerId),
					...meta.props?.[layerId],
					...(labelProps && { getText: d => d.properties?.label }),
					pickable,
					visible,
				},
			});
		}
		DeckGlLayer.moveLayer(layerId, beforeLayerId);
		deckLayers[layerId].beforeLayerId = beforeLayerId;
	};

	const handleDeckLayer = (dbLayer, isUpdateTrigger) => {
		const client = layerController.getValue('client');
		if (!client) return;

		if (ifMapBoxGlLayerIdentifiers(dbLayer?.identifier)) return handleMapBoxLayer(dbLayer);

		if (ifStaticMapBoxGlLayerIdentifiers(dbLayer?.identifier)) return handleStaticMapBoxLayer(dbLayer);

		const meta = LayerMeta[dbLayer?.identifier] || LayerMeta[dbLayer?.layerType];

		if (!meta?.layer) return;

		const layerId = `${dbLayer.identifier}_${dbLayer._id}`;
		const beforeLayerId = getBeforeLayerId(dbLayer.identifier);

		const isFileLayer = dbLayer.layerType === 'file layer';
		const isAgreementLayer = agreementLayerIdentifiers.includes(dbLayer.identifier);
		const filterIdentifier = isAgreementLayer
			? 'Agreements'
			: isFileLayer
				? dbLayer.layerShapeName
				: dbLayer.identifier;

		const filterKey = getLayerKey(filterIdentifier, layerFilters);
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

		let pickable =
			dbLayer.layerSettings.interaction?.interactionAble && dbLayer.layerSettings.interaction?.interactionDetail?.click;
		if (deckGlLandGridIdentifiers.includes(dbLayer?.identifier)) pickable = true;

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

		reinitializeLayer({ meta, layerId, beforeLayerId, labelProps, pickable, visible });

		if (isUpdateTrigger) {
			const newId = uuid();
			updatedProps.updateTriggers = {
				getFillColor: newId,
				getLineColor: newId,
				getLineWidth: newId,
				defaultColor: newId,
				getPointRadius: newId,
			};
		}
		if (!boundingState.show?.current)
			return updateLayer(dbLayer, {
				pickable,
				...updatedProps,
				visible: boundingState.show?.current,
			});

		if (!boundingState.callApi)
			return updateLayer(dbLayer, {
				pickable,
				...updatedProps,
				visible: boundingState.show?.current,
			});

		updateLayer(dbLayer, updatedProps);

		getBoundsQuery({
			multiQuery: meta.multiQuery,
			layerId,
			identifier: dbLayer.identifier,
			boundingState,
			geoField: meta.geoField,
			polygonFilter,
			polygonsFilter,
			filters: isFileLayer ? generateFileFilters({ fileLayer: dbLayer, extendFilters: filters }) : filters,
			isElasticQuery: isFileLayer ? false : true,
			onData: data => {
				if (!Array.isArray(data)) return;
				let geoJson = { features: [] };
				if (data?.length > 0) {
					if (filters?.allowedTypes?.length > 0) {
						data = data.filter(f => filters.allowedTypes.includes(f?.shapeJson?.geometry?.type));
					}
					const layerData = data;
					if (!Array.isArray(layerData)) return;
					geoJson = makeGeoJSON(layerData, labelProps);
				}
				if (deckLayers[layerId]?.getData?.feedData) deckLayers[layerId].getData.feedData(geoJson.features);
			},
		});
	};

	return {
		init: (client, history) => {
			layerController.updateState({ client, history });
		},
		resetBounds: identifier => {
			if (identifier === 'Agreements') {
				['Deeds', 'Leases', 'Contracts', 'Surfaces'].forEach(type => {
					layerController.resetBounds(type);
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
				const requiredLayer = globalStateController
					.getValue('layers')
					.find(layer => layer.layerShapeName === identifier);

				// If layer is not found, then return
				if (!(requiredLayer && requiredLayer?.layerType === 'file layer')) return;

				// Updating identifier with requiredLayer identifier
				identifier = requiredLayer.identifier;
				layerId = Object.keys(boundingStates || {}).find(
					key => key && key.toLowerCase().startsWith(identifier.toLowerCase())
				);
				if (!layerId) return;
			}

			const showableLayers = getShowableLayers();
			showableLayers.forEach(dbLayer => {
				if (dbLayer.identifier.toLowerCase().startsWith(identifier.toLowerCase())) removeLayer(dbLayer, true);
			});
		},
		updateLayers,
		updateLayer,
		recalculate,
		handleDeckLayer,
		handleMapBoxLayer,
		removeLayers,
		toggleLayersActivity,
		handleChange: () => {
			const showableLayers = getShowableLayers();
			showableLayers.forEach(dbLayer => {
				handleDeckLayer(dbLayer);
			});
			if (window.mapRef.getLayer('boundary-layer')) window.mapRef.moveLayer('boundary-layer');
		},
		changeLayerPosition: (currentLayer, beforeLayer) => {
			if (!currentLayer) return;

			if (currentLayer && !beforeLayer) DeckGlLayer.moveLayer(`${currentLayer?.identifier}_${currentLayer._id}`);
			else
				DeckGlLayer.moveLayer(
					`${currentLayer?.identifier}_${currentLayer._id}`,
					`${beforeLayer?.identifier}_${beforeLayer._id}`
				);
		},
		resetMapStates: (mapReady = false) => {
			const rigsData = layerController.getValue('rigsData');
			const client = layerController.getValue('client');
			removeLayers(false);
			popupController.reset();
			drawController.reset();
			layerFiltersController.reset();
			layerController.setState({ rigsData, client });
			navController.reset();
			mapControlsController.setState({
				selectedControl: mapControlsController.getValue('selectedControl'),
			});
			globalStateController.updateState({ mapReady });
		},
		resetMap: () => {
			layerController.resetMapStates();
			window.mapRef?.remove();
			window.mapRef = null;
			window.drawRef = null;
		},
	};
};

export const layerController = {
	...layerStateControllerHandler(layerState),
	...hookStateController(layerState, copy(layerStateInitialState)),
};
