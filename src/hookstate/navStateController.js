import { findBoundsMap } from 'components/MapControls/commonHelper';
import { ROUTES } from 'components/Shared/FeatureFlag/common';
import { copy, deepEqual } from 'components/Shared/functions';

import { layerFiltersController } from './layerFiltersController';
import { StateController } from './stateController'; // <-- Your generic class-based controller

// Original initial state
const initialState = {
	drawingMode: null,
	filterFeatureId: null,
	bulkUploadFromMap: false,
	bulkUploadShape: null,
	bulkUploadParcel: null,
	selectedModule: ROUTES.MAP.module,
	wellFilterCount: 0,
	// For Geography Filter
	geographyFilterCount: 0,
	interestFilter: {
		shapes: [],
		value: [],
	},
	parcelFilter: {
		shapes: [],
		value: [],
	},
	// ...
	filterDrawing: [],
	filterIntersectingWellLines: [],
	filterBasin: [],
	filterAOI: [],
	filterParcel: [],
};

export const WellsGeographyFilters = ['state', 'county', 'GrId1', 'GrId2', 'GrId3', 'GrId4', 'GrId5'];

class NavStateController extends StateController {
	constructor(initialState) {
		super(initialState, NavStateController.name);
	}

	/**
	 * handleGeographyFilters
	 *
	 * If `newFilters` is an object (not an array), treat it as a direct filter
	 * and update the state. Then fit the map bounds. Otherwise, treat it as
	 * a set of well filters and handle them accordingly.
	 */
	handleGeographyFilters(newFilters) {
		if (!Array.isArray(newFilters)) {
			// Single filter object
			const { field, value } = newFilters;
			this.updateState({ [field]: value });

			// Fit map bounds after a short delay
			setTimeout(() => {
				const interestFilter = this.getValue('interestFilter');
				const parcelFilter = this.getValue('parcelFilter');
				findBoundsMap([...parcelFilter.shapes, ...interestFilter.shapes], window.mapRef, {
					top: 300,
					bottom: 300,
					left: 300,
					right: 300,
				});
			}, 0);
		} else {
			// Array of filters => handle well filters
			this.handleWellsFilters(newFilters);
		}
	}

	/**
	 * handleWellsFilters
	 *
	 * Updates well filters in the layerFiltersController,
	 * sets `wellFilterCount` based on the new filters,
	 * and only updates the layer filters if they’ve truly changed.
	 */
	handleWellsFilters(newFilters) {
		const { variables } = layerFiltersController.getValue('Wells');
		let filters = copy(variables.filters);

		// Ensure newFilters is an array
		if (!Array.isArray(newFilters)) {
			newFilters = [newFilters];
		}

		// Process each filter
		newFilters.forEach(filter => {
			const { field, value, type } = filter;
			// Remove any existing filter with the same field
			filters = filters.filter(f => f.field !== field);

			// Only add back if we have a non-empty filter
			if (value?.length > 0 || value?.hasOwnProperty?.('min') || value?.hasOwnProperty?.('max')) {
				if (type === 'range') {
					// Range filters
					if (value?.min !== undefined && value?.max !== undefined) {
						filters.push({
							field,
							value: [value.min, value.max],
							type: 'advanced',
							searchType: 'between',
						});
					} else if (value?.min !== undefined) {
						filters.push({
							field,
							value: value.min,
							type: 'advanced',
							searchType: 'greaterThanOrEqualTo',
						});
					}
				} else if (type === 'date') {
					filters.push({
						field,
						type,
						value,
					});
				} else {
					// Basic string/array filter
					filters.push({
						field,
						value,
					});
				}
			}
		});

		// Update local wellFilterCount (excluding geography-based filters)
		const wellFilterCount = filters.filter(f => !WellsGeographyFilters.includes(f.field)).length;
		this.updateState({ wellFilterCount });

		// If the filters actually changed, update them in layerFiltersController
		if (!deepEqual(filters, variables.filters)) {
			layerFiltersController.setVariables('Wells', {
				...variables,
				filters,
			});
		}
	}

	/**
	 * clearGeographyFilters
	 *
	 * Resets `interestFilter` and `parcelFilter`,
	 * then instructs well filters to clear out all WellsGeographyFilters.
	 */
	clearGeographyFilters() {
		this.updateState({
			interestFilter: { shapes: [], value: [] },
			parcelFilter: { shapes: [], value: [] },
		});

		// Wipe out wells filters for each geography field
		const WellsFilter = WellsGeographyFilters.map(filter => ({ [filter]: null }));
		// The original code called navController.handleWellsFilters(WellsFilter)
		// Here we just call this.handleWellsFilters
		this.handleWellsFilters(WellsFilter);
	}
}

// Create a single instance based on our initialState
export const navController = new NavStateController(initialState);
