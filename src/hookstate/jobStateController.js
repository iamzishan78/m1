import { hookstate } from '@hookstate/core';
import { copy } from 'components/Shared/functions';
import { hookStateController } from 'hookstate/hookStateController';

const initialState = {
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
};

export const jobState = hookstate(copy(initialState));

const jobStateControllerHandler = () => ({
	toggleBulkUpload: () => {
		jobState.bulkUpload.set(!jobState.bulkUpload.get());
	},
	nextStep: () => {
		jobState.activeStepNumber.set(jobState.activeStepNumber.get() + 1);
	},
	prevStep: () => {
		if (jobState.activeStepNumber.get() === 0) return;

		jobState.activeStepNumber.set(jobState.activeStepNumber.get() - 1);
	},

	onRowAdd: newData => {
		jobState.csvDataToSend.set({
			csvDataToSend: [...jobController.getValue('csvDataToSend'), newData],
		});
	},

	onRowUpdate: (newData, oldData) => {
		if (!oldData) return;

		const csvDataToSend = jobController.getValue('csvDataToSend');
		csvDataToSend[csvDataToSend.indexOf(oldData)] = newData;

		jobState.csvDataToSend.set({
			csvDataToSend,
		});
	},

	onRowDelete: oldData => {
		const csvDataToSend = jobController.getValue('csvDataToSend');

		csvDataToSend.splice(csvDataToSend.indexOf(oldData), 1);

		jobState.csvDataToSend.set({
			csvDataToSend,
		});
	},
});

export const jobController = {
	...jobStateControllerHandler(jobState),
	...hookStateController(jobState, initialState),
};
