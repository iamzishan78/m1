import { hookstate, useHookstate } from '@hookstate/core';

import { copy } from 'components/Shared/functions';

import { hookStateController } from 'hookstate/hookStateController';

export const initialState = {
	documentNumber: '',
	documentName: '',
	documentType: '',
	dateTime: null,
	book: '',
	page: '',
	instrument: '',
	custom_data: null,
	fileId: null,
	url: null
};

export const createViewFormState = hookstate({});

export const useCreateViewFormState = () => useHookstate(createViewFormState);

const createViewControllerHandler = state => ({
	initialize: (tableKey, FieldsValue) => {
		state.merge({
			tableKey,
			...initialState,
			...FieldsValue,
		});
	},
});

export const createViewStateController = TableKey => {
	return {
		...createViewControllerHandler(createViewFormState[TableKey]),
		...hookStateController(createViewFormState[TableKey], copy(initialState)),
	};
};
