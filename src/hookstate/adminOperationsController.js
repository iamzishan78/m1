import { StateController } from './stateController';
import { adminOperationsInitialState } from './initialStates';

export const globalStateController = new StateController(adminOperationsInitialState);
