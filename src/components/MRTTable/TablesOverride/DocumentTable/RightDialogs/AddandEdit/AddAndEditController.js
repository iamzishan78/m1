import { hookstate, useHookstate } from '@hookstate/core';
import { hookStateController } from 'hookstate/hookStateController';
import { copy } from 'components/Shared/functions';

export const initialState = {
  documentNumber: "",
  documentName: "",
  documentType: "",
  dateTime: null,
  book: "",
  page: "",
  instrument: "",
  custom_data: null,
  fileId: null
}

export const createViewFormState = hookstate({});

export const useCreateViewFormState = () => useHookstate(createViewFormState);

const createViewControllerHandler = state => ({
  initialize: (tableKey, FieldsValue) => {
    state.merge({
      tableKey,
      ...initialState,
      ...FieldsValue
    });
  },

});

export const createViewStateController = TableKey => {
  return {
    ...createViewControllerHandler(createViewFormState[TableKey]),
    ...hookStateController(createViewFormState[TableKey], copy(initialState)),
  }
};
