import { StateController } from './stateController';

const getCurrentDate = () => new Date().toISOString();

export const formInitialState = {
	activityType: 'Call',
	outcome: '',
	startDate: getCurrentDate(),
	endDate: getCurrentDate(),
	owner: '',
	dealId: null,
	mongoEntitiesArray: [],
	nameAutValue: { name: '', _id: null },
	status: false,
	notes: '',
	frequency: '',
	applicable: '',
	obligationValue: '',
	responsibleParty: '',
	assignedOwner: '',
	fileUpload: { upload: false, fileExtension: null, fileInformation: '' },
};

class FormStateController extends StateController {
	constructor(initialState) {
		super(initialState, FormStateController.name);
		this.autoBind(this);
	}
}

export const formStateController = new FormStateController(formInitialState);
