import { StateController } from './stateController';

export const adminOperationsInitialState = {
	tenants: [],
	selectedScript: null,
	models: [],
	chunkSize: null,
	reflatDependencies: 'No',
	createNewFlatData: 'No',
	warning: null,
	message: null,
	apiKeys: { dialpad: '' },
};

export const adminOperationsController = new StateController(adminOperationsInitialState);
