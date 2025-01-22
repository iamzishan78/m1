
import { deepEqual } from 'components/Shared/functions';
import { getFormattedFilterBasedOnType } from 'components/Shared/SidePanel/compoennts/Filters/UserMapFilter';

import { globalStateController } from './globalStateController';
import { layerFilterInitialState } from './initialStates';
import { layerController } from './layerStateController';
import { StateController } from './stateController';


class LayerFiltersController extends StateController {
	constructor(initialState) {
		super(initialState);
	}

	setVariables(layerType, variables) {
		if (!layerType) {
			return;
		}

		let filters = this.getValue(layerType) || {};

		if (!filters?.variables) {
			filters = { variables: {} };
		}

		const updatedVariables = {
			...filters.variables,
			filters: variables.filters,
			search: variables.search,
		};

		if (!deepEqual(filters.variables, updatedVariables)) {
			this.updateState({ [layerType]: { ...filters, variables: updatedVariables } });
			layerController.resetBounds(layerType);
		}
	}

	resetVariables(layerType, mapViewFilters = []) {
		const initialVariables = layerFilterInitialState[layerType]?.variables;

		if (!initialVariables) {
			return;
		}

		const filters = this.getValue(layerType);

		if (!deepEqual(filters.variables, initialVariables)) {
			const mergedFilters = [...initialVariables.filters, ...mapViewFilters];
			const updatedVariables = { ...filters, variables: { ...initialVariables, filters: mergedFilters } }; t
			this.updateState({ [layerType]: updatedVariables });
			layerController.resetBounds(layerType);
		}
	}

	getBeforeLayer(index) {
		const layers = globalStateController.getValue('layers');

		let id;

		while (index > 0) {
			const layer = layers?.[index - 1];
			index--;

			if (!layer.layerSettings.showable) {
				continue;
			}

			id = this.getFirstLayer(layer.identifier);

			if (id) {
				break;
			}
		}

		return id;
	}

	updateLayerIds(layerType, firstLayer, lastLayer) {
		if (!layerType) {
			return;
		}

		const filters = this.getValue(layerType);

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
			this.updateState({ [layerType]: updatedFilters });
		}
	}

	getFirstLayer(layerType) {
		if (!layerType) {
			return null;
		}

		const filters = this.getValue(layerType);
		return filters?.firstLayer;
	}

	clearWellsFilters() {
		const { variables } = this.getValue('Wells');

		this.setVariables('Wells', {
			...variables,
			filters: [],
		});
	}

	clearSnapGridFilters() {
		['Wells', 'Agreements', 'Units', 'Parcels'].forEach(key => {
			const mapViewFilters = this.getValue(key);
			this.resetVariables(
				key,
				mapViewFilters?.variables?.filters?.filter(filter => filter.isMapViewFilter)
			);
		});
	}

	setPolygonFilter(polygon) {
		layerController.removeLayers();
		setTimeout(() => {
			this.updateState({ polygonFilter: polygon });
		}, 100);
	}

	setPolygonsFilter(polygons) {
		layerController.removeLayers();
		setTimeout(() => {
			this.updateState({ polygonsFilter: polygons });
		}, 100);
	}

	updateLayerFiltersFromMapViews(dataSourceName, mapViewFilters) {
		mapViewFilters = mapViewFilters.filter(filter => filter.dataSourceName === dataSourceName);
		const state = this.getValue(dataSourceName);
		const initialFilters = state?.variables?.filters || [];
		let filters = initialFilters.filter(filter => !filter.isMapViewFilter);
		filters = [
			...filters,
			...(mapViewFilters?.map(mapView =>
				getFormattedFilterBasedOnType(mapView.filterType, mapView.fieldName, mapView.filterValues)
			) ?? {}),
		];
		this.setVariables(dataSourceName, { filters });
	}
}

export const layerFiltersController = new LayerFiltersController(layerFilterInitialState);