import { StateController } from 'controllers/stateController';

export const metaDataColumnInitialState = {
	tableKey: null,
	metaColumns: [],
};

export const metaDataColumnState = {};

class MetaDataColumnStateController extends StateController {
	constructor(initialState) {
		super(initialState, MetaDataColumnStateController.name);
		this.autoBind(this);
	}

	initialize(tableKey, metaColumns) {
		this.updateState({
			tableKey,
			metaColumns,
		});
	}
}

export const metaDataColumnStateController = TableKey => {
	if (!metaDataColumnState[TableKey]) {
		metaDataColumnState[TableKey] = new MetaDataColumnStateController(metaDataColumnInitialState);
	}
	return metaDataColumnState[TableKey];
};
