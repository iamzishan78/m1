import { get } from 'lodash';
import { v4 as uuid } from 'uuid';

import { dividePolygon, makeGeoJSONFromStrings } from 'components/Map/DeckGL/helpers/common';
import { copy, getPolygonString, processInBatches } from 'components/Shared/functions';
import { agreementLayerIdentifiers } from 'components/Shared/functions/shapeLayer';

import { ABSTRACTGEOQUERY } from 'graphQL/useQueryAbstractGeo';
import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';
import { PLSSSECONDDIVISIONGEO } from 'graphQL/useQueryPLSSSecondDivisionGeo';

import { globalStateController } from 'hookstate/globalStateController';
import { layerController } from 'hookstate/layerStateController';

const queries = {
	Wells: {
		queryString: GET_DB_DATA,
		getterKey: 'data.getDbData',
		isWellsQuery: true,
	},
	search: {
		queryString: GET_DB_DATA,
		getterKey: 'data.getDbData',
	},
	AbstractGeo: {
		queryString: ABSTRACTGEOQUERY,
		getterKey: 'data.abstractGeo',
		isLandGridQuery: true,
	},
	Pls: {
		queryString: PLSSSECONDDIVISIONGEO,
		getterKey: 'data.plssSecondDivisionGeo',
		isLandGridQuery: true,
	},
};

const queryHandlers = {};

const handleQuery = (queryHandler, onData) => {
	const { queryString, getterKey, isLandGridQuery } = queries[queryHandler.identifier] || queries['search'];

	const client = layerController.getValue('client');
	if (!client) {
		return null;
	}

	return new Promise(resolve => {
		const query = client.watchQuery({
			query: queryString,
			variables: queryHandler.variables,
			fetchPolicy: 'no-cache', // Disable caching for this query
		});
		// Subscribe to it, and do something with the data
		queryHandler.observable = query.subscribe(res => {
			queryHandler.finished = true;

			const data = get(res, getterKey);
			if (data && isLandGridQuery) {
				onData(makeGeoJSONFromStrings(data).features, queryHandler.geoPolygon);
				return resolve(makeGeoJSONFromStrings(data).features);
			}
			if (!data?.error && data?.hits) {
				onData(data?.hits, queryHandler.geoPolygon);

				return resolve(data?.hits);
			}
			if (data?.length > 0) {
				onData(data, queryHandler.geoPolygon);

				return resolve(data);
			}
			return null;
		});
	});
};

