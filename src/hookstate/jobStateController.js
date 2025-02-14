import { StateController } from './stateController';

const jobInitialState = {
	activeStepNumber: 0,
	csvDataToSend: [],
	mappedHeadersFromCSV: [],
	m1neralHeaders: [],
	csvDataList: [],
	transferData: null,
	uploaderFormValues: {},
	selectedShapeLayerOption: null,
	bulkUpload: false,
	jobType: null,
	job: null,
	JobOutput: null,
	isJobCompleted: null,
	isJobFailed: null,
	storeJobOutput: null,
	options: {},
};

class JobStateController extends StateController {
	constructor(initialState) {
		super(initialState, JobStateController.name);
	}

	initialize(stateToUpdate = {}) {
		this.updateState({
			...jobInitialState,
			...stateToUpdate,
		});
	}

	toggleBulkUpload() {
		this.updateState({ bulkUpload: !this.getValue('bulkUpload') });
	}

	nextStep() {
		this.updateState({ activeStepNumber: this.getValue('activeStepNumber') + 1 });
	}

	prevStep() {
		if (this.getValue('activeStepNumber') === 0) {
			return;
		}
		this.updateState({ activeStepNumber: this.getValue('activeStepNumber') - 1 });
	}

	async onRowAdd(newData) {
		const csvDataToSend = this.getValue('csvDataToSend') || [];
		this.updateState({ csvDataToSend: [...csvDataToSend, newData] });
	}

	async onRowUpdate(newData, oldData) {
		if (!oldData) {
			throw new Error('Old data not provided');
		}

		const csvDataToSend = this.getValue('csvDataToSend');
		const index = csvDataToSend.indexOf(oldData);
		if (index === -1) {
			throw new Error('Old data not found in csvDataToSend');
		}

		delete newData.reason;
		delete newData.invalidKey;

		csvDataToSend[index] = newData;
		this.updateState({ csvDataToSend: [...csvDataToSend] });
	}

	async onRowDelete(oldData) {
		const csvDataToSend = [...this.getValue('csvDataToSend')];
		const index = csvDataToSend.indexOf(oldData);
		if (index !== -1) {
			csvDataToSend.splice(index, 1);
			this.updateState({ csvDataToSend });
		}
	}
}

export const jobController = new JobStateController(jobInitialState);
