import React, { useEffect } from 'react';

import MRTTable from 'components/MRTTable';

import { globalStateController } from 'stateManagement/globalStateController';
import { tableController } from 'stateManagement/tableController';

const TableKey = 'AcreageDetailsTable';

const AcreageDetail = () => {
	const { stateValues } = globalStateController.useState(['globalSearch']);

	useEffect(() => {
		tableController(TableKey).setGlobalFilter(stateValues.globalSearch);
	}, [stateValues.globalSearch]);

	return <MRTTable name={TableKey} />;
};

export default AcreageDetail;