const getBoundsQuery = async ({
	layerId,
	identifier,
	layerSettings,
	isFileLayer,
	boundingState,
	onData,
	geoField,
	filters,
	multiQuery,
	polygonFilter,
	polygonsFilter,
}) => {
	const { isWellsQuery, isOneTimeQuery, isLandGridQuery } = queries[identifier] || queries['search'];

	if (isOneTimeQuery) {
		const queryHandler = {
			identifier,
			id: uuid(),
			finished: false,
		};

		await handleQuery(queryHandler, onData);

		return;
	}

	const zoom = layerController.getValue('zoom');

	const isAgreementLayer = agreementLayerIdentifiers.some(layer =>
		identifier?.toLowerCase().includes(layer.toLowerCase())
	);

	if (!filters && !isLandGridQuery) {
		return;
	}

	if (!queryHandlers[layerId]) {
		queryHandlers[layerId] = [];
	}

	queryHandlers[layerId].forEach(queryHandler => {
		if (!queryHandler.finished) {
			queryHandler.observable.unsubscribe();
		}
	});

	const { polygon, lastBounds } = boundingState || {};

	if (!polygon) {
		return;
	}

	globalStateController.setLayerLoading(layerId, true);
	let geoPolygons = [polygon];
	if (multiQuery && !polygonFilter && polygonsFilter.length === 0) {
		geoPolygons = dividePolygon(polygon);
		if (zoom < 12 && isWellsQuery) {
			geoPolygons = [
				...dividePolygon(geoPolygons[0]),
				...dividePolygon(geoPolygons[1]),
				...dividePolygon(geoPolygons[2]),
				...dividePolygon(geoPolygons[3]),
			];
		}
	}

	const promises = [];

	geoPolygons.forEach(geoPolygon => {
		const { variables = {} } = copy(filters || {});

		if (isAgreementLayer) {
			variables.filters = filters.variables.filters.map(filter => {
				if (filter.field !== 'shapeJson.properties.type.keyword') {
					return filter;
				}
				return {
					field: 'layer.keyword',
					value: agreementLayerIdentifiers
						.find(metaKey => identifier?.startsWith(metaKey))
						.toLowerCase()
						.replace(/s$/, ''),
				};
			});
		}

		if (isLandGridQuery) {
			const polygonString = getPolygonString(geoPolygon);
			if (polygonString) {
				variables.polygon = polygonString;
			}
		} else {
			variables.filters.push({
				type: 'geo_intersects',
				field: filters.geoBoundingField || geoField,
				value: polygonsFilter.length === 0 ? geoPolygon.geometry : polygonsFilter,
			});

			if (lastBounds?.geometry) {
				variables.filters.push({
					type: 'geo_notintersects',
					field: filters.geoBoundingField || geoField,
					value: lastBounds?.geometry,
				});
			}
		}

		// Initialize the base projection
		variables.project = {
			layer: 1,
			[geoField]: 1,
			_id: 1,
		};

		// Add layer-specific fields
		if (isFileLayer) {
			Object.assign(variables.project, {
				name: 1,
				fileId: 1,
				type: 1,
				properties: 1,
			});
		} else if (isWellsQuery) {
			Object.assign(variables.project, {
				api: 1,
				id: 1,
				wellName: 1,
				wellType: 1,
				wellStatus: 1,
			});
		} else {
			Object.assign(variables.project, {
				'shapeJson.id': 1,
				'shapeJson.type': 1,
				'shapeJson.properties.shapeSubTitle': 1,
				'shapeJson.properties.shapeLabel': 1,
				'shapeJson.properties.layerType': 1,
				'shapeJson.properties.sdType': 1,
				'shapeJson.properties.layerSubType': 1,
				'shapeJson.properties.type': 1,
				'shapeJson.properties.uName': 1,
				'shapeJson.properties.agreementName': 1,
				'shapeJson.properties.shapeCenter': 1,
				shapeCenter: 1,
				shapeArea: 1,
			});
		}
		if (!isFileLayer) {
			if (layerSettings.selectedAttribute) {
				Object.assign(variables.project, {
					[layerSettings.selectedAttribute.value.replace('.keyword', '')]: 1,
				});
			}
			if (layerSettings.selectedStrokeAttribute) {
				Object.assign(variables.project, {
					[layerSettings.selectedStrokeAttribute.value.replace('.keyword', '')]: 1,
				});
			}

			if (layerSettings.selectedFillStyle) {
				Object.assign(variables.project, {
					[layerSettings.selectedFillStyle.value.replace('.keyword', '')]: 1,
				});
			}

			if (layerSettings.selectedLineStyle) {
				Object.assign(variables.project, {
					[layerSettings.selectedLineStyle.value.replace('.keyword', '')]: 1,
				});
			}
		}
		const queryHandler = {
			identifier,
			id: uuid(),
			finished: false,
			variables,
			geoPolygon,
		};

		queryHandlers[layerId].push(queryHandler);

		const promise = handleQuery(queryHandler, onData);

		promises.push(promise);
	});

	await processInBatches(promises, 20);

	const newPromises = [];
	queryHandlers[layerId] = queryHandlers[layerId].filter(queryHandler => {
		if (!queryHandler.finished) {
			const promise = handleQuery(queryHandler, onData);
			newPromises.push(promise);
		} else {
			queryHandler.observable.unsubscribe();
		}

		return !queryHandler.finished;
	});
	await processInBatches(newPromises, 10);

	queryHandlers[layerId] = queryHandlers[layerId].filter(queryHandler => {
		if (queryHandler.finished) {
			queryHandler.observable.unsubscribe();
		}

		return !queryHandler.finished;
	});

	globalStateController.setLayerLoading(layerId, false);
};

export default getBoundsQuery;
