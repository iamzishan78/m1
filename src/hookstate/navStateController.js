import { hookstate, useHookstate } from '@hookstate/core';

import { findBoundsMap } from 'components/MapControls/commonHelper';
import { ROUTES } from 'components/Shared/FeatureFlag/common';
import { copy, deepEqual } from 'components/Shared/functions';

import { hookStateController } from 'hookstate/hookStateController';

import { layerFiltersController } from './layerFiltersController';

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
	// For Geography Filter
};

export const navState = hookstate(copy(initialState));
export const useNavState = () => useHookstate(navState);

export const WellsGeographyFilters = ['state', 'county', 'GrId1', 'GrId2', 'GrId3', 'GrId4', 'GrId5'];

const navStateControllerHandler = () => ({
	handleGeographyFilters: newFilters => {
		if (!Array.isArray(newFilters)) {
			navController.updateState({ [newFilters.field]: newFilters.value });
			setTimeout(() => {
				const { parcelFilter, interestFilter } = navController.getValues(['interestFilter', 'parcelFilter']);
				findBoundsMap([...parcelFilter.shapes, ...interestFilter.shapes], window.mapRef, {
					top: 300,
					bottom: 300,
					left: 300,
					right: 300,
				});
			}, 0);
		} else {
			navController.handleWellsFilters(newFilters);
		}
	},
	handleWellsFilters: newFilters => {
		const { variables } = layerFiltersController.getValue('Wells');
		let filters = copy(variables.filters);
		if (!Array.isArray(newFilters)) {
			newFilters = [newFilters];
		}

		newFilters.forEach(filter => {
			const { field, value, type } = filter;
			filters = filters.filter(filter => filter.field !== field);

			if (value?.length > 0 || value?.hasOwnProperty?.('min') || value?.hasOwnProperty?.('max')) {
				if (type === 'range') {
					if (value?.hasOwnProperty?.('min') && value?.hasOwnProperty?.('max')) {
						filters.push({
							field,
							value: [value.min, value.max],
							type: 'advanced',
							searchType: 'between',
						});
					} else if (value?.hasOwnProperty?.('min')) {
						filters.push({
							field,
							value: value.min,
							type: 'advancedadvanced',
							searchType: 'greaterThanOrEqualTo',
						});
					} else if (value?.hasOwnProperty?.('min')) {
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
					filters.push({
						field,
						value,
					});
				}
			}
		});
		navController.updateState({
			wellFilterCount: filters.filter(filter => !WellsGeographyFilters.includes(filter.field)).length,
		});

		if (!deepEqual(filters, variables.filters)) {
			layerFiltersController.setVariables('Wells', {
				...variables,
				filters,
			});
		}
	},
	clearGeographyFilters: () => {
		navController.updateState({
			interestFilter: {
				shapes: [],
				value: [],
			},
			parcelFilter: {
				shapes: [],
				value: [],
			},
		});
		const WellsFilter = WellsGeographyFilters.map(filter => ({ [filter]: null }));
		navController.handleWellsFilters(WellsFilter);
	},
});

export const navController = { ...navStateControllerHandler(navState), ...hookStateController(navState, initialState) };
