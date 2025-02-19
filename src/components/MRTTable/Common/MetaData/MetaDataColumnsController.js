import { hookstate, useHookstate } from '@hookstate/core';

import { hookStateController } from 'controllers/hookStateController';

export const metaDataColumnState = hookstate({});

export const useMetaColumnsStates = () => useHookstate(metaDataColumnState);

const metaColumnsControllerHandler = state => ({
	initialize: (tableKey, metaColumns) => {
		state.merge({
			tableKey,
			metaColumns,
		});
	},
});

export const metaDataColumnStateController = TableKey => {
	return {
		...metaColumnsControllerHandler(metaDataColumnState[TableKey]),
		...hookStateController(metaDataColumnState[TableKey], {}),
	};
};
