import { hookStateController } from 'stateManagement/hookStateController';

import { adminOperationsInitialState, adminOperationsState } from './initialStates';

const adminOperationsControllerHandler = state => ({});

export const adminOperationsController = {
	...adminOperationsControllerHandler(adminOperationsState),
	...hookStateController(adminOperationsState, adminOperationsInitialState),
};
