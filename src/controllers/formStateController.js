import { StateController } from './stateController';

const getCurrentDate = () => {
	const d = new Date().toISOString();
	return d.slice(0, d.indexOf('T'));
};

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
	startTime: '08:00',
	endTime: '08:00',
	frequency: '',
	applicable: '',
	obligationValue: '',
	responsibleParty: '',
	assignedOwner: '',
};

class FormStateController extends StateController {
	constructor(initialState) {
		super(initialState, FormStateController.name);
		this.autoBind(this);
	}
}

export const formStateController = new FormStateController(formInitialState);
