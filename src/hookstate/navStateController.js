import { hookstate, useHookstate } from '@hookstate/core';
import { copy } from 'components/Shared/functions';
import { hookStateController } from 'hookstate/hookStateController';

const initialState = {
	drawingMode: null,
	filterFeatureId: null,
	bulkUploadFromMap: false,
	bulkUploadShape: null,
	bulkUploadParcel: null,
};

export const navState = hookstate(copy(initialState));
export const useNavState = () => useHookstate(navState);

const navStateControllerHandler = () => ({});

export const navController = { ...navStateControllerHandler(navState), ...hookStateController(navState, initialState) };
