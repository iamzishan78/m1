import { hookstate } from '@hookstate/core';
import { copy } from 'components/Shared/functions';
import { hookStateController } from 'hookstate/hookStateController';

const initialState = {

};

export const sideDialogState = hookstate(copy(initialState));

const sideDialogStateControllerHandler = () => ({

});

export const sideDialogController = {
  ...sideDialogStateControllerHandler(sideDialogState),
  ...hookStateController(sideDialogState, initialState),
};
