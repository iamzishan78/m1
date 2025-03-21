import { StateController } from 'stateManagement/stateController';

export const viewFormInitialState = {
	documentNumber: '',
	documentName: '',
	documentType: '',
	dateTime: null,
	book: '',
	page: '',
	instrument: '',
	custom_data: null,
	fileId: null,
	url: null,
};

export const createViewFormState = {}; // Stores states for different tableKeys

class CreateViewStateController extends StateController {
	constructor(initialState) {
		super(initialState, CreateViewStateController.name);
		this.autoBind(this);
	}

	initialize(tableKey, FieldsValue) {
		this.updateState({
			tableKey,
			...FieldsValue,
		});
	}
}

// Ensures each tableKey has a unique state instance
export const createViewStateController = tableKey => {
	if (!createViewFormState[tableKey]) {
		createViewFormState[tableKey] = new CreateViewStateController(viewFormInitialState);
	}
	return createViewFormState[tableKey];
};
