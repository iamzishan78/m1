import { deepEqual } from 'components/Shared/functions';
import { getFormattedFilterBasedOnType } from 'components/Shared/SidePanel/compoennts/Filters/UserMapFilter';

import { hookStateController } from 'hookstate/hookStateController';

import { globalStateController } from './globalStateController';
import { layerFilterInitialState, layerFilters } from './initialStates';
import { layerController } from './layerStateController';

const layerFiltersControllerHandler = state => ({
	setVariables: (layerType, variables) => {
		if (!layerType) {
			return;
		}

		let filters = layerFilters[layerType].get({ noproxy: true }) || {};

		if (!filters?.variables) {
			filters = {
				variables: {},
			};
		}

		const updatedVariables = {
			...filters.variables,
			filters: variables.filters,
			search: variables.search,
		};

		if (!deepEqual(filters.variables, updatedVariables)) {
			layerFilters[layerType]?.set({ ...filters, variables: updatedVariables });
			layerController.resetBounds(layerType);
		}
	},
	resetVariables: (layerType, mapViewFilters = []) => {
		const initialVariables = layerFilterInitialState[layerType]?.variables;

		if (!initialVariables) {
			return;
		}

		const filters = layerFilters[layerType].get({ noproxy: true });

		if (!deepEqual(filters.variables, initialVariables)) {
			const mergedFilters = [...initialVariables.filters, ...mapViewFilters];
			const updatedVariables = { ...filters, variables: { ...initialVariables, filters: mergedFilters } };
			layerFilters[layerType]?.set(updatedVariables);
			layerController.resetBounds(layerType);
		}
	},
	getBeforeLayer: index => {
		const layers = globalStateController.getValue('layers');

		let id;

		while (index > 0) {
			const layer = layers?.[index - 1];
			index--;

			if (!layer.layerSettings.showable) {
				continue;
			}

			id = layerFiltersController.getFirstLayer(layer.identifier);

			if (id) {
				break;
			}
		}

		return id;
	},
	updateLayerIds: (layerType, firstLayer, lastLayer) => {
		if (!layerType) {
			return;
		}

		const filters = layerFilters[layerType].get({ noproxy: true });

		if (!filters) {
			return;
		}

		if (filters.firstLayer === firstLayer && filters.lastLayer === lastLayer) {
			return;
		}

		const updatedFilters = {
			...filters,
			firstLayer,
			lastLayer,
		};

		if (!deepEqual(filters, updatedFilters)) {
			layerFilters[layerType]?.set(updatedFilters);
		}
	},
	getFirstLayer: layerType => {
		if (!layerType) {
			return;
		}

		const filters = layerFilters[layerType].get({ noproxy: true });

		return filters?.firstLayer;
	},
	clearWellsFilters: () => {
		// eslint-disable-next-line no-use-before-define
		const { variables } = layerFiltersController.getValue('Wells');

		// eslint-disable-next-line no-use-before-define
		layerFiltersController.setVariables('Wells', {
			...variables,
			filters: [],
		});
	},
	clearSnapGridFilters: () => {
		['Wells', 'Agreements', 'Units', 'Parcels'].forEach(key => {
			const mapViewFilters = layerFilters[key].get({ noproxy: true });
			layerFiltersController.resetVariables(
				key,
				mapViewFilters?.variables?.filters?.filter(filter => filter.isMapViewFilter)
			);
		});
	},
	setPolygonFilter: polygon => {
		layerController.removeLayers();
		setTimeout(() => {
			state.polygonFilter.set(polygon);
		}, 100);
	},
	setPolygonsFilter: polygons => {
		layerController.removeLayers();
		setTimeout(() => {
			state.polygonsFilter.set(polygons);
		}, 100);
	},

	updateLayerFiltersFromMapViews: (dataSourceName, mapViewFilters) => {
		mapViewFilters = mapViewFilters.filter(filter => filter.dataSourceName === dataSourceName);
		const state = layerFiltersController.getValue([dataSourceName]); // Get layer filters from hookstate
		const initialFilters = state?.variables?.filters || []; // Get initial filters
		let filters = initialFilters.filter(filter => !filter.isMapViewFilter); // Remove existing filter
		filters = [
			...filters,
			...mapViewFilters.map(mapView =>
				getFormattedFilterBasedOnType(mapView.filterType, mapView.fieldName, mapView.filterValues)
			),
		];
		layerFiltersController.setVariables(dataSourceName, { filters });
	},
});

export const layerFiltersController = {
	...layerFiltersControllerHandler(layerFilters),
	...hookStateController(layerFilters, layerFilterInitialState),
};
