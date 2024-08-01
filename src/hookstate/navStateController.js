import { hookstate, useHookstate } from '@hookstate/core';
import { findBoundsMap } from 'components/MapControls/commonHelper';
import { ROUTES } from 'components/Shared/FeatureFlag/common';
import { copy } from 'components/Shared/functions';
import { hookStateController } from 'hookstate/hookStateController';

const initialState = {
	drawingMode: null,
	filterFeatureId: null,
	bulkUploadFromMap: false,
	bulkUploadShape: null,
	bulkUploadParcel: null,
	selectedModule: ROUTES.MAP.module,
	geographyFilterCount: 0,
	wellFilterCount: 0,
	interestFilter: {
		shapes: [],
		value: []
	},
	parcelFilter: {
		shapes: [],
		value: []
	}
};

export const navState = hookstate(copy(initialState));
export const useNavState = () => useHookstate(navState);

const navStateControllerHandler = () => ({
	handleMapFilter: () => {
		const { parcelFilter, interestFilter } = navController.getValues(['interestFilter', 'parcelFilter'])
		findBoundsMap([...parcelFilter.shapes, ...interestFilter.shapes], window.mapRef, {
			top: 300, bottom: 300, left: 300, right: 300
		});
	},
	clearFilters: () => {
		navController.updateState({
			interestFilter: {
				shapes: [],
				value: []
			},
			parcelFilter: {
				shapes: [],
				value: []
			}
		})
	}
});

export const navController = { ...navStateControllerHandler(navState), ...hookStateController(navState, initialState) };
