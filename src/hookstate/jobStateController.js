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
		return new Promise((resolve, reject) => {
			try {
				jobState.csvDataToSend.set(csvDataToSend);
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	},

	onRowUpdate: (newData, oldData) => {
		return new Promise((resolve, reject) => {
			try {
				if (!oldData) throw new Error("Old data not provided");

				const csvDataToSend = jobController.getValue('csvDataToSend');
				const index = csvDataToSend.indexOf(oldData);

				if (index === -1) throw new Error("Old data not found in csvDataToSend");

				delete newData.reason
				delete newData.invalidKey

				csvDataToSend[index] = newData;

				jobState.csvDataToSend.set(csvDataToSend);

				resolve();
			} catch (error) {
				reject(error);
			}
		});
	},


	onRowDelete: oldData => {
		return new Promise((resolve, reject) => {
			try {
				const csvDataToSend = jobController.getValue('csvDataToSend');

				csvDataToSend.splice(csvDataToSend.indexOf(oldData), 1);

				jobState.csvDataToSend.set(csvDataToSend);

				resolve();
			} catch (error) {
				reject(error);
			}
		});
	},
});

export const jobController = {
	...jobStateControllerHandler(jobState),
	...hookStateController(jobState, initialState),
};
